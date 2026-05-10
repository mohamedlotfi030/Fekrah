const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';

const config = {
    'tshirt': {
        name: 'تيشيرت قطن فاخر',
        images: ['T-shirt.png', 'T-shirt-2.png', 'T-shirt-3.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'مقاس أطفال'],
        opts: ['طباعة DTF حراري', 'تطريز كمبيوتر', 'فينيل حراري']
    },
    'rollup': {
        name: 'رول أب ستاند (Roll Up)',
        images: ['rollup-1.jpg', 'rollup-2.jpg', 'rollup-3.jpg'],
        sizes: [
            '80 سم × 200 سم بنر', '85 سم × 200 سم بنر', '100 سم × 200 سم بنر', '120 سم × 200 سم بنر',
            '80 سم × 200 سم جلوسي + لامنيشن', '85 سم × 200 سم جلوسي + لامنيشن', '100 سم × 200 سم جلوسي + لامنيشن', '120 سم × 200 سم جلوسي + لامنيشن'
        ],
        opts: ['ستاند مستورد عالي الجودة', 'ستاند ثقيل فاخر']
    },
    'xbanr': {
        name: 'إكس بانر ستاند (X-Banner)',
        images: ['x-banr.jpg', 'x-banr-2.jpg'],
        sizes: ['60 سم × 160 سم', '80 سم × 180 سم'],
        opts: ['طباعة بنر عالي الدقة', 'طباعة جلوسي مع لامنيشن']
    },
    'bcard': {
        name: 'كروت شخصية',
        images: ['B-card.jpg', 'B-card-2.jpg'],
        sizes: ['9x5 سم (عادي)', '8.5x5.5 سم (مودرن)', 'كارت مربع'],
        opts: ['كوشيه مط', 'سلوفان لامع', 'يو في موضعي (Spot UV)']
    },
    'mug': {
        name: 'مج سيراميك',
        images: ['mug.jpg', 'mug-2.jpg'],
        sizes: ['11 أونصة (عادي)', '15 أونصة (كبير)'],
        opts: ['مج أبيض سادة', 'مج سحري', 'يد قلب']
    }
};

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
let currentImgIndex = 0;

// تحميل تفاصيل المنتج
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];

    if (product) {
        document.getElementById('pTitle').innerText = product.name;
        document.getElementById('pImg').src = product.images[0];
        
        const sizeSelect = document.getElementById('pSize');
        sizeSelect.innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
        
        const optSelect = document.getElementById('pOpt');
        optSelect.innerHTML = product.opts.map(o => `<option value="${o}">${o}</option>`).join('');

        startSlider(product.images);
    }
    updateBadge();
}

// سلايدر الصور التلقائي
function startSlider(images) {
    if (images.length < 2) return;
    setInterval(() => {
        const imgElement = document.getElementById('pImg');
        imgElement.style.opacity = '0';
        setTimeout(() => {
            currentImgIndex = (currentImgIndex + 1) % images.length;
            imgElement.src = images[currentImgIndex];
            imgElement.style.opacity = '1';
        }, 500);
    }, 4000);
}

// إضافة للسلة
function addToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];

    if (!product) return;

    const newItem = {
        name: product.name,
        size: document.getElementById('pSize').value,
        option: document.getElementById('pOpt').value
    };

    cart.push(newItem);
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    updateBadge();
    alert('تمت إضافة ' + product.name + ' للسلة');
}

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.innerText = cart.length;
}

// إرسال البيانات (الشيت والواتساب)
function submitToSheet() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    if(!name || !phone) return alert("يرجى إكمال البيانات");

    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ name, phone, notes: document.getElementById('userNotes').value, details: cart })
    }).then(() => {
        alert("تم استلام طلبك!");
        clearCart();
    });
}

function submitToWhatsApp() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    let msg = `*طلب جديد من الموقع*%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0A%0A*المنتجات:*%0A`;
    cart.forEach(i => msg += `- ${i.name} (${i.size})%0A`);
    window.open(`https://wa.me/201111049778?text=${encodeURIComponent(msg)}`, '_blank');
}

function clearCart() {
    localStorage.removeItem('fekra_cart');
    location.reload();
}
