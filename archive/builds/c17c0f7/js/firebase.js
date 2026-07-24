// Firebase web configuration is public by design. Security depends on
// Authentication and Firestore rules, not hiding this client-side config.
export const firebaseConfig = {
  apiKey: 'AIzaSyDBXGMlf7DWPAneD96kCwS9GzLMo2xb8dQ',
  authDomain: 'memorymastery.firebaseapp.com',
  projectId: 'memorymastery',
  storageBucket: 'memorymastery.firebasestorage.app',
  messagingSenderId: '439635305999',
  appId: '1:439635305999:web:374ab9a9818b04c3dfe57a',
  measurementId: 'G-HJZ48TJ1DW'
};

let firebase;
export const configured = () => !firebaseConfig.apiKey.startsWith('YOUR_');

export async function connectFirebase() {
  if (!configured()) return null;
  if (firebase) return firebase;

  const [{ initializeApp }, authModule, firestoreModule] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js')
  ]);

  const app = initializeApp(firebaseConfig);
  const auth = authModule.getAuth(app);
  const db = firestoreModule.getFirestore(app);
  firebase = { app, auth, db, authModule, firestoreModule };
  return firebase;
}

export async function watchAuthState(callback) {
  const fb = await connectFirebase();
  if (!fb) return () => {};
  return fb.authModule.onAuthStateChanged(fb.auth, callback);
}

export async function signInWithGoogle() {
  const fb = await connectFirebase();
  if (!fb) throw Error('Add Firebase web configuration in js/firebase.js first.');
  const provider = new fb.authModule.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return fb.authModule.signInWithPopup(fb.auth, provider);
}

let phoneVerifier;
export async function signInWithPhone(phoneNumber, containerId = 'phoneRecaptcha') {
  const fb = await connectFirebase();
  if (!fb) throw Error('Add Firebase web configuration in js/firebase.js first.');
  if (!phoneVerifier) phoneVerifier = new fb.authModule.RecaptchaVerifier(fb.auth, containerId, { size: 'invisible' });
  return fb.authModule.signInWithPhoneNumber(fb.auth, phoneNumber, phoneVerifier);
}

export async function confirmPhoneCode(confirmationResult, code) {
  if (!confirmationResult) throw Error('Send a phone verification code first.');
  return confirmationResult.confirm(code);
}

export async function signOutGoogle() {
  const fb = await connectFirebase();
  if (!fb) return;
  return fb.authModule.signOut(fb.auth);
}

export async function currentFirebaseUser() {
  const fb = await connectFirebase();
  return fb?.auth.currentUser || null;
}

export async function loadCloudState(uid) {
  const fb = await connectFirebase();
  const ref = fb.firestoreModule.doc(fb.db, 'users', uid, 'app', 'state');
  const snap = await fb.firestoreModule.getDoc(ref);
  return snap.exists() ? snap.data().backup : null;
}

export async function saveCloudState(uid, backup) {
  const fb = await connectFirebase();
  const ref = fb.firestoreModule.doc(fb.db, 'users', uid, 'app', 'state');
  await fb.firestoreModule.setDoc(ref, {
    backup,
    updatedAt: fb.firestoreModule.serverTimestamp(),
    version: backup.version || 1
  }, { merge: true });
}
