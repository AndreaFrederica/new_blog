---
title: VS Code Git集成与各大平台私有仓库使用指南（小说助手专用）
published: 2025-09-08
description: 掌握VS Code Git集成，让版本控制变得简单！这篇图解指南从基础到进阶，涵盖仓库初始化、分支管理、冲突解决、历史追溯等核心功能，搭配详细的操作截图和实用技巧。同时深度解析各大代码托管平台的私有仓库创建、权限管理、CI/CD配额等实用攻略。无论是小说写作项目还是代码开发，都能让你高效管理版本历史，告别版本混乱的烦恼。
tags: ["小说助手", "使用说明", "vscode"]
category: 小说助手
draft: false
license: cc_by_nc_4_0
lang: "zh_cn"
---

> **小说助手官网：** [https://anh.sirrus.cc](https://anh.sirrus.cc)

# VS Code Git 集成使用指南（图解）

> 适用版本：VS Code 桌面版与 Web（大部分功能相同）。默认已安装 Git（建议 `>= 2.0.0`）。

---

## 🎯 特别说明：小说助手用户必读

### 什么是版本管理？

版本管理就像是您小说的"时光机"，可以：

- **保存写作进度**：每次修改都会被记录，不会丢失
- **回退到任意版本**：写错了可以回到之前的正确版本
- **比较修改内容**：清楚看到每次修改了什么
- **多人协作**：团队成员可以同时编辑，互不干扰

### 为什么小说助手需要 Git？

小说助手已经为您创建了本地仓库，但要实现：

- ✅ **云端备份**：防止本地文件丢失
- ✅ **多设备同步**：在家和公司都能继续写作
- ✅ **版本回溯**：不满意的修改可以撤销
- ✅ **协作写作**：多人共同创作同一部小说

---

## 📋 小说助手专用 Git 工作流程

### 步骤 1：查看更改

打开小说助手项目后，在 VS Code 中按 `Ctrl+Shift+G` 进入源代码管理视图：

![Git 概览](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/overview.png)

您会看到：

- **CHANGES**：您修改的文件列表
- **STAGED CHANGES**：准备提交的文件
- **MESSAGE**：提交信息的输入框

### 步骤 2：暂存更改

在 CHANGES 中点击文件旁的 `+` 按钮，将修改添加到暂存区：

![Diff 视图（左右对比）](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/diff.png)

> 💡 **小贴士**：绿色部分是新增内容，红色部分是删除内容

### 步骤 3：提交更改

1. 在 MESSAGE 框中输入提交信息（如："更新第 5 章开头"）
2. 点击 ✅ 提交按钮，或按 `Ctrl+Enter`

![更多操作菜单](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/scm-more-actions.png)

### 步骤 4：推送到云端

1. 点击右上角的同步按钮 🔄
2. 选择 **Push** 将本地提交上传到 GitHub
3. 选择 **Pull** 从 GitHub 下载最新更新

---

## 🔄 小说助手用户日常同步操作

- **写作前**：先执行 **Pull** 确保获取最新版本
- **写作中**：每完成一个段落或章节就提交一次
- **写作后**：执行 **Push** 保存到云端
- **多设备**：在另一台设备上先 **Pull** 获取最新内容

这样您的小说永远不会丢失，还可以随时回到任何一个写作阶段！

---

## 🛠️ 通用 Git 操作指南

- 安装 [Git](https://git-scm.com/downloads) 并确保终端能执行 `git --version`。
- VS Code 通过活动栏左侧的“源代码管理”图标进入 Git 视图（快捷键：**Windows/Linux：Ctrl+Shift+G；macOS：⌃⇧G**）。

![Git 概览](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/overview.png)

---

## 2) 打开或克隆仓库

### 打开项目或克隆

首次打开时，源代码管理视图会提供“Open Folder / Clone Repository”按钮：

![首次运行界面](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/firstrun-source-control.png)

- **Clone Repository**：输入远程地址（例如 GitHub）即可克隆：

![GitHub 克隆来源](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/GitHub-clone-dialog.png)
![在命令面板中输入仓库 URL](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/set-repo-URL.png)

### 初始化本地仓库

若当前文件夹不是 Git 仓库，点击 **Initialize Repository** 初始化；也可一键 **Publish to GitHub**：

![初始化仓库](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/initialize-repository.png)

---

### 3. 暂存（Stage）与提交（Commit）

在“源代码管理”视图中会分为 **CHANGES / STAGED CHANGES / MERGE CHANGES** 三块。

- 选择文件可在内置 **Diff 编辑器** 中查看变更；右侧编辑器仍可直接修改未暂存内容。
- 在 Diff 中间栏可以**逐块暂存/回退**（Stage/Revert hunk）。

![Diff 视图（左右对比）](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/diff.png)

更多提交相关操作可在右上角 **…（Views and More Actions）** 菜单找到：

![更多操作菜单](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/scm-more-actions.png)

> 小贴士：你也可以使用 Copilot 生成提交信息（在提交输入框的按钮处），或在编辑器中查看 blame 信息（可通过设置模板自定义显示）。

---

### 4. 分支与标签（Branches & Tags）

通过命令面板：**Git: Create Branch**、**Git: Checkout to…** 创建/切换分支或检出标签；也可从状态栏分支指示器切换。

![分支/标签选择](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/gitbranches.png)

---

### 5. 源代码控制图（Graph）

配置了远端后，可在 **Graph** 里看到**领先/落后**、提交流向等；右键提交可执行 **checkout / cherry-pick** 等操作，点文件可直接打开该提交的 diff。

![Graph 图形视图（incoming/outgoing）](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/incoming-outgoing-changes.png)

---

### 6. 查看历史：时间线（Timeline）

**Timeline** 视图（资源管理器底部）统一展示文件的时间序列事件（如 Git 提交）。选择某个提交即可打开当次变更的 diff。

![Timeline 视图](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/timeline-view.png)

---

### 7. VS Code 作为 Git 的编辑器/差异/合并工具

把 VS Code 配置为 Git 的外部工具（命令行执行）：

```ini
# 作为 Git 的编辑器（等待 VS Code 关闭）
git config --global core.editor "code --wait"

# 作为 difftool / mergetool
git config --global diff.tool default-difftool
git config --global difftool.default-difftool.cmd "code --wait --diff $LOCAL $REMOTE"

git config --global merge.tool code
git config --global mergetool.code.cmd "code --wait --merge $REMOTE $LOCAL $BASE $MERGED"
```

> 需要确保命令行可运行 `code --help`（macOS 可在命令面板执行 _Shell Command: Install 'Code' command in PATH_）。

---

### 8. 多仓库与其他 SCM

VS Code 可同时管理多个提供方与多个仓库：

- 在 **… → Views** 勾选 **Source Control Repositories** 显示多仓库面板：
  ![多仓库视图入口](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/scm-providers-list.png)
- 通过扩展安装其他 SCM 提供方（如 SVN、Hg）：
  ![SCM 提供方分类](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/scm-provider-category.png)

---

### 9. 常用操作速查

- 打开源代码管理视图：**Ctrl+Shift+G / ⌃⇧G（macOS）**
- 命令面板：**Ctrl+Shift+P / ⇧⌘P（macOS）** → 输入 `Git: ...`
- 暂存/取消暂存：在文件/区块处点击 `+` / `-`
- 提交：在顶部输入框填写信息，**Ctrl+Enter** 提交
- 比较任意两文件：资源管理器中 **右键文件 A → Select for Compare**，再在文件 B 上 **Compare with Selected**

---

## 🌐 各大代码托管平台私有仓库使用攻略

> 适用平台：**GitHub / GitLab.com / Bitbucket Cloud / Azure DevOps Repos / AWS CodeCommit / Gitee / Codeberg**
> 重点覆盖：创建私有仓库、邀请协作者与权限、可见性/公开设置、CI/CD 在私有仓库的配额与注意事项。

---

## 📊 平台总览对比

| 平台               | 是否支持免费私有仓库 |        协作/成员（免费档） | 可见性/公开设置                                  | CI/CD（私有仓库）                                               | 中国大陆可访问性                                                                                                                                                                                                      | 备注                                                                                                                                                                                                                  |
| ------------------ | -------------------- | -------------------------: | ------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub             | ✅ 支持              |      个人/组织免费计划可用 | 仓库可设为 Private / Public（企业还有 Internal） | 私有库享有每月**2,000** Actions 分钟（Free 账号；超出按量计费） | ⚠️ 偶尔不稳定                                                                                                                                                                                               | 私有库 Actions 配额与套餐关联。[GitHub Docs](https://docs.github.com/get-started/learning-about-github/githubs-products)                                                                                              |
| GitLab.com         | ✅ 支持              |       Free 组**最多 5 人** | 项目可设 Private / Internal / Public             | Free 组合计 **400** 计算分钟/月（可自带 Runner 不计限）         | ⚠️ 需要加速服务                                                                                                                                                                                                | 公共/开源与付费档配额更高；可加购分钟。[about.gitlab.com](https://about.gitlab.com/pricing/)                                                                                                                          |
| Bitbucket Cloud    | ✅ 支持              |       Free **至多 5 用户** | 仓库一键勾选 "Private"                           | Pipelines 随套餐变动                                            | ⚠️ 偶尔不稳定                                                                                                                                                                                               | Free 限 5 用户但**无限私有仓库**。[atlassian.com](https://www.atlassian.com/licensing/bitbucket), [Atlassian Support](https://support.atlassian.com/bitbucket-cloud/docs/set-repository-privacy-and-forking-options/) |
| Azure DevOps Repos | ✅ 支持              | （随 Azure DevOps 用户数） | 项目/组织层可切换 Public/Private                 | Azure Pipelines 随订阅配额                                      | ✅ 访问顺畅                                                                                                                                                                                                 | 官方标注"**无限量**私有 Git 仓库"。[Azure](https://azure.microsoft.com/en-us/products/devops/repos), [Microsoft Learn](https://learn.microsoft.com/en-us/azure/devops/repos/get-started/                             |
| AWS CodeCommit     | ✅ 支持              |            按 IAM 身份授权 | **默认私有**，通过 IAM 控制访问                  | 与 CodeBuild/CodePipeline 集成                                  | ⚠️ 需要加速服务                                                                                                                                                                                                       | 官方定义为"托管**私有**Git 仓库"。[docs.aws.amazon.com](https://docs.aws.amazon.com/codecommit/latest/userguide/welcome.html)                                                                                         |
| Gitee              | ✅ 支持              |    个人/组织可创建私有仓库 | 新建时选择"是否开源：公开/私有"                  | Gitee/第三方 CI 可用                                            | ✅ 访问顺畅                                                                                                                                                                                                           | 帮助中心有"创建仓库/可见性"指引。[Gitee](https://gitee.com/help/articles/4120)                                                                                                                                        |
| Codeberg           | ⚠️ 有限支持          |           面向 FOSS 贡献者 | 可建私有库                                       | 自带 CI（Woodpecker/Forgejo Actions）                           | ❌ 访问受限                                                                                                                                                                                                           | 私有内容**建议 ≤ 100MB**（以公益使命为准）。[docs.codeberg.org](https://docs.codeberg.org/getting-started/faq/)                                                                                                       |

---

### GitHub（私有仓库）

**创建私有仓库**

1. 右上角 **+** → **New repository** → 选择 **Visibility: Private** → **Create repository**

**修改可见性**
仓库 **Settings → Danger Zone → Change repository visibility**，可在 Private / Public 间切换

**邀请协作与权限**
在仓库/组织下，添加协作者或通过团队授予权限

**私有库 CI/CD（GitHub Actions）**

- 公共库与自托管 Runner 免费
- **私有库**按套餐享有**每月分钟数**与存储配额（Free：2000 分钟/500MB）
- 超额按量付费

### GitLab.com（私有项目）

**私有可见性**
新建项目时选择 **Private**，或在项目设置切换 Private / Internal / Public

**成员与权限**
项目/组可邀请成员并配置角色；**Free 组上限 5 用户**

**私有库 CI/CD（GitLab CI/CD）**

- **Free**：每**顶级组**每月**400** 计算分钟（共享 Runner）
- 可**自带 Runner**不占限额；可加购分钟或升级

### Bitbucket Cloud（私有仓库）

**创建私有库**
**Create → Repository**，在仓库设置处勾选 **This is a private repository**

**协作与权限**
可对个人用户或用户组授予 **Admin/Write/Read** 等角色

**计费/用户数**
**Free** 方案**最多 5 用户**，但**无限私有仓库**

### Azure DevOps Repos（私有 Git 仓库）

**特性与创建**
Azure Repos **提供无限量私有 Git 仓库**；在项目内创建 Repo 即可

**公开/私有**
项目层支持 **Public/Private**；可在组织设置中调整可见性策略

### AWS CodeCommit（企业级私有）

**定位与访问控制**
CodeCommit 官方定义为**托管私有 Git 仓库**，访问由 **IAM 策略**控制，**默认私有**

**典型流程**

- 通过控制台创建仓库
- 为开发者配置 IAM（或 SSO）
- 选择 **HTTPS Git 凭据**或 **SSH** 访问

### Gitee（码云）

**创建与可见性**
右上角 **+ → 新建仓库**，在新建页选择"**是否开源：公开/私有**"

**权限与开源切换**
企业工作台下可在"功能设置 → 可见性"里切换，并有角色/权限配置

### Codeberg（社区公益托管）

**私有仓库政策**
以推动 **FOSS** 为使命：私有仓库**可用但非主要用例**；对活跃 FOSS 贡献者**允许 ~100MB 私有内容**

---

## 🔧 实操速查（通用 Git + 权限）

### 本地与远端连接

```bash
# 初始化并首次推送
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin <你的私有仓库HTTPS或SSH地址>
git push -u origin main
```

### 常见权限/私有要点

- **最小权限原则**：仅授予需要的读/写/管理员
- **保护主分支**：启用保护规则（强制 PR、评审、状态检查）
- **密钥与凭据**：使用 **SSH Key** 或平台令牌，CI 机密放入平台 **Secrets/Variables**
- **CI/CD 配额**：私有库常与套餐挂钩（分钟/存储/并发），超额需加购或自托管 Runner

---

## 💡 选型建议

**个人/小团队：**

- 想要生态丰富与招聘友好 → **GitHub**
- 更强 DevSecOps 一体化 → **GitLab.com**
- 与 Atlassian（Jira/Trello）联动 → **Bitbucket**

**企业/合规：**

- **Azure** 体系 → **Azure DevOps Repos**
- **AWS** 体系与内网/IAM 严管 → **CodeCommit**

**中国大陆网络体验：** **Gitee** 作为镜像/私有托管备选

**公益/开源情怀**且仅少量私密需求 → **Codeberg**

---

## 📚 参考与延伸

### VS Code Git 集成

- [VS Code Git 集成官方文档（中文）](https://vscode.js.cn/docs/sourcecontrol/overview)
- [VS Code Git 集成官方文档（英文）](https://code.visualstudio.com/docs/sourcecontrol/overview)
- [Git 入门指南](https://vscode.js.cn/docs/sourcecontrol/intro-to-git)
- [GitHub 在 VS Code 中的使用](https://vscode.js.cn/docs/sourcecontrol/github)
- [源代码管理常见问题](https://vscode.js.cn/docs/sourcecontrol/faq)

### 各大代码托管平台

- [GitHub：创建仓库 / 可见性 / Actions 计费](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [GitLab.com：可见性与权限 / 计算分钟](https://docs.gitlab.com/user/public_access/)
- [Bitbucket：创建仓库 / 私有设置](https://support.atlassian.com/bitbucket-cloud/docs/create-a-repository/)
- [Azure DevOps：私有仓库无限量](https://azure.microsoft.com/products/devops/repos)
- [AWS CodeCommit：私有 Git 仓库](https://docs.aws.amazon.com/codecommit/)
- [Gitee：创建仓库（公开/私有）](https://gitee.com/help/articles/4120)
- [Codeberg：私有仓库政策](https://docs.codeberg.org/getting-started/faq/)

---

**本文主要依据**：VS Code 官方文档《Using Git source control in VS Code》，涵盖了 Git ≥ 2.0.0 的要求、Source Control 视图、Clone/Initialize、Diff/Stage/Revert、Branches/Tags、Graph、Timeline 等功能，以及 `code --wait` 作为编辑器/差异/合并工具的配置方法。

**配图来源**：所有插图均取自 VS Code 官方文档对应资源，包括 overview、first-run、clone、set-repo-url、initialize、branches、diff、graph、timeline、SCM 视图与扩展分类等页面。
