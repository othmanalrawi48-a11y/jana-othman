// Firebase v11 modular SDK — loaded via CDN, exposes helpers on window for app.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            "AIzaSyAzGmFeHWLhZqqFmmQB8YpOpytfULG1kt4",
  authDomain:        "jana-othman.firebaseapp.com",
  projectId:         "jana-othman",
  storageBucket:     "jana-othman.firebasestorage.app",
  messagingSenderId: "873718969862",
  appId:             "1:873718969862:web:8993c5a454fc5cc86cb587",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Expose write helpers on window so non-module app.js can call them ──────
window.fb = {
  /** Add a document to a named collection */
  addDoc: (colName, data) =>
    addDoc(collection(db, colName), data),

  /** Update fields on an existing document */
  updateDoc: (colName, id, data) =>
    updateDoc(doc(db, colName, id), data),

  /** Firestore server timestamp sentinel */
  serverTimestamp,
};

// ── Real-time listeners — keep global caches fresh and re-render ──────────
function listenCollection(colName, cacheKey, renderFnName) {
  const q = query(collection(db, colName), orderBy('createdAt', 'asc'));

  onSnapshot(
    q,
    (snap) => {
      window[cacheKey] = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
      // Call the render function if it exists and the relevant DOM element is mounted
      if (typeof window[renderFnName] === 'function') {
        window[renderFnName]();
      }
    },
    (err) => {
      console.warn(`[Firebase] ${colName}:`, err.message);
    },
  );
}

listenCollection('gratitude', '_fbGratitude', 'renderGratitude');
listenCollection('duas',      '_fbDuas',      'renderDuas');
listenCollection('memories',  '_fbMemories',  'renderMemoryJar');
