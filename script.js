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
  let response = await fetch("songs.json"); //here change
  let albums = await response.json();
  let cardsContainer = document.querySelector(".cardsContainer");
  cardsContainer.innerHTML = "";

  for (let key in albums) {
    let album = albums[key];
    cardsContainer.innerHTML += `
      <div data-folder="${album.title}" class="card">
        <img src="${album.cover}" class="card-image">
        <img src="SVGs/card-play-icon.svg" class="card-play-icon">
        <div class="card-text">${album.title}</div>
      </div>`;
  }

  // Load first album by default
  let firstAlbumKey = Object.keys(albums)[0];
  await getSongs(firstAlbumKey, albums[firstAlbumKey].songs);

  // Load playlist when card is clicked
  Array.from(document.querySelectorAll(".card")).forEach(card => {
    card.addEventListener("click", async () => {
      let folder = card.dataset.folder;
      await getSongs(folder, albums[folder].songs);
    });
  });
}

displayAlbums();


// here, we get a song from songs folder and and store in array  
async function getSongs(folder, songList) {
  currentFolder = folder;
  songs = songList.map(path => decodeURIComponent(path.split("/").pop().replace(".mp3", "")));

  let songUl = document.querySelector(".song-list").getElementsByTagName("ul")[0];
  songUl.innerHTML = "";

  for (let song of songs) {
    songUl.innerHTML += `
      <li>
        <svg class="music-icon-size" viewBox="0 0 24 24" fill="transparent" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19.5C12 20.8807 10.8807 22 9.5 22C8.11929 22 7 20.8807 7 19.5C7 18.1193 8.11929 17 9.5 17C10.8807 17 12 18.1193 12 19.5Z" stroke="#b3b3b3" stroke-width="1.5"/>
          <path d="M22 17.5C22 18.8807 20.8807 20 19.5 20C18.1193 20 17 18.8807 17 17.5C17 16.1193 18.1193 15 19.5 15C20.8807 15 22 16.1193 22 17.5Z" stroke="#b3b3b3" stroke-width="1.5"/>
        </svg>
        <p class="song-title">${song}</p>
        <div class="play-now">
          <span>Play Now</span>
          <svg xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="1.5" fill="transparent" height="16" width="16" viewBox="0 0 16 16"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
        </div>
      </li>`;
  }

  // Attach click events
  Array.from(document.querySelectorAll(".song-list li")).forEach(songList => {
    songList.addEventListener("click", () => {
      selectedSong = songList.querySelector(".song-title").innerText.trim();
      playMusic(selectedSong, true);
      selectedSongIndex = songs.indexOf(selectedSong);
    });
  });
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





