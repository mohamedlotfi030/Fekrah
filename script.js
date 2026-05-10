const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';

// قاعدة البيانات مطابقة تماماً لأسماء ملفاتك الجديدة
const config = {
    'tshirt': {
        name: 'تيشيرتات قطنية',
        images: ['tshirt-main.png', 'tshirt-1.png', 'tshirt-2.png', 'tshirt-3.png', 'tshirt-4.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'مقاس أطفال'],
        opts: ['طباعة DTF حراري', 'تطريز', 'فينيل حراري']
    },
    'rollup': {
        name: 'رول أب ستاند',
        images: ['rollup-1.jpg', 'rollup-2.jpg', 'rollup-3.jpg', 'rollup-4.jpg'],
        sizes: [
            '80 سم × 200 سم بنر', '85 سم × 200 سم بنر', '100 سم × 200 سم بنر', '120 سم × 200 سم بنر',
            '80 سم × 200 سم جلوسي + لامنيشن', '85 سم × 200 سم جلوسي + لامنيشن', 
            '100 سم × 200 سم جلوسي + لامنيشن', '120 سم × 200 سم جلوسي + لامنيشن'
        ],
        opts: ['ستاند مستورد عالي الجودة', 'ستاند ثقيل فاخر']
    },
    'xbanr': {
        name: 'إكس بانر ستاند',
        images: ['x-banner-1.jpg', 'x-banner-2.jpg', 'x-banner-3.jpg', 'x-banner-4.jpg'],
        sizes: ['60 سم × 160 سم', '80 سم × 180 سم'],
        opts: ['طباعة بنر عالي الدقة', 'طباعة جلوسي مع لامنيشن']
    },
    'bcard': {
        name: 'كروت شخصية',
        images: ['business-card-1.jpg', 'business-card-2.jpg', 'business-card-3.png'],
        sizes: ['9x5 سم (عادي)', '8.5x5.5 سم (مودرن)', 'كارت مربع'],
        opts: ['كوشيه مط', 'سلوفان لامع', 'يو في موضعي (Spot UV)']
    },
    'mug': {
        name: 'المج الحراري',
        images: ['mug-main.jpg', 'mug-1.jpg', 'mug-2.jpg'],
        sizes: ['11 أونصة (عادي)', '15 أونصة (كبير)'],
        opts: ['مج أبيض سادة', 'مج سحري', 'مج يد ملونة']
    },
    'bloknote': {
        name: 'بلوك نوت / دفاتر',
        images: ['bloknote.jpg', 'bloknote-2.jpg', 'bloknote-3.jpg'],
        sizes: ['A5 (14.8x21 سم)', 'A6 (10.5x14.8 سم)', 'A4 كشكول'],
        opts: ['سلك لولبي', 'تجليد حراري', 'كوشيه 300 جرام غلاف']
    },
    'popup': {
        name: 'بوب أب كاونتر',
        images: ['pop-up-counter.png', 'pop-up-counter-2.png', 'pop-up-counter-3.jpg'],
        sizes: ['مقاس ستاندرد هيدر', 'كاونتر بيضاوي'],
        opts: ['طباعة جلوسي + لامنيشن', 'طباعة بنر']
    }
};

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
let currentImgIndex = 0;
let sliderInterval;

// نظام مركزي لتحديث الواجهة
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

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];

    if (product) {
        document.getElementById('pTitle').innerText = product.name;
        document.getElementById('pImg').src = product.images[0];
        document.getElementById('pSize').innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
        document.getElementById('pOpt').innerHTML = product.opts.map(o => `<option value="${o}">${o}</option>`).join('');
        
        startSlider(product.images);
    }
    updateBadge();
}

function startSlider(images) {
    if (images.length < 2) return;
    const imgElement = document.getElementById('pImg');
    if (sliderInterval) clearInterval(sliderInterval);

    sliderInterval = setInterval(() => {
        imgElement.style.opacity = '0';
        setTimeout(() => {
            currentImgIndex = (currentImgIndex + 1) % images.length;
            imgElement.src = images[currentImgIndex];
            imgElement.style.opacity = '1';
        }, 500);
    }, 4000);
}

function addToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];

    const newItem = {
        id: Date.now(),
        name: product.name,
        size: document.getElementById('pSize').value,
        option: document.getElementById('pOpt').value,
        notes: document.getElementById('pNotes').value,
        image: product.images[0]
    };

    cart.push(newItem);
    syncCart();
    showToast(`تمت إضافة ${product.name} للسلة`);
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

// أضف دوال renderCartItems و submitToSheet هنا كما في النسخ السابقة مع استدعاء syncCart() عند الحذف
