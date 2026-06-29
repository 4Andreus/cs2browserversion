// ==========================================================================
// 1. ГЛОБАЛЬНІ ДАНІ ГРИ, НАЛАШТУВАННЯ ТА ШАНСИ
// ==========================================================================
// ==========================================================================
// СИСТЕМА ЛОКАЛІЗАЦІЇ
// ==========================================================================
let currentLang = 'en';

const i18n = {
    en: {
        btn_play:       "ENTER MATCH (3D)",
        btn_shop:       "CASE SHOP",
        btn_inventory:  "WEAPON INVENTORY",
        btn_back:       "Back",
        btn_back_select:"Back to selection",
        btn_back_menu:  "Back to menu",
        btn_buy:        "Buy & Open",
        btn_take:       "TAKE",
        btn_exit:       "Exit",
        balance:        "Balance",
        your_balance:   "Your balance",
        enemies:        "Enemies",
        weapon:         "Weapon",
        you_got:        "YOU GOT:",
        settings_title: "SETTINGS",
        vol_label:      "Shot volume",
        sens_label:     "Mouse sensitivity",
        lang_label:     "Language",
        btn_back_inv:   "Back",
        controls_title: "Controls:",
        controls_text:  "WASD — Move | Space (hold) — Jump<br>Mouse — Look | Left Click — Shoot",
        win_alert:      "All targets eliminated! Bonus: +$200 (Total: +$250)",
        tooltip_title:  "Skins in case:",
        rarity_1: "Legendary", rarity_2: "Mythical", rarity_3: "Epic", rarity_4: "Rare", rarity_5: "Common",
        standard: "Standard",
        profile_title: "Your Profile",
        profile_id: "ID:",
        btn_change: "Change",
        nick_prompt: "Enter new nickname:",
        equip_btn:      "Equip",
        equipped:       "Equipped",
        no_money:       "No money",
    },
    uk: {
        btn_play:       "УВІЙТИ В МАТЧ (3D)",
        btn_shop:       "МАГАЗИН КЕЙСІВ",
        btn_inventory:  "ІНВЕНТАР ЗБРОЇ",
        btn_back:       "Назад",
        btn_back_select:"Назад до вибору",
        btn_back_menu:  "Назад до меню",
        btn_buy:        "Купити & Відкрити",
        btn_take:       "ЗАБРАТИ",
        btn_exit:       "Вийти",
        balance:        "Баланс",
        your_balance:   "Твій баланс",
        enemies:        "Супротивники",
        weapon:         "Зброя",
        you_got:        "ВИ ВИБИЛИ:",
        settings_title: "НАЛАШТУВАННЯ",
        vol_label:      "Гучність пострілу",
        sens_label:     "Чутливість миші",
        lang_label:     "Мова",
        btn_back_inv:   "Назад",
        controls_title: "Управління:",
        controls_text:  "WASD — Рух | Пробіл (затиснути) — Стрибки<br>Мишка — Огляд | Лівий Клік — Стріляти",
        win_alert:      "Всі цілі ліквідовані! Бонус: +$200 (Всього: +$250)",
        tooltip_title:  "Скіни в кейсі:",
        rarity_1: "Легендарний", rarity_2: "Міфічний", rarity_3: "Епічний", rarity_4: "Рідкісний", rarity_5: "Звичайний",
        standard: "Стандарт",
        profile_title: "Ваш профіль",
        profile_id: "ІД:",
        btn_change: "Змінити",
        nick_prompt: "Введіть новий нікнейм:",
        equip_btn:      "Взяти",
        equipped:       "Екіпіровано",
        no_money:       "Немає грошей",
    },
    ru: {
        btn_play:       "ВОЙТИ В МАЧ (3D)",
        btn_shop:       "МАГАЗИН КЕЙСОВ",
        btn_inventory:  "ИНВЕНТАРЬ ОРУЖИЯ",
        btn_back:       "Назад",
        btn_back_select:"Назад к выбору",
        btn_back_menu:  "Назад в меню",
        btn_buy:        "Купить & Открыть",
        btn_take:       "ЗАБРАТЬ",
        btn_exit:       "Выйти",
        balance:        "Баланс",
        your_balance:   "Твой баланс",
        enemies:        "Противники",
        weapon:         "Оружие",
        you_got:        "ВЫ ПОЛУЧИЛИ:",
        settings_title: "НАСТРОЙКИ",
        vol_label:      "Громкость выстрела",
        sens_label:     "Чувствительность мыши",
        lang_label:     "Язык",
        btn_back_inv:   "Назад",
        controls_title: "Управление:",
        controls_text:  "WASD — Движение | Пробел (держать) — Прыжки<br>Мышь — Обзор | Левый Клик — Стрелять",
        win_alert:      "Все цели ликвидированы! Бонус: +$200 (Итого: +$250)",
        tooltip_title:  "Скины в кейсе:",
        rarity_1: "Легендарный", rarity_2: "Мифический", rarity_3: "Эпический", rarity_4: "Редкий", rarity_5: "Обычный",
        standard: "Стандарт",
        profile_title: "Ваш профіль",
        profile_id: "ІД:",
        btn_change: "Змінити",
        nick_prompt: "Введіть новий нікнейм:",
        equip_btn:      "Взять",
        equipped:       "Экипировано",
        no_money:       "Нет денег",
    }
};

function t(key) {
    return (i18n[currentLang] && i18n[currentLang][key]) || i18n['en'][key] || key;
}

function setLanguage(lang) {
    currentLang = lang;
    // Підсвічуємо активну кнопку мови
    ['en','uk','ru'].forEach(l => {
        const btn = document.getElementById('lang-' + l);
        if (btn) btn.style.background = (l === lang) ? '#fff' : '';
    });
    // Оновлюємо всі елементи з data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key === 'controls_text') {
            el.innerHTML = t(key);
        } else {
            el.textContent = t(key);
        }
    });
    // Оновлюємо динамічні UI
    updateBalanceUI();
    if (document.getElementById('inventory-screen') &&
        !document.getElementById('inventory-screen').classList.contains('hidden')) {
        updateInventoryUI();
    }
}

let balance = 500; 
let inventory = ["Glock-18 | Стандарт"]; 
let activeWeapon = "Glock-18 | Стандарт"; 
let selectedCase = null; 

// Налаштування рідкостей (Сума шансів: 3+12+15+25+45 = 100%)
const raritySettings = {
    "#d4af37": { order: 1, nameKey: "rarity_1", name: "Legendary", chance: 3 },  // Жовтий
    "#ff4500": { order: 2, nameKey: "rarity_2", name: "Mythical", chance: 12 }, // Червоний
    "#800080": { order: 3, nameKey: "rarity_3", name: "Epic", chance: 15 }, // Фіолетовий
    "#4a6cd1": { order: 4, nameKey: "rarity_4", name: "Rare",   chance: 25 }, // Тусклий Синій
    "#4caf50": { order: 5, nameKey: "rarity_5", name: "Common",   chance: 45 }  // Зелений
};

