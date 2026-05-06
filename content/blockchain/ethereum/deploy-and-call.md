---
title: 컨트랙트 배포와 호출 흐름
date: 2026-05-06
summary: Solidity 코드가 배포되어 Contract Account가 되고, dapp이 주소와 ABI로 함수를 호출하는 흐름을 정리합니다.
order: 12
---

지금까지 Counter 컨트랙트 코드를 읽었습니다.

이번에는 그 코드가 실제로 이더리움 네트워크에 올라가고 호출되는 흐름을 봅니다.

목표는 도구 사용법을 익히는 것이 아닙니다.

누가 무엇을 하는지, 어떤 데이터가 다음 단계로 넘어가는지 정리하는 것이 목표입니다.

```text
코드 작성
-> 컴파일
-> 배포 트랜잭션
-> Contract Account 생성
-> 주소와 ABI로 함수 호출
```

## 전체 흐름

먼저 큰 흐름입니다.

```text
개발자
-> Solidity 코드 작성

컴파일러 / 배포 도구
-> EVM bytecode 생성
-> ABI 생성

배포자
-> 배포 트랜잭션 승인

지갑 앱
-> EOA 개인키로 배포 트랜잭션 서명

이더리움 네트워크
-> 배포 트랜잭션 처리
-> Contract Account 생성

dapp
-> 컨트랙트 주소와 ABI로 함수 호출 준비
```

여기서 새로 나온 단어는 ABI입니다.

ABI는 뒤에서 따로 봅니다. 지금은 dapp이나 도구가 컨트랙트 함수를 어떻게 호출해야 하는지 알기 위한 설명서라고 생각하면 됩니다.

## 작성과 컴파일

개발자는 Solidity 코드를 작성합니다.

예를 들어:

```solidity
contract Counter {
    uint256 public count;

    function increment() public {
        count = count + 1;
    }
}
```

이 코드는 사람이 읽기 좋은 형태입니다.

EVM은 Solidity를 그대로 실행하지 않습니다.

배포 전에 컴파일이 필요합니다.

```text
Counter.sol
-> Solidity 컴파일러
-> EVM bytecode
-> ABI
```

여기서 결과물이 두 갈래로 나뉩니다.

```text
EVM bytecode
-> 블록체인에 배포될 실행 코드

ABI
-> dapp이나 도구가 함수를 호출하기 위한 설명서
```

## 배포 트랜잭션

Ethereum.org는 스마트 컨트랙트를 배포하려면 컴파일된 코드를 담은 이더리움 트랜잭션을 보내며, recipient를 지정하지 않는다고 설명합니다.

즉 배포 트랜잭션은 일반적인 함수 호출 트랜잭션과 조금 다릅니다.

```text
일반 ETH 전송:
to = 받는 주소

컨트랙트 호출:
to = 이미 배포된 Contract Account 주소

컨트랙트 배포:
to = 비어 있음
data = 배포할 EVM bytecode
```

배포 트랜잭션의 목적은 기존 주소를 호출하는 것이 아닙니다.

새 Contract Account를 만드는 것입니다.

## 배포할 때 누가 무엇을 하나

역할별로 나누면 이렇습니다.

```text
개발자
-> Solidity 코드 작성

컴파일러 / 배포 도구
-> Solidity 코드를 EVM bytecode로 컴파일
-> ABI 생성
-> 배포 트랜잭션 준비

배포자
-> 지갑 앱이나 배포 도구에서 배포 승인

지갑 앱
-> 배포자의 EOA 개인키로 트랜잭션 서명
-> 서명된 배포 트랜잭션을 노드에 전송

이더리움 노드
-> 배포 트랜잭션을 네트워크에 전파

블록 제안자
-> 배포 트랜잭션을 블록에 포함

각 검증 노드
-> 블록 안의 배포 트랜잭션을 순서대로 다시 계산
-> EVM 규칙에 따라 Contract Account 생성 결과 계산
```

배포자가 직접 Contract Account를 만드는 것은 아닙니다.

배포자는 배포 트랜잭션에 서명합니다.

