const participants = [
    'Bruno Matos',
    'Armindo Ribeiro',
    'Sérgio Couto',
    'Bruno Pereira',
    'Paulo Couto',
    'João Ribeiro',
    'Bruno Fernandes',
    'Cristiano Pimenta',
    'Vilaça',
    'Tiago',
    'Paulo Alves',
    'Filipe Carvalo',
    'Rubén Mesquita',
    'João Machado',
    'Roberto',
    'Sandrina',
    'Claudia',
    'Miguel',
    'Nelson'
];

const prizes = ['FICA', 'RUA'];

let canvas = document.getElementById('wheelCanvas');
let ctx = canvas.getContext('2d');
let spinBtn = document.getElementById('spinBtn');
let resetBtn = document.getElementById('resetBtn');
let resultDiv = document.getElementById('result');
let participantsList = document.getElementById('participantsList');

let isSpinning = false;
let currentRotation = 0;
let spunParticipants = new Set();

// Desenhar a roleta
function drawWheel() {
    const radius = 200;
    const sliceAngle = (2 * Math.PI) / participants.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    participants.forEach((participant, index) => {
        const startAngle = index * sliceAngle + currentRotation;
        const endAngle = (index + 1) * sliceAngle + currentRotation;
        
        // Cores alternadas
        ctx.fillStyle = index % 2 === 0 ? '#FF6B6B' : '#4ECDC4';
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        
        // Contorno
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Texto
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(participant, radius - 20, 5);
        ctx.restore();
    });
}

// Inicializar lista de participantes
function initParticipantsList() {
    participantsList.innerHTML = '';
    participants.forEach(participant => {
        const badge = document.createElement('div');
        badge.className = 'participant-badge';
        badge.textContent = participant;
        badge.id = `participant-${participant}`;
        participantsList.appendChild(badge);
    });
}

// Girar a roleta
function spinWheel() {
    if (isSpinning || spunParticipants.size >= participants.length) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    resultDiv.textContent = '';
    
    // Rotação aleatória entre 5 e 8 rotações completas
    const spins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 2 * Math.PI;
    const targetRotation = currentRotation + spins * 2 * Math.PI + randomAngle;
    
    const startTime = Date.now();
    const duration = 3000; // 3 segundos
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function para desaceleração
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = currentRotation + (targetRotation - currentRotation) * (easeProgress / (1 - (easeProgress - progress)));
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            currentRotation = targetRotation;
            drawWheel();
            isSpinning = false;
            showResult();
            spinBtn.disabled = false;
        }
    }
    
    animate();
}

// Mostrar resultado
function showResult() {
    const sliceAngle = (2 * Math.PI) / participants.length;
    const normalizedRotation = ((currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const pointerAngle = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
    const selectedIndex = Math.floor(pointerAngle / sliceAngle) % participants.length;
    
    const selectedParticipant = participants[selectedIndex];
    const selectedPrize = prizes[Math.floor(Math.random() * prizes.length)];
    
    resultDiv.innerHTML = `<div style="animation: pulse 0.5s;"><strong>${selectedParticipant}</strong> - ${selectedPrize}</div>`;
    
    // Marcar participante como já girado
    spunParticipants.add(selectedParticipant);
    const badge = document.getElementById(`participant-${selectedParticipant}`);
    if (badge) badge.classList.add('spun');
    
    // Mensagem quando todos já giraram
    if (spunParticipants.size === participants.length) {
        resultDiv.innerHTML += '<p style="margin-top: 20px; color: #2ecc71; font-size: 1.2em;">🎊 Todos os colaboradores já giraram! 🎊</p>';
    }
}

// Reiniciar
function resetWheel() {
    currentRotation = 0;
    spunParticipants.clear();
    resultDiv.textContent = '';
    isSpinning = false;
    spinBtn.disabled = false;
    initParticipantsList();
    drawWheel();
}

// Event listeners
spinBtn.addEventListener('click', spinWheel);
resetBtn.addEventListener('click', resetWheel);

// Inicializar
initParticipantsList();
drawWheel();

// Adicionar animação pulse ao CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);