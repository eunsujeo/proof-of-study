# Next Study

이 문서는 다른 세션이나 다른 컴퓨터에서 스터디를 이어갈 때 먼저 읽는 문서입니다.

## Current Focus

현재 우선순위는 블록체인 / 수탁형 지갑입니다.

```text
블록체인
├── 이더리움
└── 수탁형 지갑
```

AI 섹션은 유지하지만, 당분간 작성 우선순위에서는 제외합니다.

## Completed Notes

지금까지 작성한 이더리움 글입니다.

```text
content/blockchain/ethereum/why-blockchain.md
content/blockchain/ethereum/hash.md
content/blockchain/ethereum/merkle-tree.md
content/blockchain/ethereum/block-header.md
content/blockchain/ethereum/transaction.md
content/blockchain/ethereum/account-model.md
content/blockchain/ethereum/eoa-contract-account.md
content/blockchain/ethereum/evm.md
content/blockchain/ethereum/gas.md
content/blockchain/ethereum/smart-contract-basics.md
content/blockchain/ethereum/solidity-counter.md
content/blockchain/ethereum/deploy-and-call.md
content/blockchain/ethereum/ethereum-basics-quiz.md
```

학습 흐름은 아래 순서입니다.

```text
블록체인이 해결하려는 문제
-> 해시
-> 머클 트리
-> 블록 헤더
-> 트랜잭션
-> 이더리움 Account 모델
-> EOA와 Contract Account
-> EVM
-> Gas
-> Smart Contract 기초
-> Solidity Counter 예시
-> 컨트랙트 배포와 호출 흐름
-> 이더리움 입문 퀴즈
```

현재까지의 핵심 연결은 이렇습니다.

```text
해시: 데이터가 바뀌었는지 확인하는 짧은 지문
머클 트리: 여러 데이터를 하나의 root로 묶고 일부 데이터 포함 여부를 검증하는 구조
블록 헤더: stateRoot, transactionsRoot, receiptsRoot, parent hash를 담는 검증 기준
트랜잭션: 계정이 서명해서 보내는 상태 변경 요청
이더리움 Account 모델: 상태를 계정 단위로 관리하는 방식, EOA와 Contract Account의 기본 차이
EOA와 Contract Account: 서명해서 시작하는 계정과 호출되면 실행되는 계정의 차이
EVM: 스마트 컨트랙트 코드를 같은 규칙으로 실행하고 상태 변화를 계산하는 가상 실행 환경
Gas: EVM 실행량을 재고 수수료와 실행 한도를 정하는 단위
Smart Contract 기초: 배포된 코드와 상태가 Contract Account, 트랜잭션, EVM, Gas와 연결되는 방식
Solidity Counter 예시: 가장 작은 컨트랙트 코드로 storage, function, transaction, EVM 실행을 연결
컨트랙트 배포와 호출 흐름: bytecode, ABI, 배포 트랜잭션, 함수 호출 트랜잭션의 차이
이더리움 입문 퀴즈: 해시부터 배포와 호출까지 입문 개념을 질문으로 점검
```

## Current Custody Track

이더리움 입문 실습은 보류합니다.

현재 우선순위는 수탁형 지갑의 출금 nonce 관리와 프로덕션 인프라 설계 준비입니다.

Fireblocks는 사용할 수 있는 custody provider 후보 중 하나로 봅니다.

따라서 문서는 특정 벤더에 고정하지 않고, provider를 바꿔도 유지되는 구조를 먼저 정리합니다.

현재 수탁형 지갑 챕터는 중/고급 준비 과정입니다.

입문 과정처럼 이해를 돕기 위한 단순화가 목표가 아닙니다.

최종 목표는 아래 질문에 답하는 것입니다.

```text
프로덕션 환경에서
수탁형 지갑 인프라를 어떻게 구성해야
안전성과 출금 처리량을 함께 만족할 수 있을까?
```

현재 문서 구조입니다.

```text
content/blockchain/custody/research-notes.md
content/blockchain/custody/research-chainstack-nonce-management.md
content/blockchain/custody/custodial-wallet-architecture.md
content/blockchain/custody/deposit-and-sweep-flow.md
content/blockchain/custody/withdrawal-flow.md
content/blockchain/custody/evm-nonce-management.md
content/blockchain/custody/gas-and-liquidity.md
content/blockchain/custody/simulation-plan.md
content/blockchain/custody/production-infra-checklist.md
```

학습과 설계 준비 흐름은 아래 순서입니다.

