const Cart = {
    items: [],

    init() {
        // تحميل البيانات المخزنة عند فتح الموقع
        this.items = JSON.parse(localStorage.getItem('fekra_cart')) || [];
        if (typeof UI !== 'undefined') {
            UI.updateCart();
        }
    },

    add(productId) {
        if (typeof Products === 'undefined' || !Products[productId]) {
            console.error("المنتج غير موجود في قاعدة البيانات");
            return;
        }

        const product = Products[productId];
        const item = {
            id: productId,
            name: product.name,
            image: product.images[0],
            // جلب القيم من القوائم المنسدلة في صفحة المنتج أو وضع قيم افتراضية
            size: document.getElementById("pSize")?.value || "قياسي",
            option: document.getElementById("pOpt")?.value || "عادي",
            qty: 1
        };

        this.items.push(item);
        this.save();
        
        // تحديث الواجهة وفتح السلة تلقائياً
        if (typeof UI !== 'undefined') {
            UI.updateCart();
            UI.toggleCart(true); 
        }
    },

    remove(index) {
        this.items.splice(index, 1);
        this.save();
        if (typeof UI !== 'undefined') {
            UI.updateCart();
        }
    },

    save() {
        localStorage.setItem('fekra_cart', JSON.stringify(this.items));
    },

    clear() {
        this.items = [];
        this.save();
        if (typeof UI !== 'undefined') {
            UI.updateCart();
        }
    }
};
