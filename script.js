// إعدادات المنتجات
const config = {
    'tshirt': { name: 'التيشيرتات', img: 'T-shirt.png', sizes: ['S','M','L','XL','XXL','XXXL'], opts: ['DTF حراري','تطريز كمبيوتر'] },
    'bcard': { name: 'الكروت الشخصية', img: 'B-card.jpg', sizes: ['9x5 سم'], opts: ['كوشيه - وجه واحد','كوشيه - وجهين','فيرانو','سلوفان مط','سلوفان لامع'] },
    'rollup': { name: 'الرول أب', img: 'roll-up.jpg', sizes: ['80x200','100x200'], opts: ['إن دور عالية الجودة','لامينشن مط','لامينشن لامع'] },
    'mug': { name: 'المج (الكوب)', img: 'mug.jpg', sizes: ['11 أونصة'], opts: ['يد قلب','سحري','ملون من الداخل'] },
    'xbanr': { name: 'اكس بانر', img: 'X-banr.png', sizes: ['60x160','80x180'], opts: ['خامات مستوردة'] },
    'bloknote': { name: 'البلوك نوت', img: 'bloknote.png', sizes: ['A4','A5','A6'], opts: ['تجليد علوي','تجليد جانبي'] },
    'popup': { name: 'البوب أب كونتر', img: 'pop-up-counter.png', sizes: ['80 سم'], opts: ['هيكل ألمنيوم + لمنيشن'] },
    'banar': { name: 'البانر', img: 'banar.png', sizes: ['مقاس حر'], opts: ['أوت دور'] }
};

// تحميل بيانات المنتج حسب الرابط
const type = new URLSearchParams(window.location.search).get('type');
if(type && config[type]) {
    const p = config[type];
    document.getElementById('pTitle').innerText = p.name;
    document.getElementById('pImg').src = p.img;
    p.sizes.forEach(s => document.getElementById('sizeSelect').innerHTML += `<option>${s}</option>`);
    p.opts.forEach(o => document.getElementById('optSelect').innerHTML += `<option>${o}</option>`);
}

// حركة الصورة عند تغيير الخيار
function changeImage(option) {
    const img = document.getElementById('pImg');
    img.classList.add('fade');
    setTimeout(() => {
        img.src = config[type].img; 
        img.classList.remove('fade');
    }, 300);
}

// إضافة المنتج للسلة
function add() {
    let cart = JSON.parse(localStorage.getItem('fekra_cart')) || [];
    cart.push({
        name: config[type].name,
        size: document.get
