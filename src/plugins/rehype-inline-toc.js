import { h } from "hastscript";

function getTextContent(node) {
	if (node.type === "text") return node.value;
	if (node.children) return node.children.map(getTextContent).join("");
	return "";
}

function cleanHeadingText(text) {
	return text.replace(/#/g, "").trim();
}

function collectHeadings(tree) {
	const headings = [];
	const stack = [tree];
	while (stack.length > 0) {
		const node = stack.pop();
		if (node.type === "element" && /^h[1-6]$/i.test(node.tagName)) {
			const id = node.properties?.id;
			if (id) {
				headings.push({
					depth: Number.parseInt(node.tagName[1], 10),
					text: cleanHeadingText(getTextContent(node)),
					id,
				});
			}
		}
		if (node.children) {
			for (let i = node.children.length - 1; i >= 0; i--) {
				stack.push(node.children[i]);
			}
		}
	}
	return headings;
}

function replacePlaceholders(node, headings) {
	if (!node.children) return;
	const children = node.children;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (child.type !== "element") continue;

		const isPlaceholder =
			Array.isArray(child.properties?.className) &&
			child.properties.className.includes("inline-toc-placeholder");

		if (isPlaceholder) {
			const items = headings.map(({ depth, text, id }) =>
				h(
					"li",
					{ className: ["inline-toc-item"] },
					h(
						"a",
						{
							href: `#${id}`,
							className: ["inline-toc-link"],
							style: `padding-left: ${(depth - 1) * 1.25}rem`,
						},
						text,
					),
				),
			);

			children[i] = h("div", { className: ["inline-toc"] }, [
				h("div", { className: ["inline-toc-title"] }, "\u76EE\u5F55"),
				h("ul", { className: ["inline-toc-list"] }, items),
			]);
		} else {
			replacePlaceholders(child, headings);
		}
	}
}

export function rehypeInlineToc() {
	return (tree) => {
		const headings = collectHeadings(tree);
		if (headings.length === 0) return;
		replacePlaceholders(tree, headings);
	};
}
