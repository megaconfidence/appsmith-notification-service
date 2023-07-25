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
  appId: "1:421339161685:web:82ed020e262cf4bef460dc",
  storageBucket: "my-test-project-f9bd9.appspot.com",
  authDomain: "my-test-project-f9bd9.firebaseapp.com",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(async function (payload) {
  const app = await localforage.getItem("app");

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
    data: { url: app },
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients
      .matchAll({ includeUncontrolled: true, type: "window" })
      .then((clientsArr) => {
        // if open tab exists, focus on tab
        const hadWindowToFocus = clientsArr.some((windowClient) =>
          windowClient.url.includes(e.notification.data.url)
            ? (windowClient.focus(), true)
            : false
        );
        // else, open a new tab
        if (!hadWindowToFocus)
          clients
            .openWindow(e.notification.data.url)
            .then((windowClient) =>
              windowClient ? windowClient.focus() : null
            );
      })
  );
});
