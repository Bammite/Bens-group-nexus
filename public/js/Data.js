import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    getDocs, 
    limit as firestoreLimit,
    orderBy,
    doc, 
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// --- CONFIGURATION FIREBASE ---
// ATTENTION : Il est déconseillé de laisser vos clés de configuration directement dans le code source
// pour des raisons de sécurité. Considérez l'utilisation de variables d'environnement.
const firebaseConfig = {
    apiKey: "__FIREBASE_API_KEY__",
    authDomain: "__FIREBASE_AUTH_DOMAIN__",
    databaseURL: "__FIREBASE_DATABASE_URL__",
    projectId: "__FIREBASE_PROJECT_ID__",
    storageBucket: "__FIREBASE_STORAGE_BUCKET__",
    messagingSenderId: "__FIREBASE_MESSAGING_SENDER_ID__",
    appId: "__FIREBASE_APP_ID__",
    measurementId: "__FIREBASE_MEASUREMENT_ID__"
};

// --- INITIALISATION ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// =================================================================================
// --- FONCTIONS GÉNÉRIQUES CRUD (Create, Read, Update, Delete) ---
// =================================================================================

/**
 * CRÉER un document dans une collection Firestore.
 * @param {string} collectionName - Le nom de la collection.
 * @param {object} data - L'objet contenant les données à ajouter.
 * @param {string} [docId] - L'ID optionnel pour le document. Si non fourni, un ID sera généré automatiquement.
 * @returns {Promise<string|null>} L'ID du document créé, ou null en cas d'erreur.
 */
const createData = async (collectionName, data, docId) => {
    try {
        let docRef;
        if (docId) {
            // Utilise l'ID fourni pour créer le document
            docRef = doc(db, collectionName, docId);
            await setDoc(docRef, data);
            console.log(`Document créé avec l'ID '${docId}' dans '${collectionName}'.`);
            return docId;
        } else {
            // Laisse Firebase générer un ID automatiquement
            const collectionRef = collection(db, collectionName);
            docRef = await addDoc(collectionRef, data);
            console.log(`Document créé avec l'ID '${docRef.id}' dans '${collectionName}'.`);
            return docRef.id;
        }
    } catch (error) {
        console.error(`Erreur lors de la création du document dans '${collectionName}':`, error);
        return null;
    }
};

/**
 * LIRE des documents depuis une collection Firestore. (Votre fonction originale)
 * @param {string} collectionName - Le nom de la collection.
 * @param {object} [filter] - Filtre optionnel. Ex: { field: "ID_Ops", value: "Maint_S2_2025" }
 * @param {number} [docLimit] - Limite optionnelle du nombre de documents.
 * @returns {Promise<Array<object>>} Un tableau de documents.
 */
const getData = async (collectionName, filter, docLimit) => {
    try {
        const collectionRef = collection(db, collectionName);
        let q;
        if (filter && filter.field && filter.value) {
            q = query(collectionRef, where(filter.field, "==", filter.value), ...(docLimit ? [firestoreLimit(docLimit)] : []));
        } else {
            q = query(collectionRef, ...(docLimit ? [firestoreLimit(docLimit)] : []));
        }
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Données récupérées depuis '${collectionName}':`, data.length, "documents.");
        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des données de '${collectionName}':`, error);
        return [];
    }
};

/**
 * METTRE À JOUR un document existant dans une collection Firestore.
 * @param {string} collectionName - Le nom de la collection.
 * @param {string} docId - L'ID du document à mettre à jour.
 * @param {object} data - L'objet contenant les champs à mettre à jour.
 * @returns {Promise<boolean>} True si la mise à jour a réussi, false sinon.
 */