```text
1. 리서치 자료를 출처별로 정리한다
2. 전체 수탁형 지갑 아키텍처를 잡는다
3. 입금과 sweep 흐름을 확인한다
4. 출금 흐름과 상태 전이를 확인한다
5. EVM nonce lane 설계를 깊게 본다
6. gas와 liquidity 운영을 분리해서 본다
7. 시뮬레이션으로 병목과 장애 상황을 검토한다
8. 프로덕션 인프라 체크리스트로 provider / 자체 구축 판단 기준을 만든다
```

## Why This Topic Is Next

현재 사용자가 맡은 주제는 블록체인 수탁형 지갑의 nonce 관리입니다.

Fireblocks를 사용할 수도 있지만, 최종 provider가 바뀔 수 있습니다.

그래서 먼저 벤더 중립 구조를 잡고, provider별 차이는 별도 검토합니다.

서비스 흐름은 아래와 같습니다.

```text
외부 사용자 지갑
-> 사용자별 입금 주소
-> sweep
-> omnibus wallet/vault
-> withdrawal wallet pool
-> 사용자 외부 출금 주소

omnibus wallet/vault
-> cold wallet
```

문제는 출금입니다.

유저가 많아지고 동시에 출금 요청이 오면, 하나의 출금 wallet은 EVM nonce 순서 때문에 병목이 됩니다.

현재 1차 설계 방향은 아래와 같습니다.

```text
EVM 출금은 chainId + sourceAddress 단위 nonce lane으로 관리한다.
같은 lane 안에서는 직렬화한다.
여러 withdrawal wallet을 두어 lane 수를 늘린다.
gas token 부족은 실패가 아니라 WAITING_FOR_GAS 상태로 분리한다.
provider idempotency key로 중복 출금을 방지한다.
webhook만 믿지 않고 chain watcher와 reconciliation을 둔다.
provider 기능명은 일반 개념으로 매핑한다.
```

## Questions Before Next Step

다음 세션에서 먼저 확인할 질문입니다.

```text
리서치 노트에서 더 확인해야 할 provider가 있는가?
입금/sweep 흐름에서 실제 서비스와 다른 가정이 있는가?
출금 상태 전이에 빠진 상태가 있는가?
nonce lane을 직접 구현하는 코드 예제가 필요한가?
시뮬레이션은 문서 표로 할까, 작은 로컬 스크립트로 할까?
사용할 custody provider 후보와 Sandbox/Testnet 접근 권한이 있는가?
프로덕션 인프라에서 provider를 쓸지 자체 signer까지 검토할지 결정해야 하는가?
```

## Research Sources To Check First

글을 쓰기 전에 공식 문서를 먼저 확인합니다.

```text
Ethereum.org - Accounts
Ethereum.org - Transactions
Ethereum.org - Ethereum Virtual Machine
Ethereum.org - Gas and fees
Ethereum.org - Smart contracts
Solidity documentation
Ethereum Yellow Paper, account state 관련 부분
Chainstack - Ethereum nonce management
Fireblocks Developer Docs - Manage Withdrawals at Scale
Fireblocks Developer Docs - Gas Station
Fireblocks Developer Docs - Create Transaction
Fireblocks Developer Docs - Workspace Environments
Fireblocks Developer Docs - API Co-Signer HA
BitGo Developers - nonce holes
BitGo Developers - gas tank
Circle Docs - Wallet Nonce Management
Coinbase Engineering Blog - chain-specific wallet architecture
Coinbase Engineering Blog - Solana sends/receives retrospective
Kraken Support - exchange wallet and hot wallet withdrawal behavior
BitGo Developers - withdraw flow and Ethereum gas tank
Tenderly Documentation - Simulation API
```

공식 문서에서 확인한 사실만 본문에 단정적으로 씁니다. 이해를 돕기 위한 비유나 단순화는 단순화라고 표시합니다.

## Writing Rules

글은 한국어로 작성합니다.

```text
짧은 문단
쉬운 말 먼저, 용어는 나중
이전 글과 연결되는 문장 포함
필요하면 text diagram 사용
참고 자료 섹션 유지
```

새 글을 작성하거나 기존 글을 수정할 때는 아래 명령을 사용합니다.

```bash
npm run dev:content
```

마무리 전에는 항상 빌드합니다.

```bash
npm run build
```

## Commit And Deploy Rule

기본 운영 방식은 아래와 같습니다.

```text
AI가 리서치, 초안 작성, build 검증을 수행
사용자가 로컬에서 검토
사용자가 승인하면 commit / push
main에 push되면 Cloudflare Pages 자동 배포
```

사용자가 명시적으로 요청하지 않으면 commit / push 하지 않습니다.
