// استدعاء مكتبات فايربيس الأساسية وقاعدة البيانات والمصادقة
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// بيانات الربط الخاصة بمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyA0uUvNR7mL6TjhKcKaSPaqKGDjQ1wASMQ",
  authDomain: "fekrah-web.firebaseapp.com",
  projectId: "fekrah-web",
  storageBucket: "fekrah-web.firebasestorage.app",
  messagingSenderId: "1054657186574",
  appId: "1:1054657186574:web:0f69028460eaa78efd255f",
  measurementId: "G-246WNL9QNB"
};

// تشغيل فايربيس
const app = initializeApp(firebaseConfig);

// تصدير قواعد البيانات والمصادقة لاستخدامها في باقي الملفات
export const db = getFirestore(app);
export const auth = getAuth(app);
