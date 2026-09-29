// --- 3D Background with Three.js (Network Constellation) ---
const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0b0f19, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 150;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Create Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 200;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 400;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 1.5,
    color: 0xff3b30,
    transparent: true,
    opacity: 0.8,
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create a static network (Icosahedron with high detail) to simulate connecting lines
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x4a4e69,
    transparent: true,
    opacity: 0.2
});

const netGeometry = new THREE.IcosahedronGeometry(200, 3);
const netMesh = new THREE.LineSegments(
    new THREE.WireframeGeometry(netGeometry),
    lineMaterial
);
scene.add(netMesh);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    netMesh.rotation.y += 0.0005;
    netMesh.rotation.x += 0.0002;
    
    particlesMesh.rotation.y += 0.0005;

    // Parallax
    camera.position.x += (mouseX * 15 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 15 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Interactive Terminal Logic ---
const termInput = document.getElementById('terminal-input');
const termBody = document.getElementById('terminal-body');

const fileSystem = {
    'projects.txt': 'DIGI-NETRA (OSINT), Vehicle Info Lookup Tool',
    'skills.txt': 'Python, SQL, VAPT, Web Security, OSINT, Docker',
    'contact.txt': 'Email: bisenranjeet043@gmail.com | GitHub: Pwnxotus | TryHackMe: pwnxotus',
    'secret.key': 'ACCESS DENIED. THIS ACTION WILL BE LOGGED.'
};

const commands = {
    'help': 'Available commands: whoami, ls, cat [file], clear, neofetch, sudo',
    'whoami': 'root@pwnxotus',
    'ls': 'projects.txt  skills.txt  contact.txt  secret.key',
    'neofetch': `
        <span style="color: #ff3b30">pwnxotus@kali</span>
        -------------------
        OS: RanjeetOS (Hacker Edition)
        Kernel: 5.15.0-cyber
        Uptime: 24/7 Threat Hunting
        Shell: bash 5.1.16
        Role: Cyber Security Analyst & Pentester
    `,
    'sudo': 'Nice try. This incident will be reported.',
    'clear': 'CLEAR_SIGNAL'
};

// Typewriter effect for initial boot
const bootSequence = [
    'Initializing pwnxotus framework...',
    'Loading cyber-sec modules [OK]',
    'Bypassing mainframe... [OK]',
    'Establishing secure connection...',
    'Welcome, Ranjeet Bisen. System ready.',
    'Type "help" for a list of available commands.'
];

let bootIndex = 0;
function runBootSequence() {
    if (bootIndex < bootSequence.length) {
        printLine(bootSequence[bootIndex]);
        bootIndex++;
        setTimeout(runBootSequence, 300);
    }
}

setTimeout(runBootSequence, 500);

if(termInput) {
    termInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const val = termInput.value.trim();
            if (val) {
                printLine(`<span style="color: #ff3b30">root@pwnxotus:~$</span> ${val}`, '#ffffff');
                
                const args = val.split(' ');
                const cmd = args[0].toLowerCase();

                if (cmd === 'clear') {
                    termBody.innerHTML = '';
                } else if (cmd === 'cat') {
                    if (args.length > 1) {
                        const file = args[1];
                        if (fileSystem[file]) {
                            printLine(fileSystem[file], file === 'secret.key' ? '#ff3b30' : '#ffffff');
                        } else {
                            printLine(`cat: ${file}: No such file or directory`, '#a0aab2');
                        }
                    } else {
                        printLine('cat: missing operand', '#a0aab2');
                    }
                } else if (commands[cmd]) {
                    printLine(commands[cmd], '#ffffff');
                } else {
                    printLine(`bash: ${cmd}: command not found`, '#a0aab2');
                }
            }
            termInput.value = '';
        }
    });
}

function printLine(text, color = '#a0aab2') {
    if(!termBody) return;
    const div = document.createElement('div');
    div.className = 'output-line';
    div.style.color = color;
    div.innerHTML = text;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
}

