const UI = {
    renderCart() {
        const container = document.getElementById("cartItemsList");
        if (!container) return;

        if (this.items?.length === 0) {
            container.innerHTML = `<div class="empty-cart">السلة فارغة حالياً</div>`;
            return;
        }

        container.innerHTML = Cart.items.map((item, i) => `
            <div class="cart-item-drawer">
                <img src="${item.image}" width="50">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <small>${item.size} | ${item.option}</small>
                </div>
                <button onclick="Cart.remove(${i})" class="remove-btn">✕</button>
            </div>
        `).join('');
    },

    updateCartBadge() {
        const badges = document.querySelectorAll(".cart-count");
        badges.forEach(b => {
            b.innerText = Cart.items.length;
            b.style.display = Cart.items.length > 0 ? "flex" : "none";
        });
    },

    toggleCart(show) {
        const drawer = document.getElementById("cartDrawer");
        if (show) drawer.classList.add("active");
        else drawer.classList.remove("active");
    },

    updateCart() {
        this.renderCart();
        this.updateCartBadge();
    }
};
