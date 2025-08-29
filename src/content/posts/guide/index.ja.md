---
title: Fuwari ブログテンプレート使用ガイド (Koro バージョン)
published: 2024-04-01
description: このブログテンプレートの使用方法。
image: "./cover.jpeg"
tags: ["Fuwari"]
category: Guides
draft: false
lang: "ja"
---

> カバー画像の出典: [Source](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)

このブログテンプレートは [Astro](https://astro.build/) を基に構築されています。このガイドで触れられていない内容については、[Astro ドキュメント](https://docs.astro.build/) を参照してください。

## 記事の Front-matter

```yaml
---
title: 私の最初のブログ記事
published: 2023-09-09
description: 私の新しい Astro ブログの最初の記事です。
image: ./cover.jpg
tags: [フロントエンド, ブログ]
category: 技術
draft: false
lang: "zh_cn"
---
```

| 属性          | 説明                                                                                                                                                                                                 |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | 記事タイトル。                                                                                                                                                                                      |
| `published`   | 記事が公開された日付。                                                                                                                                                                            |
| `description` | 記事の簡単な説明。ホーム画面に表示されます。                                                                                                                                                                   |
| `image`       | 記事のカバー画像のパス。<br/>1. `http://` または `https://` で始まる: ウェブ画像を使用<br/>2. `/` で始まる: `public` ディレクトリ内の画像を使用<br/>3. 接頭辞なし: Markdown ファイルからの相対パス |
| `tags`        | 記事のタグ。                                                                                                                                                                                       |
| `category`    | 記事のカテゴリー。                                                                                                                                                                                   |
| `draft`        | 下書きかどうか。下書きは表示されません。                                                                                                                                                                    |
| `lang`        | 記事の言語（例 "zh_cn", "en", "ja"）。                                                                                                                                                    |

## 記事ファイルの配置場所

あなたの記事ファイルは `src/content/posts/` ディレクトリ内に配置してください。また、記事やリソースを整理するためにサブディレクトリを作成することもできます。

### 複数の言語サポート

複数の言語の記事については、以下の命名規約を使用してください：

```
src/content/posts/
├── guide/
│   ├── cover.jpeg
│   ├── index.md          # デフォルトの言語（中国語）
│   └── index.en.md       # 英語版
├── hello-world/
│   ├── hello-world.zh_cn.md
│   └── hello-world.en.md
└── single-post.md        # 単一言語の記事
```

## 言語切り替え
トップヘッダーでグローバルに言語を切り替えると、自動的にフィルタリングされます。

## 対応言語

このブログテンプレートは以下の言語に対応しています：
- 簡体中国語: `zh_cn`
- 英語: `en`
- 日本語: `ja`
- ロシア語: `ru`