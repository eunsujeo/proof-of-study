---
title: 국내 규제와 수탁
description: 국내 가상자산 규제 요구사항을 수탁형 지갑 인프라 설계 관점에서 정리합니다.
order: 5
---

이 챕터는 법률 자문 문서가 아닙니다.

국내 가상자산 규제 문서를 읽고, 그 요구사항이 수탁형 지갑 인프라 설계에 어떤 의미를 갖는지 정리하는 학습 노트입니다.

중심 질문은 아래입니다.

```text
국내 VASP 규제 요구사항을 만족하려면
수탁형 지갑, 내부원장, KYC/AML, Travel Rule, 증적 보존, 운영 점검을
어떻게 연결해야 할까?
```

Fireblocks는 주요 매핑 대상이지만 최종 provider가 바뀔 수 있습니다.

따라서 문서에서는 Fireblocks 기능명과 일반 설계 개념을 함께 봅니다.

```text
Fireblocks Vault
-> custody wallet / signing provider

externalTxId
-> idempotency key

Gas Station
-> gas funding

Co-Signer
-> automated signer / policy-controlled signer

Audit Logs / Webhooks
-> evidence source / event stream
```
