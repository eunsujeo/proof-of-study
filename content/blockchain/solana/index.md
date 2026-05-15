---
title: 솔라나
description: Account, transaction, instruction, program을 중심으로 Solana의 실행 모델을 이더리움과 비교하며 정리합니다.
order: 2
---

이 챕터는 Solana를 처음부터 다시 공부하기 위한 자리입니다.

이더리움에서 account, transaction, EVM, gas를 먼저 봤다면, Solana에서는 account, transaction, instruction, program의 관계를 먼저 봅니다.

Solana 공식 문서 기준으로 다음 개념을 차례로 정리합니다.

```text
account
-> state와 lamports를 담는 데이터 단위

transaction
-> 하나 이상의 instruction을 담는 실행 요청

instruction
-> 특정 program에 실행을 요청하는 단위

program
-> Solana에서 스마트 컨트랙트 역할을 하는 실행 코드
```

학습 흐름은 아래 순서로 시작합니다.

```text
Account, Transaction, Instruction, Program
-> transaction 구조와 signature
-> account ownership과 writable account
-> token account와 Associated Token Account
-> blockhash, confirmation, finality
-> Solana 입출금 감지
```

처음부터 성능이나 합의 구조로 들어가지 않습니다.

먼저 아래 질문에 답하는 것을 목표로 합니다.

```text
Solana에서 상태는 어디에 저장되는가?
transaction은 어떤 instruction을 실행하는가?
program은 왜 자기 상태를 직접 들고 있지 않은가?
이 구조가 이더리움 Account / Contract 모델과 어떻게 다른가?
```

## 참고 자료

- [Solana Docs, Core Concepts](https://solana.com/docs/core)
- [Solana Docs, Transactions](https://solana.com/docs/core/transactions)
- [Solana Docs, Instructions](https://solana.com/docs/core/instructions)
