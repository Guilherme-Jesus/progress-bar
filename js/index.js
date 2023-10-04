const progressData = {
  currentProgress: 0,
  totalAulas: 15,
  previousProgress: 0,
  achievedMarkers: [false, false, false],
  completed: false,
  currentAula: 0,
};

function getElementById(id) {
  return document.getElementById(id);
}

function updatePercentageLabel() {
  const percentageLabel = getElementById("percentageLabel");
  percentageLabel.innerText = progressData.currentAula;
  const position = (progressData.currentAula / progressData.totalAulas) * 100;
  percentageLabel.style.left = `calc(${position}% - 8px)`;
}

function updateCurrentAula(step) {
  progressData.currentAula += step;
  updateAulaAtualLabel();
}

function calculateProgress() {
  progressData.currentProgress =
    (progressData.currentAula / progressData.totalAulas) * 100;
  progressData.previousProgress = Math.max(
    progressData.previousProgress,
    progressData.currentProgress
  );
}

function updateAulaAtualLabel() {
  const aulaAtualLabel = getElementById("aulaAtual");
  aulaAtualLabel.innerText = `Aula Atual: ${progressData.currentAula}`;
}

function move(step) {
  if (
    (step > 0 &&
      (progressData.currentProgress < 100 || !progressData.completed)) ||
    (step < 0 && progressData.currentAula > 0)
  ) {
    updateCurrentAula(step);
    calculateProgress();
    updateCompletionStatus();
    checkForAchievedMarkers();
    updateProgressBars();
  }
}
function updateCompletionStatus() {
  if (progressData.currentProgress >= 100) {
    progressData.currentProgress = 100;
    progressData.completed = true;
    // alert("Parabéns! Você completou todas as etapas.");
  } else {
    progressData.completed = false;
  }
}

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

  updatePercentageLabel();
}

function checkForAchievedMarkers() {
  [25, 50, 75].forEach((marker, index) => {
    if (
      progressData.currentProgress >= marker &&
      !progressData.achievedMarkers[index]
    ) {
      // alert(`Você alcançou ${marker}% de progresso!`);
      getElementById(`icon${index + 1}`).style.visibility = "visible";
      progressData.achievedMarkers[index] = true;
    }
  });
}

function moveForward() {
  move(1);
}

function moveBackward() {
  move(-1);
}

updateAulaAtualLabel();
