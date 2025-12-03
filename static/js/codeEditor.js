//O setup e execução do editor de código
//Linguagens Suportadas: JavaScript
//Talvez seja uma boa mudar de editor para o monaco, ja que o monaco tem o intellisense

// Inicializar CodeMirror(Importado por CDN) colocando ele numa textarea existente
const editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
    mode: 'javascript',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    lineWrapping: true,
    viewportMargin: Infinity
});

// Forçar refresh do editor após carregamento
setTimeout(() => {
    if(editor)
    {
        editor.refresh();
    }
}, 100);

// Refresh quando a janela for redimensionada
window.addEventListener('resize', () => {
    editor.refresh();
});

// Executar código baseado na linguagem selecionada
function executeCode() 
{
    const language = document.getElementById('languageSelect').value;

    switch (language) {
        case "javascript":
            executeJsCode();
            break;

        default:
            break;
    }
}

// Executar código
function executeJsCode() {
    const code = editor.getValue();
    const output = document.getElementById('output');
    
    output.style.color = '#00ff00';
    
    try {
        let logs = [];

        //Redefine console.log para capturar saídas e ainda imprimir no console normal
        const originalLog = console.log;

        console.log = function(...args) {
            logs.push(args.join(' '));
            originalLog.apply(console, args);
        };
        
        //Executa string como código JS
        eval(code);
        console.log = originalLog;
        
        //Exibe as saídas capturadas
        output.textContent = logs.length > 0 
            ? '> Executado com sucesso!\n\n' + logs.join('\n')
            : '> Código executado sem saída.';
    } catch (error) {
        output.textContent = '> ❌ Erro:\n\n' + error.message;
        output.style.color = '#ff6b6b';
    }
}

// Baixar código como arquivo
function downloadCode() {
    const code = editor.getValue();
    const language = document.getElementById('languageSelect').value;
    let extension = 'txt';

    switch (language) {
        case 'javascript':
            extension = 'js';
            break;
        case 'python':
            extension = 'py';
            break;
        case 'c':
            extension = 'c';
            break;
        default:
            extension = 'txt';
            break;
    }

    // Criar um Blob que contem os bytes do código, atribui a uma URL e simula o clique para download em uma "ancoragem" (<a></a>)
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codigo.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
}

// Limpar saída
function clearOutput() {
    const output = document.getElementById('output');
    output.textContent = '> Aguardando execução...';
    output.style.color = '#00ff00';
}

// Limpar código
function clearCode() {
    editor.setValue('');
}