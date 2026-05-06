---
title: 프로덕션 인프라 체크리스트
date: 2026-05-06
summary: 수탁형 지갑을 프로덕션에서 운영하기 위해 필요한 signer, node, ledger, watcher, monitoring, runbook 기준을 정리합니다.
order: 8
---

이 글은 최종 설계안이 아닙니다.

프로덕션 인프라를 설계할 때 빠뜨리면 안 되는 항목을 정리하는 체크리스트입니다.

수탁형 지갑의 최종 목적은 단순히 transaction을 보내는 것이 아닙니다.

```text
자산을 잃지 않는다.
사용자 잔고를 틀리지 않는다.
출금 병목을 예측하고 줄인다.
장애가 나도 복구 경로가 있다.
provider가 바뀌어도 핵심 설계가 유지된다.
```

## 1. Signer / Provider 고가용성

signer는 자산 이동 권한을 가진 가장 민감한 계층입니다.

provider를 쓰면 provider API와 signer 구성에 의존합니다.

자체 signer를 쓰면 우리가 더 많은 운영 책임을 집니다.

확인할 항목입니다.

```text
provider API 장애 시 출금 queue가 어떻게 되는가?
signer가 단일 장애점인가?
multi-region signer 구성이 가능한가?
서명 정책 변경은 누가 승인하는가?
callback handler가 느리면 queue가 쌓이는가?
signer machine 보안 기준은 무엇인가?
정책 엔진과 signer가 분리되어 있는가?
```

Fireblocks를 후보로 보면 Co-Signer HA, callback handler, policy rule, monitoring 항목을 확인해야 합니다.

자체 signer라면 HSM/MPC/KMS 선택, key ceremony, backup, disaster recovery까지 별도 설계해야 합니다.

## 2. Node / RPC Provider 이중화

chain watcher와 broadcaster는 node/RPC에 의존합니다.

한 provider의 RPC 응답만 믿으면 위험합니다.

```text
Primary RPC Provider
        |
        +--> block read
        +--> receipt read
        +--> broadcast

Secondary RPC Provider
        |
        +--> receipt verification
        +--> fallback broadcast
        +--> discrepancy check

Archive / Indexer
        |
        +--> reconciliation
        +--> historical backfill
```

확인할 항목입니다.

```text
pending transaction visibility가 provider마다 다른가?
eth_getTransactionCount pending 값이 일관적인가?
broadcast 중복 제출이 안전한가?
rate limit이 출금 피크를 버티는가?
receipt 조회 지연이 어느 정도인가?
reorg/finality 정보를 어떻게 반영하는가?
```

## 3. Ledger 정합성

ledger는 사용자 잔고의 기준입니다.

on-chain balance는 내부 사용자별 잔고를 대신하지 못합니다.

필수 기준입니다.

```text
모든 입금 credit은 unique event key를 가진다.
모든 출금은 hold 후 진행한다.
hold 없이 on-chain transaction을 보내지 않는다.
provider timeout 상태에서는 hold를 임의 해제하지 않는다.
replacement/drop은 원 출금 요청과 연결한다.
fee 처리 정책을 명시한다.
ledger entry는 감사 가능해야 한다.
```

권장 상태 분리입니다.

```text
available
held
pending_settlement
settled
reversed
manual_review
```

## 4. Withdrawal Wallet Pool 운영

출금 처리량은 wallet lane 수와 직접 연결됩니다.

Fireblocks 문서는 EVM/ECDSA 계열 steady-state 1 TPS에 5-6 withdrawal wallet을 권장합니다.

이 숫자는 그대로 복사할 최종값이 아니라 초기 검토 기준입니다.

우리 시스템에서는 시뮬레이션과 실제 트래픽으로 조정해야 합니다.

확인할 항목입니다.

```text
chain별 최소 withdrawal wallet 수
wallet별 최대 pending depth
wallet별 최소 token float
wallet별 최소 gas float
stuck 판단 시간
oldest pending age alert
router가 paused wallet을 제외하는가?
```

## 5. Gas / Liquidity 운영

EVM token 출금에는 native gas token이 필요합니다.

출금 자산과 gas 자산은 별도로 관리합니다.

```text
Token Liquidity
Omnibus Wallet
        |
        v
Withdrawal Wallet Pool

Gas Liquidity
Treasury Gas Wallet or Provider Gas Funding
        |
        v
Withdrawal Wallet Pool
```

