
 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
 import { getDatabase, push, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyAWn0Hv7vgykk1SBIZn2qNDl5mE5mwLpis",
   authDomain: "myquizappfirebase-d38df.firebaseapp.com",
   projectId: "myquizappfirebase-d38df",
   storageBucket: "myquizappfirebase-d38df.appspot.com",
   messagingSenderId: "215452585904",
   appId: "1:215452585904:web:e92a634c847f8698715075",
   measurementId: "G-CCV0JEDKRG"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);
 var db = getDatabase();    


var questions = [
    {
        question: "What does HTML stand for?",
        answer: "Hyper Text Markup Language",
        options: [
            "Hyper Text Preprocessor",
            "Hyper Text Markup Language",
            "Hyper Text Multiple Language",
            "Hyper Tool Multi Language",
        ],
    },
    {
        question: "What does CSS stand for?",
        answer: "Cascading Style Sheet",
        options: [
            "Common Style Sheet",
            "Colorful Style Sheet",
            "Computer Style Sheet",
            "Cascading Style Sheet",
        ],
    },
    {
        question: "Is HTML a programming language?",
        answer: "NO",
        options: [
            "YES",
            "NO",
        ],
    },
    {
        question: "What does SQL stand for?",
        answer: "Structured Query Language",
        options: [
            "Stylish Question Language",
            "Stylesheet Query Language",
            "Statement Question Language",
            "Structured Query Language",
        ],
    },
    {
        question: "What does XML stand for?",
        answer: "eXtensible Markup Language",
        options: [
            "eXtensible Markup Language",
            "eXecutable Multiple Language",
            "eXTra Multi-Program Language",
            "eXamine Multiple Language",
        ],
    },

];


var displayque =  document.getElementById("displayquestion");
var CurrentQueNumber =  document.getElementById("currentQuestionNumber");
var TotalQueNumber =  document.getElementById("TotalQuestionNumber");
var OptionsParent = document.getElementById("optionsParent");

var indexVal = 0;
var marks = 0;

function renderQuestion() {
    var que = questions[indexVal];
    displayque.innerHTML = que.question;
    TotalQueNumber.innerHTML = questions.length;
    CurrentQueNumber.innerHTML = indexVal + 1;
  
    var userResponse = {
      question: que.question,
      userAnswer: null,
    };
  
    OptionsParent.innerHTML = "";
    for (var i = 0; i < que.options.length; i++) {
      OptionsParent.innerHTML += `<div class="col-md-6 mb-3">
        <button onclick="CheckAns('${que.answer}', '${que.options[i]}', ${indexVal})" class="opt bg-info-subtle w-100 p-3  a">
          ${que.options[i]}
        </button>
      </div>`;
    }
  
    var userResponseRef = ref(db, "userResponses/" + indexVal); // Create a unique reference for each question
    userResponse.id = userResponseRef.key;
    set(userResponseRef, userResponse);
    console.log(userResponse);
  
    onValue(userResponseRef, (snapshot) => {
      var response = snapshot.val();
      console.log(response.userAnswer);
    //   console.log(userResponse);
      var marks = calculateMarks();
      console.log("Marks:", marks);

      var marksRef = ref(db, "marks");
      set(marksRef, marks); 
  
    });
  }
  
  renderQuestion();

  function calculateMarks() {
    var marks = 0;
    for (var i = 0; i < questions.length; i++) {
      var userResponseRef = ref(db, "userResponses/" + i);
      onValue(userResponseRef, (snapshot) => {
        var response = snapshot.val();
        if (response && response.userAnswer === questions[i]?.answer) {
          marks++;
        }
      });
    }
    return marks;
  }
  

function nextQues(){
    indexVal++;
    renderQuestion();
}
window.CheckAns = function (correctAnswer, selectedOption, questionIndex) {
    var userResponseRef = ref(db, "userResponses/" + questionIndex);
    set(userResponseRef, { userAnswer: selectedOption });

    if (correctAnswer === selectedOption) {
        marks++;
    }

    var selectedOptionButton = OptionsParent.querySelector(`button[data-answer="${selectedOption}"]`);
    if (selectedOptionButton) {
        selectedOptionButton.classList.add("selected");
    }

    nextQues();
};
  renderQuestion();