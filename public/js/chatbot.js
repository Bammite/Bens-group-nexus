// js/chatbot.js

document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const chatbotIcon = document.getElementById('chatbot_icon');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbotBtn = document.getElementById('close-chatbot');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chatbot-messages');

    // Seuil pour déterminer si l'écran est "petit" ou "grand"
    const smallScreenBreakpoint = 200; // en pixels

    // --- Gestion de l'ouverture du Chatbot ---
    chatbotIcon.addEventListener('click', () => {
        // Vérifier la largeur de la fenêtre
        if (window.innerWidth > smallScreenBreakpoint) {
            // Grand écran : ouvrir la boîte de dialogue
            chatbotContainer.classList.add('active');
        } else {
            // Petit écran : ouvrir une nouvelle page
            window.open('chatbot_mobile.html', '_blank');
        }
    });

    // --- Gestion de la fermeture de la boîte de dialogue (grand écran) ---
    if (closeChatbotBtn) {
        closeChatbotBtn.addEventListener('click', () => {
            chatbotContainer.classList.remove('active');
        });
    }

    // --- Simulation de la conversation (à remplacer par votre LLM) ---
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const userText = userInput.value.trim();
        if (userText === '') return;

        // Afficher le message de l'utilisateur
        addMessage(userText, 'user');
        userInput.value = '';

        // Simuler une réponse du bot après un court délai
        setTimeout(() => {
            const botResponse = getBotResponse(userText);
            addMessage(botResponse, 'bot');
        }, 1000);
    }

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        messagesContainer.appendChild(messageElement);
        // Scroller vers le bas pour voir le nouveau message
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Logique de base du Bot (à remplacer par une connexion à un LLM)
    function getBotResponse(userText) {
        const lowerUserText = userText.toLowerCase();
        if (lowerUserText.includes('transport') || lowerUserText.includes('livraison')) {
            return "Bens Groupe est une entreprise spécialisée dans le transport de marchandises et de matériaux de construction. Comment puis-je vous aider concernant nos services de transport ?";
        } else if (lowerUserText.includes('matériaux') || lowerUserText.includes('vente')) {
            return "Nous proposons une large gamme de matériaux de construction. Avez-vous une question sur un produit spécifique ?";
        } else if (lowerUserText.includes('suivre') || lowerUserText.includes('commande')) {
            return "Vous pouvez suivre votre commande en cliquant sur le bouton 'Suivre ma commande' sur la page d'accueil et en entrant votre numéro de commande et votre email.";
        } else if (lowerUserText.includes('bonjour') || lowerUserText.includes('salut')) {
            return "Bonjour ! Comment puis-je vous aider aujourd'hui concernant Bens Groupe ou le suivi de votre commande ?";
        } else {
            return "Je suis ici pour répondre à vos questions sur Bens Groupe et le suivi de commande. N'hésitez pas à me solliciter !";
        }
    }
});