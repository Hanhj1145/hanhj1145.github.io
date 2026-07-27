import { visit } from "unist-util-visit";

export function remarkInlineToc() {
	return (tree) => {
		visit(tree, "paragraph", (node, index, parent) => {
			if (!parent) return;
			const textNode = node.children?.[0];
			if (
				node.children?.length === 1 &&
				textNode?.type === "text" &&
				textNode.value?.trim() === "[TOC]"
			) {
				parent.children.splice(index, 1, {
					type: "paragraph",
					data: {
						hName: "div",
						hProperties: { className: ["inline-toc-placeholder"] },
					},
					children: [],
				});
			}
		});
	};
}
