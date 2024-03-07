let asearch = document.getElementById("asearch");
let ahome = document.getElementById("ahome");
let img1 = document.querySelector("#ahome img")
let img2 = document.querySelector("#asearch img")

document.addEventListener("DOMContentLoaded", () => {
    ahome.style.color = "white";
    img1.style.filter = "invert(100%)"
});

ahome.addEventListener("click", (evnt) => {
    evnt.preventDefault();
    img1.src = "./images/home.svg";
    img2.src = "./images/search.svg";
    ahome.style.color = "white";
    img1.style.filter = "invert(100%)"
    img2.style = "none"
    asearch.style = "none"


});

asearch.addEventListener("click", (evnt) => {
    evnt.preventDefault();
    img1.src = "./images/homeOutline.svg";
    img2.src = "./images/searchFill.svg";
    asearch.style.color = "white";
    img2.style.filter = "invert(100%)"
    img1.style = "none"
    ahome.style = "none";

});
document.querySelector(".home>a").addEventListener("click", (e) => {
    e.preventDefault();
})

let currentSong = new Audio();
let songs;
let currFolder;
const play = document.getElementById("play")
let sinfo = document.querySelector(".sinfo");
let previous = document.getElementById("previous");
let next = document.getElementById("next");

function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    
    var formattedTime = minutes + ":" + (remainingSeconds < 10 ? "0" : "") + Math.floor(remainingSeconds);

    return formattedTime;
}

async function getSong(folder) {
    currFolder = folder;
    const SongAPI = `/${folder}/`;
    let fetchSong = await fetch(SongAPI);
    let response = await fetchSong.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }



    let songUl = document.querySelector(".playlist ul");
    songUl.innerHTML = ""
    let i = 0;
    for (const song of songs) {
        
        songNameArtist = (song.split(`${currFolder}/`)[1].replaceAll("%20", " ").replaceAll(" %26", "").replaceAll(".mp3", ""));
       
        songName = (songNameArtist.split("-")[0]);
        songArtist = songNameArtist.split("-")[1];
        songUl.innerHTML = songUl.innerHTML + `<li>
        <div class="songImgInfo">
            <img src="./images/musicCover${i}.jpg" alt="">
            <div class="songinfo">
                <div class="songName">
                
                    ${songName}
                
                </div>
                <div class="songArtist">
                    ${songArtist}
                </div>
                
                </div>
            </div>
        <span class="material-symbols-outlined">
            play_circle
        </span>
        <div class="song">
                    ${song}
                </div>
        
    </li> `
        if (i >= 11) {
            i = 0;
        } else {
            i++;
        }
    }


    let songList = document.querySelectorAll(".playlist ul li");
    let click = 0;
    songList.forEach((li) => {
        li.addEventListener("click", () => {
            playMusic(li.querySelector(".song").innerHTML.trim());



        })
    })
    return songs;

}

async function displayAlbums() {
    const SongAPI = `./songs/`;
    let fetchSong = await fetch(SongAPI);
    let response = await fetchSong.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let card = document.querySelector(".cardContainer");
    let aas = div.querySelectorAll("a");
    
    for (let index = 0; index < aas.length; index++) {
        const i = aas[index];
        

        if (i.href.includes("/songs/")) {
            let folder = i.href.split("/").slice(-1)[0];
            const folderAPI = `./songs/${folder}/info.json`;
            let fetchFolder = await fetch(folderAPI);
            let folderResponse = await fetchFolder.json();
            
            card.innerHTML = card.innerHTML + `<div class="card" data-folder="${folder}">
                <img src="/songs/${folder}/cover.jpg" alt="">
                <div class="playImg">
                    <span class="material-symbols-outlined">
                        play_arrow
                    </span>
                </div>
                <h2>${folderResponse.title}</h2> <!-- Fixed typo: Changed tittle to title -->
                <p>${folderResponse.description}</p>
            </div>`;
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
            songs = await getSong(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
            document.querySelector(".left").style.left = "0";
            
        });
    });

    

}

displayAlbums();


async function main() {

    await getSong("songs/ncs")
    playMusic(songs[0], true)

    
    play.addEventListener("click", () => {
        
        if (currentSong.paused) {
            currentSong.play()
            play.innerText = "pause_circle"
        } else {
            currentSong.pause()
            play.innerText = "play_circle"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".stime").innerText = secondsToMinutesAndSeconds(currentSong.currentTime) + " / " + secondsToMinutesAndSeconds(currentSong.duration);
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".bar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    // document.querySelector(".right").addEventListener("click",()=>{
    //     document.querySelector(".left").style.left = "-100%";
    // })

    document.getElementById("menu").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".home >a span").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })

    

    previous.addEventListener("click", () => {
        
        let index = songs.indexOf(currentSong.src);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
        else {
            playMusic(songs[songs.length - 1])
        }
    })

    next.addEventListener("click", () => {
        
        let index = songs.indexOf(currentSong.src);
        
        if (index !== -1 && (index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
        else {
            playMusic(songs[0])
        }
    });

    let volume = 0.5;
    document.querySelector(".vol input").addEventListener("change", (e) => {
        
        volume = e.target.value / 100;
        currentSong.volume = e.target.value / 100;
        document.querySelector(".vol span").innerText = "volume_down"
    })
    let isClick = false;

    document.querySelector(".vol span").addEventListener("click", () => {
        
        if (isClick == false) {
            document.querySelector(".vol span").innerText = "volume_off"
            currentSong.volume = 0;
            document.querySelector(".vol input").value = 0
            isClick = true
        } else {
            document.querySelector(".vol span").innerText = "volume_down"
            currentSong.volume = volume;
            document.querySelector(".vol input").value = volume * 100;
            isClick = false
        }
    })



}

function playMusic(song, pause = false) {
    currentSong.src = song;
    if (!pause) {
        currentSong.play();
        play.innerText = "pause_circle"
    }
    sinfo.innerHTML = (song.split(`${currFolder}/`)[1].replaceAll("%20", " ").replaceAll(" %26", "").replaceAll(".mp3", ""));
}

main()









