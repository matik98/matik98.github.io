let PUZZLE_DIFFICULTY = 3;                /*plansza 4x4*/
const PUZZLE_HOVER_TINT = '#fe5f55';        /*kolor tla puzzla doc.*/

let _imgTitle = "img1.jpg";

let _canvas;
let _stage;                                 /*kontekst 2D*/
let _input;

let _img;                                   /*załadowany obrazek*/
let _pieces;                                /*tablica współ. dla kawałków*/
let _puzzleWidth;                           /*szeroko´s´c układanki*/
let _puzzleHeight;                          /*wysoko´s´c układanki*/
let _pieceWidth;                            /*szeroko´s´c puzzla*/
let _pieceHeight;                           /*wysoko´s´c puzzla*/
let _currentPiece;                          /*aktualnie przeci ˛agany*/
let _currentDropPiece;                      /*puzzle na jaki upuszczamy*/

let _mouse;                                 /*x,y - pozycja wska´znika myszy*/

let _frameColor = '#000000';

function init() {
    _img = new Image();
    _img.addEventListener('load', onImage);
    _img.src = _imgTitle;
    _input = document.getElementById('difficult');
    loadGallery();
    document.onkeydown=keyDownCallback;
}

function onImage() {

    _pieceWidth = Math.floor(_img.width / PUZZLE_DIFFICULTY);
    _pieceHeight = Math.floor(_img.height / PUZZLE_DIFFICULTY);
    _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY;
    _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY;
    setCanvas();
    initPuzzle();
}

function keyDownCallback(e){
    // e.preventDefault(); // prevents browser from interpreting the keys for other tasks
    let code= e.which || e.keyCode;
    if(code === 13) { // Enter
        PUZZLE_DIFFICULTY = parseInt(_input.value);
        onImage();
    }
}

function setCanvas() {
    _canvas = document.getElementById('canvas');
    _stage = _canvas.getContext('2d');
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
    _canvas.setAttribute("width",  _puzzleWidth);
    _canvas.setAttribute("height", _puzzleHeight);
    _canvas.style.border = "1px solid black";
    _canvas.style.marginLeft = "auto";
}

function initPuzzle() { /*inicjalizacja pierwotna i na replay*/
    _pieces = [];
    _mouse = {x: 0, y: 0};
    _currentPiece = null; /*na wypadek replay*/
    _currentDropPiece = null; /*na wypadek replay*/
    _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
    createTitle("Click to Start Puzzle");
    buildPieces();
}

function createTitle(msg) {
    _stage.fillStyle = "#000000";
    _stage.globalAlpha = .3;
    _stage.fillRect(100, _puzzleHeight - 40, _puzzleWidth - 200, 40);
    _stage.fillStyle = "#FFFFFF";
    _stage.globalAlpha = 1; /*˙zeby tekst nie był przezr.*/
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "20px Arial";
    _stage.fillText(msg, _puzzleWidth / 2, _puzzleHeight - 20);
}

