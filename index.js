let timers = [];
let currentAudio = null; // Variable to store the current audio instance

document.getElementById("set-timer-btn").addEventListener("click", () => {
  let hours = parseInt(document.getElementById("hours").value) || 0;
  let minutes = parseInt(document.getElementById("minutes").value) || 0;
  let seconds = parseInt(document.getElementById("seconds").value) || 0;

  let totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (totalSeconds > 0) {
    startNewTimer(totalSeconds);
  }
});

function startNewTimer(totalSeconds) {
  const timerId = setInterval(() => {
    const timerIndex = timers.findIndex((t) => t.id === timerId); // Find the index of the current timer

    if (timers[timerIndex].totalSeconds <= 0) {
      clearInterval(timerId);
      playAlertSound();
      timers[timerIndex].isFinished = true; // Mark the timer as finished
      updateTimersDisplay();
    } else {
      timers[timerIndex].totalSeconds--; // Decrease the time left for this specific timer
      updateTimersDisplay();
    }
  }, 1000);

  timers.push({ id: timerId, totalSeconds, isFinished: false });
  updateTimersDisplay();
}

function updateTimersDisplay() {
  const container = document.getElementById("timers-container");
  container.innerHTML = ""; // Clear current display

  timers.forEach((timer, index) => {
    let timerElement = document.createElement("div");
    timerElement.classList.add("timer");

    const timerContent = document.createElement("div");
    timerContent.classList.add("timer-content");

    if (timer.isFinished) {
      timerElement.style.backgroundColor = "yellow";
      timerContent.innerHTML = `<span style="color: black; font-size: 20px;">Timer is Up!</span>`;
    } else {
      const hours = Math.floor(timer.totalSeconds / 3600);
      const minutes = Math.floor((timer.totalSeconds % 3600) / 60);
      const seconds = timer.totalSeconds % 60;

      timerContent.innerHTML = `Time Left: ${formatTime(hours)}:${formatTime(
        minutes
      )}:${formatTime(seconds)}`;
    }

    const stopButton = document.createElement("button");
    stopButton.textContent = timer.isFinished ? "  Stop  " : "Delete";
    stopButton.classList.add("stop-btn");
    stopButton.style.backgroundColor = timer.isFinished ? "black" : "";
    stopButton.style.color = timer.isFinished ? "white" : "";
    stopButton.addEventListener("click", () => stopTimer(index)); // Bind the stopTimer function

    timerContent.appendChild(stopButton);
    timerElement.appendChild(timerContent);

    container.appendChild(timerElement);
  });

  if (timers.length === 0) {
    container.innerHTML = "<p>You have no timers currently!</p>";
  }
}

function stopTimer(index) {
  clearInterval(timers[index].id); // Stop the timer
  if (currentAudio) {
    currentAudio.pause(); // Stop the audio if it's playing
    currentAudio.currentTime = 0; // Reset the audio to the start
  }
  timers.splice(index, 1); // Remove the timer from the array
  updateTimersDisplay(); // Update the UI
}

function formatTime(time) {
  return time.toString().padStart(2, "0");
}

function playAlertSound() {
  if (currentAudio) {
    currentAudio.pause(); // Pause any currently playing audio
  }
  currentAudio = new Audio("alarm.mp3"); // Create a new audio instance
  currentAudio
    .play()
    .then(() => {
      console.log("Audio played successfully");
    })
    .catch((error) => {
      console.error("Audio failed to play:", error);
    });
}
