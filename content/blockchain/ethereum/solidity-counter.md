---
title: Solidity Counter 예시
date: 2026-05-06
summary: 가장 작은 Counter 컨트랙트를 읽으며 Solidity 코드의 각 줄이 무엇을 뜻하는지 정리합니다.
order: 11
---

지난 글에서는 Smart Contract를 "이더리움 위에 배포된 코드와 상태"라고 정리했습니다.

이번에는 아주 작은 Solidity 코드를 직접 읽어봅니다.

목표는 Solidity 문법을 깊게 배우는 것이 아닙니다.

지금까지 배운 개념은 배경으로 두고, 이 글에서는 코드 자체를 읽는 데 집중합니다.

## Counter 코드

아주 작은 Counter 컨트랙트입니다.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public count;

    function increment() public {
        count = count + 1;
    }
}
```

이 코드는 하나의 숫자 `count`를 저장하고, `increment()`가 호출될 때 그 숫자를 1 증가시킵니다.

```text
처음 count: 0
increment 호출
다음 count: 1
```

## SPDX 주석

첫 줄입니다.

```solidity
// SPDX-License-Identifier: MIT
```

이 줄은 라이선스 정보를 나타내는 주석입니다.

Solidity 공식 문서의 예시도 SPDX 라이선스 식별자를 사용합니다.

블록체인에 컨트랙트 소스 코드를 공개하는 경우가 많기 때문에, 코드의 라이선스를 기계가 읽을 수 있게 표시하는 관례입니다.

지금은 실행 흐름과 직접 연결되는 줄은 아닙니다.

## pragma는 무엇인가

다음 줄입니다.

```solidity
pragma solidity ^0.8.20;
```

`pragma`는 컴파일러에게 이 소스 코드를 어떤 Solidity 버전 범위로 컴파일할지 알려주는 지시문입니다.

Solidity 공식 문서는 pragma를 컴파일러가 소스 코드를 어떻게 다뤄야 하는지에 대한 일반적인 지시라고 설명합니다.

처음에는 이렇게 이해하면 됩니다.

```text
pragma solidity ^0.8.20;
= Solidity 0.8.20 계열 컴파일러로 컴파일하라
```

이 줄도 배포 후 EVM에서 직접 실행되는 로직은 아닙니다.

컴파일 단계에서 의미가 있습니다.

## contract Counter

다음 부분입니다.

```solidity
contract Counter {
    ...
}
```

`contract Counter`는 `Counter`라는 이름의 컨트랙트를 선언합니다.

Solidity 공식 문서는 Solidity에서 contract를 코드와 데이터의 모음으로 설명합니다.

우리 흐름에 맞춰 보면:

```text
contract Counter
-> Counter라는 스마트 컨트랙트 정의
-> 컴파일되면 EVM bytecode가 됨
-> 배포되면 Contract Account로 존재
```

여기서 `Counter`는 아직 블록체인에 올라간 것이 아닙니다.

파일 안에 작성된 소스 코드입니다.

배포 트랜잭션이 처리되어야 이더리움 상태 안에 Contract Account가 생깁니다.

## uint256 public count

다음 줄이 중요합니다.

```solidity
uint256 public count;
```

이 줄은 `count`라는 상태 변수를 선언합니다.

`uint256`은 부호 없는 256비트 정수 타입입니다.

처음에는 "0 이상의 큰 정수를 담는 타입" 정도로 이해하면 됩니다.

```text
uint256
= 0 이상의 정수 타입
```

`count`는 이 컨트랙트의 storage 안에 저장되는 상태값입니다.

```text
Contract Account
└── storage
    └── count = 0
```

여기서 중요한 점은 이것입니다.

```text
count는 코드가 아니라 상태값이다.
count 값은 Contract Account의 storage 안에 저장된다.
```

## public은 무엇인가

`public`은 외부에서 이 값을 읽을 수 있게 해줍니다.

```solidity
uint256 public count;
```

Solidity 공식 문서는 `public` 상태 변수에 대해 컴파일러가 자동으로 getter 함수를 만든다고 설명합니다.

즉 위 한 줄을 쓰면, 외부에서 `count()`처럼 현재 값을 조회할 수 있는 함수가 자동으로 생긴다고 보면 됩니다.

```text
public count
-> 외부에서 count 값을 읽을 수 있는 getter가 자동 생성됨
```

이 getter는 `count` 값을 바꾸는 함수가 아닙니다.

현재 storage 안의 `count` 값을 읽는 함수입니다.

## increment 함수

다음은 함수입니다.

```solidity
function increment() public {
    count = count + 1;
}
```

`function increment()`는 `increment`라는 함수를 선언합니다.

이 함수가 호출되면 안의 코드가 실행됩니다.

```text
count = count + 1;
```

이 줄은 현재 `count` 값을 읽고, 1을 더한 값을 다시 `count`에 저장합니다.

```text
실행 전:
count = 0

count = count + 1

실행 후:
count = 1
```

여기서 바뀌는 것은 storage라는 공간 자체가 아닙니다.

storage 안에 저장된 `count` 값입니다.

## 코드만 다시 보기

이제 전체 코드를 다시 보면 조금 더 선명합니다.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public count;

    function increment() public {
        count = count + 1;
    }
}
```

줄별 역할만 정리하면 이렇습니다.

```text
SPDX
-> 라이선스 표시

pragma
-> 컴파일러 버전 조건

contract Counter
-> Counter라는 컨트랙트 정의

uint256 public count
-> storage 안에 저장될 상태값 선언
-> 외부에서 읽을 수 있는 getter 자동 생성

function increment() public
-> 외부에서 호출할 수 있는 함수 선언

count = count + 1
-> 기존 count 값을 읽고 1을 더해 다시 저장
```

이 글에서 꼭 가져갈 것은 두 가지입니다.

```text
1. count는 storage 안의 상태값이다
2. increment는 count 값을 바꾸는 코드다
```

## 정리

오늘 기준으로는 이렇게 정리합니다.

> Solidity Counter 예시는 컨트랙트 코드의 최소 구조를 보여준다. `count`는 storage 안의 상태값이고, `increment()`는 그 값을 1 증가시키는 함수다.

다음에는 컨트랙트 배포와 호출 흐름을 더 실제 작업 순서에 가깝게 정리합니다.

## 참고 자료

- Solidity Documentation, Introduction to Smart Contracts: https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html
- Solidity Documentation, Structure of a Contract: https://docs.soliditylang.org/en/latest/structure-of-a-contract.html
- Solidity Documentation, Contracts: https://docs.soliditylang.org/en/latest/contracts.html
- Ethereum.org, Anatomy of smart contracts: https://ethereum.org/developers/docs/smart-contracts/anatomy/
