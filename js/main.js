import { db } from './firebase-config.js'; // إذا كان الملف داخل مجلد js/ غير المسار إلى './js/firebase-config.js'
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    try {
        // محاولة جلب المنتجات مرتبة بحسب تاريخ الإنشاء (الأحدث أولاً)
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        renderProducts(querySnapshot, container);

    } catch (error) {
        console.warn("تنبيه: تعذر الجلب مع الترتيب (قد يتطلب إنشاء Index في Firestore)، جاري الجلب المباشر...", error);
        
        // آلية احتياطية: الجلب المباشر بدون ترتيب تجنباً لتوقف الموقع
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            renderProducts(querySnapshot, container);
        } catch (fallbackError) {
            console.error("خطأ في جلب المنتجات: ", fallbackError);
            container.innerHTML = '<p style="text-align:center; color:#ff4444; grid-column: 1/-1;">حدث خطأ أثناء تحميل المنتجات. تحقق من الاتصال بقاعدة البيانات.</p>';
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
        const productId = docSnap.id; // استخراج ID المستند المباشر من Firestore
        
        // التأكد من وجود البيانات وتحديد قيم افتراضية عند الغياب
        const categoryText = product.category || 'خدمات إعلانية';
        const productName = product.name || 'منتج بدون عنوان';
        const productPrice = product.price || 0;
        const productImage = product.image || 'assets/images/Baner.png';
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${productImage}" alt="${productName}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-category">${categoryText}</span>
                <h3 class="product-title">${productName}</h3>
                <p class="product-price">${productPrice} ج.م</p>
                
                <a href="product-details.html?id=${encodeURIComponent(productId)}" class="btn-order">
                    اطلب الآن
                </a>
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

// تشغيل السكربت بعد اكتمال تحميل عناصر الصفحة
document.addEventListener('DOMContentLoaded', loadProducts);
