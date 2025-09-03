---
title: 在 VS Code 扩展里安全嵌入 Vue SPA
published: 2025-09-03
description: 从资源路径、CSP、安全与通信四个方面，完整示例把 Vite 构建的 Vue 单页应用嵌入 VS Code Webview。
tags: ["VS Code", "Webview", "Vue", "Vite"]
category: 技术
draft: false
license: cc_by_nc_4_0
lang: "zh_cn"
---

# 在 VS Code 扩展里安全嵌入 Vue SPA

这篇文章以“角色卡管理器”为例，演示如何把一个由 Vite 构建的 Vue 单页应用（SPA）无缝嵌入到 VS Code 扩展的 Webview 中，并系统性解决三大痛点：

- 静态资源路径：确保脚本、样式、图片、动态导入都能正确加载
- CSP 限制：在安全的前提下允许必需的资源与请求
- Webview ↔ 扩展通信：与扩展后端可靠地交换数据

## 项目结构建议

```txt license:cc_by_nc_4_0
packages/
  webview/                  # Vue + Vite 前端工程
    dist/spa/               # 产物目录（被扩展引用）
src/
  extension/                # 扩展端代码
  media/                    # 运行时辅助脚本（resource-mapper.js 等）
```

扩展端通过 `localResourceRoots` 允许访问 `dist/spa` 与 `media`，并把 `index.html` 读入后重写资源路径与注入 CSP。

## 创建与复用 WebviewPanel

```ts license:cc_by_nc_4_0
// 代码示例 - 基于 CC BY-NC 4.0 许可证
// Code example - Licensed under CC BY-NC 4.0
const panel = vscode.window.createWebviewPanel(
  "andreaRoleCardManager",
  "角色卡管理器",
  vscode.ViewColumn.One,
  {
    enableScripts: true,
    retainContextWhenHidden: true,
    localResourceRoots: [
      spaRoot,
      vscode.Uri.joinPath(ctx.extensionUri, "media"),
    ],
  }
);
```

复用面板时只需 `reveal()` 并刷新 HTML；首次创建时请设置好 `localResourceRoots` 与 `enableScripts`。

## 资源路径：一切都走 asWebviewUri

Webview 是隔离环境，磁盘路径或相对路径都不可直接用，必须通过 `webview.asWebviewUri(vscode.Uri)` 转换成安全 URL。

典型做法：

1. 读取构建后的 `index.html`

2. 重写标签属性：把 `<script|link|img|source|video|audio|iframe>` 的 `src/href` 统一替换为 `asWebviewUri` 生成的 URL。

3. 处理 JS/CSS 内的路径：补齐 `/assets/...`、`./assets/...`，以及 `import()`、`url(...)` 等动态引用。

核心思想是“构建期 + 运行时双保险”：

- 构建期：用正则或解析器把常见的 `src/href`、`/assets/` 统一改写；
- 运行时：注入资源映射器，拦截后续动态插入的节点与网络请求，确保依旧指向可达的 URL。

## 运行时资源映射器（最小思路）

```js license:cc_by_nc_4_0
// 代码示例 - 基于 CC BY-NC 4.0 许可证
// Code example - Licensed under CC BY-NC 4.0

// 1) 注入全局映射：把 /assets/file → asWebviewUri 对应结果
window.__vscode_resource_map__ = { '/assets/app.js': 'https://.../app.js', ... }
window.__vscode_resource_baseUri__ = 'https://.../spa'

// 2) transformPath：把一切本地路径改写成上面的可达 URL
function transformPath(p) {
  // 放过 http/https/data/blob/javascript
  // /assets 与 ./assets、assets 统一拼成 baseUri + /assets/...
}

// 3) 挂钩常见入口：
// - 元素属性：HTMLScriptElement.src / HTMLLinkElement.href / HTMLImageElement.src...
// - fetch / XMLHttpRequest.open
// - MutationObserver 监听新增节点并重写
```

这样即使 Vue 组件在运行时动态创建 `<img>`、`<script>`，或用 `fetch('/assets/x.json')`，也能被自动修正。

## 内容安全策略（CSP）

推荐策略（根据需要裁剪）：

```html license:cc_by_nc_4_0
<!-- 代码示例 - 基于 CC BY-NC 4.0 许可证 -->
<!-- Code example - Licensed under CC BY-NC 4.0 -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'none';
  img-src {{webview.cspSource}} https: data: blob:;
  style-src {{webview.cspSource}} 'unsafe-inline';
  font-src {{webview.cspSource}} data:;
  script-src {{webview.cspSource}} https: 'unsafe-inline';
  connect-src {{webview.cspSource}} https:;
  frame-src 'none';
  worker-src {{webview.cspSource}} blob:;
  child-src {{webview.cspSource}} blob:;
"
/>
```

