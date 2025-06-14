"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineProvider = void 0;
/**
 * InlineCompletionItemProvider for on-the-fly suggestions
 */
const vscode = __importStar(require("vscode"));
class InlineProvider {
    async provideInlineCompletionItems(document, position, context, token) {
        // Get the current line and context
        const line = document.lineAt(position.line);
        const text = line.text.substring(0, position.character);
        // Only trigger on specific patterns or after certain characters
        if (!text.trim() || !text.endsWith(' ')) {
            return { items: [] };
        }
        try {
            // TODO: Implement actual API call to /generate endpoint
            // For now, return a simple completion
            return {
                items: [{
                        insertText: '// TODO: Implement this function',
                        range: new vscode.Range(position, position)
                    }]
            };
        }
        catch (error) {
            console.error('Inline completion failed:', error);
            return { items: [] };
        }
    }
}
exports.InlineProvider = InlineProvider;
//# sourceMappingURL=client.js.map