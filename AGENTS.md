# AGENTS.md — Hanhj1145.github.io (fuwari)

基于 [Fuwari](https://github.com/saicaca/fuwari) 模板的个人技术博客。静态站点，支持多语言、全文搜索、暗色模式。

---

## 快速开始

```bash
pnpm dev          # 本地开发 localhost:4321
pnpm build        # astro build && pagefind --site dist
pnpm preview      # 预览构建产物
pnpm check        # astro check（类型 + 模板检查）
pnpm type-check   # tsc --noEmit --isolatedDeclarations
pnpm format       # biome format --write ./src
pnpm lint         # biome check --write ./src
pnpm new-post     # node scripts/new-post.js（新建博客文章脚手架）
```

- **包管理器**：仅支持 `pnpm` 9.14.4，`npm`/`yarn` 被 preinstall hook 拦截。
- **格式化/检查**：Biome 2.2.5，不是 ESLint/Prettier。`.svelte`/`.astro`/`.vue` 文件关闭了 `useConst`、`useImportType`、`noUnusedVariables`、`noUnusedImports`（模板中误报过多）。
- **CI 检查**：每次 push/PR 自动执行 `biome ci ./src` + `pnpm check` + `pnpm build`。

---

## 目录结构

```
hanhj1145.github.io/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml          # GitHub Pages 部署
│   │   ├── build.yml           # PR/推送时 astro check + build
│   │   └── biome.yml           # Biome 代码风格检查
│   ├── dependabot.yml          # 每日 npm 依赖更新
│   └── pull_request_template.md
├── public/                     # 静态资源（直接复制到 dist）
├── favicon/                    # 站点图标
├── scripts/
│   └── new-post.js             # 新文章脚手架
├── src/
│   ├── assets/
│   │   └── images/             # 图片资源（banner、封面等）
│   ├── components/
│   │   ├── control/            # 功能性组件（分页、返回顶部、按钮、标签）
│   │   ├── misc/               # 杂项组件（图片包装、许可协议、Markdown 容器）
│   │   └── widget/             # 侧边栏组件（分类、标签、TOC、系列、资料卡等）
│   ├── config.ts               # 站点统一配置入口
│   ├── constants/               # 常量定义（分页大小、主题模式、图标、链接预设）
│   ├── content/
│   │   ├── config.ts           # Astro content collection schema
│   │   ├── posts/              # 博客文章（Markdown）
│   │   └── spec/               # 独立页面（如关于页）
│   ├── i18n/
│   │   ├── i18nKey.ts          # 国际化 Key 枚举
│   │   ├── translation.ts      # 翻译分发器
│   │   └── languages/          # 具体语言文件（en, zh_CN, zh_TW）
│   ├── layouts/
│   │   ├── Layout.astro        # 根布局（HTML shell、主题、字体、OverlayScrollbars）
│   │   └── MainGridLayout.astro # 主网格布局（导航栏、Banner、侧边栏、内容区）
│   ├── pages/
│   │   ├── [...page].astro     # 分页首页
│   │   ├── posts/[...slug].astro # 文章详情页
│   │   ├── about.astro         # 关于页
│   │   ├── archive.astro       # 归档页
│   │   ├── robots.txt.ts       # 搜索引擎爬虫配置
│   │   └── rss.xml.ts          # RSS Feed
│   ├── plugins/                # remark/rehype/expressive-code 插件
│   ├── styles/                 # 全局样式（CSS 变量、Tailwind 组件层、过渡动画等）
│   ├── types/
│   │   └── config.ts           # TypeScript 类型定义
│   └── utils/                  # 工具函数（内容、日期、设置、URL）
├── astro.config.mjs            # Astro 配置
├── tailwind.config.cjs         # Tailwind 配置
├── svelte.config.js            # Svelte 配置（vitePreprocess）
├── biome.json                  # Biome 配置
├── tsconfig.json               # TypeScript 配置
└── package.json
```

---

## 技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| 框架 | [Astro](https://astro.build) | 5.13.10 |
| 交互组件 | [Svelte](https://svelte.dev) | 5.39.8 |
| CSS | [Tailwind CSS](https://tailwindcss.com) | 3.4 + `@tailwindcss/typography` |
| 代码块 | [Expressive Code](https://expressive-code.com) | 0.41.3 |
| 搜索 | [Pagefind](https://pagefind.app) | 1.4.0 |
| 页面过渡 | [Swup](https://swup.js.org) | 通过 `@swup/astro` |
| 数学公式 | KaTeX | 0.16.23 |
| 图标 | Iconify (Font Awesome 6 + Material Symbols) | |
| 格式化/检查 | [Biome](https://biomejs.dev) | 2.2.5 |
| 部署 | GitHub Pages + `withastro/action` | |
| 包管理器 | pnpm | 9.14.4 |

---

## 架构与数据流

```
Markdown 文章
    │
    ▼
Astro Content Collections (src/content/config.ts)
    │  schema 校验 → 类型安全的条目
    ▼
getStaticPaths() / 页面组件
    │  读取 collection → 排序 → 分页
    ▼
Layout 组件 (MainGridLayout → Layout)
    │  HTML shell → CSS 变量 → 主题 → 字体
    ▼
Component 组件树
    │  Widget / Control / Misc 各司其职
    ▼
静态 HTML + Svelte 交互水合
```

**构建流程：**
1. Astro 读取 `src/content/posts/` 下的 Markdown 文件
2. 经过 11 个 remark/rehype 插件链处理（见下方 Markdown 处理管线）
3. 页面组件通过 `getStaticPaths()` 生成静态路由
4. Layout 组件提供 HTML 壳 + CSS 变量 + JavaScript 运行时
5. Svelte 组件按需水合（`client:load` / `client:idle`）
6. 构建结束后 Pagefind 索引 `dist/` 生成搜索索引

---

## 组件层级

```
Pages
├── [...page].astro          # 首页分页（PostCard 列表 + Pagination）
├── posts/[...slug].astro    # 文章详情页
├── about.astro              # 关于页
├── archive.astro            # 归档页（ArchivePanel）
├── robots.txt.ts
└── rss.xml.ts

Layouts
├── Layout.astro             # 根布局：HTML, 主题, 字体, 滚动条, PhotoSwipe
└── MainGridLayout.astro     # 网格布局：Navbar, Banner, SideBar, TOC, Footer

Widgets (侧边栏区域)
├── Profile.astro            # 头像 + 简介 + 社交链接
├── Categories.astro         # 分类列表
├── Tags.astro               # 标签云
├── Series.astro             # 文章系列导航
├── TOC.astro                # 文章目录
├── Search.svelte            # Pagefind 搜索面板
├── DisplaySettings.svelte   # 显示设置（主题色 + 亮暗切换）
├── NavMenuPanel.astro       # 导航菜单浮层
└── SideBar.astro            # 侧边栏容器（组合上述 widget）

Controls
├── Pagination.astro         # 分页导航
├── BackToTop.astro          # 返回顶部按钮
├── ButtonLink.astro         # 链接按钮
└── ButtonTag.astro          # 标签按钮

Misc
├── Markdown.astro           # Markdown 内容容器
├── ImageWrapper.astro       # 图片包装（位置控制）
└── License.astro            # 文章许可协议

其他
├── Navbar.astro             # 顶部导航栏
├── Footer.astro             # 页脚
├── PostCard.astro           # 文章卡片（列表项）
├── PostMeta.astro           # 文章元信息（发布时间、标签、分类）
├── PostPage.astro           # 文章列表容器
├── ConfigCarrier.astro      # 配置数据传输脚本
└── GlobalStyles.astro       # 全局样式注入
```

---

## 页面路由

| 路由 | 文件 | 说明 |
|------|------|------|
| `/` | `[...page].astro` | 首页，按 `PAGE_SIZE=8` 分页 |
| `/posts/:slug/` | `posts/[...slug].astro` | 文章详情 |
| `/archive/` | `archive.astro` | 归档页 |
| `/about/` | `about.astro` | 关于页 |
| `/robots.txt` | `robots.txt.ts` | 爬虫配置 |
| `/rss.xml` | `rss.xml.ts` | RSS Feed |

---

## Content Collections

**posts** — 博客文章（`src/content/posts/`）

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 文章标题 |
| `published` | `date` | 发布日期 |
| `updated` | `date?` | 更新日期 |
| `draft` | `boolean` | 草稿状态（生产环境隐藏） |
| `description` | `string` | 摘要 |
| `image` | `string` | 封面图片路径 |
| `tags` | `string[]` | 标签 |
| `category` | `string?` | 分类 |
| `lang` | `string` | 语言代码（如 `zh_CN`） |
| `series` | `string?` | 所属系列名称 |
| `prevTitle/prevSlug/nextTitle/nextSlug` | `string` | 前后文章链接（自动填充） |

**spec** — 独立页面（`src/content/spec/`，如关于页），schema 默认无限制。

---

## Markdown 处理管线

`astro.config.mjs` 中配置的插件链，执行顺序如下：

```
Markdown 源
  └─ remarkReadingTime        ← 计算阅读时间
  └─ remarkExcerpt            ← 提取摘要
  └─ remarkGithubAdmonitionsToDirectives ← GitHub 警示块 → 自定义指令
  └─ remarkDirective          ← 解析 ::directive 语法
  └─ remarkSectionize         ← 章节化包装
  └─ parseDirectiveNode       ← 指令节点解析
  └─ rehypeKatex              ← KaTeX 数学公式渲染
  └─ rehypeSlug               ← 为标题添加 id
  └─ rehypeComponents         ← 自定义组件渲染（github、note/tip/important/caution/warning）
  └─ rehypeAutolinkHeadings   ← 为标题添加 # 锚点链接
  └─ Expressive Code          ← 代码块渲染（插件：可折叠、行号、语言徽标、复制按钮）
```

**自定义指令：**
| 语法 | 渲染效果 |
|------|----------|
| `::github{repo="..."}` | GitHub 仓库卡片 |
| `::note` / `::tip` / `::important` / `::caution` / `::warning` | GitHub 风格警示块 |

---

## CSS 架构

- **Tailwind 策略**：`class` 暗色模式 — 通过 `dark:` 前缀控制样式
- **CSS 变量**：主题色 (`--hue`)、背景色 (`--page-bg`、`--card-bg`)、代码块 (`--codeblock-bg`) 等在运行时通过 JS 设置
- **样式文件**：
  - `src/styles/main.css` — Tailwind 组件层（按钮、面板、链接、工具类）
  - `src/styles/global.css` — 全局基础样式
  - `src/styles/markdown.css` — Markdown 内容排版
  - `src/styles/markdown-extend.styl` — Markdown 扩展样式（Stylus 预处理）
  - `src/styles/transition.css` — 页面过渡动画
  - `src/styles/scrollbar.css` — 自定义滚动条
  - `src/styles/variables.styl` — CSS 变量定义
  - `src/styles/expressive-code.css` — 代码块复写样式
  - `src/styles/photoswipe.css` — 图片灯箱样式
- **排版插件**：`@tailwindcss/typography`（`prose` 类）

---

## Svelte 交互组件

| 组件 | 水合方式 | 职责 |
|------|---------|------|
| `Search.svelte` | `client:load` | Pagefind 搜索面板，实时搜索 |
| `LightDarkSwitch.svelte` | 内联 | 亮/暗/跟随系统 模式切换 |
| `ArchivePanel.svelte` | 内联 | 归档页的年份分组的文章列表 |
| `DisplaySettings.svelte` | 内联 | 主题色色相调节 + 亮暗切换面板 |
| `GlobalStyles.astro` | 构建时 | 注入全局样式（非交互） |

---

## 构建与部署

**三个 GitHub Actions workflow：**

| Workflow | 触发时机 | 操作 |
|----------|---------|------|
| `deploy.yml` | push main | `withastro/action@v3` 构建 + GitHub Pages 部署 |
| `build.yml` | push/PR main | Node 22/23 矩阵：`pnpm astro check` + `pnpm astro build` |
| `biome.yml` | push/PR main | Biome CI 代码风格检查 |

---

## 配置系统

所有配置集中在 `src/config.ts`，由五个配置对象组成：

| 对象 | 类型 | 说明 |
|------|------|------|
| `siteConfig` | `SiteConfig` | 站点标题、语言、主题色、Banner、目录、Favicon |
| `navBarConfig` | `NavBarConfig` | 导航栏链接（支持 LinkPreset 枚举 + 自定义链接） |
| `profileConfig` | `ProfileConfig` | 头像、名称、简介、社交链接 |
| `licenseConfig` | `LicenseConfig` | 文章许可协议（CC BY-NC-SA 4.0） |
| `expressiveCodeConfig` | `ExpressiveCodeConfig` | 代码块主题（github-dark） |

---

## i18n 系统

```
i18nKey.ts (枚举) → translation.ts (分发器) → languages/{en,zh_CN,zh_TW}.ts (翻译映射)
```

- 根据 `siteConfig.lang` 自动选择语言
- 当前支持：简体中文、繁体中文、英文
- `siteConfig.lang` Fallback 链：`zh_CN` → `en`

---

## 路径别名（tsconfig）

```ts
@components/* → src/components/*
@assets/*     → src/assets/*
@constants/*  → src/constants/*
@utils/*      → src/utils/*
@i18n/*       → src/i18n/*
@layouts/*    → src/layouts/*
@/*           → src/*
```

---

## Git 工作流

### 分支策略

- `main` — 生产分支，直接部署到 GitHub Pages
- 功能开发在本地分支进行，通过 PR 合入 `main`
- 禁止直接 push 到 `main`（CI 会在 PR 时自动检查）

### Commit 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

| 类型 | 用途 |
|------|------|
| `feat:` | 新功能 |
| `fix:` | 修复 Bug |
| `docs:` | 文档变更 |
| `refactor:` | 重构 |
| `style:` | 代码风格（格式、空格等，非语义变更） |
| `chore:` | 构建、依赖、CI 等杂项 |

提交前执行：
1. `git status` — 确认只包含预期文件
2. `git diff --staged` — 审查变更内容
3. 不要提交 secrets、大文件（>1MB）、`dist/`、`node_modules/`

---

## VS Code

推荐扩展：Biome（格式化）、Astro（语言服务）。保存时自动用 Biome 格式化。
