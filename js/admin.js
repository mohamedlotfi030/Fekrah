import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const saveProductBtn = document.getElementById('save-product-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const loginError = document.getElementById('login-error');
const addMsg = document.getElementById('add-msg');
const productsListContainer = document.getElementById('admin-products-list');

// متابعة حالة التسجيل
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        loadAdminProducts();
    } else {
        loginSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    }
});

// تسجيل الدخول
loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    
    if (!email || !password) {
        loginError.innerText = "يرجى كتابة البريد وكلمة المرور!";
        return;
    }

    try {
        loginBtn.innerText = "جاري الدخول...";
        await signInWithEmailAndPassword(auth, email, password);
        loginError.innerText = "";
    } catch (error) {
        loginError.innerText = "بيانات الدخول غير صحيحة!";
    } finally {
        loginBtn.innerText = "دخول";
    }
});

logoutBtn.addEventListener('click', () => signOut(auth));

// جلب وعرض منتجات الأدمن مع أزرار التعديل والحذف
async function loadAdminProducts() {
    productsListContainer.innerHTML = "جاري التحميل...";
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        productsListContainer.innerHTML = "";

        if (querySnapshot.empty) {
            productsListContainer.innerHTML = "<p>لا توجد منتجات مضافة بعد.</p>";
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;

            const item = document.createElement('div');
            item.className = 'product-admin-item';
            item.innerHTML = `
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${data.image || 'assets/images/Baner.png'}" alt="">
                    <div>
                        <strong>${data.name}</strong>
                        <div style="font-size:0.85em; color:#aaa;">${data.price} ج.م | ${data.category || 'عام'}</div>
                    </div>
                </div>
                <div class="actions">
                    <a href="product-details.html?id=${id}" target="_blank" class="btn" style="padding:5px 10px; width:auto; text-decoration:none;">معاينة</a>
                    <button class="btn btn-warning edit-btn" style="padding:5px 10px; width:auto;" data-id="${id}">تعديل</button>
                    <button class="btn btn-danger delete-btn" style="padding:5px 10px; width:auto;" data-id="${id}">حذف</button>
                </div>
            `;
            productsListContainer.appendChild(item);
        });

        // ربط أزرار الحذف
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm("هل أنت تأكد من حذف هذا المنتج؟")) {
                    await deleteDoc(doc(db, "products", id));
                    loadAdminProducts();
                }
            });
        });

        // ربط أزرار التعديل
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const p = querySnapshot.docs.find(d => d.id === id).data();
                
                document.getElementById('edit-doc-id').value = id;
                document.getElementById('prod-name').value = p.name || '';
                document.getElementById('prod-price').value = p.price || '';
                document.getElementById('prod-category').value = p.category || '';
                document.getElementById('prod-image').value = p.image || '';
                document.getElementById('prod-desc').value = p.description || '';
                document.getElementById('prod-options').value = Array.isArray(p.options) ? p.options.join(', ') : (p.options || '');

                document.getElementById('form-title').innerText = "تعديل المنتج";
                saveProductBtn.innerText = "حفظ التعديلات";
                cancelEditBtn.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

    } catch (error) {
        console.error(error);
        productsListContainer.innerHTML = "<p style='color:red;'>حدث خطأ أثناء تحميل المنتجات.</p>";
    }
}

// إلغاء التعديل
cancelEditBtn.addEventListener('click', resetForm);

function resetForm() {
    document.getElementById('edit-doc-id').value = '';
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-category').value = '';
    document.getElementById('prod-image').value = '';
    document.getElementById('prod-desc').value = '';
    document.getElementById('prod-options').value = '';
    
    document.getElementById('form-title').innerText = "إضافة منتج جديد";
    saveProductBtn.innerText = "حفظ ورفع المنتج";
    cancelEditBtn.classList.add('hidden');
    addMsg.innerText = '';
}

// إضافة أو تحديث المنتج
saveProductBtn.addEventListener('click', async () => {
    const editId = document.getElementById('edit-doc-id').value;
    const name = document.getElementById('prod-name').value.trim();
    const price = document.getElementById('prod-price').value.trim();
    const category = document.getElementById('prod-category').value.trim();
    let imageInput = document.getElementById('prod-image').value.trim();
    const description = document.getElementById('prod-desc').value.trim();
    const optionsRaw = document.getElementById('prod-options').value.trim();

    if (!name || !price || !imageInput) {
        addMsg.innerText = "يرجى ملء الحقول الأساسية!";
        addMsg.style.color = "red";
        return;
    }

    if (!imageInput.startsWith('http') && !imageInput.startsWith('/') && !imageInput.startsWith('assets/')) {
        imageInput = `assets/images/${imageInput}`;
    }

    // تحويل خيارات القائمة المنسدلة لمصفوفة
    const optionsArr = optionsRaw ? optionsRaw.split(',').map(o => o.trim()).filter(o => o) : [];

    const productData = {
        name: name,
        price: Number(price),
        category: category || "خدمات إعلانية",
        image: imageInput,
        description: description,
        options: optionsArr,
        updatedAt: new Date()
    };

    try {
        saveProductBtn.disabled = true;

        if (editId) {
            // تحديث
            await updateDoc(doc(db, "products", editId), productData);
            addMsg.innerText = "تم تعديل المنتج بنجاح!";
        } else {
            // إضافة جديد
            productData.createdAt = new Date();
            await addDoc(collection(db, "products"), productData);
            addMsg.innerText = "تمت إضافة المنتج بنجاح!";
        }

        addMsg.style.color = "#4CAF50";
        resetForm();
        loadAdminProducts();

    } catch (error) {
        console.error(error);
        addMsg.innerText = "حدث خطأ أثناء الحفظ!";
        addMsg.style.color = "red";
    } finally {
        saveProductBtn.disabled = false;
    }
});
