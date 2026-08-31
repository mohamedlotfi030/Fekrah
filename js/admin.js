import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

console.log("Admin JS loaded successfully.");

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const addProductBtn = document.getElementById('add-product-btn');
const loginError = document.getElementById('login-error');
const addMsg = document.getElementById('add-msg');

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user.email);
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
    } else {
        console.log("User is logged out.");
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    }
});

loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    
    if (!email || !password) {
        loginError.innerText = "يرجى كتابة البريد وكلمة المرور!";
        return;
    }

    try {
        loginBtn.innerText = "جاري الدخول...";
        loginBtn.disabled = true;
        await signInWithEmailAndPassword(auth, email, password);
        loginError.innerText = "";
    } catch (error) {
        console.error("Login Error:", error);
        loginError.innerText = "بيانات الدخول غير صحيحة: " + error.message;
    } finally {
        loginBtn.innerText = "دخول";
        loginBtn.disabled = false;
    }
});

logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

addProductBtn.addEventListener('click', async () => {
    console.log("Add product button clicked.");
    const name = document.getElementById('prod-name').value.trim();
    const price = document.getElementById('prod-price').value.trim();
    const category = document.getElementById('prod-category').value.trim();
    let imageInput = document.getElementById('prod-image').value.trim();

    if (!name || !price || !imageInput) {
        addMsg.innerText = "يرجى ملء الحقول الأساسية (الاسم، السعر، الصورة)!";
        addMsg.style.color = "red";
        return;
    }

    if (!imageInput.startsWith('http') && !imageInput.startsWith('/') && !imageInput.startsWith('assets/')) {
        imageInput = `assets/images/${imageInput}`;
    }

    try {
        addProductBtn.innerText = "جاري الحفظ...";
        addProductBtn.disabled = true;

        console.log("Attempting to write to Firestore...");
        const docRef = await addDoc(collection(db, "products"), {
            name: name,
            price: Number(price),
            category: category || "خدمات إعلانية",
            image: imageInput,
            createdAt: new Date()
        });

        console.log("Document written with ID: ", docRef.id);
        addMsg.innerText = "تمت إضافة المنتج بنجاح برقم: " + docRef.id;
        addMsg.style.color = "#4CAF50";

        document.getElementById('prod-name').value = '';
        document.getElementById('prod-price').value = '';
        document.getElementById('prod-category').value = '';
        document.getElementById('prod-image').value = '';

    } catch (error) {
        console.error("Firestore Add Error Details:", error);
        addMsg.innerText = "خطأ الحفظ: " + error.message;
        addMsg.style.color = "red";
    } finally {
        addProductBtn.innerText = "حفظ ورفع المنتج";
        addProductBtn.disabled = false;
    }
});
