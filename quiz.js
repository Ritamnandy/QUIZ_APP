const startbtn = document.querySelector(".start-btn");
const type= document.querySelector("#type")
const noofquestion = document.getElementById("number-of-question");
const Choose_Difficulty = document.getElementById("Choose-Difficulty");
const Select_Category = document.getElementById("Select-Category");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");

alert(`
       Quiz rule:-
       (1) You will have only "15 seconds" per each questions.
       (2) You can't exit from the Quiz while You're playing.
       (3) You'll get points on the basis of your correct answers.
    `)


 let currentQuestionIndex = 0;
    let questions = [];
    let score = 0;
    let timeLeft = 15;
    let timer;
    let button;

startbtn.addEventListener("click" ,()=>{
    document.querySelector(".start-screen").style.display = "none";
    document.querySelector(".quiz-question").style.display = "block";
    startquiz();
});

 function startTimer(){
    timeLeft = 15;
    progressBar.style.width = "100%"; 
    progressBar.style.background = "#27ae60"; 

    timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}s` ;

    // Progress Bar update
    let percent = (timeLeft / 15) * 100;
    progressBar.style.width = percent + "%";

    if (timeLeft <= 5) {
        progressBar.style.background = "#e74c3c"; 
    } else if (timeLeft <= 10) {
        progressBar.style.background = "#f1c40f"; 
    } else {
        progressBar.style.background = "#27ae60"; 
    }

    if (timeLeft <= 0) {
        clearInterval(timer);
        checkanswer(null, questions[currentQuestionIndex].correct_answer);
         nextquestion();
    }
    }, 1000);
};
 


function startquiz(){

 const num = noofquestion.value;
 document.querySelector(".total").innerHTML =`/ ${num}`;
 const category = Select_Category.value;
 const difficulty = Choose_Difficulty.value;
 const qtype = type.value;

const url = `https://opentdb.com/api.php?amount=${num}&category=${category}&difficulty=${difficulty}&type=${qtype}`;
fetch(url)
.then(response =>response.json())
.then ( (data) =>{
    questions = data.results;
    console.log(questions);

    if(questions.length==0)
    {
        alert(`No Questions found! Please Try Again.`)
    }
    showquestion();
});
}

function  showquestion(){
    reset();
    startTimer();
    let questiondata = questions[currentQuestionIndex];
    document.querySelector(".current").innerHTML = currentQuestionIndex+1;
    document.querySelector(".question").innerHTML = `${questiondata.question}`;

    let options = [...questiondata.incorrect_answers,questiondata.correct_answer];
    options.sort( ()=>Math.random()-0.5);
    options.forEach( (i)=>{
         button = document.createElement("button");
        button.classList.add("answer-text");
        button.textContent = i;
        button.onclick =() => checkanswer(i,questiondata.correct_answer);
        document.querySelector(".answer").appendChild(button);
    });
    

}

function checkanswer(select,currectans){
    clearInterval(timer);
    const buttons =  document.querySelector(".answer").querySelectorAll("button");
    buttons.forEach ( (btn)=>{
        if(btn.innerHTML === currectans)
            btn.style.backgroundColor = "green";
        else if(btn.innerHTML === select)
            btn.style.backgroundColor = "red";
        btn.disabled = true;
        btn.style.cursor ="none";
    });
    if(select=== currectans)
    {
        score++;
        document.querySelector(".score").innerHTML = score;
    }
    document.querySelector(".Next-btn").style.display = "block";
}

function nextquestion(){

    currentQuestionIndex++;
    if(currentQuestionIndex<questions.length)
        showquestion();
    else showscore();
}

function reset()
{
    document.querySelector(".Next-btn").style.display = "none";
    document.querySelector(".answer").innerHTML = "";
    clearInterval(timer);

}

function showscore()
{
    document.querySelector(".quiz-question").style.display ="none";
    document.querySelector(".end-screen").style.display ="block";
    document.querySelector(".your-score").innerHTML=`Your Score: ${score} / ${questions.length}`;
    document.querySelector(".exit").addEventListener("click",()=>{
        document.querySelector(".app").style.display ="none";
        alert(`🙏 Thanks for playing!`);
    });
    document.querySelector(".play-again").addEventListener("click",()=>{
        document.querySelector(".end-screen").style.display ="none";
         document.querySelector(".start-screen").style.display = "block";
        document.querySelector(".quiz-question").style.display = "none";
         document.querySelector(".score").innerHTML = '';
          document.querySelector(".current").innerHTML = '';
         document.querySelector(".question").innerHTML = '';
         currentQuestionIndex = 0;
         questions = [];
         score = 0;
         timeLeft = 15;
         timer;
         button;

    });

}


document.querySelector(".Next-btn").addEventListener("click",nextquestion);

