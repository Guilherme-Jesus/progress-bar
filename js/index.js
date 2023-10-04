const progressData = {
  currentProgress: 0,
  totalAulas: 15,
  previousProgress: 0,
  achievedMarkers: [false, false, false],
  completed: false,
  currentAula: 0,
};

// Helpers
function getElementById(id) {
  return document.getElementById(id);
}

function calculatePercentage() {
  return (progressData.currentAula / progressData.totalAulas) * 100;
}

function updateAulaLabel() {
  const aulaAtualLabel = getElementById("aulaAtual");
  aulaAtualLabel.innerText = `Aula Atual: ${progressData.currentAula}`;
}

function updatePercentagePosition() {
  const percentageLabel = getElementById("percentageLabel");
  const position = calculatePercentage();
  percentageLabel.innerText = progressData.currentAula;
  percentageLabel.style.left = `calc(${position}% - 8px)`;
}

function updateCompletionStatus() {
  progressData.completed = progressData.currentProgress >= 100;
  if (progressData.completed) {
    progressData.currentProgress = 100;
  }
}

function incrementCurrentAula(step) {
  progressData.currentAula += step;
  progressData.currentProgress = calculatePercentage();
  progressData.previousProgress = Math.max(
    progressData.previousProgress,
    progressData.currentProgress
  );
}

// Progress bars handling
function fillProgressBar(progressBar, subBarsPerBar, maxProgress, startIndex) {
  progressBar.innerHTML = "";
  for (let j = 0; j < subBarsPerBar; j++) {
    const subBar = document.createElement("div");
    subBar.style.width = `${100 / subBarsPerBar}%`;
    subBar.style.height = "100%";
    subBar.style.backgroundColor =
      maxProgress >= startIndex + j * (100 / progressData.totalAulas)
        ? "#8DBE00"
        : "#B0B7BA";
    progressBar.appendChild(subBar);
  }
}

function updateProgressBars() {
  const maxProgress = Math.max(
    progressData.currentProgress,
    progressData.previousProgress
  );
  const subBarsPerBar = Math.ceil(25 / (100 / progressData.totalAulas));

  [1, 2, 3, 4].forEach((barNumber) => {
    const progressBar = getElementById("progressBar" + barNumber);
    fillProgressBar(
      progressBar,
      subBarsPerBar,
      maxProgress,
      (barNumber - 1) * 25
    );
  });

  updatePercentagePosition();
}

// Markers Handling
function handleLottieCompletion(index) {
  stopLottieAudio(index); // ADICIONADO: Parar o áudio.

  const lottieElement = getElementById(`lottie${index}`);
  lottieElement.style.visibility = "hidden";
  getElementById(`icon${index}`).style.visibility = "visible";
}
function playLottieAudio(index) {
  const audioElement = getElementById(`lottie${index}Audio`);
  if (audioElement) {
    audioElement.play();
  }
}
function stopLottieAudio(index) {
  const audioElement = getElementById(`lottie${index}Audio`);
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0; // Reseta o áudio para o início.
  }
}
function checkForAchievedMarkers() {
  [25, 50, 75].forEach((marker, index) => {
    if (
      progressData.currentProgress >= marker &&
      !progressData.achievedMarkers[index]
    ) {
      getElementById(`icon${index + 1}`).style.visibility = "hidden";
      playLottieAudio(index + 1); // ADICIONADO: Iniciar áudio.
      const lottieElement = getElementById(`lottie${index + 1}`);      lottieElement.style.visibility = "visible";
      const lottiePlayer = lottieElement.querySelector("lottie-player");
      lottiePlayer.play();

      lottiePlayer.addEventListener("complete", () =>
        handleLottieCompletion(index + 1)
      );
      progressData.achievedMarkers[index] = true;
    }
  });
}

function initializeLotties() {
  for (let i = 1; i <= 3; i++) {
    const lottieElement = getElementById(`lottie${i}`).querySelector(
      "lottie-player"
    );
    lottieElement.pause();
    lottieElement.loop = false;
    lottieElement.autoplay = false;
  }
}

// Movement
function move(step) {
  const canMoveForward =
    step > 0 && (progressData.currentProgress < 100 || !progressData.completed);
  const canMoveBackward = step < 0 && progressData.currentAula > 0;

  if (canMoveForward || canMoveBackward) {
    incrementCurrentAula(step);
    updateCompletionStatus();
    checkForAchievedMarkers();
    updateProgressBars();
    updateAulaLabel();
  }
}

function moveForward() {
  move(1);
}

function moveBackward() {
  move(-1);
}

// Initialize
initializeLotties();
updateProgressBars();
updateAulaLabel();
