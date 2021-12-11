const btns = document.querySelectorAll('.grid-item');
let lastOperation = document.querySelector('.last-operation');
let display = document.querySelector('.current-operation');
let solution = [];

btns.forEach(function (item) {
    item.addEventListener('click', function(el){
        const clickedElement = el.currentTarget.classList;
        const clickedValue = el.currentTarget.innerHTML;

        if (clickedElement.contains('number')){
            typeNumber(clickedValue);
        } else if (clickedElement.contains('action')){

            if (clickedValue == 'AC'){
                cleanDisplay();
            } else if (clickedValue == '=') {
                resolve()
            } else{
                calculate(clickedValue);
            }

        }

    });
});

function calculate(operator){

    if (display.innerHTML === '') {
        return displayError();
    } else if (solution.length > 0){
        if(solution[solution.length-1] === '+' || solution[solution.length-1] === '-' || solution[solution.length-1] === '*' || solution[solution.length-1] === '/' || solution[solution.length-1] === '%'){
            return displayError();
        }
        solution = [];
    }

    solution.push(display.innerHTML,operator);
    display.innerHTML = `${display.innerHTML} ${operator} `;
}

function cleanDisplay(){
    solution = [];
    display.innerHTML = '';
    lastOperation.innerHTML = '';
}

function displayError(){
    display.innerHTML = 'Syntax Error';
    setTimeout(cleanDisplay,500);
    solution = [];
}

function refreshResult(){
    const num1 = +solution[0];
    const num2 = +solution[2];
    const operator = solution[1];

    if(operator === '+'){
        return num1 + num2;
    }

    if(operator === '-'){
        return num1 - num2;
    }

    if(operator === '*'){
        return num1 * num2;
    }

    if(operator === '/'){
        return num1 / num2;
    }

    if(operator === '%'){
        return (num1 * num2)/100;
    }
}

function resolve(){
    const lastNumber = display.innerHTML.split(' ')[2];

    if (solution.length === 0 || lastNumber === '.'){
        return displayError();
    }

    lastNumber === '' ? alert('Añade un segundo valor') : showSolution(lastNumber);
}

function showSolution(num){
    solution.push(num);
    lastOperation.innerHTML = solution.join(' ');
    // display.innerHTML = eval(solution.join('')); Quiero hacerlo sin eval
    display.innerHTML = refreshResult();

}

function typeNumber(number){
    display.innerHTML += number;
}