<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aston Martin - Traffic Dodge</title>
    <style>
        body {
            margin: 0;
            background: #222;
            font-family: sans-serif;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        #game-container {
            position: relative;
            width: 400px;
            height: 600px;
            background: #444;
            border-left: 10px solid #fff;
            border-right: 10px solid #fff;
            overflow: hidden;
        }

        /* Vägmarkeringar */
        .lane-line {
            position: absolute;
            left: 50%;
            width: 8px;
            height: 80px;
            background: #fff;
            transform: translateX(-50%);
            animation: moveRoad 0.8s linear infinite;
        }

        @keyframes moveRoad {
            0% { top: -100px; }
            100% { top: 600px; }
        }

        #player {
            position: absolute;
            bottom: 20px;
            left: 175px;
            width: 50px;
            height: auto;
            z-index: 10;
        }

        /* Fiendebilar - Nu med höjd! */
        .enemy {
            position: absolute;
            width: 50px;
            height: 90px;
            border-radius: 8px;
            z-index: 5;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        #score-board {
            position: absolute;
            top: 20px;
            left: 20px;
            color: white;
            font-size: 24px;
            z-index: 20;
        }
    </style>
</head>
<body>

    <div id="score-board">Poäng: 0</div>
    
    <div id="game-container">
        <div class="lane-line" style="top: -100px;"></div>
        <div class="lane-line" style="top: 150px;"></div>
        <div class="lane-line" style="top: 400px;"></div>

        <!-- Rätt bildlänk här -->
        <img id="player" src="https://toppng.com" alt="Aston Martin">
    </div>

    <script>
        const player = document.getElementById('player');
        const container = document.getElementById('game-container');
        const scoreElement = document.getElementById('score-board');
        
        let score = 0;
        let playerX = 175;
        let gameActive = true;

        // Styrning
        document.addEventListener('keydown', (e) => {
            if (!gameActive) return;
            if (e.key === 'ArrowLeft' && playerX > 20) playerX -= 30;
            if (e.key === 'ArrowRight' && playerX < 330) playerX += 30;
            player.style.left = playerX + 'px';
        });

        function createTraffic() {
            if (!gameActive) return;

            const enemy = document.createElement('div');
            enemy.classList.add('enemy');
            
            enemy.style.left = Math.floor(Math.random() * 330) + 10 + 'px';
            enemy.style.top = '-100px';
            
            const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#e67e22'];
            enemy.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(enemy);

            let enemyY = -100;
            let moveInterval = setInterval(() => {
                if (!gameActive) {
                    clearInterval(moveInterval);
                    return;
                }

                enemyY += 6; // Fart på trafiken
                enemy.style.top = enemyY + 'px';

                // Kolla krock
                if (isColliding(player, enemy)) {
                    gameActive = false;
                    alert("KROCK! Din poäng: " + score);
                    location.reload();
                }

                // Ta bort bilar som åkt förbi
                if (enemyY > 650) {
                    enemy.remove();
                    clearInterval(moveInterval);
                    score++;
                    scoreElement.innerText = "Poäng: " + score;
                }
            }, 20);
        }

        function isColliding(a, b) {
            let aRect = a.getBoundingClientRect();
            let bRect = b.getBoundingClientRect();
            return !(aRect.top > bRect.bottom || aRect.bottom < bRect.top || aRect.left > bRect.right || aRect.right < bRect.left);
        }

        // Skapa trafik oftare ju längre man spelar
        setInterval(createTraffic, 1000);
    </script>
</body>
</html>
