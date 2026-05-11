const Cart = {
    items: [],

    init() {
        this.items = JSON.parse(localStorage.getItem('fekra_cart')) || [];
        UI.updateCart();
    },

    add(productId) {
        const product = Products[productId];
        const item = {
            id: productId,
            name: product.name,
            image: product.images[0],
            size: document.getElementById("pSize")?.value || "قياسي",
            option: document.getElementById("pOpt")?.value || "عادي",
            qty: 1
        };
        this.items.push(item);
        this.save();
        UI.updateCart();
        UI.toggleCart(true);
    },

    remove(index) {
        this.items.splice(index, 1);
        this.save();
        UI.updateCart();
    },

    save() {
        localStorage.setItem('fekra_cart', JSON.stringify(this.items));
    },

    clear() {
        this.items = [];
        this.save();
        UI.updateCart();
    }
};
