let currsong = new Audio();
let songs;

function convertSecondsToMinutesSeconds(seconds) {
  if(isNaN(seconds) || seconds < 0){
    return "00:00"
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

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/SpotifyClone/songs/");
  console.log(a);
  let b = await a.text();

  //  console.log(b);
  let div = document.createElement("div");
  div.innerHTML = b;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  // console.log(track)
  // let audioElement = new Audio("./songs/" + track); // Corrected variable name and path
  // console.log(audioElement);
  // // audioElement.play();
  // console.log(pause);
  currsong.src = "./songs/" + track;
  if (!pause) {
    currsong.play();
    play.src = "./pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  //get list
  songs = await getsongs();
  playMusic(songs[0], true);

  console.log(songs);
  //show all the songs in the playlist
  let songul = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
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
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
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

  //add an event listerner to prev or next
  prev.addEventListener("click", () => {
    let index = songs.indexOf(currsong.src.split("/").slice(-1)[0]);
    // console.log(songs, index);
    if ([index + 1] >= 0) {
      playMusic(songs[index + 1]);
    }
  });
  next.addEventListener("click", () => {
    currsong.pause();
    let index = songs.indexOf(currsong.src.split("/").slice(-1)[0]);
    // console.log(songs, index);
    if ([index + 1] < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // add an event to volume 
  document.querySelector(".range").addEventListener("change" , (e) => {
    // console.log(e.target , e.target.value)
    currsong.volume = parseInt(e.target.value)/100
  }
  )
}

main();
