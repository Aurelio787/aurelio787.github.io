let alfred = document.getElementById("alfred");
let input1 = 0; 
let input2 = 0;
let operator = false;
let alertMessage = "0";

alfred.value = alertMessage; 

    

if (input1 === 0 && operator === false && input2 === 0) {
 alertMessage = "0";
}
    else if (input1 !== 0 && operator === false && input2 !== 0) {
        alertMessage = input1;
}
    else if (input1 !== 0 && operator !== false && input2 === 0) {
        alertMessage = input1  + operator + "was ist ihre 2. Zahl?";
    }
    else if (input1 !== 0 && operator !== false && input2 !== 0) {
        alertMessage = input1 + operator + input2;
    }


 const button7 = document.getElementById("button7");
 button7.addEventListener("click", function() {
    if (input1 == 0 ){
        input1 = 7;
        alertMessage = input1;
    }
        else   {
        input2 = 7;
        alertMessage = input1 + operator + input2;
    }
    alfred.value = alertMessage;
});
const button8 = document.getElementById("button8");
button8.addEventListener("click", function() {
    if (input1 == false ){
        input1 = 8;
        alertMessage = input1;
    }
        else   {
        input2 = 8;
        alertMessage = input1 + operator + input2;
    }
    alfred.value = alertMessage;
});
const button9 = document.getElementById("button9");
button9.addEventListener("click", function() {
    if (input1 == false ){
        input1 = 9;
        alertMessage = input1;
    }
        else   {
        input2 = 9;
        alertMessage = input1 + operator + input2;
    }
    alfred.value = alertMessage;
});
const buttonGETEILT = document.getElementById("buttonGETEILT");
buttonGETEILT.addEventListener("click", function() {
    if (operator === false) {
        operator = "/";
        alertMessage = input1 + operator + "was ist ihre 2. Zahl?";
    }
    else {        alertMessage = "Operator bereits gesetzt";
    }
    alfred.value = alertMessage;
});

const button4 = document.getElementById("button4");
button4.addEventListener("click", function() {
    if (input1 == false ){
        input1 = 4;
        alertMessage = input1;
    }
        else   {
        input2 = 4;
        alertMessage = input1 + operator + input2;
    }
    alfred.value = alertMessage;
});
const button5 = document.getElementById("button5");
button5.addEventListener("click", function() {    if (input1 == false ){
        input1 = 5;
        alertMessage = input1;
    }
        else   {
        input2 = 5;
        alertMessage = input1 + operator + input2;
    }
    alfred.value = alertMessage;
});
const button6 = document.getElementById("button6");
button6.addEventListener("click", function() {    
    if (input1 == false ){
        input1 = 6;
        alertMessage = input1;
    }
        else   {
        input2 = 6;
        alertMessage = input1 + operator + input2;
    }
    alfred.value = alertMessage;
});
const buttonMAL = document.getElementById("buttonMAL");
buttonMAL.addEventListener("click", function() {
    if (operator === false) {
        operator = "*";
        alertMessage = input1 + operator + "was ist ihre 2. Zahl?";
    }
    else {        alertMessage = "Operator bereits gesetzt";
    }
    alfred.value = alertMessage;
});
const button1 = document.getElementById("button1");
button1.addEventListener("click", function() {    if (input1 == false ){
        input1 = 1;
        alertMessage = input1;
    }
        else   {
        input2 = 1;
        alertMessage = input1 + operator + input2;
    }
    alfred.value = alertMessage;
});
const button2 = document.getElementById("button2");
button2.addEventListener("click", function() {    if (input1 == false ){
        input1 = 2;
        alertMessage = input1;
    }
        else   {
        input2 = 2;
        alertMessage = input1 + operator + input2;
    }
    alfred.value = alertMessage;
});
const button3 = document.getElementById("button3");
button3.addEventListener("click", function() {    if (input1 == false ){
        input1 = 3;
        alertMessage = input1;
    }
        else   {
        input2 = 3;
        alertMessage = input1 + operator + input2;
    }
    alfred.value = alertMessage;
});
const buttonMINUS = document.getElementById("buttonMINUS");
buttonMINUS.addEventListener("click", function() {
    if (operator === false) {
        operator = "-";
        alertMessage = input1 + operator + "was ist ihre 2. Zahl?";
    }
    else {        alertMessage = "Operator bereits gesetzt";
    }
    alfred.value = alertMessage;
});
const button0 = document.getElementById("button0");
button0.addEventListener("click", function() {    if (input1 == false ){
        input1 = 0;
        alertMessage = input1;
    }
        else   {
        input2 = 0;
        alertMessage = input1 + operator + input2;
    }
    alfred.value = alertMessage;
});
const buttonPLUS = document.getElementById("buttonPLUS");
buttonPLUS.addEventListener("click", function() {
    if (operator === false) {
        operator = "+";
        alertMessage = input1 + operator + "was ist ihre 2. Zahl?";
    }
    else {        alertMessage = "Operator bereits gesetzt";
    }
    alfred.value = alertMessage;
});
const buttonGleich = document.getElementById("Gleich");
buttonGleich.addEventListener("click", function() {
    if (operator === false) {
        alert("Kein Operator gesetzt");
    }
    else if (input2 === false) {
        alertMessage = "Zweite Zahl fehlt";
    }
    else {
        let result;
        switch (operator) {
            case "+":
                result = input1 + input2;
                break;
            case "-":
                result = input1 - input2;
                break;
            case "*":
                result = input1 * input2;
                break;
            case "/":
                if (input2 === 0) {
                    alertMessage = "Division durch 0 nicht erlaubt";
                    alfred.value = alertMessage;
                    return;
                }
                result = input1 / input2;
                break;  
        }
        alertMessage = "Ergebnis: " + result;
        alfred.value = alertMessage;
        input1 = 0;
        input2 = 0;
        operator = false;
    }
});
const buttonPUNKT = document.getElementById("buttonClear");
buttonPUNKT.addEventListener("click", function() { 
    if (input1 !== false) {
        input1 = 0;
    }
     if (input2 !== false) {
        input2 = 0;
    }
       if (operator !== false) {
        operator = false;
    }
        alertMessage = "0";
    
{
    alfred.value = alertMessage;
}
});

