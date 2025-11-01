console.log("javascript is running");

let currentSong = new Audio();
let songs;
let currentFolder;
let volumeBarWidth;
let volumeClickPosition;
let volumeProgress = 100;
let isMuted = true;
let selectedSong;
let selectedSongIndex = 0;
let songIndex = 0;

// here, when i click the menu icon, left container will display and click again to hide it. 
document.querySelector(".menu").addEventListener("click", () => {
    if (document.querySelector(".left-container").style.left === "0%") {
        document.querySelector(".left-container").style.left = "-150%";
        document.querySelector(".menu").style.stroke = "#b3b3b3";
        document.querySelector(".menu").style.fill = "none";
    } else {
        document.querySelector(".left-container").style.left = "0%";
        document.querySelector(".menu").style.stroke = "#ffffff";
        document.querySelector(".menu").style.fill = "#ffffff";
    }
})

// here, we change the logo and h1 title and add hover effect to the title
let newLogo = document.querySelector(".website-logo");
let newH1 = document.querySelector("h1");
let title = document.getElementById("h1-title");
title.innerHTML = title.textContent.split("").map(letter => `<span>${letter}</span>`).join("");
// here, we add event listener to the logo and change the logo and h1 title and add hover effect to the title
newLogo.addEventListener("click", () => {
    if (newLogo.innerHTML.includes("Sangeet")) {
        newLogo.innerHTML = `<img src="SVGs/spotify-logo.svg" class="website-icon" title="Spotify">`;
        newH1.innerHTML = "Spotify Playlist";
        title.innerHTML = title.textContent.split("").map(letter => `<span>${letter}</span>`).join("");
    } else {
        newLogo.innerHTML = `<img src="SVGs/veena.svg" class="website-icon" title="Sangeet">`;
        newH1.innerHTML = "Sangeet Playlist";
        title.innerHTML = title.textContent.split("").map(letter => `<span>${letter}</span>`).join("");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    let searchBar = document.querySelector(".search-bar");
    let inputField = document.querySelector(".input-field");
    let CloseIcon = document.querySelector(".close-icon");
    let isSearchOpen = false;
    //here, when i click on search bar then it open search bar
    searchBar.addEventListener("click", () => 
    {
        if (window.matchMedia("(max-width: 440px)").matches)
        {
            isSearchOpen = !isSearchOpen;
            if (isSearchOpen) {
                searchBar.classList.add("expanded");
                inputField.style.display = "block";
                CloseIcon.innerHTML = 
                `<svg class="close-icon" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" fill="#b3b3b3" data-encore-id="icon" role="img" aria-hidden="true" >
                <g id="Menu / Close_SM">
                <path id="Vector" d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke="#b3b3b3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                </svg>`;
                CloseIcon.style.minWidth = "48px";
                CloseIcon.style.width= "48px";
                CloseIcon.style.minHeight= "48px";
                CloseIcon.style.height= "48px";
            }
            //here, when i click close icon then it close search bar. 
            document.addEventListener('click', (event) => 
            {   //here, if i click on .close icon and not clicked on input field only then close a search bar
                if (event.target.closest(".close-icon") && searchBar.contains(event.target)) {
                    CloseIcon.style.minWidth = "0px";
                    CloseIcon.style.width = "0px";
                    CloseIcon.style.minHeight = "0px";
                    CloseIcon.style.height = "0px";
                    searchBar.classList.remove("expanded");
                    inputField.style.display = "none";
                    CloseIcon.innerHTML = ``;
                }
            });
        }
    });
});


//display all the albums on the right container
async function displayAlbums() {
    let response = await fetch(`../songs/`); //here i made change in path 'http://127.0.0.1:3690/songs/' or 'https://suraj-oswal-39.github.io/Spotify-Clone-Project/songs/'
    let responseText = await response.text();
    // here, we create a div element and store the response in it
    let div = document.createElement("div");
    div.innerHTML = responseText;
    let FAs = div.getElementsByTagName("a");
    //FAs stand for Folder Anchors 
    let arrayFAs = Array.from(FAs);
    for (let index = 0; index < arrayFAs.length; index++) {
        let element = arrayFAs[index];
        if (element.href.includes("songs/")) {
            let albums = decodeURI(element.href.split("/").pop())
            //get the metadata of the albums
            let response = await fetch(`./songs/${albums}/info.json`); //here i made change in path 'http://127.0.0.1:3690/songs/${albums}/info.json' or 'https://suraj-oswal-39.github.io/Spotify-Clone-Project/songs/${albums}/info.json'
            let responseJson = await response.json();
            let cardsContainer = document.querySelector(".cardsContainer");
            cardsContainer.innerHTML = cardsContainer.innerHTML +
                `<div data-folder="${responseJson.title}" class="card">
                    <img src="songs/${responseJson.title}/cover.jpg" class="card-image">
                    <img src="SVGs/card-play-icon.svg" class="card-play-icon">
                    <div class="card-text">${responseJson.title}</div>
                </div>`;   
        }
    }; 

    //By default first folder is loaded
    getSongs(`songs/${decodeURI(arrayFAs[4].href.split("/").pop())}`);

    //load the playlist whenever card is clicked
    Array.from(document.querySelectorAll(".card")).forEach(c => {
        c.addEventListener("click", async itemC => {
            await getSongs(`songs/${itemC.target.parentElement.dataset.folder}`);
        })
    })
}

displayAlbums();


// here, we get a song from songs folder and and store in array  
async function getSongs(folder) {
    currentFolder = folder.split("songs/")[1];
    //console.log("current folder for fetch: " + currentFolder);
    // here, we fetch the songs from songs folder
    let response = await fetch(`../songs/${currentFolder}/`); //here i made change in path 'http://127.0.0.1:3690/songs/${currentFolder}/' or 'https://suraj-oswal-39.github.io/Spotify-Clone-Project/songs/${currentFolder}/'
    let responseText = await response.text();
    // here, we create a div element and store the response in it
    let div = document.createElement("div");
    div.innerHTML = responseText;
    // here, we get all the anchor tags from the div element
    let as = div.getElementsByTagName("a");
    // here, we create an empty array to store the all songs
    songs = [];
    for (let index = 0; index < as.length; index++) {
        let element = as[index];
        if (element.href.endsWith(".mp3")) {
            // split, it return substrings array from whole string and split specific substring. 
            songs.push(decodeURIComponent(element.href.split(`/`).pop().replace(".mp3", "")));
        }
    }

    // here, selecting all songs from the unordered list and displaying them.
    let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    songUl.innerHTML = "";
    for (let song of songs) {
        songUl.innerHTML = songUl.innerHTML +
            `<li>    
            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
            <svg class="music-icon-size" viewBox="0 0 24 24" fill="transparent" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> 
                    <path d="M12 19.5C12 20.8807 10.8807 22 9.5 22C8.11929 22 7 20.8807 7 19.5C7 18.1193 8.11929 17 9.5 17C10.8807 17 12 18.1193 12 19.5Z" stroke="#b3b3b3" class="music-icon-stroke" stroke-width="1.5"/>
                    <path d="M22 17.5C22 18.8807 20.8807 20 19.5 20C18.1193 20 17 18.8807 17 17.5C17 16.1193 18.1193 15 19.5 15C20.8807 15 22 16.1193 22 17.5Z" stroke="#b3b3b3" class="music-icon-stroke" stroke-width="1.5"/> 
                    <path d="M22 8L12 12" stroke="#b3b3b3" class="music-icon-stroke" stroke-width="1.5" stroke-linecap="round"/> 
                    <path d="M14.4556 5.15803L14.7452 5.84987L14.4556 5.15803ZM16.4556 4.32094L16.1661 3.62909L16.4556 4.32094ZM21.1081 3.34059L20.6925 3.96496L20.6925 3.96496L21.1081 3.34059ZM12.75 19.0004V8.84787H11.25V19.0004H12.75ZM22.75 17.1542V8.01078H21.25V17.1542H22.75ZM14.7452 5.84987L16.7452 5.01278L16.1661 3.62909L14.1661 4.46618L14.7452 5.84987ZM22.75 8.01078C22.75 6.67666 22.752 5.59091 22.6304 4.76937C22.5067 3.93328 22.2308 3.18689 21.5236 2.71622L20.6925 3.96496C20.8772 4.08787 21.0473 4.31771 21.1466 4.98889C21.248 5.67462 21.25 6.62717 21.25 8.01078H22.75ZM16.7452 5.01278C18.0215 4.47858 18.901 4.11263 19.5727 3.94145C20.2302 3.77391 20.5079 3.84204 20.6925 3.96496L21.5236 2.71622C20.8164 2.24554 20.0213 2.2792 19.2023 2.48791C18.3975 2.69298 17.3967 3.114 16.1661 3.62909L16.7452 5.01278ZM12.75 8.84787C12.75 8.18634 12.751 7.74991 12.7875 7.41416C12.822 7.09662 12.8823 6.94006 12.9594 6.8243L11.7106 5.99325C11.4527 6.38089 11.3455 6.79864 11.2963 7.25218C11.249 7.68752 11.25 8.21893 11.25 8.84787H12.75ZM14.1661 4.46618C13.5859 4.70901 13.0953 4.91324 12.712 5.12494C12.3126 5.34549 11.9686 5.60562 11.7106 5.99325L12.9594 6.8243C13.0364 6.70855 13.1575 6.59242 13.4371 6.438C13.7328 6.27473 14.135 6.10528 14.7452 5.84987L14.1661 4.46618Z" fill="#b3b3b3" class="music-icon-fill"/> 
                    <path opacity="0.5" d="M7 11V2C7 4.07107 8.75736 5 10 5M7 10.5C7 11.8807 5.88071 13 4.5 13C3.11929 13 2 11.8807 2 10.5C2 9.11929 3.11929 8 4.5 8C5.88071 8 7 9.11929 7 10.5Z" stroke="#b3b3b3" class="music-icon-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
            </svg>
            <p class="song-title">${song}</p>
            <div class="play-now">
                <span>Play Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="1.5" fill="transparent" height="16" width="16" data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
            </div>
        </li>`;
    }

    
    // select all song lists 'li' and attach event listener to all songs
    Array.from(document.querySelector(".song-list").getElementsByTagName('li')).forEach(songList => {
        songList.addEventListener("click", element => {
            selectedSong = songList.querySelector(".song-title").innerText.trim();
            playMusic(selectedSong, true);
            let songTitles = Array.from(document.querySelectorAll(".song-title")).map(songTitle => songTitle.innerHTML);
            selectedSongIndex = songTitles.findIndex(st => st == selectedSong);
            console.log(selectedSongIndex);
        })
    })
}

let playMusic = (track, pause = false) => {
    //console.log(`Playing: ${decodeURI(track)}`);
    // It updates the play button icon to pause button icon and title to 'pause'
    document.querySelector("#play").src = "SVGs/pause-icon.svg";
    document.querySelector("#play").title = "Pause";
    currentSong.src = `songs/${currentFolder}/${track}.mp3`
    //console.log("currentSong.src = " + currentSong.src);
    // It updates the song title of the selected song
    document.querySelector(".song-info > p").innerText = decodeURI(track);
    // It updates the song current time and duration
    currentSong.addEventListener("loadedmetadata", () => {
        // convert current seconds into Minutes and seconds into Seconds
        let minutesDuration = Math.floor(currentSong.duration / 60);
        let secondsDuration = Math.floor(currentSong.duration % 60);
        // update the song duration to the current duration and song time to the current time
        document.querySelector(".song-duration").innerText = `${minutesDuration < 10 ? "0" + minutesDuration : minutesDuration}:${secondsDuration < 10 ? "0" + secondsDuration : secondsDuration}`;
    })
    currentSong.play();
}

currentSong.addEventListener("timeupdate", () => {
    // get the current time and duration of the song
    let minutes = Math.floor(currentSong.currentTime / 60);
    let seconds = Math.floor(currentSong.currentTime % 60);
    document.querySelector(".song-run-time").innerText = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    // here, it calculates the progress of the song and update the seek-bar-fill width and seek-bar-circle position
    let progress = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".seek-bar-fill").style.width = `${progress}%`;
    document.querySelector(".seek-bar-circle").style.left = `${progress}%`;

    document.querySelector(".seek-bar").addEventListener("click", (e) => {
        // here, it calculates the seek-bar-fill width and .seek-bar-circle position
        let seekBarWidth = document.querySelector(".seek-bar").offsetWidth;
        let clickPosition = e.offsetX;
        let reProgress = (clickPosition / seekBarWidth) * 100;
        document.querySelector(".seek-bar-fill").style.width = `${reProgress}%`;
        document.querySelector(".seek-bar-circle").style.left = `${reProgress}%`;
        currentSong.currentTime = (currentSong.duration * reProgress) / 100;
    })
})

