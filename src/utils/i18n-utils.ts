import { getTranslation } from "@i18n/translation";
import { siteConfig } from "@/config";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";

/**
 * 获取语言的显示名称
 */
export function getLanguageName(lang: string): string {
	const languageNames: Record<string, string> = {
		zh_cn: "中文",
		en: "English",
		ja: "日本語",
		ko: "한국어",
		es: "Español",
		th: "ไทย",
		vi: "Tiếng Việt",
		id: "Bahasa Indonesia",
		tr: "Türkçe",
		zh_tw: "繁體中文",
		ru: "Русский язык",
	};
	return languageNames[lang] || lang;
}

/**
 * 检查是否为默认语言
 */
export function isDefaultLanguage(lang: string): boolean {
	return lang === (siteConfig.defaultLang || siteConfig.lang || "zh_cn");
}

/**
 * 获取文章的URL路径
 */
export function getPostUrl(slug: string, lang?: string): string {
	// 清理slug，移除文件扩展名和语言后缀
	let cleanSlug = slug;
	// 移除 .md, .en.md 等扩展名
	cleanSlug = cleanSlug.replace(/\.(\w+\.)?md$/, "");
	// 移除 index.en, index.zh_cn 等文件名
	cleanSlug = cleanSlug.replace(/\/index(\.\w+)?$/, "");

	// 通用的语言后缀清理逻辑
	// 移除所有可能的语言后缀（支持的语言列表）
	const supportedLangs = siteConfig.supportedLangs || [
		"en",
		"ja",
		"ko",
		"es",
		"th",
		"vi",
		"id",
		"tr",
		"zh_tw",
		"ru",
	];
	for (const supportedLang of supportedLangs) {
		// 移除形如 indexen, indexja, guideen, guideja 等语言后缀
		cleanSlug = cleanSlug.replace(
			new RegExp(`(index|[^/]+)(${supportedLang})$`, "i"),
			"$1",
		);
	}

	// 移除形如 indexru, guideen 等剩余的语言后缀（通用模式）
	cleanSlug = cleanSlug.replace(/index[a-z]{2}$/i, "");
	// 移除末尾的 /index
	cleanSlug = cleanSlug.replace(/\/index$/, "");
	// 如果整个 slug 就是 index，则设为空字符串
	if (cleanSlug === "index") {
		cleanSlug = "";
	}
	// 移除开头和结尾的斜杠
	cleanSlug = cleanSlug.replace(/^\/+|\/+$/g, "");

	// 根据语言参数生成URL
	if (!lang || isDefaultLanguage(lang)) {
		return `/posts/${cleanSlug}`;
	}

	return `/${lang}/posts/${cleanSlug}`;
}

/**
 * 获取分类页面的URL路径
 */
export function getCategoryUrlWithLang(
	category: string | null,
	lang?: string,
): string {
	const archiveUrl = getArchiveUrlWithLang(lang);
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() ===
			i18n(I18nKey.uncategorized, lang).toLowerCase()
	) {
		return `${archiveUrl}?uncategorized=true`;
	}
	return `${archiveUrl}?category=${encodeURIComponent(category.trim())}`;
}

/**
 * 获取标签页面的URL路径
 */
export function getTagUrlWithLang(tag: string, lang?: string): string {
	const archiveUrl = getArchiveUrlWithLang(lang);
	if (!tag) {
		return archiveUrl;
	}
	return `${archiveUrl}?tag=${encodeURIComponent(tag.trim())}`;
}

/**
 * 获取随笔标签页面的URL路径
 */
export function getNotesTagUrl(tag: string): string {
	if (!tag) {
		return "/notes";
	}
	return `/notes?tag=${encodeURIComponent(tag.trim())}`;
}

/**
 * 获取归档页面的URL路径
 */
export function getArchiveUrlWithLang(lang?: string): string {
	if (!lang || isDefaultLanguage(lang)) {
		return "/archive";
	}
	return `/${lang}/archive`;
}

/**
 * 获取首页的URL路径
 */
