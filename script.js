const questions = [
  {
    question: "Qual é o custo de elixir do Golem?",
    options: [
      { text: "6", img: "images/6elixir.png" },
      { text: "7", img: "images/7elixir.png" },
      { text: "8", img: "images/8elixir.png" },
      { text: "9", img: "images/9elixir.png" }
    ],
    answer: "8"
  },
  {
    question: "Qual dessas cartas é lendária?",
    options: [
      { text: "Gigante", img: "images/gigante.png" },
      { text: "Mineiro", img: "images/mineiro.png" },
      { text: "Mosqueteira", img: "images/mosqueteira.png" },
      { text: "Valquíria", img: "images/valquiria.png" }
    ],
    answer: "Mineiro"
  },
  {
    question: "Qual feitiço causa dano em área?",
    options: [
      { text: "Flechas", img: "images/flechas.png" },
      { text: "Barril de Goblins", img: "images/barril.png" },
      { text: "Espírito de Gelo", img: "images/espirito.png" },
      { text: "Gigante Real", img: "images/gigante-real.png" }
    ],
    answer: "Flechas"
  },
  {
    question: "Qual carta tem menor custo de elixir?",
    options: [
      { text: "Arqueiras", img: "images/arqueiras.png" },
      { text: "Cavaleiro", img: "images/cavaleiro.png" },
      { text: "Esqueletos", img: "images/esqueletos.png" },
      { text: "Mini P.E.K.K.A", img: "images/minipekka.png" }
    ],
    answer: "Esqueletos"
  }
];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const rankingEl = document.getElementById("ranking");
const chestEl = document.getElementById("reward-chest");
const cardReward = document.getElementById("card-reward");
const cardInner = cardReward.querySelector(".card-inner");
const cardBack = cardReward.querySelector(".card-back");

let currentQuestion = 0;
let score = 0;

function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.innerHTML = `<img src="${option.img}" alt="${option.text}"> ${option.text}`;
    btn.addEventListener("click", () => checkAnswer(btn, q.answer, option.text));
    optionsEl.appendChild(btn);
  });

  nextBtn.classList.add("hidden");
}

function checkAnswer(button, correctAnswer, chosenText) {
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent.includes(correctAnswer)) {
      btn.classList.add("correct");
    }
  });

  if (chosenText === correctAnswer) {
    score++;
  } else {
    button.classList.add("wrong");
  }

  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  document.getElementById("quiz").classList.add("hidden");
  resultEl.classList.remove("hidden");

  let title = "";
  if(score <= 1) title = "Aprendiz de Goblin";
  else if(score <= 2) title = "Guerreiro da Arena";
  else if(score <= 3) title = "Herói Épico";
  else title = "Mestre Lendário!";

  rankingEl.textContent = `Você acertou ${score} de ${questions.length} - ${title}`;

  chestEl.classList.remove("hidden");
  cardReward.classList.add("hidden");
}

// Baú com animação flip
chestEl.addEventListener("click", () => {
  chestEl.classList.add("hidden");
  cardReward.classList.remove("hidden");

  const rewards = [
    { type: "Comum", img: "images/common_card.png" },
    { type: "Rara", img: "images/rare_card.png" },
    { type: "Épica", img: "images/epic_card.png" },
    { type: "Lendária", img: "images/legendary_card.png" }
  ];

  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  cardBack.style.backgroundImage = `url(${reward.img})`;

  setTimeout(() => {
    cardReward.classList.add("flip"); // agora bate com o CSS
  }, 200);
});

// Iniciar quiz
loadQuestion();
