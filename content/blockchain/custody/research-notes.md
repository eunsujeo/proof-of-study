---
title: 수탁형 지갑 리서치 노트
date: 2026-05-06
summary: Fireblocks, BitGo, Circle, Coinbase, Kraken, Ethereum, Tenderly 자료에서 확인한 사실과 설계에 주는 의미를 분리해 정리합니다.
order: 1
---

이 글은 결론 문서가 아닙니다.

수탁형 지갑 인프라를 설계하기 전에 확인한 자료를 모아두는 리서치 노트입니다.

자료는 세 부분으로 나눕니다.

```text
확인한 사실
-> 문서나 공개 자료에서 확인할 수 있는 내용

우리 설계에 주는 의미
-> 그 사실을 우리 시스템 설계에 어떻게 반영할지

아직 검증할 점
-> provider sandbox, testnet, 운영 데이터로 확인해야 하는 부분
```

## Fireblocks

### 확인한 사실

Fireblocks 문서는 대규모 출금 처리에서 여러 withdrawal wallet을 사용할 것을 권장합니다.

특히 EVM 체인은 nonce 때문에 같은 wallet의 트랜잭션이 순차 처리된다는 점을 명시합니다.

Fireblocks는 steady-state 1 TPS 기준으로 EVM/ECDSA 계열에서 withdrawal wallet 5-6개를 권장합니다.

또한 stuck transaction이 생기면 RBF로 boost하거나 drop하는 흐름을 설명합니다.

Gas Station은 EVM 계열에서 vault account에 필요한 base asset을 자동으로 보충하는 기능입니다.

API Co-Signer는 자동 서명과 승인 자동화를 담당하며, 고가용성 구성을 둘 수 있습니다.

`externalTxId`는 같은 트랜잭션을 중복 제출하지 않도록 고객 시스템의 식별자를 연결하는 용도로 제공됩니다.

### 우리 설계에 주는 의미

Fireblocks를 쓰더라도 모든 것이 provider 안에서 해결된다고 보면 안 됩니다.

우리 시스템은 적어도 아래를 직접 설계해야 합니다.

```text
withdrawal wallet pool 개수
wallet routing 기준
idempotency key 관리
internal ledger hold/finalize
webhook 누락 대비 reconciliation
gas funding 상태 관리
stuck transaction 감지와 운영자 알림
```

Fireblocks의 기능명은 일반 개념으로 바꿔 읽습니다.

```text
externalTxId
-> idempotency key

Gas Station
-> gas funding / auto-fueling

Co-Signer
-> automated signer / policy-controlled signer

replace / drop
-> EVM RBF / cancel handling
```

### 아직 검증할 점

Fireblocks를 실제 후보로 둘 경우 Sandbox/Testnet에서 아래를 확인해야 합니다.

```text
동일 externalTxId 재요청 응답
webhook 상태 전이 순서
gas 부족 시 transaction status와 subStatus
replaceTxByHash 사용 가능 조건
Co-Signer callback 지연 시 queue 증가 양상
rate limit과 retry 정책
```

## BitGo

### 확인한 사실

BitGo 문서는 출금 흐름을 initiate, approve, sign, broadcast 단계로 나눕니다.

EVM 기반 자산에는 gas tank 개념이 있으며, ERC-20을 보낼 때도 chain native asset이 gas로 필요하다고 설명합니다.

BitGo의 nonce holes 문서는 nonce가 순차 값이고, gap이 생기면 더 높은 nonce transaction이 막힐 수 있음을 설명합니다.

### 우리 설계에 주는 의미

출금 시스템은 단순히 `send` API를 호출하는 코드가 아닙니다.

아래 단계가 분리되어야 합니다.

```text
요청 생성
정책 승인
서명
broadcast
confirmation 추적
ledger finalize
실패 복구
```

gas funding은 provider별 구현이 달라도 독립된 운영 도메인으로 봐야 합니다.

### 아직 검증할 점

BitGo를 후보로 둘 경우 확인할 점입니다.

```text
custody wallet testnet 제약
gas tank 잔고 조회와 알림 방식
nonce hole 복구 절차의 자동화 가능성
withdrawal request idempotency 지원 방식
```

## Circle

### 확인한 사실

Circle의 Wallet Nonce Management 문서는 EVM wallet nonce가 wallet address별 counter이며, nonce는 순서대로 사용되어야 한다고 설명합니다.

동시에 많은 사용자가 같은 EVM wallet에서 transaction을 만들면 nonce 충돌이나 stuck 문제가 생길 수 있다고 설명합니다.

Circle 문서상 일부 버전에서는 provider가 nonce를 관리해주지만, 그 경우에도 어떤 버전과 제품을 쓰는지에 따라 책임 경계가 달라집니다.

