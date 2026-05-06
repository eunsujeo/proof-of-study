---
title: 출금 Nonce 시뮬레이션 계획
date: 2026-05-06
summary: withdrawal wallet pool 설계가 동시 출금, stuck transaction, gas 부족 상황에서 어떻게 움직이는지 검증할 시나리오를 정리합니다.
order: 7
---

이번 글은 구현 코드가 아닙니다.

출금 nonce 설계가 맞는지 검증하기 위한 시뮬레이션 계획입니다.

목표는 실제 돈이 움직이기 전에 병목과 장애 상황을 미리 보는 것입니다.

## 무엇을 검증할까

검증하고 싶은 질문은 아래와 같습니다.

```text
withdrawal wallet을 여러 개 두면 처리량이 실제로 늘어나는가?
한 wallet의 낮은 nonce가 stuck 되면 전체 출금이 멈추는가?
특정 체인의 gas token이 부족하면 다른 체인도 영향을 받는가?
provider API timeout이 중복 출금으로 이어지지 않는가?
```

이 질문은 단일 API 호출 테스트로 확인하기 어렵습니다.

상태가 시간에 따라 변하기 때문입니다.

## 1단계: 로컬 모델 시뮬레이션

처음부터 custody provider Sandbox를 붙이지 않아도 됩니다.

먼저 로컬 모델로 출금 큐와 wallet lane을 시뮬레이션합니다.

입력값은 아래와 같습니다.

```text
walletCount
-> withdrawal wallet 개수

requestTps
-> 초당 출금 요청 수

providerApiLatencyMs
-> provider transaction 생성 응답 지연

confirmationTimeSec
-> 평균 confirmation 시간

stuckRate
-> stuck transaction 발생 비율

gasShortageRate
-> gas 부족 발생 비율

rebalanceLatencySec
-> 리밸런싱 완료까지 걸리는 시간
```

출력값은 아래와 같습니다.

```text
averageWaitTime
p95WaitTime
p99WaitTime
wallet별 pendingDepth
stuck wallet 수
WAITING_FOR_GAS 요청 수
retry 횟수
중복 요청 차단 횟수
```

핵심은 정확한 블록체인 에뮬레이터를 만드는 것이 아닙니다.

운영 큐가 어떤 조건에서 밀리는지 보는 것입니다.

## 시뮬레이션 모델

간단한 모델은 이렇게 볼 수 있습니다.

```text
WithdrawalRequest
-> 사용자 출금 요청

Router
-> 사용할 wallet 선택

WalletLane
-> chainId + sourceAddress 단위 queue

ProviderMock
-> transaction 생성, status 변화 흉내

ChainMock
-> confirmation, stuck, gas shortage 이벤트 흉내
```

WalletLane 안에서는 한 번에 하나씩 처리합니다.

여러 WalletLane은 동시에 처리됩니다.

```text
Wallet A lane: W1 -> W4 -> W7
Wallet B lane: W2 -> W5 -> W8
Wallet C lane: W3 -> W6 -> W9
```

이 구조로 단일 wallet과 여러 wallet을 비교합니다.

## 2단계: provider Sandbox/Testnet 검증

로컬 모델은 우리 라우팅 설계를 검증합니다.

하지만 custody provider의 실제 transaction 상태 변화와 nonce 배정 방식은 로컬 모델로 단정할 수 없습니다.

따라서 Sandbox 또는 Testnet 검증이 필요합니다.

Fireblocks를 사용한다면 workspace가 Sandbox, Testnet, Mainnet으로 나뉘며, Testnet workspace에서 API와 webhook 흐름을 검증할 수 있습니다.

다른 provider를 사용한다면 그 provider의 sandbox, testnet, webhook, idempotency 지원 방식을 확인해야 합니다.

검증 항목은 아래와 같습니다.

```text
idempotency key 중복 요청이 어떻게 처리되는가?
transaction status가 어떤 순서로 변하는가?
webhook 누락 또는 지연이 있을 때 API 조회로 복구 가능한가?
insufficient balance 상태가 어떻게 노출되는가?
gas 부족 상태를 어떤 에러 또는 상태로 받는가?
```

여기서 중요한 점은 실제 mainnet 동작과 testnet 동작이 완전히 같다고 가정하지 않는 것입니다.

보안 정책, rate limit, signer 구성은 workspace 유형에 따라 달라질 수 있습니다.

## 3단계: EVM transaction simulation