// Focus terminal input when clicking on terminal
const terminalWindow = document.querySelector('.terminal-window');
if(terminalWindow && termInput) {
    terminalWindow.addEventListener('click', () => {
        termInput.focus();
    });
}

// Tab Switching Logic for About Section
const tabs = document.querySelectorAll('.tab-header span');
const tabContents = document.querySelectorAll('.tab-content');

if(tabs.length > 0) {
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            // Reset active tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.style.opacity = '0';
            });
            
            // Show target tab content
            const targetId = tab.getAttribute('data-target');
            if (targetId) {
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.style.display = 'grid'; // Ensure grid layout is preserved
                    setTimeout(() => {
                        targetContent.style.opacity = '1';
                        targetContent.style.transition = 'opacity 0.3s ease';
                    }, 50);
                }
            }
        });
    });
}

// --- Typing Effect ---
const words = [
    "Precision & Intelligence.",
    "Advanced Strategies.",
    "Zero-Trust Methods.",
    "Deep Analytics."
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector('.typing-text');

function typeEffect() {
    if(!typingElement) return;

    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2500; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before typing new word
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect
setTimeout(typeEffect, 1000);

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.reveal');

// Initialize section titles for typing effect
document.querySelectorAll('.section-title h2 span').forEach(span => {
    span.dataset.originalText = span.textContent;
    span.textContent = '';
});

function typeOut(element, text, index) {
    if(element.dataset.isTyping === "false") return;
    
    if(index < text.length) {
        element.textContent = text.substring(0, index + 1);
        setTimeout(() => typeOut(element, text, index + 1), 60);
    }
}

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Trigger typing effect for section title
            const titleSpan = entry.target.classList.contains('section-title') 
                ? entry.target.querySelector('h2 span') 
                : null;
                
            if(titleSpan && titleSpan.dataset.isTyping !== "true") {
                titleSpan.dataset.isTyping = "true";
                titleSpan.textContent = '';
                typeOut(titleSpan, titleSpan.dataset.originalText, 0);
            }
        } else {
            entry.target.classList.remove('active');
            
            // Reset typing effect
            const titleSpan = entry.target.classList.contains('section-title') 
                ? entry.target.querySelector('h2 span') 
                : null;
                
            if(titleSpan) {
                titleSpan.dataset.isTyping = "false";
                titleSpan.textContent = '';
            }
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Logo Typing Effect
const logoWhite = document.getElementById('logo-white');
const logoRed = document.getElementById('logo-red');
if (logoWhite && logoRed) {
    const logoWords = [
        { text: "Pwnxotus.", splitAt: 0 },
        { text: "Ranjeet Bisen.", splitAt: 8 }
    ];
    let logoWordIdx = 0;
    let logoCharIdx = 0;
    let logoIsDeleting = false;

    function typeLogo() {
        const currentObj = logoWords[logoWordIdx];
        const currentWord = currentObj.text;
        
        if (logoIsDeleting) {
            logoCharIdx--;
        } else {
            logoCharIdx++;
        }
        
        let currentStr = currentWord.substring(0, logoCharIdx);
        
        if (currentStr.length <= currentObj.splitAt) {
            logoWhite.textContent = currentStr;
            logoRed.textContent = "";
        } else {
            logoWhite.textContent = currentWord.substring(0, currentObj.splitAt);
            logoRed.textContent = currentStr.substring(currentObj.splitAt);
        }

        let typeSpeed = logoIsDeleting ? 100 : 200;

        if (!logoIsDeleting && logoCharIdx === currentWord.length) {
            typeSpeed = 2000;
            logoIsDeleting = true;
        } else if (logoIsDeleting && logoCharIdx === 0) {
            logoIsDeleting = false;
            logoWordIdx = (logoWordIdx + 1) % logoWords.length;
            typeSpeed = 500;
        }

        setTimeout(typeLogo, typeSpeed);
    }
    setTimeout(typeLogo, 800);
}

// Floating Nav Active State on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.floating-nav a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});


