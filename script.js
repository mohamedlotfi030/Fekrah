const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';

// قاعدة البيانات المحدثة
const config = {
    'tshirt': {
        name: 'تيشيرت قطن فاخر',
        desc: 'تيشيرت قطني 100% عالي الجودة متوفر بجميع المقاسات والألوان مع طباعة DTF ثابتة.',
        images: ['T-shirt.png', 'T-shirt-2.png', 'T-shirt-3.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'مقاس أطفال'],
        opts: ['طباعة DTF حراري', 'تطريز كمبيوتر', 'فينيل حراري', 'بدون طباعة']
    },
    'rollup': {
        name: 'رول أب ستاند (Roll Up)',
        images: ['roll-up.jpg', 'roll-up-2.jpg', 'roll-up-3.jpg'],
        sizes: [
            '80×200 سم بنر', '85×200 سم بنر', '100×200 سم بنر', '120×200 سم بنر',
            '80×200 سم جلوسي + لامنيشن', '85×200 سم جلوسي + لامنيشن',
            '100×200 سم جلوسي + لامنيشن', '120×200 سم جلوسي + لامنيشن'
        ],
        opts: ['ستاند مستورد عالي الجودة', 'ستاند ثقيل فاخر']
    },
    'xbanr': {
        name: 'إكس بانر ستاند (X-Banner)',
        images: ['x-banr.jpg', 'x-banr2.jpg'],
        sizes: ['60×160 سم', '80×180 سم'],
        opts: ['طباعة بنر عالي الدقة', 'طباعة جلوسي مع لامنيشن']
    },
    'bcard': {
        name: 'كروت شخصية (Business Card)',
        desc: 'كروت شخصية مطبوعة وجهين كوشيه 350 جرام مع طبقة حماية.',
        images: ['B-card.jpg', 'B-card2.jpg'],
        sizes: ['9×5 سم (عادي)', '8.5×5.5 سم (مودرن)', 'كارت مربع'],
        opts: ['كوشيه مط', 'سلوفان لامع', 'يو في موضعي (Spot UV)', 'كارت شفاف']
    },
    'mug': {
        name: 'مج سيراميك حراري',
        desc: 'أكواب سيراميك عالية الجودة تقبل الطباعة الحرارية بوضوح عالي.',
        images: ['mug.jpg', 'Mug-2.jpg', 'Mug-3.jpg'],
        sizes: ['11 أونصة (عادي)', '15 أونصة (كبير)', 'فنجان قهوة'],
        opts: ['مج أبيض سادة', 'مج سحري', 'مج يد ملونة', 'مج ذهبي/فضي']
    },
    'carsunshade': {
        name: 'شمسية سيارة مطبوعة',
        desc: 'شمسية لحماية السيارة من الشمس مع إمكانية طباعة شعارك أو صورتك.',
        images: ['Car Sunshad.jpeg', 'Car Sunshade-2.jpeg'],
        sizes: ['مقاس صالون ستاندرد', 'مقاس SUV كبير'],
        opts: ['طباعة وجه واحد', 'طباعة وجهين']
    },
    'banar': {
        name: 'بانر',
        images: ['banar.png'],
        sizes: ['مقاس حر'],
        opts: ['أوت دور']
    },
    'stand': {
        name: 'ستاند عرض',
        images: ['stand.jpeg', 'stand-2.jpeg'],
        sizes: ['مقاس حر'],
        opts: ['خامات عالية الجودة']
    }
};

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
let currentImgIndex = 0;
let sliderInterval;

// تحميل تفاصيل المنتج
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];

    if (product) {
        document.getElementById('pTitle').innerText = product.name;
        if (product.desc) document.getElementById('pDesc').innerText = product.desc;
        document.getElementById('pImg').src = product.images[0];

        // ملء المقاسات
        const sizeSelect = document.getElementById('pSize');
        sizeSelect.innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join('');

        // ملء الخيارات
        const optSelect = document.getElementById('pOpt');
        optSelect.innerHTML = product.opts.map(o => `<option value="${o}">${o}</option>`).join('');

        // تشغيل سلايدر الصور التلقائي
        startSlider(product.images);
    }
    updateBadge();
}

// سلايدر الصور التلقائي
function startSlider(images) {
    if (images.length < 2) return;
    const imgElement = document.getElementById('pImg');

    sliderInterval = setInterval(() => {
        imgElement.style.opacity = '0';
        setTimeout(() => {
            currentImgIndex = (currentImgIndex + 1) % images.length;
            imgElement.src = images[currentImgIndex];
            imgElement.style.opacity = '1';
        }, 600);
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
        option: document.getElementById('pOpt').value,
        notes: document.getElementById('pNotes') ? document.getElementById('pNotes').value : '',
        image: product.images[0]
    };

    cart.push(newItem);
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    updateBadge();
    alert('✅ تمت إضافة ' + product.name + ' للسلة');
}

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.innerText = cart.length;
}

// إرسال البيانات إلى Google Sheets
function submitToSheet() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const notes = document.getElementById('userNotes').value;

    if (!name || !phone) return alert("يرجى إدخال الاسم ورقم الهاتف");

    fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify({ name, phone, notes, details: cart })
    }).then(() => {
        alert("✅ تم استلام طلبك!");
        clearCart();
    });
}

// إرسال الطلب عبر واتساب
function submitToWhatsApp() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    let msg = `*طلب جديد من الموقع*%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0A%0A*المنتجات:*%0A`;
    cart.forEach(i => msg += `- ${i.name} (${i.size} | ${i.option})%0Aملاحظات: ${i.notes}%0A`);
    window.open(`https://wa.me/201111049778?text=${msg}`, '_blank');
}

function clearCart() {
    localStorage.removeItem('fekra_cart');
    location.reload();
}
