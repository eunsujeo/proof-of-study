---
title: 이더리움 입문 퀴즈
date: 2026-05-06
summary: 해시부터 컨트랙트 배포와 호출까지 이더리움 입문 개념을 질문으로 점검합니다.
order: 13
---

여기까지 이더리움 입문 흐름을 한 바퀴 돌았습니다.

이번 글은 요약이 아니라 퀴즈입니다.

답을 외우는 것이 목표가 아닙니다. 질문을 보고 머릿속에 흐름이 떠오르는지 확인합니다.

```text
해시
-> 머클 트리
-> 블록 헤더
-> 트랜잭션
-> Account
-> EOA / Contract Account
-> EVM
-> Gas
-> Smart Contract
-> 배포와 호출
```

각 문제 아래에는 짧은 답을 접어서 넣었습니다.

먼저 스스로 답해보고, 그다음 답을 확인합니다.

## 데이터 검증

### Q1. 해시는 왜 블록체인에서 중요할까?

<details>
<summary>답 보기</summary>

해시는 데이터가 바뀌었는지 확인하는 짧은 지문처럼 쓰입니다.

입력이 조금만 바뀌어도 해시 결과가 크게 바뀌기 때문에, 데이터 변조를 감지하는 데 사용할 수 있습니다.

</details>

### Q2. 머클 트리는 왜 필요할까?

<details>
<summary>답 보기</summary>

여러 데이터를 하나의 root 값으로 묶기 위해 사용합니다.

특정 데이터가 포함되어 있는지 확인할 때 전체 데이터를 모두 받지 않고, 필요한 경로 정보로 root를 다시 계산해 검증할 수 있습니다.

</details>

### Q3. 블록 헤더의 `transactionsRoot`, `receiptsRoot`, `stateRoot`는 각각 무엇을 대표할까?

<details>
<summary>답 보기</summary>

```text
transactionsRoot
-> 블록 안의 트랜잭션 묶음

receiptsRoot
-> 트랜잭션 실행 결과 묶음

stateRoot
-> 트랜잭션 처리 후 이더리움 상태
```

</details>

## 상태와 트랜잭션

### Q4. 트랜잭션은 단순한 기록일까, 상태 변경 요청일까?

<details>
<summary>답 보기</summary>

트랜잭션은 상태 변경 요청입니다.

예를 들어 ETH 전송은 계정 balance를 바꾸고, 컨트랙트 호출은 storage 안의 값을 바꿀 수 있습니다.

</details>

### Q5. 검증 노드가 블록 안의 트랜잭션을 "순서대로 다시 계산한다"는 말은 무슨 뜻일까?

<details>
<summary>답 보기</summary>

노드 프로그램이 이전 상태에서 시작해 블록 안의 트랜잭션을 하나씩 처리해본다는 뜻입니다.

```text
이전 상태
-> Tx1 처리
-> Tx1 처리 후 상태
-> Tx2 처리
-> Tx2 처리 후 상태
-> 내가 계산한 stateRoot
```

그 결과가 블록 헤더의 `stateRoot`와 맞는지 비교합니다.

</details>

### Q6. `stateRoot`는 상태 전체일까, 상태를 대표하는 요약값일까?

<details>
<summary>답 보기</summary>

상태 전체가 아니라 상태를 대표하는 요약값입니다.

노드는 상태를 직접 다시 계산한 뒤, 그 상태를 요약한 root가 블록 헤더의 `stateRoot`와 같은지 확인합니다.

</details>

## Account

### Q7. EOA와 Contract Account의 가장 큰 차이는 무엇일까?

<details>
<summary>답 보기</summary>

```text
EOA
-> 개인키로 관리됨
-> 트랜잭션을 시작할 수 있음

Contract Account
-> 코드와 storage를 가짐
-> 호출되었을 때 실행됨
```

</details>

### Q8. 지갑 앱은 계정 자체일까?

<details>
<summary>답 보기</summary>

아닙니다.

지갑 앱은 계정을 보고, 트랜잭션에 서명하고, 네트워크에 전송하게 도와주는 도구입니다.

계정은 이더리움 상태 안에 있는 대상입니다.

</details>

### Q9. 지갑 앱은 개인키를 노드에 보내서 서명할까?

<details>
<summary>답 보기</summary>

아닙니다.

지갑 앱은 로컬에서 개인키로 서명하고, 노드에는 서명된 트랜잭션만 보냅니다.

노드는 개인키 없이 서명을 검증합니다.

</details>

## EVM과 Gas

### Q10. EVM은 중앙 서버 한 대일까?

<details>
<summary>답 보기</summary>

아닙니다.

EVM은 이더리움 노드들이 같은 규칙으로 컨트랙트 코드를 실행하기 위한 가상 실행 환경입니다.

같은 이전 상태, 같은 트랜잭션, 같은 EVM 규칙이면 같은 결과 상태가 나와야 합니다.

</details>

### Q11. Gas는 ETH 자체일까?

<details>
<summary>답 보기</summary>

