const API = {
    WHATSAPP_NUM: "201275209778",

    async sendOrder(customerData) {
        const order = {
            customer: customerData,
            items: Cart.items,
            timestamp: new Date().toLocaleString()
        };

        // 1. WhatsApp Flow
        let msg = `*طلب جديد من متجر فكرة*%0A`;
        msg += `👤 *العميل:* ${order.customer.name}%0A`;
        msg += `📞 *الهاتف:* ${order.customer.phone}%0A%0A`;
        msg += `🛒 *المنتجات:*%0A`;
        order.items.forEach((item, i) => {
            msg += `${i+1}. ${item.name} (${item.size})%0A`;
        });

        window.open(`https://wa.me/${this.WHATSAPP_NUM}?text=${msg}`, '_blank');

        // 2. Google Sheets Flow (Optional)
        // await fetch(WEB_APP_URL, { method: 'POST', body: JSON.stringify(order) });
    }
};