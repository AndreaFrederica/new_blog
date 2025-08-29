import type I18nKey from "@i18n/i18nKey";
import { getTranslation, i18n } from "@i18n/translation";
import { derived, writable } from "svelte/store";
import { siteConfig } from "@/config";

/**
 * 从URL中提取当前语言
 */
function getCurrentLanguageFromUrl(): string {
	if (typeof window === "undefined") {
		return siteConfig.lang || "zh_cn";
	}

	const path = window.location.pathname;
	const match = path.match(/^\/([a-z]{2}(?:_[a-z]{2})?)\//i);
	if (match && siteConfig.supportedLangs?.includes(match[1])) {
		return match[1];
	}
	return siteConfig.defaultLang || siteConfig.lang || "zh_cn";
}

/**
 * 从Cookie中获取语言偏好
 */
function getLanguageFromCookie(): string | null {
	if (typeof document === "undefined") {
		return null;
	}

	const nameEQ = "preferred-language=";
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

/**
 * 创建响应式 i18n 实例
 */
export function createReactiveI18n() {
	// 初始化语言：优先使用Cookie中的语言，然后是URL中的语言
	const initialLang = getLanguageFromCookie() || getCurrentLanguageFromUrl();

	// 创建Svelte store来管理当前语言
	const currentLangStore = writable(initialLang);

	// 创建响应式翻译函数
	const translate = (key: I18nKey) => {
		return derived(currentLangStore, ($currentLang) => i18n(key, $currentLang));
	};

	// 监听语言变化事件
	if (typeof window !== "undefined") {
		// 监听URL变化
		window.addEventListener("popstate", () => {
			const newLang = getCurrentLanguageFromUrl();
			currentLangStore.update((currentLang) => {
				if (newLang !== currentLang) {
					return newLang;
				}
				return currentLang;
			});
		});

		// 监听Cookie变化（通过定期检查）
		setInterval(() => {
			const cookieLang = getLanguageFromCookie();
			if (cookieLang) {
				currentLangStore.update((currentLang) => {
					if (cookieLang !== currentLang) {
						return cookieLang;
					}
					return currentLang;
				});
			}
		}, 1000);

		// 监听自定义语言变化事件
		window.addEventListener("languageChanged", (event: Event) => {
			const customEvent = event as CustomEvent;
			if (customEvent.detail.lang) {
				currentLangStore.set(customEvent.detail.lang);
			}
		});
	}

	return {
		currentLang: currentLangStore,
		setLang(lang: string) {
			currentLangStore.set(lang);
			// 触发自定义事件
			if (typeof window !== "undefined") {
				window.dispatchEvent(
					new CustomEvent("languageChanged", { detail: { lang } }),
				);
			}
		},
		t: translate,
	};
}

// 创建全局响应式 i18n 实例
export const reactiveI18n = createReactiveI18n();

// 便捷的翻译函数
export const rt = reactiveI18n.t;
