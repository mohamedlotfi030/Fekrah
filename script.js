const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';
const SECURITY_TOKEN = 'FEKRA_2026_SECURE';

const config = {
    'tshirt': { name: 'تيشيرتات قطنية', images: ['tshirt-main.png', 'tshirt-1.png', 'tshirt-2.png'], sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'], opts: ['طباعة DTF', 'تطريز', 'فينيل حراري'] },
    'rollup': { name: 'رول أب ستاند', images: ['rollup-1.jpg', 'rollup-2.jpg', 'rollup-3.jpg', 'rollup-4.jpg'], sizes: ['80×200 سم بنر', '85×200 سم بنر', '100×200 سم بنر', '120×200 سم بنر', '80×200 جلوسي', '85×200 جلوسي'], opts: ['ستاند مستورد', 'ستاند ثقيل فاخر'] },
    'xbanr': { name: 'إكس بانر ستاند', images: ['x-banner-1.jpg', 'x-banner-2.jpg', 'x-banner-3.jpg'], sizes: ['60×160 سم', '80×180 سم'], opts: ['طباعة بنر', 'جلوسي لامنيشن'] },
    'bcard': { name: 'كروت شخصية', images: ['business-card-1.jpg', 'business-card-2.jpg', 'business-card-3.png'], sizes: ['9x5 سم', 'كارت مربع'], opts: ['كوشيه مط', 'سلوفان لامع', 'يو في موضعي'] },
    'mug': { name: 'المج الحراري', images: ['mug-main.jpg', 'mug-1.jpg', 'mug-2.jpg'], sizes: ['11 أونصة', '15 أونصة'], opts: ['مج أبيض', 'مج سحري', 'يد ملونة'] },
    'bloknote': { name: 'بلوك نوت', images: ['bloknote.jpg', 'bloknote-2.jpg', 'bloknote-3.jpg'], sizes: ['A5', 'A6', 'A4'], opts: ['سلك لولبي', 'تجليد حراري'] },
    'popup': { name: 'بوب أب كاونتر', images: ['pop-up-counter.png', 'pop-up-counter-2.png'], sizes: ['مقاس ستاندرد'], opts: ['جلوسي لامنيشن', 'طباعة بنر'] }
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
        list.innerHTML = '<div style="text-align:center; padding:30px; color:#666;"><i class="fas fa-shopping-basket" style="display:block; font-size:2rem; margin-bottom:10px;"></i>السلة فارغة</div>';
        if (form) form.style.display = 'none';
        return;
    }

    if (form) form.style.display = 'block';
    list.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="item-info">
                <strong>${item.name}</strong>
                <p>${item.size} | ${item.option}</p>
            </div>
            <button onclick="removeItem(${index})" class="remove-btn"><i class="fas fa-trash-alt"></i></button>
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
    showToast(`تم إضافة ${product.name} بنجاح`);
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

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg show';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 500); }, 3000);
}

async function submitToSheet() {
    const btn = document.getElementById('sheetBtn');
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;

    if (!name || !phone) return showToast("يرجى إدخال الاسم والهاتف");

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ الإرسال...';

    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                token: SECURITY_TOKEN,
                name: name,
                phone: phone,
                notes: document.getElementById('userNotes').value,
                details: cart
            })
        });
        showToast("✅ تم استلام طلبك بنجاح");
        cart = [];
        syncCart();
        toggleCart(false);
    } catch (e) {
        showToast("❌ خطأ في الإرسال");
    } finally {
        btn.disabled = false;
        btn.innerText = "إرسال الطلب";
    }
}

function submitToWhatsApp() {
    const name = document.getElementById('userName').value;
    if (!name) return showToast("يرجى إدخال البيانات");
    
    let msg = `*طلب جديد من موقع فكرة*%0A👤 الاسم: ${name}%0A🛒 الطلبات:%0A`;
    cart.forEach((item, i) => {
        msg += `${i+1}. ${item.name} (${item.size} - ${item.option})%0A`;
    });
    
    window.open(`https://wa.me/201111049778?text=${msg}`, '_blank');
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