트랜잭션 자체가 성공할지, gas가 얼마나 들지, 토큰 balance가 어떻게 변할지는 EVM simulator로 검토할 수 있습니다.

Tenderly는 Simulation API, bundled simulation, gas estimation, state override 같은 기능을 제공합니다.

이 방식으로 확인할 수 있는 것은 아래입니다.

```text
ERC-20 transfer가 성공하는가?
토큰 balance 변화가 예상과 맞는가?
gas 사용량이 어느 정도인가?
특정 balance나 allowance 상태에서 실패하는가?
```

하지만 Tenderly 같은 simulator가 모든 것을 대신하지는 못합니다.

아래는 provider Testnet 또는 실제 provider sandbox에서 봐야 합니다.

```text
provider가 wallet transaction을 어떤 상태로 관리하는가?
provider가 실제 nonce를 어떻게 배정하는가?
signer 정책과 approval이 어떻게 적용되는가?
RBF/drop 기능이 운영 상태와 어떻게 연결되는가?
```

## 장애 시나리오

### 1. 단일 wallet에 동시 출금 100건

목표는 단일 nonce lane의 한계를 보는 것입니다.

예상 결과는 아래입니다.

```text
walletCount = 1
requestCount = 100

결과:
pendingDepth 빠르게 증가
p95/p99 wait time 증가
낮은 nonce stuck 시 전체 요청 영향
```

### 2. wallet 10개로 출금 100건

목표는 wallet pool 분산 효과를 보는 것입니다.

```text
walletCount = 10
requestCount = 100

결과:
wallet별 pendingDepth 분산
평균 대기 시간 감소
특정 wallet stuck이 전체 장애로 번지지 않음
```

### 3. 낮은 nonce stuck

한 wallet에서 낮은 nonce transaction이 stuck 됩니다.

```text
Wallet A
nonce 10 stuck
nonce 11 waiting
nonce 12 waiting

Wallet B
정상 처리

Wallet C
정상 처리
```

성공 기준은 이렇습니다.

```text
Wallet A lane만 PAUSED/STUCK
Wallet B, C는 계속 출금 처리
Router는 Wallet A를 새 요청 대상에서 제외
```

### 4. 특정 체인의 gas 부족

Ethereum withdrawal pool의 ETH gas가 부족하다고 가정합니다.

```text
Ethereum / USDC
-> WAITING_FOR_GAS

Polygon / USDC
-> READY

Base / USDC
-> READY
```

성공 기준은 이렇습니다.

```text
Ethereum 출금만 대기
다른 체인 출금은 계속 처리
gas 보충 후 Ethereum 출금 재개
```

### 5. provider API timeout

provider transaction 생성 요청 후 응답을 받기 전에 timeout이 납니다.

```text
requestId = wd_1001
idempotencyKey = wd_1001

createTransaction 요청
-> timeout
-> idempotencyKey로 조회
-> 있으면 기존 transaction 추적
-> 없으면 같은 idempotencyKey로 재시도
```

성공 기준은 하나입니다.

```text
사용자 출금 요청 하나가 on-chain transaction 두 개로 나가면 안 된다.
```

### 6. RBF 또는 drop 이후 복구

낮은 fee로 stuck 된 transaction을 replace합니다.

```text
original tx
nonce 40
pending

replacement tx
nonce 40
higher fee
```

성공 기준은 아래입니다.

```text
내부 출금 요청은 replacement txHash와 연결됨
원래 txHash와 replacement txHash 모두 추적 가능
ledger hold가 중복 해제되지 않음
wallet lane이 RECOVERED 후 재개됨
```

## 시뮬레이션 이후 결정할 값

시뮬레이션을 하면 아래 값을 정할 수 있습니다.

```text
체인별 withdrawal wallet 최소 개수
wallet별 최대 pending depth
stuck 판단 시간
gas threshold
token float threshold
rebalance trigger
RBF 시도 조건
운영자 알림 기준
```

이 값들은 처음부터 정확히 알 수 없습니다.

부하와 장애 상황을 넣어보면서 보수적으로 잡아야 합니다.

## 참고 자료

- Fireblocks Developer Docs, Workspace Comparison
- Fireblocks Developer Docs, Create a new transaction
- Fireblocks Developer Docs, Boost Transactions
- Fireblocks Developer Docs, Work with Gas Station
- Ethereum.org, JSON-RPC API
- Tenderly Documentation, Simulation API
