function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document
    .querySelectorAll("#current-time2")
    .forEach((el) => (el.textContent = timeString));
}
setInterval(updateTime, 1000);
updateTime();

let timers = [];
let activeTimer = null;
let timerInterval = null;
let isPaused = false;

// Input Elements
const timerTitleInput = document.getElementById("timer-title");
const speakerNameInput = document.getElementById("speaker-name");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const timerList = document.getElementById("timer-items");
const speechTextInput = document.getElementById("speech-text");
const shortTextInput = document.getElementById("short-text");

// Buttons
const sendTextBtn = document.getElementById("send-text");
const clearTextBtn = document.getElementById("clear-text");
const saveTimerBtn = document.getElementById("save-timer");

// Display Elements
const sentLongText = document.getElementById("sent-long-text");
const ShowMessageController = document.getElementById("ShowMessageController");

const textFromPart1 = document.getElementById("text-from-part1");
const textFromPart2 = document.getElementById("text-from-part2");
const viewerTitle = document.getElementById("viewer-title");
const viewerSpeaker = document.getElementById("viewer-speaker");
const viewerTimer = document.getElementById("viewer-timer");

function renderTimers() {
  timerList.innerHTML = "";
  timers.forEach((timer, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${timer.title} - ${timer.speaker} (${String(timer.minutes).padStart(
      2,
      "0"
    )}:${String(timer.seconds).padStart(2, "0")})</span>
      <div>
        <button id="start-btn-${index}" onclick="toggleTimer(${index})">Mulai</button>
        <button onclick="deleteTimer(${index})">Hapus</button>
      </div>
    `;
    timerList.appendChild(li);
  });
}

function toggleTimer(index) {
  const startButton = document.getElementById(`start-btn-${index}`);
  if (isPaused) {
    // Resume the timer
    startButton.textContent = "Pause";
    startTimer(index);
  } else {
    // Pause the timer
    clearInterval(timerInterval);
    startButton.textContent = "Mulai";
  }
  isPaused = !isPaused;
}

function startTimer(index) {
  if (timerInterval) clearInterval(timerInterval);

  activeTimer = { ...timers[index] };
  let totalSeconds = activeTimer.minutes * 60 + activeTimer.seconds;

  viewerTitle.textContent = activeTimer.title;
  viewerSpeaker.textContent = activeTimer.speaker;
  textFromPart2.innerText = activeTimer.speech;
  sentLongText.innerText = activeTimer.speech;

  function updateCountdown() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    viewerTimer.textContent = `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
    if (totalSeconds <= 0) clearInterval(timerInterval);
    totalSeconds--;
  }

  updateCountdown();
  timerInterval = setInterval(updateCountdown, 1000);
}

function deleteTimer(index) {
  timers.splice(index, 1);
  renderTimers();
}

saveTimerBtn.addEventListener("click", () => {
  const title = timerTitleInput.value.trim();
  const speaker = speakerNameInput.value.trim();
  const minutes = parseInt(minutesInput.value, 10) || 0;
  const seconds = parseInt(secondsInput.value, 10) || 0;
  const speech = speechTextInput.value.trim();

  if (!title || !speaker || (minutes === 0 && seconds === 0) || !speech) return;

  timers.push({ title, speaker, minutes, seconds, speech });
  renderTimers();

  // Kosongkan input setelah disimpan
  timerTitleInput.value = "";
  speakerNameInput.value = "";
  minutesInput.value = "";
  secondsInput.value = "";
  speechTextInput.value = "";
});

sendTextBtn.addEventListener("click", () => {
  const text = shortTextInput.value.trim();
  if (!text) return;
  textFromPart1.textContent = text;
  ShowMessageController.textContent = text;
  shortTextInput.value = "";
});

clearTextBtn.addEventListener("click", () => {
  textFromPart1.textContent = "-";
  ShowMessageController.textContent = "-";
});

// Fitur Tambahan: Reset Viewer (reset semua tampilan di viewer)
const resetViewerBtn = document.getElementById("resetViewerBtn");
resetViewerBtn.addEventListener("click", function () {
  viewerTitle.textContent = "-";
  viewerSpeaker.textContent = "-";
  viewerTimer.textContent = "00:00";
  textFromPart1.textContent = "-";
  textFromPart2.textContent = "-";
  ShowMessageController.textContent = "-";
  sentLongText.textContent = "-";
  if (timerInterval) clearInterval(timerInterval);
});
document.querySelector(".section").appendChild(resetViewerBtn);
