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
    let result;

    // SPEZIALREGEL: 6 * 7
    if (previousInput === "6" && operator === "*" && currentInput === "7") {
        result = "67";
        updateDisplay(result);
        document.body.classList.add("google-effekt"); 
        setTimeout(() => { 
            document.body.classList.remove("google-effekt"); 
        }, 3000);
        currentInput = "67";
        previousInput = "";
        operator = null;
        return; 
    }
    
    // SPEZIALREGEL: Rickroll bei 67 + Gleich
    if (currentInput === "67" && operator === null) {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank"); 
        result = "42"; 
        updateDisplay(result); 
        currentInput = result.toString(); 
        return; 
    }

    if (operator === null || currentInput === "") return;

    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);

    if (prev === 9 && operator === "/" && curr === 11) {
        result = "not nine eleven bro";
    } else {
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

// Event Listeners
document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.id;
        if (id.includes('button') && !isNaN(id.replace('button', ''))) {
            appendNumber(parseInt(id.replace('button', '')));
        }
    });
});

// Manuelle Zuweisung für Operatoren (da IDs unterschiedlich benannt sind)
document.getElementById("buttonPLUS").onclick = () => setOperator("+");
document.getElementById("buttonMINUS").onclick = () => setOperator("-");
document.getElementById("buttonMULTIPLY").onclick = () => setOperator("*");
document.getElementById("buttonDIVIDE").onclick = () => setOperator("/");
document.getElementById("Gleich").onclick = calculate;
document.getElementById("buttonClear").onclick = clearAll;