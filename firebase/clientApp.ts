// import { initializeApp, getApps } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
//
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };
//
// // Initialize Firebase
// const app =
//   getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// const messaging = typeof window !== "undefined" ? getMessaging(app) : null;
//
// export const requestForToken = async () => {
//   try {
//     if (!messaging) throw new Error("Messaging is not available");
//     const currentToken = await getToken(messaging, {
//       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//     });
//     if (currentToken) {
//       console.log("current token for client: ", currentToken);
//       // Perform any other necessary action with the token
//     } else {
//       // Show permission request UI
//       console.log(
//         "No registration token available. Request permission to generate one.",
//       );
//     }
//   } catch (err) {
//     console.log("An error occurred while retrieving token. ", err);
//   }
// };
//
// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     if (!messaging) return;
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
