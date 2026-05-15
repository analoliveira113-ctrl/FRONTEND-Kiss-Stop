
// Removemos o alert de teste inicial para não poluir a tela
async function realizarCadastro() {
    console.log("LOG: Iniciando cadastro...");

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('https://backend-kiss-stop.vercel.app/api/perfis/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        if (response.ok) {
            alert("✅ Usuário criado com sucesso!");
            
            // ESTA É A LINHA MÁGICA:
            // Usamos o replace para o navegador não ter desculpa de "voltar" a página
            console.log("Redirecionando para o login...");
            window.location.replace("home.html"); 
            
        } else {
            const data = await response.json();
            alert("❌ Erro: " + (data.error || data.message || JSON.stringify(data)));
        }
    } catch (error) {
        alert("⚠️ Erro de conexão com o servidor.");
    }
}

// --- 1. FUNÇÃO PARA FAVORITAR ---
function favorite(btn) {
    btn.classList.toggle('active');
    const card = btn.closest('.card');
    const messageText = card.querySelector('.message').innerText;
    const tagText = card.querySelector('.tag').innerText;

    let favoritos = JSON.parse(localStorage.getItem('meusFavoritos')) || [];

    if (btn.classList.contains('active')) {
        btn.innerHTML = '★';
        btn.style.color = '#ffcc00';
        if (!favoritos.some(f => f.message === messageText)) {
            favoritos.push({ tag: tagText, message: messageText });
        }
    } else {
        btn.innerHTML = '☆';
        btn.style.color = '#9d4d4d';
        favoritos = favoritos.filter(f => f.message !== messageText);
    }
    localStorage.setItem('meusFavoritos', JSON.stringify(favoritos));
}

