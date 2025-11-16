import I18nKey from "./i18n/i18nKey";
import { i18n } from "./i18n/translation";
import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: i18n(I18nKey.siteTitle),
	subtitle: "AndreaFrederica-SirrusStudio",
	lang: "zh_cn", // Language code, e.g. 'en', 'zh_cn', 'ja', etc.
	defaultLang: "zh_cn", // 默认语言
	supportedLangs: ["zh_cn", "en", "ja", "ru"], // 支持的语言列表
	showLanguageSwitcher: true, // 是否显示语言切换器
	themeColor: {
		hue: 55, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: true, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/banner.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "bottom", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 6, // Maximum heading depth to show in the table, from 1 to 6
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
			src: "/favicon/favicon.svg", // Path of the favicon, relative to the /public directory
			//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
			//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		{ name: "Notes", url: "/notes" }, // 这里会被动态替换
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: i18n(I18nKey.novelHelper, "zh_cn"),
			url: "https://anh.sirrus.cc",
			external: true, // Show an external link icon and will open in a new tab
		},

		//{
		//	name: "GitHub",
		//	url: "https://github.com/saicaca/fuwari", // Internal links should not include the base path, as it is automatically added
		//	external: true, // Show an external link icon and will open in a new tab
		//},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	footerImage: "assets/images/icon.svg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "AndreaFrederica",
	bio: "...",
	links: [
		// {
		// 	name: "OSHWLab",
		// 	icon: "simple-icons:opensourcehardware", // Visit https://icones.js.org/ for icon codes
		// 	// You will need to install the corresponding icon set if it's not already included
		// 	// `pnpm add @iconify-json/<icon-set-name>`
		// 	url: "https://oshwlab.com/AndreaFrederica",
		// },
		{
			name: "Gitee",
			icon: "simple-icons:gitee",
			url: "https://gitee.com/gysdfhome",
		},
		// {
		// 	name: "Pixiv",
		// 	icon: "fa6-brands:pixiv",
		// 	url: "https://www.pixiv.net/users/19920302",
		// },
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/AndreaFrederica",
		},
		// {
		// 	name: "Hugging Face",
		// 	icon: "simple-icons:huggingface",
		// 	url: "https://huggingface.co/AndreaFrederica",
		// },
	],
};

import { getLicenseName, getLicenseUrl } from "./licenses";

// 许可证配置函数，name 和 url 始终跟随用户语言
export function getLicenseConfig(currentLang: string) {
	return {
		enable: true,
		// 默认协议 id：未在文章/随笔中声明时，保留所有权利
		id: "all_rights_reserved",
		name: getLicenseName("all_rights_reserved", currentLang),
		url: getLicenseUrl("all_rights_reserved"),
	};
}

// 获取当前语言下的默认许可证信息
// 保持兼容性，getDefaultLicense 直接返回 getLicenseConfig(currentLang) 的结果
export function getDefaultLicense(currentLang: string) {
	return getLicenseConfig(currentLang);
}

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
