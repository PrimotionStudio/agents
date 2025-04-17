// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyARi5ThjFHXYpd3KB9c99gl3EhUfA9mSTo",
	authDomain: "agents-efd24.firebaseapp.com",
	projectId: "agents-efd24",
	storageBucket: "agents-efd24.firebasestorage.app",
	messagingSenderId: "737035995789",
	appId: "1:737035995789:web:07c2327c89c56835b2b0c4",
	measurementId: "G-E0XKWCVJ1Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

if (!firebase.app.length) {
	firebase.initializeApp(firebaseConfig);
}

export { firebase, analytics };
