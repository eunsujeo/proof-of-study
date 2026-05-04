# Next Study

이 문서는 다른 세션이나 다른 컴퓨터에서 스터디를 이어갈 때 먼저 읽는 문서입니다.

## Current Focus

현재 우선순위는 블록체인 / 이더리움입니다.

```text
블록체인
└── 이더리움
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
```

학습 흐름은 아래 순서입니다.

```text
블록체인이 해결하려는 문제
-> 해시
-> 머클 트리
-> 블록 헤더
-> 트랜잭션
```

현재까지의 핵심 연결은 이렇습니다.

```text
해시: 데이터가 바뀌었는지 확인하는 짧은 지문
머클 트리: 여러 데이터를 하나의 root로 묶고 일부 데이터 포함 여부를 검증하는 구조
블록 헤더: stateRoot, transactionsRoot, receiptsRoot, parent hash를 담는 검증 기준
트랜잭션: 계정이 서명해서 보내는 상태 변경 요청
```

## Next Topic

다음에 작성할 글은 이 파일입니다.

```text
content/blockchain/ethereum/account-model.md
```

현재는 placeholder 상태입니다. 다음 세션에서는 이 글을 확장합니다.

## Why This Topic Is Next

트랜잭션 글에서 "상태 변경 요청"까지 배웠습니다.

다음 질문은 자연스럽게 이쪽으로 이어집니다.

```text
이더리움의 상태는 무엇인가?
상태 안의 계정은 어떤 정보를 가지는가?
누가 트랜잭션에 서명하는가?
컨트랙트 계정은 사용자 계정과 무엇이 다른가?
```

그래서 다음 주제는 Account 모델입니다.

## Draft Scope For Account Model

`account-model.md`에는 아래 내용을 다룹니다.

```text
1. 이더리움은 Account 기반 상태 모델을 사용한다
2. 상태는 계정들의 현재 정보를 담고 있다
3. 계정에는 balance, nonce, code, storage가 있다
4. 계정은 크게 두 종류로 나뉜다
   - 사용자가 개인키로 관리하는 계정
   - 코드로 동작하는 컨트랙트 계정
5. 사용자가 개인키로 관리하는 계정은 트랜잭션을 시작할 수 있다
6. 컨트랙트 계정은 스스로 트랜잭션을 시작하지 못하고, 호출되었을 때 코드가 실행된다
7. 트랜잭션 실행 결과는 계정 상태를 바꾸고, 그 결과가 stateRoot로 요약된다
```

처음부터 EOA라는 용어를 강하게 밀어붙이지 않습니다.

권장 흐름:

```text
사용자가 개인키로 관리하는 계정
-> 정확한 이름은 EOA
-> 코드로 동작하는 계정은 Contract Account
```

## Questions To Answer In The Note

다음 글은 아래 질문에 답해야 합니다.

```text
계정은 지갑 주소와 같은 말인가?
EOA는 왜 서명할 수 있는가?
컨트랙트 계정은 왜 스스로 트랜잭션을 시작하지 못하는가?
nonce는 계정에 저장되는 값인가?
stateRoot와 Account 모델은 어떻게 연결되는가?
```

## Research Sources To Check First

글을 쓰기 전에 공식 문서를 먼저 확인합니다.

```text
Ethereum.org - Accounts
Ethereum.org - Transactions
Ethereum.org - Ethereum Virtual Machine
Ethereum Yellow Paper, account state 관련 부분
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
