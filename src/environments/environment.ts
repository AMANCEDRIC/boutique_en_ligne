/**
 * Configuration Firebase + Cloudinary.
 *
 * Ces valeurs sont publiques par nature (elles finissent dans le bundle JS).
 * La sécurité repose sur `firestore.rules` et sur les restrictions du preset Cloudinary.
 *
 * Tant que `firebase.projectId` est vide, le site tourne en « mode démo » :
 * articles de démonstration en lecture seule, espace admin désactivé.
 */
export const environment = {
  firebase: {
    apiKey: 'AIzaSyB9_uhKPJwxIeECrPqF67K4RjDREDiXDf4',
    authDomain: 'maison-shein.firebaseapp.com',
    projectId: 'maison-shein',
    storageBucket: 'maison-shein.firebasestorage.app',
    messagingSenderId: '255099292390',
    appId: '1:255099292390:web:2126d9f419ec8fcded4927',
  },
  cloudinary: {
    cloudName: 'tffonkkr',
    uploadPreset: 'maison_shein',
  },
};

export const isFirebaseConfigured = !!environment.firebase.projectId;
export const isCloudinaryConfigured = !!environment.cloudinary.cloudName;
