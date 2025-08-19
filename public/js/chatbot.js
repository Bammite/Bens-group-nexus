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

    // --- Logique de l'IA pour la conversation ---
    let conversationHistory = [];
    const CHATBOT_CONTEXT = `Tu es un assistant virtuel expert pour l'entreprise "Bens Groupe". Ton rôle est de répondre aux questions des clients de manière professionnelle, amicale et concise.
- L'entreprise a deux pôles principaux : "Bens Transport" (spécialisé dans le transport routier, notamment sur l'axe Dakar-Bamako) et "Bens Négoce" (vente de matériaux de construction comme le ciment, le fer à béton et le gravier).
- Pour suivre une commande, l'utilisateur doit utiliser le bouton "Suivre ma commande" sur le site et fournir son numéro de commande.
- Pour un devis, l'utilisateur peut utiliser les boutons "Demander un devis" sur la page.
- Sois toujours poli et guide l'utilisateur vers les bonnes sections du site si nécessaire. Ne réponds pas à des questions qui ne concernent pas Bens Groupe ou ses services.
- Garde tes réponses courtes et directes.`;

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Empêche le rechargement de la page
                sendMessage();
            }
        });
    }

    async function sendMessage() {
        const userText = userInput.value.trim();
        if (userText === '') return;

        const currentHistoryForAPI = [...conversationHistory];

        // Afficher le message de l'utilisateur et l'ajouter à l'historique local
        addMessage(userText, 'user');
        conversationHistory.push({ role: "user", parts: [{ text: userText }] });
        userInput.value = '';
        userInput.focus();

        // Afficher un indicateur de "frappe"
        showTypingIndicator();

        try {
            const response = await fetch('/chat/message', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    context: CHATBOT_CONTEXT,
                    history: currentHistoryForAPI,
                    message: userText
                })
            });

            removeTypingIndicator();

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            const botResponse = data.reply;

            // Afficher la réponse du bot et l'ajouter à l'historique
            addMessage(botResponse, 'bot');
            conversationHistory.push({ role: "model", parts: [{ text: botResponse }] });

        } catch (error) {
            console.error("Erreur lors de la communication avec le chatbot:", error);
            removeTypingIndicator();
            addMessage("Désolé, une erreur est survenue. Veuillez réessayer plus tard.", 'bot error');
        }
    }

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        // Ajoute la classe 'message' et les classes du 'sender' (ex: 'bot typing' devient 'bot' et 'typing')
        messageElement.classList.add('message', ...sender.split(' '));
        // Remplace les sauts de ligne par des <br> pour un affichage correct en HTML
        messageElement.innerHTML = text.replace(/\n/g, '<br>');
        messagesContainer.appendChild(messageElement);
        // Scroller vers le bas pour voir le nouveau message
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        addMessage('...', 'bot typing');
    }

    function removeTypingIndicator() {
        const typingIndicator = messagesContainer.querySelector('.message.bot.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
});