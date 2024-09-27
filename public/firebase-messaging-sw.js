// public/firebase-messaging-sw.js

// // Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker script

const firebaseConfig = {
    apiKey: "AIzaSyDBLrsp6EWHTNu0fynODZpKiPq2iL8M2wU",
    authDomain: "hello-vegan.firebaseapp.com",
    projectId: "hello-vegan",
    storageBucket: "hello-vegan.appspot.com",
    messagingSenderId: "86454988086",
    appId: "1:86454988086:web:d4894c94467cb5907f1797",
    measurementId: "G-KVGV7EHCNN",
    vapidKey:"BBxc23p9Ond5HWi5Jl829qdWfYyT6ygAun0cZLhClIrbzH63j"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

messaging.onMessage((payload) => {
    // console.log('[firebase-messaging-sw.js] Received foreground message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'favicon.ico'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
messaging.onBackgroundMessage((payload) => {
    // console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'favicon.ico'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
