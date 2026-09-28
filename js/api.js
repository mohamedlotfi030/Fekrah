const API = {
    WHATSAPP_NUM: "201111049778",
    GOOGLE_SHEET_URL: "https://script.google.com/macros/s/AKfycbxDGCUYlIeIFROBJLV9un3DcAj7jI6FEB_9wFBb4U_fF-Nni9zBIjUtyAC85a5fCcHd/exec",

    // دالة لإرسال البيانات فقط لجوجل شيت
    async submitToSheet(customerName, customerPhone) {
        const items = JSON.parse(localStorage.getItem('fekra_cart')) || [];
        if (items.length === 0) return false;

        const orderData = {
            customer: customerName,
            phone: customerPhone,
            items: items,
            date: new Date().toLocaleString('ar-EG'),
            type: "طلب موقع (بدون واتساب)"
        };

        try {
            await fetch(this.GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(orderData)
            });
            return true;
        } catch (e) {
            console.error("خطأ في جوجل شيت", e);
            return false;
        }
    },

    // دالة لإرسال البيانات + فتح الواتساب
    async sendOrderWhatsApp(customerName, customerPhone) {
        const items = JSON.parse(localStorage.getItem('fekra_cart')) || [];
        
        // إرسال لجوجل شيت أولاً للتوثيق
        this.submitToSheet(customerName, customerPhone);

        // تجهيز رسالة الواتساب
        let msg = `*طلب جديد من الموقع*%0A👤 العميل: ${customerName}%0A📞 الهاتف: ${customerPhone}%0A%0A`;
        items.forEach((item, i) => {
            msg += `${i+1}. *${item.name}*%0A📏 المقاس: ${item.size} | النوع: ${item.option}%0A%0A`;
        });

        window.location.href = `https://api.whatsapp.com/send?phone=${this.WHATSAPP_NUM}&text=${msg}`;
        localStorage.removeItem('fekra_cart');
    }
};
