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

주제별 학습 내용은 각 폴더에 둡니다.

- 블록체인: [blockchain/data.js](blockchain/data.js)
- AI: [ai/data.js](ai/data.js)

새 스터디를 추가할 때는 새 폴더에 `data.js`를 만들고 [src/studies.js](src/studies.js)에 등록합니다.

예를 들어 AI 스터디를 추가한다면:

```text
ai/data.js
```

```js
// ai/data.js
export const aiStudy = {
  id: "ai",
  title: "AI",
  description: "AI 개념과 구현을 정리합니다.",
  children: [
    {
      id: "llm",
      title: "LLM",
      description: "언어 모델의 동작 방식과 사용법을 정리합니다.",
      posts: [
        {
          id: "what-is-token",
          title: "토큰이란 무엇인가",
          date: "준비 중",
          summary: "텍스트가 모델 입력 단위로 나뉘는 방식을 정리합니다."
        }
      ]
    }
  ]
};
```

그리고 [src/studies.js](src/studies.js)에 등록합니다.

```js
import { blockchainStudy } from "../blockchain/data.js";
import { aiStudy } from "../ai/data.js";

export const studies = [blockchainStudy, aiStudy];
```
