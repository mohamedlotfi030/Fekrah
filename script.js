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
        images: ['roll-up.jpg'],
        sizes: [
            '80×200 سم بنر', '85×200 سم بنر', '100×200 سم بنر', '120×200 سم بنر',
            '80×200 سم جلوسي + لامنيشن', '85×200 سم جلوسي + لامنيشن', 
            '100×200 سم جلوسي + لامنيشن', '120×200 سم جلوسي + لامنيشن'
        ],
        opts: ['ستاند مستورد عالي الجودة', 'ستاند ثقيل فاخر']
    },
    'xbanr': {
        name: 'إكس بانر',
        images: ['x-banr.jpg'],
        sizes: ['60×160 سم', '80×180 سم'],
        opts: ['طباعة بنر', 'طباعة جلوسي']
    },
    'bcard': {
        name: 'كروت شخصية',
        images: ['B-card.jpg'],
        sizes: ['9×5 سم', 'كارت مربع'],
        opts: ['كوشيه مط', 'سلوفان لامع']
    },
    'mug': {
        name: 'المج الحراري',
        images: ['mug.jpg'],
        sizes: ['11 أونصة', '15 أونصة'],
        opts: ['مج أبيض سادة', 'مج سحري']
    },
    'bloknote': {
        name: 'بلوك نوت',
        images: ['bloknote.jpg'],
        sizes: ['A4','A5','A6'],
        opts: ['تجليد علوي','تجليد جانبي']
    },
    'popup': {
        name: 'بوب أب كونتر',
        images: ['pop-up-counter.png'],
        sizes: ['80 سم'],
        opts: ['هيكل ألمنيوم + لمنيشن']
    },
    'banar': {
        name: 'بانر',
        images: ['banar.png'],
        sizes: ['مقاس حر'],
        opts: ['أوت دور']
    },
    'stand': {
        name: 'ستاند عرض',
        images: ['stand.jpeg'],
        sizes: ['مقاس حر'],
        opts: ['خامات عالية الجودة']
    },
    'carsunshade': {
        name: 'شمسية سيارة',
        images: ['Car Sunshad.jpeg'],
        sizes: ['مقاس حر'],
        opts: ['طباعة حرارية']
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
        notes: document.getElementById('pNotes').value
    };

    cart.push(newItem);
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    updateBadge();
    alert('✅ تم إضافة ' + product.name + ' إلى السلة');
}

function submitToSheet() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const notes = document.getElementById('userNotes').value;

    if (!name || !phone) return alert("يرجى إدخال الاسم ورقم الهاتف");

    const itemsText = cart.map(i => `${i.name} (${i.size} | ${i.option}) - ملاحظات: ${i.notes}`).join(' / ');

    fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            phone: phone,
            notes: notes,
            items: itemsText
        })
    }).then(() => {
        alert("✅ تم إرسال طلبك بنجاح!");
        localStorage.removeItem('fekra_cart');
        location.reload();
    });
}
