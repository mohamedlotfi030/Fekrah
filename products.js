const Products = {
    tshirt: {
        id: "tshirt",
        name: "تيشيرت قطن فاخر",
        images: ["assets/images/tshirt-1.png"],
        options: {
            sizes: ["S", "M", "L", "XL", "XXL"],
            types: ["طباعة DTF", "تطريز كمبيوتر", "فيلكس"]
        },
        basePrice: 150 // اختياري
    },
    rollup: {
        id: "rollup",
        name: "رول أب ستاند",
        images: ["assets/images/rollup.png"],
        options: {
            sizes: ["80×200 سم", "100×200 سم"],
            types: ["مستورد ثقيل", "محلي"]
        },
        basePrice: 450
    },
    // أضف باقي المنتجات بنفس النمط...
};
