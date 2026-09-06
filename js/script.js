const correctPassword = "1108"; 
let currentInput = "";

const dots = document.querySelectorAll(".dot");
const keys = document.querySelectorAll(".key");

keys.forEach(key => {
    key.addEventListener("click", () => {
        const value = key.innerText;

        if (value === "⌫") {
            // Handle Delete
            if (currentInput.length > 0) {
                currentInput = currentInput.slice(0, -1);
                updateDots();
            }
        } else if (value !== "") {
            // Handle Numbers (ignores the empty key)
            if (currentInput.length < 4) { 
                currentInput += value;
                updateDots();
                
                // Check password automatically when 8 digits are reached
                if (currentInput.length === 4) {
                    setTimeout(checkPassword, 150); // Tiny delay so the last dot fills visually
                }
            }
        }
    });
});

function updateDots() {
    dots.forEach((dot, index) => {
        if (index < currentInput.length) {
            dot.classList.add("filled");
        } else {
            dot.classList.remove("filled");
        }
    });
}

function checkPassword() {
    if (currentInput === correctPassword) {
       
        document.getElementById("bg-music").play();
        document.getElementById("lock-screen").style.display = "none";
        document.getElementById("welcome-screen").style.display = "block";

    } else {
        // Incorrect! Shake the dots and reset
        document.getElementById("incorrect-code").play();
        const passwordDisplay = document.querySelector(".password-display");
        passwordDisplay.classList.add("shake-animation");

        
        setTimeout(() => {
            passwordDisplay.classList.remove("shake-animation");
            currentInput = ""; // Clear the memory
            updateDots();      // Clear the visual dots
        }, 400);
    }
}

/* --- NEW WELCOME SCREEN LOGIC --- */
function showStep2() {
    document.getElementById("step-1").style.display = "none";
    document.getElementById("step-2").style.display = "block";
}

function teaseUser() {
    // If she clicks "noo", it shows a funny little angry message
    document.getElementById("tease-msg").style.display = "block";
}

function goToLetter() {
    // This will eventually hide the welcome screen and show the love letter!
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("letter-screen").style.display = "block";
}

function goToGallery() {
    document.getElementById("letter-screen").style.display = "none";
    document.getElementById("gallery-screen").style.display = "block";
}

function goToPlaylist() {
    document.getElementById("gallery-screen").style.display = "none";
    document.getElementById("playlist-screen").style.display = "block";
}

/* --- PHOTO MODAL LOGIC --- */
function openPhotoModal(element) {
    // 1. Get the image source and secret message from the clicked polaroid
    const imgSrc = element.getAttribute('data-img');
    const descText = element.getAttribute('data-desc');
    
    // 2. Put them into the hidden modal
    document.getElementById('modal-img').src = imgSrc;
    document.getElementById('modal-desc').innerText = descText;
    
    // 3. Show the modal! (Using 'flex' so it centers perfectly)
    document.getElementById('photo-modal').style.display = 'flex';
}

function closePhotoModal() {
    // Hide the modal when she clicks the X or the dark background
    document.getElementById('photo-modal').style.display = 'none';
}

/* --- IOS STYLE MIXTAPE AUDIO LOGIC --- */
let bgFadeInterval;
let currentlyPlayingBtn = null;

function toggleIosSong(btnElement, songSrc) {
    const mixtapePlayer = document.getElementById("mixtape-player");
    const bgMusic = document.getElementById("bg-music");

    // If she clicks the exact same button that is already playing, Pause it
    if (currentlyPlayingBtn === btnElement && !mixtapePlayer.paused) {
        // Pause the mixtape
        mixtapePlayer.pause();
        btnElement.innerText = "▶";
        
        // Fade IN the background music
        bgMusic.play();
        clearInterval(bgFadeInterval);
        bgFadeInterval = setInterval(() => {
            if (bgMusic.volume < 0.9) { bgMusic.volume += 0.1; } 
            else { bgMusic.volume = 1; clearInterval(bgFadeInterval); }
        }, 100);
        return;
    }

    // If another song was playing, reset its button back to Play
    if (currentlyPlayingBtn) {
        currentlyPlayingBtn.innerText = "▶";
    }

    // Start playing the NEW song
    currentlyPlayingBtn = btnElement;
    btnElement.innerText = "⏸";
    
    mixtapePlayer.src = songSrc;
    mixtapePlayer.play();

    // Fade OUT the background music
    clearInterval(bgFadeInterval);
    bgFadeInterval = setInterval(() => {
        if (bgMusic.volume > 0.1) { bgMusic.volume -= 0.1; } 
        else { bgMusic.volume = 0; bgMusic.pause(); clearInterval(bgFadeInterval); }
    }, 100);
}

// When a mixtape song finishes naturally, reset the button
document.getElementById("mixtape-player").addEventListener('ended', function() {
    if (currentlyPlayingBtn) {
        currentlyPlayingBtn.innerText = "▶";
        
        // Fade the background music back in
        const bgMusic = document.getElementById("bg-music");
        bgMusic.play();
        clearInterval(bgFadeInterval);
        bgFadeInterval = setInterval(() => {
            if (bgMusic.volume < 0.9) { bgMusic.volume += 0.1; } 
            else { bgMusic.volume = 1; clearInterval(bgFadeInterval); }
        }, 100);
    }
});

