"use strict";

let alfred = document.getElementById("alfred");
let currentInput = "";   
let previousInput = "";  
let operator = null;     

function appendNumber(number) {
    if (currentInput === "0" && number === 0) return;
    if (currentInput === "0" && number !== 0) {
        currentInput = number.toString();
    } else {
        currentInput += number.toString();
    }
    updateDisplay(currentInput);
}

function setOperator(op) {
    if (previousInput !== "" && currentInput !== "") {
        calculate();
    }
    if (currentInput === "" && previousInput === "") return; 
    
    if (currentInput === "" && previousInput !== "") {
        operator = op;
        updateDisplay(previousInput + " " + operator);
        return;
    }

    operator = op;
    previousInput = currentInput;
    currentInput = ""; 
    updateDisplay(previousInput + " " + operator);
}

function calculate() {
    let result; // Variable am Anfang definieren!

    // --- SPEZIALREGEL TEIL 1: 6 * 7 rechnen ---
    if (previousInput === "6" && operator === "*" && currentInput === "7") {
        result = "67";
        updateDisplay(result);
        
        // Google-Effekt starten
        document.body.classList.add("google-effekt"); 
        setTimeout(() => { 
            document.body.classList.remove("google-effekt"); 
        }, 3000);

        // Wir speichern die 67, damit man beim nächsten "=" Klick den Rickroll kriegt
        currentInput = "67";
        previousInput = "";
        operator = null;
        return; 
    }
    
    // --- SPEZIALREGEL TEIL 2: Wenn bereits 67 im Display steht und man "=" drückt ---
    if (currentInput === "67" && operator === null) {
        // Rick-Roll öffnen 
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank"); 

        // Ergebnis auf 42 setzen 
        result = "42"; 
        updateDisplay(result); 
        currentInput = result.toString(); 
        previousInput = ""; 
        operator = null; 
        return; 
    }

    // --- NORMALER RECHENWEG ---
    if (operator === null || currentInput === "") return;

    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);

    if (prev === 9 && operator === "/" && curr === 11) {
        result = "not nine eleven bro";
    } 
    else {
        switch (operator) {
            case "+": result = prev + curr; break;
            case "-": result = prev - curr; break;
            case "*": result = prev * curr; break;
            case "/": result = curr === 0 ? "Error" : prev / curr; break;
        }
    }

    updateDisplay(result);
    currentInput = result.toString(); 
    previousInput = ""; 
    operator = null;
}

function updateDisplay(value) {
    alfred.value = value;
}

function clearAll() {
    currentInput = "";
    previousInput = "";
    operator = null;
    updateDisplay("0");
}

// --- EVENT LISTENER (IDs müssen mit HTML übereinstimmen!) ---
document.getElementById("button7").addEventListener("click", () => appendNumber(7));
document.getElementById("button8").addEventListener("click", () => appendNumber(8));
document.getElementById("button9").addEventListener("click", () => appendNumber(9));
document.getElementById("button4").addEventListener("click", () => appendNumber(4));
document.getElementById("button5").addEventListener("click", () => appendNumber(5));
document.getElementById("button6").addEventListener("click", () => appendNumber(6));
document.getElementById("button1").addEventListener("click", () => appendNumber(1));
document.getElementById("button2").addEventListener("click", () => appendNumber(2));
document.getElementById("button3").addEventListener("click", () => appendNumber(3));
document.getElementById("button0").addEventListener("click", () => appendNumber(0));

document.getElementById("buttonPLUS").addEventListener("click", () => setOperator("+"));
document.getElementById("buttonMINUS").addEventListener("click", () => setOperator("-"));
document.getElementById("buttonMULTIPLY").addEventListener("click", () => setOperator("*"));
document.getElementById("buttonDIVIDE").addEventListener("click", () => setOperator("/"));

document.getElementById("Gleich").addEventListener("click", calculate);
document.getElementById("buttonClear").addEventListener("click", clearAll);