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

// Historical figures
const FIGURES = [
    "AMINA", "ASHOKA", "AUGUSTUS",
    "BENJAMIN FRANKLIN", "CATHERINE THE GREAT", "CHARLEMAGNE",
    "CONFUCIUS", "FRIEDRICH", "HARRIET TUBMAN",
    "HATSHEPSUT", "HIMIKO", "IBN BATTUTA",
    "ISABELLA", "JOSE RIZAL", "LAFAYETTE",
    "MACHIAVELLI", "NAPOLEON", "PACHACUTI",
    "TECUMSEH", "TRUNG TRAC", "XERXES"
];

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
        
        // Draw text
        const textAngle = startAngle + segmentAngle / 2;
        const textRadius = RADIUS * 0.7;
        const textX = CENTER.x + textRadius * Math.cos(textAngle);
        const textY = CENTER.y + textRadius * Math.sin(textAngle);
        
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI / 2);
        ctx.fillStyle = BLACK;
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(FIGURES[i], 0, 0);
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
    return FIGURES[index];
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