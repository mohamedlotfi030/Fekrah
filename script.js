const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';

// قاعدة البيانات المحدثة
const config = {
    'tshirt': {
        name: 'تيشيرت قطن فاخر',
        desc: 'تيشيرت قطني 100% عالي الجودة متوفر بجميع المقاسات والألوان مع طباعة DTF ثابتة.',
        images: ['T-shirt.png', 'T-shirt-2.png', 'T-shirt-3.png'], // استبدلها بأسماء صورك المرفوعة
        sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'مقاس أطفال'],
        opts: ['طباعة DTF حراري', 'تطريز كمبيوتر', 'فينيل حراري', 'بدون طباعة']
    },
    'bcard': {
        name: 'كروت شخصية (Business Card)',
        desc: 'كروت شخصية مطبوعة وجهين كوشيه 350 جرام مع طبقة حماية.',
        images: ['B-card.jpg', 'B-card-2.jpg'],
        sizes: ['9x5 سم (عادي)', '8.5x5.5 سم (مودرن)', 'كارت مربع'],
        opts: ['كوشيه مط', 'سلوفان لامع', 'يو في موضعي (Spot UV)', 'كارت شفاف']
    },
    'mug': {
        name: 'مج سيراميك حراري',
        desc: 'أكواب سيراميك عالية الجودة تقبل الطباعة الحرارية بوضوح عالي.',
        images: ['mug.jpg', 'mug-inner.jpg', 'mug-box.jpg'],
        sizes: ['11 أونصة (عادي)', '15 أونصة (كبير)', 'فنجان قهوة'],
        opts: ['مج أبيض سادة', 'مج سحري (يظهر عند الحرارة)', 'مج يد ملونة', 'مج ذهبي/فضي']
    },
    'carsunshade': {
        name: 'شمسية سيارة مطبوعة',
        desc: 'شمسية لحماية السيارة من الشمس مع إمكانية طباعة شعارك أو صورتك.',
        images: ['Car Sunshad.jpeg', 'sunshade-2.jpg'],
        sizes: ['مقاس صالون ستاندرد', 'مقاس SUV كبير'],
        opts: ['طباعة وجه واحد', 'طباعة وجهين']
    }
    // أضف باقي المنتجات (rollup, xbanr, banar, stand) بنفس الطريقة
};

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
let currentImgIndex = 0;
let sliderInterval;

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];

    if (product) {
        document.getElementById('pTitle').innerText = product.name;
        document.getElementById('pDesc').innerText = product.desc;
        document.getElementById('pImg').src = product.images[0];

        // ملء المقاسات
        const sizeSelect = document.getElementById('pSize');
        sizeSelect.innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join('');

        // ملء الخيارات
        const optSelect = document.getElementById('pOpt');
        optSelect.innerHTML = product.opts.map(o => `<option value="${o}">${o}</option>`).join('');

        // تشغيل سلايدر الصور التلقائي كل 4 ثوانٍ
        startSlider(product.images);
    }
    updateBadge();
}

function startSlider(images) {
    if (images.length < 2) return;
    const imgElement = document.getElementById('pImg');
    
    sliderInterval = setInterval(() => {
        imgElement.style.opacity = '0'; // تأثير التلاشي
        setTimeout(() => {
            currentImgIndex = (currentImgIndex + 1) % images.length;
            imgElement.src = images[currentImgIndex];
            imgElement.style.opacity = '1';
        }, 600);
    }, 4000);
}

function addToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const product = config[type];

    const newItem = {
        name: product.name,
        size: document.getElementById('pSize').value,
        option: document.getElementById('pOpt').value,
        image: product.images[0]
    };

    cart.push(newItem);
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    alert('تمت إضافة المنتج للسلة بنجاح!');
    updateBadge();
}

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.innerText = cart.length;
}

// دمج دوال السلة (الواتساب والشيت) التي قمنا بها سابقاً في هذا الملف أيضاً ليعمل كل شيء