const casesData = [
    {
        id: "weapon-case",
        name: "Weapon Case",
        price: 100,
        image: "images/weaponcase.png",
        skins: [
            { name: "P250 | Sand Dune", color: "#4caf50", modelColor: 0x8b8c7a, img: "images/p250sanddune.png" },
            { name: "Galil AR | Kami", color: "#4a6cd1", modelColor: 0x555555, img: "images/galilarkami.png" },
            { name: "AK-47 | Redline", color: "#800080", modelColor: 0xcc1111, img: "images/ak47redline.png" },
            { name: "M4A4 | Howl", color: "#ff4500", modelColor: 0xff6600, img: "images/m4a4howl.png" },
            { name: "AWP | Dragon Lore", color: "#d4af37", modelColor: 0xd4af37, img: "images/awpdragonlore.png" }
        ]
    },
    {
        id: "prisma-case",
        name: "Prisma Case",
        price: 120,
        image: "images/prismacase.png",
        skins: [
            { name: "P90 | Grim", color: "#4caf50", modelColor: 0x445544, img: "images/p90grim.png" },
            { name: "Desert Eagle | Light Rail", color: "#4a6cd1", modelColor: 0xaaaaaa, img: "images/deserteaglelightrail.png" },
            { name: "AWP | Atheris", color: "#800080", modelColor: 0x11aa55, img: "images/awpatheris.png" },
            { name: "Five-SeveN | Angry Mob", color: "#ff4500", modelColor: 0xddaa00, img: "images/fivesevenangrymob.png" },
            { name: "M4A4 | The Emperor", color: "#d4af37", modelColor: 0x2244aa, img: "images/m4a4theemperor.png" }
        ]
    },
    {
        id: "revolution-case",
        name: "Revolution Case",
        price: 150, 
        image: "images/revolutioncase.png",
        skins: [
            { name: "Mac-10 | Sakkaku", color: "#4caf50", modelColor: 0xcc2222, img: "images/mac10sakkaku.png" },
            { name: "Glock-18 | Umbral Rabbit", color: "#4a6cd1", modelColor: 0x333333, img: "images/glock18umbralrabbit.png" },
            { name: "AWP | Duality", color: "#800080", modelColor: 0x3d2b1f, img: "images/awpduality.png" },
            { name: "AK-47 | Head Shot", color: "#ff4500", modelColor: 0x8a2be2, img: "images/ak47headshot.png" },
            { name: "M4A4 | Temukau", color: "#d4af37", modelColor: 0x4682b4, img: "images/m4a4temukau.png" }
        ]
    }
];

const ITEM_WIDTH = 150; //

// ==========================================================================
// 2. ОНОВЛЕННЯ ІНТЕРФЕЙСУ ТА НАВІГАЦІЯ
// ==========================================================================
function updateBalanceUI() {
    document.querySelectorAll('.global-balance').forEach(el => {
        el.textContent = balance;
    }); //
    
    const buyBtn = document.getElementById('buy-case-btn'); //
    if (buyBtn && selectedCase) {
        if (balance < selectedCase.price) {
            buyBtn.disabled = true; //
            buyBtn.textContent = `${t('no_money')} ($${selectedCase.price})`; //
        } else {
            buyBtn.disabled = false; //
            buyBtn.textContent = t("btn_buy"); //
        }
    }
}

function showScreen(screenId) {
    hideCaseTooltip(); //
    
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden')); //
    document.getElementById('match-container').classList.add('hidden'); //
    document.getElementById(screenId).classList.remove('hidden'); //
    
    if (screenId === 'inventory-screen') updateInventoryUI(); //
    if (screenId === 'case-screen') {
        document.getElementById('case-selection-zone').classList.remove('hidden'); //
        document.getElementById('case-main-back-btn').classList.remove('hidden'); //
        document.getElementById('case-opening-zone').classList.add('hidden'); //
        renderCaseSelectionMenu(); //
    }
    updateBalanceUI(); //
    const sb = document.getElementById('settings-btn');
    if (sb) sb.classList.remove('hidden');
    const pbx = document.getElementById('profile-btn');
    if (pbx) pbx.classList.remove('hidden');
}

// ==========================================================================
// 3. МАГАЗИН КЕЙСІВ ТА TOOLTIP
// ==========================================================================
let tooltipTimeout = null; //

function renderCaseSelectionMenu() {
    const selectionZone = document.getElementById('case-selection-zone'); //
    if (!selectionZone) return; //
    selectionZone.innerHTML = ""; //

    casesData.forEach(c => {
        const card = document.createElement('div'); //
        card.className = "card"; //
        card.innerHTML = `
            <img src="${c.image}" alt="${c.name}" class="card-case-image" draggable="false">
            <h3>${c.name}</h3>
            <p style="margin: 5px 0; color: #aaa;">Ціна: $${c.price}</p>
            <button class="btn" onclick="selectCaseToOpen('${c.id}')">Вибрати</button>
        `; //

        card.addEventListener('mouseenter', (e) => startTooltipTimer(e, c)); //
        card.addEventListener('mousemove', moveCaseTooltip); //
        card.addEventListener('mouseleave', hideCaseTooltip); //

        selectionZone.appendChild(card); //
    });
}

function startTooltipTimer(event, caseData) {
    if (tooltipTimeout) clearTimeout(tooltipTimeout); //
    const currentEvent = { clientX: event.clientX, clientY: event.clientY }; //
    tooltipTimeout = setTimeout(() => { showCaseTooltip(currentEvent, caseData); }, 500); //
}

function showCaseTooltip(storedEvent, caseData) {
    const tooltip = document.getElementById('case-tooltip'); //
    if (!tooltip) return; //

    const sortedSkins = [...caseData.skins].sort((a, b) => {
        const weightA = raritySettings[a.color]?.order || 99; //
        const weightB = raritySettings[b.color]?.order || 99; //
        return weightA - weightB; //
    });

    let skinsListHTML = `<h4>${t("tooltip_title")}</h4>`; //
    sortedSkins.forEach(skin => {
        const info = raritySettings[skin.color] || { name: "Звичайний", chance: 70 }; //
        skinsListHTML += `<div class="tooltip-skin-item" style="color: ${skin.color}">★ ${skin.name} <span style="color:#aaa; font-weight:normal;">| ${t(info.nameKey || "rarity_5")} (${info.chance}%)</span></div>`; //
    });

    tooltip.innerHTML = skinsListHTML; //
    tooltip.style.display = 'block'; //
    tooltip.style.left = (storedEvent.clientX + 15) + 'px'; //
    tooltip.style.top = (storedEvent.clientY + 15) + 'px'; //
}