说明：

- `{{webview.cspSource}}` 实际运行时由 `webview.cspSource` 替换
- 如必须使用内联脚本，尽量控制在“注入全局数据”等极少量场景
- 如果需要访问接口域名，请把域名加入 `connect-src`

## Webview ↔ 扩展通信

前端（Webview）：

```ts license:cc_by_nc_4_0
// 代码示例 - 基于 CC BY-NC 4.0 许可证
// Code example - Licensed under CC BY-NC 4.0
const vscode = acquireVsCodeApi();

// 请求数据
vscode.postMessage({ type: "requestRoleCards" });

// 接收数据
window.addEventListener("message", (e) => {
  if (e.data?.type === "roleCards") {
    render(e.data.list);
  }
});

// 保存
function save(list) {
  vscode.postMessage({ type: "saveRoleCards", list });
}
```

扩展端：

```ts license:cc_by_nc_4_0
// 代码示例 - 基于 CC BY-NC 4.0 许可证
// Code example - Licensed under CC BY-NC 4.0
panel.webview.onDidReceiveMessage(async (msg) => {
  if (msg?.type === "requestRoleCards") {
    panel.webview.postMessage({ type: "roleCards", list });
  } else if (msg?.type === "saveRoleCards") {
    // 校验并持久化
    panel.webview.postMessage({ type: "saveAck", ok: true });
  }
});
```

## 开发与调试建议

- 前端使用 `vite build --watch` 连续输出到 `dist/spa`
- 扩展端 F5 启动 “Extension Development Host”，重载即可验证
- 不直接接入 Vite Dev Server（CSP 与源隔离更复杂，且与发布环境不一致）
- 打开 Webview 开发者工具观察 Network 与 CSP 报错

## 常见问题排查

- 图片/CSS 不加载：检查 `localResourceRoots`、路径重写、`asWebviewUri` 是否覆盖到了
- 前端路由 404：优先使用 Hash 路由，或自行把导航与内容托管在 Webview 内部状态
- CSP 报错：按报错提示补齐 `connect-src`、`script-src` 等来源

## 实战：预处理 HTML 与动态注入 JS 劫持（MPL-2.0）

下面给出一套可直接落地的实现，分为：

- 扩展端：读取构建产物的 index.html，批量重写资源路径、注入 CSP 与运行时代码，并输出给 Webview。
- Webview 端：动态资源映射器，拦截 DOM 属性、fetch/XMLHttpRequest、MutationObserver 等入口，统一把 /assets 等路径改写为可达 URL。

许可说明：本文非代码部分以 CC BY-NC 4.0 授权；本小节内的“示例代码”以 Mozilla Public License 2.0（MPL-2.0）授权，你可以复制、修改并在满足 MPL-2.0 的前提下分发。

### 扩展端：HTML 预处理与注入（TypeScript, MPL-2.0）

```ts license:mpl_2_0
/*
 * This file is licensed under the Mozilla Public License 2.0 (MPL-2.0).
 * SPDX-License-Identifier: MPL-2.0
 */
import * as vscode from "vscode";
import * as fs from "fs";

export function buildHtml(
  webview: vscode.Webview,
  spaRoot: vscode.Uri,
  opts?: {
    connectSrc?: string[];
    resourceMapperScriptUri?: string; // 已通过 asWebviewUri 转换
  }
) {
  const indexHtmlPath = vscode.Uri.joinPath(spaRoot, "index.html").fsPath;
  if (!fs.existsSync(indexHtmlPath)) {
    return `<html><body><h3>Webview</h3><p>index.html 未找到：<code>${indexHtmlPath}</code></p></body></html>`;
  }

  let html = fs.readFileSync(indexHtmlPath, "utf-8");
  html = rewriteHtmlToWebviewUris(html, webview, spaRoot);
  html = fixAllAssetUrls(html, webview, spaRoot);
  html = injectResourceMapper(
    html,
    webview,
    spaRoot,
    opts?.resourceMapperScriptUri
  );
  html = stripBaseTag(html);
  html = applyCsp(html, webview, opts?.connectSrc ?? ["https:", "http:"]);
  return html;
}

type Attr = "src" | "href";
function rewriteHtmlToWebviewUris(
  html: string,
  webview: vscode.Webview,
  spaRoot: vscode.Uri
): string {
  const fixRelFromVscodeWebview = (u: string) =>
    u.replace(/^vscode-webview:\/\/[^/]+\//i, "");
  const replaceAttr = (tag: string, attr: Attr) => {
    const re = new RegExp(
      `<${tag}\\b([^>]*?)\\s${attr}\\s*=\\s*(?:"([^"]+)"|'([^']+)'|([^\\s>]+))([^>]*)>`,
      "gi"
    );
    html = html.replace(re, (m, pre, g1, g2, g3, post) => {
      const raw = g1 ?? g2 ?? g3 ?? "";
      if (/^(data:|mailto:|javascript:|#|https?:)/i.test(raw)) return m;
      const rel = fixRelFromVscodeWebview(raw).replace(/^\.\/?/, "");
      const fileUri = vscode.Uri.joinPath(spaRoot, rel);
      const webUri = webview.asWebviewUri(fileUri).toString();
      const quoted =
        g1 != null ? `"${webUri}"` : g2 != null ? `'${webUri}'` : webUri;
      return `<${tag}${pre} ${attr}=${quoted}${post}>`;
    });
  };
  ["script", "link", "img", "source", "video", "audio", "iframe"].forEach(
    (t) => {
      replaceAttr(t, t === "link" ? "href" : "src");
    }
  );
  return html;
}

