import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

async function loadProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        container.innerHTML = '';

        if (querySnapshot.empty) {
            container.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:#fff;">لا توجد منتجات معروضة حالياً.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            const categoryText = product.category || 'خدمات إعلانية';
            const productName = product.name || 'بدون عنوان';
            const productPrice = product.price || 0;
            const productImage = product.image || 'assets/images/Baner.png';
            
            const encodedName = encodeURIComponent(productName);
            const whatsappUrl = `https://wa.me/201000000000?text=${encodeURIComponent('أريد الاستفسار عن منتج: ')}${encodedName}`;

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${productImage}" alt="${productName}">
                </div>
                <div class="product-info">
                    <span class="product-category">${categoryText}</span>
                    <h3 class="product-title">${productName}</h3>
                    <p class="product-price">${productPrice} ج.م</p>
                    <a href="${whatsappUrl}" target="_blank" class="btn-order">
                        طلب الخدمة
                    </a>
                </div>
            `;
            
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error("خطأ في جلب المنتجات: ", error);
        container.innerHTML = '<p style="text-align:center; color:red; grid-column: 1/-1;">حدث خطأ أثناء تحميل المنتجات. تأكد من إنشاء الفهرس (Index) في لوحة تحكم Firestore إذا طُلب ذلك.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);
