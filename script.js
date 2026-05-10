const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';

const config = {
    'tshirt': {
        name: 'تيشيرتات',
        images: ['T-shirt.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'مقاس أطفال'],
        opts: ['طباعة DTF', 'تطريز', 'فينيل']
    },
    'rollup': {
        name: 'رول أب ستاند',
        images: ['rollup.png'], // تأكد من وجود صورة بهذا الاسم في مجلدك
        sizes: [
            '80 سم × 200 سم بنر', '85 سم × 200 سم بنر', '100 سم × 200 سم بنر', '120 سم × 200 سم بنر',
            '80 سم × 200 سم جلوسي + لامنيشن', '85 سم × 200 سم جلوسي + لامنيشن', 
            '100 سم × 200 سم جلوسي + لامنيشن', '120 سم × 200 سم جلوسي + لامنيشن'
        ],
        opts: ['ستاند مستورد عالي الجودة', 'ستاند ثقيل فاخر']
    },
    'xbanr': {
        name: 'إكس بانر',
        images: ['x-banr.jpg'],
        sizes: ['60 سم × 160 سم', '80 سم × 180 سم'],
        opts: ['طباعة بنر', 'طباعة جلوسي']
    },
    'bcard': {
        name: 'كروت شخصية',
        images: ['B-card.jpg'],
        sizes: ['9x5 سم', 'كارت مربع'],
        opts: ['كوشيه مط', 'سلوفان لامع']
    },
    'mug': {
        name: 'المج الحراري',
        images: ['mug.jpg'],
        sizes: ['11 أونصة', '15 أونصة'],
        opts: ['مج أبيض سادة', 'مج سحري']
    }
};

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.innerText = cart.length;
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

function addToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];

    const newItem = {
        name: product.name,
        size: document.getElementById('pSize').value,
        option: document.getElementById('pOpt').value,
        notes: document.getElementById('pNotes').value // سحب الملاحظات من الصندوق
    };

    cart.push(newItem);
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    updateBadge();
    alert('تم إضافة ' + product.name + ' إلى السلة');
}

// دالة إرسال البيانات لجدول البيانات (Google Sheets)
function submitToSheet() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const notes = document.getElementById('userNotes').value;

    if (!name || !phone) return alert("يرجى إدخال الاسم ورقم الهاتف");

    // تحويل عناصر السلة لنص واحد ليدخل في خانة Items
    const itemsText = cart.map(i => `${i.name} (${i.size} | ${i.option}) - ملاحظات: ${i.notes}`).join(' / ');

    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
            name: name,
            phone: phone,
            notes: notes,
            details: cart // سيتم معالجتها في Apps Script لملء خانة Items
        })
    }).then(() => {
        alert("تم إرسال طلبك بنجاح!");
        localStorage.removeItem('fekra_cart');
        location.reload();
    });
}
