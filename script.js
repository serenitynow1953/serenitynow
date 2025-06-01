const questions = [
    "1. Have I reaffirmed my faith in a loving, caring God today?",
    "2. Have I sought out the guidance of my Higher Power today? How?",
    "3. What have I done to be of service to God and the people around me?",
    "4. Has God given me anything to be grateful for today?",
    "5. Do I believe that my Higher Power can show me how to live and better align myself with the will of that power?",
    "6. Do I see any 'old patterns' in my life today? If so, which ones?",
    "7. Have I been resentful, selfish, dishonest, or afraid?",
    "8. Have I set myself up for disappointment?",
    "9. Have I been kind and loving toward all?",
    "10. Have I been worrying about yesterday or tomorrow?",
    "11. Did I allow myself to become obsessed about anything?",
    "12. Have I allowed myself to become too hungry, angry, lonely, or tired?",
    "13. Am I taking myself too seriously in any area of my life?",
    "14. Do I suffer from any physical, mental, or spiritual problems?",
    "15. Have I kept something to myself that I should have discussed with my sponsor?",
    "16. Did I have any extreme feelings today? What were they and why did I have them?",
    "17. What are the problem areas in my life today?",
    "18. Which defects played a part in my life today? How?",
    "19. Was there fear in my life today?",
    "20. What did I do today that I wish I hadn't done?",
    "21. What didn't I do today that I wish I had done?",
    "22. Am I willing to change?",
    "23. Has there been conflict in any of my relationships today? What?",
    "24. Am I maintaining personal integrity in my relations with others?",
    "25. Have I harmed myself or others, either directly or indirectly, today? How?",
    "26. Do I owe any apologies or amends?",
    "27. Where was I wrong? If I could do it over again, what would I do differently? How might I do better next time?",
    "28. Did I stay clean today?",
    "29. What were the feelings I had today? How did I use them to choose principle-centered action?",
    "30. What did I do to be of service to others today?",
    "31. What have I done today about which I feel positive?",
    "32. What has given me satisfaction today?",
    "33. What did I do today that I want to be sure I repeat?",
    "34. Did I go to a meeting or talk to another recovering addict today?",
    "35. What do I have to be grateful for today?"
];

let current = 0;
let answers = [];
let editingDate = null;

const questionText = document.getElementById("question-text");
const answerBox = document.getElementById("answer");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const progressBar = document.getElementById("progress-bar");
const historyList = document.getElementById("history-list");

function loadQuestion() {
    if (current < questions.length) {
        questionText.innerText = questions[current];
        answerBox.value = answers[current] || "";
        updateProgress();
    } else {
        questionText.style.display = "none";
        answerBox.style.display = "none";
        nextBtn.style.display = "none";
        submitBtn.style.display = "inline-block";
        updateProgress();
    }
}

function updateProgress() {
    const percent = Math.floor((current / questions.length) * 100);
    progressBar.style.width = percent + "%";
    progressBar.innerText = `Progress: ${current}/${questions.length}`;
}

nextBtn.addEventListener("click", () => {
    answers[current] = answerBox.value;
    current++;
    loadQuestion();
});

submitBtn.addEventListener("click", () => {
    const date = editingDate || new Date().toISOString().split("T")[0];
    const entry = {
        date: date,
        answers: answers
    };
    localStorage.setItem(date, JSON.stringify(entry));
    loadHistory();
    location.reload();
});

function loadHistory() {
    historyList.innerHTML = "";
    Object.keys(localStorage).sort().forEach(key => {
        const li = document.createElement("li");
        li.innerText = key;
        li.onclick = () => editEntry(key);
        historyList.appendChild(li);
    });
}

function editEntry(date) {
    const entry = JSON.parse(localStorage.getItem(date));
    answers = entry.answers;
    current = 0;
    editingDate = date;
    questionText.style.display = "block";
    answerBox.style.display = "block";
    nextBtn.style.display = "inline-block";
    submitBtn.style.display = "none";
    loadQuestion();
}

loadQuestion();
loadHistory();