---
title: Solana Transaction 구조와 Signature
date: 2026-05-14
summary: Solana transaction이 signatures와 message로 어떻게 나뉘는지, message 안에 account keys, recent blockhash, instructions가 어떻게 배치되는지 정리합니다.
order: 2
---

이전 글에서 transaction은 instruction과 signature를 묶어 네트워크에 보내는 단위라고 했습니다.

이번 글은 그 transaction 구조를 한 단계 더 들여다봅니다.

이더리움 transaction과 같은 단어를 쓰지만 구조는 꽤 다릅니다.

이 차이를 모르고 EVM 감각으로 접근하면 fee payer, signer, writable account를 잘못 잡기 쉽습니다.

## 두 부분으로 본다

Solana transaction은 크게 두 부분으로 나뉩니다.

```text
signatures
-> 이 transaction을 승인하는 서명들

message
-> 무엇을 실행하라는지에 대한 본문
```

signature는 message에 대한 서명입니다.

다시 말해 서명자는 message 바이트열에 서명합니다.

따라서 message 한 글자라도 바뀌면 모든 signature가 무효가 됩니다.

```text
sign(private_key, message_bytes) = signature
```

서명 알고리즘은 ed25519입니다.

이더리움이 secp256k1을 쓰는 것과 다릅니다.

지갑 키 생성과 서명 라이브러리를 EVM과 그대로 공유할 수 없는 이유 중 하나입니다.

## message는 무엇을 담는가

message는 transaction의 본문입니다.

Solana 공식 문서 기준으로 아래 네 부분을 담습니다.

```text
header
-> 서명자 수와 readonly account 수

account_keys
-> 이 transaction이 참조하는 모든 account 주소 목록

recent_blockhash
-> 최근 blockhash 하나

instructions
-> 실행할 instruction 목록
```

이 네 부분이 합쳐져 message 바이트열을 만들고, 그 바이트열이 서명 대상이 됩니다.

각 부분을 따로 봅니다.

## account_keys는 한 자리에 모은다

이더리움 transaction은 보통 `to` 주소 하나를 가집니다.

Solana transaction은 다릅니다.

한 transaction이 여러 account를 동시에 읽고 쓰기 때문에, 참조하는 account를 한 자리에 모아 둡니다.

```text
account_keys = [pubkey0, pubkey1, pubkey2, ...]
```

instruction은 이 배열을 직접 들고 다니지 않습니다.

대신 인덱스 번호로 참조합니다.

```text
instruction.accounts = [0, 2, 5]
-> account_keys[0], [2], [5]를 사용한다는 뜻
```

같은 account가 여러 instruction에 등장해도 account_keys에는 한 번만 들어갑니다.

이 구조 덕분에 같은 transaction 안에서 어떤 account가 한 번이라도 writable로 잡히는지를 빠르게 확인할 수 있습니다.

## 순서가 의미를 가진다

account_keys 배열은 순서가 중요합니다.

Solana 문서는 정해진 순서를 따른다고 설명합니다.

```text
[0]                    fee payer
[0..S)                 signer 이면서 writable
[S..S+SR)              signer 이면서 readonly
[S+SR..S+SR+W)         signer 아님, writable
나머지                  signer 아님, readonly
```

각 구간의 크기는 message header가 정합니다.

```text
num_required_signatures
-> 앞에서 몇 개가 signer인지

num_readonly_signed_accounts
-> 그중 readonly가 몇 개인지

num_readonly_unsigned_accounts
-> 비서명자 중 readonly가 몇 개인지
```

이 세 숫자만으로 배열 전체의 signer / writable / readonly가 결정됩니다.

따라서 message만 보면 어떤 account가 어느 권한을 갖는지 알 수 있습니다.

## fee payer는 첫 번째 account다

account_keys 배열의 첫 번째 항목은 fee payer입니다.

이 점이 EVM과 다릅니다.

```text
EVM
-> from 계정이 transaction을 보낸다
-> from 계정이 gas를 낸다

Solana
-> 여러 signer가 있을 수 있다
-> 그중 account_keys[0]이 fee를 낸다
```

fee payer는 signer 중에서 가장 앞에 와야 합니다.

따라서 fee payer가 서명하지 않은 transaction은 만들 수 없습니다.

서비스에서 사용자 대신 수수료를 내려면, 우리 wallet을 account_keys[0]에 두고 우리도 함께 서명해야 합니다.

