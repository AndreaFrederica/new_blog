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

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		prevLang: z.string().optional(),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
		nextLang: z.string().optional(),
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
	spec: specCollection,
};
