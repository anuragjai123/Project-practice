let currsong = new Audio();
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

const playMusic = (track) => {
  // console.log(track)
  // let audioElement = new Audio("./songs/" + track); // Corrected variable name and path
  // console.log(audioElement);
  // // audioElement.play();

  currsong.src  = "./songs/" + track;
  currsong.play();
};

async function main() {

  //get list
  let songs = await getsongs();

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
}

main();