function moveCaseTooltip(event) {
    const tooltip = document.getElementById('case-tooltip'); //
    if (tooltip && tooltip.style.display === 'block') {
        tooltip.style.left = (event.clientX + 15) + 'px'; //
        tooltip.style.top = (event.clientY + 15) + 'px'; //
    }
}

function hideCaseTooltip() {
    if (tooltipTimeout) { clearTimeout(tooltipTimeout); tooltipTimeout = null; } //
    const tooltip = document.getElementById('case-tooltip'); //
    if (tooltip) tooltip.style.display = 'none'; //
}

function selectCaseToOpen(caseId) {
    hideCaseTooltip(); //
    selectedCase = casesData.find(c => c.id === caseId); //
    if (!selectedCase) return; //

    document.getElementById('case-selection-zone').classList.add('hidden'); //
    document.getElementById('case-main-back-btn').classList.add('hidden'); //
    
    document.getElementById('current-opening-case-title').textContent = selectedCase.name; //
    document.getElementById('current-opening-case-price').textContent = `Ціна: $${selectedCase.price}`; //
    document.getElementById('case-opening-zone').classList.remove('hidden'); //

    generateRouletteItems(); //
    updateBalanceUI(); //
}

function backToCaseSelection() {
    selectedCase = null; //
    hideCaseTooltip(); //
    document.getElementById('case-opening-zone').classList.add('hidden'); //
    document.getElementById('case-selection-zone').classList.remove('hidden'); //
    document.getElementById('case-main-back-btn').classList.remove('hidden'); //
    updateBalanceUI(); //
}

// ==========================================================================
// 4. МЕХАНІКА РУЛЕТКИ (ВИПРАВЛЕНО ЗМІЩЕННЯ ЛІНІЇ)
// ==========================================================================
function getRandomSkinWithChances(skins) {
    const roll = Math.random() * 100; //
    let currentSum = 0; //

    for (const color in raritySettings) {
        currentSum += raritySettings[color].chance; //
        if (roll <= currentSum) {
            const matchingSkins = skins.filter(s => s.color === color); //
            if (matchingSkins.length > 0) {
                return matchingSkins[Math.floor(Math.random() * matchingSkins.length)]; //
            }
        }
    }
    return skins[Math.floor(Math.random() * skins.length)]; //
}

function generateRouletteItems() {
    const track = document.getElementById('roulette-track'); //
    if (!track || !selectedCase) return; //
    track.style.transition = 'none'; //
    track.style.transform = 'translateX(0px)'; //
    track.innerHTML = ''; //

    for (let i = 0; i < 45; i++) {
        const skin = getRandomSkinWithChances(selectedCase.skins); //
        const item = document.createElement('div'); //
        item.className = 'roulette-item'; //
        item.style.borderBottomColor = skin.color; //
        item.innerHTML = `
            <img src="${skin.img}" alt="${skin.name}" class="roulette-skin-image" draggable="false">
            <strong style="color:${skin.color}">${skin.name.split(' | ')[0]}</strong><br>
            <span style="color:${skin.color}">${skin.name.split(' | ')[1]}</span>
        `; //
        track.appendChild(item); //
    }
}

function buyCase() {
    if (!selectedCase || balance < selectedCase.price) return; //

    balance -= selectedCase.price; //
    updateBalanceUI(); //
    
    const btn = document.getElementById('buy-case-btn'); //
    if (btn) btn.disabled = true; //

    generateRouletteItems(); //
    const track = document.getElementById('roulette-track'); //
    
    // Індекс 36 є ідеальним для розрахунку чистих зсувів без похибок DOM
    const winningIndex = 36; //
    const winningSkin = getRandomSkinWithChances(selectedCase.skins); //
    
    const items = track.getElementsByClassName('roulette-item'); //
    if (items[winningIndex]) {
        items[winningIndex].style.borderBottomColor = winningSkin.color; //
        items[winningIndex].innerHTML = `
            <img src="${winningSkin.img}" alt="${winningSkin.name}" class="roulette-skin-image" draggable="false">
            <strong style="color:${winningSkin.color}">${winningSkin.name.split(' | ')[0]}</strong><br>
            <span style="color:${winningSkin.color}">${winningSkin.name.split(' | ')[1]}</span>
        `; //
    }

    // МАТЕМАТИЧНЕ КОРУГУВАННЯ: віднімаємо ITEM_WIDTH, щоб стрілка не перелітала на сусідню картку
    const centerOffset = 450 - (ITEM_WIDTH / 2); //
    const finalPosition = -(winningIndex * ITEM_WIDTH) + centerOffset - ITEM_WIDTH; //

    setTimeout(() => {
        track.style.transition = 'transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)'; //
        track.style.transform = `translateX(${finalPosition}px)`; //
    }, 50);

    setTimeout(() => {
        inventory.push(winningSkin.name); //
        activeWeapon = winningSkin.name; //
        
        const winOverlay = document.getElementById('win-overlay'); //
        const winSkinName = document.getElementById('win-skin-name'); //
        const winCardElement = document.getElementById('win-card-element'); //
        const winSkinImage = document.getElementById('win-skin-image'); //

        if (winSkinImage) winSkinImage.src = winningSkin.img; //
        
        if (winSkinName) {
            winSkinName.innerHTML = `
                <strong style="color:${winningSkin.color}">${winningSkin.name.split(' | ')[0]}</strong><br>
                <span style="color:${winningSkin.color}">${winningSkin.name.split(' | ')[1]}</span>
            `; //
        }
        
        if (winCardElement) {
            winCardElement.style.borderColor = winningSkin.color; //
            winCardElement.style.boxShadow = `0 0 50px ${winningSkin.color}`; //
        }
        winOverlay.classList.remove('hidden'); //

        updateBalanceUI(); //
    }, 4100);
}

function closeWinWindow() {
    document.getElementById('win-overlay').classList.add('hidden'); //
    const buyBtn = document.getElementById('buy-case-btn'); //
    if (buyBtn) buyBtn.disabled = false; //
    generateRouletteItems(); //
    updateBalanceUI(); //
}

