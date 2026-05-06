---
title: 수탁형 지갑 전체 아키텍처
date: 2026-05-06
summary: 프로덕션 수탁형 지갑에서 deposit address, ledger, omnibus, withdrawal wallet pool, cold wallet, signer, watcher가 어떻게 역할을 나누는지 정리합니다.
order: 2
---

수탁형 지갑 설계의 핵심은 private key만 안전하게 보관하는 것이 아닙니다.

프로덕션에서는 아래 문제가 동시에 얽힙니다.

```text
사용자별 입금 식별
내부 ledger 정합성
hot / omnibus / cold wallet 분리
출금 처리량
EVM nonce 병목
gas token 재고
서명 권한과 승인 정책
chain watcher와 reconciliation
운영 장애 복구
```

이 글은 전체 컴포넌트를 먼저 잡습니다.

## 기준 구조

```text
                        +----------------------+
                        |      Admin / Ops     |
                        | limits, policy, runbook
                        +----------+-----------+
                                   |
                                   v
+-------------+     +--------------+---------------+
| User / App  | --> |      Wallet Backend          |
+-------------+     | request API, risk, routing   |
                    +------+----------+------------+
                           |          |
                           v          v
                    +------+--+   +---+----------------+
                    | Ledger  |   | Policy / Risk      |
                    | double  |   | address, AML, hold |
                    | entry   |   +--------------------+
                    +----+----+
                         |
      +------------------+------------------+
      |                                     |
      v                                     v
+-----+----------------+          +---------+----------+
| Chain Watcher        |          | Withdrawal Router  |
| deposits, receipts   |          | wallet selection   |
+-----+----------------+          +---------+----------+
      |                                     |
      v                                     v
+-----+----------------+          +---------+----------+
| Deposit Addresses    |          | Withdrawal Wallet  |
| user mapping         |          | Pool / Nonce Lanes |
+-----+----------------+          +---------+----------+
      |                                     |
      v                                     v
+-----+----------------+          +---------+----------+
| Sweep Worker         |          | Signer / Provider  |
| to omnibus           |          | MPC/HSM/API        |
+-----+----------------+          +---------+----------+
      |                                     |
      v                                     v
+-----+----------------+          +---------+----------+
| Omnibus Wallet       | <------> | Blockchain Network |
| central liquidity    |          | mempool, blocks    |
+-----+----------------+          +---------+----------+
      |
      v
+-----+----------------+
| Cold Wallet          |
| long-term storage    |
+----------------------+
```

이 구조에서 blockchain은 외부 시스템입니다.

우리 시스템은 blockchain에 기록된 사실과 내부 ledger를 계속 맞춰야 합니다.

## 컴포넌트 역할

### Wallet Backend

사용자 API 요청을 받는 계층입니다.

출금 요청이 들어오면 바로 transaction을 보내지 않습니다.

먼저 내부 조건을 확인합니다.

```text
사용자 잔고
출금 주소 등록 여부
위험 점수
일/건별 한도
AML / Travel Rule hold
chain별 출금 가능 상태
provider 장애 상태
```

이 계층은 빠르게 응답해야 하지만, 자산 이동을 단독으로 확정하면 안 됩니다.

자산 상태의 기준은 ledger입니다.

### Ledger

수탁형 지갑의 핵심은 ledger입니다.

blockchain 잔고만으로는 사용자별 잔고를 알 수 없습니다.

omnibus 구조에서는 여러 사용자의 자산이 같은 on-chain wallet에 들어갈 수 있습니다.

그래서 내부 ledger가 필요합니다.

```text
사용자 A
USDC +100

사용자 B
USDC +50

omnibus wallet on-chain balance
USDC 150
```

ledger는 적어도 아래 상태를 구분해야 합니다.

```text
available
-> 사용자가 출금 가능한 잔고

held
-> 출금 요청으로 잠긴 잔고

settled
-> on-chain confirmation 후 확정된 잔고

reversed
-> 실패나 정책 거절로 되돌린 잔고
```

### Chain Watcher

chain watcher는 blockchain에서 우리 주소와 관련된 transaction을 찾습니다.

역할은 두 가지입니다.

```text
입금 감지
-> deposit address로 들어온 transaction 확인

출금 상태 확인
-> 우리가 보낸 transaction receipt와 confirmation 확인
```

provider webhook만 믿으면 안 됩니다.

webhook은 누락되거나 지연될 수 있습니다.

따라서 watcher는 reconciliation의 기준이 됩니다.

### Deposit Address

deposit address는 사용자가 외부 지갑에서 우리 서비스로 입금하는 주소입니다.