Contract Account는 그 트랜잭션이 블록에 포함되고, 노드들이 같은 규칙으로 처리한 결과로 이더리움 상태 안에 생깁니다.

## 배포 후 무엇이 생기나

배포가 성공하면 Contract Account 주소가 생깁니다.

Ethereum.org도 배포된 컨트랙트는 다른 계정처럼 이더리움 주소를 가진다고 설명합니다.

처음에는 이렇게 이해하면 됩니다.

```text
배포 전:
Counter.sol 파일
EVM bytecode
ABI

배포 후:
Contract Account 주소
Contract Account code
Contract Account storage
```

Counter 예시라면:

```text
Contract Account
├── address: 0x...
├── code: Counter bytecode
└── storage: count = 0
```

이 주소가 있어야 나중에 컨트랙트를 호출할 수 있습니다.

## ABI는 왜 필요한가

ABI는 Application Binary Interface의 줄임말입니다.

처음에는 이렇게 이해하면 됩니다.

```text
ABI
= dapp이나 도구가 컨트랙트 함수 형태를 알기 위한 설명서
```

컨트랙트 주소만 있으면 "어디에 보낼지"는 알 수 있습니다.

하지만 "어떤 함수를 어떤 인자로 호출할지"를 만들려면 함수 정보가 필요합니다.

Counter 예시에서는 ABI가 이런 정보를 알려줍니다.

```text
count()
-> 인자 없음
-> uint256 값을 읽음

increment()
-> 인자 없음
-> 상태를 바꿀 수 있음
```

dapp은 컨트랙트 주소와 ABI를 함께 사용합니다.

```text
컨트랙트 주소
-> 어디에 보낼지

ABI
-> 어떤 함수 호출 데이터를 만들지
```

Solidity ABI 명세는 컨트랙트의 함수를 호출하고 데이터를 되돌려받을 때 사용하는 표준 방식을 정의합니다.

## count 읽기

`count` 값을 읽는 흐름입니다.

```text
dapp
-> 컨트랙트 주소와 ABI를 사용
-> count() 호출 데이터 준비
-> 노드에 현재 값 조회 요청

이더리움 노드
-> 현재 상태에서 count 값 읽음
-> dapp에 결과 반환
```

읽기 호출은 상태를 바꾸지 않습니다.

```text
count 읽기
-> storage 안의 count 값을 확인
-> count 값은 그대로
```

그래서 단순 조회는 보통 트랜잭션을 만들지 않고 처리할 수 있습니다.

블록에 포함될 필요도 없습니다.

## increment 쓰기

`increment()`는 다릅니다.

`increment()`는 `count` 값을 바꿉니다.

상태를 바꾸려면 트랜잭션이 필요합니다.

```text
dapp
-> 컨트랙트 주소와 ABI를 사용
-> increment() 호출 데이터 준비

지갑 앱
-> 사용자에게 트랜잭션 내용과 예상 수수료 표시
-> 사용자가 승인
-> EOA 개인키로 서명

이더리움 노드
-> 서명된 트랜잭션 전파

블록 제안자
-> 트랜잭션을 블록에 포함

각 검증 노드
-> 트랜잭션을 순서대로 다시 계산
-> EVM이 increment bytecode 실행
-> storage 안의 count 값 변경 결과 계산
```

실행 전후는 이렇습니다.

```text
실행 전:
count = 0

increment 트랜잭션 실행

실행 후:
count = 1
```

상태가 바뀌었기 때문에 gas가 필요합니다.

그리고 최종 상태는 새로운 `stateRoot`로 요약됩니다.

## 배포 트랜잭션과 호출 트랜잭션

둘을 비교하면 차이가 선명합니다.

```text
배포 트랜잭션
-> 새 Contract Account를 만든다
-> to가 비어 있을 수 있다
-> data에 배포할 bytecode가 들어간다
-> 결과로 컨트랙트 주소가 생긴다

함수 호출 트랜잭션
-> 이미 존재하는 Contract Account를 대상으로 한다
-> to에 컨트랙트 주소가 들어간다
-> data에 함수 호출 정보가 들어간다
-> 결과로 storage 안의 값이 바뀔 수 있다
```

