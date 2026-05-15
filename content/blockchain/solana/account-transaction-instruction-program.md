---
title: Solana의 Account, Transaction, Instruction, Program
date: 2026-05-13
summary: Solana에서 상태와 실행 요청이 account, transaction, instruction, program으로 어떻게 나뉘는지 정리합니다.
order: 1
---

이더리움에서는 account와 smart contract를 먼저 봤습니다.

Solana를 볼 때는 이름이 조금 달라집니다.

먼저 네 단어를 분리해야 합니다.

```text
account
-> 데이터를 담는 공간

transaction
-> 실행 요청 묶음

instruction
-> 특정 program에 보내는 실행 요청 하나

program
-> instruction을 해석하고 실행하는 코드
```

## account는 상태를 담는다

Solana에서 account는 상태를 저장하는 기본 단위입니다.

공식 문서는 account가 공통 구조를 가진다고 설명합니다.

```text
lamports
-> account가 가진 SOL의 가장 작은 단위

data
-> account에 저장된 바이트 데이터

owner
-> 이 account의 data를 바꿀 수 있는 program

executable
-> 실행 가능한 program account인지 여부

rent_epoch
-> rent 관련 필드
```

여기서 중요한 것은 `owner`입니다.

아무 program이나 account의 data를 마음대로 바꿀 수 없습니다.

account에는 owner program이 있고, 그 program이 account data 변경 권한을 가집니다.

그래서 Solana에서는 상태와 실행 코드가 분리되어 있다고 볼 수 있습니다.

```text
program
-> 실행 규칙

account
-> 실행 결과로 바뀌는 상태
```

## program은 실행 코드다

Solana의 program은 이더리움에서 말하는 smart contract와 비슷한 역할을 합니다.

하지만 처음에는 차이를 크게 잡는 편이 좋습니다.

이더리움 contract는 code와 storage가 같은 contract account에 묶여 있다고 배웠습니다.

Solana program은 실행 코드이고, 바뀌는 상태는 별도 account에 저장됩니다.

```text
Ethereum Contract Account
-> code + storage

Solana Program
-> code

Solana Account
-> state
```

이 비교는 단순화입니다.

하지만 처음 구조를 잡을 때는 도움이 됩니다.

Solana program이 어떤 상태를 읽거나 바꾸려면, transaction이 그 account들을 함께 넘겨야 합니다.

## instruction은 program 호출이다

instruction은 특정 program에 보내는 실행 요청입니다.

공식 문서 기준으로 instruction은 세 부분을 가집니다.

```text
program_id
-> 실행할 program

accounts
-> instruction이 읽거나 쓸 account 목록

data
-> program이 해석할 바이트 데이터
```

`accounts`에는 단순히 주소만 들어가는 것이 아닙니다.

각 account가 signer인지, writable인지 같은 metadata가 함께 들어갑니다.

```text
is_signer
-> 이 account의 서명이 필요한가

is_writable
-> 이 instruction이 이 account를 바꿀 수 있는가
```

이 구조 때문에 transaction을 보기 전에 instruction을 봐야 합니다.

Solana에서 "무엇을 실행하는가"는 instruction이 말해줍니다.

## transaction은 instruction 묶음이다

transaction은 하나 이상의 instruction을 담습니다.

Solana 문서는 transaction이 아래를 포함한다고 설명합니다.

```text
signatures
-> 필요한 서명들

message
-> account 주소, 최근 blockhash, instruction 목록
```

중요한 특징은 atomic execution입니다.

한 transaction 안의 instruction들은 함께 처리됩니다.

중간 instruction이 실패하면 transaction 전체가 실패하고 상태 변경은 되돌아갑니다.

```text
Transaction
├── Instruction 1
├── Instruction 2
└── Instruction 3

하나라도 실패
-> transaction 전체 실패
```

수수료는 실패해도 부과될 수 있습니다.

그래서 Solana transaction을 만들 때는 instruction 순서, 필요한 account, signer, writable 여부를 정확히 구성해야 합니다.

## 왜 account 목록을 미리 넘길까

Solana instruction은 실행할 program뿐 아니라 필요한 account 목록도 함께 제공합니다.

이 점이 이더리움과 다른 감각을 만듭니다.

이더리움에서는 contract가 자기 storage를 중심으로 실행된다고 이해하기 쉽습니다.

Solana에서는 transaction이 "이번 실행에 필요한 account들"을 명시적으로 들고 옵니다.

```text
program
-> 실행 방법을 안다

transaction / instruction
-> 이번 실행에 필요한 account들을 넘긴다

account
-> 읽히거나 바뀌는 상태를 담는다
```

이 구조는 나중에 병렬 실행, account lock, writable account 개념으로 이어집니다.

하지만 지금 단계에서는 아래 정도만 잡으면 됩니다.

```text
Solana program은 상태를 직접 들고 있다고 보기보다
넘겨받은 account들을 읽고 쓰는 실행 코드로 보는 편이 낫다.
```

## 입금 감지와 연결

이 개념은 나중에 입금 감지에서도 중요합니다.

Solana에서 단순히 transaction signature만 보는 것으로는 충분하지 않을 수 있습니다.

어떤 instruction이 실행되었는지, 어떤 account가 바뀌었는지, token account의 balance가 어떻게 변했는지를 봐야 합니다.

수탁형 지갑에서 Solana를 지원하려면 EVM nonce lane을 그대로 가져오면 안 됩니다.

대신 Solana의 transaction, account, token account, confirmation 모델에 맞춰 watcher를 설계해야 합니다.

## 정리

이번 글의 핵심은 아래입니다.

```text
account
-> 상태를 담는 단위

program
-> 실행 코드

instruction
-> 특정 program에 보내는 실행 요청

transaction
-> instruction과 signature를 묶어 네트워크에 보내는 단위
```

Solana를 이해할 때는 "contract가 상태를 가진다"보다 "program이 account들을 받아 실행한다"는 쪽에서 시작하는 것이 좋습니다.

## 참고 자료

- [Solana Docs, Core Concepts](https://solana.com/docs/core)
- [Solana Docs, Account Structure](https://solana.com/docs/core/accounts/account-structure)
- [Solana Docs, Transactions](https://solana.com/docs/core/transactions)
- [Solana Docs, Transaction Structure](https://solana.com/docs/core/transactions/transaction-structure)
- [Solana Docs, Instructions](https://solana.com/docs/core/instructions)
- [Solana Docs, Instruction Structure](https://solana.com/docs/core/instructions/instruction-structure)
