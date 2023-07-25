importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);
importScripts(
  "https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js"
);

const firebaseConfig = {
  measurementId: "G-4SE7SRR4RW",
  messagingSenderId: "421339161685",
  projectId: "my-test-project-f9bd9",
  apiKey: "AIzaSyAsWTsO7bBHoixxcuK3XxQSLnFPJeTuSzA",
  authDomain: "my-test-project-f9bd9.firebaseapp.com",
  storageBucket: "my-test-project-f9bd9.appspot.com",
  appId: "1:421339161685:web:82ed020e262cf4bef460dc",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
const appsmithDomain = "appsmith.com";

messaging.onBackgroundMessage(async function (payload) {
  const app = await localforage.getItem("app");
  console.log("app: " + app);
  console.log("Received background message ", payload);

  // const clients = await self.clients.matchAll({ includeUncontrolled: true });
  // const client = clients.find((c) => c.url.includes(appsmithDomain));
  //
  // if (!client) {
  //   return self.registration
  //     .showNotification("auto-close")
  //     .then(() => self.registration.getNotifications())
  //     .then((notifications) => {
  //       setTimeout(
  //         () => notifications.forEach((notification) => notification.close()),
  //         500
  //       );
  //     });
  // }
  //
  // const clientUrl = new URL(client.url);

  const notificationTitle = payload.notification.title;
  // const notificationTitle = clientUrl.searchParams.get("app");
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
    data: { url: app },
    // data: { url: clientUrl.searchParams.get("app") },
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === e.notification.data.url
          ? (windowClient.focus(), true)
          : false
      );
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        if (e.notification.data.url.includes(appsmithDomain))
          clients
            .openWindow(e.notification.data.url)
            .then((windowClient) =>
              windowClient ? windowClient.focus() : null
            );
    })
  );
});
