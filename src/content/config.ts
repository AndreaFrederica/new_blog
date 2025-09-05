import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().default("zh_cn"), // 当前文章语言
		translationKey: z.string().optional(), // 翻译组标识
		translations: z.record(z.string()).optional(), // 其他语言版本映射
		slug: z.string().optional(), // 自定义slug路径

		// 许可协议（可选）。若未设置，将使用站点默认（config.ts -> licenseConfig）
		license: z.string().optional(),
		licenseUrl: z.string().optional(),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		prevLang: z.string().optional(),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
		nextLang: z.string().optional(),
	}),
});
const notesCollection = defineCollection({
	// frontmatter fields are optional; fallback will be applied in helpers
	schema: z.object({
		title: z.string().optional().default(""),
		published: z.date().optional(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().default("zh_cn"),
		// 许可协议（可选）
		license: z.string().optional(),
		licenseUrl: z.string().optional(),
	}),
});
const specCollection = defineCollection({
	schema: z.object({
		lang: z.string().default("zh_cn"), // 当前文章语言
		translationKey: z.string().optional(), // 翻译组标识
	}),
});
export const collections = {
	posts: postsCollection,
	notes: notesCollection,
	spec: specCollection,
};
