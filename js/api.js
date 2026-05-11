const API = {
    WHATSAPP_NUM: "201275209778",

    sendOrder(customerName, customerPhone) {
        if (Cart.items.length === 0) {
            alert("السلة فارغة حالياً!");
            return;
        }

        let msg = `*طلب جديد من موقع فكرة للدعاية*%0A`;
        msg += `👤 *العميل:* ${customerName}%0A`;
        msg += `📞 *الهاتف:* ${customerPhone}%0A`;
        msg += `--------------------------%0A`;

        Cart.items.forEach((item, index) => {
            msg += `*${index + 1}. ${item.name}*%0A`;
            msg += `المقاس: ${item.size} | النوع: ${item.option}%0A%0A`;
        });

        msg += `--------------------------`;
        
        window.open(`https://wa.me/${this.WHATSAPP_NUM}?text=${msg}`, '_blank');
    }
};
