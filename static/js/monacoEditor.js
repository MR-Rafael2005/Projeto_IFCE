//Uma variação que usa o Monaco Editor ao invés do CodeMirror pois se trata de um editor mais completo com intellisense
//Mas ate onde testei só funciona se estiver sendo testado em uma simulação de servidor (Live-server)

// Configurar caminho do Monaco Editor
require.config({ 
paths: { 
    'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' 
}
});

let editor;
// Exemplos de código para cada linguagem
const codeExamples = {
    javascript: `// Bem-vindo ao Monaco Editor!
function saudacao(nome) {
    return "Olá, " + nome + "!";
}

console.log(saudacao("Monaco"));`,
    
    python: `# Python no Monaco Editor!
def saudacao(nome):
    return f"Olá, {nome}!"

def calcular_fatorial(n):
    if n <= 1:
        return 1
    return n * calcular_fatorial(n - 1)

print(saudacao("Python"))
print(f"Fatorial de 5: {calcular_fatorial(5)}")`,
    
    c: `// C no Monaco Editor!
#include <stdio.h>
#include <stdlib.h>

void saudacao(char* nome) {
    printf("Olá, %s!\\n", nome);
}

int fatorial(int n) {
    if (n <= 1) return 1;
    return n * fatorial(n - 1);
}

int main() {
    saudacao("C");
    printf("Fatorial de 5: %d\\n", fatorial(5));
    return 0;
}`
};

// Inicializar editor quando carregado
require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: codeExamples.python,
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line'
    });

    // Configurar autocompletar para Python
    monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: function(model, position) {
            // Obter texto do modelo para analisar variáveis
            const textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            });
            
            // Extrair variáveis definidas no código
            const variableMatches = textUntilPosition.match(/(\w+)\s*=/g);
            const definedVariables = variableMatches 
                ? [...new Set(variableMatches.map(match => match.replace(/\s*=/, '')))]
                : [];
            
            // Extrair funções definidas
            const functionMatches = textUntilPosition.match(/def\s+(\w+)/g);
            const definedFunctions = functionMatches
                ? [...new Set(functionMatches.map(match => match.replace(/def\s+/, '')))]
                : [];

            // Sugestões básicas + variáveis encontradas
            const suggestions = [
                    {
                        label: 'print',
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: 'print(${1:value})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Imprime valor no console'
                    },
                    {
                        label: 'def',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'def ${1:function_name}(${2:args}):\n    ${3:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Define uma função'
                    },
                    {
                        label: 'if',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'if ${1:condition}:\n    ${2:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Estrutura condicional if'
                    },
                    {
                        label: 'elif',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'elif ${1:condition}:\n    ${2:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Estrutura condicional elif (else if)'
                    },
                    {
                        label: 'else',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'else:\n    ${1:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Estrutura condicional else'
                    },
                    {
                        label: 'for',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'for ${1:item} in ${2:iterable}:\n    ${3:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Loop for para iteração'
                    },
                    {
                        label: 'for range',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'for ${1:i} in range(${2:n}):\n    ${3:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Loop for com range'
                    },
                    {
                        label: 'while',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'while ${1:condition}:\n    ${2:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Loop while'
                    },
                    {
                        label: 'try',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Tratamento de exceções'
                    },
                    {
                        label: 'class',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'class ${1:ClassName}:\n    def __init__(self${2:, args}):\n        ${3:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Define uma classe'
                    },
                    {
                        label: '__main__',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'if __name__ == "__main__":\n    ${1:main()}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Ponto de entrada principal do programa'
                    },
                    {
                        label: 'match',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'match ${1:value}:\n    case ${2:pattern1}:\n        ${3:pass}\n    case ${4:pattern2}:\n        ${5:pass}\n    case _:\n        ${6:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Estrutura match-case (Python 3.10+)'
                    },
                    {
                        label: 'lambda',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'lambda ${1:args}: ${2:expression}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Função lambda (anônima)'
                    },
                    {
                        label: 'import',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'import ${1:module}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Importar módulo'
                    },
                    {
                        label: 'from import',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'from ${1:module} import ${2:function}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Importar específico de módulo'
                    },
                    {
                        label: 'with',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'with ${1:expression} as ${2:variable}:\n    ${3:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Context manager (with statement)'
                    },
                    {
                        label: 'list comprehension',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '[${1:expression} for ${2:item} in ${3:iterable}]',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Lista por compreensão'
                    },
                    {
                        label: 'dict comprehension',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '{${1:key}: ${2:value} for ${3:item} in ${4:iterable}}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Dicionário por compreensão'
                    }
                ];

            // Adicionar variáveis encontradas
            definedVariables.forEach(variable => {
                if (variable.length > 1) { // Ignorar variáveis de 1 letra
                    suggestions.push({
                        label: variable,
                        kind: monaco.languages.CompletionItemKind.Variable,
                        insertText: variable,
                        documentation: `Variável definida: ${variable}`
                    });
                }
            });

            // Adicionar funções encontradas
            definedFunctions.forEach(func => {
                suggestions.push({
                    label: func,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: `${func}($1)`,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: `Função definida: ${func}()`
                });
            });

            // Adicionar built-ins comuns do Python
            const pythonBuiltins = [
                'len', 'str', 'int', 'float', 'bool', 'list', 'dict', 'tuple', 'set',
                'range', 'enumerate', 'zip', 'map', 'filter', 'sum', 'max', 'min',
                'abs', 'round', 'sorted', 'reversed', 'any', 'all', 'input', 'open'
            ];

            pythonBuiltins.forEach(builtin => {
                suggestions.push({
                    label: builtin,
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: `${builtin}($1)`,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: `Função built-in: ${builtin}()`
                });
            });

            return { suggestions };
        }
        
    });

    // Configurar autocompletar para C
    monaco.languages.registerCompletionItemProvider('c', {
        provideCompletionItems: function(model, position) {
            return {
                suggestions: [
                    {
                        label: 'printf',
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: 'printf("${1:format}", ${2:args});',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Imprime formatado'
                    },
                    {
                        label: 'main',
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: 'int main() {\n    ${1:// código}\n    return 0;\n}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Função main'
                    },
                    {
                        label: 'include',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: '#include <${1:library}>',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Incluir biblioteca'
                    }
                ]
            };
        }
    });
});

