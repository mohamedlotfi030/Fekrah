import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// تعريف العناصر
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const addProductBtn = document.getElementById('add-product-btn');

// 1. مراقبة حالة الدخول (هل المدير مسجل دخوله أم لا؟)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // إذا كان مسجلاً، أخفِ تسجيل الدخول وأظهر اللوحة
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
    } else {
        // إذا لم يكن مسجلاً، أظهر تسجيل الدخول
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    }
});

// 2. تسجيل الدخول
loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const errorMsg = document.getElementById('login-error');
    
    try {
        loginBtn.innerText = "جاري الدخول...";
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        errorMsg.innerText = "خطأ في البريد أو كلمة المرور!";
        loginBtn.innerText = "دخول";
    }
});

// 3. تسجيل الخروج
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// 4. إضافة منتج إلى قاعدة البيانات
addProductBtn.addEventListener('click', async () => {
    const name = document.getElementById('prod-name').value;
    const price = document.getElementById('prod-price').value;
    const image = document.getElementById('prod-image').value;
    const category = document.getElementById('prod-category').value;
    const msg = document.getElementById('add-msg');

    if (!name || !price || !image) {
        msg.innerText = "يرجى ملء جميع الحقول الأساسية!";
        msg.style.color = "red";
        return;
    }

    try {
        addProductBtn.innerText = "جاري الرفع...";
        // إضافة البيانات إلى مجموعة (collection) باسم "products"
        await addDoc(collection(db, "products"), {
            name: name,
            price: Number(price),
            image: image,
            category: category,
            createdAt: new Date()
        });
        
        msg.innerText = "تمت إضافة المنتج بنجاح!";
        msg.style.color = "#4CAF50";
        addProductBtn.innerText = "حفظ ورفع المنتج";
        
        // تفريغ الحقول بعد الإضافة
        document.getElementById('prod-name').value = '';
        document.getElementById('prod-price').value = '';
        document.getElementById('prod-image').value = '';
    } catch (error) {
        console.error("Error adding document: ", error);
        msg.innerText = "حدث خطأ أثناء الإضافة!";
        msg.style.color = "red";
        addProductBtn.innerText = "حفظ ورفع المنتج";
    }
});
