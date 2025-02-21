const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = 800;
const HEIGHT = 800;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };
const RADIUS = 300;
const SPIN_SLOWDOWN = 0.98;
const MIN_SPEED = 0.001;

// Colors
const GOLD = '#FFD700';
const BLACK = '#1A1A1A';
const WHITE = '#FFFFFF';
const MAROON = '#800000';

// Historical figures with exact filenames
const FIGURES = [
    {name: "AMINA", img: "images/Leaders_Amina_400x240.avif"},
    {name: "ASHOKA", img: "images/Civilizations_Ashoka_400x240.avif"},
    {name: "AUGUSTUS", img: "images/Civilizations_Augustus_400x240.avif"},
    {name: "BENJAMIN FRANKLIN", img: "images/Leaders_Benji_400x240.avif"},
    {name: "CATHERINE THE GREAT", img: "images/Leaders_Catherine_400x240.avif"},
    {name: "CHARLEMAGNE", img: "images/Leaders_Charlemagne_400x240.avif"},
    {name: "CONFUCIUS", img: "images/Civilizations_Confusius_400x240.avif"},
    {name: "FRIEDRICH", img: "images/Leaders_400x240Friedrich.avif"},
    {name: "HARRIET TUBMAN", img: "images/Leaders_Harriet_400x240.avif"},
    {name: "HATSHEPSUT", img: "images/Civilizations_Hatshepsut_400x240.avif"},
    {name: "HIMIKO", img: "images/Leaders_400x240Himiko.avif"},
    {name: "IBN BATTUTA", img: "images/Leaders_Ibn_Battuta_400x240.avif"},
    {name: "ISABELLA", img: "images/Civilizations_Isabella_400x240.avif"},
    {name: "JOSE RIZAL", img: "images/Leaders_Jose-Rizal_400x240.avif"},
    {name: "LAFAYETTE", img: "images/Leaders_Lafayette_400x240.avif"},
    {name: "MACHIAVELLI", img: "images/Civilizations_Machiavelli_400x240.avif"},
    {name: "NAPOLEON", img: "images/Leaders_Napoleon_400x240.avif"},
    {name: "PACHACUTI", img: "images/Civilizations_Pachacuti_400x240.avif"},
    {name: "TECUMSEH", img: "images/Civilizations_Tecumseh_400x240.avif"},
    {name: "TRUNG TRAC", img: "images/Civilizations_TrungTrac_400x240.avif"},
    {name: "XERXES", img: "images/Civilizations_Xerxes_400x240.avif"}
];

// Preload images
const images = FIGURES.map(figure => {
    const img = new Image();
    img.src = figure.img;
    return img;
});

let angle = 0;
let spinning = false;
let spinSpeed = 0;
let selected = null;
let animationId;

const SPIN_SOUND = new Audio('sounds/spinning-wheel.mp3'); 
SPIN_SOUND.loop = true;
const BELL_SOUND = new Audio('sounds/bell-ding.mp3'); 

function drawWheel() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Draw main circle with dark background
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y, RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = BLACK;
    ctx.fill();
    
    const segmentAngle = (Math.PI * 2) / FIGURES.length;
    
    // Add initial -90 degree rotation (π/2) to start at top
    const startOffset = -Math.PI/2;
    
    // Draw segments
    for (let i = 0; i < FIGURES.length; i++) {
        const startAngle = i * segmentAngle + angle + startOffset;
        const endAngle = (i + 1) * segmentAngle + angle + startOffset;
        
        // Draw image with offset
        const imgAngle = startAngle + segmentAngle / 2;
        const imgRadius = RADIUS * 0.7;
        const imgX = CENTER.x + imgRadius * Math.cos(imgAngle);
        const imgY = CENTER.y + imgRadius * Math.sin(imgAngle);

        // Draw segment lines in white above images
        ctx.beginPath();
        
        ctx.save();
        ctx.translate(imgX, imgY);
        ctx.rotate(imgAngle + Math.PI / 2);
        
        // Draw middle half of image while maintaining aspect ratio
        // Source aspect ratio is 200:240 (width:height) = 0.833
        // For a destination width of 60px, height should be 72px to maintain ratio
        ctx.drawImage(images[i], 
            100, 0, 200, 240,    // source coordinates (x,y,width,height)
            -30, -36, 60, 72     // destination coordinates (x,y,width,height)
        ); 
        
        ctx.restore();

        // Draw segment lines in white above images
        ctx.beginPath();
        ctx.moveTo(CENTER.x, CENTER.y);
        ctx.lineTo(
            CENTER.x + RADIUS * Math.cos(startAngle),
            CENTER.y + RADIUS * Math.sin(startAngle)
        );
        ctx.strokeStyle = WHITE;
        ctx.lineWidth = 2;
        ctx.stroke();

        if ( i == FIGURES.length - 1) {
            ctx.beginPath();
            ctx.moveTo(CENTER.x, CENTER.y);
            ctx.lineTo(
                CENTER.x + RADIUS * Math.cos(angle + startOffset),
                CENTER.y + RADIUS * Math.sin(angle + startOffset)
            );
            ctx.strokeStyle = WHITE;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    // Draw outer circle in white
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y, RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = WHITE;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(CENTER.x, CENTER.y - RADIUS + 10);
    ctx.lineTo(CENTER.x - 10, CENTER.y - RADIUS - 20);
    ctx.lineTo(CENTER.x + 10, CENTER.y - RADIUS - 20);
    ctx.closePath();
    ctx.fillStyle = GOLD;
    ctx.fill();
    
    // Draw selected text
    if (selected && !spinning) {
        ctx.font = '36px Arial';
        ctx.fillStyle = BLACK;
        ctx.textAlign = 'center';
        ctx.fillText(`Selected: ${selected}`, WIDTH/2, HEIGHT - 50);
    }
}

function getSelectedFigure() {
    // Normalize the angle to be between 0 and 2π
    let normalizedAngle = angle % (Math.PI * 2);
    if (normalizedAngle < 0) {
        normalizedAngle += Math.PI * 2;
    }
    
    // Calculate segment size
    const segmentAngle = (Math.PI * 2) / FIGURES.length;
    let adjustedAngle = (normalizedAngle + segmentAngle) % 360;
    
    // Calculate the index of the selected figure
    const selectedIndex = FIGURES.length - Math.floor(adjustedAngle / segmentAngle);
    
    // Handle wrap-around
    const index = selectedIndex % FIGURES.length;
    
    return FIGURES[index].name;
}

function animate() {
    if (spinning) {
        angle += spinSpeed;
        spinSpeed *= SPIN_SLOWDOWN;
        
        if (SPIN_SOUND.paused) {
            SPIN_SOUND.play();
        }
        
        if (spinSpeed < MIN_SPEED) {
            spinning = false;
            selected = getSelectedFigure();
            // Stop spinning sound and play bell
            SPIN_SOUND.pause();
            SPIN_SOUND.currentTime = 0;
            BELL_SOUND.play();
        }
    }
    
    drawWheel();
    animationId = requestAnimationFrame(animate);
}

document.getElementById('spinButton').addEventListener('click', () => {
    if (!spinning) {
        spinning = true;
        spinSpeed = Math.random() * 0.2 + 0.1;
        selected = null;
    }
});

// Start animation
animate();
