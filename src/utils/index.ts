import { marked, Token } from "marked";

export default async function convertMarkdownToTextLayer(markdownText: string) {
    const tokens = marked.lexer(markdownText);
    let yOffset = 0;
    const GAP = 30;

    const frame = figma.createFrame();
    frame.layoutMode = "VERTICAL";
    frame.verticalPadding = 16;
    frame.horizontalPadding = 16;
    frame.layoutSizingHorizontal = "HUG";
    frame.layoutSizingVertical = "HUG";
    frame.name = "From MD";


    debugger;

    for (const token of tokens) {
        if (token.type === "heading") {
            const textNode = figma.createText();
            await figma.loadFontAsync({ family: "Inter", style: "Bold" });
            textNode.fontName = { family: "Inter", style: "Bold" };
            textNode.characters = token.tokens?.map(getTextFromToken).join(" ") || "";
            textNode.y = yOffset;
            yOffset += GAP;
            frame.appendChild(textNode);
        } else if (token.type === "paragraph") {
            const node = await handleTextToken(token, yOffset);
            frame.appendChild(node);
            yOffset += GAP;
        } else if (token.type === "list") {
            for (const item of token.items) {
                const node = await handleTextToken(item, yOffset, "- ");
                frame.appendChild(node)
                yOffset += GAP;
            }
        } else if (token.type === "space") {
            yOffset += GAP / 2;
        }
    }

    figma.closePlugin("Conversion Done");
}

async function handleTextToken(token: any, yOffset: number, prefix: string = ""): Promise<TextNode> {
    const textNode = figma.createText();
    let textContent = prefix;
    let fontRanges: { start: number; end: number; font: FontName }[] = [];

    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    await figma.loadFontAsync({ family: "Inter", style: "Italic" });

    let cursor = prefix.length;

    for (const inlineToken of token.tokens || []) {
        if (["text", "strong", "em", "codespan"].includes(inlineToken.type)) {
            const text = inlineToken.text || "";
            const start = cursor;
            const end = start + text.length;

            let fontStyle: FontName = { family: "Inter", style: "Regular" };
            if (inlineToken.type === "strong") fontStyle = { family: "Inter", style: "Bold" };
            if (inlineToken.type === "em") fontStyle = { family: "Inter", style: "Italic" };

            textContent += text;
            fontRanges.push({ start, end, font: fontStyle });

            cursor = end;
        }
    }

    textNode.characters = textContent;
    for (const range of fontRanges) {
        textNode.setRangeFontName(range.start, range.end, range.font);
    }

    textNode.y = yOffset;

    return textNode;
}



function getTextFromToken(token: Token) {
    let str = "";
    if (token.type === "text" || token.type === "strong" || token.type === "em" || token.type === "codespan") {
        str += token.text;
    }

    return str;
}

function isText(token: Token){
    return token.type === "text" || token.type === "strong" || token.type === "em" || token.type === "codespan"
}