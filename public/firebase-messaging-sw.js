// importScripts(
//   "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
// );
//
// // Fix: Declare the firebase variable
// const firebase = null;
//
// firebase.initializeApp({
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKEY,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// });
//
// const messaging = firebase.messaging();
//
// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload,
//   );
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "/firebase-logo.png",
//   };
//
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