document.addEventListener("DOMContentLoaded", function () {
    if (!songs || songs.length === 0) {
        //console.log("No songs available");
        return;
    }
    let seekBar = document.querySelector(".seek-bar");
    let seekBarFill = document.querySelector(".seek-bar-fill");
    let seekBarCircle = document.querySelector(".seek-bar-circle");
    function show_seek_bar_circle() {
        seekBarCircle.style.display = "block";
    }
    function hide_seek_bar_circle() {
        seekBarCircle.style.display = "none";
    }
    function updateProgress(event) {
        let rect = seekBar.getBoundingClientRect();
        let offsetX;

        if (event.touches) {
            offsetX = event.touches[0].clientX - rect.left;
        } else {
            offsetX = event.clientX - rect.left;
        }

        let progress = (offsetX / seekBar.offsetWidth) * 100;
        progress = Math.max(0, Math.min(100, progress));

        seekBarFill.style.width = progress + "%";
        seekBarCircle.style.left = progress + "%";
    }
    // Mouse Events
    seekBar.addEventListener("mouseenter", show_seek_bar_circle, { passive: true });
    seekBar.addEventListener("mouseleave", hide_seek_bar_circle, { passive: true });
    // Touch Events for Mobile
    seekBar.addEventListener("touchstart", show_seek_bar_circle, { passive: true });
    seekBar.addEventListener("touchmove", updateProgress, { passive: true });
    seekBar.addEventListener("touchend", hide_seek_bar_circle, { passive: true });
})

