const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';

const config = {
    'tshirt': { name: 'تيشيرتات قطنية', images: ['tshirt-main.png', 'tshirt-1.png', 'tshirt-2.png'], sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'], opts: ['طباعة DTF', 'تطريز'] },
    'rollup': { name: 'رول أب ستاند', images: ['rollup-1.jpg', 'rollup-2.jpg', 'rollup-3.jpg'], sizes: ['80×200 سم بنر', '85×200 سم بنر', '100×200 سم بنر', '120×200 سم بنر', '80×200 جلوسي', '85×200 جلوسي'], opts: ['مستورد عالي الجودة', 'فاخر ثقيل'] },
    'xbanr': { name: 'إكس بانر ستاند', images: ['x-banner-1.jpg', 'x-banner-2.jpg'], sizes: ['60×160 سم', '80×180 سم'], opts: ['طباعة بنر', 'جلوسي لامنيشن'] },
    'bcard': { name: 'كروت شخصية', images: ['business-card-1.jpg', 'business-card-2.jpg'], sizes: ['9x5 سم', 'كارت مربع'], opts: ['كوشيه مط', 'سلوفان لامع'] },
    'mug': { name: 'المج الحراري', images: ['mug-main.jpg', 'mug-1.jpg'], sizes: ['11 أونصة', '15 أونصة'], opts: ['مج أبيض', 'مج سحري'] },
    'bloknote': { name: 'بلوك نوت', images: ['bloknote.jpg', 'bloknote-2.jpg'], sizes: ['A5', 'A6'], opts: ['سلك لولبي', 'تجليد حراري'] },
    'popup': { name: 'بوب أب كاونتر', images: ['pop-up-counter.png', 'pop-up-counter-2.png'], sizes: ['ستاندرد'], opts: ['جلوسي لامنيشن'] }
};

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];

// نظام مركزي لمزامنة السلة (حل مشكلة كوبايلت رقم 1 و 2)
function syncCart() {
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    updateBadge();
    if (document.getElementById('cartItemsList')) renderCartItems();
}

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.innerText = cart.length;
        badge.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
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
    showToast(`تمت إضافة ${product.name} بنجاح!`);
}

function renderCartItems() {
    const list = document.getElementById('cartItemsList');
    const form = document.getElementById('checkoutFormContainer');
    if (!list) return;

    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#666;">السلة فارغة</p>';
        form.style.display = 'none';
        return;
    }

    form.style.display = 'block';
    list.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.size} | ${item.option}</small>
            </div>
            <i class="fas fa-trash" onclick="removeItem(${index})" style="color:#ff4d4d; cursor:pointer;"></i>
        </div>
    `).join('');
}

function removeItem(index) {
    cart.splice(index, 1);
    syncCart();
}

function toggleCart(show) {
    const sidebar = document.getElementById('sidebar');
    if (show) {
        sidebar.classList.add('open');
        renderCartItems();
    } else {
        sidebar.classList.remove('open');
    }
}

// تحميل تفاصيل المنتج
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
