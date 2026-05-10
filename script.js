const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';
const SECURITY_TOKEN = 'FEKRA_2026_SECURE';

const config = {
    'tshirt': { name: 'تيشيرتات قطنية', images: ['tshirt-main.png'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], opts: ['طباعة DTF', 'تطريز'] },
    'rollup': { name: 'رول أب ستاند', images: ['rollup-1.jpg'], sizes: ['80×200 سم', '100×200 سم'], opts: ['مستورد', 'فاخر ثقيل'] },
    'xbanr': { name: 'إكس بانر ستاند', images: ['x-banner-1.jpg'], sizes: ['60×160 سم', '80×180 سم'], opts: ['طباعة بنر', 'جلوسي'] },
    'bcard': { name: 'كروت شخصية', images: ['business-card-1.jpg'], sizes: ['9x5 سم', 'مربع'], opts: ['كوشيه مط', 'سلوفان لامع'] },
    'mug': { name: 'المج الحراري', images: ['mug-main.jpg'], sizes: ['11 أونصة', '15 أونصة'], opts: ['مج أبيض', 'مج سحري'] },
    'bloknote': { name: 'بلوك نوت', images: ['bloknote.jpg'], sizes: ['A5', 'A6'], opts: ['سلك لولبي'] },
    'popup': { name: 'بوب أب كاونتر', images: ['pop-up-counter.png'], sizes: ['قياسي'], opts: ['جلوسي لامنيشن'] }
};

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];

function syncCart() {
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    updateBadge();
    if (document.getElementById('cartItemsList')) renderCart();
}

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.innerText = cart.length;
        badge.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    const form = document.getElementById('checkoutFormContainer');
    if (!list) return;

    if (cart.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:30px; color:#666;">السلة فارغة</div>';
        if (form) form.style.display = 'none';
        return;
    }

    if (form) form.style.display = 'block';
    list.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="background:#1a1a1a; padding:15px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; border:1px solid #333;">
            <div><strong style="color:var(--primary);">${item.name}</strong><br><small>${item.size} | ${item.option}</small></div>
            <i class="fas fa-trash-alt" onclick="removeItem(${index})" style="color:#ff4d4d; cursor:pointer;"></i>
        </div>
    `).join('');
}

function addToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];
    if (!product) return;

    cart.push({
        id: Date.now(),
        name: product.name,
        size: document.getElementById('pSize').value,
        option: document.getElementById('pOpt').value,
        notes: document.getElementById('pNotes').value
    });

    syncCart();
    showToast(`✅ تم إضافة ${product.name}`);
}

function removeItem(index) {
    cart.splice(index, 1);
    syncCart();
}

function toggleCart(show) {
    const sidebar = document.getElementById('sidebar');
    if (show) { sidebar.classList.add('open'); renderCart(); }
    else { sidebar.classList.remove('open'); }
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg show';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 3000);
}

function sendToWhatsApp() {
    const name = document.getElementById('userName').value;
    if (!name) return showToast("⚠️ يرجى إدخال الاسم");
    let msg = `*طلب جديد من موقع فكرة*%0A👤 *الاسم:* ${name}%0A🛒 *المنتجات:*%0A`;
    cart.forEach((item, i) => {
        msg += `${i+1}. *${item.name}* (${item.size})%0A`;
    });
    window.open(`https://wa.me/201275209778?text=${msg}`, '_blank');
}

async function submitToSheet() {
    const btn = document.getElementById('sheetBtn');
    const name = document.getElementById('userName').value;
    if (!name) return showToast("⚠️ يرجى إدخال الاسم");
    btn.disabled = true; btn.innerText = "جارٍ الإرسال...";
    try {
        await fetch(WEB_APP_URL, {
            method: 'POST', mode: 'no-cors',
            body: JSON.stringify({ token: SECURITY_TOKEN, name: name, phone: document.getElementById('userPhone').value, details: cart })
        });
        showToast("✅ تم الإرسال للمطبعة");
        cart = []; syncCart(); toggleCart(false);
    } catch (e) { showToast("❌ خطأ"); }
    finally { btn.disabled = false; btn.innerText = "إرسال للمطبعة"; }
}

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];
    if (product) {
        document.getElementById('pTitle').innerText = product.name;
        document.getElementById('pImg').src = product.images[0];
        document.getElementById('pSize').innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
        document.getElementById('pOpt').innerHTML = product.opts.map(o => `<option value="${o}">${o}</option>`).join('');
    }
    updateBadge();
}
