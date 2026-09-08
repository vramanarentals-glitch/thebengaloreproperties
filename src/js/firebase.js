import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

// Default Firebase Configuration for The Bangalore Properties
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-demo-thebangaloreproperties-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "thebangaloreproperties.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "thebangaloreproperties",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "thebangaloreproperties.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "8050407710",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:8050407710:web:tbp123456"
};

let db = null;
let firebaseApp = null;

export function initFirebase() {
  // Check if custom config exists in localStorage
  let config = DEFAULT_FIREBASE_CONFIG;
  const localConfigStr = localStorage.getItem('tbp_firebase_config');
  if (localConfigStr) {
    try {
      const cfg = JSON.parse(localConfigStr);
      if (cfg && cfg.apiKey && cfg.projectId) {
        config = cfg;
      }
    } catch (e) {
      console.warn('Invalid local firebase config');
    }
  }

  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApps()[0];
    }
    db = getFirestore(firebaseApp);
    console.log('🔥 Firebase Firestore Cloud Sync initialized for project:', config.projectId);
    return { isConfigured: true, db, projectId: config.projectId };
  } catch (err) {
    console.error('❌ Firebase Firestore Initialization Error:', err);
    return { isConfigured: false, error: err.message };
  }
}

export function isFirebaseConfigured() {
  return db !== null;
}

// -------------------------------------------------------------
// Real-time Cloud Sync for Properties
// -------------------------------------------------------------

/**
 * Subscribe to real-time updates from Firestore 'properties' collection.
 * Triggers callback IMMEDIATELY whenever any device adds, edits, or deletes a property!
 */
export function subscribeCloudProperties(onUpdateCallback) {
  if (!db) initFirebase();
  if (!db) return () => {};

  try {
    const propsCol = collection(db, 'properties');
    const unsubscribe = onSnapshot(propsCol, (snapshot) => {
      const properties = [];
      snapshot.forEach((docSnap) => {
        properties.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      console.log(`🔥 Firebase Realtime Sync: Received ${properties.length} properties from cloud.`);
      onUpdateCallback(properties);
    }, (error) => {
      console.warn('Firestore real-time subscription note:', error.message);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to cloud properties:', err.message);
    return () => {};
  }
}

/**
 * Save or update a single property in Firestore 'properties' collection
 */
export async function saveCloudProperty(property) {
  if (!db) initFirebase();
  if (!db) return false;

  try {
    const propId = property.id || `prop-custom-${Date.now()}`;
    const propRef = doc(db, 'properties', propId);
    const dataToSave = {
      ...property,
      id: propId,
      updatedAt: new Date().toISOString()
    };
    await setDoc(propRef, dataToSave, { merge: true });
    console.log(`🔥 Property ${propId} saved to Firebase Firestore!`);
    return true;
  } catch (err) {
    console.error('Failed to save property to Firestore:', err);
    return false;
  }
}

/**
 * Delete a property document from Firestore
 */
export async function deleteCloudProperty(propertyId) {
  if (!db) initFirebase();
  if (!db) return false;

  try {
    const propRef = doc(db, 'properties', propertyId);
    await deleteDoc(propRef);
    console.log(`🔥 Property ${propertyId} deleted from Firebase Firestore!`);
    return true;
  } catch (err) {
    console.error('Failed to delete property from Firestore:', err);
    return false;
  }
}

/**
 * Batch seed default properties to Firebase Firestore
 */
export async function seedCloudProperties(propertiesList) {
  if (!db) initFirebase();
  if (!db) return false;

  try {
    for (const prop of propertiesList) {
      await saveCloudProperty(prop);
    }
    return true;
  } catch (err) {
    console.error('Failed to seed properties to Firestore:', err);
    return false;
  }
}

// -------------------------------------------------------------
// Real-time Cloud Sync for Tenant Leads / Inquiries
// -------------------------------------------------------------

export function subscribeCloudLeads(onUpdateCallback) {
  if (!db) initFirebase();
  if (!db) return () => {};

  try {
    const leadsCol = collection(db, 'leads');
    const unsubscribe = onSnapshot(leadsCol, (snapshot) => {
      const leads = [];
      snapshot.forEach((docSnap) => {
        leads.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });
      onUpdateCallback(leads);
    }, (error) => {
      console.warn('Firestore leads subscription note:', error.message);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to cloud leads:', err.message);
    return () => {};
  }
}

export async function saveCloudLead(lead) {
  if (!db) initFirebase();
  if (!db) return false;

  try {
    const leadId = lead.id || `lead-${Date.now()}`;
    const leadRef = doc(db, 'leads', leadId);
    await setDoc(leadRef, { ...lead, id: leadId, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to save lead to Firestore:', err);
    return false;
  }
}

export async function deleteCloudLead(leadId) {
  if (!db) initFirebase();
  if (!db) return false;

  try {
    const leadRef = doc(db, 'leads', leadId);
    await deleteDoc(leadRef);
    return true;
  } catch (err) {
    console.error('Failed to delete lead from Firestore:', err);
    return false;
  }
}
