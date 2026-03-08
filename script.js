
const startBtn = document.getElementById("startBtn");
const landingScreen = document.getElementById("landingScreen");
const setupScreen = document.getElementById("setupScreen");
const countdownScreen = document.getElementById("countdownScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");

const continueBtn = document.getElementById("continueBtn");
const countEl = document.getElementById("count");
const contentArea = document.getElementById("contentArea");
const roundInfo = document.getElementById("roundInfo");
const finalScores = document.getElementById("finalScores");

const uploadInput = document.getElementById("memeUpload");
const uploadBtn = document.getElementById("uploadBtn");
const uploadMsg = document.getElementById("uploadMsg");

const video = document.getElementById("camera");



let faceMesh, cam;
let analyser, micData;
let audioInterval;

let selectedPlayers = null;
let selectedRounds = null;

let gameMode = 1;
let totalRounds = 5;
let currentRound = 0;

let player1Score = 0;
let player2Score = 0;

let player1Laughed = false;
let player2Laughed = false;

let gameRunning = false;

let shuffledContent = [];

const contentList = [

  { type: "image", src: "content/memes/meme1.webp" },
  { type: "image", src: "content/memes/meme2.jpg" },
  { type: "image", src: "content/memes/meme3.jpg" },
  { type: "image", src: "content/memes/meme4.png" },
  { type: "image", src: "content/memes/meme5.jpg" },
  { type: "video", src: "content/videos/video1.mp4" },
  { type: "video", src: "content/videos/video2.mp4" },
  { type: "video", src: "content/videos/video3.mp4" },
  { type: "video", src: "content/videos/video4.mp4" },
  { type: "video", src: "content/videos/video5.mp4" },
  { type: "video", src: "content/videos/video6.mp4" },
  { type: "video", src: "content/videos/video7.mp4" },
  { type: "video", src: "content/videos/video8.mp4" },
  { type: "video", src: "content/videos/video9.mp4" },
  { type: "video", src: "content/videos/video10.mp4" },
  { type: "video", src: "content/videos/video11.mp4" },
  { type: "video", src: "content/videos/video12.mp4" },
  { type: "video", src: "content/videos/video13.mp4" },
  { type: "video", src: "content/videos/video14.mp4" },
  { type: "video", src: "content/videos/video15.mp4" },
  { type: "video", src: "content/videos/video16.mp4" },
  { type: "video", src: "content/videos/video17.mp4" },
  { type: "video", src: "content/videos/video18.mp4" },
  { type: "video", src: "content/videos/video19.mp4" },
  { type: "video", src: "content/videos/video20.mp4" },
  { type: "video", src: "content/videos/video21.mp4" },
  { type: "video", src: "content/videos/video22.mp4" },
  { type: "video", src: "content/videos/video23.mp4" },
  { type: "video", src: "content/videos/video24.mp4" },
  { type: "video", src: "content/videos/video25.mp4" },
  { type: "video", src: "content/videos/video26.mp4" },
  { type: "video", src: "content/videos/video27.mp4" },
  { type: "video", src: "content/videos/video28.mp4" },
  { type: "video", src: "content/videos/video29.mp4" },
  { type: "video", src: "content/videos/video30.mp4" },
  { type: "video", src: "content/videos/video31.mp4" },
  { type: "video", src: "content/videos/video32.mp4" }
];

document.addEventListener("click", () => { bgVideo.muted = false; bgVideo.play(); }, { once: true });

function switchScreen(from, to) {
  from.classList.remove("active");
  to.classList.add("active");
}

startBtn.addEventListener("click", () => {
  bgVideo.pause();
  switchScreen(landingScreen, setupScreen);
});

document.querySelectorAll(".choice-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".choice-btn")
      .forEach(b => b.classList.remove("selected"));

    btn.classList.add("selected");

    selectedPlayers = parseInt(btn.dataset.players);

    checkReady();
  });
});

document.querySelectorAll(".round-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".round-btn")
      .forEach(b => b.classList.remove("selected"));

    btn.classList.add("selected");

    selectedRounds = parseInt(btn.dataset.rounds);

    checkReady();
  });
});

function checkReady() {
  continueBtn.disabled = !(selectedPlayers && selectedRounds);
}

continueBtn.addEventListener("click", async () => {

  gameMode = selectedPlayers;
  totalRounds = selectedRounds;

  await startMedia();

  switchScreen(setupScreen, countdownScreen);

  startCountdown();
});

function startCountdown() {

  let count = 3;
  countEl.textContent = count;

  const timer = setInterval(() => {

    count--;

    if (count > 0) {
      countEl.textContent = count;
    }
    else {
      clearInterval(timer);

      switchScreen(countdownScreen, gameScreen);

      startGame();
    }

  }, 1000);

}

function startGame() {

  currentRound = 0;

  player1Score = 0;
  player2Score = 0;

  gameRunning = true;

  shuffledContent = shuffleArray(contentList)
    .slice(0, totalRounds);

  startRound();
}

function startRound() {

  if (currentRound >= totalRounds) {
    endGame();
    return;
  }

  player1Laughed = false;
  player2Laughed = false;

  roundInfo.textContent = `Round ${currentRound + 1}`;

  displayContent(shuffledContent[currentRound]);

  currentRound++;
}

