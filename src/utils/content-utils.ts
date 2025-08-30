import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";
import { siteConfig } from "@/config";

const POST_TYPE_TAG = "博文";

function ensureTypeTag<T extends { data: { tags: string[] } }>(entries: T[], typeTag: string) {
    for (const e of entries) {
        const tags = Array.isArray(e.data.tags) ? e.data.tags : [];
        if (!tags.includes(typeTag)) tags.push(typeTag);
        e.data.tags = tags;
    }
}

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	// 统一为博文追加类型标签
	ensureTypeTag(allBlogPosts as any, POST_TYPE_TAG);

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	// 按语言分组文章
	const postsByLang: { [key: string]: typeof sorted } = {};
	const defaultLang = siteConfig.defaultLang || siteConfig.lang || "zh_cn";
	
	for (const post of sorted) {
		const postLang = post.data.lang || defaultLang;
		if (!postsByLang[postLang]) {
			postsByLang[postLang] = [];
		}
		postsByLang[postLang].push(post);
	}

	// 为每种语言的文章设置导航链接
	for (const lang in postsByLang) {
		const langPosts = postsByLang[lang];
		
		for (let i = 1; i < langPosts.length; i++) {
			langPosts[i].data.nextSlug = langPosts[i - 1].slug;
			langPosts[i].data.nextTitle = langPosts[i - 1].data.title;
			langPosts[i].data.nextLang = langPosts[i - 1].data.lang || defaultLang;
		}
		for (let i = 0; i < langPosts.length - 1; i++) {
			langPosts[i].data.prevSlug = langPosts[i + 1].slug;
			langPosts[i].data.prevTitle = langPosts[i + 1].data.title;
			langPosts[i].data.prevLang = langPosts[i + 1].data.lang || defaultLang;
		}
	}

	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}

// 根据语言获取排序的文章列表
export async function getSortedPostsListByLanguage(lang: string): Promise<PostForList[]> {
	const posts = await getPostsByLanguage(lang);
	const sortedPosts = posts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});

	// delete post.body
	const sortedPostsList = sortedPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(lang?: string): Promise<Tag[]> {
	let allBlogPosts: CollectionEntry<"posts">[];
	if (lang) {
		// 如果指定了语言，只获取该语言的文章
		allBlogPosts = await getPostsByLanguage(lang);
	} else {
		// 如果没有指定语言，获取所有文章
		allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
			return import.meta.env.PROD ? data.draft !== true : true;
		});
	}

	ensureTypeTag(allBlogPosts as any, POST_TYPE_TAG);

	const countMap: { [key: string]: number } = {};
	allBlogPosts.map((post: { data: { tags: string[] } }) => {
		post.data.tags.map((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(lang?: string): Promise<Category[]> {
	let allBlogPosts: CollectionEntry<"posts">[];
	if (lang) {
		// 如果指定了语言，只获取该语言的文章
		allBlogPosts = await getPostsByLanguage(lang);
	} else {
		// 如果没有指定语言，获取所有文章
		allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
			return import.meta.env.PROD ? data.draft !== true : true;
		});
	}

	ensureTypeTag(allBlogPosts as any, POST_TYPE_TAG);
	const count: { [key: string]: number } = {};
	allBlogPosts.map((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized, lang);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

// 多语言支持函数

// 根据语言获取文章
export async function getPostsByLanguage(lang: string) {
	const allPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	ensureTypeTag(allPosts as any, POST_TYPE_TAG);
	return allPosts.filter(post => {
		const postLang = post.data.lang || siteConfig.defaultLang || siteConfig.lang || "zh_cn";
		return postLang === lang;
	});
}

// 获取文章的翻译版本
export async function getPostTranslations(translationKey: string) {
	const allPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	return allPosts.filter(post => post.data.translationKey === translationKey);
}

// 获取当前语言的排序文章
export async function getSortedPostsByLanguage(lang: string) {
	const posts = await getPostsByLanguage(lang);
	return posts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
}

// 获取默认语言的文章（向后兼容）
export async function getDefaultLanguagePosts() {
	const defaultLang = siteConfig.lang || "zh_cn";
	return await getPostsByLanguage(defaultLang);
}

// 检测文章语言（如果未设置则使用默认语言）
export function getPostLanguage(post: CollectionEntry<"posts">): string {
	return post.data.lang || siteConfig.lang || "zh_cn";
}

// 获取支持的语言列表
export function getSupportedLanguages(): string[] {
	return siteConfig.supportedLangs || [];
}

// ---------------- Notes & Combined helpers ----------------
export type NoteEntry = CollectionEntry<"notes">;

export async function getNotesByLanguage(lang?: string) {
	const allNotes = await getCollection("notes", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	if (!lang) return allNotes;
	const defaultLang = siteConfig.defaultLang || siteConfig.lang || "zh_cn";
	return allNotes.filter((n) => (n.data.lang || defaultLang) === lang);
}

// uses existing Tag type above

export async function getNoteTagList(lang?: string): Promise<Tag[]> {
	const notes = await getNotesByLanguage(lang);
	const countMap: { [key: string]: number } = {};
	for (const n of notes) {
		const tags = Array.isArray(n.data.tags) ? n.data.tags : [];
		for (const t of tags) {
			if (!countMap[t]) countMap[t] = 0;
			countMap[t]++;
		}
	}
	const keys = Object.keys(countMap).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return keys.map((k) => ({ name: k, count: countMap[k] }));
}

export async function getAllTagList(lang?: string): Promise<Tag[]> {
	const posts = await getTagList(lang);
	const notes = await getNoteTagList(lang);
	const map: { [key: string]: number } = {};
	for (const t of [...posts, ...notes]) map[t.name] = (map[t.name] || 0) + t.count;
	const keys = Object.keys(map).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return keys.map((k) => ({ name: k, count: map[k] }));
}

// uses existing Category type above

export async function getNoteCategoryList(lang?: string): Promise<Category[]> {
	const notes = await getNotesByLanguage(lang);
	const count: { [key: string]: number } = {};
	for (const n of notes) {
		const cat = (n.data.category && String(n.data.category).trim()) || i18n(I18nKey.uncategorized, lang);
		count[cat] = (count[cat] || 0) + 1;
	}
	const lst = Object.keys(count).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return lst.map((c) => ({ name: c, count: count[c], url: "" }));
}

export async function getAllCategoryList(lang?: string): Promise<Category[]> {
	const posts = await getCategoryList(lang);
	const notes = await getNoteCategoryList(lang);
	const map: { [key: string]: number } = {};
	for (const c of [...posts, ...notes]) map[c.name] = (map[c.name] || 0) + c.count;
	const keys = Object.keys(map).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	return keys.map((k) => ({ name: k, count: map[k], url: "" }));
}
