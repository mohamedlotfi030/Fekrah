import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// دالة جلب وعرض المنتجات
async function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    try {
        // جلب المنتجات من Firestore مرتبة من الأحدث للأقدم
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        // تفريغ المحتوى الثابت القديم
        container.innerHTML = '';

        if (querySnapshot.empty) {
            container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">لا توجد منتجات معروضة حالياً.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            
            // إنشاء عنصر كارت المنتج
            const productCard = document.createElement('div');
            productCard.className = 'product-card'; // كلاس التصميم الخاص بك
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category || 'خدمات إعلانية'}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${product.price} ج.م</p>
                    <a href="https://wa.me/201000000000?text=أريد%20الاستفسار%20عن%20منتج:%20${encodeURIComponent(product.name)}" target="_blank" class="btn-order">
                        طلب الخدمة
                    </a>
                </div>
            `;
            
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error("خطأ في جلب المنتجات: ", error);
        container.innerHTML = '<p style="text-align:center; color:red; grid-column: 1/-1;">حدث خطأ أثناء تحميل المنتجات.</p>';
    }
}

// تشغيل الدالة فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadProducts);
