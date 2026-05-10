const webAppUrl = 'https://script.google.com/macros/s/AKfycbwGlYFY7fOGWTUK7dxy10ZNgSoWFNI8Ft0D4BDopR9lm7WgeasSznO5R4XGmaUUHTxr5A/exec';

function submitOrder(orderData) {
    fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors', // مهم جداً لتجنب مشاكل الـ CORS
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        alert('تم إرسال طلبك بنجاح لشركة فكرة! سنتواصل معك قريباً.');
        localStorage.removeItem('fekra_cart');
        window.location.reload();
    })
    .catch(error => console.error('Error:', error));
}
