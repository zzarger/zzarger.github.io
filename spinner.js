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
const BLACK = '#000000';
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

function drawWheel() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Draw main circle
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y, RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = GOLD;
    ctx.fill();
    
    const segmentAngle = (Math.PI * 2) / FIGURES.length;
    
    // Draw segments
    for (let i = 0; i < FIGURES.length; i++) {
        const startAngle = i * segmentAngle + angle;
        const endAngle = (i + 1) * segmentAngle + angle;
        
        // Alternate segment colors
        if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(CENTER.x, CENTER.y, RADIUS, startAngle, endAngle);
            ctx.strokeStyle = MAROON;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw segment lines
        ctx.beginPath();
        ctx.moveTo(CENTER.x, CENTER.y);
        ctx.lineTo(
            CENTER.x + RADIUS * Math.cos(startAngle),
            CENTER.y + RADIUS * Math.sin(startAngle)
        );
        ctx.strokeStyle = BLACK;
        ctx.stroke();
        
        // Draw image
        const imgAngle = startAngle + segmentAngle / 2;
        const imgRadius = RADIUS * 0.7;
        const imgX = CENTER.x + imgRadius * Math.cos(imgAngle);
        const imgY = CENTER.y + imgRadius * Math.sin(imgAngle);
        
        ctx.save();
        ctx.translate(imgX, imgY);
        ctx.rotate(imgAngle + Math.PI / 2);
        
        // Draw image (adjusted size for 400x240 aspect ratio)
        ctx.drawImage(images[i], -40, -24, 80, 48); // Doubled size but maintained aspect ratio
        
        ctx.restore();
    }
    
    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(CENTER.x, CENTER.y - RADIUS - 20);
    ctx.lineTo(CENTER.x - 10, CENTER.y - RADIUS + 10);
    ctx.lineTo(CENTER.x + 10, CENTER.y - RADIUS + 10);
    ctx.closePath();
    ctx.fillStyle = BLACK;
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
    const segmentAngle = 360 / FIGURES.length;
    const normalizedAngle = ((angle * 180 / Math.PI) % 360 + 360) % 360;
    const index = Math.floor(((360 - normalizedAngle) % 360) / segmentAngle);
    return FIGURES[index].name;
}

function animate() {
    if (spinning) {
        angle += spinSpeed;
        spinSpeed *= SPIN_SLOWDOWN;
        
        if (spinSpeed < MIN_SPEED) {
            spinning = false;
            selected = getSelectedFigure();
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