아닙니다.

Gas는 EVM 작업에 필요한 계산량을 재는 단위입니다.

실제 수수료는 사용한 gas와 gas 한 단위의 가격으로 계산됩니다.

```text
사용한 gas * gas 한 단위의 가격 = 수수료
```

</details>

### Q12. 트랜잭션이 실패해도 수수료가 들 수 있는 이유는 무엇일까?

<details>
<summary>답 보기</summary>

상태 변경은 되돌릴 수 있지만, 이미 실행을 시도하면서 사용한 계산량은 비용으로 남을 수 있기 때문입니다.

```text
상태 변경
-> 실패하면 되돌릴 수 있음

이미 사용한 gas
-> 비용으로 남을 수 있음
```

</details>

## Smart Contract

### Q13. Smart Contract와 Contract Account는 어떤 관계일까?

<details>
<summary>답 보기</summary>

Smart Contract는 이더리움에 배포된 코드와 상태입니다.

배포되면 이더리움 상태 안에서 Contract Account로 존재합니다.

```text
Smart Contract
-> 코드와 상태를 가진 프로그램

Contract Account
-> 그 코드와 상태가 존재하는 계정
```

</details>

### Q14. Counter 예시에서 `count`는 어디에 저장될까?

<details>
<summary>답 보기</summary>

`count`는 Contract Account의 storage 안에 저장되는 상태값입니다.

```text
Contract Account
└── storage
    └── count = 0
```

</details>

### Q15. `increment()`는 storage라는 공간 자체를 바꿀까, storage 안의 값을 바꿀까?

<details>
<summary>답 보기</summary>

storage라는 공간 자체가 바뀌는 것이 아닙니다.

storage 안에 저장된 `count` 값이 바뀝니다.

```text
count = 0
-> increment()
-> count = 1
```

</details>

## 배포와 호출

### Q16. 컨트랙트 배포는 기존 Contract Account를 덮어쓰는 것일까?

<details>
<summary>답 보기</summary>

아닙니다.

새 컨트랙트를 배포하면 새 Contract Account와 새 주소가 생깁니다.

```text
기존 CA
-> 기존 코드
-> 기존 storage

새 CA
-> 새 코드
-> 새 storage
```

</details>

### Q17. 배포 트랜잭션과 함수 호출 트랜잭션의 차이는 무엇일까?

<details>
<summary>답 보기</summary>

```text
배포 트랜잭션
-> 새 Contract Account를 만듦
-> to가 비어 있을 수 있음
-> data에 bytecode가 들어감

함수 호출 트랜잭션
-> 이미 배포된 Contract Account를 대상으로 함
-> to에 컨트랙트 주소가 들어감
-> data에 함수 호출 정보가 들어감
```

</details>

### Q18. ABI는 왜 필요할까?

<details>
<summary>답 보기</summary>

컨트랙트 주소만으로는 어떤 함수를 어떤 인자로 호출할지 알 수 없습니다.

ABI는 dapp이나 도구가 함수 호출 데이터를 만들기 위한 설명서 역할을 합니다.

```text
컨트랙트 주소
-> 어디에 보낼지

ABI
-> 어떤 함수 호출 데이터를 만들지
```

</details>

### Q19. 같은 주소를 유지하면서 로직을 바꾸려면 무엇이 필요할까?

<details>
<summary>답 보기</summary>

처음부터 Proxy 같은 업그레이드 구조를 설계해야 합니다.

단순히 새 컨트랙트를 배포하면 새 주소가 생깁니다.

```text
Proxy
-> 사용자가 계속 호출하는 주소

Implementation
-> 교체 가능한 로직
```

</details>

## 실습 전 마지막 질문

### Q20. Counter 실습에서 관찰해야 할 것은 무엇일까?

<details>
<summary>답 보기</summary>

아래 흐름을 실제 화면에서 확인하면 됩니다.

```text
Solidity 코드 작성
-> 컴파일
-> 배포 트랜잭션
-> Contract Account 주소 생성
-> count 읽기
-> increment 호출 트랜잭션
-> gas 사용
-> count 값 변경
```

</details>

## 정리

20개 질문 중 막히는 질문이 많지 않다면 Counter 실습으로 넘어갈 수 있습니다.

다음에는 Remix로 빠르게 실습할지, Hardhat/Foundry 같은 로컬 개발 환경으로 갈지 결정합니다.

## 참고 자료

- Ethereum.org, Technical intro to Ethereum: https://ethereum.org/developers/docs/intro-to-ethereum/
- Ethereum.org, Accounts: https://ethereum.org/developers/docs/accounts/
- Ethereum.org, Transactions: https://ethereum.org/developers/docs/transactions/
- Ethereum.org, Ethereum Virtual Machine: https://ethereum.org/developers/docs/evm/
- Ethereum.org, Gas and fees: https://ethereum.org/developers/docs/gas/
- Ethereum.org, Smart contracts: https://ethereum.org/developers/docs/smart-contracts/
