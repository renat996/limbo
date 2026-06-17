document.addEventListener('DOMContentLoaded', () => {
    
    const overlay = document.querySelector('.flashlight-overlay');
    if (overlay) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            overlay.style.background = `radial-gradient(circle 250px at ${x}px ${y}px, transparent 100%, rgba(0, 0, 0, 0.95) 400px)`;
        });
    }

    function showSection(id) {
        document.querySelectorAll('.section').forEach(el => el.style.display = 'none');
        const targetSection = document.getElementById(id);
        if (targetSection) targetSection.style.display = 'block';
    }

    const slides = [
        {
            tag: "Location 01 — The Wood",
            title: "The forest holds no mercy",
            desc: "A gloomy forest where every tree conceals a threat. The boy’s first steps are taken in absolute darkness, with no clues and no explanations.",
            img: "./img/limbo2.jpg"
        },
        {
            tag: "Location 02 — The Spider",
            title: "Not all shadows are empty",
            desc: "A giant spider — the first guardian of this world. It is patient. It waits. And it is much faster than it appears.",
            img: "./img/spider.jpg"
        },
        {
            tag: "Location 03 — The Factory",
            title: "The machines never sleep",
            desc: "Deeper into the world — rusted machinery and deadly saws. Here, nature yields to an industrial nightmare.",
            img: "./img/factor.jpg"
        },
        {
            tag: "Location 04 — The City",
            title: "Someone built this place. Someone left.",
            desc: "Abandoned buildings, gravitational traps and children who hunt you. Civilization turned out to be no safer than the forest.",
            img: "./img/city.jpg"
        }
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
            if (sImg) {
                sImg.src = s.img;
                sImg.style.opacity = '1';
            }
            if (sNum) sNum.textContent = String(cur + 1).padStart(2, '0') + ' / 04';
            
            document.querySelectorAll('.dot').forEach((d, idx) => d.classList.toggle('active', idx === cur));
        }, 150);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(cur - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(cur + 1));
    
    document.querySelectorAll('.dot').forEach(d => {
        d.addEventListener('click', () => goTo(+d.dataset.i));
    });

    const sImgElement = document.getElementById('s-img');
    if (sImgElement) {
        sImgElement.style.transition = 'opacity 0.2s ease';
    }

    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const videoFrame = document.getElementById('youtubeVideo');
    const videoPlayer = document.getElementById('limboVideo'); 
    
    const targetVideoSrc = "https://youtube-nocookie.com";
    const openButtons = document.querySelectorAll('.open-trailer-btn');

    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('#')) {
                return; 
            }
            
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
            if (videoPlayer) {
                videoPlayer.pause();
                videoPlayer.currentTime = 0;
            }
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

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
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
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
                    if (statusTag) {
                        statusTag.textContent = "BOY ELIMINATED";
                        statusTag.className = "status-danger";
                        statusTag.style.color = "#a66";
                    }
                    logText.style.color = "#a66";
                } else {
                    if (statusTag) {
                        statusTag.textContent = "TRIAL SUCCESSFUL";
                        statusTag.className = "status-idle";
                        statusTag.style.color = "#6a6";
                    }
                    logText.style.color = "#ccc";
                }
            });
        });
    }
});
    const charactersData = {
        boy: {
            title: "The Boy",
            role: "Protagonist",
            img: "./img/мальчик.jpg",
            desc: "A nameless young boy who wakes up in the middle of a gloomy, monochrome forest. Armed with nothing but his reflexes, determination, and fragile life, he steps forward into absolute danger to find his missing sister."
        },
        sister: {
            title: "The Sister",
            role: "The Objective",
            img: "./img/si.png",
            desc: "The boy's missing sister. Little is known about her or why she disappeared. She represents the only beacon of light and hope in this monochromatic purgatory, drawing the boy deeper into dangerous machinery and urban ruins."
        },
        spider: {
            title: "The Spider",
            role: "The Stalker",
            img: "./img/spider.jpg",
            desc: "A massive, terrifying creature guarding the deep woods. It is smart, patient, and attacks from the shadows. To pass it, the boy cannot rely on speed alone — he must weaponize the environment against it."
        },
        children: {
            title: "The Lost Children",
            role: "The Hostile Tribe",
            img: "./img/url.webp",
            desc: "Other children trapped in this cruel world. Instead of helping, they have turned savage. They set elaborate traps, use blowdarts, and actively hunt the boy down, defending their territories with ruthless aggression."
        }
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
                    if (charImg) {
                        charImg.src = data.img;
                        charImg.alt = data.title;
                        charImg.style.opacity = '1';
                    }
                }, 200);
            });
        });
    }
    const trailerData = {
        "https://youtube-nocookie.com": {
            title: "Teaser Trailer (2010)",
            text: "The initial atmospheric look into the monochromatic horror platformer. No words, no music — just the chilling ambience of the woods and mechanical sounds of traps."
        },
        "https://youtube-nocookie.com": {
            title: "Launch Trailer (Official)",
            text: "The full release presentation showcasing the advanced industrial factory puzzles, gravitational anomalies, urban ruins, and intense survival gameplay elements."
        }
    };

    const videoButtons = document.querySelectorAll('.video-switch-btn');
    const videoFrameElement = document.getElementById('main-youtube-video');
    const videoTitleElement = document.getElementById('video-title');
    const videoTextElement = document.getElementById('video-text');

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
    document.addEventListener('DOMContentLoaded', () => {
    
    const regModal = document.getElementById('registerModal');
    const closeRegBtn = document.getElementById('closeRegModalBtn');
    const regForm = document.getElementById('regForm');
    const regPhone = document.getElementById('regPhone');
    const regEmail = document.getElementById('regEmail');

    function showRegisterModal() {
        if (regModal) {
            regModal.style.display = 'flex'; 
            setTimeout(() => {
                regModal.classList.add('show-fade');
            }, 10);
        }
    }

    function hideRegisterModal() {
        if (regModal) {
            regModal.classList.remove('show-fade');
            setTimeout(() => {
                regModal.style.display = 'none';
            }, 600); 
        }
    }

    if (regModal) {
        setTimeout(showRegisterModal, 10000);
    }

    if (regPhone) {
        regPhone.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }

    if (closeRegBtn) {
        closeRegBtn.addEventListener('click', hideRegisterModal);
    }
    window.addEventListener('click', (event) => {
        if (event.target === regModal) {
            hideRegisterModal();
        }
    });

    if (regForm) {
        const submitBtn = regForm.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault(); 

                if (!regPhone.value.trim() || !regEmail.value.trim()) {
                    alert('Please fill in all fields.');
                    return;
                }

                const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                if (!emailPattern.test(regEmail.value)) {
                    alert('Please enter a valid email address.');
                    return;
                }

                const modalContent = document.querySelector('.reg-modal-content');
                if (modalContent) {
                    modalContent.innerHTML = `
                        <span class="reg-close-btn" id="closeRegModalBtn" style="position: absolute; top: 15px; right: 20px; color: #555; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
                        <h2 style="color: #6a6; text-align: center; margin-top: 20px; font-family: sans-serif;">WELCOME TO THE SHADOWS</h2>
                        <p style="color: #888; text-align: center; margin-bottom: 20px; font-family: sans-serif;">Your progress has been successfully linked.</p>
                    `;
                    
                    const newCloseBtn = document.getElementById('closeRegModalBtn');
                    if (newCloseBtn) {
                        newCloseBtn.addEventListener('click', hideRegisterModal);
                    }
                    
                    setTimeout(hideRegisterModal, 2000);
                }
            });
        }
    }
});

