import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { groupKeyFromSlug, pickLocalized } from "@utils/i18n-fallback";
import { getCategoryUrl } from "@utils/url-utils.ts";
import { siteConfig } from "@/config";
import type {
	Category as CategoryType,
	NoteEntry,
	Tag as TagType,
} from "@/types/content";

const POST_TYPE_TAG = "博文";

// 统一的slug计算函数，与路由逻辑保持一致
function getRealSlug(entry: CollectionEntry<"posts">): string {
	const id = entry.id as string;
	const parts = id.split("/");
	const file = parts.pop() || "";
	const baseNoExt = file.replace(/\.(md|mdx)$/i, "");
	const base = baseNoExt.replace(/\.([A-Za-z]{2}(?:[-_][A-Za-z]{2})?)$/i, "");
	const dir = parts.join("/");
	const realSlug = base === "index" ? dir : dir ? `${dir}/${base}` : base;
	
	// 检查frontmatter中的slug是否与真实路径一致
	if (entry.data.slug && entry.data.slug !== realSlug) {
		console.warn(`⚠️  [SLUG MISMATCH] File: ${id}`);
		console.warn(`   Expected slug: "${realSlug}" (based on directory path)`);
		console.warn(`   Found slug: "${entry.data.slug}" (in frontmatter)`);
		console.warn(`   Using real path: "${realSlug}"`);
		console.warn("");
	}
	
	return realSlug;
}

function ensureTypeTag<T extends { data: { tags: string[] } }>(
	entries: T[],
	typeTag: string,
) {
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
	ensureTypeTag(allBlogPosts as CollectionEntry<"posts">[], POST_TYPE_TAG);

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
		slug: getRealSlug(post),
		data: post.data,
	}));

	return sortedPostsList;
}

