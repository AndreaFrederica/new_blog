// 语言包 import 移除，直接用字符串代码

export type LicenseItem = {
	id: string;
	name: Record<string, string>; // 语言代码到名称
	url: string;
	doc?: string; // optional markdown doc filename located in this folder
	icon?: string; // 许可证图标 URL 或图标名称
	badge?: string; // 许可证徽章 URL
	official_url?: string; // 官方许可证链接
};

// 自定义许可证配置类型
export type CustomLicenseConfig = {
	id?: string;
	name?: string | Record<string, string>;
	url?: string;
	icon?: string;
	badge?: string;
	official_url?: string;
};

import all_rights_reserved from "./all_rights_reserved.json";
import apache_2_0 from "./apache_2_0.json";
import cc_by_4_0 from "./cc_by_4_0.json";
import cc_by_nc_4_0 from "./cc_by_nc_4_0.json";
import gfdl_1_3 from "./gfdl_1_3.json";
import mit from "./mit.json";
import mpl_2_0 from "./mpl_2_0.json";

export const licenses: LicenseItem[] = [
	all_rights_reserved,
	cc_by_4_0,
	cc_by_nc_4_0,
	mit,
	apache_2_0,
	gfdl_1_3,
	mpl_2_0,
];

export function getLicenseById(id: string): LicenseItem | undefined {
	return licenses.find((l) => l.id === id);
}

export function getLicenseName(id: string, lang = "zh_cn") {
	const lic = getLicenseById(id);
	if (!lic) return "";
	return lic.name[lang] || lic.name["zh_cn"] || lic.name["en"] || "";
}

export function getLicenseUrl(id: string): string {
	const lic = getLicenseById(id);
	return lic?.url || "";
}

export function getLicenseIcon(id: string): string {
	const lic = getLicenseById(id);
	return lic?.icon || "";
}

export function getLicenseBadge(id: string): string {
	const lic = getLicenseById(id);
	return lic?.badge || "";
}

export function getLicenseOfficialUrl(id: string): string {
	const lic = getLicenseById(id);
	return lic?.official_url || "";
}

// 解析许可证配置，支持预配置许可证ID或自定义配置
export function resolveLicense(
	config: string | CustomLicenseConfig,
	defaultLang = "zh_cn",
): LicenseItem | null {
	// 如果是字符串，则作为预配置许可证ID处理
	if (typeof config === "string") {
		const predefined = getLicenseById(config);
		if (predefined) {
			return predefined;
		}
		// 如果找不到预配置许可证，返回null
		return null;
	}

	// 如果是对象，则处理自定义配置
	const customConfig = config as CustomLicenseConfig;

	// 如果指定了ID，优先使用预配置许可证作为基础
	let baseLicense: LicenseItem | undefined;
	if (customConfig.id) {
		baseLicense = getLicenseById(customConfig.id);
	}

	// 构建最终的许可证配置
	const resolvedLicense: LicenseItem = {
		id: customConfig.id || baseLicense?.id || "custom",
		name:
			typeof customConfig.name === "string"
				? { [defaultLang]: customConfig.name }
				: customConfig.name ||
					baseLicense?.name || { [defaultLang]: "Custom License" },
		url: customConfig.url || baseLicense?.url || "#",
		doc: baseLicense?.doc,
		icon: customConfig.icon || baseLicense?.icon,
		badge: customConfig.badge || baseLicense?.badge,
		official_url: customConfig.official_url || baseLicense?.official_url,
	};

	return resolvedLicense;
}

// 格式化许可证信息为显示用的字符串
export function formatLicenseInfo(
	config: string | CustomLicenseConfig,
	lang = "zh_cn",
): {
	name: string;
	url: string;
	icon?: string;
	badge?: string;
	official_url?: string;
} | null {
	const license = resolveLicense(config, lang);
	if (!license) return null;

	return {
		name:
			license.name[lang] ||
			license.name["zh_cn"] ||
			license.name["en"] ||
			"Unknown License",
		url: license.url,
		icon: license.icon,
		badge: license.badge,
		official_url: license.official_url,
	};
}
