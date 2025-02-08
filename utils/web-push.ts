// export async function subscribeToPush() {
//   if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
//     console.log("Push notifications are not supported");
//     return;
//   }
//
//   try {
//     const registration = await navigator.serviceWorker.register("/sw.js");
//     console.log("Service Worker registered");
//
//     const subscription = await registration.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey: urlBase64ToUint8Array(
//         process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
//       ),
//     });
//
//     console.log("Push notification subscription successful", subscription);
//
//     // Here you would typically send the subscription to your server
//     await saveSubscription(subscription);
//   } catch (error) {
//     console.error("Error during push notification subscription", error);
//   }
// }
//
// function urlBase64ToUint8Array(base64String: string) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
//
//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }
//
// async function saveSubscription(subscription: PushSubscription) {
//   const response = await fetch("/api/save-subscription", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(subscription),
//   });
//
//   if (!response.ok) {
//     throw new Error("Failed to save subscription");
//   }
// }
