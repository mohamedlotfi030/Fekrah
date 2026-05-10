const API = {
    WHATSAPP_NUM: "201275209778", // رقمك المحدث

    async sendOrder(customerName, customerPhone) {
        if (Cart.items.length === 0) {
            alert("السلة فارغة!");
            return;
        }

        // تجهيز نص الرسالة للواتساب
        let message = `*طلب جديد من موقع فكرة*%0A`;
        message += `--------------------------%0A`;
        message += `👤 *العميل:* ${customerName}%0A`;
        message += `📞 *الهاتف:* ${customerPhone}%0A`;
        message += `🛒 *المنتجات:*%0A`;

        Cart.items.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*%0A`;
            message += `   - المقاس: ${item.size}%0A`;
            message += `   - النوع: ${item.option}%0A`;
        });

        message += `--------------------------%0A`;
        message += `📌 إجمالي القطع: ${Cart.items.length}`;

        // رابط الواتساب المباشر
        const waLink = `https://wa.me/${this.WHATSAPP_NUM}?text=${message}`;
        
        // فتح الواتساب في نافذة جديدة
        window.open(waLink, '_blank');

        // اختياري: تفريغ السلة بعد الطلب
        // Cart.clear();
    }
};
