import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChange,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBr2-ABQKJVHH9TQTnynMvebEzifxUzDhQ",
  authDomain: "login-tubes-8b34c.firebaseapp.com",
  projectId: "login-tubes-8b34c",
  storageBucket: "login-tubes-8b34c.appspot.com",
  messagingSenderId: "518077304231",
  appId: "1:518077304231:web:4c47045ba6b3ce16c77a82",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

onAuthStateChange(auth, (user) => {
  const loggedInUserId = localStorage.getItem(loggedInUserId);
  if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("loggedUsername").innerText =
            userData.username;
        } else {
          console.log("no Doc found");
        }
      })
      .catch((error) => {
        console.log("error doc");
      });
  } else {
    console.log("user id not found");
  }
});
