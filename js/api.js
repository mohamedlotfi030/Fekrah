const API = {
    WHATSAPP_NUM: "201111049778", 
    // الرابط الجديد الذي زودتني به
    GOOGLE_SHEET_URL: "https://script.google.com/macros/s/AKfycbxDGCUYlIeIFROBJLV9un3DcAj7jI6FEB_9wFBb4U_fF-Nni9zBIjUtyAC85a5fCcHd/exec",

    async sendOrder(customerName, customerPhone) {
        if (Cart.items.length === 0) {
            alert("السلة فارغة حالياً!");
            return;
        }

        const orderData = {
            customer: customerName,
            phone: customerPhone,
            items: Cart.items,
            date: new Date().toLocaleString('ar-EG')
        };

        // 1. إرسال البيانات إلى Google Sheets والإيميل
        // نستخدم mode: 'no-cors' لتجنب مشاكل المتصفح عند الإرسال لسكريبت جوجل
        try {
            fetch(this.GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
        } catch (e) {
            console.error("خطأ في الإرسال للنظام:", e);
        }

        // 2. تحويل العميل إلى الواتساب (الإجراء الأساسي)
        let msg = `*طلب جديد من موقع فكرة للدعاية*%0A`;
        msg += `👤 *العميل:* ${customerName}%0A`;
        msg += `📞 *الهاتف:* ${customerPhone}%0A`;
        msg += `--------------------------%0A`;

        Cart.items.forEach((item, index) => {
            msg += `*${index + 1}. ${item.name}*%0A`;
            msg += `المقاس: ${item.size} | النوع: ${item.option}%0A%0A`;
        });

        msg += `--------------------------`;
        
        // فتح الواتساب في نافذة جديدة
        window.open(`https://wa.me/${this.WHATSAPP_NUM}?text=${msg}`, '_blank');
        
        // مسح السلة بعد نجاح الطلب
        Cart.clear();
    }
};
