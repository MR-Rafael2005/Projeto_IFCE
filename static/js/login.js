// Funções de login

// Toda estrutura do form sendo obtidas por funções, ao inves de chamar uma variavel vc chama uma função
const form = {
    form: () => document.getElementById("loginForm"),
    senha: () => document.getElementById("senha"),
    confirmar: () => document.getElementById("confirmar"),
    erro: () => document.getElementById("erroConfirmacao")
}

function showPass(idCampo) {
    const campo = document.getElementById(idCampo);
    console.log(campo)
    //Se input é password muda pra text se é text muda pra password
    campo.type = campo.type === "password" ? "text" : "password";
}

//Configura um "listener" para o evento de submit do form (Com uma arrow function ()=>{} ) e verifica a senha
form.form().addEventListener("submit", (e) => {
    /*
    if (form.senha().value !== form.confirmar().value) {
        //Evita reload da pagina
        e.preventDefault();
        form.erro().textContent = "As senhas não coincidem!";
        form.erro().style.display = "block";
    } else {
        form.erro().textContent = "";
        form.erro().style.display = "none";
    }
    */
});

// LOGIN TEMPORARIO

const email = document.getElementById('email')
const password = document.getElementById('senha')
const form_login = document.getElementById('loginForm')

form_login.addEventListener('submit',function(event){
    event.preventDefault(); // impede reload automático do form
    
    const emailValorDigitado = email.value;
    const senhaValorDigitado = password.value;
    

    if (emailValorDigitado === "professor@gmail.com" && senhaValorDigitado === "123"){
         window.location.href = "../template/dashboard.html";
    }else{
        //alert("Email ou Senha invalidos!")
    }
})