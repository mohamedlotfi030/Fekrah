// js/cart.js
import { db, auth } from './firebase-config.js';
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

/**
 * Cart object
 * - يتم تصديره كـ named export
 * - يوفر دالة مساعدة addToCart متوافقة مع الكود القديم
 */
export const Cart = {
  items: [],

  // جلب السلة للمستخدم الحالي (أو تهيئة فارغة)
  async init() {
    try {
      const user = auth.currentUser;
      if (!user) {
        this.items = [];
        this._notifyUI();
        return;
      }
      const cartRef = doc(db, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);
      this.items = cartSnap.exists() ? (cartSnap.data().items || []) : [];
      this._notifyUI();
    } catch (err) {
      console.error("Cart.init error:", err);
      this.items = [];
      this._notifyUI();
    }
  },

  // إضافة عنصر للسلة
  async add(product) {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("من فضلك سجّل الدخول أولاً");
        window.location.href = "login.html";
        return;
      }

      const cartRef = doc(db, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);
      let items = cartSnap.exists() ? (cartSnap.data().items || []) : [];

      // إذا أردت دمج العناصر المتكررة حسب id و option يمكنك تعديل المنطق هنا
      items.push(product);

      await setDoc(cartRef, { items }, { merge: true });
      this.items = items;
      this._notifyUI();
      return true;
    } catch (err) {
      console.error("Cart.add error:", err);
      alert("حدث خطأ أثناء إضافة المنتج إلى السلة.");
      return false;
    }
  },

  // حذف عنصر حسب الفهرس
  async remove(index) {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("من فضلك سجّل الدخول");
        return;
      }
      let items = Array.isArray(this.items) ? [...this.items] : [];
      if (index < 0 || index >= items.length) return;
      items.splice(index, 1);
      const cartRef = doc(db, "carts", user.uid);
      await setDoc(cartRef, { items }, { merge: true });
      this.items = items;
      this._notifyUI();
    } catch (err) {
      console.error("Cart.remove error:", err);
    }
  },

  // مسح السلة بالكامل
  async clear() {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("من فضلك سجّل الدخول");
        return;
      }
      const cartRef = doc(db, "carts", user.uid);
      await setDoc(cartRef, { items: [] }, { merge: true });
      this.items = [];
      this._notifyUI();
    } catch (err) {
      console.error("Cart.clear error:", err);
    }
  },

  // دالة داخلية لتحديث الواجهة (تستدعي renderCart إن وُجدت وتحدّث عداد السلة)
  _notifyUI() {
    try {
      if (typeof window.renderCart === 'function') {
        window.renderCart();
      }
      const badge = document.getElementById('cart-count');
      if (badge) badge.innerText = Array.isArray(this.items) ? this.items.length : 0;
    } catch (err) {
      console.error("Cart._notifyUI error:", err);
    }
  }
};

// تهيئة Cart تلقائياً عند تغيّر حالة المصادقة
onAuthStateChanged(auth, async (user) => {
  await Cart.init();
});

// دالة مساعدة متوافقة مع الكود القديم
export function addToCart(product) {
  return Cart.add(product);
}
