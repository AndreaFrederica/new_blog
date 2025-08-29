import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";
import { siteConfig } from "@/config";
import { getHomeUrlWithLang, getAboutUrlWithLang, getArchiveUrlWithLang } from "@/utils/i18n-utils";

// 创建一个函数来生成链接预设，支持动态语言
export function getLinkPresets(lang?: string): { [key in LinkPreset]: NavBarLink } {
	const targetLang = lang || siteConfig.defaultLang || siteConfig.lang;
	return {
		[LinkPreset.Home]: {
			name: i18n(I18nKey.home, targetLang),
			url: getHomeUrlWithLang(targetLang),
		},
		[LinkPreset.About]: {
			name: i18n(I18nKey.about, targetLang),
			url: getAboutUrlWithLang(targetLang),
		},
		[LinkPreset.Archive]: {
			name: i18n(I18nKey.archive, targetLang),
			url: getArchiveUrlWithLang(targetLang),
		},
	};
}

// 保持向后兼容
export const LinkPresets = getLinkPresets();
