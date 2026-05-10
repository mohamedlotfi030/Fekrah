const UI = {
    renderCart() {
        const container = document.getElementById("cartItemsList");
        if (!container) return;

        if (Cart.items.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:20px; color:#666;">السلة فارغة</div>`;
            return;
        }

        container.innerHTML = Cart.items.map((item, i) => `
            <div class="cart-item-drawer" style="display:flex; gap:10px; padding:10px; border-bottom:1px solid #222; align-items:center;">
                <img src="${item.image}" width="40">
                <div style="flex:1">
                    <h4 style="margin:0; font-size:0.9rem;">${item.name}</h4>
                    <small>${item.size}</small>
                </div>
                <button onclick="Cart.remove(${i})" style="background:none; border:none; color:red; cursor:pointer;">✕</button>
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
            if (show) drawer.classList.add("active");
            else drawer.classList.remove("active");
        }
    },

    updateCart() {
        this.renderCart();
        this.updateCartBadge();
    }
};