const updateData = async (collectionName, docId, data) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, data);
        console.log(`Document '${docId}' mis à jour dans '${collectionName}'.`);
        return true;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du document '${docId}' dans '${collectionName}':`, error);
        return false;
    }
};

/**
 * SUPPRIMER un document d'une collection Firestore.
 * @param {string} collectionName - Le nom de la collection.
 * @param {string} docId - L'ID du document à supprimer.
 * @returns {Promise<boolean>} True si la suppression a réussi, false sinon.
 */
const deleteData = async (collectionName, docId) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
        console.log(`Document '${docId}' supprimé de '${collectionName}'.`);
        return true;
    } catch (error) {
        console.error(`Erreur lors de la suppression du document '${docId}' de '${collectionName}':`, error);
        return false;
    }
};


// =================================================================================
// --- Fonctions Spécifiques par Collection (Exportées) ---
// =================================================================================

// --- Collection: CLIENTS ---
export const getClients = (filter, docLimit) => getData("CLIENTS", filter, docLimit);
export const createClient = (data, docId) => createData("CLIENTS", data, docId);
export const updateClient = (docId, data) => updateData("CLIENTS", docId, data);
export const deleteClient = (docId) => deleteData("CLIENTS", docId);

// --- Collection: Comptes_Client ---
export const getComptesClient = (filter, docLimit) => getData("Comptes_Client", filter, docLimit);
export const createCompteClient = (data, docId) => createData("Comptes_Client", data, docId);
export const updateCompteClient = (docId, data) => updateData("Comptes_Client", docId, data);
export const deleteCompteClient = (docId) => deleteData("Comptes_Client", docId);

// --- Collection: ops_ligne_transport ---
export const getOpsLigneTransport = (filter, docLimit) => getData("ops_ligne_transport", filter, docLimit);
export const createOpsLigneTransport = (data) => createData("ops_ligne_transport", data);
export const updateOpsLigneTransport = (docId, data) => updateData("ops_ligne_transport", docId, data);
export const deleteOpsLigneTransport = (docId) => deleteData("ops_ligne_transport", docId);

// --- Collection: ops_ligne_gps ---
export const getOpsLigneGps = (filter, docLimit) => getData("ops_ligne_gps", filter, docLimit);
export const createOpsLigneGps = (data, docId) => createData("ops_ligne_gps", data, docId);
export const updateOpsLigneGps = (docId, data) => updateData("ops_ligne_gps", docId, data);
export const deleteOpsLigneGps = (docId) => deleteData("ops_ligne_gps", docId);

// ... Ajoutez ici les autres fonctions spécifiques pour chaque collection sur le même modèle ...
// Exemple pour 'incidents_ops'
export const getIncidentsOps = (filter, docLimit) => getData("incidents_ops", filter, docLimit);
export const createIncidentOps = (data) => createData("incidents_ops", data);
export const updateIncidentOps = (docId, data) => updateData("incidents_ops", docId, data);
export const deleteIncidentOps = (docId) => deleteData("incidents_ops", docId);


//------ colection: Devis ----
export const getDevis = (filter, docLimit) => getData("Devis", filter, docLimit);
export const createDevis = (data) => createData("Devis", data);
export const updateDevis = (docId, data) => updateData("Devis", docId, data);
export const deleteDevis = (docId) => deleteData("Devis", docId);

//-------Collection FormulaireContact -----

export const getFormulaireContact = (filter, docLimit) => getData("FormulaireContact", filter, docLimit);
export const createFormulaireContact = (data) => createData("FormulaireContact", data);
export const updateFormulaireContact = (docId, data) => updateData("FormulaireContact", docId, data);
export const deleteFormulaireContact = (docId) => deleteData("FormulaireContact", docId);

// =================================================================================
// --- Exemples d'utilisation ---
// =================================================================================

// (async () => {
//     console.log("--- DÉBUT DES EXEMPLES CRUD ---");

//     // --- EXEMPLE 1: CRÉATION ---
//     console.log("\n[Exemple 1] Création d'un nouveau client...");
//     const nouveauClientData = {
//         Nom: "Fatou Diop",
//         Email: "fatou.diop@example.com",
//         Telephone: "+221771234567",
//         DateCreation: new Date()
//     };
//     // Laisse Firebase générer l'ID
//     const nouveauClientId = await createClient(nouveauClientData);
//     if (nouveauClientId) {
//         console.log(`Client créé avec succès. ID: ${nouveauClientId}`);

//         // --- EXEMPLE 2: LECTURE (pour vérifier) ---
//         console.log("\n[Exemple 2] Lecture du client nouvellement créé...");
//         const clientCree = await getClients({ field: "Email", value: "fatou.diop@example.com" });
//         console.log("Client trouvé:", clientCree);

//         // --- EXEMPLE 3: MISE À JOUR ---
//         console.log("\n[Exemple 3] Mise à jour du téléphone du client...");
//         const updateSuccess = await updateClient(nouveauClientId, { Telephone: "+221779998877" });
//         if (updateSuccess) {
//             const clientMisAJour = await getClients(null, 100).then(clients => clients.find(c => c.id === nouveauClientId));
//             console.log("Client après mise à jour:", clientMisAJour);
//         }

//         // --- EXEMPLE 4: SUPPRESSION ---
//         console.log("\n[Exemple 4] Suppression du client...");
//         const deleteSuccess = await deleteClient(nouveauClientId);
//         if (deleteSuccess) {
//             console.log(`Le client avec l'ID ${nouveauClientId} a été supprimé.`);
//         }
//     }

//     console.log("\n--- FIN DES EXEMPLES CRUD ---");
// })();
