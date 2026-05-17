// ============================================
// Wordle Gatekeeper Game
// ============================================
const SECRET_WORD = '1905';
const MAX_LETTERS = 4;

let currentGuess = '';
let hintClickCount = 0;
let hintUnlocked = false;

const wordleGate = document.getElementById('wordle-gate');
const wordleTiles = document.getElementById('wordleTiles');
const wordleInput = document.getElementById('wordleInput');
const wordleMessage = document.getElementById('wordleMessage');
const hintBtn = document.getElementById('hintBtn');
const hintText = document.getElementById('hintText');
const guessBtn = document.getElementById('guessBtn');
const confettiContainer = document.getElementById('confetti-container');
const mainSite = document.getElementById('main-site');
const wrongPopup = document.getElementById('wrongPopup');
const wrongPopupClose = document.getElementById('wrongPopupClose');
const tiles = wordleTiles.querySelectorAll('.tile');

wordleGate.addEventListener('click', () => wordleInput.focus());

wordleInput.addEventListener('input', (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, MAX_LETTERS);
    e.target.value = value;
    currentGuess = value;
    updateTiles();
});

function updateTiles() {
    tiles.forEach((tile, i) => {
        const letter = currentGuess[i] || '';
        tile.textContent = letter.toUpperCase();
        tile.classList.toggle('filled', !!letter);
        tile.classList.remove('correct', 'wrong');
    });
}

function submitGuess() {
    if (currentGuess.length < MAX_LETTERS) {
        showMessage('กรอกให้ครบ 4 ตัวอักษรก่อนนะ~ ✏️', false);
        return;
    }
    if (currentGuess === SECRET_WORD) {
        tiles.forEach(tile => tile.classList.add('correct'));
        showMessage('ถูกต้อง! เก่งมากเลย~ 🎉💕', false);
        unlockSite();
    } else {
        tiles.forEach(tile => tile.classList.add('wrong'));
        showWrongPopup();
        setTimeout(() => {
            currentGuess = '';
            wordleInput.value = '';
            updateTiles();
        }, 600);
    }
}

function showMessage(text, isError) {
    wordleMessage.textContent = text;
    wordleMessage.className = 'wordle-message' + (isError ? ' error' : '');
}

function unlockSite() {
    launchConfetti();
    setTimeout(() => {
        wordleGate.classList.add('fade-out');
        mainSite.classList.remove('hidden');
        initRevealObserver();
        createSparkles();
        initMusic();
        setTimeout(() => { wordleGate.style.display = 'none'; }, 800);
    }, 1500);
}

guessBtn.addEventListener('click', submitGuess);
wordleInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitGuess(); });

// ============================================
// Hint Button — Dodge mechanic
// ============================================
const dodgeMessages = [
    { emoji: '🤭', title: 'เอ๊ะ! ใจร้อนจัง' },
    { emoji: '😝', title: 'จับไม่ได้หรอก!' },
    { emoji: '🙈', title: 'ว้าย! หนีทัน!' },
    { emoji: '💨', title: 'หายตัวได้!' },
    { emoji: '🏃', title: 'วิ่งหนีแล้ว!' },
];

hintBtn.addEventListener('click', () => {
    if (hintUnlocked) {
        hintText.classList.toggle('show');
        hintBtn.textContent = hintText.classList.contains('show') ? '🙈 ซ่อนใบ้' : '💡 ใบ้ให้';
        return;
    }
    hintClickCount++;
    if (hintClickCount <= 3) {
        hintBtn.classList.add('dodging');
        const randX = 20 + Math.random() * (window.innerWidth - hintBtn.offsetWidth - 40);
        const randY = 20 + Math.random() * (window.innerHeight - hintBtn.offsetHeight - 40);
        hintBtn.style.left = randX + 'px';
        hintBtn.style.top = randY + 'px';
        const dodge = dodgeMessages[(hintClickCount - 1) % dodgeMessages.length];
        wordleMessage.textContent = `${dodge.emoji} ${dodge.title}`;
        wordleMessage.className = 'wordle-message';
        if (hintClickCount === 3) {
            setTimeout(() => {
                hintBtn.classList.remove('dodging');
                hintBtn.classList.add('tired');
                hintBtn.style.left = '';
                hintBtn.style.top = '';
                wordleMessage.textContent = 'โอเคๆ เหนื่อยแล้ว ยอมให้กดก็ได้~ 😮‍💨';
                setTimeout(() => {
                    hintBtn.classList.remove('tired');
                    hintUnlocked = true;
                    hintText.classList.add('show');
                    hintBtn.textContent = '🙈 ซ่อนใบ้';
                }, 500);
            }, 500);
        }
    }
});

// ============================================
// Wrong Answer Popup
// ============================================
const wrongMessages = [
    { emoji: '🤭', title: 'ผิดจ้า!', msg: 'ยังไม่ถุกน้า ลองนึกดีๆ ว่าวันสำคันของเราคือวันอารัย~' },
    { emoji: '😝', title: 'ไม่ใช่อ่ะ!', msg: 'Hint: ลองนึกถึงวันที่เราเจอกันครั้งแรก~' },
    { emoji: '🤦‍♀️', title: 'ใกล้แร้ว!', msg: '...ม่ายช่าย ลองใหม่นะ~' },
    { emoji: '😂', title: 'กั่ย!', msg: '...กั่ยมากก อ๊ะหยอกเร่น2552254848 คิดดีๆ นะจ๊ะ~' },
    { emoji: '🥲', title: 'ผิดหมดเลย...', msg: 'ตัวเลข 4 หลักนะ ไม่ยากหรอก ลองนึกถึงวันครบรอบเราสิ~' },
    { emoji: '💀', title: 'ถึงกับอึ้ง!', msg: 'จำวันครบรอบเราไม่ได้เลยเหรอ งอนแล้วนะ~ หยอกๆ' },
];

