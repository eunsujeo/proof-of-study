const files = import.meta.glob("../content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default"
});

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return { metadata: {}, body: raw.trim() };
  }

  const metadata = Object.fromEntries(
    match[1]
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const separatorIndex = line.indexOf(":");
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        return [key, /^\d+$/.test(value) ? Number(value) : value];
      })
  );

  return { metadata, body: match[2].trim() };
}

function getSlug(path) {
  return path.replace("../content/", "").replace(/\.md$/, "").split("/");
}

function sortByOrder(items) {
  return items.sort((a, b) => {
    const orderDiff = (a.order ?? 999) - (b.order ?? 999);
    return orderDiff || a.title.localeCompare(b.title);
  });
}

const entries = Object.entries(files).map(([path, raw]) => {
  const { metadata, body } = parseFrontmatter(raw);
  return {
    path,
    parts: getSlug(path),
    body,
    ...metadata
  };
});

const studyIndexes = entries.filter((entry) => entry.parts.length === 2 && entry.parts[1] === "index");
const trackIndexes = entries.filter((entry) => entry.parts.length === 3 && entry.parts[2] === "index");
const postEntries = entries.filter((entry) => entry.parts.length === 3 && entry.parts[2] !== "index");

export const studies = sortByOrder(
  studyIndexes.map((study) => {
    const studyId = study.parts[0];
    const tracks = trackIndexes
      .filter((track) => track.parts[0] === studyId)
      .map((track) => {
        const trackId = track.parts[1];
        const posts = postEntries
          .filter((post) => post.parts[0] === studyId && post.parts[1] === trackId)
          .map((post) => ({
            id: post.parts[2],
            title: post.title,
            date: post.date,
            summary: post.summary,
            order: post.order,
            body: post.body,
            route: `/${studyId}/${trackId}/${post.parts[2]}`
          }));

        return {
          id: trackId,
          title: track.title,
          description: track.description,
          order: track.order,
          posts: sortByOrder(posts)
        };
      });

    return {
      id: studyId,
      title: study.title,
      description: study.description,
      order: study.order,
      children: sortByOrder(tracks)
    };
  })
);

export function findPost(route) {
  for (const study of studies) {
    for (const child of study.children) {
      const post = child.posts.find((item) => item.route === route);
      if (post) {
        return { study, child, post };
      }
    }
  }

  return null;
}
