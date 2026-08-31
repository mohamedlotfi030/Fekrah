import { db, auth } from './firebase-config.js';
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
  items: [],

  // 1. تحميل السلة عند تسجيل الدخول
  async init() {
    const user = auth.currentUser;
    if (!user) return; // لو مفيش مستخدم مسجل
    const cartRef = doc(db, "carts", user.uid);
    const cartSnap = await getDoc(cartRef);
    this.items = cartSnap.exists() ? cartSnap.data().items : [];
    UI.updateCart();
  },

  // 2. إضافة منتج للسلة
  async add(product) {
    const user = auth.currentUser;
    if (!user) return alert("من فضلك سجل الدخول أولاً");

    const cartRef = doc(db, "carts", user.uid);
    const cartSnap = await getDoc(cartRef);
    let items = cartSnap.exists() ? cartSnap.data().items : [];
    items.push(product);

    await setDoc(cartRef, { items });
    this.items = items;
    UI.updateCart();
    alert("تمت إضافة المنتج إلى السلة بنجاح!");
  },

  // 3. حذف منتج من السلة
  async remove(index) {
    const user = auth.currentUser;
    if (!user) return;
    const cartRef = doc(db, "carts", user.uid);

    let items = [...this.items];
    items.splice(index, 1);

    await updateDoc(cartRef, { items });
    this.items = items;
    UI.updateCart();
  },

  // 4. مسح السلة بالكامل
  async clear() {
    const user = auth.currentUser;
    if (!user) return;
    const cartRef = doc(db, "carts", user.uid);

    await setDoc(cartRef, { items: [] });
    this.items = [];
    UI.updateCart();
  }
};
