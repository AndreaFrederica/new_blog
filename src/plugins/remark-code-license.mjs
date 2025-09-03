import { visit } from "unist-util-visit";

/**
 * Remark plugin to add license information to code blocks
 * 动态读取许可证配置，避免硬编码
 */
export default function remarkCodeLicense(options = {}) {
  return (tree, file) => {
    visit(tree, "code", (node, index, parent) => {
      if (!node.meta) return;

      // 解析许可证配置
      const licenseConfig = parseLicenseMeta(node.meta);
      if (!licenseConfig) return;

      // 创建许可证元素
      const licenseElement = createLicenseElement(licenseConfig);

      // 在代码块前插入许可证信息
      if (parent && typeof index === "number") {
        parent.children.splice(index, 0, licenseElement);
        return index + 2; // 跳过新插入的节点
      }
    });
  };
}

/**
 * 解析代码块 meta 中的许可证配置
 */
function parseLicenseMeta(meta) {
  // 匹配 license: 后面的内容
  const licenseMatch = meta.match(/license:(.+?)(?=\s|$)/);
  if (!licenseMatch) return null;

  const licenseStr = licenseMatch[1].trim();

  // JSON格式：license:{"id":"custom","name":"My License","url":"https://example.com"}
  if (licenseStr.startsWith("{") && licenseStr.endsWith("}")) {
    try {
      const config = JSON.parse(licenseStr.replace(/'/g, '"'));
      return { ...config, type: "custom" };
    } catch (error) {
      console.warn("无法解析JSON许可证配置:", licenseStr);
      return null;
    }
  }

  // 简单文本格式：license:"Custom License Text"
  if (licenseStr.startsWith('"') && licenseStr.endsWith('"')) {
    return {
      type: "text",
      name: licenseStr.slice(1, -1),
    };
  }

  // 键值对格式：license:custom_id,name:"My License",url:"https://example.com"
  if (licenseStr.includes(",")) {
    const parts = licenseStr.split(",");
    const id = parts[0].trim();
    const config = { id, type: "manual" };

    // 解析键值对 key:"value"
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].trim();
      const match = part.match(/(\w+):"([^"]*)"/);
      if (match) {
        config[match[1]] = match[2];
      }
    }

    return config;
  }

  // 简单ID格式：license:mit
  return { id: licenseStr, type: "predefined" };
}

/**
 * 创建许可证信息元素
 */
function createLicenseElement(config) {
  const children = [];

  // 添加前缀图标和文本
  children.push({
    type: "text",
    value: "📄 ",
  });

  // 根据配置类型处理
  if (config.type === "predefined") {
    // 预定义许可证 - 使用许可证配置中的信息
    const licenseInfo = getPredefinedLicenseInfo(config.id);

    children.push({
      type: "link",
      url: licenseInfo.url,
      children: [{ type: "text", value: licenseInfo.name }],
    });
  } else if (config.type === "text") {
    // 纯文本许可证
    children.push({
      type: "text",
      value: config.name || "自定义许可证",
    });
  } else if (config.type === "manual") {
    // 手动配置的许可证
    // 添加自定义图标
    if (config.icon) {
      children.push({
        type: "text",
        value: config.icon + " ",
      });
    }

    // 添加许可证名称/链接
    const displayName = config.name || config.id || "未命名许可证";
    if (config.url) {
      children.push({
        type: "link",
        url: config.url,
        children: [{ type: "text", value: displayName }],
      });
    } else {
      // 没有URL，显示为纯文本
      children.push({
        type: "text",
        value: displayName,
      });
    }

    // 添加徽章
    if (config.badge) {
      children.push({ type: "text", value: " " });
      children.push({
        type: "image",
        url: config.badge,
        alt: `${displayName} Badge`,
        title: `${displayName} Badge`,
      });
    }
  } else {
    // 自定义许可证（JSON格式）
    // 添加自定义图标
    if (config.icon) {
      children.push({
        type: "text",
        value: config.icon + " ",
      });
    }

    // 添加许可证名称/链接
    if (config.url && config.name) {
      children.push({
        type: "link",
        url: config.url,
        children: [{ type: "text", value: config.name }],
      });
    } else if (config.name) {
      children.push({ type: "text", value: config.name });
    } else {
      children.push({ type: "text", value: "自定义许可证" });
    }

    // 添加徽章
    if (config.badge) {
      children.push({ type: "text", value: " " });
      children.push({
        type: "image",
        url: config.badge,
        alt: `${config.name || "许可证"} Badge`,
        title: `${config.name || "许可证"} Badge`,
      });
    }
  }

  return {
    type: "paragraph",
    data: {
      hProperties: {
        className: ["code-license-info"],
        "data-license-id": config.id || "unknown",
      },
    },
    children: children,
  };
}

/**
 * 获取预定义许可证信息（静态数据，避免复杂导入）
 */
function getPredefinedLicenseInfo(id) {
  // 这里使用静态配置，与许可证JSON文件保持一致
  const licenses = {
    mit: {
      name: "MIT 许可证",
      url: "/license/mit",
    },
    cc_by_nc_4_0: {
      name: "CC BY-NC 4.0",
      url: "/license/cc_by_nc_4_0",
    },
    mpl_2_0: {
      name: "Mozilla 公共许可证 2.0",
      url: "/license/mpl_2_0",
    },
    apache_2_0: {
      name: "Apache 许可证 2.0",
      url: "/license/apache_2_0",
    },
    cc_by_4_0: {
      name: "CC BY 4.0",
      url: "/license/cc_by_4_0",
    },
    gpl_3_0: {
      name: "GNU 通用公共许可证 v3.0",
      url: "/license/gpl_3_0",
    },
    bsd_3_clause: {
      name: "BSD 3-Clause 许可证",
      url: "/license/bsd_3_clause",
    },
    all_rights_reserved: {
      name: "保留所有权利",
      url: "/license/all_rights_reserved",
    },
    gfdl_1_3: {
      name: "GNU 自由文档许可证 1.3",
      url: "/license/gfdl_1_3",
    },
  };

  return (
    licenses[id] || {
      name: id.toUpperCase().replace(/_/g, " "),
      url: `/license/${id}`,
    }
  );
}