// 根据语言获取排序的文章列表
export async function getSortedPostsListByLanguage(
	lang: string,
): Promise<PostForList[]> {
	const posts = await getPostsByLanguage(lang);
	const sortedPosts = posts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});

	// delete post.body
	const sortedPostsList = sortedPosts.map((post) => ({
		slug: getRealSlug(post),
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = TagType;

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

	ensureTypeTag(allBlogPosts as CollectionEntry<"posts">[], POST_TYPE_TAG);

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

export type Category = CategoryType;

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

	ensureTypeTag(allBlogPosts as CollectionEntry<"posts">[], POST_TYPE_TAG);
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

// 根据语言获取文章（带回退机制）
export async function getPostsByLanguage(lang: string) {
	const allPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	ensureTypeTag(allPosts as CollectionEntry<"posts">[], POST_TYPE_TAG);

	// 使用 pickLocalized 函数来实现语言回退
	const defaultLang = siteConfig.defaultLang || siteConfig.lang || "zh_cn";
	const fallbackChainOptions = {
		defaultLocale: defaultLang,
		fallbacks: {
			en: ["zh_cn"],
			zh_cn: ["en"],
			ja: ["zh_cn", "en"],
			ru: ["zh_cn", "en"],
		},
	};

	// 创建一个适配函数，从条目对象中提取 slug 并生成组键
	const groupKeyFunc = (e: CollectionEntry<"posts">) =>
		groupKeyFromSlug(e.slug);

	const filterFunc = pickLocalized(
		allPosts,
		lang,
		groupKeyFunc,
		fallbackChainOptions,
	);

	return allPosts.filter(filterFunc);
}

// 获取文章的翻译版本
export async function getPostTranslations(translationKey: string) {
	const allPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	return allPosts.filter((post) => post.data.translationKey === translationKey);
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

// 获取按语言回退后的排序文章列表（每个目录/同一篇只保留一个最佳版本）
export async function getSortedPostsWithFallback(lang: string) {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	ensureTypeTag(allBlogPosts as CollectionEntry<"posts">[], POST_TYPE_TAG);

	const defaultLang = siteConfig.defaultLang || siteConfig.lang || "zh_cn";
	const supported = Array.isArray(siteConfig.supportedLangs)
		? siteConfig.supportedLangs
		: [defaultLang];

	// 为当前语言构建回退序列：当前语言 -> 默认语言 -> 其他所有语言
	const buildFallbackChain = (targetLang: string) => {
		const chain = [targetLang];

		// 如果不是默认语言，添加默认语言
		if (targetLang !== defaultLang) {
			chain.push(defaultLang);
		}

		// 添加其他所有支持的语言（排除已经在链中的）
		for (const lang of supported) {
			if (!chain.includes(lang)) {
				chain.push(lang);
			}
		}

		return chain;
	};

	const groupKey = (e: CollectionEntry<"posts">) => {
		return groupKeyFromSlug(e.slug);
	};

	// 按组分组文章
	const groups = new Map<string, CollectionEntry<"posts">[]>();
	for (const post of allBlogPosts) {
		const key = groupKey(post);
		if (!groups.has(key)) groups.set(key, []);
		const group = groups.get(key);
		if (group) group.push(post);
	}

	// 为每个组选择最佳语言版本，并标记是否为回退版本
	const filtered: Array<
		CollectionEntry<"posts"> & { isFallback?: boolean; originalLang?: string }
	> = [];

	for (const [, groupPosts] of groups) {
		const chain = buildFallbackChain(lang);
		let chosen: CollectionEntry<"posts"> | undefined;
		let chosenLang: string | undefined;

		for (const targetLang of chain) {
			const candidates = groupPosts.filter((p) => {
				const postLang = p.data.lang || defaultLang;
				return postLang === targetLang;
			});

			if (candidates.length > 0) {
				chosen = candidates[0];
				chosenLang = targetLang;
				break;
			}
		}

		if (!chosen) {
			chosen = groupPosts[0];
			chosenLang = chosen.data.lang || defaultLang;
		}

		// 标记是否为回退版本
		const isFallback = chosenLang !== lang;
		const extendedPost = chosen as CollectionEntry<"posts"> & {
			isFallback?: boolean;
			originalLang?: string;
		};
		extendedPost.isFallback = isFallback;
		extendedPost.originalLang = chosenLang;

		filtered.push(extendedPost);
	}

	return filtered.sort((a, b) => {
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
// NoteEntry is imported from shared types

export async function getNotesByLanguage(_lang?: string) {
	const allNotes = await getCollection("notes", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	// Ensure type tag for notes
	for (const n of allNotes as NoteEntry[]) {
		const tags = Array.isArray(n.data.tags) ? n.data.tags : [];
		if (!tags.includes("随笔")) tags.push("随笔");
		(n.data as NoteEntry["data"]).tags = tags;
	}

	// 对于 notes，始终返回所有的 notes，不进行语言过滤
	// 这样所有语言的归档页面都能显示所有的随笔
	return allNotes;
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
	const keys = Object.keys(countMap).sort((a, b) =>
		a.toLowerCase().localeCompare(b.toLowerCase()),
	);
	return keys.map((k) => ({ name: k, count: countMap[k] }));
}

export async function getAllTagList(lang?: string): Promise<Tag[]> {
	const posts = await getTagList(lang);
	const notes = await getNoteTagList(lang);
	const map: { [key: string]: number } = {};
	for (const t of [...posts, ...notes])
		map[t.name] = (map[t.name] || 0) + t.count;
	const keys = Object.keys(map).sort((a, b) =>
		a.toLowerCase().localeCompare(b.toLowerCase()),
	);
	return keys.map((k) => ({ name: k, count: map[k] }));
}

// uses existing Category type above

export async function getNoteCategoryList(lang?: string): Promise<Category[]> {
	const notes = await getNotesByLanguage(lang);
	const count: { [key: string]: number } = {};
	for (const n of notes) {
		const cat =
			(n.data.category && String(n.data.category).trim()) ||
			i18n(I18nKey.uncategorized, lang);
		count[cat] = (count[cat] || 0) + 1;
	}
	const lst = Object.keys(count).sort((a, b) =>
		a.toLowerCase().localeCompare(b.toLowerCase()),
	);
	return lst.map((c) => ({ name: c, count: count[c], url: "" }));
}

export async function getAllCategoryList(lang?: string): Promise<Category[]> {
	const posts = await getCategoryList(lang);
	const notes = await getNoteCategoryList(lang);
	const map: { [key: string]: number } = {};
	for (const c of [...posts, ...notes])
		map[c.name] = (map[c.name] || 0) + c.count;
	const keys = Object.keys(map).sort((a, b) =>
		a.toLowerCase().localeCompare(b.toLowerCase()),
	);
	return keys.map((k) => ({ name: k, count: map[k], url: "" }));
}

// ---------- Notes fallback helpers ----------
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function contentNotesDir() {
	// Resolve absolute path to src/content/notes
	const dir = fileURLToPath(new URL("../content/notes", import.meta.url));
	return dir;
}

function pickHeadingTitle(markdown: string): string | undefined {
	const lines = markdown.split(/\r?\n/);
	const headings: { level: number; text: string }[] = [];
	for (const l of lines) {
		const m = l.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
		if (m) {
			headings.push({ level: m[1].length, text: m[2].trim() });
		}
	}
	if (headings.length === 0) return undefined;
	const minLevel = Math.min(...headings.map((h) => h.level));
	const firstAtMin = headings.find((h) => h.level === minLevel);
	return firstAtMin?.text;
}

function filenameFromEntry(entry: NoteEntry): string {
	const base = entry.slug?.split("/").pop() || entry.id || "";
	return base.replace(/\.mdx?$/i, "").trim();
}

function fileStatsForEntry(entry: NoteEntry) {
	try {
		const dir = contentNotesDir();
		const id = entry.id || `${entry.slug}.md`;
		const file = path.join(dir, id);
		const st = fs.statSync(file);
		// Prefer birthtime, fallback to ctime/mtime
		const created =
			st.birthtime && !Number.isNaN(st.birthtime.getTime())
				? st.birthtime
				: st.ctime;
		const updated = st.mtime;
		return { created, updated };
	} catch {
		const now = new Date();
		return { created: now, updated: now };
	}
}

export async function getNotesWithFallback() {
	const notes = await getCollection("notes", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	for (const n of notes as NoteEntry[]) {
		// Title
		let title = (n.data as NoteEntry["data"]).title as string | undefined;
		if (!title || title.trim() === "") {
			title =
				pickHeadingTitle((n as NoteEntry).body || "") || filenameFromEntry(n);
			(n.data as NoteEntry["data"]).title = title;
		}
		// Dates
		if (!(n.data as NoteEntry["data"]).published) {
			const { created, updated } = fileStatsForEntry(n);
			(n.data as NoteEntry["data"]).published = created;
			if (!(n.data as NoteEntry["data"]).updated)
				(n.data as NoteEntry["data"]).updated = updated;
		}
		if (!(n.data as NoteEntry["data"]).updated) {
			const { updated } = fileStatsForEntry(n);
			(n.data as NoteEntry["data"]).updated = updated;
		}
		// Ensure arrays exist
		(n.data as NoteEntry["data"]).tags = Array.isArray(n.data.tags)
			? n.data.tags
			: [];
		(n.data as NoteEntry["data"]).category =
			(n.data as NoteEntry["data"]).category || "";
		// Auto-append type tag
		if (!((n.data as NoteEntry["data"]).tags as string[]).includes("随笔")) {
			(n.data as NoteEntry["data"]).tags.push("随笔");
		}
	}
	return notes as NoteEntry[];
}
