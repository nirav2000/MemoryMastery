// Replace this public web configuration with values from Firebase Console.
export const firebaseConfig={apiKey:'YOUR_API_KEY',authDomain:'YOUR_PROJECT.firebaseapp.com',projectId:'YOUR_PROJECT',appId:'YOUR_APP_ID'};
export const configured=()=>!firebaseConfig.apiKey.startsWith('YOUR_');
export async function connectFirebase(){if(!configured())return null;const [{initializeApp},{getAuth},{getFirestore}]=await Promise.all([import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js'),import('https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js')]);const app=initializeApp(firebaseConfig);return{app,auth:getAuth(app),db:getFirestore(app)}}