// ==========================================================================
// 5. КЕРУВАННЯ ІНВЕНТАРЕМ (ТОЧНИЙ ПОШУК РІДКОСТЕЙ)
// ==========================================================================
function updateInventoryUI() {
    const list = document.getElementById('inventory-list'); //
    if (!list) return; //
    list.innerHTML = ""; //
    
    inventory.forEach(skinName => {
        let skinData = null;
        
        // Пошук з ігноруванням зайвих пробілів чи регістру літер
        for (let c of casesData) {
            let found = c.skins.find(s => s.name.trim().toLowerCase() === skinName.trim().toLowerCase()); //
            if (found) { skinData = found; break; } //
        }

        if (!skinData && skinName === "Glock-18 | Стандарт") {
            skinData = { color: "#4caf50", img: "images/glockstandard.png" }; //
        }

        const currentColor = skinData ? skinData.color : "#4caf50"; //
        const currentImg = skinData ? skinData.img : "images/glockstandard.png"; //

        const item = document.createElement('div'); //
        item.className = 'card'; //
        item.style.borderColor = currentColor; //
        
        const isEquipped = activeWeapon === skinName; //

        item.innerHTML = `
            <img src="${currentImg}" alt="${skinName}" class="skin-item-image" draggable="false">
            <b style="font-size:14px; color:#fff; display:block; margin-top:5px;">${skinName.split(' | ')[0]}</b>
            <span style="font-size:12px; color:${isEquipped ? '#00ff00' : currentColor}; font-weight: bold; margin-top:3px;">
                ${isEquipped ? t('equipped') : skinName.split(' | ')[1] || ''}
            </span>
            <button class="btn ${isEquipped ? 'btn-green' : ''}" style="width:100%;" 
                    onclick="equip('${skinName}')" ${isEquipped ? 'disabled' : ''}>
                ${isEquipped ? t('equipped') : t('equip_btn')}
            </button>
        `; //
        list.appendChild(item); //
    });
}

function equip(skinName) {
    activeWeapon = skinName; //
    updateInventoryUI(); //
}

// ==========================================================================
// 6. ІГРОВИЙ 3D-РЕЖИМ (THREE.JS)
// ==========================================================================
let scene, camera, renderer, enemies = [], obstacles = []; //
let weaponMesh; //
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false; //
let isSpacePressed = false, canJump = false; //       
let velocity = new THREE.Vector3(), direction = new THREE.Vector3(), prevTime = performance.now(); //
let matchActive = false, yaw = 0, pitch = 0; //
const mouseSensitivity = 0.002; //

// --- СИСТЕМА СТРІЛЬБИ ТА ВІДДАЧІ (RECOIL) ---
let isFiring = false;          // затиснута ЛКМ
let fireInterval = null;       // таймер автострільби
const FIRE_RATE_MS = 110;      // швидкість стрільби (мс між пострілами)
let recoilPitch = 0;           // накопичена вертикальна віддача (камера вгору)
let recoilYaw = 0;             // накопичений горизонтальний розкид (вліво/вправо)
let shotsFired = 0;            // лічильник пострілів підряд (для зростання recoil)
const RECOIL_PER_SHOT = 0.026;     // підйом камери за постріл
const RECOIL_MAX = 0.32;           // максимальний підйом
const RECOIL_RECOVER_SPEED = 0.08; // швидкість повернення камери (lerp factor)
const RECOIL_SPREAD = 0.012;       // випадковий горизонтальний розкид за постріл

// --- ЗВУК ПОСТРІЛУ ---
const shotSound = new Audio('data:audio/mp3;base64,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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVNj6fbTN94H4wu9zrMyiWzjPU0Nkzlg0IPCm6M6KLfjgPupNA2g0z3H1DVdasMyRtkwS2FkxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kmRaj/FMBYAD//AYCoAwAHvAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JkQI/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSZECP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kmRAj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JkQI/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSZECP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRBR0FjY3VyYXRlIHNob3QgYXQgdGhlIHRhcmdldCBkdQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIwMjQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/');
shotSound.volume = 0.6;

// --- ЗВУК КЛІКУ ---
const clickSound = new Audio('data:audio/mp3;base64,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RhEFlP1qYckqr6mLrtJ61p1JpWraItjGGHKbKsjkD0GAE6LPBoKGrup6FHgaBp54QRwU/rMlnGYv7f7/EpYSmcijQYCRgYAABtwHQUwjYXh5bv3f76e9n+FAQIY18iMspqpanEeZy8q5NGZrzP1U+rNwhiUNkaRFkdb21By//1VB2C0w24AAgAAFpH0OHEWnt4IxL+rqLRFxQo1Ti/MnBROuMXEx2IgEhLJtCxpNJp6cI3njRSaJRcyk4BGHbWpHcpKzlkUay8akmOMllDkCQGh0cys9FEOMxhUBGkwEKIY09oQr6BEmY/s+zW5FgABEVWGlt5blogsy9DhyOPtHEiWE1hz5sfxpqVh5Wky0SpLhVNjGwqZMgIO9dqrN3Dujkkror5Gd///6KgEuAEAWjN4QoS2XuJJ18N/XVLBL+MOBunREhU4suexLic2B0cUFQWuYSQuI5FQzlWpPSP7GXMjNcwGGiyMqHOlmqhSEmoNS//uSZCOAAyEsTMtsGsA+ohqPBMJXC8yvJ4yMtMEVDOX0MYzgyAoLARYNWtEwTKtHBUVGJz279j7Cza9887qqSwiDqwPFQwa2PaXurCa0RuVQIlKTdgWCXxlKliMJPDp0FiZJglTljoy8FmFXyTkuCrkHQbrGM1gz39af/+3r9iQYk5EACE2G5WQlJ1tdeR6nvcWAoddF/FjOtNP85TlXsq0Ndqy2JOU5Lu2cmZmONsfrqpSrqWXsexswMBKIgUj/l7YiODomDpYSwaeVAT5YcDSj0jPHlZXU89krhWS1BQxVVo1AtOAKJJSak3sBATrtDJoBCqrMKWMx+oUBUBhoqqQUBAILHsGlHpKSDsNArCQdzuDT55avf8NWFcTNVlTuykqCtQhAc3N4AwzUEhaWHLQcKTFmoagIHDBQKYtE6EjTE0UjSiri2MVLlMrP0/MVeisYKDDICaBRYSGoBFQy76kDyICIgJutISRWIwEEzLdHqFg8DIkNM3YCYZbwEEhYRu+kJBY/9lvmsqGrRyMpSaVDVrHNWqGrA6GXQWEYCCQk///7kmQ/D/L/ID2TRhJQMmQHoAwDSAAAAaQAAAAgAAA0gAAABPuFbv//FTILC5n/62oFQEEwyAm61UxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUQUdidXR0b24gY2xpY2sgZHJ5IHNvZnQgbXV0ZWQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyMDI0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/w==');
clickSound.volume = 0.5;

