const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';

const config = {
    'tshirt': {
        name: 'تيشيرت قطن فاخر',
        desc: 'طباعة حرارية عالية الجودة على أجود أنواع القطن.',
        images: ['T-shirt.png', 'T-shirt-2.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'مقاس أطفال'],
        opts: ['طباعة DTF', 'تطريز', 'فينيل']
    },
    'rollup': {
        name: 'رول أب ستاند (Roll Up)',
        desc: 'ستاند عرض متنقل مع طباعة عالية الدقة.',
        images: ['rollup.png', 'rollup-1.jpg'], // تأكد من وجود rollup.png في ملفاتك
        sizes: [
            '80 سم × 200 سم بنر', '85 سم × 200 سم بنر', '100 سم × 200 سم بنر', '120 سم × 200 سم بنر',
            '80 سم × 200 سم جلوسي + لامنيشن', '85 سم × 200 سم جلوسي + لامنيشن', 
            '100 سم × 200 سم جلوسي + لامنيشن', '120 سم × 200 سم جلوسي + لامنيشن'
        ],
        opts: ['ستاند مستورد عالي الجودة', 'ستاند ثقيل فاخر']
    },
    'xbanr': {
        name: 'إكس بانر ستاند',
        images: ['x-banr.jpg', 'x-banr-2.jpg'],
        sizes: ['60 سم × 160 سم', '80 سم × 180 سم'],
        opts: ['طباعة بنر', 'طباعة جلوسي']
    }
};

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];

    if (product) {
        document.getElementById('pTitle').innerText = product.name;
        document.getElementById('pImg').src = product.images[0];
        document.getElementById('pSize').innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
        document.getElementById('pOpt').innerHTML = product.opts.map(o => `<option value="${o}">${o}</option>`).join('');
        if(product.desc) document.getElementById('pDesc').innerText = product.desc;
    }
    updateBadge();
}

function addToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];

    const newItem = {
        name: product.name,
        size: document.getElementById('pSize').value,
        option: document.getElementById('pOpt').value,
        notes: document.getElementById('pNotes').value, // حفظ الملاحظات
        image: product.images[0]
    };

    cart.push(newItem);
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    updateBadge();
    alert('تم إضافة المنتج للسلة!');
}

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.innerText = cart.length;
}