## recent_blockhash는 시간을 결정한다

message에는 최근 blockhash 하나가 들어갑니다.

이더리움처럼 nonce 숫자가 들어가지 않습니다.

```text
EVM
-> nonce 정수, 순서 보장

Solana
-> recent_blockhash, 만료 보장
```

blockhash는 두 가지 역할을 합니다.

```text
expiration
-> 이 blockhash가 너무 오래되면 transaction은 거절됨

duplicate 방지
-> 같은 message + 같은 blockhash 조합은 한 번만 처리됨
```

만료 시간은 슬롯 단위로 정해집니다.

정확한 슬롯 수는 공식 문서를 따릅니다.

운영 관점에서 기억할 점은 두 가지입니다.

```text
오래 보관해 둔 서명된 transaction은 만료될 수 있다.
같은 message를 두 번 broadcast해도 두 번 처리되지 않는다.
```

EVM의 nonce 관리와 다른 점은 같은 wallet에서 동시에 여러 transaction을 만들 때 순서 제약이 약하다는 것입니다.

대신 만료를 신경 써야 합니다.

## instructions는 인덱스로 program과 account를 가리킨다

message 안의 instruction은 가벼운 형태로 들어 있습니다.

```text
program_id_index
-> account_keys에서 program account의 위치

accounts
-> account_keys에서 사용할 account 인덱스들

data
-> program이 해석할 바이트
```

instruction 자체에는 주소가 직접 들어가지 않습니다.

모든 주소는 account_keys 한 자리에 모이고, instruction은 그 자리의 인덱스를 가리킬 뿐입니다.

같은 program을 여러 번 호출해도 program 주소는 account_keys에 한 번만 들어갑니다.

## signatures 배열은 account_keys와 정렬된다

transaction의 signatures 배열은 message 앞에 붙습니다.

```text
[sig0, sig1, ..., sig_{S-1}, message_bytes]
```

여기서 `S = num_required_signatures`입니다.

signatures 배열의 순서는 account_keys 배열의 앞쪽 signer 순서와 같습니다.

```text
signatures[0] = sign(account_keys[0])
signatures[1] = sign(account_keys[1])
...
```

따라서 누가 서명했는지는 message 안에 별도로 적지 않습니다.

account_keys 배열의 앞쪽 signer 자리 그 자체가 서명자 신원이고, signatures 배열은 그 자리에 대응되는 서명입니다.

## versioned transaction 한 줄

이 글의 구조는 legacy transaction 기준입니다.

Solana는 versioned transaction(v0)도 지원합니다.

핵심 차이만 한 줄로 적습니다.

```text
v0
-> Address Lookup Table을 참조해서
   account_keys 배열을 짧게 만들 수 있다.
```

자세한 내용은 다음 글로 미룹니다.

지금은 "transaction이 더 많은 account를 참조해야 할 때 쓰는 확장"이라는 정도만 기억하면 됩니다.

## 운영 관점 정리

수탁형 지갑이나 입출금 감지 관점에서 이번 글의 의미는 아래입니다.

```text
같은 transaction이 여러 account를 동시에 바꿀 수 있다.
어떤 account가 writable인지는 message header와 account_keys 순서로 결정된다.
fee payer는 항상 account_keys[0]이다.
nonce 대신 recent_blockhash가 만료를 결정한다.
같은 message는 한 번만 처리된다.
```

EVM에서 가져온 감각으로 Solana watcher나 signer를 만들면, signer 자리와 writable 자리를 잘못 잡거나 nonce 기반 retry 패턴을 그대로 옮기기 쉽습니다.

다음 글에서는 account ownership과 writable account를 더 자세히 봅니다.

writable이라는 단어가 "수정 가능"이 아니라 "이 transaction이 잠금을 가져간다"는 의미에 가까운 이유를 함께 정리합니다.

## 참고 자료

- [Solana Docs, Transactions](https://solana.com/docs/core/transactions)
- [Solana Docs, Transaction Structure](https://solana.com/docs/core/transactions/transaction-structure)
- [Solana Docs, Fees on Solana](https://solana.com/docs/core/fees)
- [Solana Docs, Instructions](https://solana.com/docs/core/instructions)
- [Solana Docs, Instruction Structure](https://solana.com/docs/core/instructions/instruction-structure)
- [Solana Docs, Versioned Transactions](https://solana.com/docs/advanced/versions)
