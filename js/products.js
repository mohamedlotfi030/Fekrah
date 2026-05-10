const Products = {
    'tshirt': {
        id: "tshirt",
        name: "تيشيرت قطن فاخر",
        images: ["tshirt-main.png"], // بما أنها في المسار الرئيسي الآن
        options: {
            sizes: ["S", "M", "L", "XL", "XXL"],
            types: ["طباعة DTF", "تطريز"]
        }
    },
    'rollup': {
        id: "rollup",
        name: "رول أب ستاند",
        images: ["rollup-1.jpg"],
        options: {
            sizes: ["80×200 سم", "100×200 سم"],
            types: ["مستورد ثقيل", "فاخر"]
        }
    },
    'bcard': {
        id: "bcard",
        name: "كروت شخصية",
        images: ["business-card-1.jpg"],
        options: {
            sizes: ["9x5 سم"],
            types: ["كوشيه مط", "سلوفان"]
        }
    }
    // يمكنك إضافة باقي المنتجات بنفس الطريقة
};
