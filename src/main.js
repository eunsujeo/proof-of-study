import "./styles.css";
import { findPost, studies } from "./content.js";

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
      <a href="#${post.route}">
        <span>${post.date}</span>
        <h4>${post.title}</h4>
        <p>${post.summary}</p>
      </a>
    </article>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderMarkdown(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  let paragraph = [];
  let list = [];
  let quote = [];

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push(`<p>${paragraph.map(escapeHtml).join(" ")}</p>`);
      paragraph = [];
    }
  }

  function flushList() {
    if (list.length) {
      blocks.push(`<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`);
      list = [];
    }
  }

  function flushQuote() {
    if (quote.length) {
      blocks.push(`<blockquote>${quote.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</blockquote>`);
      quote = [];
    }
  }

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      flushQuote();
      list.push(line.slice(2));
      continue;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      quote.push(line.slice(2));
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  flushQuote();

  return blocks.join("");
}

function renderHome() {
  return `
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
  `;
}

function renderArticle(result) {
  const { child, post, study } = result;

  return `
    <article class="article">
      <a class="back-link" href="#">목차로 돌아가기</a>
      <p class="eyebrow">${study.title} / ${child.title}</p>
      <h2>${post.title}</h2>
      <p class="article-summary">${post.summary}</p>
      <div class="article-meta">${post.date}</div>
      <div class="article-body">
        ${renderMarkdown(post.body)}
      </div>
    </article>
  `;
}

function render() {
  const route = window.location.hash.slice(1);
  const activePost = route.startsWith("/") ? findPost(route) : null;

  app.innerHTML = `
    <header class="site-header">
      <p class="eyebrow">Study Notes</p>
      <h1><a href="#">${siteTitle}</a></h1>
    </header>

    <main>
      ${activePost ? renderArticle(activePost) : renderHome()}
    </main>
  `;
}

window.addEventListener("hashchange", render);
render();
