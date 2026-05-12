
// Removemos o alert de teste inicial para não poluir a tela
async function realizarCadastro() {
    console.log("LOG: Iniciando cadastro...");

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/api/perfis/cadastro', {
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
            alert("❌ Erro: " + data.message);
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
        const response = await fetch('http://localhost:3000/api/mensagens/postar', {
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

// Verifica se a página terminou de carregar para rodar os favoritos apenas se o container existir
document.addEventListener('DOMContentLoaded', carregarFavoritos);