// نظام العروض الديناميكي حسب نوع المنتج
function updateOfferMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productType = urlParams.get('type');
    const offerElement = document.getElementById('dynamic-offer');

    if (offerElement) {
        let productName = "";
        switch(productType) {
            case 'tshirt': productName = "التيشيرتات المخصصة"; break;
            case 'bcard': productName = "الكروت الشخصية"; break;
            case 'rollup': productName = "الرول أب الإعلاني"; break;
            default: productName = "منتجاتنا";
        }
        offerElement.innerText = `لمعرفة العروض المقدمة على ${productName}، يرجى التواصل عبر الواتساب.`;
    }
}

// تنفيذ الوظائف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateOfferMessage();
    
    // برمجة زر طلب عاجل لفتح الواتساب مباشرة
    const urgentBtn = document.querySelector('.urgent-btn');
    urgentBtn.addEventListener('click', () => {
        window.open('https://wa.me/201000000000?text=أريد طلب عاجل', '_blank');
    });
});
