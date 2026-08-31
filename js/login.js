import { auth } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// تسجيل الدخول بالبريد وكلمة المرور
document.getElementById("btn-login").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("تم تسجيل الدخول بنجاح!");
    window.location.href = "index.html"; // تحويل للموقع بعد الدخول
  } catch (error) {
    alert("خطأ في تسجيل الدخول: " + error.message);
  }
});

// إنشاء حساب جديد
document.getElementById("btn-register").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("تم إنشاء الحساب بنجاح!");
    window.location.href = "index.html";
  } catch (error) {
    alert("خطأ في إنشاء الحساب: " + error.message);
  }
});

// تسجيل الدخول بجوجل
document.getElementById("btn-google").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert("تم تسجيل الدخول بجوجل!");
    window.location.href = "index.html";
  } catch (error) {
    alert("خطأ في تسجيل الدخول بجوجل: " + error.message);
  }
});
