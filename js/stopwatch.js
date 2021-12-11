//Js StopWatch

$(function(){
	console.log('Todu Bien');
});

const startBtn = document.getElementById('start-Btn');
const lapBtn = document.getElementById('lap-Btn');
const stopBtn = document.getElementById('stop-Btn');
const resetBtn = document.getElementById('reset-Btn');
let timeList = $('.times-list');

let miliSeconds = 0;
let seconds = 0;
let minutes = 0;

let appendMiliSeconds = document.getElementById('milisec');
let appendSeconds = document.getElementById('seconds');
let appendMinutes = document.getElementById('minutes');

let interval;
let seedTimer;
let lastTime;

startBtn.addEventListener('click', function(){
	// showLapButton();
	seedTimer = new Date().getTime();

	if (interval) clearInterval(interval);
    interval = setInterval(startTimerPuig, 10);
});

lapBtn.addEventListener('click', function(){

});

stopBtn.addEventListener('click', function(){
	if (interval) clearInterval(interval);

	lastTime = new Date().getTime() - seedTimer + (!lastTime ? 0 : lastTime);
});

resetBtn.addEventListener('click', function(){
	// showStartButton();
	if (interval) clearInterval(interval);
	resetVariables();
});

function showLapButton(){
	startBtn.classList.add('hide');
	lapBtn.classList.remove('hide');
}

function showStartButton(){
	lapBtn.classList.add('hide');
	startBtn.classList.remove('hide');	
}

function startTimer(){
	miliSeconds++;
	if(miliSeconds <= 9){
		appendMiliSeconds.innerHTML = '0' + miliSeconds;
	}

	if (miliSeconds > 9){
		appendMiliSeconds.innerHTML = miliSeconds;
	}

	if (miliSeconds > 99){
		seconds++;
		appendSeconds.innerHTML = seconds;
		miliSeconds = 0;
		appendMiliSeconds.innerHTML = '0' + milliseconds;
	}

	if(seconds <= 9){
		appendSeconds.innerHTML = '0' + seconds;
	}

	if(seconds > 9){
		appendSeconds.innerHTML = seconds;
	}

	if (seconds > 59){
		minutes++;
		appendMinutes.innerHTML = minutes;
		seconds = 0;
		appendSeconds.innerHTML = seconds;
	}
}

function resetVariables(){
	miliSeconds = "000";
	seconds = "00";
	minutes = "00";

	appendMiliSeconds.innerHTML = miliSeconds;
	appendSeconds.innerHTML = seconds;
	appendMinutes.innerHTML = minutes;

	lastTime = 0;

	// console.log(`Minutes: ${minutes}, seconds: ${seconds}, miliSeconds: ${miliSeconds}`);
}

function startTimerPuig(){
	const now = new Date().getTime();
	const differenceTime = now - seedTimer + (!lastTime ? 0 : lastTime);


	const milliseconds = differenceTime % 1000;
	const seconds = parseInt(differenceTime / 1000) % 60 ;
	const minutes = parseInt(differenceTime / (100060)) % 60;
	const hours   = parseInt(differenceTime / (100060*60)) % 24;

	appendMiliSeconds.innerHTML = ponerCeros(milliseconds,3);
	appendSeconds.innerHTML = ponerCeros(seconds,2);
	appendMinutes.innerHTML = ponerCeros(minutes,2);
	

	// console.log(` ${hours}hh ${minutes}mm  ${seconds}mm  ${milliseconds}ms`);
}

function ponerCeros(value,len){
	const ceros = len - value.toString().length;
	let valueToReturn = '';

	for(let i = 0; i < ceros ; i++){
		valueToReturn += '0';
	}
	valueToReturn += value;
	return valueToReturn;
}