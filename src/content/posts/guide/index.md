---
title: Fuwari 博客模板使用指南(Koro Version)
published: 2024-04-01
description: "如何使用这个博客模板。"
image: "./cover.jpeg"
tags: ["Fuwari"]
category: 指南
draft: false
lang: "zh_cn"
---

> 封面图片来源: [Source](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)

这个博客模板基于 [Astro](https://astro.build/) 构建。对于本指南中未提及的内容，您可以在 [Astro 文档](https://docs.astro.build/) 中找到答案。

## 文章的 Front-matter

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 这是我新 Astro 博客的第一篇文章。
image: ./cover.jpg
tags: [前端, 博客]
category: 技术
draft: false
lang: "zh_cn"
---
```

| 属性          | 描述                                                                                                                                                                                                 |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | 文章标题。                                                                                                                                                                                      |
| `published`   | 文章发布日期。                                                                                                                                                                            |
| `description` | 文章简短描述，显示在首页。                                                                                                                                                                   |
| `image`       | 文章封面图片路径。<br/>1. 以 `http://` 或 `https://` 开头：使用网络图片<br/>2. 以 `/` 开头：使用 `public` 目录中的图片<br/>3. 无前缀：相对于 markdown 文件的路径 |
| `tags`        | 文章标签。                                                                                                                                                                                       |
| `category`    | 文章分类。                                                                                                                                                                                   |
| `draft`        | 是否为草稿，草稿不会显示。                                                                                                                                                                    |
| `lang`        | 文章语言（如 "zh_cn", "en", "ja"）。                                                                                                                                                    |

## 文章文件放置位置

您的文章文件应放置在 `src/content/posts/` 目录中。您也可以创建子目录来更好地组织您的文章和资源。

### 多语言支持

对于多语言文章，请使用以下命名约定：

```
src/content/posts/
├── guide/
│   ├── cover.jpeg
│   ├── index.md          # 默认语言（中文）
│   └── index.en.md       # 英文版本
├── hello-world/
│   ├── hello-world.zh_cn.md
│   └── hello-world.en.md
└── single-post.md        # 单语言文章
```

## 语言切换
在顶部Header中全局切换语言，会自动筛选。

## 支持的语言

此博客模板支持以下语言：
- 简体中文：`zh_cn`
- 英语：`en`
- 日语：`ja`
- 俄文：`ru`

