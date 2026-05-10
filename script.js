// إضافة المنتج للسلة
function add() {
    let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
    cart.push({
        name: p.name,
        size: document.getElementById('sizeSelect').value,
        opt: document.getElementById('optSelect').value,
        notes: document.getElementById('custNotes').value
    });
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    document.getElementById('cartBadge').innerText = cart.length;

    // فتح السلة
    document.getElementById('cartSidebar').classList.add('open');
    renderCart();
}

// عرض السلة
function renderCart() {
    let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
    const list = document.getElementById('cartList');
    list.innerHTML = cart.map((i, idx) => 
        `<div class="cart-item">
            <span>${i.name} - ${i.size} - ${i.opt} ${i.notes ? ' | ملاحظات: ' + i.notes : ''}</span>
            <button onclick="del(${idx})" style="color:red; background:none; border:none;">حذف</button>
        </div>`
    ).join('');
}

// حذف عنصر من السلة
function del(i) {
    let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
    cart.splice(i,1);
    localStorage.setItem('fekra_cart', JSON.stringify(cart));
    renderCart();
}

// إرسال الطلب
document.getElementById('orderForm').onsubmit = function(e) {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
    const data = {
        name: document.getElementById('custName').value,
        phone: document.getElementById('custPhone').value,
        notes: document.getElementById('custNotes').value,
        items: JSON.stringify(cart)
    };

    // إظهار رسالة جارٍ الإرسال
    const status = document.getElementById('statusMsg');
    status.className = "status-msg sending";
    status.innerText = "جارٍ الإرسال...";
    status.style.display = "block";

    // إرسال إلى Google Sheets
    fetch('YOUR_GOOGLE_SCRIPT_URL', { method: 'POST', body: JSON.stringify(data) })
    .then(() => {
        status.className = "status-msg success";
        status.innerText = "✅ تم تقديم الطلب بنجاح";
        localStorage.removeItem('fekra_cart');
        document.getElementById('cartBadge').innerText = 0;
    });
};
