const questions = [
    "Did I pray or meditate today?",
    "Did I read recovery literature today?",
    "Did I go to a meeting or talk to another person in recovery?",
    "What defects of character did I act on today? (Such as selfishness, fear, pride, anger, greed, gluttony, envy, lust, sloth, negative thinking, self-pity, criticizing, controlling, intolerance, unkindness, etc.)",
    "What spiritual principles did I practice today? (Such as honesty, hope, faith, courage, integrity, willingness, humility, brotherly love, discipline, perserverance, spiritual awareness, service, positive thinking, compassion, etc.)",
    "Have I been kind and loving toward all, or was I just thinking of myself?",
    "Did I become obsessed with anything or feel overpowering emotions?",
    "Do I owe any apologies or amends?",
    "Have I kept something to myself that should be shared?",
    "Did I stay focused on today, or did I worry about the past or future?",
    "What do I have to be grateful for today? (Including things I did well.)",
    "What would I change about my thinking or behavior today?",
    "What did I learn today?"
];
let current = 0;
let answers = [];

window.onload = function () {
    const questionEl = document.getElementById("question-text");
    const textarea = document.getElementById("answer");
    const nextBtn = document.getElementById("next");
    const submitBtn = document.getElementById("submit");
    const progressBar = document.getElementById("progress");

    function loadQuestion() {
        questionEl.innerText = questions[current];
        textarea.value = answers[current] || "";
        progressBar.style.width = ((current + 1) / questions.length) * 100 + "%";
    }

    nextBtn.addEventListener("click", () => {
        answers[current] = textarea.value;
        if (current < questions.length - 1) {
            current++;
            loadQuestion();
        }
        if (current === questions.length - 1) {
            nextBtn.style.display = "none";
            submitBtn.style.display = "block";
        }
    });

    submitBtn.addEventListener("click", () => {
        answers[current] = textarea.value;
        const baseDate = new Date().toISOString().split("T")[0];
        let date = baseDate;
        let counter = 1;
        while (localStorage.getItem(date)) {
            counter++;
            date = baseDate + "_" + counter;
        }
        const entry = { date: date, answers: answers };
        localStorage.setItem(date, JSON.stringify(entry));
        window.location.href = "history.html";
    });

    loadQuestion();
}

let meditationTimer = null;
let meditationSeconds = 300; // default 5 minutes

function toggleMeditationModal() {
    const modal = document.getElementById("meditation-modal");
    modal.style.display = modal.style.display === "none" ? "block" : "none";
}

function startMeditation() {
    const bell = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_282fdfb8b7.mp3");
    let timeLeft = meditationSeconds;
    const display = document.getElementById("timer-display");
    bell.play();
    meditationTimer = setInterval(() => {
        timeLeft--;
        const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const seconds = String(timeLeft % 60).padStart(2, '0');
        display.innerText = `${minutes}:${seconds}`;
        if (timeLeft <= 0) {
            clearInterval(meditationTimer);
            bell.play();
        }
    }, 1000);
}

function stopMeditation() {
    clearInterval(meditationTimer);
    document.getElementById("timer-display").innerText = "05:00";
}