둘 다 트랜잭션입니다.

둘 다 EOA가 서명해서 시작합니다.

둘 다 gas가 필요할 수 있습니다.

차이는 목적입니다.

```text
배포
-> 컨트랙트를 만든다

호출
-> 만들어진 컨트랙트를 사용한다
```

## 업데이트와 Proxy

여기서 웹 애플리케이션 배포와 다른 점이 하나 더 있습니다.

일반적인 웹 배포는 같은 서버나 같은 URL에 새 코드를 올리는 느낌에 가깝습니다.

하지만 이더리움에서 새 컨트랙트를 배포하면 기존 Contract Account가 덮어써지는 것이 아닙니다.

```text
기존 Contract Account
-> 예전 코드
-> 예전 storage
-> 기존 주소

새 Contract Account
-> 새 코드
-> 새 storage
-> 새 주소
```

즉 기존 컨트랙트와 새 컨트랙트는 둘 다 남아 있을 수 있습니다.

그리고 storage도 서로 다릅니다.

```text
기존 CA storage
-> 기존 count 값

새 CA storage
-> 새로 시작하는 count 값
```

기존 컨트랙트를 안 쓰고 새 컨트랙트를 쓰게 하려면 보통 별도 조치가 필요합니다.

예를 들어:

```text
dapp이 새 컨트랙트 주소를 사용하도록 변경
사용자에게 새 주소 안내
기존 데이터를 새 컨트랙트로 옮길 방법 검토
기존 컨트랙트에 더 이상 쓰기 작업이 일어나지 않도록 제한
```

같은 주소를 계속 쓰면서 로직만 바꾸고 싶다면 처음부터 Proxy 패턴 같은 업그레이드 구조를 설계해야 합니다.

단순화하면:

```text
사용자 / dapp
-> Proxy Contract 주소 호출

Proxy Contract
-> 실제 로직은 Implementation Contract로 위임

Implementation Contract
-> 교체 가능한 로직 코드
```

이 구조에서는 사용자가 계속 Proxy 주소를 호출합니다.

업데이트할 때는 Proxy가 바라보는 Implementation 주소를 바꿉니다.

```text
업데이트 전:
Proxy -> Implementation V1

업데이트 후:
Proxy -> Implementation V2
```

이때 보통 storage는 Proxy 쪽에 유지하고, 로직만 Implementation 쪽에서 교체하는 방식으로 설계합니다.

다만 Proxy는 더 어려운 주제입니다.

storage 구조를 잘못 바꾸면 기존 데이터가 깨질 수 있고, 업그레이드 권한 관리도 중요합니다.

지금 단계에서는 이렇게만 기억합니다.

```text
새 배포 = 새 Contract Account
기존 주소를 유지하려면 = Proxy 같은 별도 설계 필요
```

## 정리

오늘 기준으로는 이렇게 정리합니다.

> 컨트랙트 배포는 EVM bytecode를 담은 배포 트랜잭션으로 Contract Account를 만드는 과정이다. 배포 후에는 컨트랙트 주소와 ABI를 사용해 함수를 호출한다. 읽기 호출은 상태를 바꾸지 않고, 쓰기 호출은 EOA가 서명한 트랜잭션으로 시작되어 EVM 실행과 gas 소비를 거쳐 storage 안의 값을 바꿀 수 있다.

여기까지가 이더리움 입문 흐름의 한 사이클입니다. 다음에는 실제 실습을 할지, 아니면 지금까지의 개념을 복습 문서로 정리할지 결정합니다.

## 참고 자료

- Ethereum.org, Deploying smart contracts: https://ethereum.org/developers/docs/smart-contracts/deploying/
- Ethereum.org, Compiling smart contracts: https://ethereum.org/developers/docs/smart-contracts/compiling/
- Solidity Documentation, Contract ABI Specification: https://docs.soliditylang.org/en/latest/abi-spec.html
- Ethereum.org, Transactions: https://ethereum.org/developers/docs/transactions/
