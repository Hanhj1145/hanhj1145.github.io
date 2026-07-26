# Hanhj's Blog

> 关于技术与生活的个人博客。基于 [Fuwari](https://github.com/saicaca/fuwari) 搭建。

## 功能特性

- 暗色模式，支持自定义主题色
- 全站搜索（Pagefind）
- 标签与分类归档
- 数学公式渲染（KaTeX）
- 代码语法高亮（Expressive Code）
- 多语言支持（中文 / English）
- 平滑页面过渡（Swup）
- 响应式设计（Tailwind CSS）
- 图片灯箱（PhotoSwipe）
- RSS 订阅与站点地图

## 技术栈

[![Astro](https://img.shields.io/badge/Astro-5-blue?logo=astro)](https://astro.build)
[![Svelte](https://img.shields.io/badge/Svelte-5-orange?logo=svelte)](https://svelte.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Biome](https://img.shields.io/badge/Biome-2-60a5fa?logo=biome)](https://biomejs.dev)

## 快速开始

```bash
pnpm install
pnpm dev          # 启动开发服务器 localhost:4321
pnpm build        # 构建静态站点到 dist/
pnpm new-post     # 新建一篇文章
```

## 目录结构

```
src/
├── content/posts/    # Markdown 博客文章
├── components/       # UI 组件（Astro + Svelte）
├── layouts/          # 页面布局
├── pages/            # 路由页面
├── config.ts         # 站点配置
├── i18n/             # 国际化
└── styles/           # 全局样式
```

## 部署

推送到 `main` 分支后自动通过 `withastro/action` 部署到 GitHub Pages。

## 许可协议

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

---

由 [Fuwari](https://github.com/saicaca/fuwari) 驱动。
