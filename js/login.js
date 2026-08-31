// js/login.js
import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// إعادة توجيه ذكية بعد تسجيل الدخول
function redirectAfterLogin() {
  // إذا كان هناك رابط مرجعي في query param نعيده، وإلا نذهب للرئيسية
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect') || 'index.html';
  window.location.href = redirect;
}

// مراقبة حالة المصادقة لتفادي إعادة تسجيل الدخول إذا المستخدم مسجل بالفعل
onAuthStateChanged(auth, (user) => {
  if (user) {
    redirectAfterLogin();
  }
});

// تسجيل الدخول
document.getElementById('btn-login').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) return alert('من فضلك أدخل البريد وكلمة المرور');
  try {
    await signInWithEmailAndPassword(auth, email, password);
    redirectAfterLogin();
  } catch (err) {
    console.error("Login error:", err);
    alert('خطأ في تسجيل الدخول: ' + err.message);
  }
});

// إنشاء حساب جديد
document.getElementById('btn-register').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) return alert('من فضلك أدخل البريد وكلمة المرور');
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    redirectAfterLogin();
  } catch (err) {
    console.error("Register error:", err);
    alert('خطأ في إنشاء الحساب: ' + err.message);
  }
});

// تسجيل الدخول بجوجل
document.getElementById('btn-google').addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    redirectAfterLogin();
  } catch (err) {
    console.error("Google sign-in error:", err);
    alert('خطأ في تسجيل الدخول بجوجل: ' + err.message);
  }
});
