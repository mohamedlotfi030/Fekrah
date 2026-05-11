const API = {
    WHATSAPP_NUM: "201111049778",
    GOOGLE_SHEET_URL: "https://script.google.com/macros/s/AKfycbxDGCUYlIeIFROBJLV9un3DcAj7jI6FEB_9wFBb4U_fF-Nni9zBIjUtyAC85a5fCcHd/exec",

    async sendOrder(customerName, customerPhone) {
        if (Cart.items.length === 0) return;

        const orderData = {
            customer: customerName,
            phone: customerPhone,
            items: Cart.items,
            date: new Date().toLocaleString('ar-EG')
        };

        // إرسال البيانات لجوجل شيت في الخلفية
        fetch(this.GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(orderData)
        });

        // رسالة الواتساب
        let msg = `*طلب جديد من الموقع*%0A👤 العميل: ${customerName}%0A📞 الهاتف: ${customerPhone}%0A%0A`;
        Cart.items.forEach((item, i) => {
            msg += `${i+1}. *${item.name}*%0Aالمقاس: ${item.size} | النوع: ${item.option}%0A%0A`;
        });

        window.open(`https://wa.me/${this.WHATSAPP_NUM}?text=${msg}`, '_blank');
        Cart.clear();
        window.location.href = 'index.html';
    }
};
