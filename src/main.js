import "./styles.css";
import { studies } from "./studies.js";

const app = document.querySelector("#app");
const activeStudy = studies[0];
const { modules, resources } = activeStudy;

function renderModule(module, index) {
  const topicList = module.topics.map((topic) => `<span>${topic}</span>`).join("");
  const noteList = module.notes
    .map(
      (note) => `
        <article class="note">
          <h4>${note.title}</h4>
          <p>${note.body}</p>
        </article>
      `
    )
    .join("");

  return `
    <section class="module" id="${module.id}">
      <div class="module-index">${String(index + 1).padStart(2, "0")}</div>
      <div class="module-main">
        <div class="module-header">
          <div>
            <p class="eyebrow">${module.status}</p>
            <h3>${module.title}</h3>
          </div>
          <a href="#${module.id}" aria-label="${module.title} 섹션 링크">#</a>
        </div>
        <p class="summary">${module.summary}</p>
        <div class="topics">${topicList}</div>
        <div class="notes">${noteList}</div>
      </div>
    </section>
  `;
}

function renderResource(resource) {
  return `
    <a class="resource" href="${resource.url}" target="_blank" rel="noreferrer">
      <span>${resource.title}</span>
      <strong>Open</strong>
    </a>
  `;
}

app.innerHTML = `
  <header class="site-header">
    <div>
      <p class="eyebrow">Study Notes</p>
      <h1>${activeStudy.title}</h1>
      <p class="site-description">${activeStudy.description}</p>
    </div>
    <div class="header-actions">
      <label for="study-select">Study</label>
      <select id="study-select" aria-label="스터디 선택">
        ${studies.map((study) => `<option value="${study.id}">${study.title}</option>`).join("")}
      </select>
    </div>
  </header>

  <main>
    <nav class="module-nav" aria-label="학습 모듈">
      ${modules.map((module) => `<a href="#${module.id}">${module.title}</a>`).join("")}
    </nav>

    <section class="overview" aria-label="학습 현황">
      <div>
        <span class="metric">${modules.length}</span>
        <p>학습 모듈</p>
      </div>
      <div>
        <span class="metric">${modules.reduce((sum, module) => sum + module.notes.length, 0)}</span>
        <p>초기 노트</p>
      </div>
      <div>
        <span class="metric">CF</span>
        <p>Pages 배포 준비</p>
      </div>
    </section>

    <section class="modules" aria-label="학습 노트">
      ${modules.map(renderModule).join("")}
    </section>

    <aside class="resources" aria-label="참고 자료">
      <div>
        <p class="eyebrow">References</p>
        <h2>공식 문서</h2>
      </div>
      <div class="resource-list">
        ${resources.map(renderResource).join("")}
      </div>
    </aside>
  </main>
`;