function fixAllAssetUrls(
  html: string,
  webview: vscode.Webview,
  spaRoot: vscode.Uri
): string {
  const base = webview.asWebviewUri(spaRoot).toString().replace(/\/$/, "");
  html = html.replace(
    /(\s(?:href|src)\s*=\s*)(["'])\/assets\//gi,
    (_m, p1, q) => `${p1}${q}${base}/assets/`
  );
  html = html.replace(
    /(\s(?:href|src)\s*=\s*)(["'])(?:\.\/)?assets\//gi,
    (_m, p1, q) => `${p1}${q}${base}/assets/`
  );
  html = html.replace(
    /(import\s*\(\s*)(["'`])([^"'`]*\/assets\/[^"'`]*)\2/g,
    (_m, pre, q, p) => `${pre}${q}${base}/${p.replace(/^\.?\//, "")}${q}`
  );
  html = html.replace(/(["'`])\/assets\//g, `$1${base}/assets/`);
  html = html.replace(/(["'`])\.\/assets\//g, `$1${base}/assets/`);
  return html;
}

function injectResourceMapper(
  html: string,
  webview: vscode.Webview,
  spaRoot: vscode.Uri,
  mapperScriptUri?: string
): string {
  const baseUri = webview.asWebviewUri(spaRoot).toString().replace(/\/$/, "");
  // 扫描 dist/spa/assets 目录，生成最小映射
  const assetsDir = vscode.Uri.joinPath(spaRoot, "assets").fsPath;
  const resourceMap: Record<string, string> = {};
  if (fs.existsSync(assetsDir)) {
    for (const f of fs.readdirSync(assetsDir)) {
      const key = `/assets/${f}`;
      resourceMap[key] = webview
        .asWebviewUri(vscode.Uri.joinPath(spaRoot, "assets", f))
        .toString();
    }
  }
  const safeMap = JSON.stringify(resourceMap)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
  const injectedData = `<script>window.__vscode_resource_map__=${safeMap};window.__vscode_resource_baseUri__="${baseUri}";<\/script>`;
  const mapperTag = mapperScriptUri
    ? `\n<script src="${mapperScriptUri}"><\/script>`
    : "";
  return html.replace(
    /<head([^>]*)>/i,
    `<head$1>\n${injectedData}${mapperTag}`
  );
}

function applyCsp(
  html: string,
  webview: vscode.Webview,
  connectSrc: string[] = []
): string {
  const connect = [webview.cspSource, ...connectSrc].join(" ");
  const csp = [
    `default-src 'none';`,
    `img-src ${webview.cspSource} https: data: blob:;`,
    `style-src ${webview.cspSource} 'unsafe-inline';`,
    `font-src ${webview.cspSource} data:;`,
    `script-src ${webview.cspSource} https: 'unsafe-inline';`,
    `connect-src ${connect};`,
    `frame-src 'none';`,
    `worker-src ${webview.cspSource} blob:;`,
    `child-src ${webview.cspSource} blob:;`,
  ].join(" ");
  const tag = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
  return /<meta http-equiv="Content-Security-Policy"/i.test(html)
    ? html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/i, tag)
    : html.replace(/<head([^>]*)>/i, `<head$1>\n  ${tag}`);
}

function stripBaseTag(html: string): string {
  return html.replace(/<base\s+[^>]*>/gi, "");
}
```

使用方式：在创建/复用 WebviewPanel 后，读取 `dist/spa/index.html` 并调用 `buildHtml`，把返回的 HTML 赋给 `panel.webview.html` 即可。

### Webview 端：动态资源映射器（JavaScript, MPL-2.0）

```js license:mpl_2_0
/*
 * This file is licensed under the Mozilla Public License 2.0 (MPL-2.0).
 * SPDX-License-Identifier: MPL-2.0
 */
(function () {
  var resourceMap = window.__vscode_resource_map__ || {};
  var baseUri = (window.__vscode_resource_baseUri__ || "").replace(/\/$/, "");

  function transformPath(path) {
    if (!path || typeof path !== "string") return path;
    if (path.startsWith(baseUri)) return path;
    try {
      const u = new URL(path);
      if (
        u.protocol === "vscode-webview:" &&
        u.pathname.startsWith("/assets/")
      ) {
        const key = u.pathname;
        return resourceMap[key] || baseUri + key;
      }
      if (/^(https?:|data:|blob:|javascript:)/i.test(u.protocol + ""))
        return path;
    } catch (_) {}
    if (path.startsWith("/assets/")) return resourceMap[path] || baseUri + path;
    if (path.startsWith("./assets/") || path.startsWith("assets/")) {
      const normalized = path.startsWith("./") ? path.slice(1) : "/" + path;
      return resourceMap[normalized] || baseUri + normalized;
    }
    if (/^(https?:|data:|blob:|javascript:)/i.test(path)) return path;
    const full = path.startsWith("/") ? path : "/" + path;
    return baseUri + full;
  }

  function patchURLProp(Ctor, prop) {
    try {
      const proto = Ctor && Ctor.prototype;
      if (!proto) return;
      const desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (!desc || !desc.set || !desc.get) return;
      Object.defineProperty(proto, prop, {
        configurable: true,
        enumerable: desc.enumerable,
        get() {
          return desc.get.call(this);
        },
        set(v) {
          try {
            v = transformPath(String(v));
          } catch (_) {}
          return desc.set.call(this, v);
        },
      });
    } catch (_) {}
  }

  patchURLProp(HTMLScriptElement, "src");
  patchURLProp(HTMLLinkElement, "href");
  patchURLProp(HTMLImageElement, "src");
  patchURLProp(HTMLSourceElement, "src");
  patchURLProp(HTMLIFrameElement, "src");
  patchURLProp(HTMLMediaElement, "src");

  const _setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    try {
      if (
        typeof value === "string" &&
        /^(src|href|srcset)$/i.test(String(name))
      ) {
        value = transformPath(value);
      }
    } catch (_) {}
    return _setAttr.call(this, name, value);
  };

  function rewriteCssUrls(cssText) {
    if (!cssText) return cssText;
    cssText = cssText.replace(
      /url\(\s*(['"]?)(?!data:|blob:)(\/?\.?assets\/[^'")\s?#]+(?:[?#][^'")]*)?)\1\s*\)/gi,
      (_m, q, p) => {
        let path = p;
        if (path.startsWith("./")) path = path.slice(1);
        if (path.startsWith("assets/")) path = "/" + path;
        if (!path.startsWith("/assets/")) return _m;
        const mapped = resourceMap[path] || baseUri + path;
        return "url(" + (q || "") + mapped + (q || "") + ")";
      }
    );
    cssText = cssText.replace(
      /@import\s+(?:url\(\s*(['"]?)(\/?\.?assets\/[^'\")\s;]+)\1\s*\)|(['"])(\/?\.?assets\/[^'\")\s;]+)\3)\s*;/gi,
      (_m, q1, p1, q2, p2) => {
        let path = p1 || p2;
        if (path.startsWith("./")) path = path.slice(1);
        if (path.startsWith("assets/")) path = "/" + path;
        if (!path.startsWith("/assets/")) return _m;
        const mapped = resourceMap[path] || baseUri + path;
        const q = q1 || q2 || "";
        return "@import url(" + q + mapped + q + ");";
      }
    );
    return cssText;
  }

  async function inlineStylesheet(linkEl) {
    try {
      if (!linkEl || linkEl.dataset.__inlined_css__) return;
      if (!/stylesheet/i.test(linkEl.rel || "")) return;
      if (!linkEl.href) return;
      const href = transformPath(linkEl.href);
      const res = await fetch(href, { credentials: "same-origin" });
      if (!res.ok) throw new Error("css fetch " + res.status);
      const css = await res.text();
      const fixed = rewriteCssUrls(css);
      const style = document.createElement("style");
      style.setAttribute("data-vscode-webview-inlined", "1");
      style.textContent = fixed;
      linkEl.dataset.__inlined_css__ = "1";
      linkEl.parentNode && linkEl.parentNode.insertBefore(style, linkEl);
      linkEl.remove();
    } catch (e) {
      try {
        linkEl.href = transformPath(linkEl.href);
      } catch (_) {}
      console.warn("inlineStylesheet failed:", e);
    }
  }

  var originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = function (url, options) {
      if (typeof url === "string")
        return originalFetch.call(this, transformPath(url), options);
      if (url && typeof url.url === "string") {
        var req = url;
        var newUrl = transformPath(req.url);
        if (newUrl !== req.url) {
          try {
            url = new Request(newUrl, req);
          } catch (_) {
            return originalFetch.call(
              this,
              newUrl,
              options || { method: req.method, headers: req.headers }
            );
          }
        }
      }
      return originalFetch.call(this, url, options);
    };
  }

  var X = window.XMLHttpRequest && window.XMLHttpRequest.prototype;
  if (X && X.open) {
    var origOpen = X.open;
    X.open = function (method, url) {
      try {
        if (typeof url === "string") arguments[1] = transformPath(url);
      } catch (_) {}
      return origOpen.apply(this, arguments);
    };
  }

  if (typeof window.__vitePreload !== "undefined") {
    var origPreload = window.__vitePreload;
    window.__vitePreload = function (fn, deps, path) {
      if (deps && Array.isArray(deps)) deps = deps.map((d) => transformPath(d));
      if (path) path = transformPath(path);
      return origPreload.call(this, fn, deps, path);
    };
  }

  function rewriteEl(el) {
    const tag = el.tagName;
    if (tag === "LINK") {
      const rel = (el.rel || "").toLowerCase();
      if (rel.includes("stylesheet")) {
        inlineStylesheet(el);
        return;
      }
      if (el.href) {
        const next = transformPath(el.href);
        if (next !== el.href) el.href = next;
      }
      return;
    }
    if (tag === "SCRIPT" && el.src) {
      const next = transformPath(el.src);
      if (next !== el.src) el.src = next;
      return;
    }
    if (
      (tag === "IMG" ||
        tag === "SOURCE" ||
        tag === "VIDEO" ||
        tag === "AUDIO") &&
      el.src
    ) {
      const next = transformPath(el.src);
      if (next !== el.src) el.src = next;
    }
    if (el.hasAttribute && el.hasAttribute("srcset")) {
      try {
        const raw = el.getAttribute("srcset") || "";
        const parts = raw
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);
        const fixed = parts
          .map((p) => {
            const sp = p.split(/\s+/);
            sp[0] = transformPath(sp[0]);
            return sp.join(" ");
          })
          .join(", ");
        if (fixed !== raw) el.setAttribute("srcset", fixed);
      } catch (_) {}
    }
  }

  if (typeof MutationObserver !== "undefined") {
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "childList") {
          m.addedNodes &&
            m.addedNodes.forEach((n) => {
              if (n && n.nodeType === 1) {
                rewriteEl(n);
                n.querySelectorAll?.(
                  "link[rel],script[src],img[src],source[src],video[src],audio[src],[srcset]"
                ).forEach(rewriteEl);
              }
            });
        } else if (m.type === "attributes") {
          rewriteEl(/** @type {Element} */ (m.target));
        }
      }
    });
    const start = () => {
      mo.observe(document.documentElement || document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["href", "src", "srcset", "rel"],
      });
      document
        .querySelectorAll(
          "link[rel],script[src],img[src],source[src],video[src],audio[src],[srcset]"
        )
        .forEach(rewriteEl);
    };
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", start, { once: true })
      : start();
  }

  console.log("VSCode Webview resource mapper initialized");
  console.log("Base URI:", baseUri);
})();
```

要点回顾：

- 扩展端始终以 `webview.asWebviewUri` 作为“真相源”；
- Webview 端只做兜底修复，确保动态新增节点与网络请求同样可达；
- 两侧配合 CSP，既安全又稳定。

> 以上示例代码以 MPL-2.0 授权；若你在项目中使用，请保留许可头与变更说明。

## 小结

把 Vue SPA 嵌入 VS Code Webview 的关键是“资源可达且安全”。

通过：

- 全量走 `asWebviewUri` 暴露静态资源
- 运行时资源映射器兜底动态引用
- 严格且可控的 CSP 配置
- 明确的数据通信协议

即可实现稳定、安全的嵌入式前端体验。后续你可以叠加数据持久化（全局存储/工作区文件）、多语言与主题适配等能力。
