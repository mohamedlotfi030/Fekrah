// 1. الإعدادات الأمنية وقاعدة البيانات
const WEB_APP_URL = 'YOUR_GOOGLE_SCRIPT_URL';
const SECURITY_TOKEN = 'FEKRA_2026_SECURE'; // توكن بسيط لزيادة الأمان

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];

// 2. دالة التحديث المركزي (تضمن مزامنة الـ LocalStorage مع الواجهة)
function syncCart() {
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    updateBadge();
    renderCart(); // تحديث السلة في كل مرة يحدث تغيير
}

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.innerText = cart.length;
        badge.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

// 3. دالة بناء السلة المحدثة (حل مشكلة الـ UX والـ Scroll)
function renderCart() {
    const list = document.getElementById('cartItemsList');
    const formContainer = document.getElementById('checkoutFormContainer');
    
    if (!list) return; // لضمان عدم حدوث خطأ إذا لم تكن السلة موجودة في الصفحة

    if (cart.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:40px 20px; color:#666;">
                <i class="fas fa-shopping-basket" style="font-size:3rem; margin-bottom:15px;"></i>
                <p>السلة فارغة حالياً</p>
            </div>`;
        if (formContainer) formContainer.style.display = 'none';
        return;
    }

    if (formContainer) formContainer.style.display = 'block';

    list.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="background:#1a1a1a; padding:15px; border-radius:12px; margin-bottom:12px; border:1px solid #333;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <h4 style="margin:0; color:var(--primary); font-size:1.1rem;">${item.name}</h4>
                    <p style="margin:5px 0; font-size:0.9rem; color:#ccc;">${item.size} - ${item.option}</p>
                    ${item.notes ? `<small style="color:#888;">📝 ${item.notes}</small>` : ''}
                </div>
                <button onclick="removeItem(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:1.2rem;">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 4. تحسين زر واتساب لإرسال تفاصيل كاملة
function submitToWhatsApp() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;

    if (!name || !phone) {
        showToast("يرجى إدخال الاسم ورقم الهاتف أولاً");
        return;
    }

    let message = `*طلب جديد من موقع فكرة*%0A`;
    message += `👤 *الاسم:* ${name}%0A`;
    message += `📞 *الهاتف:* ${phone}%0A%0A`;
    message += `🛒 *المنتجات:*%0A`;

    cart.forEach((item, i) => {
        message += `${i+1}. *${item.name}*%0A   - المقاس: ${item.size}%0A   - النوع: ${item.option}%0A`;
        if(item.notes) message += `   - ملاحظات: ${item.notes}%0A`;
        message += `--------------------------%0A`;
    });

    const whatsappUrl = `https://wa.me/201111049778?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// 5. دالة الإرسال لـ Google Sheets مع حالة التحميل (Loading State)
async function submitToSheet() {
    const btn = document.getElementById('sheetBtn');
    const name = document.getElementById('userName').value;
    
    if (!name) return showToast("يرجى إدخال البيانات");

    // تفعيل حالة التحميل
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> جارٍ الإرسال...';

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // سيبقى no-cors لتجنب مشاكل الـ Redirect في Apps Script
            body: JSON.stringify({
                token: SECURITY_TOKEN, // إرسال التوكن للأمان
                name: name,
                phone: document.getElementById('userPhone').value,
                notes: document.getElementById('userNotes').value,
                details: cart
            })
        });

        showToast("✅ تم إرسال طلبك بنجاح!");
        cart = [];
        syncCart();
        toggleCart(false);
    } catch (error) {
        showToast("❌ حدث خطأ في الإرسال");
    } finally {
        btn.disabled = false;
        btn.innerText = "إرسال الطلب عبر الموقع";
    }
}

// 6. نظام الإشعارات (Toast) بدلاً من Alert
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg show';
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function removeItem(index) {
    cart.splice(index, 1);
    syncCart();
}

function toggleCart(show) {
    const sidebar = document.getElementById('sidebar');
    if (show) {
        sidebar.classList.add('open');
        renderCart();
    } else {
        sidebar.classList.remove('open');
    }
}