// --- 2. FUNÇÃO PARA CARREGAR OS FAVORITOS ---
function carregarFavoritos() {
    const container = document.getElementById('favoritos-container');
    if (!container) return; // Se não estiver na página de favoritos, para aqui.

    const favoritos = JSON.parse(localStorage.getItem('meusFavoritos')) || [];
    container.innerHTML = ""; 

    if (favoritos.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:gray; margin-top:20px;'>Nenhum favorito ainda.</p>";
        return;
    }

    favoritos.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-top">
                <span class="tag">${item.tag}</span>
                <button class="options-btn" onclick="removerFavorito(${index})" style="color:#ffcc00">★</button>
            </div>
            <div class="message">${item.message}</div>
        `;
        container.appendChild(card);
    });
}

function removerFavorito(index) {
    let favoritos = JSON.parse(localStorage.getItem('meusFavoritos')) || [];
    favoritos.splice(index, 1);
    localStorage.setItem('meusFavoritos', JSON.stringify(favoritos));
    carregarFavoritos();
}

// --- 3. MENU E POST ---
function openMenu() {
    document.getElementById("side-menu").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeMenu() {
    document.getElementById("side-menu").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

async function postMessage() {
    const textarea = document.querySelector('.feed-textarea');
    const sendToSelect = document.getElementById('send-to');
    
    if (!textarea || textarea.value.trim() === "") {
        alert("Escreve alguma coisa!");
        return;
    }

    const dados = {
        conteudo: textarea.value,
        autor: "Anónimo",
        destinatario: sendToSelect.options[sendToSelect.selectedIndex].text
    };

    try {
        const response = await fetch('https://backend-kiss-stop.vercel.app/api/mensagens/postar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            textarea.value = "";
            alert("Mensagem enviada com sucesso!");
        }
    } catch (error) {
        console.error("Erro ao postar:", error);
    }
}
// ... suas funções anteriores (realizarCadastro, favorite, carregarFavoritos, etc) ...

// --- NOVA FUNÇÃO: GERADOR DE CANTADAS COM IA ---
function gerarCantadaIA() {
    const textarea = document.getElementById('mensagem-texto');
    const btn = document.querySelector('.ai-btn');

    // Lista de cantadas prontas (o cérebro do cupido)
    const cantadas = [
        "Uai, ocê não é pescaria, mas fisgou meu coração de jeito, sô!",
        "Ocê é mais bonita que o nascer do sol lá na roça.",
        "Se ocê fosse um cafézinho coado na hora, eu bebia num gole só pra esquentar o peito.",
        "Ô lindeza, meu amor por você é igual capim gordura: cresce em qualquer lugar e ninguém arranca!",
        "Ocê não é espantalho, mas espantou a solidão da minha vida.",
        "Tô mais perdido que cachorro em dia de mudança, querendo achar o caminho do seu coração.",
        "Seu sorriso brilha mais que pirilampo em noite de lua cheia.",
        "Ocê é o doce de leite que faltava no meu queijo minas!",
        "Não sou carro de boi, mas por ocê eu faço um barulhão de saudade.",
        "Vamo fazer igual festa junina? Eu sou a fogueira e ocê o meu quentão!"
    ];

    btn.innerText = "🤠 Buscando no curral...";
    btn.disabled = true;

    // Simula um "carregamento" de 800ms para parecer que a IA está pensando
    setTimeout(() => {
        const sorteio = Math.floor(Math.random() * cantadas.length);
        textarea.value = cantadas[sorteio];
        
        btn.innerText = "🤠 Dica do Cupido Caipira (IA)";
        btn.disabled = false;
    }, 800);
}

let filaPosicao = 0;
let emAtendimento = false;

function entrarNaFila() {
    const btn = document.getElementById('btn-fila');
    const contagem = document.getElementById('contagem-fila');
    const status = document.getElementById('status-fila');

    if (emAtendimento) return;

    // Simula entrada na fila
    filaPosicao = Math.floor(Math.random() * 5) + 1; 
    btn.disabled = true;
    btn.style.background = "gray";
    btn.innerText = "Você está na fila...";
    
    atualizarFila();
}

function atualizarFila() {
    const contagem = document.getElementById('contagem-fila');
    const status = document.getElementById('status-fila');

    const intervalo = setInterval(() => {
        if (filaPosicao > 0) {
            contagem.innerText = filaPosicao;
            status.innerText = `Sua vez em breve! Faltam ${filaPosicao} pessoas.`;
            filaPosicao--;
        } else {
            clearInterval(intervalo);
            iniciarAtendimento();
        }
    }, 3000); // A cada 3 segundos a fila anda
}

function iniciarAtendimento() {
    emAtendimento = true;
    document.getElementById('chat-beijo').style.display = "block";
    document.getElementById('status-fila').innerText = "🔥 É A SUA VEZ! 🔥";
    document.getElementById('btn-fila').innerText = "Finalizar Momento";
    document.getElementById('btn-fila').disabled = false;
    document.getElementById('btn-fila').style.background = "#9d4d4d";
    document.getElementById('btn-fila').onclick = finalizarAtendimento;

    const msgContainer = document.getElementById('mensagens-chat');
    msgContainer.innerHTML = "<p><b>Barraca:</b> Olá, lindeza! O horário tá agendado. Preparado(a)? 😉</p>";
}

function finalizarAtendimento() {
    alert("Agendamento finalizado! Esperamos que tenha sido bão demais!");
    location.reload(); // Reseta a fila
}

// --- LOGICA LGPD CAIPIRA ---

// Verifica se já aceitou os termos ao carregar a página
window.onload = function() {
    if (!localStorage.getItem('lgpd_aceito')) {
        document.getElementById('lgpd-baú').style.display = 'block';
    }
}

function aceitarTermos() {
    localStorage.setItem('lgpd_aceito', 'true');
    document.getElementById('lgpd-baú').style.display = 'none';
    console.log("Usuário aceitou o baú de dados.");
}

function recusarTermos() {
    alert("Uai, se não aceitar, o delegado da festa não deixa ocê navegar direito!");
}

// Verifica se a página terminou de carregar para rodar os favoritos apenas se o container existir
document.addEventListener('DOMContentLoaded', carregarFavoritos);