// Função para mudar linguagem
function changeLanguage(language) {
    if (editor) {
        monaco.editor.setModelLanguage(editor.getModel(), language);
        editor.setValue(codeExamples[language] || '// Código aqui');
    }
}

// Função para executar código
function executeCode() {
    if (!editor) return;
    
    const code = editor.getValue();
    const language = monaco.editor.getModel(editor.getModel()).getLanguageId();
    const output = document.getElementById('output');
    
    if (!output) {
        console.log('Elemento output não encontrado');
        return;
    }
    
    output.style.color = '#00ff00';
    
    switch (language) {
        case 'javascript':
            executeJavaScript(code, output);
            break;
        case 'python':
            executePython(code, output);
            break;
        case 'c':
            executeC(code, output);
            break;
        default:
            output.textContent = `Execução não suportada para ${language}`;
            output.style.color = '#ffa500';
    }
}

// Executar JavaScript
function executeJavaScript(code, output) {
    try {
        let logs = [];
        const originalLog = console.log;
        
        console.log = function(...args) {
            logs.push(args.join(' '));
            originalLog.apply(console, args);
        };
        
        eval(code);
        console.log = originalLog;
        
        output.textContent = logs.length > 0 
            ? '> Executado com sucesso!\n\n' + logs.join('\n')
            : '> Código executado sem saída.';
    } catch (error) {
        output.textContent = '> ❌ Erro:\n\n' + error.message;
        output.style.color = '#ff6b6b';
    }
}

// Executar Python (usando Pyodide - Python no browser)
async function executePython(code, output) {
    try {
        // Verificar se Pyodide está carregado
        if (typeof pyodide === 'undefined') {
            output.textContent = '> Carregando Python... (primeira vez pode demorar)';
            
            // Carregar Pyodide
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            script.onload = async function() {
                window.pyodide = await loadPyodide();
                executePythonCode(code, output);
            };
            document.head.appendChild(script);
        } else {
            executePythonCode(code, output);
        }
    } catch (error) {
        output.textContent = '> ❌ Erro ao executar Python:\n\n' + error.message;
        output.style.color = '#ff6b6b';
    }
}

function executePythonCode(code, output) {
    try {
        // Capturar prints do Python
        pyodide.runPython(`
import sys
from io import StringIO
old_stdout = sys.stdout
sys.stdout = StringIO()
        `);
        
        // Executar código
        pyodide.runPython(code);
        
        // Obter saída
        const result = pyodide.runPython(`
output = sys.stdout.getvalue()
sys.stdout = old_stdout
output
        `);
        
        output.textContent = result 
            ? '> Executado com sucesso!\n\n' + result
            : '> Código executado sem saída.';
    } catch (error) {
        output.textContent = '> ❌ Erro Python:\n\n' + error.toString();
        output.style.color = '#ff6b6b';
    }
}

// Executar C (simulação - não é possível compilar C no browser nativamente)
function executeC(code, output) {
    output.textContent = `> ⚠️ Execução de C requer compilador!\n\nCódigo C detectado. Para executar:\n\n1. Salve como arquivo.c\n2. Compile: gcc arquivo.c -o programa\n3. Execute: ./programa\n\nOu use um compilador online como:\n- onlinegdb.com\n- replit.com`;
    output.style.color = '#ffa500';
}