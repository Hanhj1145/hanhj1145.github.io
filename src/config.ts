import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Hanhj's blog",
	subtitle: "A blog about technology and life.",
	lang: "zh_CN", // 语言代码，例如 'en', 'zh_CN', 'ja' 等。
	themeColor: {
		hue: 250, // 主题颜色的默认色相（0 到 360）。例如：红色: 0，青色: 200，青蓝: 250，粉色: 345
		fixed: true, // 隐藏访客可见的主题颜色选择器
	},
	banner: {
		enable: true, // 启用横幅图片
		src: "assets/images/demo-banner.png", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
		position: "center", // 等同于 CSS 的 object-position，仅支持 'top'、'center'、'bottom'。默认 'center'
		credit: {
			enable: false, // 显示横幅图片的来源/署名文字
			text: "", // 要显示的署名文字
			url: "", // （可选）指向原始作品或作者页面的链接
		},
	},
	toc: {
		enable: true, // 在文章右侧显示目录（Table of Contents）
		depth: 3, // 目录显示的最大标题深度，范围 1 到 3
	},
	favicon: [
		// 保持此数组为空以使用默认 favicon
		{
			src: "assets/images/favicon/favicon.png", // favicon 的路径，相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
			theme: "light", // （可选）'light' 或 'dark'，当浅色/深色模式使用不同 favicon 时设置
			sizes: "32x32", // （可选）favicon 的尺寸，当有不同尺寸时设置
		},
	],
};

export const navBarConfig: NavBarConfig = {
	//导航栏配置
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/Hanhj1145/", // 站内链接不应包含基础路径，系统会自动添加
			external: true, // 显示外部链接图标，并在新标签页打开
		},
	],
};

export const profileConfig: ProfileConfig = {
	// 个人资料配置
	avatar:
		"https://foruda.gitee.com/avatar/1762004641645782331/13783795_hegecountry_1762004641.png", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "Hanhj",
	bio: "Just a tech enthusiast sharing my thoughts.",
	links: [
		// {
		// 	name: "Twitter",
		// 	icon: "fa6-brands:twitter", // 请访问 https://icones.js.org/ 获取图标代码
		// 	// 如果未包含相应图标库，你需要安装它
		// 	// 例如：`pnpm add @iconify-json/<icon-set-name>`
		// 	url: "https://twitter.com",
		// },
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://store.steampowered.com",
		},
		{
			name: "Bilibili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/530102523",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Hanhj1145/",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	// 版权许可配置
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：某些样式（例如背景色）会被覆盖，详见 astro.config.mjs 文件。
	// 请使用暗色主题，因为本博客主题当前仅支持暗色背景
	theme: "github-dark",
};
