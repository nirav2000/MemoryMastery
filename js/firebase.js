// Replace this public web configuration with values from Firebase Console.
export const firebaseConfig={apiKey:'AIzaSyDBXGMlf7DWPAneD96kCwS9GzLMo2xb8dQ',authDomain:'memorymastery.firebaseapp.com',projectId:'memorymastery',appId:'1:439635305999:web:374ab9a9818b04c3dfe57a'};
export const configured=()=>!firebaseConfig.apiKey.startsWith('YOUR_');
export async function connectFirebase(){if(!configured())return null;const [{initializeApp},{getAuth},{getFirestore}]=await Promise.all([import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js'),import('https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js')]);const app=initializeApp(firebaseConfig);return{app,auth:getAuth(app),db:getFirestore(app)}}
