# Next Study

이 문서는 다른 세션이나 다른 컴퓨터에서 스터디를 이어갈 때 먼저 읽는 문서입니다.

## Current Focus

현재 우선순위는 블록체인 / 솔라나입니다.

```text
블록체인
├── 이더리움
├── 솔라나
├── 수탁형 지갑
├── 온체인 데이터 읽기와 인덱싱
└── 국내 규제와 수탁
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

## Completed Custody Track

이더리움 입문 실습은 보류합니다.

수탁형 지갑 챕터는 1차 완료로 봅니다.

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
content/blockchain/custody/production-infra-checklist.md
```

국내 규제와 수탁 챕터는 딥리서치 원문을 학습용 문서로 재구성한 트랙입니다.

원문은 아래 파일에 보관합니다.

```text
content/blockchain/deep-research-report.md
```

사이트에는 아래 학습 문서를 노출합니다.

```text
content/blockchain/korea-custody-regulation/regulatory-map.md
content/blockchain/korea-custody-regulation/custody-obligations.md
content/blockchain/korea-custody-regulation/fireblocks-control-mapping.md
content/blockchain/korea-custody-regulation/compliance-architecture.md
content/blockchain/korea-custody-regulation/operations-audit-checklist.md
content/blockchain/korea-custody-regulation/residual-risks.md
```

학습과 설계 준비 흐름은 아래 순서입니다.

```text
1. 리서치 자료를 출처별로 정리한다
2. 전체 수탁형 지갑 아키텍처를 잡는다
3. 입금과 sweep 흐름을 확인한다
4. 출금 흐름과 상태 전이를 확인한다
5. EVM nonce lane 설계를 깊게 본다
6. gas와 liquidity 운영을 분리해서 본다
7. 프로덕션 인프라 체크리스트로 provider / 자체 구축 판단 기준을 만든다
```

남은 항목은 블로그 학습 글이라기보다 실제 provider 검증 또는 프로젝트 의사결정입니다.

```text
provider sandbox/testnet 접근
Fireblocks / BitGo / Circle 실제 비교
출금 상태 전이의 실제 API 매핑
nonce lane 코드 구현 여부
최종 provider vs 자체 signer 결정
```

국내 규제와 수탁 챕터는 아래 순서로 읽습니다.

```text
1. 규제 지도
2. 수탁 의무와 설계 요구사항
3. Fireblocks 통제 매핑
4. 컴플라이언스 아키텍처
5. 운영과 감사 체크리스트
6. 잔여 리스크
```

국내 규제와 수탁 챕터는 유지하지만, 다음 우선순위에서는 제외합니다.

규제 트랙은 법무/컴플라이언스 확인 없이는 추가 확인 항목이 많아지기 쉽습니다.

## Why This Topic Is Next

다음 주제는 Solana 입문입니다.

수탁형 지갑 스터디에서 Solana는 EVM과 다른 체인으로 잠깐 등장했습니다.

EVM nonce lane, account model, transaction 처리 방식을 그대로 가져오면 Solana를 잘못 이해할 수 있습니다.

먼저 Solana의 기본 실행 모델을 따로 봅니다.

이번 트랙의 질문은 아래입니다.

```text
Solana는 상태와 실행을
account, transaction, instruction, program으로
어떻게 나누어 다루는가?
```

예상 학습 흐름은 아래 순서입니다.

```text
Account, Transaction, Instruction, Program
-> transaction 구조와 signature
-> account ownership과 writable account
-> token account와 Associated Token Account
-> blockhash, confirmation, finality
-> Solana 입출금 감지
```

처음 작성한 글입니다.

```text
content/blockchain/solana/account-transaction-instruction-program.md
```

온체인 데이터 읽기와 인덱싱은 그 다음 후보로 유지합니다.

나중에 온체인 데이터 트랙으로 넘어가면 아래 흐름을 사용합니다.

```text
온체인 데이터 읽기
-> transaction receipt
-> event log
-> confirmation과 reorg
-> 입금 감지
-> 출금 상태 추적
-> reconciliation
-> indexer 설계
```

처음 작성할 글 후보입니다.

```text
content/blockchain/onchain-data/index.md
content/blockchain/onchain-data/how-to-detect-deposits.md
```

## Questions Before Next Step

다음 세션에서 먼저 확인할 질문입니다.

```text
Solana 다음 글은 transaction 구조로 갈 것인가, token account로 갈 것인가?
Solana와 Ethereum의 account model 차이를 별도 글로 뺄 것인가?
Solana token account와 Associated Token Account를 언제 다룰 것인가?
Solana 입출금 감지는 온체인 데이터 트랙과 합칠 것인가, Solana 트랙 안에서 다룰 것인가?
```

## Research Sources To Check First

글을 쓰기 전에 공식 문서를 먼저 확인합니다.

Solana 글을 쓸 때 먼저 볼 자료입니다.

```text
Solana Docs - Core Concepts
Solana Docs - Account Structure
Solana Docs - Transactions
Solana Docs - Transaction Structure
Solana Docs - Instructions
Solana Docs - Instruction Structure
Solana Docs - Programs
Solana Docs - Tokens
Solana Docs - Confirmation and Expiration
```

온체인 데이터 읽기와 인덱싱 글로 돌아갈 때 볼 자료입니다.

```text
Ethereum.org - Transactions
Ethereum.org - Blocks
Ethereum.org - Nodes and clients
Ethereum.org - JSON-RPC API
Ethereum Execution APIs - eth_getBlockByNumber
Ethereum Execution APIs - eth_getTransactionReceipt
Ethereum Execution APIs - eth_getLogs
Ethereum JSON-RPC Specification
EIP-20 Token Standard
EIP-234 - blockHash option for eth_getLogs
Solidity documentation
Ethereum Yellow Paper, transaction receipt와 log 관련 부분
```

수탁형 지갑이나 국내 규제 트랙으로 돌아갈 때만 아래 자료를 다시 확인합니다.

```text
Chainstack - Ethereum nonce management
Fireblocks Developer Docs - Manage Withdrawals at Scale
Fireblocks Developer Docs - Gas Station
Fireblocks Developer Docs - Create Transaction
Fireblocks Developer Docs - Workspace Environments
Fireblocks Developer Docs - Transaction Statuses
Fireblocks Developer Docs - Transaction Webhooks
Fireblocks Developer Docs - API Co-Signer HA
BitGo Developers - nonce holes
BitGo Developers - gas tank
Circle Docs - Wallet Nonce Management
Coinbase Engineering Blog - chain-specific wallet architecture
Coinbase Engineering Blog - Solana sends/receives retrospective
Kraken Support - exchange wallet and hot wallet withdrawal behavior
BitGo Developers - withdraw flow and Ethereum gas tank
Tenderly Documentation - Simulation API
금융위원회 - 가상자산이용자보호법 시행 보도자료
금융위원회 - 가상자산업감독규정 제정 고시
특정 금융거래정보의 보고 및 이용 등에 관한 법률
KISA - ISMS-P 인증기준 안내
KISA - 가상자산사업자용 ISMS 세부점검항목
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
