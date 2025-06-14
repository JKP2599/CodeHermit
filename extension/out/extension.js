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
exports.deactivate = exports.activate = void 0;
/**
 * Activate commands, start LanguageClient to talk to FastAPI
 */
const vscode = __importStar(require("vscode"));
const node_1 = require("vscode-languageclient/node");
async function activate(context) {
    // Configure server options
    const serverOptions = {
        command: 'uv',
        args: ['run', 'server/main.py'],
        transport: node_1.TransportKind.stdio
    };
    // Configure client options
    const clientOptions = {
        documentSelector: [{ scheme: 'file' }]
    };
    // Create and start the language client
    const client = new node_1.LanguageClient('codeAssistant', 'Code Assistant', serverOptions, clientOptions);
    // Start the client and add to subscriptions
    await client.start();
    context.subscriptions.push(client);
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('codeAssistant.generate', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        try {
            const response = await client.sendRequest('/generate', { prompt: text });
            if (response?.code) {
                editor.edit(editBuilder => {
                    editBuilder.replace(selection, response.code);
                });
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Generation failed: ${error}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('codeAssistant.review', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        const text = editor.document.getText();
        try {
            const response = await client.sendRequest('/review', { prompt: text });
            if (response?.issues) {
                const issues = response.issues.join('\n');
                vscode.window.showInformationMessage(issues);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Review failed: ${error}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('codeAssistant.chat', async () => {
        const input = await vscode.window.showInputBox({
            prompt: 'What would you like to ask?'
        });
        if (input) {
            try {
                const response = await client.sendRequest('/chat', { message: input });
                if (response?.message) {
                    vscode.window.showInformationMessage(response.message);
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`Chat failed: ${error}`);
            }
        }
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map