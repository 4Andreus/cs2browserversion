// ==========================================================================
// 1. ГЛОБАЛЬНІ ДАНІ ГРИ, НАЛАШТУВАННЯ ТА ШАНСИ
// ==========================================================================
let balance = 500; 
let inventory = ["Glock-18 | Стандарт"]; 
let activeWeapon = "Glock-18 | Стандарт"; 
let selectedCase = null; 

// Налаштування рідкостей (Сума шансів: 3+12+15+25+45 = 100%)
const raritySettings = {
    "#d4af37": { order: 1, name: "Легендарний", chance: 3 },  // Жовтий
    "#ff4500": { order: 2, name: "Міфічний",    chance: 12 }, // Червоний
    "#800080": { order: 3, name: "Епічний",     chance: 15 }, // Фіолетовий
    "#4a6cd1": { order: 4, name: "Рідкісний",   chance: 25 }, // Тусклий Синій
    "#4caf50": { order: 5, name: "Звичайний",   chance: 45 }  // Зелений
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
            buyBtn.textContent = `Немає грошей ($${selectedCase.price})`; //
        } else {
            buyBtn.disabled = false; //
            buyBtn.textContent = "Купити & Відкрити"; //
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

    let skinsListHTML = `<h4>Скіни в кейсі:</h4>`; //
    sortedSkins.forEach(skin => {
        const info = raritySettings[skin.color] || { name: "Звичайний", chance: 70 }; //
        skinsListHTML += `<div class="tooltip-skin-item" style="color: ${skin.color}">★ ${skin.name} <span style="color:#aaa; font-weight:normal;">| ${info.name} (${info.chance}%)</span></div>`; //
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
                ${isEquipped ? 'Екіпіровано' : skinName.split(' | ')[1] || ''}
            </span>
            <button class="btn ${isEquipped ? 'btn-green' : ''}" style="width:100%;" 
                    onclick="equip('${skinName}')" ${isEquipped ? 'disabled' : ''}>
                ${isEquipped ? 'Екіпіровано' : 'Взяти'}
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
const shotSound = new Audio('sounds/accurate-shot-at-the-target-during-training.mp3');
shotSound.volume = 0.6;

function playShotSound() {
    // Клонуємо аудіо, щоб швидкі постріли (автовогонь) не обривали одне одного
    const sfx = shotSound.cloneNode();
    sfx.volume = shotSound.volume;
    sfx.play().catch(() => {}); // ігноруємо помилку якщо браузер заблокував автоплей
}

function start3DMatch() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden')); //
    document.getElementById('match-container').classList.remove('hidden'); //
    document.getElementById('current-weapon').textContent = activeWeapon; //
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
                alert("Всі цілі ліквідовані! Бонус за зачистку: +$200 (Всього: +$250)");
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
window.onload = () => { updateBalanceUI(); }; //