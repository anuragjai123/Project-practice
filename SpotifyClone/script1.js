let currsong = new Audio();
let songs;
let currfolder;
let cardContainer = document.querySelector(".card-container");

function convertSecondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format the seconds to always be two digits
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  // Return the formatted string
  return `${minutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/SpotifyClone/${folder}/`);
  console.log(a);
  let b = await a.text();

  //  console.log(b);
  let div = document.createElement("div");
  div.innerHTML = b;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //show all the songs in the playlist
  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  for (const song of songs) {
    songul.innerHTML =
      songul.innerHTML +
      `<li> <img class="invert" src="music.svg" alt="">
                           <div class="info">
                               <div> ${song.replaceAll("%20", " ")} </div>
                               <div>Anurag</div>
                           </div>
                           <div class="playnow">
                               <span>Play Now</span>
                               <img class="invert" src="play.svg" alt="">
                           </div> </li>`;
  }

  //attach event listener to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currsong.src = `${currfolder}/` + track;
  // console.log(currfolder, track);
  if (!pause) {
    currsong.play();
    play.src = "./pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/SpotifyClone/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const e = array[i];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];

      //get the metadata of the folder
      let a = await fetch(
        `http://127.0.0.1:5500/SpotifyClone/songs/${folder}/info.json`
      );
      let response = await a.json();
      // console.log(response);
      // console.log(cardContainer);
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
                        <div class="play-icon">
                            <i class="fa-solid fa-play"></i>
                        </div>
                        <img src="songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
    }
  }

  //load the playlist when card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  //get list
  await getsongs("songs/cs");
  playMusic(songs[0], true);
  // console.log(songs);

  //display all the albums on the page
  displayAlbums();

  //attach an event to play next and prev
  play.addEventListener("click", () => {
    if (currsong.paused) {
      currsong.play();
      play.src = "./pause.svg";
    } else {
      currsong.pause();
      play.src = "./play.svg";
    }
  });

  //listen for time update
  currsong.addEventListener("timeupdate", (a) => {
    // console.log(currsong.currentTime, currsong.duration);
    document.querySelector(
      ".songtime"
    ).innerHTML = `${convertSecondsToMinutesSeconds(
      currsong.currentTime
    )} / ${convertSecondsToMinutesSeconds(currsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currsong.currentTime / currsong.duration) * 100 + "%";
    // console.log((currsong.currentTime / currsong.duration) *100 + "%")

    document.querySelector(".track").style.width =
      (currsong.currentTime / currsong.duration) * 100 + "%";
  });

  document.querySelector(".progress-bar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    currsong.currentTime = (currsong.duration * percent) / 100;
    // console.log(currsong.duration * percent);
  });

  //add an event listerner to hambgerger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //add an event listerner to close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  });

  //add an event listerner to prev
  prev.addEventListener("click", () => {
    currsong.pause();
    let index = songs.indexOf(currsong.src.split("/").slice(-1)[0]);
    // console.log(songs, index);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[songs.length - 1]);
    }
  });
  //add an event listerner to next
  next.addEventListener("click", () => {
    currsong.pause();
    let index = songs.indexOf(currsong.src.split("/").slice(-1)[0]);
    // console.log(songs, index);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]);
    }
  });

  // add an event to volume
  document.querySelector(".range").addEventListener("change", (e) => {
    // console.log(e.target , e.target.value)
    currsong.volume = parseInt(e.target.value) / 100;
  });

  //add event listener to mute the track

  document.querySelector(".volimg").addEventListener("click", (e) => {
    if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currsong.volume = 0;
      document.querySelector(".range").value = 0;
  }
  else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currsong.volume = .10;
      document.querySelector(".range").value = 10;
  }

  });
}

main();
