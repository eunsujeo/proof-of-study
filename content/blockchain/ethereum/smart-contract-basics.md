---
title: Smart Contract 기초
date: 2026-05-06
summary: 스마트 컨트랙트가 Contract Account, 트랜잭션, EVM, Gas와 어떻게 연결되는지 정리합니다.
order: 10
---

지금까지 이더리움의 기본 흐름을 이렇게 봤습니다.

```text
EOA
-> 트랜잭션 서명
-> Contract Account 호출
-> EVM이 코드 실행
-> gas 소비
-> 상태 변경
```

이번 글에서는 이 흐름의 중심에 있는 Smart Contract를 봅니다.

처음에는 이렇게 이해하면 됩니다.

```text
Smart Contract
= 이더리움 위에 배포되어 실행되는 코드와 상태
```

Ethereum.org는 스마트 컨트랙트를 이더리움 블록체인에서 실행되는 프로그램이라고 설명합니다. 코드와 데이터가 특정 주소에 존재합니다.

## Smart Contract와 Contract Account

Smart Contract와 Contract Account는 완전히 같은 말은 아니지만, 강하게 연결되어 있습니다.

```text
Smart Contract
-> 코드와 상태를 가진 프로그램

Contract Account
-> 그 코드와 상태가 이더리움 상태 안에서 존재하는 계정
```

Ethereum.org는 스마트 컨트랙트가 이더리움 계정의 한 종류라고 설명합니다.

이 말은 스마트 컨트랙트도 주소를 가지고, ETH 잔액을 가질 수 있고, 트랜잭션의 대상이 될 수 있다는 뜻입니다.

하지만 EOA처럼 사용자가 개인키로 직접 제어하는 계정은 아닙니다.

```text
EOA
-> 개인키로 제어
-> 트랜잭션을 시작할 수 있음

Contract Account
-> 코드로 제어
-> 호출되었을 때 실행됨
```

즉 Smart Contract를 배포하면, 이더리움 상태 안에 Contract Account가 생깁니다.

그 Contract Account에는 코드와 storage가 연결됩니다.

## 누가 컨트랙트를 작성하고 배포하나

컨트랙트 코드는 개발자가 작성합니다.

보통 Solidity 같은 스마트 컨트랙트 언어를 사용합니다.

```text
개발자
-> Solidity 코드 작성
-> 컴파일
-> EVM bytecode 생성
```

하지만 이더리움 노드는 Solidity 코드를 그대로 실행하지 않습니다.

EVM이 실행하는 것은 컴파일된 bytecode입니다.

```text
Solidity
-> 사람이 읽고 쓰기 좋은 코드

EVM bytecode
-> EVM이 실행하는 코드
```

컨트랙트를 네트워크에 배포하려면 배포 트랜잭션이 필요합니다.

```text
개발자 또는 배포자
-> 배포할 컨트랙트 코드를 준비
-> 지갑 앱이나 배포 도구에서 배포 승인

배포 도구
-> 컴파일된 EVM bytecode를 배포 트랜잭션에 넣음
-> 지갑 앱에 서명 요청

지갑 앱
-> 배포자의 EOA 개인키로 트랜잭션 서명
-> 서명된 배포 트랜잭션을 노드에 전송

이더리움 노드
-> 서명된 배포 트랜잭션을 네트워크에 전파

블록 제안자
-> 배포 트랜잭션을 블록에 포함

각 검증 노드
-> 블록 안의 배포 트랜잭션을 순서대로 다시 계산
-> EVM 규칙에 따라 Contract Account 생성 결과를 계산
```

즉 개발자나 배포자가 직접 Contract Account를 만드는 것이 아닙니다.

개발자나 배포자는 배포 트랜잭션을 승인합니다.

Contract Account는 그 배포 트랜잭션이 블록에 포함되고, 노드들이 같은 규칙으로 처리한 결과로 이더리움 상태 안에 생깁니다.

Ethereum.org도 컨트랙트 배포가 기술적으로 트랜잭션이라고 설명합니다.

배포도 EVM 작업이므로 gas가 필요합니다.

## 컨트랙트는 스스로 실행되나

컨트랙트는 스스로 실행되지 않습니다.

누군가 호출해야 실행됩니다.

```text
아무도 호출하지 않음
-> 컨트랙트 코드 실행 안 됨

EOA가 트랜잭션으로 호출
-> 컨트랙트 코드 실행
```

여기서 중요한 점은 "사용자가 함수 버튼을 누른다"와 "컨트랙트 코드가 실행된다" 사이에 트랜잭션이 있다는 것입니다.

```text
사용자
-> dapp에서 버튼 클릭

지갑 앱
-> 트랜잭션 내용 표시
-> 사용자가 승인
-> EOA 개인키로 서명

이더리움 노드
-> 트랜잭션 전파

블록 제안자
-> 트랜잭션을 블록에 포함

검증 노드
-> 트랜잭션을 순서대로 다시 계산
-> EVM이 컨트랙트 코드 실행
```

