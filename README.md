# Study Notes

Cloudflare Pages에 배포할 개인 학습 노트 사이트입니다. Astro로 Markdown 글마다 정적 HTML 페이지를 생성합니다.

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
npm run dev:content
```

글을 작성하거나 수정할 때는 `npm run dev:content`를 사용합니다. 이 명령은 `content/**/*.md` 변경을 감지하면 Astro dev 서버를 자동으로 재시작해서 오래된 HTML이 보이는 상황을 줄입니다.

일반 UI나 CSS만 수정할 때는 기본 Astro dev 서버를 직접 실행해도 됩니다.

```bash
npm run dev
```

`npm run dev:content`는 기본으로 `http://localhost:4321/`에서 실행됩니다. 다른 포트가 필요하면 환경 변수로 지정합니다.

```bash
PORT=4322 npm run dev:content
```

## Build

```bash
npm run build
```

Cloudflare Pages 설정:

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22` 이상 권장

최근 배포 테스트: 2026-05-04

## Continue From Another Session

다른 컴퓨터나 새 세션에서 이어서 공부할 때는 먼저 저장소를 최신 상태로 맞춥니다.

```bash
git clone git@github.com:eunsujeo/proof-of-study.git
cd proof-of-study
npm install
```

이미 클론한 저장소가 있다면:

```bash
git pull origin main
npm install
```

글을 작성하거나 검토할 때는 콘텐츠 전용 dev server를 사용합니다.

```bash
npm run dev:content
```

브라우저에서 `http://localhost:4321/`을 열고 목차에서 글을 확인합니다. Markdown 글을 수정하면 dev server가 자동으로 재시작됩니다.

작업을 마치기 전에는 빌드를 확인합니다.

```bash
npm run build
```

커밋과 배포는 아래 순서로 진행합니다.

```bash
git status
git add .
git commit -m "Add study notes"
git push origin main
```

`main` 브랜치에 push되면 Cloudflare Pages가 자동 배포를 시작합니다. GitHub에서 `Workers Builds: proof-of-study` 체크가 성공했는지 확인합니다.

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

`src/lib/content.js`가 `content/**/*.md`를 자동으로 읽어서 목차와 글 목록을 만들고, Astro가 글마다 정적 페이지를 생성합니다.

예를 들어 아래 글은:

```text
content/blockchain/ethereum/why-blockchain.md
```

빌드 후 아래 정적 페이지가 됩니다.

```text
dist/blockchain/ethereum/why-blockchain/index.html
```
