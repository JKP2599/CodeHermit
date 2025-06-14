/**
 * Activate commands, start LanguageClient to talk to FastAPI
 */
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

// Define response types
interface GenerateResponse {
    code: string;
}

interface ReviewResponse {
    issues: string[];
}

interface ChatResponse {
    message: string;
}

export async function activate(context: vscode.ExtensionContext) {
    // Configure server options
    const serverOptions: ServerOptions = {
        command: 'uv',
        args: ['run', 'server/main.py'],
        transport: TransportKind.stdio
    };

    // Configure client options
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file' }]
    };

    // Create and start the language client
    const client = new LanguageClient(
        'codeAssistant',
        'Code Assistant',
        serverOptions,
        clientOptions
    );

    // Start the client and add to subscriptions
    await client.start();
    context.subscriptions.push(client);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('codeAssistant.generate', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }

            const selection = editor.selection;
            const text = editor.document.getText(selection);
            
            try {
                const response = await client.sendRequest<GenerateResponse>('/generate', { prompt: text });
                if (response?.code) {
                    editor.edit(editBuilder => {
                        editBuilder.replace(selection, response.code);
                    });
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Generation failed: ${error}`);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('codeAssistant.review', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }

            const text = editor.document.getText();
            try {
                const response = await client.sendRequest<ReviewResponse>('/review', { prompt: text });
                if (response?.issues) {
                    const issues = response.issues.join('\n');
                    vscode.window.showInformationMessage(issues);
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Review failed: ${error}`);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('codeAssistant.chat', async () => {
            const input = await vscode.window.showInputBox({
                prompt: 'What would you like to ask?'
            });

            if (input) {
                try {
                    const response = await client.sendRequest<ChatResponse>('/chat', { message: input });
                    if (response?.message) {
                        vscode.window.showInformationMessage(response.message);
                    }
                } catch (error) {
                    vscode.window.showErrorMessage(`Chat failed: ${error}`);
                }
            }
        })
    );
}

export function deactivate() {} 