### 우리 설계에 주는 의미

provider가 nonce를 관리해준다고 해도, 우리 시스템은 source wallet별 queue depth와 stuck 상태를 봐야 합니다.

provider-managed nonce와 self-managed nonce는 설계 책임이 다릅니다.

```text
provider-managed nonce
-> provider가 nonce 배정
-> 우리는 routing, idempotency, 상태 추적, ledger를 관리

self-managed nonce
-> 우리가 nonce reservation과 recovery까지 관리
-> source wallet별 nonce allocator가 필요
```

### 아직 검증할 점

Circle 또는 다른 Wallet-as-a-Service 후보를 비교할 때는 아래를 확인합니다.

```text
nonce를 provider가 관리하는가?
동시 transaction 제한이 있는가?
stuck 상태가 API에 어떻게 노출되는가?
idempotency key를 제공하는가?
gas sponsorship 또는 fee payer 구조를 제공하는가?
```

## Coinbase

### 확인한 사실

Coinbase는 Solana 아키텍처 글에서 기존 chain-agnostic 처리 구조가 nonce management와 reorg 대응 같은 공통 제약에 묶여 있었다고 설명합니다.

Solana는 EVM식 nonce가 없고 finality 특성이 다르기 때문에, Coinbase는 전용 병렬 처리 파이프라인을 만들었습니다.

또 Solana sends/receives 회고에서는 30배 트래픽 급증으로 블록 처리와 balance/liquidity 관련 시스템이 지연되었고, 그 결과 send backlog가 커졌다고 설명합니다.

### 우리 설계에 주는 의미

모든 체인을 하나의 공통 파이프라인으로 처리하면 운영은 단순하지만, 체인별 성능과 제약을 제대로 반영하지 못할 수 있습니다.

수탁형 지갑에서는 chain-specific adapter가 필요합니다.

```text
공통 계층
-> ledger, policy, routing, monitoring

체인별 계층
-> nonce, gas, confirmation, reorg/finality, batching
```

### 아직 검증할 점

우리의 1차 범위는 EVM입니다.

하지만 나중에 BTC, Solana, Tron 같은 체인이 들어오면 같은 withdrawal abstraction을 그대로 쓰면 안 될 수 있습니다.

## Kraken

### 확인한 사실

Kraken은 exchange와 wallet service의 차이를 설명하면서, 사용자가 입금한 자산은 cold storage와 hot wallet으로 이동한다고 설명합니다.

출금은 deposit address가 아니라 hot wallet에서 처리되며, 출금 송신 주소는 사용자의 입금 주소와 다를 수 있다고 안내합니다.

새 withdrawal address를 추가하고 확인하는 보안 흐름도 따로 설명합니다.

### 우리 설계에 주는 의미

사용자별 deposit address는 사용자 식별과 입금 감지를 위한 주소입니다.

출금 source wallet은 별도의 운영 지갑으로 보는 것이 자연스럽습니다.

따라서 아래 분리가 필요합니다.

```text
deposit address
-> 입금 감지와 사용자 매핑

omnibus wallet
-> 중앙 보관과 내부 장부 기준 자산 관리

withdrawal wallet
-> 실제 출금 transaction 생성

cold wallet
-> 장기 보관과 리스크 축소
```

### 아직 검증할 점

우리 서비스에서도 외부 출금 주소 등록, 변경, hold 정책을 별도 도메인으로 다뤄야 합니다.

nonce 관리만으로 출금 시스템이 완성되지는 않습니다.

## Ethereum

### 확인한 사실

Ethereum JSON-RPC의 `eth_getTransactionCount`는 주소가 보낸 transaction count를 반환합니다.

block tag로 `latest`, `pending`, `safe`, `finalized` 등을 사용할 수 있습니다.

`pending`은 클라이언트가 보는 pending block/mempool 관점이므로, 모든 node가 항상 같은 pending view를 가진다고 단정하면 안 됩니다.

### 우리 설계에 주는 의미

프로덕션 nonce allocator는 RPC의 `pending` 값만 믿고 hot path에서 nonce를 결정하면 위험합니다.

source wallet별 내부 상태가 필요합니다.

```text
confirmed nonce
pending nonce reservations
broadcasted tx hash
replacement tx hash
stuck age
provider status
chain receipt
```

### 아직 검증할 점

사용할 node provider별 pending transaction visibility, mempool policy, rate limit을 확인해야 합니다.

## Chainstack

### 확인한 사실

Chainstack의 Ethereum nonce management 글은 프로덕션에서 nonce 관리가 왜 필요한지 구체적으로 설명합니다.