// attach an event listener to the play buttons
play.addEventListener("click", () => {
    if (!songs || songs.length === 0) {
        //console.log("No songs available");
    }
    // if current song is not selected/have no src of current song , then it will print "No song selected, playing the first song on the list"
    if (currentSong.src) {
        // if: current song is paused,
        // then: it will play the song and update the play button icon and title to pause,
        // otherwise: it
        if (currentSong.paused) {
            currentSong.play();
            document.querySelector("#play").src = "SVGs/pause-icon.svg";
            document.querySelector("#play").title = "Pause";
        } else {
            currentSong.pause();
            document.querySelector("#play").src = "SVGs/play-icon.svg";
            document.querySelector("#play").title = "Play";
        }
    } else {
        //console.log("No song selected, playing the first song on the list");
        // here, by default, it will start playing the first song from the list
        playMusic(songs[0], true);
    }

});

// here, add event listener to next song
next.addEventListener("click", () => {
    if (!songs || songs.length === 0) {
        console.log("No songs available");
        return;
    }
    if (songs.length === 0) return;
    selectedSongIndex = (selectedSongIndex + 1) % songs.length;
    playMusic(songs[selectedSongIndex], true);
});

// here, add event listener to previous song
previous.addEventListener("click", () => {
    if (!songs || songs.length === 0) {
        //console.log("No songs available");
        return;
    }
    if (songs.length === 0) return;
    selectedSongIndex = (selectedSongIndex - 1 + songs.length) % songs.length;
    playMusic(songs[selectedSongIndex], true);

});
//here, this is autoplay event. it play a next song when current song is ended.
currentSong.addEventListener("ended", () => {
    if (selectedSongIndex < songs.length - 1 && songIndex < songs.length - 1) {
        selectedSongIndex++;
        songIndex++;
    } else {
        //console.log("Playlist ended. Restarting from the first song.");
        songIndex = 0; // Reset index to start from first song
        selectedSongIndex = 0;
    }
    let nextSongIndex = selectedSongIndex !== undefined ? selectedSongIndex : songIndex;
    // Ensure the first song plays when restarting
    playMusic(songs[nextSongIndex], true);
    //console.log(`Now playing: ${songs[nextSongIndex]}`);
});

