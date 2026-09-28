const UI = {
    toggleCart(show) {
        const drawer = document.getElementById("cartDrawer");
        const overlay = document.getElementById("cartOverlay");
        if (show) {
            drawer.classList.add("active");
            overlay.classList.add("active");
            this.renderCart();
        } else {
            drawer.classList.remove("active");
            overlay.classList.remove("active");
        }
    },

    // فتح السلة مؤقتًا عند إضافة منتج
    showCartTemporary() {
        this.toggleCart(true);
        setTimeout(() => {
            this.toggleCart(false);
        }, 3000); // تغلق بعد 3 ثواني
    },

    renderCart() {
        const container = document.getElementById("cartItemsList");
        if (!container) return;
        if (Cart.items.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#888; padding:40px 0;">السلة فارغة</p>';
            return;
        }
        container.innerHTML = Cart.items.map((item, i) => `
            <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid #222; padding:12px 0;">
                <img src="${item.image}" width="50" style="background:#fff; border-radius:5px;">
                <div style="flex:1; color:#fff;">
                    <div style="font-size:0.9rem;">${item.name}</div>
                    <small style="color:#00bcd4;">${item.size} - ${item.option}</small>
                </div>
                <button onclick="Cart.remove(${i})" style="background:none; border:none; color:#ff4444; cursor:pointer; font-size:1.1rem;">✕</button>
            </div>`).join('');
    },

    updateCartBadge() {
        const badge = document.getElementById("cartBadge");
        if (badge) {
            badge.innerText = Cart.items.length;
            badge.style.display = Cart.items.length > 0 ? "flex" : "none";
        }
    },

    startProductSlideshow(productId) {
        const img = document.getElementById('mainPImg');
        const p = Products[productId];
        if (img && p && p.images.length > 1) {
            let idx = 0;
            setInterval(() => {
                idx = (idx + 1) % p.images.length;
                img.style.opacity = '0.3';
                setTimeout(() => {
                    img.src = p.images[idx];
                    img.style.opacity = '1';
                }, 400);
            }, 3000);
        }
    },

    updateCart() { this.renderCart(); this.updateCartBadge(); },

    // ✅ بوب أب عند اختيار الطلب عبر البريد
    showPhonePopup() {
        const popup = document.getElementById("phonePopup");
        if (popup) popup.style.display = "flex";
    },

    confirmPhone() {
        const phone = document.getElementById("extraPhone").value;
        if (!phone || phone.length < 10) {
            alert("من فضلك أدخل رقم صحيح للتواصل");
            return;
        }
        document.getElementById("phonePopup").style.display = "none";
        // أكمل عملية الطلب هنا
    }
};
