# Study Notes

Cloudflare Pages에 배포할 개인 학습 노트 사이트입니다.

현재 목차:

- proof of study
  - 블록체인
    - 이더리움
  - AI
    - LLM
    - Agents

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Cloudflare Pages 설정:

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22` 이상 권장

## Study Content

주제별 학습 내용은 `content/` 아래에 Markdown으로 둡니다.

- 블록체인: [content/blockchain](content/blockchain)
- AI: [content/ai](content/ai)

폴더 구조가 그대로 목차가 됩니다.

```text
content/
  blockchain/
    index.md
    ethereum/
      index.md
      why-blockchain.md
  ai/
    index.md
    llm/
      index.md
      what-is-token.md
```

새 스터디를 추가할 때는 `content/` 아래에 폴더와 `index.md`를 만듭니다.

예를 들어 Linux 스터디를 추가한다면:

```text
content/linux/index.md
content/linux/shell/index.md
content/linux/shell/basic-commands.md
```

스터디나 하위 주제의 `index.md`:

```md
---
title: Linux
description: 운영체제와 쉘 사용법을 공부합니다.
order: 3
---
```

글 파일:

```md
---
title: 기본 명령어
date: 준비 중
summary: 파일과 디렉터리를 다루는 기본 명령어를 정리합니다.
order: 1
---

본문을 작성합니다.
```

`src/content.js`가 `content/**/*.md`를 자동으로 읽어서 목차와 글 목록을 만듭니다.