function playClickSound() {
    const sfx = clickSound.cloneNode();
    sfx.volume = clickSound.volume;
    sfx.play().catch(() => {});
}

// --- НАЛАШТУВАННЯ ---
let settingsCalledFrom = 'menu';

// --- ПРОФІЛЬ ---
function openProfile() {
    playClickSound();
    loadProfile();
    document.getElementById('profile-modal').classList.remove('hidden');
    document.getElementById('profile-overlay').classList.remove('hidden');
}

function closeProfile() {
    playClickSound();
    document.getElementById('profile-modal').classList.add('hidden');
    document.getElementById('profile-overlay').classList.add('hidden');
}

// --- ПРОФІЛЬ: АВАТАР, НІК, ID ---
function generatePlayerId() {
    // Генеруємо унікальний 8-значний ID і зберігаємо в localStorage
    let pid = localStorage.getItem('cs2_player_id');
    if (!pid) {
        pid = Math.floor(10000000 + Math.random() * 90000000).toString();
        localStorage.setItem('cs2_player_id', pid);
    }
    return pid;
}

function loadProfile() {
    // Завантажуємо збережені дані профілю
    const nickname = localStorage.getItem('cs2_nickname') || 'Player';
    const avatar = localStorage.getItem('cs2_avatar') || null;
    const pid = generatePlayerId();

    document.getElementById('profile-nickname').textContent = nickname;
    document.getElementById('profile-at-nickname').textContent = '@' + nickname.toLowerCase().replace(/\s+/g, '');
    document.getElementById('profile-id-number').textContent = pid;

    if (avatar) {
        document.getElementById('profile-avatar-img').src = avatar;
    }
}

function changeAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        document.getElementById('profile-avatar-img').src = dataUrl;
        localStorage.setItem('cs2_avatar', dataUrl);
    };
    reader.readAsDataURL(file);
}

function changeNickname() {
    playClickSound();
    const prompt_text = t('nick_prompt');
    const current = localStorage.getItem('cs2_nickname') || 'Player';
    const newNick = window.prompt(prompt_text, current);
    if (newNick && newNick.trim().length > 0) {
        const clean = newNick.trim().substring(0, 20);
        localStorage.setItem('cs2_nickname', clean);
        document.getElementById('profile-nickname').textContent = clean;
        document.getElementById('profile-at-nickname').textContent = '@' + clean.toLowerCase().replace(/\s+/g, '');
    }
}

function openSettings() {
    playClickSound();
    if (matchActive) {
        settingsCalledFrom = 'match';
        matchActive = false;
        document.exitPointerLock();
        document.getElementById('match-container').classList.add('hidden');
    } else {
        settingsCalledFrom = 'menu';
    }
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('settings-screen').classList.remove('hidden');
    const sb = document.getElementById('settings-btn');
    if (sb) sb.classList.add('hidden');
}

function closeSettings() {
    playClickSound();
    const sb = document.getElementById('settings-btn');
    if (sb) sb.classList.remove('hidden');
    if (settingsCalledFrom === 'match') {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById('settings-screen').classList.add('hidden');
        document.getElementById('match-container').classList.remove('hidden');
        matchActive = true;
        prevTime = performance.now();
        animate();
        document.body.requestPointerLock();
    } else {
        showScreen('menu-screen');
    }
}

function changeVolume(val) {
    document.getElementById('volume-value').textContent = val + '%';
    shotSound.volume = val / 100;
}

function changeSensitivity(val) {
    document.getElementById('sensitivity-value').textContent = val;
    mouseSensitivity = val * 0.001;
}

function playShotSound() {
    // Клонуємо аудіо, щоб швидкі постріли (автовогонь) не обривали одне одного
    const sfx = shotSound.cloneNode();
    sfx.volume = shotSound.volume;
    sfx.play().catch(() => {}); // ігноруємо помилку якщо браузер заблокував автоплей
}

function start3DMatch() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden')); //
    document.getElementById('match-container').classList.remove('hidden'); //
    document.getElementById('current-weapon').textContent = activeWeapon.replace('| Стандарт', '| ' + t('standard')); //
    matchActive = true; //
    init3D(); //
    document.addEventListener('click', lockMouse); //
}

function lockMouse() { if (matchActive) document.body.requestPointerLock(); } //

function exitMatch() {
    matchActive = false; //
    document.exitPointerLock(); //
    document.removeEventListener('click', lockMouse); //
    document.getElementById('match-container').classList.add('hidden'); //
    showScreen('menu-screen'); //
    const pbExit = document.getElementById('profile-btn');
    if (pbExit) pbExit.classList.remove('hidden');
    const container = document.getElementById('canvas-container'); //
    while (container.firstChild) container.removeChild(container.firstChild); //
    // Видалити міні-мапу
    const mm = document.getElementById('minimap');
    if (mm) mm.remove();
    minimapCanvas = null; minimapCtx = null;
    enemies = []; obstacles = []; //
    // Скидаємо стрільбу і recoil, щоб не залишався активний інтервал
    isFiring = false;
    if (fireInterval) { clearInterval(fireInterval); fireInterval = null; }
    recoilPitch = 0; recoilYaw = 0; shotsFired = 0;
}

function getActiveWeaponColor() {
    for (let c of casesData) {
        let found = c.skins.find(s => s.name === activeWeapon); //
        if (found) return found.modelColor; //
    }
    return 0x8b8c7a; //
}

// ==========================================================================
// MIRAGE MAP BUILDER — допоміжні функції
// ==========================================================================

// Список валідних зон для спавну ворогів (центр, розмір)
const ENEMY_SPAWN_ZONES = [
    { x:  6, z: -26, w: 6, d: 8 },  // Mid
    { x: 14, z: -23, w: 4, d: 4 },  // A Short
    { x: 27, z:   2, w: 6, d: 8 },  // A Ramp
    { x: 30, z:  20, w: 6, d: 6 },  // A Site ліво
    { x: 42, z:  22, w: 6, d: 6 },  // A Site право
    { x: 35, z:  28, w: 6, d: 4 },  // A Site низ
];

