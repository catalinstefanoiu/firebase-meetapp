// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use
import { getAuth, EmailAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, addDoc, collection, query, orderBy, onSnapshot, doc, setDoc } from 'firebase/firestore';

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;

let db, auth;

async function main() {
  // Add Firebase project configuration object here
  const firebaseConfig = {
    apiKey: "AIzaSyA8HTZzRIfoMuNQmfNQc37jjUCcvGtPh30",
    authDomain: "meetapp-479fa.firebaseapp.com",
    projectId: "meetapp-479fa",
    storageBucket: "meetapp-479fa.firebasestorage.app",
    messagingSenderId: "282195088661",
    appId: "1:282195088661:web:98cb7c7518e435006a051c"
  };

  // Initialize Firebase
  initializeApp(firebaseConfig);
  auth = getAuth();
  db = getFirestore();


  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

  // Initialize the FirebaseUI widget using Firebase
  const ui = new firebaseui.auth.AuthUI(auth);

  // Listen to RSVP button click
  startRsvpButton.addEventListener("click", () => {
    if (auth.currentUser) {
      signOut(auth);
    } else {
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  });

  onAuthStateChanged(auth, user => {
    if (user) {
      startRsvpButton.textContent = 'LOGOUT';
      guestbookContainer.style.display = 'block';
      subscribeGuestbook();
    } else {
      startRsvpButton.textContent = 'RSVP';
      guestbookContainer.style.display = 'none';
      unsubscribeGuestbook();
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    // Write a new msg to the db collection "guestbook";
    addDoc(collection(db, 'guestbook'), {
      text: input.value,
      timestamp: Date.now(),
      name: auth.currentUser.displayName,
      userId: auth.currentUser.uid
    });
    // Clear msg input field
    input.value = '';
    return false;
  });

  function subscribeGuestbook() {
    // Create a query for msg
    const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
    onSnapshot(q, snaps => {
      // Reset page
      guestbook.innerHTML = '';
      // Loop through doc in db
      snaps.forEach(doc => {
        // Create an HTML entry for each document and add it to the chat
        const entry = document.createElement('p');
        entry.textContent = doc.data().name + ':' + doc.data().text;
        guestbook.appendChild(entry);
      });
    });
  }

  function unsubscribeGuestbook() {
    if (guestbookListener != null) {
      guestbookListener();
      guestbookListener = null;
    }
  }

  // Listen to RSVP responses
  rsvpYes.onclick = async () => {
    // Get a reference to the user's document in the attendees collection
      const userRef = doc(db, 'attendees', auth.currentUser.uid);

      // If they rsvp'd yes, save a documnet with attending: true
      try {
        await setDoc(userRef, {
          attending: true
        })
      } catch (e) {
        console.error(e);
      }
  };

  rsvpNo.onclick = async () => {
      const userRef = doc(db, 'attendees', auth.currentUser.uid);

      try {
        await setDoc(userRef, {
          attending: false
        })
      } catch (e) {
        console.error(e);
      }
  };
}
main();