//here, attach event listener to a volume bar
document.querySelector(".volume-bar").addEventListener("click", (v) => {
    if (!songs || songs.length === 0) {
        //console.log("No songs available");
        return;
    }
    volumeBarWidth = document.querySelector(".volume-bar").offsetWidth;
    volumeClickPosition = v.offsetX;
    volumeProgress = (volumeClickPosition / volumeBarWidth) * 100;
    document.querySelector(".volume-bar-fill").style.width = `${volumeProgress}%`;
    document.querySelector(".volume-bar-circle").style.left = `${volumeProgress}%`;
    currentSong.volume = volumeProgress / 100;
    if (volumeProgress <= 0) {
        document.querySelector(".volume-image").innerHTML = `<img src="SVGs/mute-icon.svg" alt="mute icon">`;
    } else if (volumeProgress > 0 && volumeProgress <= 33) {
        document.querySelector(".volume-image").innerHTML = `<img src="SVGs/low-unmute-icon.svg" alt="unmute icon">`;
    } else if (volumeProgress > 34 && volumeProgress <= 66) {
        document.querySelector(".volume-image").innerHTML = `<img src="SVGs/medium-unmute-icon.svg" alt="unmute icon">`;
    } else if (volumeProgress > 67 && volumeProgress <= 100) {
        document.querySelector(".volume-image").innerHTML = `<img src="SVGs/high-unmute-icon.svg" alt="unmute icon">`;
    }
})