확인할 항목입니다.

```text
chain별 gas coverage time
gas funding 실패 알림
token float 부족 알림
rebalancing transaction 상태 추적
omnibus -> withdrawal 이동 정책
withdrawal -> omnibus 회수 정책
omnibus -> cold 이동 정책
```

gas 부족은 최종 실패가 아니라 운영 대기 상태로 분리합니다.

```text
WAITING_FOR_GAS
WAITING_FOR_TOKEN_LIQUIDITY
WAITING_FOR_REBALANCE
```

## 6. Watcher와 Reconciliation

webhook은 편리하지만 단일 진실 공급원이 아닙니다.

watcher와 reconciliation이 별도로 있어야 합니다.

```text
Provider Webhook
        |
        v
Event Store
        |
        v
State Machine

Chain Watcher
        |
        v
Receipt / Balance / Block Scan
        |
        v
Reconciliation Job
```

확인할 항목입니다.

```text
webhook 누락 감지
webhook 중복 수신 처리
provider status와 chain receipt 불일치 감지
ledger와 on-chain balance 차이 감지
deposit backfill 가능 여부
withdrawal tx hash 없는 상태의 복구 절차
```

## 7. Monitoring

단순 성공/실패 수만 보면 늦습니다.

운영 지표는 병목의 조짐을 보여야 합니다.

필수 지표입니다.

```text
chain별 pending withdrawals
wallet별 pending depth
wallet별 oldest pending age
wallet별 oldest pending nonce
provider API latency
provider error rate
signer queue length
webhook delay
receipt confirmation delay
gas balance
token float
reconciliation mismatch count
manual review count
L2 sequencer health
```

알림 예시입니다.

```text
oldest pending age > 10분
wallet pending depth > threshold
signer queue age > threshold
gas coverage < 30분
provider timeout rate > threshold
webhook delay > threshold
ledger/on-chain mismatch detected
```

## 8. Runbook

장애 상황마다 운영자가 할 일이 달라야 합니다.

runbook이 필요한 상황입니다.

```text
provider API timeout
provider webhook missing
signer queue 증가
wallet lane stuck
gas shortage
token liquidity shortage
chain reorg
RPC provider 장애
duplicate withdrawal suspicion
ledger mismatch
```

예시입니다.

```text
wallet lane stuck
        |
        v
낮은 nonce transaction 확인
        |
        +--> fee 문제: RBF / boost
        +--> 취소 필요: drop / cancel
        +--> provider 상태 불명: provider support / secondary RPC 확인
        |
        v
replacement 결과 확인
        |
        v
lane resume or manual review
```

## 9. Provider 비교표 준비

최종 provider를 정하려면 기능 비교표가 필요합니다.

비교 축입니다.

```text
nonce management 책임
idempotency key 지원
webhook delivery/retry
transaction status detail
RBF/drop 지원
gas funding 지원
wallet pool 운영 편의성
signer HA 구성
policy engine 기능
sandbox/testnet 품질
rate limit
audit log
support / incident 대응
```

이 비교표는 리서치가 진행되면서 별도 문서로 확장할 수 있습니다.

## 10. 아직 결정하지 않은 것

지금 단계에서 결정하지 않습니다.

```text
최종 provider
withdrawal wallet 개수
gas threshold 값
confirmation 수
stuck 판단 시간
RBF 자동화 여부
multi-region active-active 여부
self-managed signer 여부
```

이 값은 리서치와 시뮬레이션 후 결정합니다.

## 다음 단계

다음 작업은 시뮬레이션입니다.

먼저 작은 로컬 모델로 아래를 비교합니다.

```text
1 wallet vs 5 wallets vs 10 wallets
stuck rate 0% vs 1% vs 5%
confirmation 15초 vs 60초 vs 300초
gas shortage 0% vs 2%
provider timeout 0% vs 1%
```

그 다음 provider sandbox/testnet에서 실제 API 상태 전이를 확인합니다.

## 참고 자료

- Fireblocks Developer Docs, Manage Withdrawals at Scale
- Fireblocks Developer Docs, API Co-Signers Architecture Overview
- Fireblocks Developer Docs, Multiple Co-signers High Availability
- BitGo Developers, Withdraw Overview
- BitGo Developers, Fund Gas Tanks
- Circle Docs, Wallet Nonce Management
- Ethereum Execution APIs, `eth_getTransactionCount`
