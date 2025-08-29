---
title: Fuwari Blog Template User Guide (Koro Version)
published: 2024-04-01
description: "How to use this blog template."
image: "./cover.jpeg"
tags: ["Fuwari"]
category: Guides
draft: false
lang: "en"
---

> Cover image source: [Source](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)

This blog template is built on [Astro](https://astro.build/). For content not covered in this guide, you can find answers in the [Astro documentation](https://docs.astro.build/).

## Article Front-matter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is my first post on my new Astro blog.
image: ./cover.jpg
tags: [Frontend, Blog]
category: Technology
draft: false
lang: "en"
---
```

| Attribute     | Description                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | Article title.                                                                                                                                                                                            |
| `published`   | Article publication date.                                                                                                                                                                                 |
| `description` | Short article description, displayed on the homepage.                                                                                                                                                     |
| `image`       | Article cover image path.<br/>1. Starts with `http://` or `https://`: Use online image<br/>2. Starts with `/`: Use image from `public` directory<br/>3. No prefix: Relative to markdown file path |
| `tags`        | Article tags.                                                                                                                                                                                             |
| `category`    | Article category.                                                                                                                                                                                         |
| `draft`       | Whether it's a draft, drafts will not be displayed.                                                                                                                                                       |
| `lang`        | Article language (e.g., "zh_cn", "en", "ja").                                                                                                                                                           |

## Article File Location

Your article files should be placed in the `src/content/posts/` directory. You can also create subdirectories to better organize your articles and resources.

### Multilingual Support

For multilingual articles, use the following naming convention:

```
src/content/posts/
├── guide/
│   ├── cover.jpeg
│   ├── index.md          # Default language (Chinese)
│   └── index.en.md       # English version
├── hello-world/
│   ├── hello-world.zh_cn.md
│   └── hello-world.en.md
└── single-post.md        # Single-language article
```

## Language Switching
Globally switch languages in the top Header; it will automatically filter.

## Supported Languages

This blog template supports the following languages:
- Simplified Chinese: `zh_cn`
- English: `en`
- Japanese: `ja`
- Russian: `ru`