const UI = {
    renderCart() {
        const container = document.getElementById("cartItemsList");
        if (!container) return;
        container.innerHTML = Cart.items.length === 0 ? '<p style="text-align:center; padding:20px;">السلة فارغة</p>' : 
        Cart.items.map((item, i) => `
            <div style="display:flex; align-items:center; gap:10px; padding:10px; border-bottom:1px solid #333;">
                <img src="${item.image}" width="40" style="background:white;">
                <div style="flex:1; color:white; font-size:0.8rem;">${item.name}<br><small>${item.size}</small></div>
                <button onclick="Cart.remove(${i})" style="color:red; background:none; border:none;">✕</button>
            </div>`).join('');
    },
    updateCartBadge() {
        const badge = document.getElementById("cartBadge");
        if(badge) {
            badge.innerText = Cart.items.length;
            badge.style.display = Cart.items.length > 0 ? "block" : "none";
        }
    },
    toggleCart(show) {
        const drawer = document.getElementById("cartDrawer");
        show ? drawer.classList.add("active") : drawer.classList.remove("active");
    },
    // تبديل الصور في صفحة المنتج فقط
    initProductSlideshow(productId) {
        const imgElement = document.getElementById('mainPImg');
        const product = Products[productId];
        if (imgElement && product && product.images.length > 1) {
            let idx = 0;
            setInterval(() => {
                idx = (idx + 1) % product.images.length;
                imgElement.style.opacity = '0';
                setTimeout(() => {
                    imgElement.src = product.images[idx];
                    imgElement.style.opacity = '1';
                }, 300);
            }, 3000);
        }
    },
    updateCart() { this.renderCart(); this.updateCartBadge(); }
};