function addWall(sx, sy, sz, wx, wy, wz, color) {
    // sx,sy,sz = position center; wx,wy,wz = size
    const geo = new THREE.BoxGeometry(wx, wy, wz);
    const mat = new THREE.MeshLambertMaterial({ color: color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(sx, sy, sz);
    mesh.userData.hw = wx / 2; // half-width X для колізії
    mesh.userData.hd = wz / 2; // half-depth Z для колізії
    scene.add(mesh);
    obstacles.push(mesh);
    return mesh;
}

function addFloorTile(sx, sz, wx, wz, color) {
    const geo = new THREE.PlaneGeometry(wx, wz);
    const mat = new THREE.MeshLambertMaterial({ color: color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(sx, 0.01, sz);
    scene.add(mesh);
}

function addBox(x, y, z, w, h, d, color) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshLambertMaterial({ color: color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.userData.hw = w / 2;
    mesh.userData.hd = d / 2;
    scene.add(mesh);
    obstacles.push(mesh);
}

function buildMirageMap() {
    const H   = 5;      // висота стін
    const T   = 0.7;    // товщина стін
    const C_SAND  = 0xc8a96e;
    const C_STONE = 0x7a7060;
    const C_WALL  = 0x9e8c6a;
    const C_DARK  = 0x4a4035;
    const C_BOX   = 0xb07830;
    const C_CRATE = 0xde9b35;

    // =====================================================================
    // Схема карти (вигляд зверху, вісь Z іде вниз = вперед):
    //
    //   CT Spawn: X[-10..10], Z[-8..8]   — гравець спавн (0,2,0)
    //   CT коридор вперед: X[-4..4], Z[-8..-20]
    //   Mid: X[-4..20], Z[-20..-35]
    //   A Short: X[4..20], Z[-8..-20] (праворуч від коридору)
    //   A Ramp: X[20..35], Z[-8..10]
    //   A Site: X[20..50], Z[10..35]
    // =====================================================================

    // --- ПІДЛОГИ (не колізія) ---
    addFloorTile(0,    0,   20, 16, C_STONE);  // CT spawn
    addFloorTile(0,  -14,    8, 12, C_SAND);   // CT коридор
    addFloorTile(8,  -28,   24, 16, C_SAND);   // Mid
    addFloorTile(14, -14,   12, 12, C_DARK);   // A Short
    addFloorTile(27,   1,   14, 18, C_SAND);   // A Ramp
    addFloorTile(35,  22,   30, 24, C_STONE);  // A Site
    addFloorTile(27,  10,   14,  4, C_SAND);   // з'єднання ramp->site

    // --- CT SPAWN стіни ---
    addWall(  0, H/2,  8,  20, H,  T, C_WALL); // задня
    addWall(-10, H/2,  3,   T, H,  10, C_WALL); // ліва (Z від -2 до 8 — не блокує вихід)
    addWall( 10, H/2,  3,   T, H,  10, C_WALL); // права

    // --- CT КОРИДОР X[-4..4], Z[-8..-20] ---
    addWall(-4, H/2, -14,  T, H, 12, C_WALL); // ліва стіна коридору
    addWall( 4, H/2, -14,  T, H, 12, C_WALL); // права стіна коридору

    // --- A SHORT (X[4..20], Z[-8..-20]) ---
    addWall(20, H/2, -14, T, H, 12, C_WALL);  // права стіна short
    addWall(12, H/2, -20, 16, H, T, C_WALL);  // верхня стіна short

    // --- MID (X[-4..20], Z[-20..-36]) ---
    addWall(-4, H/2, -28, T, H, 16, C_WALL);  // ліва стіна mid
    addWall(20, H/2, -28, T, H, 16, C_WALL);  // права стіна mid
    addWall( 8, H/2, -36, 24, H,  T, C_WALL); // задня стіна mid
    // Boost box в mid
    addBox(6, 0.75, -25, 1.5, 1.5, 1.5, C_BOX);
    // Window блоки (укриття)
    addBox(-2, 1.5, -24, T, 3, 3, C_WALL);
    addBox(18, 1.5, -24, T, 3, 3, C_WALL);

    // --- A RAMP (X[20..34], Z[-8..12]) ---
    // Ліву стіну X=20 прибрано — вхід відкритий з CT/коридору
    addWall(34, H/2,  2, T, H, 20, C_WALL);   // права стіна ramp
    addWall(27, H/2, -8, 14, H, T, C_WALL);   // верхня стіна ramp
    // Ящики на рампі
    addBox(22, 0.75,  0, 1.5, 1.5, 1.5, C_BOX);
    addBox(30, 0.75, -4, 1.5, 1.5, 1.5, C_CRATE);

    // --- A SITE (X[20..50], Z[12..34]) ---
    // Ліву стіну X=20 прибрано — з'єднана з Ramp без перегородки
    addWall(50, H/2, 23, T, H, 22, C_WALL);   // права стіна
    addWall(35, H/2, 34, 30, H,  T, C_WALL);  // нижня стіна
    addWall(35, H/2, 12, 30, H,  T, C_WALL);  // верхня стіна (T-side)

    // Ящики на A site
    addBox(26, 0.75, 20, 1.5, 1.5, 1.5, C_CRATE);
    addBox(26, 2.25, 20, 1.5, 1.5, 1.5, C_CRATE);
    addBox(26, 3.5,  20, 1.5, 1.0, 1.5, C_BOX);
    addBox(38, 0.75, 30, 1.5, 1.5, 1.5, C_BOX);
    addBox(42, 0.75, 30, 1.5, 1.5, 1.5, C_CRATE);
    addBox(46, 1.5,  18, 3,   3,   4,   C_STONE); // palace block
}

function init3D() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // світло-блакитне небо як у Mirage
    scene.fog = new THREE.Fog(0x87ceeb, 40, 120);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // CT spawn: центр CT зони
    camera.position.set(0, 2, 5);  // трохи позаду центру CT spawn
    yaw = Math.PI; pitch = 0;      // дивимось вперед (до Mid, напрямок -Z)
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // Освітлення
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xfff5cc, 1.0);
    sun.position.set(30, 60, 20);
    scene.add(sun);

    // Основна підлога (підкладка під всю карту)
    const baseGeo = new THREE.PlaneGeometry(200, 200);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x6b5e42 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.rotation.x = -Math.PI / 2;
    base.position.set(20, 0, 0);
    scene.add(base);

    // Будуємо карту Мірадж
    buildMirageMap();

    // Ініціалізуємо міні-мапу
    initMinimap();

    createWeaponInHand();
    spawnEnemiesOnMap();

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', onWindowResize);

    prevTime = performance.now();
    animate();
}

function createWeaponInHand() {
    let colorHex = getActiveWeaponColor(); //
    weaponMesh = new THREE.Group(); //
    const barrelGeo = new THREE.BoxGeometry(0.15, 0.15, 0.8); //
    const barrelMat = new THREE.MeshLambertMaterial({ color: colorHex }); //
    const barrel = new THREE.Mesh(barrelGeo, barrelMat); //
    barrel.position.set(0, 0, -0.4); //
    weaponMesh.add(barrel); //
    
    const handleGeo = new THREE.BoxGeometry(0.12, 0.4, 0.15); //
    const handleMat = new THREE.MeshLambertMaterial({ color: 0x111111 }); //
    const handle = new THREE.Mesh(handleGeo, handleMat); //
    handle.position.set(0, -0.2, -0.1); handle.rotation.x = -0.2; //
    weaponMesh.add(handle); //
    scene.add(weaponMesh); //
}

function spawnEnemies(count) {
    spawnEnemiesOnMap(count);
}

function spawnEnemiesOnMap(count) {
    count = count || 5;
    for (let i = 0; i < count; i++) {
        const zone = ENEMY_SPAWN_ZONES[i % ENEMY_SPAWN_ZONES.length];
        const ex = zone.x + (Math.random() - 0.5) * zone.w;
        const ez = zone.z + (Math.random() - 0.5) * zone.d;
        const enemyGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 16);
        const enemyMat = new THREE.MeshLambertMaterial({ color: 0xcc3333 });
        const enemy = new THREE.Mesh(enemyGeo, enemyMat);
        enemy.position.set(ex, 1, ez);
        scene.add(enemy);
        enemies.push(enemy);
    }
    document.getElementById('enemies-left').textContent = enemies.length;
}

function onMouseMove(event) {
    if (document.pointerLockElement !== document.body) return; //
    yaw -= event.movementX * mouseSensitivity; //
    pitch -= event.movementY * mouseSensitivity; //
    pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch)); //
    updateCameraRotation(); //
}

