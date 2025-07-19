/**
 * Module LoadingAnimation pour afficher et masquer une animation de chargement.
 * * Usage :
 * - LoadingAnimation.start() : Lance l'animation en plein écran.
 * - LoadingAnimation.start('monId') : Lance l'animation sur l'élément avec l'ID 'monId'.
 * - LoadingAnimation.stop() : Arrête l'animation en plein écran.
 * - LoadingAnimation.stop('monId') : Arrête l'animation sur l'élément 'monId'.
 */
const LoadingAnimation = {

    // Le HTML de votre animation de loupe.
    // IMPORTANT : Assurez-vous que les chemins des images (src) sont corrects
    // par rapport à la page HTML finale qui utilisera ce script.
    loaderHTML: `
        <div class="loading-animation-wrapper">
            <div class="loader-container">
                <div class="cercle">
                    <div class="rotating-circle">
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <rect width="100" height="100" fill="url(#pattern0_2701_2)"/>
                        <defs>
                        <pattern id="pattern0_2701_2" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlink:href="#image0_2701_2" transform="scale(0.01)"/>
                        </pattern>
                        <image id="image0_2701_2" width="100" height="100" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
                        </defs>
                        </svg>

                    </div>
                    <div class="immeuble_contenaire">
                        <div class="btm"></div>
                        <div class="btm"></div>
                        <div class="btm"></div>
                    </div>
                </div>
                <div class="fixed-handle">
                    <svg width="50" height="52" viewBox="0 0 50 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.02073 13.8185L33.0333 45.6285C34.9904 47.7028 37.9142 48.5602 40.6817 47.8714V47.8714C43.3571 47.2055 45.4913 45.1919 46.3116 42.5597V42.5597C47.16 39.8369 46.4739 36.8682 44.5168 34.7939L14.5042 2.9839" stroke="black" stroke-width="6"/>
                    </svg>

                </div>
            </div>
        </div>
    `,

    // Le CSS nécessaire pour l'animation et les conteneurs.
    // Ce CSS sera injecté dans la page automatiquement.
    loaderCSS: `
        /* --- Conteneur pour le mode plein écran --- */
        #page-loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        /* --- Conteneur pour le mode sur un élément spécifique --- */
        .element-loader-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
        
        /* Wrapper pour l'animation pour contrôler sa taille */
        .loading-animation-wrapper {
            width: 80px; /* Taille de base pour l'animation */
            height: 80px;
        }

        /* Styles de votre animation */
        .loading-animation-wrapper .loader-container {
            position: relative;
            width: 100%;
            height: 100%;
        }
        .loading-animation-wrapper .rotating-circle {
            position: absolute;
            top: -5%; left: -10%;
            width: 100%; height: 100%;
            animation: loading-anim-rotate 3s linear infinite;
        }
        .loading-animation-wrapper .rotating-circle svg { width: 100%; height: 100%; }
        .loading-animation-wrapper .immeuble_contenaire {
            position: absolute;
            left: 12%; top: 19%;
            width: 50%; height: 50%;
        }
        .loading-animation-wrapper .btm {
            position: absolute;
            width: 14%;
            background-color: black;
            bottom: 0;
        }
        .loading-animation-wrapper .btm:nth-child(1) { left: 20%; height: 60%; animation: loading-anim-changeSize_1 2s infinite; }
        .loading-animation-wrapper .btm:nth-child(2) { left: 50%; height: 100%; animation: loading-anim-changeSize_2 3s infinite; }
        .loading-animation-wrapper .btm:nth-child(3) { left: 80%; height: 80%; animation: loading-anim-changeSize_3 2.5s infinite; }
        .loading-animation-wrapper .fixed-handle {
            position: absolute;
            bottom: 0; right: 0;
            width: 54%; height: 46%;
            transform: translate(25%, 40%);
        }
        .loading-animation-wrapper .fixed-handle svg { width: 90%; height: 90%; }

        @keyframes loading-anim-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes loading-anim-changeSize_1 { 0%, 100% { height: 60%; } 50% { height: 30%; } }
        @keyframes loading-anim-changeSize_2 { 0%, 100% { height: 100%; } 50% { height: 50%; } }
        @keyframes loading-anim-changeSize_3 { 0%, 100% { height: 80%; } 50% { height: 40%; } }
    `,

    /**
     * Injecte le CSS de l'animation dans le <head> si ce n'est pas déjà fait.
     */
    _injectCSS: function() {
        if (!document.getElementById('loader-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'loader-animation-styles';
            style.textContent = this.loaderCSS;
            document.head.appendChild(style);
        }
    },

    /**
     * Démarre l'animation de chargement.
     * @param {string|null} elementId - L'ID de l'élément cible. Si null, s'applique à toute la page.
     */
    start: function(elementId = null) {
        this._injectCSS();

        if (elementId) {
            // --- Mode sur un élément spécifique ---
            const targetElement = document.getElementById(elementId);
            if (!targetElement) {
                console.error(`LoadingAnimation: L'élément avec l'ID "${elementId}" n'a pas été trouvé.`);
                return;
            }

            // Assurer que l'élément parent peut contenir un élément en position absolute
            if (getComputedStyle(targetElement).position === 'static') {
                targetElement.style.position = 'relative';
            }

            // Créer et ajouter l'overlay
            const overlay = document.createElement('div');
            overlay.className = 'element-loader-overlay';
            // Ajouter un attribut pour le retrouver facilement lors de l'arrêt
            overlay.dataset.loaderFor = elementId; 
            overlay.innerHTML = this.loaderHTML;
            targetElement.appendChild(overlay);

        } else {
            // --- Mode plein écran ---
            if (document.getElementById('page-loader-overlay')) return; // Déjà actif

            const overlay = document.createElement('div');
            overlay.id = 'page-loader-overlay';
            overlay.innerHTML = this.loaderHTML;
            document.body.appendChild(overlay);
        }
    },

    /**
     * Arrête l'animation de chargement.
     * @param {string|null} elementId - L'ID de l'élément cible. Si null, arrête celui en plein écran.
     */
    stop: function(elementId = null) {
        if (elementId) {
            const loader = document.querySelector(`.element-loader-overlay[data-loader-for="${elementId}"]`);
            if (loader) {
                loader.remove();
            }
        } else {
            const loader = document.getElementById('page-loader-overlay');
            if (loader) {
                loader.remove();
            }
        }
    }
};