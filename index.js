<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aston Martin - Traffic Dodge</title>
    <style>
        /* CSS - Utseendet */
        body {
            margin: 0;
            padding: 0;
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
            background: #444; /* Asfalt */
            border-left: 10px solid #fff;
            border-right: 10px solid #fff;
            overflow: hidden;
        }

        /* Vägmarkeringar som rör sig */
        .lane-line {
            position: absolute;
            left: 50%;
            width: 8px;
            height: 50px;
            background: #fff;
            transform: translateX(-50%);
            animation: moveRoad 1s linear infinite;
        }

        @keyframes moveRoad {
            0% { top: -100px; }
            100% { top: 600px; }
        }

        #player {
            position: absolute;
            bottom: 20px;
            left: 175px;
            width: 60px; /* Din Aston Martin */
            z-index: 10;
        }

        .enemy {
            position: absolute;
            width: 55px;
            height: 100px;
            background: #c0392b; /* Enkel röd bil som fiende */
            border-radius: 5px;
            z-index: 5;
        }

        #score-board {
            position: absolute;
            top: 20px;
            left: 20px;
            color: white;
            font-size: 20px;
            font-weight: bold;
            text-shadow: 2px 2px 4px #000;
            z-index: 20;
        }
    </style>
</head>
<body>

    <div id="score-board">Poäng: 0</div>
    
    <div id="game-container">
        <!-- Vägmarkeringar (för fartkänsla) -->
        <div class="lane-line" style="top: 0px;"></div>
        <div class="lane-line" style="top: 200px;"></div>
        <div class="lane-line" style="top: 400px;"></div>

        <!-- Din bil -->
        <img id="player" src="https://toppng.com" alt="Aston Martin">
    </div>

    <script>
        // JS - Logiken
        const player = document.getElementById('player');
        const container = document.getElementById('game-container');
        const scoreElement = document.getElementById('score-board');
        
        let score = 0;
        let playerPos = { x: 175, y: 480 };
        let gameActive = true;

        // Kontroller
        document.addEventListener('keydown', (e) => {
            if (!gameActive) return;
            
            if (e.key === 'ArrowLeft' && playerPos.x > 10) {
                playerPos.x -= 25;
            }
            if (e.key === 'ArrowRight' && playerPos.x < 330) {
                playerPos.x += 25;
            }
            player.style.left = playerPos.x + 'px';
        });

        // Skapa trafik
        function createTraffic() {
            if (!gameActive) return;

            const enemy = document.createElement('div');
            enemy.classList.add('enemy');
            
            // Slumpa startposition i sidled
            enemy.style.left = Math.floor(Math.random() * 330) + 10 + 'px';
            enemy.style.top = '-100px';
            
            // Ge fienden en slumpmässig färg
            const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6'];
            enemy.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(enemy);

            let enemyPos = -100;
            let moveInterval = setInterval(() => {
                if (!gameActive) {
                    clearInterval(moveInterval);
                    return;
                }

                enemyPos += 5; // Hastigheten på trafiken
                enemy.style.top = enemyPos + 'px';

                // Kolla krock
                if (isColliding(player, enemy)) {
                    gameActive = false;
                    alert("KROCK! Din poäng blev: " + score);
                    location.reload(); // Starta om spelet
                }

                // Ta bort bilen när den åkt förbi
                if (enemyPos > 600) {
                    enemy.remove();
                    clearInterval(moveInterval);
                    score++;
                    scoreElement.innerText = "Poäng: " + score;
                }
            }, 20);
        }

        // Enkel krock-logik
        function isColliding(a, b) {
            let aRect = a.getBoundingClientRect();
            let bRect = b.getBoundingClientRect();

            return !(
                aRect.top > bRect.bottom || 
                aRect.bottom < bRect.top || 
                aRect.left > bRect.right || 
                aRect.right < bRect.left
            );
        }

        // Starta trafikströmmen
        setInterval(createTraffic, 1200);

    </script>
</body>
</html>
