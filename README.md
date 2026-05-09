# 🎵 Sangeet – Spotify Clone Project

A Spotify-inspired web music player built using HTML, CSS, and JavaScript, designed to simulate core music streaming functionalities like album browsing, song playback, and audio controls.

## 📌 Project Overview

This project is a frontend-based music player that dynamically loads albums and songs from a folder structure. It provides an interactive UI similar to Spotify, including playback controls, seek bar, volume control, and responsive design for mobile devices.

The application uses the JavaScript Audio API to manage music playback and DOM manipulation for dynamic content rendering.

---

## 🚀 Features

🎧 Music Player
  * Play / Pause functionality
  * Foreign Key
  * NOT NULL
  * AUTO_INCREMENT
  * DEFAULT values

⏱️ Seek Bar (Progress Control)
  * Real-time song progress update
  * Click to jump to any part of the song
  * Interactive hover/touch behavior

🔊 Volume Control
  * Adjustable volume using volume bar
  * Dynamic volume icons (mute, low, medium, high)
  * Mute / Unmute toggle
    
📁 Dynamic Album System
  * Albums loaded dynamically from /songs directory
  * Reads metadata from info.json
  * Displays album cards with cover images

📱 Responsive UI
  * Mobile-friendly layout
  * Expandable search bar for small screens
  * Sidebar toggle (menu icon)

🎨 UI/UX Features
  * Smooth hover animations
  * Dynamic title hover effect (letter-by-letter span)
  * Custom scrollbar styling
  * Interactive song list

---

## 🧩 Technologies Used
| Technology           | Purpose                              |
| -------------------- | ------------------------------------ |
| **HTML5**            | Structure of the application         |
| **CSS3**             | Styling, layout, responsiveness      |
| **JavaScript (ES6)** | Logic, event handling, audio control |
| **Audio API**        | Playing and controlling music        |
| **JSON**             | Album metadata (title, info)         |

---

## 📂 Project Structure

```
Spotify-Clone-Project/
│
├── index.html          # Main UI structure
├── style.css           # Styling and responsiveness
├── script.js           # Core functionality
│
├── SVGs/               # Icons used in UI
│
├── songs/              # Albums folder
│   ├── Album1/
│   │   ├── song1.mp3
│   │   ├── cover.jpg
│   │   └── info.json
│   └── Album2/
│
└── README.md
```

---

## ⚙️ How It Works (Core Logic)

1. Album Loading
  * Fetches folder data using fetch()
  * Extracts <a> tags from server response
  * Loads album metadata (info.json)
    
2. Song Loading
  * Reads .mp3 files from selected folder
  * Stores songs in an array (songs[])
  * Dynamically renders song list
   
3. Audio Playback
  * Uses:
    * new Audio() → creates audio object
    * currentSong.src → sets track
    * currentSong.play() → plays music
     
4. Seek Bar Logic
  * Progress calculated using:
    
    ```
    progress = (currentTime / duration) * 100
    ```
    
  * Updates:
    * ```.seek-bar-fill``` (width)
    * ```.seek-bar-circle``` (position) 
6. Volume Control
  * Volume set using:
    
    ```
    currentSong.volume = value (0 to 1)
    ```
  
  * UI updated based on percentage

---

## ▶️ Setup Instructions

1. Install required tools:
   * Visual Studio Code with the ```live server``` extension

2. Clone the repository:

   ```
   git clone https://github.com/suraj-oswal-39/Spotify-Clone-Project.git
   ```

3. Open in Visual Studio Code:
   Click on ```Go Live``` at the bottom bar in Visual Studio Code 

---

## 👨‍💻 Author

**Suraj Uttamchand Oswal**
📧 [surajoswal3@gmail.com](mailto:surajoswal3@gmail.com)

---
