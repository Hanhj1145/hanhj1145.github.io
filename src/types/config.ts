import type { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};
	banner: {
		enable: boolean;
		src: string;
		position?: "top" | "center" | "bottom";
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
		heroText?: string[];
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};

	favicon: Favicon[];
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};

export type LIGHT_DARK_MODE =
	| typeof LIGHT_MODE
	| typeof DARK_MODE
	| typeof AUTO_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	series?: string;
	draft?: boolean;
	image?: string;
	category?: string;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};

export type GiscusConfig = {
	/** 是否启用评论（填好 repoId / categoryId 后改为 true） */
	enable: boolean;
	/** GitHub 仓库，格式 owner/repo */
	repo: string;
	/** 仓库 ID，在 https://giscus.app 获取 */
	repoId: string;
	/** Discussion 分类名称，例如 Announcements */
	category: string;
	/** 分类 ID，在 https://giscus.app 获取 */
	categoryId: string;
	mapping: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
	/** 仅加载标题完全匹配的 Discussion */
	strict: boolean;
	reactionsEnabled: boolean;
	emitMetadata: boolean;
	inputPosition: "top" | "bottom";
	/** giscus 界面语言，例如 zh-CN */
	lang: string;
	loading: "lazy" | "eager";
};
