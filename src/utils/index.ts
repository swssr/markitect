import { marked } from "marked";

async function convertMarkdownToTextLayer(markdownText: string) {
    const tokens = marked.lexer(markdownText);
    let yOffset = 0;
    const GAP = 10;

    for (const token of tokens) {
        if(token.type === "heading") {
            const textNode = figma.createText();
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            textNode.characters = token.text;
            textNode.fontSize = 24 - (token.depth * 4);
            textNode.x = 0;
            textNode.y = yOffset;
            yOffset += textNode.height + GAP;
        }else if(token.type === "paragraph") {
            const textNode = figma.createText();
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            textNode.characters = token.text;
            textNode.x = 0;
            textNode.y = yOffset;
            yOffset += textNode.height + GAP;
        }

        // TODO: Add support for markdown lists and tables if possible.
    }

}