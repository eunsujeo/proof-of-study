import "./styles.css";
import { studies } from "./studies.js";

const app = document.querySelector("#app");
const siteTitle = "proof of study";

function getPostCount(study) {
  return study.children.reduce((sum, child) => sum + child.posts.length, 0);
}

function renderTree(study) {
  return `
    <li>
      <a href="#${study.id}">${study.title}</a>
      <ul>
        ${study.children
          .map(
            (child) => `
              <li>
                <a href="#${child.id}">${child.title}</a>
              </li>
            `
          )
          .join("")}
      </ul>
    </li>
  `;
}

function renderPost(post) {
  return `
    <article class="post">
      <a href="#${post.id}">
        <span>${post.date}</span>
        <h4>${post.title}</h4>
        <p>${post.summary}</p>
      </a>
    </article>
  `;
}

app.innerHTML = `
  <header class="site-header">
    <p class="eyebrow">Study Notes</p>
    <h1>${siteTitle}</h1>
  </header>

  <main>
    <section class="toc" aria-label="스터디 목차">
      <h2>${siteTitle}</h2>
      <ul>
        ${studies.map(renderTree).join("")}
      </ul>
    </section>

    ${studies
      .map(
        (study) => `
          <section class="study" id="${study.id}">
            <div class="section-heading">
              <p class="eyebrow">${getPostCount(study)} posts</p>
              <h3>${study.title}</h3>
              <p>${study.description}</p>
            </div>
            ${study.children
              .map(
                (child) => `
                  <section class="track" id="${child.id}">
                    <div class="track-heading">
                      <h4>${child.title}</h4>
                      <p>${child.description}</p>
                    </div>
                    <div class="posts">
                      ${child.posts.map(renderPost).join("")}
                    </div>
                  </section>
                `
              )
              .join("")}
          </section>
        `
      )
      .join("")}
  </main>
`;
