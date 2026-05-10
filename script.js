const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';

// ================= PRODUCTS =================
const config = {
    tshirt: {
        name: 'تيشيرت قطن فاخر',
        desc: 'تيشيرت 100% قطن بطباعة عالية الجودة',
        images: [
            'tshirt-main.png',
            'tshirt-1.png',
            'tshirt-2.png',
            'tshirt-3.png'
        ],
        sizes: ['S','M','L','XL','XXL','3XL','4XL'],
        opts: ['DTF', 'تطريز', 'فينيل', 'بدون طباعة']
    },

    bcard: {
        name: 'كروت شخصية',
        desc: 'كروت احترافية بجودة عالية',
        images: [
            'business-card-1.jpg',
            'business-card-2.jpg',
            'business-card-3.png'
        ],
        sizes: ['9×5', '8.5×5.5', 'مربع'],
        opts: ['مط', 'لامع', 'UV', 'شفاف']
    },

    mug: {
        name: 'مج سيراميك',
        images: [
            'mug-main.jpg',
            'mug-1.jpg',
            'mug-2.jpg'
        ],
        sizes: ['11oz', '15oz'],
        opts: ['أبيض', 'سحري', 'ملون']
    },

    rollup: {
        name: 'رول أب ستاند',
        images: [
            'rollup-1.jpg',
            'rollup-2.jpg',
            'rollup-3.jpg',
            'rollup-4.jpg'
        ],
        sizes: ['80×200', '85×200', '100×200'],
        opts: ['ستاند مستورد', 'ستاند ثقيل']
    },

    xbanner: {
        name: 'X Banner',
        images: [
            'x-banner-1.jpg',
            'x-banner-2.jpg',
            'x-banner-3.jpg',
            'x-banner-4.jpg'
        ],
        sizes: ['60×160', '80×180'],
        opts: ['بنر', 'جلوسي + لامنيشن']
    }
};

// ================= STATE =================
let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
let currentImgIndex = 0;
let sliderInterval = null;

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
    updateBadge();
    renderCart();
});

// ================= PRODUCT LOAD =================
function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');

    const product = config[type];
    if (!product) return;

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el && value) el.innerText = value;
    };

    set('pTitle', product.name);
    set('pDesc', product.desc);

    const img = document.getElementById('pImg');
    if (img) img.src = product.images[0];

    fillSelect('pSize', product.sizes);
    fillSelect('pOpt', product.opts);

    startSlider(product.images);
}

// ================= SELECT =================
function fillSelect(id, arr) {
    const el = document.getElementById(id);
    if (!el) return;

    el.innerHTML = arr.map(i => `<option value="${i}">${i}</option>`).join('');
}

// ================= SLIDER =================
function startSlider(images) {
    const img = document.getElementById('pImg');
    if (!img || images.length < 2) return;

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
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const product = config[type];

    if (!product) return;

    const item = {
        name: product.name,
        size: document.getElementById('pSize')?.value || '',
        option: document.getElementById('pOpt')?.value || '',
        notes: document.getElementById('pNotes')?.value || '',
        image: product.images[0]
    };

    cart.push(item);
    saveCart();
    updateBadge();
    renderCart();

    alert('تمت إضافة المنتج للسلة');
}

// ================= CART RENDER =================
function renderCart() {
    const box = document.getElementById('cartItemsList');
    if (!box) return;

    if (cart.length === 0) {
        box.innerHTML = `<p style="text-align:center;color:#777">السلة فارغة</p>`;
        return;
    }

    box.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
            <img src="${item.image}" width="50">
            <div style="flex:1;padding:0 10px;">
                <h4>${item.name}</h4>
                <small>${item.size} | ${item.option}</small>
                <p style="font-size:12px;color:#888">${item.notes || ''}</p>
            </div>
            <button onclick="removeItem(${i})">X</button>
        </div>
    `).join('');
}

// ================= REMOVE =================
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateBadge();
    renderCart();
}

// ================= STORAGE =================
function saveCart() {
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
}

function clearCart() {
    cart = [];
    saveCart();
    updateBadge();
    renderCart();
}

// ================= BADGE =================
function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) badge.innerText = cart.length;
}

// ================= CART TOGGLE =================
function toggleCart(open) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    if (open) {
        sidebar.classList.add('open');
        renderCart();
    } else {
        sidebar.classList.remove('open');
    }
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
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                phone,
                notes,
                items: cart
            })
        });

        alert("تم إرسال الطلب بنجاح");
        clearCart();

    } catch (e) {
        alert("حدث خطأ أثناء الإرسال");
        console.log(e);
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

    let msg = `طلب جديد%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0A%0A`;

    cart.forEach(i => {
        msg += `- ${i.name} (${i.size} | ${i.option})%0A`;
        if (i.notes) msg += `ملاحظات: ${i.notes}%0A`;
    });

    window.open(`https://wa.me/201111049778?text=${msg}`, '_blank');
}
