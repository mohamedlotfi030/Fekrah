const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';

// ================= CONFIG =================
const config = {
    tshirt: {
        name: 'تيشيرت قطن فاخر',
        desc: 'تيشيرت قطني 100% عالي الجودة مع طباعة DTF ثابتة.',
        images: ['T-shirt.png', 'T-shirt-2.png', 'T-shirt-3.png'],
        sizes: ['S','M','L','XL','XXL','3XL','4XL','أطفال'],
        opts: ['DTF', 'تطريز', 'فينيل', 'بدون طباعة']
    },

    rollup: {
        name: 'رول أب ستاند',
        images: ['roll-up.jpg', 'roll-up-2.jpg', 'roll-up-3.jpg'],
        sizes: ['80×200', '85×200', '100×200', '120×200'],
        opts: ['ستاند مستورد', 'ستاند ثقيل']
    },

    xbanr: {
        name: 'X Banner',
        images: ['x-banr.jpg', 'x-banr2.jpg'],
        sizes: ['60×160', '80×180'],
        opts: ['بنر', 'جلوسي + لامنيشن']
    },

    bcard: {
        name: 'كروت شخصية',
        images: ['B-card.jpg', 'B-card2.jpg'],
        sizes: ['9×5', '8.5×5.5', 'مربع'],
        opts: ['مط', 'لامع', 'UV', 'شفاف']
    },

    mug: {
        name: 'مج سيراميك',
        images: ['mug.jpg', 'Mug-2.jpg', 'Mug-3.jpg'],
        sizes: ['11oz', '15oz'],
        opts: ['أبيض', 'سحري', 'ملون', 'ذهبي']
    },

    carsunshade: {
        name: 'شمسية سيارة',
        images: ['Car Sunshad.jpeg', 'Car Sunshade-2.jpeg'],
        sizes: ['Sedan', 'SUV'],
        opts: ['وجه واحد', 'وجهين']
    },

    banar: {
        name: 'بانر',
        images: ['banar.png'],
        sizes: ['حر'],
        opts: ['Outdoor']
    },

    stand: {
        name: 'ستاند عرض',
        images: ['stand.jpeg'],
        sizes: ['حر'],
        opts: ['Premium']
    }
};

// ================= STATE =================
let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
let currentImgIndex = 0;
let sliderInterval = null;

// ================= HELPERS =================
const saveCart = () => {
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
};

const getProductFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return config[params.get('type')];
};

// ================= PRODUCT PAGE =================
function loadProductDetails() {
    const product = getProductFromURL();
    if (!product) return;

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el && value) el.innerText = value;
    };

    const setImage = (id, src) => {
        const el = document.getElementById(id);
        if (el) el.src = src;
    };

    setText('pTitle', product.name);
    setText('pDesc', product.desc);
    setImage('pImg', product.images[0]);

    fillSelect('pSize', product.sizes);
    fillSelect('pOpt', product.opts);

    startSlider(product.images);
    updateBadge();
}

// ================= SELECT FILL =================
function fillSelect(id, items) {
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = items
        .map(i => `<option value="${i}">${i}</option>`)
        .join('');
}

// ================= SLIDER =================
function startSlider(images) {
    if (!images || images.length < 2) return;

    const img = document.getElementById('pImg');
    if (!img) return;

    clearInterval(sliderInterval);
    currentImgIndex = 0;

    sliderInterval = setInterval(() => {
        img.style.opacity = 0;

        setTimeout(() => {
            currentImgIndex = (currentImgIndex + 1) % images.length;
            img.src = images[currentImgIndex];
            img.style.opacity = 1;
        }, 400);

    }, 3500);
}

// ================= CART =================
function addToCart() {
    const product = getProductFromURL();
    if (!product) return;

    const item = {
        name: product.name,
        size: document.getElementById('pSize')?.value || '',
        option: document.getElementById('pOpt')?.value || '',
        notes: document.getElementById('pNotes')?.value || '',
        image: product.images[0],
        time: Date.now()
    };

    cart.push(item);
    saveCart();
    updateBadge();

    alert(`تمت إضافة ${product.name} للسلة`);
}

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.innerText = cart.length;
}

function clearCart() {
    cart = [];
    saveCart();
    updateBadge();
}

// ================= GOOGLE SHEETS =================
async function submitToSheet() {
    const name = document.getElementById('userName')?.value;
    const phone = document.getElementById('userPhone')?.value;
    const notes = document.getElementById('userNotes')?.value;

    if (!name || !phone) {
        alert("يرجى إدخال الاسم ورقم الهاتف");
        return;
    }

    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                phone,
                notes,
                items: cart
            })
        });

        alert("تم إرسال الطلب بنجاح");
        clearCart();
    } catch (err) {
        console.error(err);
        alert("حدث خطأ أثناء الإرسال");
    }
}

// ================= WHATSAPP =================
function submitToWhatsApp() {
    const name = document.getElementById('userName')?.value;
    const phone = document.getElementById('userPhone')?.value;

    if (!name || !phone) {
        alert("يرجى إدخال الاسم ورقم الهاتف");
        return;
    }

    let msg = `طلب جديد%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0A%0Aالطلبات:%0A`;

    cart.forEach(i => {
        msg += `- ${i.name} (${i.size} | ${i.option})%0A`;
        if (i.notes) msg += `ملاحظات: ${i.notes}%0A`;
    });

    window.open(`https://wa.me/201111049778?text=${msg}`, '_blank');
}
