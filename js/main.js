import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    try {
        // جلب المنتجات مرتبة بحسب تاريخ الإنشاء (الأحدث أولاً)
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        renderProducts(querySnapshot, container);

    } catch (error) {
        console.warn("تعذر الجلب مع الترتيب (قد يحتاج Firestore Index)، جاري الجلب بدون ترتيب...", error);
        
        // آلية احتياطية: الجلب بدون ترتيب تجنباً لتوقف الصفحة إذا لم ينشأ الفهرس بعد
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            renderProducts(querySnapshot, container);
        } catch (fallbackError) {
            console.error("خطأ في جلب المنتجات: ", fallbackError);
            container.innerHTML = '<p style="text-align:center; color:red; grid-column: 1/-1;">حدث خطأ أثناء تحميل المنتجات.</p>';
        }
    }
}

// دالة بناء وعرض كروت المنتجات
function renderProducts(querySnapshot, container) {
    container.innerHTML = '';

    if (querySnapshot.empty) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:#fff;">لا توجد منتجات معروضة حالياً.</p>';
        return;
    }

    querySnapshot.forEach((docSnap) => {
        const product = docSnap.data();
        const productId = docSnap.id; // معرّف المنتج في Firestore
        
        const categoryText = product.category || 'خدمات إعلانية';
        const productName = product.name || 'بدون عنوان';
        const productPrice = product.price || 0;
        const productImage = product.image || 'assets/images/Baner.png';
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${productImage}" alt="${productName}">
            </div>
            <div class="product-info">
                <span class="product-category">${categoryText}</span>
                <h3 class="product-title">${productName}</h3>
                <p class="product-price">${productPrice} ج.م</p>
                
                <!-- التعديل الجوهري: التوجيه لصفحة تفاصيل المنتج وتمرير الـ ID -->
                <a href="product-details.html?id=${productId}" class="btn-order">
                    اطلب الآن
                </a>
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

document.addEventListener('DOMContentLoaded', loadProducts);