function displayContent(item) {

  contentArea.innerHTML = "";

  if (item.type === "image") {

    const img = document.createElement("img");

    img.src = item.src;
    img.style.maxWidth = "100%";

    contentArea.appendChild(img);

    setTimeout(endRound, 8000);
  }

  else {
    const vid = document.createElement("video");

    vid.src = item.src;
    vid.autoplay = true;
    vid.controls = false;
    vid.muted = false;
    vid.volume = 1;
    vid.playsInline = true;

    vid.onended = endRound;

    contentArea.appendChild(vid);

    vid.play().catch(() => {
      console.log("Autoplay blocked by browser");
    });

    // const vid = document.createElement("video");

    // vid.src = item.src;
    // vid.autoplay = true;
    // vid.muted = true;
    // vid.playsInline = true;
    // vid.controls = false;
    // vid.style.maxWidth = "100%";

    // vid.onended = endRound;

    // contentArea.appendChild(vid);
  }
}

function endRound() {

  if (gameMode === 1) {

    if (!player1Laughed) {
      player1Score++;
    }

  } else {

    if (!player1Laughed) player1Score++;
    if (!player2Laughed) player2Score++;

  }

  startRound();
}

function endGame() {

  gameRunning = false;

  clearInterval(audioInterval);

  switchScreen(gameScreen, endScreen);

  if (gameMode === 1) {

    finalScores.innerHTML =
      `<h2>Final Score: ${player1Score}</h2>`;

  } else {

    let winner = "It's a Tie!";

    if (player1Score > player2Score) winner = "Player 1 Wins!";
    if (player2Score > player1Score) winner = "Player 2 Wins!";

    finalScores.innerHTML = `
    <p>Player 1: ${player1Score}</p>
    <p>Player 2: ${player2Score}</p>
    <h2>${winner}</h2>
    `;
  }
}

function penalize(player) {

  if (!gameRunning) return;

  if (player === 1 && !player1Laughed) {
    console.log("Player 1 laughed!");
    player1Laughed = true;
  }

  if (player === 2 && !player2Laughed) {
    console.log("Player 2 laughed!");
    player2Laughed = true;
  }
}

function handleFace(results) {

  if (!gameRunning) return;

  // if (!results.multiFaceLandmarks.length) return;
  if (!results.multiFaceLandmarks.length) {
    alert("⚠ No face detected. Please position your face in front of the camera.");
    return;
  }

  const faces = results.multiFaceLandmarks;

  if (gameMode === 1) {

    // if (faces.length !== 1) return;
    if (faces.length === 0) {
      alert("⚠ No face detected. Please position yourself in front of the camera.");
      return;
    }

    if (faces.length > 1) {
      alert("⚠ Only ONE player allowed in 1-Player mode.");
      return;
    }

    evaluateSmile(faces[0], 1);

  }

  if (gameMode === 2) {

    // if (faces.length !== 2) return;
    if (faces.length < 2) {
      alert("⚠ Two players required. Please ensure both faces are visible.");
      return;
    }

    if (faces.length > 2) {
      alert("⚠ Only two players allowed in 2-Player mode.");
      return;
    }

    faces.sort((a, b) => a[0].x - b[0].x);

    evaluateSmile(faces[0], 1);
    evaluateSmile(faces[1], 2);
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// function evaluateSmile(lm, player) {

//   const left = lm[61];
//   const right = lm[291];
//   const topLip = lm[13];
//   const bottomLip = lm[14];

//   const width = distance(left, right);
//   const height = distance(topLip, bottomLip);

//   // if (width > 0.08 || height > 0.07) {
//   //   penalize(player);
//   // }
//   console.log("Mouth width:", width);
//   console.log("Mouth height:", height);

//   if (width > 0.11 || height > 0.09) {
//     console.log("Smile detected!");
//     penalize(player);
//   }
// }

let smileFramesP1 = 0;
let smileFramesP2 = 0;

function evaluateSmile(lm, player) {

  const left = lm[61];
  const right = lm[291];
  const topLip = lm[13];
  const bottomLip = lm[14];

  const width = distance(left, right);
  const height = distance(topLip, bottomLip);

  if (!lm[61] || !lm[291] || !lm[13] || !lm[14]) {
    alert("⚠ Face not clearly visible");
    return;
  }

  let frames = player === 1 ? smileFramesP1 : smileFramesP2;

  if (width > 0.11 || height > 0.09) {
    frames++;
  } else {
    frames = 0;
  }

  if (frames > 10) {
    console.log("Smile detected!");
    penalize(player);
  }

  if (player === 1) smileFramesP1 = frames;
  if (player === 2) smileFramesP2 = frames;
}



async function startMedia() {

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  });

  video.srcObject = stream;

  faceMesh = new FaceMesh({
    locateFile: file =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 2,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults(handleFace);

  cam = new Camera(video, {
    onFrame: async () => {
      await faceMesh.send({ image: video });
    },
    width: 160,
    height: 120
  });

  cam.start();
}


function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const playAgainBtn = document.getElementById("playAgainBtn"); playAgainBtn.addEventListener("click", () => { switchScreen(endScreen, setupScreen); selectedPlayers = null; selectedRounds = null; continueBtn.disabled = true; document.querySelectorAll(".choice-btn").forEach(b => b.classList.remove("selected")); document.querySelectorAll(".round-btn").forEach(b => b.classList.remove("selected")); });

uploadBtn.addEventListener("click", () => {

  const file = uploadInput.files[0];

  if (!file) {
    uploadMsg.textContent = "⚠ Please choose a meme or video first!";
    return;
  }

  const url = URL.createObjectURL(file);

  const type = file.type.startsWith("video") ? "video" : "image";

  const newContent = {
    type: type,
    src: url
  };

  contentList.push(newContent);

  console.log("New content added:", newContent);
  console.log("Updated content pool:", contentList);

  uploadMsg.textContent = "😂 Meme added! It might appear in the next game.";

});