//here volume will be mute or unmute
document.querySelector(".volume-image").addEventListener("click", () => {
    if (!songs || songs.length === 0) {
        //console.log("No songs available");
        return;
    }
    if (isMuted) {
        document.querySelector(".volume-bar-fill").style.width = '0%';
        document.querySelector(".volume-bar-circle").style.left = '0%';
        currentSong.volume = 0;
        document.querySelector(".volume-image").innerHTML = `<img src="SVGs/mute-icon.svg" alt="mute icon">`;
    } else {
        document.querySelector(".volume-bar-fill").style.width = `${volumeProgress}%`;
        document.querySelector(".volume-bar-circle").style.left = `${volumeProgress}%`;
        currentSong.volume = volumeProgress / 100;
        if (volumeProgress === 0) {
            document.querySelector(".volume-image").innerHTML = `<img src="SVGs/mute-icon.svg" alt="mute icon">`;
        } else if (volumeProgress > 0 && volumeProgress <= 33) {
            document.querySelector(".volume-image").innerHTML = `<img src="SVGs/low-unmute-icon.svg" alt="unmute icon">`;
        } else if (volumeProgress > 34 && volumeProgress <= 66) {
            document.querySelector(".volume-image").innerHTML = `<img src="SVGs/medium-unmute-icon.svg" alt="unmute icon">`;
        } else if (volumeProgress > 67 && volumeProgress <= 100) {
            document.querySelector(".volume-image").innerHTML = `<img src="SVGs/high-unmute-icon.svg" alt="unmute icon">`;
        }
    }
    isMuted = !isMuted;
});

