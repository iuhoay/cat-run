import { roomObjects, canvas, ctx } from 'game/state';

export function initRoomObjects() {
    if (!canvas) return;

    const centerY = canvas.height / 2 + 50;

    roomObjects.bed.x = canvas.width * 0.08;
    roomObjects.bed.y = centerY + 60;
    roomObjects.foodBowl.x = canvas.width * 0.10;
    roomObjects.foodBowl.y = centerY + 180;
    roomObjects.waterBowl.x = canvas.width * 0.22;
    roomObjects.waterBowl.y = centerY + 180;
    roomObjects.door.x = canvas.width * 0.5 - 40;
    roomObjects.door.y = centerY - 80;
    roomObjects.bathtub.x = canvas.width * 0.72;
    roomObjects.bathtub.y = centerY + 60;
    roomObjects.bathtub.full = true;
    roomObjects.litterBox.x = canvas.width * 0.85;
    roomObjects.litterBox.y = centerY + 80;
    roomObjects.litterBox.clean = true;
}

export function drawFurniture() {
    if (!ctx) return;

    ctx.fillStyle = roomObjects.foodBowl.full ? '#8b4513' : '#654321';
    ctx.beginPath();
    ctx.ellipse(
        roomObjects.foodBowl.x + roomObjects.foodBowl.width / 2,
        roomObjects.foodBowl.y + roomObjects.foodBowl.height / 2,
        roomObjects.foodBowl.width / 2,
        roomObjects.foodBowl.height / 2,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    if (roomObjects.foodBowl.full) {
        ctx.fillStyle = '#8b0000';
        ctx.beginPath();
        ctx.ellipse(
            roomObjects.foodBowl.x + roomObjects.foodBowl.width / 2,
            roomObjects.foodBowl.y + roomObjects.foodBowl.height / 3,
            roomObjects.foodBowl.width / 3,
            roomObjects.foodBowl.height / 4,
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }

    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Food', roomObjects.foodBowl.x + roomObjects.foodBowl.width / 2, roomObjects.foodBowl.y + roomObjects.foodBowl.height + 15);

    ctx.fillStyle = '#4682b4';
    ctx.beginPath();
    ctx.ellipse(
        roomObjects.waterBowl.x + roomObjects.waterBowl.width / 2,
        roomObjects.waterBowl.y + roomObjects.waterBowl.height / 2,
        roomObjects.waterBowl.width / 2,
        roomObjects.waterBowl.height / 2,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    if (roomObjects.waterBowl.full) {
        ctx.fillStyle = '#87ceeb';
        ctx.beginPath();
        ctx.ellipse(
            roomObjects.waterBowl.x + roomObjects.waterBowl.width / 2 - 10,
            roomObjects.waterBowl.y + roomObjects.waterBowl.height / 3,
            8, 4, 0, 0, Math.PI * 2
        );
        ctx.fill();
    }

    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Nunito, sans-serif';
    ctx.fillText('Water', roomObjects.waterBowl.x + roomObjects.waterBowl.width / 2, roomObjects.waterBowl.y + roomObjects.waterBowl.height + 15);

    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(roomObjects.bed.x, roomObjects.bed.y, roomObjects.bed.width, roomObjects.bed.height);

    ctx.fillStyle = '#c0392b';
    ctx.fillRect(roomObjects.bed.x + 10, roomObjects.bed.y + 10, roomObjects.bed.width - 20, roomObjects.bed.height - 20);

    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Nunito, sans-serif';
    ctx.fillText('Bed', roomObjects.bed.x + roomObjects.bed.width / 2, roomObjects.bed.y + roomObjects.bed.height + 15);

    ctx.fillStyle = '#5d4037';
    ctx.fillRect(roomObjects.door.x, roomObjects.door.y, roomObjects.door.width, roomObjects.door.height);

    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 8;
    ctx.strokeRect(roomObjects.door.x, roomObjects.door.y, roomObjects.door.width, roomObjects.door.height);

    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(roomObjects.door.x + roomObjects.door.width - 15, roomObjects.door.y + roomObjects.door.height / 2, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Nunito, sans-serif';
    ctx.fillText('GO RUN', roomObjects.door.x + roomObjects.door.width / 2, roomObjects.door.y + roomObjects.door.height / 2);

    const bt = roomObjects.bathtub;
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(bt.x, bt.y, bt.width, bt.height);

    ctx.strokeStyle = '#b0b0b0';
    ctx.lineWidth = 4;
    ctx.strokeRect(bt.x, bt.y, bt.width, bt.height);

    if (bt.full) {
        ctx.fillStyle = '#74c0fc';
        ctx.fillRect(bt.x + 5, bt.y + 15, bt.width - 10, bt.height - 20);

        ctx.fillStyle = '#a5d8ff';
        ctx.beginPath();
        ctx.ellipse(bt.x + 30, bt.y + 25, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Nunito, sans-serif';
    ctx.fillText('Bath', bt.x + bt.width / 2, bt.y + bt.height + 15);

    const lb = roomObjects.litterBox;
    ctx.fillStyle = '#2d5a4a';
    ctx.fillRect(lb.x, lb.y, lb.width, lb.height);

    ctx.fillStyle = lb.clean ? '#c4a574' : '#b8956a';
    ctx.fillRect(lb.x + 5, lb.y + 10, lb.width - 10, lb.height - 15);

    ctx.fillStyle = '#a08060';
    for (let i = 0; i < 15; i++) {
        const lx = lb.x + 10 + (i * 3) % (lb.width - 20);
        const ly = lb.y + 15 + (i * 7) % (lb.height - 25);
        ctx.beginPath();
        ctx.arc(lx, ly, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    if (!lb.clean) {
        ctx.fillStyle = '#8b7355';
        ctx.beginPath();
        ctx.arc(lb.x + 20, lb.y + 30, 5, 0, Math.PI * 2);
        ctx.arc(lb.x + 35, lb.y + 25, 4, 0, Math.PI * 2);
        ctx.arc(lb.x + 50, lb.y + 32, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Nunito, sans-serif';
    ctx.fillText('Litter', lb.x + lb.width / 2, lb.y + lb.height + 15);
}
