"use strict";

let alfred = document.getElementById("alfred");
let formula = ""; 
let isResultDisplayed = false; // Neu: Merkt sich, ob gerade ein Ergebnis gezeigt wird

function appendNumber(number) {
    // Wenn gerade ein Ergebnis da steht und man eine Zahl drückt: Neustart
    if (isResultDisplayed) {
        formula = "";
        isResultDisplayed = false;
    }

    if (formula === "0" && number === 0) return;
    
    if (formula === "0" && number !== 0) {
        formula = number.toString();
    } else {
        formula += number.toString();
    }
    updateDisplay(formula);
}

function setOperator(op) {
    // Wenn ein Ergebnis da steht, wollen wir damit weiterrechnen (isResultDisplayed = false)
    if (isResultDisplayed) {
        isResultDisplayed = false;
    }

    if (formula === "") return;

    const lastChar = formula.slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar)) {
        formula = formula.slice(0, -1) + op;
    } else {
        formula += op;
    }
    updateDisplay(formula);
}

function calculate() {
    if (formula === "") return;

    try {
        // Spezialregeln
        if (formula === "6*7") {
            handleSpecialEffect("67", "google-effekt");
            isResultDisplayed = true;
            return;
        }

        if (formula === "67") {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
            formula = "42";
            updateDisplay(formula);
            isResultDisplayed = true;
            return;
        }

        if (formula === "9/11") {
            formula = "not nine eleven bro";
            updateDisplay(formula);
            isResultDisplayed = true;
            return;
        }

        // Berechnung mit Punkt-vor-Strich
        let result = new Function('return ' + formula)();

        if (!isFinite(result)) {
            result = "Error";
        }

        updateDisplay(result);
        formula = result.toString();
        isResultDisplayed = true; // Markieren, dass das Ergebnis feststeht

    } catch (e) {
        updateDisplay("Error");
        formula = "";
        isResultDisplayed = false;
    }
}

// Hilfsfunktion bleibt gleich
function handleSpecialEffect(value, cssClass) {
    updateDisplay(value);
    document.body.classList.add(cssClass);
    setTimeout(() => {
        document.body.classList.remove(cssClass);
    }, 3000);
    formula = value;
}

function updateDisplay(value) {
    alfred.value = value;
}

function clearAll() {
    formula = "";
    isResultDisplayed = false;
    updateDisplay("0");
}

// Event Listeners (Zahlen)
document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.id;
        if (id.startsWith('button') && !isNaN(id.replace('button', ''))) {
            appendNumber(parseInt(id.replace('button', '')));
        }
    });
});

// Zuweisungen
document.getElementById("buttonPLUS").onclick = () => setOperator("+");
document.getElementById("buttonMINUS").onclick = () => setOperator("-");
document.getElementById("buttonMULTIPLY").onclick = () => setOperator("*");
document.getElementById("buttonDIVIDE").onclick = () => setOperator("/");
document.getElementById("Gleich").onclick = calculate;
document.getElementById("buttonClear").onclick = clearAll;
