import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAiwp5fY4buYqqBKQz__jDaUoo4IMA-Uaw",
  authDomain: "messaging-72c09.firebaseapp.com",
  projectId: "messaging-72c09",
  storageBucket: "messaging-72c09.appspot.com",
  messagingSenderId: "700296103552",
  appId: "1:700296103552:web:1d31f360af0fd697310865"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
//const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
//export default db;
