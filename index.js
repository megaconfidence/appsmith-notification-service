import {
  getToken,
  getMessaging,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging.js";
import localforage from "https://cdn.jsdelivr.net/npm/localforage@1.10.0/+esm";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

const firebaseConfig = {
  measurementId: "G-4SE7SRR4RW",
  messagingSenderId: "421339161685",
  projectId: "my-test-project-f9bd9",
  apiKey: "AIzaSyAsWTsO7bBHoixxcuK3XxQSLnFPJeTuSzA",
  storageBucket: "my-test-project-f9bd9.appspot.com",
  appId: "1:421339161685:web:82ed020e262cf4bef460dc",
  authDomain: "my-test-project-f9bd9.firebaseapp.com",
};
const isIframe = location != parent.location ? true : false;
const vapidKey =
  "BB7AfITRyvjdrjJX4IEDsc45ZxuksF9_SXQaa0zV5DOWv1sWVXkX_83Y263Vric_QwUcB73258oq9rs5voGC4yw";

function initService() {
  Notification.requestPermission().then((permission) => {
    if (permission != "granted") return console.log("permission denied");

    const fbaseApp = initializeApp(firebaseConfig);
    const messaging = getMessaging(fbaseApp);
    getToken(messaging, { vapidKey }).then((token) => {
      if (!token) return console.log("can not get token");

      console.log("token:", token);
      if (isIframe) return console.log("in iframe, stop redirect");

      const app = new URL(window.location.href).searchParams.get("app");

      if (!app) return console.log("invalid appsmith url");
      localforage.setItem("app", app).then((itm) => console.log(itm));

      const appUrl = new URL(app);
      appUrl.searchParams.set("token", token);
      window.location.assign(appUrl.toString());
    });
  });
}

(() => {
  const ui = document.querySelector(".ui");
  const button = document.querySelector(".button");
  const isFF = navigator.userAgent.includes("Firefox");

  if (!isIframe) ui.classList.remove("hidden");

  if (isFF && Notification.permission === "default") {
    button.classList.remove("hidden");

    button.addEventListener("click", () => {
      button.classList.add("hidden");
      initService();
    });
  } else {
    initService();
  }
})();
