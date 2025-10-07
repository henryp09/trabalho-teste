const questions = [
  { question: "Qual é o custo de elixir do Golem?", options:[{text:"6",img:"images/6elixir.png"},{text:"7",img:"images/7elixir.png"},{text:"8",img:"images/8elixir.png"},{text:"9",img:"images/9elixir.png"}], answer:"8" },
  { question: "Qual dessas cartas é lendária?", options:[{text:"Gigante",img:"images/gigante.png"},{text:"Mineiro",img:"images/mineiro.png"},{text:"Mosqueteira",img:"images/mosqueteira.png"},{text:"Valquíria",img:"images/valquiria.png"}], answer:"Mineiro" },
  { question: "Qual feitiço causa dano em área?", options:[{text:"Flechas",img:"images/flechas.png"},{text:"Barril de Goblins",img:"images/barril.png"},{text:"Espírito de Gelo",img:"images/espirito.png"},{text:"Gigante Real",img:"images/gigante-real.png"}], answer:"Flechas" },
  { question: "Qual carta tem menor custo de elixir?", options:[{text:"Arqueiras",img:"images/arqueiras.png"},{text:"Cavaleiro",img:"images/cavaleiro.png"},{text:"Esqueletos",img:"images/esqueletos.png"},{text:"Mini P.E.K.K.A",img:"images/minipekka.png"}], answer:"Esqueletos" }
];
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const howBtn = document.getElementById('how-btn');
const howModal = document.getElementById('how-modal');
const closeHow = document.getElementById('close-how');
const quizScreen = document.getElementById('quiz-screen');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const qcountEl = document.getElementById('qcount');
const progressFill = document.getElementById('progress-fill');
const timerFill = document.getElementById('timer-fill');
const scoreDisplay = document.getElementById('score-display');
const resultScreen = document.getElementById('result-screen');
const rankingEl = document.getElementById('ranking');
const scoreFinalEl = document.getElementById('score-final');
const bestScoreEl = document.getElementById('best-score');
const chestEl = document.getElementById('reward-chest');
const cardReward = document.getElementById('card-reward');
const cardBack = cardReward.querySelector('.card-back');
const playAgainBtn = document.getElementById('play-again');
const backHomeBtn = document.getElementById('back-home');
const muteBtn = document.getElementById('mute-btn');
let currentQuestion=0, score=0, timePerQuestion=12, timeLeft=timePerQuestion, timerInterval=null, isMuted=false;
const sounds = { bg:'sounds/bg_music.mp3', click:'sounds/click.mp3', correct:'sounds/correct.mp3', wrong:'sounds/wrong.mp3', chest:'sounds/chest.mp3' };
const audio = { bg:new Audio(sounds.bg), click:new Audio(sounds.click), correct:new Audio(sounds.correct), wrong:new Audio(sounds.wrong), chest:new Audio(sounds.chest) };
audio.bg.loop=true; audio.bg.volume=0.25;
function playSound(name){ if(isMuted)return; const a=audio[name]; if(!a)return; a.currentTime=0; a.play().catch(()=>{}); }
function showScreen(el){ document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active')); el.classList.add('active'); }
startBtn.addEventListener('click',()=>{playSound('click'); startQuiz();});
function startQuiz(){ currentQuestion=0; score=0; updateScoreUI(); progressFill.style.width='0%'; showScreen(quizScreen); if(!isMuted) audio.bg.play().catch(()=>{}); loadQuestion(); }

function loadQuestion(){
  clearInterval(timerInterval); cardReward.classList.remove('flip'); cardReward.classList.add('hidden'); chestEl.classList.add('hidden');
  const q=questions[currentQuestion]; questionEl.textContent=q.question; optionsEl.innerHTML='';
  q.options.forEach(opt=>{
    const btn=document.createElement('button'); btn.className='option-btn';
    btn.innerHTML=`<img src="${opt.img}" alt="${opt.text}"><span>${opt.text}</span>`;
    btn.addEventListener('click',()=>checkAnswer(btn,q.answer,opt.text)); optionsEl.appendChild(btn);
  });
  qcountEl.textContent=`Pergunta ${currentQuestion+1} / ${questions.length}`;
  nextBtn.classList.add('hidden'); timeLeft=timePerQuestion; timerFill.style.width='100%'; timerInterval=setInterval(tickTimer,250);
}

function tickTimer(){ timeLeft-=0.25; if(timeLeft<0) timeLeft=0; const pct=(timeLeft/timePerQuestion)*100; timerFill.style.width=`${pct}%`;
  timerFill.style.background=pct<30?'linear-gradient(90deg,#ff4757,#ffb86b)':'linear-gradient(90deg,#ffa502,#ffb86b)';
  if(timeLeft<=0){ clearInterval(timerInterval); disableOptionsAfterTimeout(); nextBtn.classList.remove('hidden'); }
}

function disableOptionsAfterTimeout(){
  optionsEl.querySelectorAll('button').forEach(btn=>{
    btn.disabled=true;
    if(btn.textContent.includes(questions[currentQuestion].answer)) btn.classList.add('correct');
  });
  playSound('wrong');
}

function checkAnswer(button, correctAnswer, chosenText){
  playSound('click'); clearInterval(timerInterval);
  optionsEl.querySelectorAll('button').forEach(btn=>{btn.disabled=true; if(btn.textContent.includes(correctAnswer)) btn.classList.add('correct');});
  if(chosenText===correctAnswer){ score+=Math.ceil(timeLeft)*10; updateScoreUI(); button.classList.add('correct'); playSound('correct'); } else { button.classList.add('wrong'); playSound('wrong'); }
  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click',()=>{
  playSound('click'); currentQuestion++; progressFill.style.width=`${(currentQuestion/questions.length)*100}%`;
  currentQuestion<questions.length?loadQuestion():showResult();
});

