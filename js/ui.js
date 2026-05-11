const UI = {
    renderCart() {
        const container = document.getElementById("cartItemsList");
        if (!container) return;
        
        if (Cart.items.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:20px; color:#ccc;">السلة فارغة</div>`;
            return;
        }

        container.innerHTML = Cart.items.map((item, i) => `
            <div class="cart-item-drawer" style="display:flex; gap:10px; padding:10px; border-bottom:1px solid #333; align-items:center; color:white;">
                <img src="${item.image}" width="40" style="background:white; border-radius:5px;">
                <div style="flex:1">
                    <h4 style="margin:0; font-size:0.85rem;">${item.name}</h4>
                    <small style="color:#aaa;">${item.size} | ${item.option}</small>
                </div>
                <button onclick="Cart.remove(${i})" style="background:none; border:none; color:#ff4444; cursor:pointer; font-size:1.2rem;">✕</button>
            </div>
        `).join('');
    },

    updateCartBadge() {
        const badge = document.getElementById("cartBadge");
        if (badge) {
            badge.innerText = Cart.items.length;
            badge.style.display = Cart.items.length > 0 ? "flex" : "none";
        }
    },

    toggleCart(show) {
        const drawer = document.getElementById("cartDrawer");
        if (drawer) {
            if (show) drawer.classList.add('active');
            else drawer.classList.remove('active');
        }
    },

    // --- الوظيفة الجديدة لتبديل صور المنتج ---
    startProductSlideshow(productId) {
        const imgElement = document.getElementById('mainPImg'); // معرف الصورة الكبيرة في صفحة المنتج
        const product = Products[productId];
        
        // التحقق من وجود الصورة والمنتج وأن المنتج له أكثر من صورة
        if (imgElement && product && product.images.length > 1) {
            let currentIndex = 0;
            
            // إضافة تأثير انتقالي سلس عبر CSS
            imgElement.style.transition = "opacity 0.4s ease-in-out";

            setInterval(() => {
                currentIndex = (currentIndex + 1) % product.images.length;
                
                // تأثير التلاشي (تخفيف الإضاءة)
                imgElement.style.opacity = '0.3';
                
                setTimeout(() => {
                    // تغيير مصدر الصورة
                    imgElement.src = product.images[currentIndex];
                    // إعادة الإضاءة
                    imgElement.style.opacity = '1';
                }, 400); // يجب أن يكون متوافقاً مع وقت الـ transition في الـ CSS
                
            }, 3000); // التبديل كل 3 ثوانٍ
        }
    },

    updateCart() {
        this.renderCart();
        this.updateCartBadge();
    }
};
