self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// self.addEventListener("push", (event) => {
//   const data = event.data.json();
//   const options = {
//     body: data.body,
//     icon: "/icon-192x192.png",
//     badge: "/badge.png",
//     vibrate: [100, 50, 100],
//     data: {
//       dateOfArrival: Date.now(),
//       primaryKey: "2",
//     },
//   };
//   event.waitUntil(self.registration.showNotification(data.title, options));
// });
//
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();
//   event.waitUntil(clients.openWindow("https://192.168.254.193:3000"));
// });