function updateScoreUI(){ scoreDisplay.textContent=`Pts: ${score}`; }
function showResult(){
  clearInterval(timerInterval); showScreen(resultScreen);
  const maxPossible=questions.length*(timePerQuestion*10);
  const percent=(score/maxPossible)*100; let title='';
  if(percent<=25) title='Aprendiz de Goblin 🪓'; else if(percent<=55) title='Guerreiro da Arena ⚔️';
  else if(percent<=85) title='Herói Épico 🛡️'; else title='Mestre Lendário 👑';
  rankingEl.textContent=title; scoreFinalEl.textContent=`Você marcou ${score} pontos.`; bestScoreEl.textContent=`Melhor placar: ${saveAndGetBest(score)} pontos`;
  chestEl.classList.remove('hidden'); cardReward.classList.add('hidden');
}
const LS_KEY='clashQuizBest';
function saveAndGetBest(current){ const stored=Number(localStorage.getItem(LS_KEY)||'0'); if(current>stored)localStorage.setItem(LS_KEY,String(current)); return Math.max(current,stored); }
const rewards=[{type:"Comum",img:"images/common_card.png"},{type:"Rara",img:"images/rare_card.png"},{type:"Épica",img:"images/epic_card.png"},{type:"Lendária",img:"images/legendary_card.png"}];
chestEl.addEventListener('click',()=>{
  playSound('chest'); chestEl.classList.add('hidden'); cardReward.classList.remove('hidden');
  const r=weightedRandom(); cardBack.style.backgroundImage=`url(${r.img})`; cardReward.classList.remove('flip'); setTimeout(()=>{cardReward.classList.add('flip');},200);
});
function weightedRandom(){ const rnd=Math.random()*100; if(rnd<=50) return rewards[0]; if(rnd<=80) return rewards[1]; if(rnd<=95) return rewards[2]; return rewards[3]; }

playAgainBtn.addEventListener('click',()=>{ playSound('click'); startQuiz(); });
backHomeBtn.addEventListener('click',()=>{ playSound('click'); showScreen(startScreen); audio.bg.pause(); });
muteBtn.addEventListener('click',()=>{ isMuted=!isMuted; muteBtn.textContent=isMuted?'🔈':'🔊'; if(isMuted) audio.bg.pause(); else audio.bg.play().catch(()=>{}); });
howBtn.addEventListener('click',()=>{ howModal.classList.remove('hidden'); });
closeHow.addEventListener('click',()=>{ howModal.classList.add('hidden'); });
howModal.addEventListener('click',e=>{ if(e.target===howModal) howModal.classList.add('hidden'); });
showScreen(startScreen); document.getElementById('how-modal')?.classList.add('hidden');
