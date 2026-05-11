const Products = {
    'tshirt': {
        id: "tshirt",
        name: "تيشيرت قطن فاخر",
        images: [
            "assets/images/tshirt-main.png", "assets/images/tshirt-1.png", "assets/images/tshirt-2.png",
            "assets/images/tshirt-3.png", "assets/images/tshirt-4.png", "assets/images/tshirt-5.png",
            "assets/images/tshirt-6.png", "assets/images/tshirt-7.png", "assets/images/tshirt-8.png",
            "assets/images/tshirt-9.png", "assets/images/tshirt-10.png"
        ],
        options: {
            sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
            types: ["طباعة DTF", "تطريز كمبيوتر", "فينيل حراري"]
        }
    },
    'rollup': {
        id: "rollup",
        name: "رول أب ستاند",
        images: [
            "assets/images/rollup-1.jpg", "assets/images/rollup-2.jpg", 
            "assets/images/rollup-3.jpg", "assets/images/rollup-4.jpg"
        ],
        options: {
            sizes: ["60×160 سم", "80×200 سم", "100×200 سم", "120×200 سم", "150×200 سم"],
            types: ["مستورد ثقيل", "محلي اقتصادي", "فاخر مجهز"]
        }
    },
    'xbanner': {
        id: "xbanner",
        name: "إكس بانر ستاند",
        images: ["assets/images/x-banner-1.jpg", "assets/images/x-banner-2.jpg", "assets/images/x-banner-3.jpg"],
        options: { sizes: ["60×160 سم", "80×180 سم"], types: ["هيكل كربون", "هيكل حديد"] }
    },
    'bcard': {
        id: "bcard",
        name: "كروت شخصية",
        images: ["assets/images/business-card-1.jpg", "assets/images/business-card-2.jpg", "assets/images/business-card-3.png"],
        options: { sizes: ["9×5 سم"], types: ["سلوفان مط", "سلوفان لامع", "يو في بارز"] }
    },
    'mug': {
        id: "mug",
        name: "المج الحراري",
        images: ["assets/images/mug-main.jpg", "assets/images/mug-1.jpg", "assets/images/mug-2.jpg"],
        options: { sizes: ["قياسي"], types: ["سيراميك أبيض", "سحري"] }
    },
    'bloknote': {
        id: "bloknote",
        name: "بلوك نوت (مفكرة)",
        images: ["assets/images/bloknote.jpg", "assets/images/bloknote-2.jpg", "assets/images/bloknote-3.jpg"],
        options: { sizes: ["A5", "A6"], types: ["سلك حلزوني", "لصق حراري"] }
    },
    'popupcounter': {
        id: "popupcounter",
        name: "بوب أب كاونتر",
        images: ["assets/images/pop-up-counter.png", "assets/images/pop-up-counter-2.png", "assets/images/pop-up-counter-3.jpg", "assets/images/pop-up-counter-4.jpg"],
        options: { sizes: ["قياسي"], types: ["بي في سي مع طباعة", "بي في سي بدون طباعة"] }
    }
};
