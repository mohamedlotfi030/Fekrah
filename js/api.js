const API = {
    WHATSAPP_NUM: "201111049778", // الرقم المحدث من الصورة
    GOOGLE_SHEET_URL: "https://script.google.com/macros/s/AKfycbxDGCUYlIeIFROBJLV9un3DcAj7jI6FEB_9wFBb4U_fF-Nni9zBIjUtyAC85a5fCcHd/exec",

    async sendOrder(customerName, customerPhone) {
        const items = JSON.parse(localStorage.getItem('fekra_cart')) || [];
        if (items.length === 0) return alert("السلة فارغة!");

        const orderData = {
            customer: customerName,
            phone: customerPhone,
            items: items,
            date: new Date().toLocaleString('ar-EG')
        };

        // 1. إرسال البيانات لجوجل شيت (بدون انتظار الرد لسرعة التوجيه)
        fetch(this.GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            body: JSON.stringify(orderData)
        });

        // 2. تجهيز رسالة الواتساب
        let msg = `*طلب جديد من الموقع*%0A👤 العميل: ${customerName}%0A📞 الهاتف: ${customerPhone}%0A%0A`;
        items.forEach((item, i) => {
            msg += `${i+1}. *${item.name}*%0A📏 المقاس: ${item.size}%0A🛠️ النوع: ${item.option}%0A%0A`;
        });

        // 3. التوجيه للواتساب
        const waUrl = `https://api.whatsapp.com/send?phone=${this.WHATSAPP_NUM}&text=${msg}`;
        
        // مسح السلة والتوجيه
        localStorage.removeItem('fekra_cart');
        window.location.href = waUrl;
    }
};