// Застосовує базовий yaw/pitch гравця + накладений recoil (віддача) + тремтіння (shake)
function updateCameraRotation(shakeX, shakeY) {
    shakeX = shakeX || 0;
    shakeY = shakeY || 0;
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw + recoilYaw + shakeX;
    camera.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch + recoilPitch + shakeY));
}

function onKeyDown(e) {
    switch (e.code) {
        case 'KeyW': moveForward = true; break; //
        case 'KeyS': moveBackward = true; break; //
        case 'KeyA': moveLeft = true; break; //
        case 'KeyD': moveRight = true; break; //
        case 'Space': isSpacePressed = true; break; //
        case 'Escape': exitMatch(); break; //
    }
}

function onKeyUp(e) {
    switch (e.code) {
        case 'KeyW': moveForward = false; break; //
        case 'KeyS': moveBackward = false; break; //
        case 'KeyA': moveLeft = false; break; //
        case 'KeyD': moveRight = false; break; //
        case 'Space': isSpacePressed = false; break; //
    }
}

// ==========================================================================
// СТРІЛЬБА З АВТО-ВОГНЕМ ТА RECOIL (ЯК В СПРАВЖНЬОМУ CS2)
// ==========================================================================

function onMouseDown(event) {
    if (event.button !== 0) return; // тільки ліва кнопка миші
    if (document.pointerLockElement !== document.body || !matchActive) return; //
    if (isFiring) return; // вже стріляємо

    isFiring = true;
    shotsFired = 0;

    fireOnce(); // перший постріл одразу
    fireInterval = setInterval(fireOnce, FIRE_RATE_MS);
}

function onMouseUp(event) {
    if (event.button !== 0) return;
    isFiring = false;
    if (fireInterval) {
        clearInterval(fireInterval);
        fireInterval = null;
    }
    shotsFired = 0; // скидаємо лічильник — recoil почне плавно опускатися в animate()
}

function fireOnce() {
    if (document.pointerLockElement !== document.body || !matchActive) return; //
    if (weaponMesh) { weaponMesh.position.z += 0.1; setTimeout(() => weaponMesh.position.z -= 0.1, 60); } //

    playShotSound(); // звук пострілу

    // --- НАКОПИЧЕННЯ RECOIL (камера йде вгору + випадковий розкид вбік) ---
    shotsFired++;
    recoilPitch = Math.min(RECOIL_MAX, recoilPitch + RECOIL_PER_SHOT);
    recoilYaw += (Math.random() - 0.5) * RECOIL_SPREAD * 2;

    // --- РОЗКИД КУЛІ (spread) залежно від кількості пострілів підряд ---
    const spreadAmount = Math.min(0.05, shotsFired * 0.004);
    const spreadX = (Math.random() - 0.5) * spreadAmount;
    const spreadY = (Math.random() - 0.5) * spreadAmount;

    const bulletOrigin = new THREE.Vector3(); //
    weaponMesh.getWorldPosition(bulletOrigin); //

    const raycaster = new THREE.Raycaster(); //
    raycaster.setFromCamera(new THREE.Vector2(spreadX, spreadY), camera); //

    let targetPoint = new THREE.Vector3(); //
    raycaster.ray.at(100, targetPoint); //

    const intersects = raycaster.intersectObjects([...enemies, ...obstacles], true); //
    if (intersects.length > 0) {
        targetPoint.copy(intersects[0].point); //
        const hitObject = intersects[0].object; //
        if (enemies.includes(hitObject)) {
            scene.remove(hitObject); //
            enemies = enemies.filter(e => e !== hitObject); //

            // 1. Даємо по $10 за кожного вбитого ворога
            balance += 10;

            document.getElementById('enemies-left').textContent = enemies.length; //

            // 2. Якщо вбили всіх п'ятьох — нараховуємо фінальний бонус $200
            if (enemies.length === 0) {
                alert(t("win_alert"));
                balance += 200;
                exitMatch();
            } //
        }
    }

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffea00 }); //
    const points = [bulletOrigin, targetPoint]; //
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points); //
    const tracer = new THREE.Line(lineGeometry, lineMaterial); //
    scene.add(tracer); //
    setTimeout(() => { scene.remove(tracer); lineGeometry.dispose(); lineMaterial.dispose(); }, 50); //
}

// ==========================================================================
// МІНІ-МАПА
// ==========================================================================
let minimapCanvas, minimapCtx;

// Межі карти у світових координатах для масштабування
const MAP_WORLD = { minX: -12, maxX: 52, minZ: -38, maxZ: 36 };

// Зони підлоги (для малювання карти зверху)
const MINIMAP_FLOORS = [
    { x:-10, z:-8,  w:20, d:16, color:'#7a7060' }, // CT spawn
    { x:-4,  z:-20, w:8,  d:12, color:'#c8a96e' }, // CT коридор
    { x:-4,  z:-36, w:24, d:16, color:'#c8a96e' }, // Mid
    { x:4,   z:-20, w:16, d:12, color:'#4a4035' }, // A Short
    { x:20,  z:-8,  w:14, d:20, color:'#c8a96e' }, // A Ramp
    { x:20,  z:12,  w:30, d:22, color:'#7a7060' }, // A Site
    { x:20,  z:8,   w:14, d:4,  color:'#c8a96e' }, // з'єднання
];

