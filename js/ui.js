const UI = {
    toggleCart(show) {
        const drawer = document.getElementById("cartDrawer");
        const overlay = document.getElementById("cartOverlay");
        
        if (show) {
            drawer.classList.add("active");
            if(overlay) overlay.classList.add("active");
            this.renderCart();
        } else {
            drawer.classList.remove("active");
            if(overlay) overlay.classList.remove("active");
        }
    },

    renderCart() {
        const container = document.getElementById("cartItemsList");
        if (!container) return;
        
        if (Cart.items.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#888; padding:20px;">السلة فارغة</p>';
            return;
        }

        container.innerHTML = Cart.items.map((item, i) => `
            <div style="display:flex; align-items:center; gap:10px; border-bottom:1px solid #222; padding:10px 0;">
                <img src="${item.image}" width="40" style="background:#fff; border-radius:4px;">
                <div style="flex:1; color:#fff; font-size:0.8rem;">${item.name}<br><small style="color:#00bcd4;">${item.size}</small></div>
                <button onclick="Cart.remove(${i})" style="background:none; border:none; color:red; cursor:pointer;">✕</button>
            </div>
        `).join('');
    },

    updateCartBadge() {
        const badge = document.getElementById("cartBadge");
        if (badge) {
            badge.innerText = Cart.items.length;
            badge.style.display = Cart.items.length > 0 ? "block" : "none";
        }
    },

    // دالة تحريك الصور لصفحة المنتج
    startProductSlideshow(productId) {
        const img = document.getElementById('mainPImg');
        if (img && Products[productId] && Products[productId].images.length > 1) {
            let i = 0;
            setInterval(() => {
                i = (i + 1) % Products[productId].images.length;
                img.style.opacity = 0.4;
                setTimeout(() => {
                    img.src = Products[productId].images[i];
                    img.style.opacity = 1;
                }, 300);
            }, 3000);
        }
    },

    updateCart() {
        this.renderCart();
        this.updateCartBadge();
    }
};
