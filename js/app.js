function favorite(btn) {
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
        btn.innerHTML = '★';
        btn.style.color = '#ffcc00';
    } else {
        btn.innerHTML = '☆';
        btn.style.color = '#9d4d4d';
    }
}

function verInfo() {
    window.location.href = 'informacoes.html';
}

function postMessage() {
    const textarea = document.querySelector('.feed-textarea');
    const sendToSelect = document.getElementById('send-to');
    const visibilitySelect = document.getElementById('visibility');
    const feed = document.getElementById('feed');

    if (textarea.value.trim() === "") {
        alert("Por favor, digite uma mensagem!");
        return;
    }

    const destinatario = sendToSelect.options[sendToSelect.selectedIndex].text;
    const privacidade = visibilitySelect.value;
    
    if (privacidade === 'privado') {
        alert("Sua mensagem privada foi enviada para " + destinatario);
    } else {
        // Criar o card para o feed público
        const newCard = document.createElement('div');
        newCard.className = 'card';
        newCard.innerHTML = `
            <div class="card-top">
                <span class="tag">🌍 De: Você para: ${destinatario}</span>
                <button class="options-btn" onclick="favorite(this)">☆</button>
            </div>
            <div class="message">“${textarea.value}”</div>
            <div class="date">Agora</div>
        `;
        feed.prepend(newCard);
    }

    // Limpar campos
    textarea.value = "";
}

function openMenu() {
    document.getElementById("side-menu").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeMenu() {
    document.getElementById("side-menu").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}