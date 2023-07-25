import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getToken,
  getMessaging,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging.js";
// import { setItem } from "https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js";
import localforage from "https://cdn.jsdelivr.net/npm/localforage@1.10.0/+esm";

const firebaseConfig = {
  measurementId: "G-4SE7SRR4RW",
  messagingSenderId: "421339161685",
  projectId: "my-test-project-f9bd9",
  apiKey: "AIzaSyAsWTsO7bBHoixxcuK3XxQSLnFPJeTuSzA",
  authDomain: "my-test-project-f9bd9.firebaseapp.com",
  storageBucket: "my-test-project-f9bd9.appspot.com",
  appId: "1:421339161685:web:82ed020e262cf4bef460dc",
};

const vapidKey =
  "BB7AfITRyvjdrjJX4IEDsc45ZxuksF9_SXQaa0zV5DOWv1sWVXkX_83Y263Vric_QwUcB73258oq9rs5voGC4yw";

function requestPermission() {
  console.log("Requesting permission");

  Notification.requestPermission().then((permission) => {
    if (permission == "granted") {
      console.log("Notification permission granted");

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      getToken(messaging, { vapidKey }).then((currentToken) => {
        if (currentToken) {
          console.log("Token:\n", currentToken);
          if (window.location == window.parent.location) {
            const app = new URL(window.location.href).searchParams.get("app");
            if (app) {
              const appUrl = new URL(app);
              localforage
                .setItem("app", appUrl.toString())
                .then(() => console.log("localforge init"));
              appUrl.searchParams.set("token", currentToken);
              window.location.assign(appUrl.toString());
            }
          }
        } else {
          console.log("Can not get token");
        }
      });
    } else {
      console.log("Permission not granted");
    }
  });
}
requestPermission();
