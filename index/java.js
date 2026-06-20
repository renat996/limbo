document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.flashlight-overlay');
    if (overlay) {
        
        document.addEventListener('mousemove', (e) => {
            overlay.style.background = `radial-gradient(circle 250px at ${e.clientX}px ${e.clientY}px, transparent 100%, rgba(0,0,0,0.95) 400px)`;
        });

        
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            overlay.style.background = `radial-gradient(circle 150px at ${touch.clientX}px ${touch.clientY}px, transparent 100%, rgba(0,0,0,0.95) 300px)`;
        }, { passive: true });

        if ('ontouchstart' in window) {
            overlay.style.background = `radial-gradient(circle 150px at 50% 50%, transparent 100%, rgba(0,0,0,0.95) 300px)`;
        }
    }

    const slides = [
        { tag: "Location 01 — The Wood", title: "The forest holds no mercy", desc: "A gloomy forest where every tree conceals a threat. The boy's first steps are taken in absolute darkness, with no clues and no explanations.", img: "./img/limbo2.jpg" },
        { tag: "Location 02 — The Spider", title: "Not all shadows are empty", desc: "A giant spider — the first guardian of this world. It is patient. It waits. And it is much faster than it appears.", img: "./img/spider.jpg" },
        { tag: "Location 03 — The Factory", title: "The machines never sleep", desc: "Deeper into the world — rusted machinery and deadly saws. Here, nature yields to an industrial nightmare.", img: "./img/factor.jpg" },
        { tag: "Location 04 — The City", title: "Someone built this place. Someone left.", desc: "Abandoned buildings, gravitational traps and children who hunt you. Civilization turned out to be no safer than the forest.", img: "./img/city.jpg" }
    ];

    let cur = 0;
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    if (prevBtn && prevBtn.innerHTML === "") prevBtn.textContent = "←";
    if (nextBtn && nextBtn.innerHTML === "") nextBtn.textContent = "→";

    function goTo(i) {
        const sTag = document.getElementById('s-tag');
        if (!sTag) return;
        cur = (i + slides.length) % slides.length;
        const s = slides[cur];
        const sImg = document.getElementById('s-img');
        const sTitle = document.getElementById('s-title');
        const sDesc = document.getElementById('s-desc');
        const sNum = document.getElementById('s-num');
        if (sImg) sImg.style.opacity = '0.3';
        setTimeout(() => {
            if (sTag) sTag.textContent = s.tag;
            if (sTitle) sTitle.textContent = s.title;
            if (sDesc) sDesc.textContent = s.desc;
            if (sImg) { sImg.src = s.img; sImg.style.opacity = '1'; }
            if (sNum) sNum.textContent = String(cur + 1).padStart(2, '0') + ' / 04';
            document.querySelectorAll('.dot').forEach((d, idx) => d.classList.toggle('active', idx === cur));
        }, 150);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(cur - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(cur + 1));
    document.querySelectorAll('.dot').forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

    const sImgElement = document.getElementById('s-img');
    if (sImgElement) sImgElement.style.transition = 'opacity 0.2s ease';

    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const videoFrame = document.getElementById('youtubeVideo');
    const videoPlayer = document.getElementById('limboVideo');
    const targetVideoSrc = "https://youtube-nocookie.com";

    document.querySelectorAll('.open-trailer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('#')) return;
            e.preventDefault();
            if (modal) {
                modal.style.display = 'block';
                if (videoFrame) videoFrame.src = targetVideoSrc;
                if (videoPlayer) videoPlayer.play().catch(() => {});
            }
        });
    });

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            if (videoFrame) videoFrame.src = '';
            if (videoPlayer) { videoPlayer.pause(); videoPlayer.currentTime = 0; }
        }
    }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // ===== СКРОЛЛ =====
    const trailerScrollBtn = document.getElementById('trailer');
    if (trailerScrollBtn) {
        trailerScrollBtn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('#')) return;
            e.preventDefault();
            const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
            const startPosition = window.pageYOffset || document.documentElement.scrollTop;
            const distance = targetPosition - startPosition;
            const duration = 3000;
            let startTime = null;
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            function easeInOutQuad(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
            requestAnimationFrame(animation);
        });
    }

    const trapScenarios = {
        spider: [
            { text: "⚡ CRITICAL FAILURE: The giant spider was too fast. Its sharp leg pierces the darkness. The boy is trapped in a web.", death: true },
            { text: "⚙️ SUCCESS: You timed it perfectly! The boy dragged an iron bear trap right under the spider's leg. It retreats into the fog.", death: false }
        ],
        saw: [
            { text: "⚡ CRITICAL FAILURE: A split second too late. The heavy rusted buzz saw blades end the journey instantly.", death: true },
            { text: "⚙️ SUCCESS: Brilliant timing. The boy slides right under the blade just as it reaches its highest peak.", death: false }
        ],
        parasite: [
            { text: "⚡ CRITICAL FAILURE: A glowing maggot falls directly onto the boy's head. Lost control. Walking blindly into a deep pit.", death: true },
            { text: "⚙️ SUCCESS: The boy ran fast enough. The parasite splashes harmlessly on the cold concrete floor.", death: false }
        ]
    };

    let totalSimDeaths = 0;
    const trapButtons = document.querySelectorAll('.trap-btn');
    const logText = document.getElementById('log-text');
    const statusTag = document.getElementById('status-tag');
    const deathDisplay = document.getElementById('sim-death-count');

    if (trapButtons.length > 0 && logText) {
        trapButtons.forEach(button => {
            button.addEventListener('click', () => {
                const trapType = button.getAttribute('data-trap');
                if (!trapScenarios[trapType]) return;
                document.body.style.transition = 'none';
                document.body.style.backgroundColor = '#2b1b1b';
                setTimeout(() => {
                    document.body.style.transition = 'background-color 0.4s ease';
                    document.body.style.backgroundColor = '#1a1a1a';
                }, 50);
                const outcomes = trapScenarios[trapType];
                const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
                logText.textContent = randomOutcome.text;
                if (randomOutcome.death) {
                    totalSimDeaths++;
                    if (deathDisplay) deathDisplay.textContent = totalSimDeaths;
                    if (statusTag) { statusTag.textContent = "BOY ELIMINATED"; statusTag.className = "status-danger"; statusTag.style.color = "#a66"; }
                    logText.style.color = "#a66";
                } else {
                    if (statusTag) { statusTag.textContent = "TRIAL SUCCESSFUL"; statusTag.className = "status-idle"; statusTag.style.color = "#6a6"; }
                    logText.style.color = "#ccc";
                }
            });
        });
    }

    // ===== ПЕРСОНАЖИ =====
    const charactersData = {
        boy: { title: "The Boy", role: "Protagonist", img: "./img/мальчик.jpg", desc: "A nameless young boy who wakes up in the middle of a gloomy, monochrome forest. Armed with nothing but his reflexes, determination, and fragile life, he steps forward into absolute danger to find his missing sister." },
        sister: { title: "The Sister", role: "The Objective", img: "./img/si.png", desc: "The boy's missing sister. Little is known about her or why she disappeared. She represents the only beacon of light and hope in this monochromatic purgatory, drawing the boy deeper into dangerous machinery and urban ruins." },
        spider: { title: "The Spider", role: "The Stalker", img: "./img/spider.jpg", desc: "A massive, terrifying creature guarding the deep woods. It is smart, patient, and attacks from the shadows. To pass it, the boy cannot rely on speed alone — he must weaponize the environment against it." },
        children: { title: "The Lost Children", role: "The Hostile Tribe", img: "./img/url.webp", desc: "Other children trapped in this cruel world. Instead of helping, they have turned savage. They set elaborate traps, use blowdarts, and actively hunt the boy down, defending their territories with ruthless aggression." }
    };

    const charButtons = document.querySelectorAll('.char-nav-link');
    const charImg = document.getElementById('char-main-img');
    const charTitle = document.getElementById('char-title');
    const charRole = document.getElementById('char-role');
    const charDesc = document.getElementById('char-desc');

    if (charButtons.length > 0 && charTitle) {
        charButtons.forEach(button => {
            button.addEventListener('click', () => {
                const charKey = button.getAttribute('data-char');
                if (!charactersData[charKey]) return;
                const data = charactersData[charKey];
                charButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                if (charImg) charImg.style.opacity = '0';
                setTimeout(() => {
                    if (charTitle) charTitle.textContent = data.title;
                    if (charRole) charRole.textContent = data.role;
                    if (charDesc) charDesc.textContent = data.desc;
                    if (charImg) { charImg.src = data.img; charImg.alt = data.title; charImg.style.opacity = '1'; }
                }, 200);
            });
        });
    }

    // ===== ТРЕЙЛЕР =====
    const videoButtons = document.querySelectorAll('.video-switch-btn');
    const videoFrameElement = document.getElementById('main-youtube-video');
    const videoTitleElement = document.getElementById('video-title');
    const videoTextElement = document.getElementById('video-text');

    const trailerData = {
        "https://youtube-nocookie.com": {
            title: "Teaser Trailer (2010)",
            text: "The initial atmospheric look into the monochromatic horror platformer."
        }
    };

    if (videoButtons.length > 0 && videoFrameElement) {
        videoButtons.forEach(button => {
            button.addEventListener('click', () => {
                const videoSrc = button.getAttribute('data-video');
                if (!trailerData[videoSrc]) return;
                const data = trailerData[videoSrc];
                videoButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                videoFrameElement.src = videoSrc;
                if (videoTitleElement) videoTitleElement.textContent = data.title;
                if (videoTextElement) videoTextElement.textContent = data.text;
            });
        });
    }

    // ===== РЕГИСТРАЦИЯ =====
    const regModal = document.getElementById('registerModal');
    const closeRegBtn = document.getElementById('closeRegModalBtn');
    const regForm = document.getElementById('regForm');
    const regPhone = document.getElementById('regPhone');
    const regEmail = document.getElementById('regEmail');

    function showRegisterModal() {
        if (regModal) {
            regModal.style.display = 'flex';
            setTimeout(() => regModal.classList.add('show-fade'), 10);
        }
    }

    function hideRegisterModal() {
        if (regModal) {
            regModal.classList.remove('show-fade');
            setTimeout(() => regModal.style.display = 'none', 600);
        }
    }

    if (regModal) setTimeout(showRegisterModal, 10000);
    if (regPhone) regPhone.addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, ''); });
    if (closeRegBtn) closeRegBtn.addEventListener('click', hideRegisterModal);
    window.addEventListener('click', (e) => { if (e.target === regModal) hideRegisterModal(); });

    if (regForm) {
        const submitBtn = regForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (!regPhone.value.trim() || !regEmail.value.trim()) { alert('Please fill in all fields.'); return; }
                const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                if (!emailPattern.test(regEmail.value)) { alert('Please enter a valid email address.'); return; }
                const modalContent = document.querySelector('.reg-modal-content');
                if (modalContent) {
                    modalContent.innerHTML = `
                        <span class="reg-close-btn" id="closeRegModalBtn" style="position:absolute;top:15px;right:20px;color:#555;font-size:28px;font-weight:bold;cursor:pointer;">&times;</span>
                        <h2 style="color:#6a6;text-align:center;margin-top:20px;font-family:sans-serif;">WELCOME TO THE SHADOWS</h2>
                        <p style="color:#888;text-align:center;margin-bottom:20px;font-family:sans-serif;">Your progress has been successfully linked.</p>
                    `;
                    const newCloseBtn = document.getElementById('closeRegModalBtn');
                    if (newCloseBtn) newCloseBtn.addEventListener('click', hideRegisterModal);
                    setTimeout(hideRegisterModal, 2000);
                }
            });
        }
    }


    // ===== AI VOICE OF LIMBO =====
    const aiInput   = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiMessages = document.getElementById('aiMessages');

    function addMsg(text, type) {
        const div = document.createElement('div');
        div.className = `ai-msg ai-msg--${type}`;
        const dot = document.createElement('span');
        dot.className = 'ai-msg-dot';
        const span = document.createElement('span');
        span.textContent = text;
        div.appendChild(dot);
        div.appendChild(span);
        if (aiMessages) {
            aiMessages.appendChild(div);
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }
        return div;
    }

    async function askLimbo() {
        if (!aiInput || !aiMessages) return;
        const question = aiInput.value.trim();
        if (!question) return;
        aiInput.value = '';
        addMsg(question, 'user');

        const typing = addMsg('...', 'typing');

        try {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-6',
                    max_tokens: 1000,
                    system: `You are the Voice of Limbo — the dark, omniscient narrator of the game LIMBO by Playdead (2010). You speak in short, atmospheric, poetic sentences. You are mysterious, melancholic, never cheerful. You know everything about Limbo: the Boy, the Sister, the Spider, the Factory, the City, the physics puzzles, the parasite worms, the lost children who hunt. Answer questions about the game's world, lore, mechanics, characters, and atmosphere. Keep answers under 80 words. Speak as if the darkness itself is answering. Never break character. Never say you are an AI.`,
                    messages: [{ role: 'user', content: question }]
                })
            });
            const data = await res.json();
            typing.remove();
            const answer = data?.content?.[0]?.text || 'The void offers no answer.';
            addMsg(answer, 'reply');
        } catch (err) {
            typing.remove();
            addMsg('The darkness swallowed your question. Try again.', 'error');
        }
    }

    if (aiSendBtn) aiSendBtn.addEventListener('click', askLimbo);
    if (aiInput) aiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') askLimbo(); });

    // ===== HEARTBEAT (index.html) =====
    const hbCanvas = document.getElementById('heartbeatCanvas');
    const hbBpm = document.getElementById('hbBpm');
    const hbStatus = document.getElementById('hbStatus');

    if (hbCanvas) {
        const ctx = hbCanvas.getContext('2d');
        let points = [];
        let offset = 0;
        let bpm = 72;
        let alive = true;
        let flatTimer = null;
        let beatPhase = 0;

        function getBeat(x) {
            const cycle = (x % 120);
            if (cycle < 55) return 0;
            if (cycle < 60) return -((cycle - 55) / 5) * 18;
            if (cycle < 63) return ((cycle - 60) / 3) * 55;
            if (cycle < 66) return 55 - ((cycle - 63) / 3) * 75;
            if (cycle < 70) return -20 + ((cycle - 66) / 4) * 30;
            if (cycle < 75) return 10 - ((cycle - 70) / 5) * 10;
            return 0;
        }

        function drawHeartbeat() {
            if (!hbCanvas) return;
            const W = hbCanvas.width, H = hbCanvas.height;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, W, H);

            // grid lines
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.lineWidth = 1;
            for (let y = 0; y < H; y += 20) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }

            if (!alive) {
                // flatline
                ctx.strokeStyle = '#a66';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(0, H / 2);
                ctx.lineTo(W, H / 2);
                ctx.stroke();
                return;
            }

            ctx.strokeStyle = '#5a5';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#3a3';
            ctx.beginPath();
            for (let x = 0; x < W; x++) {
                const beatY = getBeat(x + offset);
                const y = H / 2 - beatY;
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            // moving dot
            const dotX = W - 40;
            const dotY = H / 2 - getBeat(dotX + offset);
            ctx.fillStyle = '#7c7';
            ctx.beginPath();
            ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
            ctx.fill();

            offset += 1.2;
            requestAnimationFrame(drawHeartbeat);
        }

        // Scroll detection — page gets darker and heart slows → flatlines
        window.addEventListener('scroll', () => {
            const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            if (!alive) return;
            if (scrollPct > 0.75) {
                bpm = Math.max(20, Math.round(72 - scrollPct * 70));
                if (hbBpm) hbBpm.textContent = bpm + ' BPM';
                if (scrollPct > 0.92 && alive) {
                    alive = false;
                    if (hbStatus) { hbStatus.textContent = 'FLATLINE'; hbStatus.style.color = '#a66'; }
                    if (hbBpm) { hbBpm.textContent = '0 BPM'; hbBpm.style.color = '#a66'; }
                }
            } else {
                bpm = 72;
                if (hbBpm) { hbBpm.textContent = '72 BPM'; hbBpm.style.color = ''; }
                if (hbStatus) { hbStatus.textContent = 'ALIVE'; hbStatus.style.color = ''; }
                alive = true;
            }
        });

        drawHeartbeat();
    }

    // ===== SHADOW SCANNER (characters.html) =====
    const scannerArena = document.getElementById('scannerArena');
    const scannerBeam = document.getElementById('scannerBeam');
    const scannerEntity = document.getElementById('scannerEntity');
    const scannerLog = document.getElementById('scannerLog');
    const scannerReading = document.getElementById('scannerReading');

    if (scannerArena) {
        const scannerZones = scannerArena.querySelectorAll('.scanner-zone');
        let scanLog = [];
        let currentEntity = null;
        let scanTimeout = null;

        const rarityColors = { rare: '#a66', uncommon: '#aa6', common: '#5a5', empty: '#333' };
        const rarityLabels = { rare: '⚠ RARE', uncommon: '◈ DETECTED', common: '· FOUND', empty: '— EMPTY' };

        scannerArena.addEventListener('mousemove', (e) => {
            const rect = scannerArena.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            if (scannerBeam) {
                scannerBeam.style.left = mx + 'px';
                scannerBeam.style.top = my + 'px';
                scannerBeam.style.opacity = '1';
            }

            let hit = null;
            scannerZones.forEach(zone => {
                const zRect = zone.getBoundingClientRect();
                const aRect = scannerArena.getBoundingClientRect();
                const zx = zRect.left - aRect.left, zy = zRect.top - aRect.top;
                if (mx >= zx && mx <= zx + zRect.width && my >= zy && my <= zy + zRect.height) {
                    hit = zone;
                }
            });

            if (hit) {
                const entity = hit.getAttribute('data-entity');
                const rarity = hit.getAttribute('data-rarity');
                const color = rarityColors[rarity] || '#555';
                const label = rarityLabels[rarity] || '·';

                if (entity !== currentEntity) {
                    currentEntity = entity;
                    if (scannerEntity) {
                        scannerEntity.textContent = entity;
                        scannerEntity.style.color = color;
                    }
                    if (scannerReading) scannerReading.querySelector('.scanner-reading-label').textContent = label;

                    clearTimeout(scanTimeout);
                    if (rarity !== 'empty') {
                        scanTimeout = setTimeout(() => {
                            const time = new Date().toLocaleTimeString('en', { hour12: false });
                            const entry = `[${time}] ${label} — ${entity}`;
                            scanLog.unshift(entry);
                            if (scanLog.length > 5) scanLog.pop();
                            if (scannerLog) {
                                scannerLog.innerHTML = scanLog.map((l, i) =>
                                    `<span class="scanner-log-line" style="opacity:${1 - i * 0.18};color:${i === 0 ? color : '#333'}">${l}</span>`
                                ).join('');
                            }
                        }, 600);
                    }
                }
            } else {
                currentEntity = null;
                if (scannerEntity) { scannerEntity.textContent = 'Move cursor into the dark'; scannerEntity.style.color = ''; }
                if (scannerReading) scannerReading.querySelector('.scanner-reading-label').textContent = 'SCANNING...';
            }
        });

        scannerArena.addEventListener('mouseleave', () => {
            if (scannerBeam) scannerBeam.style.opacity = '0';
            currentEntity = null;
        });
    }

    // ===== REFLEX TRIAL (gameplay.html) =====
    const reflexStartBtn = document.getElementById('reflexStartBtn');
    const reflexFlashBtn = document.getElementById('reflexFlashBtn');
    const reflexIdleMsg = document.getElementById('reflexIdleMsg');
    const reflexSaw = document.getElementById('reflexSaw');
    const reflexDangerBar = document.getElementById('reflexDangerBar');
    const reflexSurvived = document.getElementById('reflexSurvived');
    const reflexDied = document.getElementById('reflexDied');
    const reflexBest = document.getElementById('reflexBest');
    const reflexBoy = document.getElementById('reflexBoy');

    if (reflexStartBtn) {
        let survived = 0, died = 0, best = Infinity;
        let trialActive = false;
        let flashTimeout = null, dangerInterval = null;
        let flashedAt = null;
        let dangerPct = 0;

        function resetTrial() {
            trialActive = false;
            clearTimeout(flashTimeout);
            clearInterval(dangerInterval);
            if (reflexFlashBtn) reflexFlashBtn.style.display = 'none';
            if (reflexSaw) { reflexSaw.style.left = '-60px'; reflexSaw.style.color = '#a44'; }
            if (reflexBoy) reflexBoy.style.opacity = '1';
            if (reflexDangerBar) { reflexDangerBar.style.width = '0%'; reflexDangerBar.style.background = '#5a5'; }
            dangerPct = 0;
        }

        function playerDied() {
            died++;
            if (reflexDied) reflexDied.textContent = died;
            if (reflexBoy) reflexBoy.style.opacity = '0.15';
            if (reflexSaw) reflexSaw.style.left = '55%';
            if (reflexIdleMsg) { reflexIdleMsg.textContent = 'The boy is dead. Try again.'; reflexIdleMsg.style.display = 'block'; reflexIdleMsg.style.color = '#a66'; }
            if (reflexStartBtn) reflexStartBtn.textContent = 'Retry';
            resetTrial();
        }

        function playerSurvived() {
            const ms = Date.now() - flashedAt;
            survived++;
            if (ms < best) { best = ms; if (reflexBest) reflexBest.textContent = ms + 'ms'; }
            if (reflexSurvived) reflexSurvived.textContent = survived;
            if (reflexIdleMsg) { reflexIdleMsg.textContent = `Survived! Reaction: ${ms}ms`; reflexIdleMsg.style.display = 'block'; reflexIdleMsg.style.color = '#5a5'; }
            if (reflexStartBtn) reflexStartBtn.textContent = 'Next Round';
            if (reflexFlashBtn) reflexFlashBtn.style.display = 'none';
            resetTrial();
        }

        function startRound() {
            if (trialActive) return;
            trialActive = true;
            if (reflexIdleMsg) reflexIdleMsg.style.display = 'none';
            if (reflexBoy) reflexBoy.style.opacity = '1';
            if (reflexSaw) { reflexSaw.style.left = '-60px'; reflexSaw.style.transition = 'none'; }
            dangerPct = 0;
            if (reflexDangerBar) { reflexDangerBar.style.width = '0%'; reflexDangerBar.style.background = '#5a5'; }

            // Saw starts moving after random 1-3s
            const delay = 1000 + Math.random() * 2000;
            flashTimeout = setTimeout(() => {
                if (!trialActive) return;
                flashedAt = Date.now();
                if (reflexFlashBtn) reflexFlashBtn.style.display = 'flex';
                // Saw moves across — player has ~900ms
                if (reflexSaw) { reflexSaw.style.transition = 'left 0.9s linear'; reflexSaw.style.left = '110%'; }

                dangerInterval = setInterval(() => {
                    dangerPct += 8;
                    if (reflexDangerBar) {
                        reflexDangerBar.style.width = Math.min(dangerPct, 100) + '%';
                        reflexDangerBar.style.background = dangerPct > 60 ? '#a44' : dangerPct > 30 ? '#a84' : '#5a5';
                    }
                    if (dangerPct >= 100 && trialActive) {
                        clearInterval(dangerInterval);
                        playerDied();
                    }
                }, 70);
            }, delay);
        }

        reflexStartBtn.addEventListener('click', () => {
            resetTrial();
            setTimeout(startRound, 100);
            reflexStartBtn.textContent = 'Running...';
            reflexStartBtn.disabled = true;
            setTimeout(() => { reflexStartBtn.disabled = false; }, 500);
        });

        if (reflexFlashBtn) {
            reflexFlashBtn.addEventListener('click', () => {
                if (!trialActive || !flashedAt) return;
                playerSurvived();
            });
        }
    }

});
    const deathPullBtn = document.getElementById('deathPullBtn');
    const deathPullLabel = document.getElementById('deathPullLabel');
    const deathRecordIdle = document.getElementById('deathRecordIdle');
    const deathRecordEntry = document.getElementById('deathRecordEntry');
    const deathRecordId = document.getElementById('deathRecordId');
    const deathRecordText = document.getElementById('deathRecordText');
    const archiveDeathsTotal = document.getElementById('archiveDeathsTotal');
    const archiveDeathsKind = document.getElementById('archiveDeathsKind');
    const archiveDeathsZone = document.getElementById('archiveDeathsZone');
    let archivePullCount = 0;

    const deathZones = ['The Wood', 'The Swamp', 'The Factory', 'The City', 'The Ruins', 'The Tunnels'];
    const deathCauses = ['Severed', 'Crushed', 'Drowned', 'Impaled', 'Parasited', 'Sawed', 'Fallen'];

    async function pullDeathRecord() {
        if (!deathPullBtn) return;
        deathPullLabel.textContent = 'Retrieving...';
        deathPullBtn.disabled = true;

        const zone = deathZones[Math.floor(Math.random() * deathZones.length)];
        const cause = deathCauses[Math.floor(Math.random() * deathCauses.length)];
        archivePullCount++;

        try {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-6',
                    max_tokens: 1000,
                    system: `You are a cold, bureaucratic death recorder in the world of LIMBO (2010 game by Playdead). You write clinical death log entries for the boy's deaths. Each entry must have exactly this JSON structure and nothing else:
{"id":"LIMBO-DEATH-XXXX","zone":"zone name","cause":"one word cause","entry":"2-3 sentence atmospheric death description in past tense, clinical and eerie"}
Only return valid JSON. No markdown, no extra text.`,
                    messages: [{ role: 'user', content: `Generate death record. Zone: ${zone}. Cause category: ${cause}.` }]
                })
            });
            const data = await res.json();
            const raw = data?.content?.[0]?.text || '{}';
            const clean = raw.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(clean);

            if (deathRecordIdle) deathRecordIdle.style.display = 'none';
            if (deathRecordId) deathRecordId.textContent = parsed.id || `LIMBO-DEATH-${String(archivePullCount).padStart(4,'0')}`;
            if (deathRecordText) deathRecordText.textContent = parsed.entry || 'Record corrupted.';
            if (deathRecordEntry) deathRecordEntry.style.display = 'block';
            if (archiveDeathsTotal) archiveDeathsTotal.textContent = archivePullCount;
            if (archiveDeathsKind) archiveDeathsKind.textContent = parsed.cause || cause;
            if (archiveDeathsZone) archiveDeathsZone.textContent = parsed.zone || zone;
            deathPullLabel.textContent = 'Pull Another Record';
        } catch (e) {
            if (deathRecordIdle) deathRecordIdle.style.display = 'none';
            if (deathRecordText) deathRecordText.textContent = 'Record corrupted. The archive is silent.';
            if (deathRecordEntry) deathRecordEntry.style.display = 'block';
            if (deathRecordId) deathRecordId.textContent = `LIMBO-DEATH-ERR`;
            deathPullLabel.textContent = 'Retry';
        }
        deathPullBtn.disabled = false;
    }

    if (deathPullBtn) deathPullBtn.addEventListener('click', pullDeathRecord);

    // ===== CHARACTER DIALOGUE (characters.html) =====
    const charDialogueSend = document.getElementById('charDialogueSend');
    const charDialogueInput = document.getElementById('charDialogueInput');
    const charDialogueMessages = document.getElementById('charDialogueMessages');
    const charVoiceBtns = document.querySelectorAll('.char-voice-btn');

    let activeCharVoice = 'The Boy — a nameless child lost in Limbo, searching for his sister, silent but desperate';
    let activeCharName = 'The Boy';

    if (charVoiceBtns.length > 0) {
        charVoiceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                charVoiceBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCharVoice = btn.getAttribute('data-char');
                activeCharName = btn.getAttribute('data-name');
                if (charDialogueMessages) {
                    charDialogueMessages.innerHTML = `<div class="char-dlg-msg char-dlg-system"><span class="char-dlg-dot"></span><span>${activeCharName} stirs in the darkness...</span></div>`;
                }
            });
        });
    }

    function addDlgMsg(text, type, name) {
        if (!charDialogueMessages) return;
        const div = document.createElement('div');
        div.className = `char-dlg-msg char-dlg-${type}`;
        if (type === 'char') {
            div.innerHTML = `<span class="char-dlg-name">${name}</span><span class="char-dlg-text">${text}</span>`;
        } else {
            div.innerHTML = `<span class="char-dlg-dot"></span><span>${text}</span>`;
        }
        charDialogueMessages.appendChild(div);
        charDialogueMessages.scrollTop = charDialogueMessages.scrollHeight;
    }

    async function sendCharDialogue() {
        if (!charDialogueInput || !charDialogueMessages) return;
        const q = charDialogueInput.value.trim();
        if (!q) return;
        charDialogueInput.value = '';
        addDlgMsg(q, 'user', 'You');
        const typing = document.createElement('div');
        typing.className = 'char-dlg-msg char-dlg-typing';
        typing.innerHTML = `<span class="char-dlg-dot"></span><span>...</span>`;
        charDialogueMessages.appendChild(typing);
        charDialogueMessages.scrollTop = charDialogueMessages.scrollHeight;
        if (charDialogueSend) charDialogueSend.disabled = true;

        try {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-6',
                    max_tokens: 1000,
                    system: `You are roleplaying as: ${activeCharVoice}. You are in the world of LIMBO by Playdead (2010). Speak in character — brief, emotional, in-world. The boy speaks in broken, frightened fragments. The sister speaks like an echo or memory. The spider speaks in cold, ancient riddles. The lost child speaks in savage, territorial growls. Never break character. Never say you are an AI. Max 40 words.`,
                    messages: [{ role: 'user', content: q }]
                })
            });
            const data = await res.json();
            typing.remove();
            const answer = data?.content?.[0]?.text || '...';
            addDlgMsg(answer, 'char', activeCharName);
        } catch (e) {
            typing.remove();
            addDlgMsg('Only silence answers.', 'system', '');
        }
        if (charDialogueSend) charDialogueSend.disabled = false;
    }

    if (charDialogueSend) charDialogueSend.addEventListener('click', sendCharDialogue);
    if (charDialogueInput) charDialogueInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendCharDialogue(); });

    // ===== PUZZLE FORGE (gameplay.html) =====
    const puzzleForgeBtn = document.getElementById('puzzleForgeBtn');
    const puzzleForgeBtnLabel = document.getElementById('puzzleForgeBtnLabel');
    const puzzleIdle = document.getElementById('puzzleIdle');
    const puzzleResult = document.getElementById('puzzleResult');
    const puzzleResultZone = document.getElementById('puzzleResultZone');
    const puzzleResultName = document.getElementById('puzzleResultName');
    const puzzleResultDesc = document.getElementById('puzzleResultDesc');
    const puzzleResultSolution = document.getElementById('puzzleResultSolution');
    const puzzleZoneBtns = document.querySelectorAll('.puzzle-zone-btn');
    const puzzleDiffBtns = document.querySelectorAll('.puzzle-diff-btn');

    let selectedPuzzleZone = 'The Forest';
    let selectedPuzzleDiff = 'a devious but solvable puzzle';

    if (puzzleZoneBtns.length > 0) {
        puzzleZoneBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                puzzleZoneBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedPuzzleZone = btn.getAttribute('data-zone');
            });
        });
    }
    if (puzzleDiffBtns.length > 0) {
        puzzleDiffBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                puzzleDiffBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedPuzzleDiff = btn.getAttribute('data-diff');
            });
        });
    }

    async function forgePuzzle() {
        if (!puzzleForgeBtn) return;
        puzzleForgeBtnLabel.textContent = '⚙ Forging...';
        puzzleForgeBtn.disabled = true;

        try {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-6',
                    max_tokens: 1000,
                    system: `You design puzzle levels for LIMBO by Playdead (2010). The game uses physics, darkness, traps, and the environment. When given a zone and difficulty, respond ONLY with this exact JSON structure:
{"name":"Puzzle name (3-5 words)","zone":"zone name","description":"2-3 sentences describing what the player sees and the obstacle they face","solution":"1-2 sentences hinting at the solution without giving it fully away"}
Only return valid JSON. No markdown, no extra text.`,
                    messages: [{ role: 'user', content: `Zone: ${selectedPuzzleZone}. Create ${selectedPuzzleDiff}.` }]
                })
            });
            const data = await res.json();
            const raw = data?.content?.[0]?.text || '{}';
            const clean = raw.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(clean);

            if (puzzleIdle) puzzleIdle.style.display = 'none';
            if (puzzleResultZone) puzzleResultZone.textContent = (parsed.zone || selectedPuzzleZone).toUpperCase();
            if (puzzleResultName) puzzleResultName.textContent = parsed.name || 'Unnamed Trap';
            if (puzzleResultDesc) puzzleResultDesc.textContent = parsed.description || '';
            if (puzzleResultSolution) puzzleResultSolution.textContent = parsed.solution || '';
            if (puzzleResult) puzzleResult.style.display = 'block';
            puzzleForgeBtnLabel.textContent = '⚙ Forge Another';
        } catch (e) {
            if (puzzleIdle) puzzleIdle.style.display = 'none';
            if (puzzleResultName) puzzleResultName.textContent = 'The forge failed.';
            if (puzzleResultDesc) puzzleResultDesc.textContent = 'The darkness rejected the design. Try again.';
            if (puzzleResultSolution) puzzleResultSolution.textContent = '';
            if (puzzleResult) puzzleResult.style.display = 'block';
            puzzleForgeBtnLabel.textContent = '⚙ Retry';
        }
        puzzleForgeBtn.disabled = false;
    }

    if (puzzleForgeBtn) puzzleForgeBtn.addEventListener('click', forgePuzzle);

