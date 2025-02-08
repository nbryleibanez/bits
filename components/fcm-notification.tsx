// "use client";
//
// import { useState, useEffect } from "react";
// import { requestForToken, onMessageListener } from "@/firebase/clientApp";
// import { useToast } from "@/components/ui/use-toast";
// import "react-toastify/dist/ReactToastify.css";
//
// const FCMNotification = () => {
//   const [notification, setNotification] = useState({ title: "", body: "" });
//   const [isTokenFound, setTokenFound] = useState(false);
//   const { toast } = useToast();
//
//   useEffect(() => {
//     requestForToken()
//       .then((currentToken) => {
//         if (currentToken) {
//           console.log("Token found");
//           setTokenFound(true);
//         } else {
//           console.log("No token found");
//           setTokenFound(false);
//         }
//       })
//       .catch((err) => {
//         console.log("An error occurred while retrieving token. ", err);
//         setTokenFound(false);
//       });
//   }, []);
//
//   useEffect(() => {
//     const unsubscribe = onMessageListener()
//       .then((payload: any) => {
//         setNotification({
//           title: payload?.notification?.title,
//           body: payload?.notification?.body,
//         });
//
//         toast({
//           title: payload?.notification?.title,
//           description: payload?.notification?.body,
//         });
//       })
//       .catch((err) => console.log("failed: ", err));
//
//     return () => {
//       unsubscribe.catch((err) => console.log("failed: ", err));
//     };
//   }, []);
//
//   return (
//     <div>
//       <h1>Firebase Cloud Messaging in Next.js</h1>
//       {isTokenFound && <h1>Notification permission enabled 👍🏻</h1>}
//       {!isTokenFound && <h1>Need notification permission ❗️</h1>}
//       <h1>Notification</h1>
//       <p>Title: {notification.title}</p>
//       <p>Body: {notification.body}</p>
//     </div>
//   );
// };
//
// export default FCMNotification;
