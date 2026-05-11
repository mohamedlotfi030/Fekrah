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
                <img src="${item.image}" width="40" style="background:white; border-radius:5px;">
                <div style="flex:1">
                    <h4 style="margin:0; font-size:0.85rem; color:white;">${item.name}</h4>
                    <small style="color:#888;">${item.size} | ${item.option}</small>
                </div>
                <button onclick="Cart.remove(${i})" style="background:none; border:none; color:#ff4444; cursor:pointer;">✕</button>
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
            show ? drawer.classList.add("active") : drawer.classList.remove("active");
        }
    },

    // الكود المسؤول عن تحريك الصور كل 3 ثوانٍ
    initSlideshow() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const imgElement = card.querySelector('.slideshow-img');
            const productId = card.getAttribute('data-id');
            const product = Products[productId];
            
            if (product && product.images.length > 1) {
                let currentIndex = 0;
                setInterval(() => {
                    currentIndex = (currentIndex + 1) % product.images.length;
                    // تأثير التلاشي
                    imgElement.style.opacity = '0.3';
                    setTimeout(() => {
                        imgElement.src = product.images[currentIndex];
                        imgElement.style.opacity = '1';
                    }, 400); 
                }, 3000); // 3 ثوانٍ
            }
        });
    },

    updateCart() {
        this.renderCart();
        this.updateCartBadge();
    }
};
