// 语言包 import 移除，直接用字符串代码

export type LicenseItem = {
    id: string;
    name: Record<string, string>; // 语言代码到名称
    url: string;
    doc?: string; // optional markdown doc filename located in this folder
};

import all_rights_reserved from "./all_rights_reserved.json";
import apache_2_0 from "./apache_2_0.json";
import cc_by_4_0 from "./cc_by_4_0.json";
import cc_by_nc_4_0 from "./cc_by_nc_4_0.json";
import mit from "./mit.json";

export const licenses: LicenseItem[] = [
	all_rights_reserved,
	cc_by_4_0,
	cc_by_nc_4_0,
	mit,
	apache_2_0,
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
