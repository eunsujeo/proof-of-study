const files = import.meta.glob("../../content/**/*.md", {
  eager: true
});

function getSlug(path) {
  return path.replace("../../content/", "").replace(/\.md$/, "").split("/");
}

function sortByOrder(items) {
  return items.sort((a, b) => {
    const orderDiff = (a.order ?? 999) - (b.order ?? 999);
    return orderDiff || a.title.localeCompare(b.title);
  });
}

function formatDate(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return value.slice(0, 10);
  }

  return value;
}

const entries = Object.entries(files).map(([path, module]) => ({
  path,
  parts: getSlug(path),
  Content: module.Content,
  ...module.frontmatter
}));

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
            date: formatDate(post.date),
            summary: post.summary,
            order: post.order,
            Content: post.Content,
            route: `/${studyId}/${trackId}/${post.parts[2]}/`
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

export const posts = studies.flatMap((study) =>
  study.children.flatMap((track) =>
    track.posts.map((post) => ({
      study,
      track,
      post
    }))
  )
);