export function getHomeUrlWithLang(lang?: string): string {
	if (!lang || isDefaultLanguage(lang)) {
		return "/";
	}
	return `/${lang}`;
}

/**
 * 获取关于页面的URL路径
 */
export function getAboutUrlWithLang(lang?: string): string {
	if (!lang || isDefaultLanguage(lang)) {
		return "/about";
	}
	return `/${lang}/about`;
}

/**
 * 从URL路径中提取语言代码
 */
export function extractLangFromUrl(url: string): string {
	const match = url.match(/^\/([a-z]{2}(?:_[a-z]{2})?)(?:\/|$)/i);
	if (match && siteConfig.supportedLangs?.includes(match[1])) {
		return match[1];
	}
	return siteConfig.defaultLang || siteConfig.lang || "zh_cn";
}

/**
 * 获取规范化的URL（用于SEO）
 */
export function getCanonicalUrl(slug: string, lang?: string): string {
	const baseUrl = import.meta.env.SITE || "https://korostudio.cn";
	const postUrl = getPostUrl(slug, lang);
	return `${baseUrl}${postUrl}`;
}

/**
 * 获取语言切换的URL（只返回语言标识，客户端处理完整URL）
 */
export function getLanguageSwitchUrl(
	_currentUrl: string,
	targetLang: string,
): string {
	// 服务端不再计算复杂的URL，只返回语言标识
	// 客户端会自己处理URL转换
	return `#lang-${targetLang}`;
}

/**
 * 获取文章页面的语言切换URL（带回退机制）
 */
export function getPostLanguageSwitchUrl(
	postUrl: string,
	targetLang: string,
): string {
	// 提取文章slug
	const slugMatch = postUrl.match(/^\/posts\/(.+)$/);
	if (!slugMatch) {
		// 如果不是文章页面，回退到归档页面
		return getArchiveUrlWithLang(targetLang);
	}

	const slug = slugMatch[1];

	// 直接构建目标语言的文章URL
	// 由于有回退逻辑，文章肯定存在，不需要检查存在性
	return getPostUrl(slug, targetLang);
}

/**
 * 获取回退URL（当目标页面不存在时使用）
 */
export function getFallbackUrl(targetLang: string, currentUrl: string): string {
	// 检查当前URL类型并提供相应的回退
	if (currentUrl.includes("/posts/")) {
		// 文章页面回退到归档页面
		return getArchiveUrlWithLang(targetLang);
	}
	if (currentUrl.includes("/archive/category/")) {
		// 分类页面回退到归档页面
		return getArchiveUrlWithLang(targetLang);
	}
	if (currentUrl.includes("/archive/tag/")) {
		// 标签页面回退到归档页面
		return getArchiveUrlWithLang(targetLang);
	}
	if (currentUrl.includes("/about")) {
		// 关于页面保持在关于页面
		return getAboutUrlWithLang(targetLang);
	}
	if (currentUrl.includes("/archive")) {
		// 归档页面保持在归档页面
		return getArchiveUrlWithLang(targetLang);
	}
	// 其他页面回退到首页
	return getHomeUrlWithLang(targetLang);
}

/**
 * 检查语言是否被支持
 */
export function isSupportedLanguage(lang: string): boolean {
	return (
		siteConfig.supportedLangs?.includes(lang) ||
		lang === (siteConfig.defaultLang || siteConfig.lang)
	);
}

/**
 * 获取浏览器首选语言（如果支持的话）
 */
export function getPreferredLanguage(): string {
	if (typeof window === "undefined") {
		return siteConfig.defaultLang || siteConfig.lang || "zh_cn";
	}

	const browserLangs = navigator.languages || [navigator.language];
	for (const browserLang of browserLangs) {
		const normalizedLang = browserLang.toLowerCase().replace("-", "_");
		if (isSupportedLanguage(normalizedLang)) {
			return normalizedLang;
		}
		// 尝试匹配语言的主要部分（如 en-US -> en）
		const mainLang = normalizedLang.split("_")[0];
		if (isSupportedLanguage(mainLang)) {
			return mainLang;
		}
	}

	return siteConfig.defaultLang || siteConfig.lang || "zh_cn";
}
