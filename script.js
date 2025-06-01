const questions = [
    "Have I reaffirmed my faith in a loving, caring God today?",
    "Have I sought out the guidance of my Higher Power today? How?",
    "What have I done to be of service to God and the people around me?",
    "Has God given me anything to be grateful for today?",
    "Do I believe that my Higher Power can show me how to live and better align myself with the will of that power?",
    "Do I see any 'old patterns' in my life today? If so, which ones?",
    "Have I been resentful, selfish, dishonest, or afraid?",
    "Have I set myself up for disappointment?",
    "Have I been kind and loving toward all?",
    "Have I been worrying about yesterday or tomorrow?",
    "Did I allow myself to become obsessed about anything?",
    "Have I allowed myself to become too hungry, angry, lonely, or tired?",
    "Am I taking myself too seriously in any area of my life?",
    "Do I suffer from any physical, mental, or spiritual problems?",
    "Have I kept something to myself that I should have discussed with my sponsor?",
    "Did I have any extreme feelings today? What were they and why did I have them?",
    "What are the problem areas in my life today?",
    "Which defects played a part in my life today? How?",
    "Was there fear in my life today?",
    "What did I do today that I wish I hadn't done?",
    "What didn't I do today that I wish I had done?",
    "Am I willing to change?",
    "Has there been conflict in any of my relationships today? What?",
    "Am I maintaining personal integrity in my relations with others?",
    "Have I harmed myself or others, either directly or indirectly, today? How?",
    "Do I owe any apologies or amends?",
    "Where was I wrong? If I could do it over again, what would I do differently? How might I do better next time?",
    "Did I stay clean today?",
    "What were the feelings I had today? How did I use them to choose principle-centered action?",
    "What did I do to be of service to others today?",
    "What have I done today about which I feel positive?",
    "What has given me satisfaction today?",
    "What did I do today that I want to be sure I repeat?",
    "Did I go to a meeting or talk to another recovering addict today?",
    "What do I have to be grateful for today?"
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