function initMinimap() {
    minimapCanvas = document.createElement('canvas');
    minimapCanvas.id = 'minimap';
    minimapCanvas.width  = 160;
    minimapCanvas.height = 160;
    minimapCanvas.style.cssText = [
        'position:absolute',
        'top:60px',        // під написом "Супротивники"
        'left:15px',
        'z-index:10',
        'border:2px solid rgba(222,155,53,0.8)',
        'border-radius:4px',
        'background:rgba(10,14,18,0.75)',
        'pointer-events:none',
    ].join(';');
    document.getElementById('match-container').appendChild(minimapCanvas);
    minimapCtx = minimapCanvas.getContext('2d');
}

function worldToMinimap(wx, wz) {
    const S = minimapCanvas.width;
    const rangeX = MAP_WORLD.maxX - MAP_WORLD.minX;
    const rangeZ = MAP_WORLD.maxZ - MAP_WORLD.minZ;
    const mx = ((wx - MAP_WORLD.minX) / rangeX) * S;
    const mz = ((wz - MAP_WORLD.minZ) / rangeZ) * S;
    return { x: mx, y: mz };
}

function drawMinimap() {
    if (!minimapCtx || !matchActive) return;
    const ctx = minimapCtx;
    const S = minimapCanvas.width;

    ctx.clearRect(0, 0, S, S);

    // Фон
    ctx.fillStyle = 'rgba(10,14,18,0.85)';
    ctx.fillRect(0, 0, S, S);

    // Малюємо зони підлоги
    MINIMAP_FLOORS.forEach(f => {
        const tl = worldToMinimap(f.x,       f.z);
        const br = worldToMinimap(f.x + f.w, f.z + f.d);
        ctx.fillStyle = f.color;
        ctx.fillRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    });

    // Малюємо ворогів (червоні крапки)
    enemies.forEach(e => {
        const p = worldToMinimap(e.position.x, e.position.z);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ff3333';
        ctx.fill();
    });

    // Малюємо гравця (жовта крапка зі стрілкою напрямку)
    const pp = worldToMinimap(camera.position.x, camera.position.z);
    // Коло гравця
    ctx.beginPath();
    ctx.arc(pp.x, pp.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff88';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Стрілка напрямку погляду
    const arrowLen = 9;
    ctx.beginPath();
    ctx.moveTo(pp.x, pp.y);
    ctx.lineTo(
        pp.x + Math.sin(yaw) * arrowLen,
        pp.y + Math.cos(yaw) * arrowLen
    );
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Підпис "CT" на spawn
    const ctP = worldToMinimap(0, 0);
    ctx.fillStyle = 'rgba(0,200,255,0.9)';
    ctx.font = 'bold 9px Arial';
    ctx.fillText('CT', ctP.x - 5, ctP.y + 3);

    // Підпис "A"
    const aP = worldToMinimap(35, 23);
    ctx.fillStyle = 'rgba(255,180,0,0.9)';
    ctx.fillText('A', aP.x - 3, aP.y + 3);

    // Рамка
    ctx.strokeStyle = 'rgba(222,155,53,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, S, S);
}

function animate() {
    if (!matchActive) return; //
    requestAnimationFrame(animate); //
    const time = performance.now(); const delta = (time - prevTime) / 1000; //
    velocity.x -= velocity.x * 10.0 * delta; velocity.z -= velocity.z * 10.0 * delta; velocity.y -= 9.8 * 3.5 * delta; //

    // --- ВІДНОВЛЕННЯ RECOIL: коли гравець не стріляє, камера плавно опускається назад ---
    if (!isFiring) {
        recoilPitch += (0 - recoilPitch) * RECOIL_RECOVER_SPEED;
        recoilYaw   += (0 - recoilYaw) * RECOIL_RECOVER_SPEED;
        if (Math.abs(recoilPitch) < 0.0005) recoilPitch = 0;
        if (Math.abs(recoilYaw) < 0.0005) recoilYaw = 0;
    }
    // --- ЛЕГКЕ ТРЕМТІННЯ КАМЕРИ ПІД ЧАС СТРІЛЬБИ ---
    let shakeX = 0, shakeY = 0;
    if (isFiring) {
        shakeX = (Math.random() - 0.5) * 0.004;
        shakeY = (Math.random() - 0.5) * 0.004;
    }
    updateCameraRotation(shakeX, shakeY); // застосувати yaw/pitch + recoil + тремтіння щокадру

    const camDirection = new THREE.Vector3(); camera.getWorldDirection(camDirection); camDirection.y = 0; camDirection.normalize(); //
    const camSideways = new THREE.Vector3(-camDirection.z, 0, camDirection.x); //
    const oldPosition = camera.position.clone(); //
    
    if (moveForward) velocity.addScaledVector(camDirection, 45 * delta); //
    if (moveBackward) velocity.addScaledVector(camDirection, -45 * delta); //
    if (moveLeft) velocity.addScaledVector(camSideways, -45 * delta); //
    if (moveRight) velocity.addScaledVector(camSideways, 45 * delta); //
    if (isSpacePressed && canJump) { velocity.y = 11; canJump = false; } //
    
    camera.position.addScaledVector(velocity, delta); //
    if (camera.position.y < 2) { velocity.y = 0; camera.position.y = 2; canJump = true; } //
    
    const playerRadius = 0.6;
    for (let i = 0; i < obstacles.length; i++) {
        const obj = obstacles[i];
        // Беремо розміри збережені під час створення об'єкта
        const hw = obj.userData.hw; // half-width X
        const hd = obj.userData.hd; // half-depth Z
        if (hw === undefined || hd === undefined) continue;
        const cx = obj.position.x;
        const cz = obj.position.z;
        if (
            camera.position.x > cx - hw - playerRadius &&
            camera.position.x < cx + hw + playerRadius &&
            camera.position.z > cz - hd - playerRadius &&
            camera.position.z < cz + hd + playerRadius
        ) {
            const overlapX = hw + playerRadius - Math.abs(camera.position.x - cx);
            const overlapZ = hd + playerRadius - Math.abs(camera.position.z - cz);
            if (overlapX < overlapZ) {
                camera.position.x = oldPosition.x;
                velocity.x = 0;
            } else {
                camera.position.z = oldPosition.z;
                velocity.z = 0;
            }
        }
    }
    if (weaponMesh) { weaponMesh.position.copy(camera.position); weaponMesh.rotation.copy(camera.rotation); weaponMesh.translateX(0.3); weaponMesh.translateY(-0.35); weaponMesh.translateZ(-0.4); } //
    drawMinimap();
    prevTime = time; renderer.render(scene, camera); //
}

function onWindowResize() { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); } //
window.onload = () => { updateBalanceUI(); setLanguage('en'); generatePlayerId(); }; //