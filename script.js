const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwGlYFY7fOGWTUK7dxy10ZNgSoWFNI8Ft0D4BDopR9lm7WgeasSznO5R4XGmaUUHTxr5A/exec';

const config = {
    'tshirt': { name: 'التيشيرتات', img: 'T-shirt.png', sizes: ['S','M','L','XL','XXL'], opts: ['DTF حراري','تطريز'] },
    'bcard': { name: 'الكروت الشخصية', img: 'B-card.jpg', sizes: ['9x5 سم'], opts: ['كوشيه مط','سلوفان'] },
    'mug': { name: 'المج الحراري', img: 'mug.jpg', sizes: ['ستاندرد'], opts: ['سحري','يد قلب'] },
    'carsunshade': { name: 'شمسية سيارة', img: 'Car Sunshad.jpeg', sizes: ['مقاس حر'], opts: ['طباعة كاملة'] }
};

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];

function updateBadge() {
    const badge = document.getElementById('cartBadge');
    if(badge) badge.innerText = cart.length;
}

function toggleCart(show) {
    document.getElementById('sidebar').classList.toggle('open', show);
    if(show) renderCart();
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    const form = document.getElementById('checkoutFormContainer');
    
    if(cart.length === 0) {
        list.innerHTML = '<p style="text-align:center;">السلة فارغة</p>';
        form.style.display = 'none';
    } else {
        list.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div><strong>${item.name}</strong><br><small>${item.size} | ${item.option}</small></div>
                <span onclick="removeItem(${index})" style="color:red; cursor:pointer;">&times;</span>
            </div>
        `).join('');
        form.style.display = 'block';
    }
    updateBadge();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    renderCart();
}

// إرسال لجوجل شيت
function submitToSheet() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    if(!name || !phone) return alert("أدخل بياناتك");

    const btn = document.getElementById('sheetBtn');
    btn.disabled = true; btn.innerText = "جاري الحفظ...";

    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ name, phone, notes: document.getElementById('userNotes').value, details: cart })
    }).then(() => {
        alert("تم استلام طلبك بنجاح!");
        clearCart();
    });
}

// إرسال للواتساب
function submitToWhatsApp() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    if(!name || !phone) return alert("أدخل بياناتك");

    let msg = `*طلب جديد من الموقع*%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0A%0A*المنتجات:*%0A`;
    cart.forEach(i => msg += `- ${i.name} (${i.size} | ${i.option})%0A`);

    window.open(`https://wa.me/201111049778?text=${msg}`, '_blank');
    clearCart();
}

function clearCart() {
    localStorage.removeItem('fekra_cart');
    location.reload();
}

document.addEventListener('DOMContentLoaded', updateBadge);