핵심은 같은 account에서 낮은 nonce transaction이 stuck 되면 뒤 nonce transaction이 모두 막힌다는 점입니다.

또 `eth_getTransactionCount(address, "pending")`를 hot path에서 호출하는 방식이 node별 pending view 차이와 concurrent worker race 때문에 위험하다고 설명합니다.

Chainstack은 signing account별 local nonce tracker, serialized access, durable storage, stuck transaction detection, same-nonce replacement/cancel, private route, L2 sequencer health를 다룹니다.

### 우리 설계에 주는 의미

이 자료는 `EVM 출금 Nonce 관리` 문서와 직접 연결됩니다.

우리 설계에 반영할 원칙입니다.

```text
pending nonce를 hot path에서 직접 읽지 않는다.
chainId + sourceAddress마다 nonce source of truth를 둔다.
nonce reservation은 durable storage에 남긴다.
가장 오래된 stuck nonce를 먼저 해결한다.
private route와 L2 sequencer는 별도 failure mode로 본다.
```

### 아직 검증할 점

provider-managed nonce 환경에서도 local tracker를 어느 수준까지 둬야 하는지 확인해야 합니다.

자세한 학습은 별도 문서에서 진행합니다.

```text
content/blockchain/custody/research-chainstack-nonce-management.md
```

## Tenderly

### 확인한 사실

Tenderly는 single simulation, bundled simulation, asset changes, gas estimation, state overrides를 제공합니다.

EVM transaction이 특정 상태에서 성공하는지, gas가 얼마나 드는지, balance가 어떻게 변하는지 확인하는 데 유용합니다.

### 우리 설계에 주는 의미

Tenderly는 withdrawal transaction 자체의 실행 가능성을 확인하는 데 쓸 수 있습니다.

하지만 provider의 실제 nonce 배정, signer 승인, webhook status, API timeout 복구는 Tenderly가 재현하지 않습니다.

### 아직 검증할 점

검증은 세 층으로 나눠야 합니다.

```text
로컬 queue 모델
-> routing, pending depth, stuck wallet 영향 확인

EVM transaction 검증
-> transfer 성공/실패, gas, balance 변화 확인

provider sandbox/testnet
-> 실제 API status, signer, webhook, idempotency 확인
```

## 리서치 기준

공개 자료만으로 거래소 내부 구현을 단정하지 않습니다.

특히 Coinbase, Kraken 사례는 내부 nonce allocator 구현이 아니라 공개된 운영 구조의 단서로만 사용합니다.

추가 리서치가 필요한 주제입니다.

```text
provider별 idempotency 지원 비교
provider별 webhook delivery/retry 정책
provider별 rate limit과 queue timeout
multi-region signer 운영 가능성
ledger reconciliation 패턴
chain reorg/finality 기준
Travel Rule / AML hold와 출금 queue의 연결
```

## 참고 자료

- [Fireblocks Developer Docs, Manage Withdrawals at Scale](https://developers.fireblocks.com/docs/manage-withdrawals-at-scale)
- [Fireblocks Developer Docs, Manage Deposits at Scale](https://developers.fireblocks.com/docs/manage-deposits-at-scale)
- [Fireblocks Developer Docs, Work with Gas Station](https://developers.fireblocks.com/docs/work-with-gas-station)
- [Fireblocks Developer Docs, Create a new transaction](https://developers.fireblocks.com/api-reference/transactions/create-a-new-transaction)
- [Fireblocks Developer Docs, API Co-Signers Architecture Overview](https://developers.fireblocks.com/docs/cosigner-architecture-overview)
- [BitGo Developers, Withdraw Overview](https://developers.bitgo.com/docs/withdraw-overview)
- [BitGo Developers, Resolve Nonce Holes](https://developers.bitgo.com/docs/withdraw-nonce-holes)
- [BitGo Developers, Fund Gas Tanks](https://developers.bitgo.com/guides/get-started/gas-tanks)
- [Circle Docs, Wallet Nonce Management](https://developers.circle.com/cpn/concepts/wallet-nonce-management)
- [Chainstack, Ethereum nonce management: preventing stuck transactions](https://chainstack.com/ethereum-nonce-management/)
- [Ethereum Execution APIs, `eth_getTransactionCount`](https://ethereum.github.io/execution-apis/api/methods/eth_getTransactionCount)
- [Coinbase Blog, A Dedicated Architecture for Solana at Coinbase](https://www.coinbase.com/blog/a-dedicated-architecture-for-solana-at-coinbase)
- [Kraken Support, Differences between a crypto exchange and a crypto wallet service](https://support.kraken.com/articles/115006441267-Does-Kraken-provide-a-wallet-service-)
- [Tenderly Docs, Simulation API](https://docs.tenderly.co/simulations/simulation-api)
