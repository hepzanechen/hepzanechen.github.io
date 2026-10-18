# Zane / Notes

中英双语博客 · A bilingual notebook for physics, computing, and ideas.

- 中文：https://hepzanechen.github.io/
- English: https://hepzanechen.github.io/en/

## 写一篇文章 / Publish a post

1. 在 `content/` 新建一对 Markdown 文件，例如 `my-note.zh.md` 和 `my-note.en.md`。
2. 在 `content/posts.json` 添加一项元数据；`slug` 必须与文件名对应，`date` 使用 `YYYY-MM-DD`。
3. 将修改提交到 `main`。GitHub Actions 会构建、验证并自动发布。

Create both Markdown translations in `content/`, add an entry to `content/posts.json`, and push to `main`. GitHub Actions builds, checks, and publishes the site automatically.

```json
{
  "slug": "my-note",
  "date": "2026-10-18",
  "tag": "notes",
  "zh": { "title": "文章标题", "summary": "简短摘要" },
  "en": { "title": "Article title", "summary": "A short summary" }
}
```

分类 / Categories: `notes`（随笔 / reflections）, `tools`（工具与实践 / tools & practice）.

文章以日期倒序排列；同一天按 `posts.json` 中的顺序排列。没有写完的草稿不要放进 `posts.json`。图片可放进 `assets/`，用 `![说明](/assets/image.png)` 引用。

Posts are ordered newest first, preserving manifest order within the same date. Keep drafts out of `posts.json`. Put images in `assets/` and reference them with Markdown. Both translations are required before publication. Each language switch links to the corresponding article.

## 本地预览 / Local preview

Node.js 22 or later:

```bash
npm ci --ignore-scripts
npm run build
npm test
python3 -m http.server 8765 --directory dist
```

Open http://localhost:8765. Rebuild after editing; `dist/` is generated and ignored by Git.

## 结构 / Structure

- `content/`: Markdown articles and bilingual metadata.
- `assets/`: shared CSS, progressive search/filter controls, favicon, images.
- `scripts/build.mjs`: static generator, translations, RSS, sitemap, 404.
- `scripts/build.test.mjs`: translation coverage and generated-link checks.
- `.github/workflows/pages.yml`: GitHub Pages build and deployment.

Chinese is served at `/`, English at `/en/`. Articles render as HTML without JavaScript; JavaScript adds search, categories, Mermaid diagrams, and Giscus comments/reactions on article pages. The site has no analytics or third-party fonts; Mermaid and Giscus load only on pages that need them. Visitors use GitHub to comment and react, while discussions are moderated in the repository.

## 域名 / Domain

The previous repository pointed to `zanechen.me`, which could not be reached during setup. The site now uses the GitHub Pages default hostname. To restore a custom domain, configure its DNS and update **Settings → Pages → Custom domain**, then rerun the deployment workflow. The build reads the configured Pages URL for canonical links, RSS, and the sitemap.
