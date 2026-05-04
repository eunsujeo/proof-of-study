---
title: 블록 헤더
date: 2026-05-04
summary: 블록 헤더가 블록의 핵심 요약 정보와 여러 루트 해시를 담는 방식을 정리합니다.
order: 4
---

블록은 여러 트랜잭션을 묶은 단위입니다.

Ethereum.org 문서는 블록을 트랜잭션의 묶음이라고 설명합니다. 그리고 각 블록은 이전 블록의 해시를 포함해서 서로 연결됩니다. 그래서 어떤 과거 블록의 내용이 바뀌면, 그 뒤에 이어지는 블록들의 해시도 함께 달라집니다.

블록을 처음 볼 때는 크게 두 부분으로 나눠 생각하면 쉽습니다.

```text
Block
├── Header
└── Body
```

`Body`에는 실제 트랜잭션 목록 같은 데이터가 들어갑니다.

`Header`에는 블록을 대표하는 요약 정보가 들어갑니다.

## 왜 헤더가 중요할까

머클 트리 글에서 `Root`가 계속 나왔습니다.

```text
Root
```

이 값은 어디에 저장될까요?

블록체인에서는 이런 루트 값들이 블록 헤더에 들어갑니다. 즉 블록 헤더는 큰 데이터 묶음을 직접 들고 있는 것이 아니라, 그 데이터 묶음을 검증할 수 있는 대표값을 들고 있습니다.

그래서 블록 헤더는 단순한 설명 문서가 아닙니다. 블록 안의 데이터와 실행 결과를 검증하는 기준점입니다.

## 이더리움 블록 헤더의 세 가지 Root

Ethereum.org의 Merkle Patricia Trie 문서는 이더리움 실행 레이어의 블록 헤더에 세 가지 루트가 있다고 설명합니다.

- `stateRoot`
- `transactionsRoot`
- `receiptsRoot`

각 루트는 서로 다른 데이터 묶음을 대표합니다.

## transactionsRoot

`transactionsRoot`는 블록 안에 포함된 트랜잭션 묶음의 루트입니다.

블록 body에 여러 트랜잭션이 들어 있다면, 그 트랜잭션들을 트리 구조로 묶고 루트 값을 계산합니다. 그 루트 값이 블록 헤더의 `transactionsRoot`입니다.

단순화하면 이런 관계입니다.

```text
Block Body
└── Transactions
    ├── Tx1
    ├── Tx2
    └── Tx3

Block Header
└── transactionsRoot
```

어떤 트랜잭션이 블록에 포함되어 있는지 검증할 때, 이 루트가 기준이 됩니다.

## receiptsRoot

트랜잭션은 실행되면 결과를 남깁니다. 이 결과를 receipt라고 부릅니다.

receipt에는 트랜잭션 실행 결과와 로그 같은 정보가 들어갑니다. 이 receipt 묶음도 트리 구조로 정리할 수 있고, 그 루트가 `receiptsRoot`입니다.

```text
Transaction execution
-> Receipt
-> receiptsRoot
```

`transactionsRoot`가 "어떤 트랜잭션들이 들어 있었는가"와 연결된다면, `receiptsRoot`는 "그 트랜잭션들이 실행된 결과는 무엇인가"와 연결됩니다.

## stateRoot

`stateRoot`는 블록 실행 이후의 이더리움 상태를 대표하는 루트입니다.

이더리움의 상태에는 계정, 잔액, 컨트랙트 코드, 컨트랙트 저장소 같은 정보가 포함됩니다. 블록 안의 트랜잭션을 실행하면 상태가 바뀝니다.

```text
이전 상태
-> 트랜잭션 실행
-> 새로운 상태
-> stateRoot
```

그래서 `stateRoot`는 특히 중요합니다. 블록 안의 트랜잭션을 순서대로 실행한 결과가 어떤 상태가 되었는지를 대표하기 때문입니다.

노드가 블록을 검증할 때는 트랜잭션을 직접 실행해보고, 자신이 계산한 상태 루트가 블록 헤더의 `stateRoot`와 맞는지 확인할 수 있습니다.

## 헤더는 검증의 기준점이다

머클 트리 글에서는 검증자가 이미 `Root`를 알고 있다고 했습니다.

```text
검증자가 이미 알고 있는 것:
Root
```

블록 헤더 글에서는 그 말이 더 구체화됩니다.

```text
검증자가 이미 알고 있는 것:
블록 헤더 안의 Root 값들
```

풀 노드가 어떤 트랜잭션, receipt, 상태 증명을 제공할 수 있습니다. 하지만 검증자는 그 값을 그대로 믿지 않습니다.

검증자는 받은 증거를 이용해 루트 값을 다시 계산하고, 블록 헤더 안의 루트와 비교합니다.

```text
받은 데이터와 증거
-> Root' 다시 계산
-> 블록 헤더의 Root와 비교
```

그래서 블록 헤더는 큰 데이터 묶음을 직접 들고 있지 않아도, 그 데이터 묶음을 검증하는 기준이 됩니다.

## previous block hash

블록 헤더에는 이전 블록과 연결되는 정보도 들어갑니다.

Ethereum.org는 블록이 이전 블록의 해시를 포함한다고 설명합니다. 이 값 덕분에 블록들이 체인처럼 연결됩니다.

```text
Block 1 hash
      ↓
Block 2 header includes Block 1 hash
      ↓
Block 3 header includes Block 2 hash
```

과거 블록의 내용이 바뀌면 그 블록의 해시가 바뀝니다. 그러면 다음 블록이 들고 있던 이전 블록 해시와 맞지 않게 됩니다. 이 구조가 과거 데이터 변경을 쉽게 드러나게 합니다.

## 정리

블록 헤더는 블록 전체를 대표하는 작은 요약 정보입니다.

이더리움에서는 헤더 안의 `stateRoot`, `transactionsRoot`, `receiptsRoot`가 각각 상태, 트랜잭션, receipt 묶음을 검증하는 기준이 됩니다.

오늘 기준으로는 이렇게 정리합니다.

> 블록 헤더는 블록 전체를 대표하는 요약 정보이고, 그 안의 Root 값들은 거래와 상태 같은 큰 데이터 묶음을 검증하는 기준이 된다.

## 참고 자료

- Ethereum.org, Blocks: https://ethereum.org/developers/docs/blocks/
- Ethereum.org, Merkle Patricia Trie: https://ethereum.org/developers/docs/data-structures-and-encoding/patricia-merkle-trie/
- Ethereum Yellow Paper: https://ethereum.github.io/yellowpaper/paper.pdf
