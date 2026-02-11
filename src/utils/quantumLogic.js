// Utility to generate deterministic values based on input
// The user wants 5 specific statuses:
// 1. Entropi (Kararsızlık)
// 2. Momentum (Azim)
// 3. Dolanıklık (İlişkiler)
// 4. Spin (Şans)
// 5. Işıma (Aura)
//
// If value >= 50% -> Text2, else -> Text1

// Standard Model Particles Data
const particleTypes = [
    // Quarks (6)
    { name: 'YUKARI KUARK', symbol: 'u', desc: 'EN HAFİF KUARK', color: '#FF6B6B' },
    { name: 'AŞAĞI KUARK', symbol: 'd', desc: 'İKİNCİ EN HAFİF', color: '#4ECDC4' },
    { name: 'TILSIM KUARK', symbol: 'c', desc: 'AĞIR KUARK', color: '#FF8C42' },
    { name: 'GARİP KUARK', symbol: 's', desc: 'GARİP ÇEŞNİ', color: '#F7FFF7' },
    { name: 'ÜST KUARK', symbol: 't', desc: 'EN AĞIR PARÇACIK', color: '#FFE66D' },
    { name: 'ALT KUARK', symbol: 'b', desc: 'ALT ÇEŞNİ', color: '#FF0055' },

    // Leptons (6)
    { name: 'ELEKTRON', symbol: 'e⁻', desc: 'ELEKTRİK YÜKÜ', color: '#45B7D1' },
    { name: 'MÜON', symbol: 'μ', desc: 'AĞIR ELEKTRON', color: '#E056FD' },
    { name: 'TAU', symbol: 'τ', desc: 'EN AĞIR LEPTON', color: '#686DE0' },
    { name: 'ELEKTRON NÖTRİNOSU', symbol: 'νe', desc: 'HAYALET PARÇACIK', color: '#AC92EB' },
    { name: 'MÜON NÖTRİNOSU', symbol: 'νμ', desc: 'MÜON EŞİ', color: '#48DBFB' },
    { name: 'TAU NÖTRİNOSU', symbol: 'ντ', desc: 'TAU EŞİ', color: '#54A0FF' },

    // Bosons (4 - Higgs is special)
    { name: 'FOTON', symbol: 'γ', desc: 'IŞIK', color: '#FFFFFF' },
    { name: 'GLUON', symbol: 'g', desc: 'GÜÇLÜ KUVVET', color: '#A6E22E' },
    { name: 'W BOZONU', symbol: 'W', desc: 'ZAYIF KUVVET', color: '#FF9F43' },
    { name: 'Z BOZONU', symbol: 'Z', desc: 'ZAYIF KUVVET', color: '#EE5253' },
];


// Calculate positions: Higgs in center, others in a circle
const particles = [
    { name: 'Higgs Bozonu', symbol: 'H', desc: 'Kütle Kazandıran', color: '#FFD700', x: 50, y: 50 }, // Center
    ...particleTypes.map((p, i) => {
        const angle = (i / particleTypes.length) * 2 * Math.PI - (Math.PI / 2); // Start from top
        const radius = 38; // 38% radius (fits in 50% box with padding)
        return {
            ...p,
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle)
        };
    })
];

const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export const getQuantumData = (name, sentence) => {
    const combined = (name + sentence).trim();
    const seed = simpleHash(combined);

    // Helper to get % from seed offset
    const getVal = (offset) => (seed + offset * 12345) % 101;

    // Yardımcı Fonksiyon: 0-100 arasındaki değere göre metni seçer
    const getStatusText = (val, texts) => {
        if (val <= 20) return texts[0];
        if (val <= 40) return texts[1];
        if (val <= 60) return texts[2];
        if (val <= 80) return texts[3];
        return texts[4];
    };

    const entropiVal = getVal(1);
    const entropi = {
        label: 'Entropi (Kararsızlık)',
        value: entropiVal,
        text: getStatusText(entropiVal, [
            "Net ve Planlı",     // 0-20: Hiç kararsızlık yok
            "Keskin Odak",     // 21-40
            "Dalgalı Zihin",     // 41-60
            "Sisli Alan",   // 61-80
            "Kaotik Fırtına"       // 81-100: Çok kararsız
        ])
    };

    // 2. Momentum (Azim) -> Ne kadar istekli ve hareketli?
    const momentumVal = getVal(2);
    const momentum = {
        label: 'Momentum (Azim)',
        value: momentumVal,
        text: getStatusText(momentumVal, [
            "AFK",         // 0-20: Hiç azim yok
            "Rölantide",    // 21-40
            "İvme Kazandı",        // 41-60
            "Hırslı",            // 61-80
            "Boss"       // 81-100: Çok azimli
        ])
    };

    // 3. Dolanıklık (İlişkiler) -> Bağları ne kadar kuvvetli?
    const dolaniklikVal = getVal(3);
    const dolaniklik = {
        label: 'Dolanıklık (İlişkiler)',
        value: dolaniklikVal,
        text: getStatusText(dolaniklikVal, [
            "Yalnız Kovboy",     // 0-20: Bağ kopuk
            "Mesafeli",          // 21-40
            "Sosyal",      // 41-60
            "Geniş Çevreli",      // 61-80
            "Ana Karakter"            // 81-100: Çok güçlü bağ
        ])
    };

    // 4. Spin (Şans) -> Şansı yaver gidiyor mu?
    const spinVal = getVal(4);
    const spin = {
        label: 'Spin (Şans)',
        value: spinVal,
        text: getStatusText(spinVal, [
            "Bahtsız Bedevi",    // 0-20: Çok şanssız
            "Kısmeti Kapalı",     // 21-40
            "Ortalardasın",       // 41-60
            "Rüzgar Arkanda",    // 61-80
            "Bingo!"   // 81-100: Çok şanslı
        ])
    };

    // 5. Işıma (Aura) -> Ortamda ne kadar dikkat çekiyor?
    const isimaVal = getVal(5);
    const isima = {
        label: 'Işıma (Aura)',
        value: isimaVal,
        text: getStatusText(isimaVal, [
            "Hayalet Casper",     // 0-20: Sönük
            "Kendi Halinde",     // 21-40
            "Dikkat Çeker",       // 41-60
            "Gözler Üstünde",            // 61-80
            "Güneş Gibi Parlar"        // 81-100: Çok parlak
        ])
    };

    const statuses = [entropi, momentum, dolaniklik, spin, isima];


    const rand = getVal(7) / 100;
    const shaped = 1 - Math.abs(rand - 0.5) * 2;
    const radius = Math.pow(shaped, 0.7) * 42;

    const angle = (getVal(6) / 100) * 2 * Math.PI;

    const userX = 50 + radius * Math.cos(angle);
    const userY = 50 + radius * Math.sin(angle);

    let closestDist = Infinity;
    let closestParticle = particles[0];

    particles.forEach(p => {
        const dx = p.x - userX;
        const dy = p.y - userY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
            closestDist = dist;
            closestParticle = p;
        }
    });

    return {
        seed,
        name,
        sentence,
        statuses,
        userPos: { x: userX, y: userY },
        particle: closestParticle,
        allParticles: particles
    };
};
