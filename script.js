// Task Management with LocalStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTaskElement(task));
}

function createTaskElement(taskText) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${taskText}
    <button onclick="removeTask(this)">DELETE</button>
  `;
  document.getElementById("taskList").appendChild(li);
}

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (taskText === "") return;

  createTaskElement(taskText);

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
}

function removeTask(button) {
  const li = button.parentElement;
  const text = li.firstChild.textContent.trim();

  li.remove();

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => task !== text);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let timerInterval = null;
let startTime = null;
let elapsed = 0;

function updateTimerDisplay(ms = 0) {
  const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  document.getElementById("timer").textContent = `${minutes}:${seconds}:${milliseconds}`;
}

function startTimer() {
  if (timerInterval) return;
  startTime = Date.now() - elapsed;
  timerInterval = setInterval(() => {
    elapsed = Date.now() - startTime;
    updateTimerDisplay(elapsed);
  }, 50);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  localStorage.setItem("timerElapsed", elapsed);
}

function resetTimer() {
  pauseTimer();
  elapsed = 0;
  localStorage.setItem("timerElapsed", elapsed);
  updateTimerDisplay(0);
}


window.onload = function () {
  loadTasks();
  updateCurrentTime();
  updateTimerDisplay(); // show 00:00:00 initially

  // Load elapsed timer from localStorage if exists
  elapsed = parseInt(localStorage.getItem("timerElapsed")) || 0;
  updateTimerDisplay(elapsed);
  setInterval(updateCurrentTime, 1000);
};


function updateCurrentTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString(); // eg. 14:36:08
  document.getElementById("currentTime").textContent = timeStr;
}

setInterval(updateCurrentTime, 1000); // update every second

function displayRandomQuote() {
  const quotes = [
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
    "The future depends on what you do today. – Mahatma Gandhi",
    "Your limitation—it’s only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Success doesn’t just find you. You have to go out and get it.",
    "It always seems impossible until it’s done. – Nelson Mandela",
    "Stay focused and never give up.",
    "Discipline is doing what needs to be done, even if you don’t want to do it."
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote").textContent = quotes[randomIndex];
}

function fetchWeather() {
  if (!navigator.geolocation) {
    document.getElementById("weather").textContent = "Geolocation not supported.";
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = "9fb342feeb256e98b6b10831d0d25d7b";

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const temp = data.main.temp;
        const city = data.name;
        const desc = data.weather[0].description;
        const icon = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        document.getElementById("weather").innerHTML = `
          <img src="${iconUrl}" alt="${desc}" style="vertical-align: middle; width: 40px;">
          <strong>${temp}°C</strong> in ${city} <br><em>${desc}</em>
        `;
      })
      .catch(err => {
        console.error(err);
        document.getElementById("weather").textContent = "Unable to fetch weather.";
      });

  }, err => {
    console.error(err);
    document.getElementById("weather").textContent = "Location permission denied.";
  });
}


// Load saved tasks on page load
window.onload = function () {
  displayRandomQuote();
  loadTasks();
  updateTimerDisplay();
  fetchWeather();

};