function buildPieces() {
    let i;
    let piece;
    let xPos = 0;
    let yPos = 0;
    for (i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++) {
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        _pieces.push(piece);
        xPos += _pieceWidth;
        if (xPos >= _puzzleWidth) {
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    _canvas.onclick = shufflePuzzle;
    document.onmousemove = null;
    document.onmousedown = null;
}

function shufflePiecesArray() {
    let blank = Math.floor(Math.random()*PUZZLE_DIFFICULTY*PUZZLE_DIFFICULTY);
    for (let i = 0; i < 10000; i++) {
        let direction = Math.floor(Math.random()*4);
        if (direction === 0 && blank % PUZZLE_DIFFICULTY > 0) {
            swap(blank, blank-1);
            blank --;
        } else if (direction === 1 && Math.floor(blank / PUZZLE_DIFFICULTY) > 0) {
            swap(blank, blank - PUZZLE_DIFFICULTY);
            blank = blank - PUZZLE_DIFFICULTY;
        } else if (direction === 2 && blank % PUZZLE_DIFFICULTY < PUZZLE_DIFFICULTY - 1) {
            swap(blank, blank+1);
            blank = blank + 1;
        } else if (direction === 3 && Math.floor(blank/PUZZLE_DIFFICULTY) < PUZZLE_DIFFICULTY - 1) {
            swap(blank, blank + PUZZLE_DIFFICULTY);
            blank = blank + PUZZLE_DIFFICULTY;
        }
    }
    while(Math.floor(blank/PUZZLE_DIFFICULTY) > 0){
        swap(blank, blank - PUZZLE_DIFFICULTY);
        blank = blank - PUZZLE_DIFFICULTY;
    }
    while(blank%PUZZLE_DIFFICULTY > 0){
        swap(blank, blank - 1);
        blank = blank - 1;
    }
}

function swap(a, b) {
    let h = _pieces[a];
    _pieces[a] = _pieces[b];
    _pieces[b] = h;

}

function shufflePuzzle() {
    shufflePiecesArray();
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
    let i;
    let piece;
    let xPos = 0;
    let yPos = 0;
    for (i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        drawPiece(piece, i===0);
        xPos += _pieceWidth;
        if (xPos >= _puzzleWidth) {
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    document.onmousedown = onPuzzleClick;
    document.onmousemove = highlightPuzzle;
    _canvas.onclick = null;
}

function highlightPuzzle(e) {
    setMouseCoordinates(e);
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
    let piece;
    for (let i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        drawPiece(piece, i===0);
        if (_mouse.x < piece.xPos || _mouse.x >
            (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos
            || _mouse.y > (piece.yPos + _pieceHeight)) {
        } else {
            if(isPuzzleNextToBlank(piece)) {
                _stage.save();
                _stage.globalAlpha = .4;
                _stage.fillStyle = PUZZLE_HOVER_TINT;
                _stage.fillRect(piece.xPos,
                    piece.yPos, _pieceWidth,
                    _pieceHeight);
                _stage.restore();
            }
        }

    }
}

function isPuzzleNextToBlank(piece) {
    return (Math.abs(piece.xPos - _pieces[0].xPos) === _pieceWidth
        && Math.abs(piece.yPos - _pieces[0].yPos) === 0)
        || (Math.abs(piece.xPos - _pieces[0].xPos) === 0
            && Math.abs(piece.yPos - _pieces[0].yPos) === _pieceHeight);
}

function drawPiece(piece, blank) {
    _stage.save();
    if (blank) {
        _stage.fillStyle = _frameColor;
        _stage.fillRect(piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
    } else {
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeStyle = _frameColor;
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
    }
    _stage.restore();
}

function setMouseCoordinates(e) {
    if (e.layerX || e.layerX === 0) {
        _mouse.x = e.layerX;
        _mouse.y = e.layerY;
    } else if (e.offsetX || e.offsetX === 0) {
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
}

function swapPieceCoordinatesWithBlank(piece) {
    swapPieces(piece, _pieces[0]);
}

function swapPieces(piece1, piece2) {
    let tmp = {xPos: piece1.xPos, yPos: piece1.yPos};
    piece1.xPos = piece2.xPos;
    piece1.yPos = piece2.yPos;
    piece2.xPos = tmp.xPos;
    piece2.yPos = tmp.yPos;
}

function onPuzzleClick(e) {
    setMouseCoordinates(e);
    let piece = checkPieceClicked();
    if (piece != null) {
        if(isPuzzleNextToBlank(piece)) {
            swapPieceCoordinatesWithBlank(piece);
        }
    }
    resetPuzzleAndCheckWin();
}

function checkPieceClicked() {
    let piece;
    for (let i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        if (_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)) {
            //PIECE NOT HIT
        } else {
            return piece;
        }
    }
    return null;
}

function resetPuzzleAndCheckWin() {
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
    let gameWin = true;
    let i;
    let piece;
    for (i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
            drawPiece(_pieces[i], i === 0);
        if (piece.xPos !== piece.sx || piece.yPos !== piece.sy) {
            gameWin = false;
        }
    }
    if (gameWin) {
        setTimeout(gameOver, 500);
    }
}

function gameOver() {
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    initPuzzle();
}


