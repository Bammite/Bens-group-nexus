document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets (identique)
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const tabIndicator = document.getElementById('tab-indicator');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const activeTabIndex = Array.from(tabs).findIndex(t => t.classList.contains('active'));
            const clickedTabIndex = Array.from(tabs).findIndex(t => t === this);
            tabIndicator.style.transform = `translateX(${clickedTabIndex * 100}%)`;
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            forms.forEach(form => {
                if (form.id === `${tabId}-form`) {
                    form.classList.remove('slide-in-left', 'slide-in-right');
                    form.classList.add(clickedTabIndex > activeTabIndex ? 'slide-in-right' : 'slide-in-left');
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        });
    });

    // Éléments du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    const loginIdInput = document.getElementById('login-id');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const loginPasswordInput = document.getElementById('login-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordGroup = document.getElementById('login-password-group');
    const newPasswordGroup = document.getElementById('new-password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const contactGroup = document.getElementById('contact-group');

    // Logique de connexion conditionnelle
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const clientId = loginIdInput.value.trim();
        
        if (!clientId) {
            showError('login-id-error', 'Veuillez entrer votre identifiant');
            return;
        }
        
        LoadingAnimation.start('login-loading');
        
        try {
            // 1. Première Vérification : Compte existant dans Comptes_Client ?
            const response = await fetch('/api/verify-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId })
            });
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Erreur de vérification');
            }

            // Gérer les différents cas selon le statut
            switch (result.status) {
                case 'EXISTING_ACCOUNT':
                    // Compte existant : montrer le champ mot de passe
                    showPasswordField();
                    loginSubmitBtn.textContent = "Se connecter";
                    // Stocker l'email d'auth pour la connexion
                    loginForm.dataset.authEmail = result.authEmail;
                    break;

                case 'NEW_ACCOUNT_NEEDED':
                    // Client existant sans compte : montrer les champs de création
                    showNewPasswordFields();
                    loginSubmitBtn.textContent = "Créer mon compte";
                    break;

                case 'UNKNOWN_CLIENT':
                    // Client inconnu : suggérer l'inscription
                    showError('login-id-error', 'Identifiant introuvable. Veuillez vous inscrire.');
                    suggestRegistration();
                    break;
            }
            
            // Selon l'état du formulaire, gérer la soumission
            const formState = loginSubmitBtn.textContent;
            
            if (formState === "Se connecter") {
                const password = loginPasswordInput.value;
                if (!password) {
                    showError('login-password-error', 'Veuillez entrer votre mot de passe');
                    return;
                }

                try {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            authEmail: loginForm.dataset.authEmail,
                            password: password
                        })
                    });

                    const result = await response.json();
                    if (result.success) {
                        window.location.href = '/dashboard';
                    } else {
                        showError('login-password-error', 'Mot de passe incorrect');
                    }
                } catch (error) {
                    showError('login-password-error', 'Erreur de connexion');
                }
            } 
            else if (formState === "Créer mon compte") {
                const newPassword = newPasswordInput.value;
                const confirmPassword = confirmPasswordInput.value;
                const contactInfo = document.getElementById('contact-info').value.trim();

                if (!newPassword || !confirmPassword) {
                    showError('new-password-error', 'Veuillez remplir tous les champs');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    showError('confirm-password-error', 'Les mots de passe ne correspondent pas');
                    return;
                }

                try {
                    const response = await fetch('/api/create-account', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            clientId: clientId,
                            password: newPassword,
                            contactInfo: contactInfo
                        })
                    });

                    const result = await response.json();
                    if (result.success) {
                        window.location.href = '/dashboard';
                    } else {
                        showError('new-password-error', result.error || 'Erreur lors de la création du compte');
                    }
                } catch (error) {
                    showError('new-password-error', 'Erreur lors de la création du compte');
                }
                }
                    
                if (clients.length > 0) {
                    const newPassword = document.getElementById('new-password').value;
                    const confirmPassword = document.getElementById('confirm-password').value;
                    const contactInfo = document.getElementById('contact-info').value.trim();
                    
                    if (!newPassword || !confirmPassword) {
                        showNewPasswordFields();
                        loginSubmitBtn.textContent = "Créer le mot de passe";
                        return;
                    }
                    
                    if (newPassword !== confirmPassword) {
                        showError('confirm-password-error', 'Les mots de passe ne correspondent pas');
                        return;
                    }
                    
                    // Création du compte (adaptez selon votre logique)
                    try {
                        // Déterminer l'email d'authentification et le contact associé
                        let authEmail;
                        let contactAssocie;

                        if (contactInfo) {
                            if (validateEmail(contactInfo)) {
                                // Si l'info fournie est un email, on l'utilise pour tout
                                authEmail = contactInfo;
                                contactAssocie = contactInfo;
                            } else {
                                // Sinon (téléphone), on génère un email de service
                                authEmail = `${clientId}@bens-groupe.nexus`;
                                contactAssocie = contactInfo;
                            }
                        } else {
                            // Si rien n'est fourni, on se rabat sur l'email du client (s'il existe)
                            authEmail = clients[0].email || `${clientId}@bens-groupe.nexus`;
                            contactAssocie = clients[0].email || '';
                        }

                        const response = await fetch('/api/create-account', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: authEmail,
                                password: newPassword,
                                clientId: clientId,
                                contactInfo: contactAssocie
                            })
                        });

                        const result = await response.json();
                        if (!result.success) {
                            throw new Error(result.error || "Erreur lors de la création du compte");
                        }

                        const { uid } = result.user;

                        if (!newAccountId) console.error("Le compte client n'a pas pu être créé dans Firestore.");
                        
                        // Création de la session avant la redirection
                        const user = userCredential.user;
                        if (user) {
                            const idToken = await user.getIdToken();
                            const response = await fetch('/api/sessionLogin', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ idToken })
                            });

                            if (response.ok) window.location.href = '/dashboard';
                            else showError('new-password-error', 'Erreur de session. Veuillez réessayer.');
                        }
                    } catch (error) {
                        console.error("Erreur création compte:", error);
                        showError('new-password-error', 'Erreur lors de la création du compte');
                    }
                } 
                else {
                    // Identifiant introuvable
                    showError('login-id-error', 'Identifiant introuvable. Veuillez vous inscrire.');
                    suggestRegistration();
                }
        } 
        catch (error) {
            console.error("Erreur de vérification:", error);
            showError('login-id-error', 'Erreur de connexion au serveur');
        } 
        finally {
            LoadingAnimation.stop('login-loading');
        }
    });

    // Logique d'inscription (inchangée)
    document.getElementById('register-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        LoadingAnimation.start('register-loading');
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const phone = document.getElementById('register-phone').value.trim();
        const termsAccepted = document.getElementById('register-terms').checked;
        let isValid = true;

        // Validation (identique)
        if (!name) {
            showError('register-name-error', 'Veuillez entrer votre nom complet');
            isValid = false;
        } else {
            hideError('register-name-error');
        }

        if (!email && !phone) {
            showError('register-email-error', 'Veuillez renseigner au moins un email ou un numéro de téléphone');
            showError('register-phone-error', 'Veuillez renseigner au moins un email ou un numéro de téléphone');
            isValid = false;
        } else {
            hideError('register-email-error');
            hideError('register-phone-error');
            if (email && !validateEmail(email)) {
                showError('register-email-error', 'Veuillez entrer un email valide');
                isValid = false;
            }
            if (phone && !validatePhone(phone)) {
                showError('register-phone-error', 'Veuillez entrer un numéro valide');
                isValid = false;
            }
        }

        if (!termsAccepted) {
            alert('Veuillez accepter les conditions d\'utilisation');
            isValid = false;
        }
        if (!isValid) {
            LoadingAnimation.stop('register-loading');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone })
            });
            const result = await response.json();
            if (result.success) {
                LoadingAnimation.stop('register-loading');
                console.log('info envoyées', name, email, phone);
                if (email!=='' && phone!=='') {
                    showTraiementInscriptionModal(name, 'Email et téléphone');
                }
                else if (email) {
                    showTraiementInscriptionModal(name, 'Email');
                }
                else if (phone) {
                    showTraiementInscriptionModal(name, 'Téléphone');
                }
            } else {
                showError('register-email-error', result.error || 'Erreur inscription');
            }
        } catch (err) {
            LoadingAnimation.stop('register-loading');
            console.error(err);
            showError('register-email-error', 'Erreur réseau ou serveur');
        }
    });

    // Fonctions utilitaires
    function showPasswordField() {
        passwordGroup.style.display = 'block';
        loginPasswordInput.required = true;
        newPasswordGroup.style.display = 'none';
        newPasswordInput.required = false;
        confirmPasswordGroup.style.display = 'none';
        confirmPasswordInput.required = false;
        contactGroup.style.display = 'none';
        hideError('login-id-error');
    }
    
    function showNewPasswordFields() {
        passwordGroup.style.display = 'none';
        loginPasswordInput.required = false;
        newPasswordGroup.style.display = 'block';
        newPasswordInput.required = true;
        confirmPasswordGroup.style.display = 'block';
        confirmPasswordInput.required = true;
        contactGroup.style.display = 'block';
        hideError('login-id-error');
    }
    
    function suggestRegistration() {
        document.querySelector('.auth-tab[data-tab="register"]').click();
    }
    
    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        element.textContent = message;
        element.style.display = 'block';
    }
    
    function hideError(elementId) {
        const element = document.getElementById(elementId);
        element.style.display = 'none';
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^(\+?\d{1,4}[\s.-]?)?(\d{2,3}[\s.-]?){3,4}$/;
        return re.test(phone);
    }
    
    function formatPhone(phone) {
        return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }

    function showTraiementInscriptionModal(name, contact) {
        console.log(`Affichage modal pour ${name} avec contact: ${contact}`);
        const modal = document.getElementById('traiementInscription-modal');
        const contactSpan = modal.querySelector('.contact');
        if(name){
            document.querySelector('.nameInscription').textContent = `, Mr/s ${name}`;
            if(contact === 'Email et téléphone') {
                contactSpan.textContent = "+221781941351 ou contact@bens-groupe.com";
            }
            else if(contact === 'Email') {
                contactSpan.textContent = "contact@bens-groupe.com";
            }
            else if(contact === 'Téléphone') {
                contactSpan.textContent = "+221781941351";
            }
        }
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        modal.querySelector('.modal-ok').onclick = closeTraiementInscriptionModal;
        modal.querySelector('.close-modal').onclick = closeTraiementInscriptionModal;
    }

    function closeTraiementInscriptionModal() {
        const modal = document.getElementById('traiementInscription-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Animation chargement
const LoadingAnimation = {
    start: function(containerId) {
        const container = document.getElementById(containerId);
        if (container) container.style.display = 'block';
    },
    stop: function(containerId) {
        const container = document.getElementById(containerId);
        if (container) container.style.display = 'none';
    }
};