function showWrongPopup() {
    const pick = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
    document.getElementById('wrongEmoji').textContent = pick.emoji;
    document.getElementById('wrongTitle').textContent = pick.title;
    document.getElementById('wrongMessage').textContent = pick.msg;
    wrongPopup.classList.add('show');
}

function closeWrongPopup() {
    wrongPopup.classList.remove('show');
    wordleInput.focus();
}

wrongPopupClose.addEventListener('click', closeWrongPopup);
wrongPopup.addEventListener('click', (e) => { if (e.target === wrongPopup) closeWrongPopup(); });

// ============================================
// Confetti
// ============================================
function launchConfetti() {
    const colors = ['#ff4d6d', '#ff758f', '#ff9ec4', '#ffb3c1', '#ffccd5', '#fff', '#ffd6e0', '#ffc8dd'];
    for (let i = 0; i < 120; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + 'vw';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (Math.random() * 10 + 6) + 'px';
            piece.style.height = (Math.random() * 10 + 6) + 'px';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            const duration = Math.random() * 2 + 2;
            piece.style.animationDuration = duration + 's';
            confettiContainer.appendChild(piece);
            setTimeout(() => piece.remove(), (duration + 1) * 1000);
        }, i * 20);
    }
}

// ============================================
// Sparkle Particles (Background)
// ============================================
function createSparkles() {
    const container = document.getElementById('sparkle-container');
    const symbols = ['✨', '⭐', '💫', '✧', '⋆'];

    function spawn() {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        s.style.left = Math.random() * 100 + 'vw';
        s.style.top = (100 + Math.random() * 20) + 'vh';
        s.style.fontSize = (Math.random() * 12 + 8) + 'px';
        const dur = Math.random() * 10 + 8;
        s.style.animationDuration = dur + 's';
        s.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(s);
        setTimeout(() => s.remove(), (dur + 3) * 1000);
    }

    for (let i = 0; i < 20; i++) setTimeout(spawn, i * 200);
    setInterval(spawn, 600);
}

// ============================================
// Scroll Reveal (IntersectionObserver)
// ============================================
function initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================
// Days Counter (Live)
// ============================================
function updateDaysCounter() {
    const startDate = new Date('2025-05-19T00:00:00');
    const diff = new Date() - startDate;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById('counterDays').textContent = d;
    document.getElementById('counterHours').textContent = h;
    document.getElementById('counterMinutes').textContent = m;
    document.getElementById('counterSeconds').textContent = s;
}

updateDaysCounter();
setInterval(updateDaysCounter, 1000);

// ============================================
// Typewriter Effect
// ============================================
const typewriterMsg = 'ทุกวันที่มีเทอ... คือวันที่ดีที่สุดของเค้า 🥺❤️';
let charIdx = 0;

function typeWriter() {
    const el = document.getElementById('typewriterText');
    if (!el) return;
    if (charIdx < typewriterMsg.length) {
        el.textContent += typewriterMsg[charIdx];
        charIdx++;
        setTimeout(typeWriter, 80 + Math.random() * 40);
    }
}

const typewriterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && charIdx === 0) {
            typeWriter();
            typewriterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const twEl = document.getElementById('typewriterText');
if (twEl) typewriterObserver.observe(twEl.parentElement);

// ============================================
// Gift Boxes
// ============================================
document.querySelectorAll('.gift-box').forEach(box => {
    box.addEventListener('click', () => {
        if (box.classList.contains('opened')) return;
        box.classList.add('opened');
        const rect = box.getBoundingClientRect();
        createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 3);
    });
});

function createHeartBurst(x, y) {
    const hearts = ['💖', '💕', '💗', '✨', '🎀', '💝'];
    for (let i = 0; i < 8; i++) {
        const h = document.createElement('div');
        h.style.cssText = `position:fixed;pointer-events:none;font-size:1.2rem;z-index:200;left:${x}px;top:${y}px;animation:explode 0.8s ease-out forwards;`;
        h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        const angle = (Math.PI * 2 * i) / 8;
        const dist = Math.random() * 80 + 30;
        h.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        h.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 800);
    }
}

const explodeStyle = document.createElement('style');
explodeStyle.textContent = `@keyframes explode{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}`;
document.head.appendChild(explodeStyle);

// ============================================
// Flip Cards
// ============================================
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// ============================================
// Background Music
// ============================================
function initMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    if (!bgMusic || !musicBtn) return;

    let isPlaying = false;

    // Try auto-play after Wordle unlock (user interaction already happened)
    bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.textContent = '🎵';
        musicBtn.classList.add('playing');
    }).catch(() => {
        // Autoplay blocked — user needs to click
        musicBtn.textContent = '🔇';
    });

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            musicBtn.textContent = '🔇';
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicBtn.textContent = '🎵';
                musicBtn.classList.add('playing');
            }).catch(() => {});
        }
    });
}

// ============================================
// Loading Screen
// ============================================
const loadingScreen = document.getElementById('loading-screen');
if (loadingScreen) {
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => { loadingScreen.style.display = 'none'; }, 800);
    }, 1000);
}

// ============================================
// Init
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    wordleInput.focus();
    document.addEventListener('click', () => {
        if (wordleGate.style.display !== 'none') wordleInput.focus();
    });
});