사용자가 직접 코드를 실행하는 것이 아닙니다.

사용자는 트랜잭션을 승인합니다.

EVM 실행은 노드가 블록을 처리하고 검증하는 과정에서 일어납니다.

## Counter 예시

아주 단순한 Counter 컨트랙트를 생각해보겠습니다.

```solidity
contract Counter {
    uint256 public count;

    function increment() public {
        count = count + 1;
    }
}
```

문법을 깊게 볼 필요는 없습니다.

여기서 중요한 것은 code와 storage를 구분하는 것입니다.

```text
increment()
-> 실행할 코드

count
-> storage 안에 저장되는 상태값
```

처음 배포되면 `count` 값은 0이라고 해보겠습니다.

```text
Contract Account
├── code: increment 함수
└── storage: count = 0
```

사용자가 `increment()`를 호출하면 어떤 일이 생길까요?

```text
EOA
-> increment 호출 트랜잭션 서명
-> Contract Account 호출
-> EVM이 increment 코드 실행
-> storage 안의 count 값 변경
```

실행 전후를 보면 이렇습니다.

```text
실행 전:
count = 0

increment 실행

실행 후:
count = 1
```

여기서 바뀐 것은 storage라는 공간 자체가 아닙니다.

storage 안에 저장된 `count` 값이 바뀐 것입니다.

## 읽기와 쓰기

컨트랙트와 상호작용할 때는 크게 두 가지를 구분할 수 있습니다.

```text
상태를 읽기
상태를 바꾸기
```

예를 들어 `count` 값을 확인하는 것은 읽기입니다.

```text
count 값 조회
-> 현재 storage 안의 count 값을 읽음
```

상태를 단순히 읽는 것만으로는 블록체인 상태가 바뀌지 않습니다.

반면 `increment()`는 상태를 바꿉니다.

```text
increment 호출
-> count 값 변경
-> 상태 변경 발생
```

상태를 바꾸려면 트랜잭션이 필요합니다.

트랜잭션은 EOA가 서명해서 보내고, EVM 실행과 gas 소비로 이어집니다.

## 지금까지 배운 내용 연결

Smart Contract는 혼자 떨어진 개념이 아닙니다.

지금까지 배운 내용이 모두 연결됩니다.

```text
EOA
-> 사용자가 개인키로 관리하는 계정
-> 트랜잭션을 시작함

Transaction
-> 상태 변경 요청

Contract Account
-> 스마트 컨트랙트 코드와 storage가 있는 계정

EVM
-> 컨트랙트 bytecode를 실행하는 공통 규칙

Gas
-> 실행량을 재고 비용과 한도를 정하는 단위

stateRoot
-> 실행 후 상태를 대표하는 root
```

Counter 예시에 연결하면:

```text
EOA가 increment 트랜잭션을 보냄
-> Contract Account가 호출됨
-> EVM이 increment bytecode 실행
-> gas 소비
-> count 값이 0에서 1로 변경
-> 새 stateRoot 계산
```

## Smart Contract의 특징

이번 단계에서는 스마트 컨트랙트의 특징을 너무 넓게 외울 필요는 없습니다.

핵심만 잡으면 됩니다.

```text
1. 블록체인 위에 배포된 코드다
2. 주소를 가진 Contract Account로 존재한다
3. 호출되었을 때 EVM에서 실행된다
4. storage 안의 값을 읽거나 바꿀 수 있다
5. 상태를 바꾸는 실행에는 트랜잭션과 gas가 필요하다
```

Ethereum.org는 스마트 컨트랙트가 기본적으로 삭제될 수 없고, 상호작용이 되돌릴 수 없다고 설명합니다. 이 말은 컨트랙트를 배포하거나 호출할 때 주의가 필요하다는 뜻입니다.

나중에 보안과 업그레이드 패턴을 배울 때 이 부분을 더 자세히 봅니다.

## 정리

오늘 기준으로는 이렇게 정리합니다.

> Smart Contract는 이더리움에 배포된 코드와 상태다. 배포되면 Contract Account로 존재하고, EOA가 보낸 트랜잭션으로 호출되며, EVM에서 실행되고, 실행 결과로 storage 안의 값이 바뀔 수 있다.

다음에는 Solidity를 아주 얕게 보면서 Counter 예시를 코드 관점에서 더 구체적으로 읽어봅니다.

## 참고 자료

- Ethereum.org, Introduction to smart contracts: https://ethereum.org/developers/docs/smart-contracts/
- Ethereum.org, Anatomy of smart contracts: https://ethereum.org/developers/docs/smart-contracts/anatomy/
- Ethereum.org, Compiling smart contracts: https://ethereum.org/developers/docs/smart-contracts/compiling/
- Ethereum.org, Deploying smart contracts: https://ethereum.org/developers/docs/smart-contracts/deploying/
