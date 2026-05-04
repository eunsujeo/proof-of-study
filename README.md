# Study Notes

Cloudflare Pages에 배포할 개인 학습 노트 사이트입니다.

현재 등록된 스터디:

- `blockchain`: 블록체인/이더리움

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

- 블록체인/이더리움: [blockchain/data.js](blockchain/data.js)

새 스터디를 추가할 때는 새 폴더에 `data.js`를 만들고 [src/studies.js](src/studies.js)에 등록합니다.
