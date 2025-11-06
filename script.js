document.addEventListener('DOMContentLoaded', () => {

    const MEU_DISCORD_ID = '422144493953744906'; 
    
    const COTACAO_GOLD = 2.1; 
    const PRECO_POR_KEY = 9.50;

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const goldQuantityInput = document.getElementById('gold-quantity');
    const goldServerInput = document.getElementById('gold-server');
    const goldCotacaoDisplay = document.getElementById('gold-cotacao');
    const goldTotalDisplay = document.getElementById('gold-total-display');

    const keyQuantityInput = document.getElementById('key-quantity');
    const keyNicknameInput = document.getElementById('key-nickname');
    const keyEmailInput = document.getElementById('key-email');
    const keyTotalDisplay = document.getElementById('key-total-display');

    const summaryTotalGold = document.getElementById('summary-total-gold');
    const summaryTotalKeyDeFly = document.getElementById('summary-total-keydefly');
    const summaryTotalGeral = document.getElementById('summary-total-geral');
    
    const confirmOrderButton = document.getElementById('confirm-order-button'); 
    const copyFeedback = document.getElementById('copy-feedback');
    
    let currentTotalGold = 0;
    let currentTotalKey = 0;

    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    goldCotacaoDisplay.textContent = formatCurrency(COTACAO_GOLD);

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });

    function updateSummary() {
        const totalGeral = currentTotalGold + currentTotalKey;
        
        summaryTotalGold.textContent = formatCurrency(currentTotalGold);
        summaryTotalKeyDeFly.textContent = formatCurrency(currentTotalKey);
        summaryTotalGeral.textContent = formatCurrency(totalGeral);
    }

    goldQuantityInput.addEventListener('input', () => {
        const quantity = parseInt(goldQuantityInput.value) || 0;
        currentTotalGold = (quantity / 1000) * COTACAO_GOLD; 
        goldTotalDisplay.textContent = formatCurrency(currentTotalGold);
        updateSummary();
    });

    keyQuantityInput.addEventListener('input', () => {
        const quantity = parseInt(keyQuantityInput.value) || 0;
        currentTotalKey = quantity * PRECO_POR_KEY;
        keyTotalDisplay.textContent = formatCurrency(currentTotalKey);
        updateSummary();
    });

    confirmOrderButton.addEventListener('click', () => {
        const goldQty = parseInt(goldQuantityInput.value) || 0;
        const goldServer = goldServerInput.value || 'N/A';
        
        const keyQty = parseInt(keyQuantityInput.value) || 0;
        const keyNickname = keyNicknameInput.value || 'N/A';
        const keyEmail = keyEmailInput.value || 'N/A';
        
        const totalGeral = currentTotalGold + currentTotalKey;

        if (totalGeral <= 0) {
            copyFeedback.textContent = 'Adicione itens ao pedido primeiro!';
            setTimeout(() => { copyFeedback.textContent = ''; }, 3000);
            return; 
        }

        let summaryText = "```\n--- NOVO PEDIDO ---\n\n";

        if (goldQty > 0) {
            summaryText += `Produto: Gold\n`;
            summaryText += `Quantidade: ${goldQty}\n`;
            summaryText += `Servidor: ${goldServer}\n`;
            summaryText += `Subtotal Gold: ${formatCurrency(currentTotalGold)}\n\n`;
        }

        if (keyQty > 0) {
            summaryText += `Produto: KeyDeFly\n`;
            summaryText += `Quantidade: ${keyQty}\n`;
            summaryText += `Nickname: ${keyNickname}\n`;
            summaryText += `Email: ${keyEmail}\n`;
            summaryText += `Subtotal Keys: ${formatCurrency(currentTotalKey)}\n\n`;
        }

        summaryText += `-------------------------\n`;
        summaryText += `TOTAL GERAL: ${formatCurrency(totalGeral)}\n`;
        summaryText += `-------------------------\n`;
        summaryText += "```";

        navigator.clipboard.writeText(summaryText).then(() => {
            copyFeedback.textContent = 'Pedido copiado! Abrindo seu perfil...';
            
            const discordProfileURL = `https://discord.com/users/${MEU_DISCORD_ID}`;
            window.open(discordProfileURL, '_blank');
            
            setTimeout(() => { copyFeedback.textContent = 'Cole o pedido na DM!'; }, 4000);
            setTimeout(() => { copyFeedback.textContent = ''; }, 8000);
            
        }).catch(err => {
            copyFeedback.textContent = 'Erro ao copiar. Tente manualmente.';
            console.error('Erro ao copiar: ', err);
            setTimeout(() => { copyFeedback.textContent = ''; }, 3000);
        });
    });

    updateSummary();

});
