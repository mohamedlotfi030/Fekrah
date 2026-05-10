const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxinmklrPYvqyYQxf0zjnWalmXtyrlsA_c9JWqbHWJoJdRrohtLtcL1Geo208xG75aT/exec';

let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];

function toggleCart(show) {
    const sidebar = document.getElementById('sidebar');
    if(show) sidebar.classList.add('open');
    else sidebar.classList.remove('open');
    renderCart();
}

function updateBadge() {
    document.getElementById('cartBadge').innerText = cart.length;
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    const form = document.getElementById('checkoutFormContainer');
    
    if(cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; margin-top:20px;">السلة فارغة</p>';
        form.style.display = 'none';
    } else {
        list.innerHTML = cart.map((item, index) => `
            <div style="background:#1a1a1a; padding:15px; border-radius:10px; margin-bottom:10px; display:flex; justify-content:space-between;">
                <div><strong>${item.name}</strong><br><small>${item.size} | ${item.option}</small></div>
                <span onclick="removeItem(${index})" style="color:red; cursor:pointer; font-size:1.5rem;">&times;</span>
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

function submitToSheet() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    if(!name || !phone) return alert("يرجى إكمال البيانات");

    document.getElementById('sheetBtn').innerText = "جاري الإرسال...";
    
    fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ name, phone, notes: document.getElementById('userNotes').value, details: cart })
    }).then(() => {
        alert("تم استلام طلبك بنجاح عبر الموقع!");
        clearCart();
    });
}

function submitToWhatsApp() {
    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    if(!name || !phone) return alert("يرجى إكمال البيانات");

    let msg = `*طلب جديد من الموقع*%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0A%0A*المنتجات:*%0A`;
    cart.forEach(i => msg += `- ${i.name} (${i.size} | ${i.option})%0A`);

    window.open(`https://wa.me/201111049778?text=${encodeURIComponent(msg)}`, '_blank');
    clearCart();
}

function clearCart() {
    localStorage.removeItem('fekra_cart');
    location.reload();
}

// تحديث العداد عند التحميل
document.addEventListener('DOMContentLoaded', updateBadge);
