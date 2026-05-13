document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('addBtn');
    const toggleDeleteBtn = document.getElementById('toggleDeleteBtn');
    const nameInput = document.getElementById('playerName');
    const scoreInput = document.getElementById('playerScore');
    const leaderboardBody = document.getElementById('leaderboardBody');
    const scrollContainer = document.getElementById('scrollContainer');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const pauseDuration = 2000;

    let isDeleteMode = false;
    let isHovering = false;
    let isWaiting = false; 

    // Initial Data
    let players = JSON.parse(localStorage.getItem('starCollectorScores')) || [
        { name: "Andromeda", score: 8500 },
        { name: "Nebula_Pilot", score: 7200 },
        { name: "Star_Lord", score: 6500 },
        { name: "Comet_Chaser", score: 5000 },
        { name: "VoidWalker", score: 4200 },
        { name: "Galaxy_Guy", score: 3800 },
        { name: "Cosmos_Queen", score: 3500 },
        { name: "Moon_Walker", score: 2100 }
    ];

    renderLeaderboard();

    // --- BUTTON LOGIC ---
    addBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const score = parseInt(scoreInput.value);
        if (name && !isNaN(score)) {
            players.push({ name, score });
            saveAndRender();
            nameInput.value = ""; scoreInput.value = "";
        }
    });

    toggleDeleteBtn.addEventListener('click', () => {
        isDeleteMode = !isDeleteMode;
        toggleDeleteBtn.textContent = isDeleteMode ? "DONE" : "MANAGE";
        toggleDeleteBtn.style.backgroundColor = isDeleteMode ? "#27ae60" : "#34495e";
        renderLeaderboard();
    });

    window.deletePlayer = (index) => {
        players.splice(index, 1);
        saveAndRender();
    };

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    });

    // --- AUTO SCROLL LOGIC ---
    scrollContainer.addEventListener('mouseenter', () => isHovering = true);
    scrollContainer.addEventListener('mouseleave', () => isHovering = false);

    function autoScroll() {
        // Don't scroll if user is hovering, deleting, or in a "waiting" pause
        if (isHovering || isDeleteMode || isWaiting) return;

        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        
        // Only scroll if there is content to scroll
        if (maxScroll > 0) {
            scrollContainer.scrollTop += 1; 

            // 1. Check if we reached the BOTTOM
            if (scrollContainer.scrollTop >= maxScroll - 1) {
                isWaiting = true; 
                
                // Wait at the bottom for a moment
                setTimeout(() => {
                    scrollContainer.scrollTop = 0; // Jump back to top
                    
                    // 2. Now wait at the TOP for a moment before starting again
                    setTimeout(() => {
                        isWaiting = false; 
                    }, pauseDuration);

                }, pauseDuration);
            }
        }
    }

    // Run the scroll check every 30ms for smooth movement
    setInterval(autoScroll, 30);

    // --- RENDER LOGIC ---
    function saveAndRender() {
        players.sort((a, b) => b.score - a.score);
        localStorage.setItem('starCollectorScores', JSON.stringify(players));
        renderLeaderboard();
    }

    function renderLeaderboard() {
        players.sort((a, b) => b.score - a.score);
        document.querySelector('.delete-col').classList.toggle('hidden', !isDeleteMode);
        leaderboardBody.innerHTML = "";

        players.forEach((player, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span style="color:#5dade2">${index + 1}</span></td>
                <td style="color: ${index === 0 ? '#ffcc00' : 'white'}">${player.name}</td>
                <td style="font-weight:bold">${player.score.toLocaleString()}</td>
                <td class="${isDeleteMode ? '' : 'hidden'}">
                    <button class="remove-entry-btn" onclick="deletePlayer(${index})">X</button>
                </td>
            `;
            leaderboardBody.appendChild(row);
        });
    }
    
});