역할은 사용자 식별입니다.

```text
deposit address
-> userId / asset / chain 매핑
```

입금 주소가 출금 송신 주소가 될 필요는 없습니다.

Kraken 공개 문서도 출금은 deposit address가 아니라 hot wallet이 처리한다고 설명합니다.

### Sweep Worker

sweep은 deposit address에 들어온 자산을 omnibus 또는 운영 wallet으로 모으는 작업입니다.

EVM 토큰 sweep에는 gas가 필요합니다.

따라서 sweep 설계는 gas funding과 연결됩니다.

```text
ERC-20 deposit address
-> token balance 있음
-> native gas token 없음
-> gas funding 필요
-> sweep transaction 가능
```

### Omnibus Wallet

omnibus wallet은 여러 사용자의 자산을 중앙에서 보관하는 wallet입니다.

장점은 운영이 단순해지고 유동성을 한 곳에서 관리하기 쉽다는 점입니다.

단점은 내부 ledger 정합성이 더 중요해지고, wallet compromise blast radius가 커질 수 있다는 점입니다.

omnibus wallet은 모든 출금을 직접 처리하는 지갑이 아닐 수 있습니다.

출금 처리량을 위해 withdrawal wallet pool을 따로 둡니다.

### Withdrawal Wallet Pool

withdrawal wallet pool은 실제 출금 transaction을 보내는 hot wallet 묶음입니다.

EVM에서 각 wallet은 자기 nonce lane을 가집니다.

```text
Withdrawal Wallet A
-> nonce 10, 11, 12

Withdrawal Wallet B
-> nonce 30, 31, 32

Withdrawal Wallet C
-> nonce 7, 8, 9
```

여러 wallet을 두면 nonce lane이 늘어납니다.

출금 병렬성은 여기서 생깁니다.

### Signer / Provider

signer는 transaction에 서명하는 계층입니다.

구현 후보는 여러 가지입니다.

```text
Fireblocks
-> provider API + policy + Co-Signer

BitGo
-> custody/MPC/HSM 기반 흐름

Circle
-> Wallet API / signing API

자체 구축
-> HSM, MPC, KMS, offline approval 조합
```

중요한 것은 provider 선택 전에도 공통 인터페이스를 생각해야 한다는 점입니다.

```text
create transaction
approve / reject
sign
broadcast
get status
replace / speed up
cancel / drop
webhook
```

### Cold Wallet

cold wallet은 장기 보관용입니다.

프로덕션에서는 hot wallet에 모든 자산을 두지 않습니다.

withdrawal wallet pool에는 운영 float만 둡니다.

나머지는 omnibus와 cold wallet 사이에서 정책적으로 이동합니다.

## 설계 원칙

1차 설계 원칙입니다.

```text
ledger가 사용자 잔고의 기준이다.
deposit address와 withdrawal source를 분리한다.
withdrawal wallet은 chainId + sourceAddress 단위 nonce lane으로 관리한다.
provider 기능명에 종속되지 않고 일반 개념으로 설계한다.
webhook은 이벤트 소스이고, reconciliation은 별도로 둔다.
gas token은 출금 자산과 별도 재고로 관리한다.
hot wallet에는 운영 float만 둔다.
```

## provider 중립 용어

문서 전체에서 아래 용어를 우선 사용합니다.

```text
custody provider
-> Fireblocks, BitGo, Circle 같은 외부 지갑/서명 인프라 후보

signer
-> provider signer, MPC signer, HSM signer, 자체 signer를 포함

idempotency key
-> 같은 출금 요청이 중복 transaction으로 나가지 않게 하는 키

gas funding
-> native gas token을 출금/sweep wallet에 보충하는 기능

wallet lane
-> chainId + sourceAddress 단위의 순차 처리 흐름
```

Fireblocks 용어를 쓰는 경우에는 일반 개념과 같이 적습니다.

```text
externalTxId
-> idempotency key

Gas Station
-> gas funding

Co-Signer
-> automated signer
```

## 아직 설계하지 않은 것

이 글은 전체 구조입니다.

아래는 별도 글에서 다룹니다.

```text
입금 감지와 sweep
출금 상태 전이
EVM nonce allocator
gas와 liquidity threshold
provider별 기능 비교
장애 시뮬레이션
프로덕션 인프라 체크리스트
```

## 참고 자료

- Kraken Support, Differences between a crypto exchange and a crypto wallet service
- Fireblocks Developer Docs, Manage Deposits at Scale
- Fireblocks Developer Docs, Manage Withdrawals at Scale
- BitGo Developers, Withdraw Overview
- Circle Docs, Wallet Nonce Management
