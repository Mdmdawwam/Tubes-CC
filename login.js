// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
function showMassage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 0;
  }, 5000);
}

const signUp = document.getElementById("subreg");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const PNumber = document.getElementById("PNumber").value;
  const password = document.getElementById("pass").value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        username: username,
        PNumber: PNumber,
      };
      showMassage("Account Created Successfully", "signUpMessage");
      const docRef = doc(db, "user", user.uid);
      setDoc(docRef, userData).then(() => {
        console.error("Error writing doc", error);
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        showMassage("Email Address already Exists!!!", "signUpMessage");
      } else {
        showMassage("Unable to create user", "signUpMessage");
      }
    });
});

const signIn = document.getElementById("sublog");
signIn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;
  const auth = getAuth();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMassage("Login Successful", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMassage("Incorrect Email or Password", "signInMessage");
      } else {
        showMassage("Account does not Exist");
      }
    });
});
