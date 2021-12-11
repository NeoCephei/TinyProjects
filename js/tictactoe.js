let winCondition = false;
let blueTurn = true;
let maxPlays = 0;

function onDragStart(event,self) {
    event
        .dataTransfer
        .setData('text', event.target.id);
    
    self
        .style
        .opacity = 1;
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    const id = event
        .dataTransfer
        .getData('text');

    const draggableElement = document.getElementById(id);
    let dropzone = event.target;

    const availability = availableCell(dropzone, draggableElement);

    if (availability || dropzone.innerHTML == "DropZone") {
        addDiv(draggableElement);
        if (dropzone.innerHTML !== "DropZone") {
            if (dropzone.matches('.celda')) {
                
            } else if (dropzone.matches('.piece')) {
                dropzone = dropzone.parentNode;
            } else if (dropzone.matches('img')) {
                dropzone = dropzone.parentNode.parentNode;
            }
        }

        dropzone.innerHTML = "";
        dropzone.appendChild(draggableElement);

        dropzone.children.item(0).setAttribute('draggable','false');
        changeTurn();
        maxPlays++;

        event
            .dataTransfer
            .clearData();

        if(checkWinCondition() || maxPlays == 18){
            winCondition = true;
            setAllDragrablesFalse();
            window.alert('Partida Finalizada');
        }
    } else {
        event.preventDefault();
    }

}

$('#restartGame').on('click', function(){
    location.reload();
});

$('#startGame').on('click', function(ev){
    startGame(ev);
});

(()=>{
    document.querySelectorAll('.draggable').forEach(el => {
        el.addEventListener('dragstart', (ev) => {
            onDragStart(ev,el);
        });
    });
})();

function startGame(ev){
    const buttonCell = ev.currentTarget.parentNode.parentNode;
    const randomValue = (Math.round(Math.random()));

    flipCoin(randomValue);
    randomValue == 1 ? blueTurn = true : blueTurn = false;

    setTimeout(()=>{
        buttonCell.innerHTML = 'DropZone';
        blueTurn ? showBlueArrows() : showRedArrows();
    },3500);

    blueTurn ? setWaterDraggableTrue() : setFireDraggableTrue();
}

function addDiv(el){
    const voidDiv = document.createElement('div');
    el.parentNode.insertBefore(voidDiv,el.nextSibling);
}

function availableCell(dropzone, originalItem){
    const pieceString = originalItem.id;
    const pieceSize = pieceString.substr(0,3);
    const pieceType = pieceString.substr(3,1);

    if (dropzone.matches('.celda')) {
        dropzone = dropzone.firstChild;
    } else if (dropzone.matches('.piece')) {

    } else if (dropzone.matches('img')) {
        dropzone = dropzone.parentNode;
    } else {
        return false;
    }

    const cellString = dropzone.id || 'AAAA';
    const cellSize = cellString.substr(0,3);
    const cellType = cellString.substr(3,1);

    return possibleDropzone(pieceSize, pieceType, cellSize, cellType);
}

function possibleDropzone(pieceSize, pieceType, cellSize, cellType){
    if (pieceSize === cellSize || pieceType === cellType || pieceSize === 'Sml') {return false;}
    if (pieceSize === 'Med'){
        if (cellSize === 'Sml'){return true;}
    }
    if (pieceSize === 'Big'){
        if (cellSize === 'Med' || cellSize === 'Sml'){return true;}
    }
    return false;
}

function flipCoin(randomValue){
    let coinFlip;

    randomValue == 1 ? coinFlip = 'animate-heads' : coinFlip = 'animate-tails';
    $('#startGame').addClass('hide');
    $('.coin').removeClass('hide');
    setTimeout(()=>{
        $('.coin').addClass(coinFlip);
    },50);
}

function checkWinCondition(){
    let celdas = [];
    let tipoCeldas = [];
    let type;
    for (let i = 0; i < $('.board-wrapper').children().length; i++){
        celdas.push($('.board-wrapper').children()[i]);
    }

    for (let i = 0; i < celdas.length; i++){
        if (celdas[i].children.length === 0){
            tipoCeldas.push('V');
        } else {
            type = celdas[i].children.item(0).id.substr(3,1);
            tipoCeldas.push(type);
        }
    }

    if(tipoCeldas[0] === 'F' || tipoCeldas[0] === 'W') {
        if(tipoCeldas[0] === tipoCeldas[1] && tipoCeldas[1] === tipoCeldas[2]){return true;}
        if(tipoCeldas[0] === tipoCeldas[3] && tipoCeldas[3] === tipoCeldas[6]){return true;}
    }

    if(tipoCeldas[4] === 'F' || tipoCeldas[4] === 'W') {
        if(tipoCeldas[3] === tipoCeldas[4] && tipoCeldas[4] === tipoCeldas[5]){return true;}
        if(tipoCeldas[1] === tipoCeldas[4] && tipoCeldas[4] === tipoCeldas[7]){return true;}
        if(tipoCeldas[0] === tipoCeldas[4] && tipoCeldas[4] === tipoCeldas[8]){return true;}
        if(tipoCeldas[2] === tipoCeldas[4] && tipoCeldas[4] === tipoCeldas[6]){return true;}
    }

    if(tipoCeldas[8] === 'F' || tipoCeldas[8] === 'W') {
        if(tipoCeldas[6] === tipoCeldas[7] && tipoCeldas[7] === tipoCeldas[8]){return true;}
        if(tipoCeldas[2] === tipoCeldas[5] && tipoCeldas[5] === tipoCeldas[8]){return true;}
    }

    return false;
}

function setWaterDraggableTrue(){
    let pieces = document.querySelectorAll('.water-team > .water-piece');
    pieces.forEach((el)=>{
        el.setAttribute('draggable','true'); 
    });
}
function setFireDraggableTrue(){
    let pieces = document.querySelectorAll('.fire-team >.fire-piece');
    pieces.forEach((el)=>{
        el.setAttribute('draggable','true'); 
    });
}
function setAllDragrablesFalse(){
    setWaterDraggableFalse();
    setFireDraggableFalse();
}
function setWaterDraggableFalse(){
    let pieces = document.querySelectorAll('.water-team > .water-piece');
    pieces.forEach((el)=>{
        el.setAttribute('draggable','false'); 
    });
}
function setFireDraggableFalse(){
    let pieces = document.querySelectorAll('.fire-team >.fire-piece');
    pieces.forEach((el)=>{
        el.setAttribute('draggable','false'); 
    });
}

function changeTurn(){
    blueTurn = !blueTurn;
    blueTurn ? setFireDraggableFalse() : setWaterDraggableFalse();
    blueTurn ? setWaterDraggableTrue() : setFireDraggableTrue();
    blueTurn ? showBlueArrows() : showRedArrows();
}

function showBlueArrows() {
    let showArrows = document.querySelectorAll('.team-water-title');
    showArrows.forEach((el)=>{
        el.classList.remove('hide'); 
    });

    let hideArrows = document.querySelectorAll('.team-fire-title');
    hideArrows.forEach((el)=>{
        el.classList.add('hide');
    });
}
function showRedArrows() {
    let showArrows = document.querySelectorAll('.team-fire-title');
    showArrows.forEach((el)=>{
        el.classList.remove('hide'); 
    });

    let hideArrows = document.querySelectorAll('.team-water-title');
    hideArrows.forEach((el)=>{
        el.classList.add('hide');
    });
}
