// Define global Variables
var players = ["X", "O"];                   // List of players
var current_player = 0;                     // Denote current player
var computer = 1;                           // Denote player is the computer
var game_status = "Intro";                  // Track game status: X = X wins, O = O wins, T = ties
var Xs = new Array(9).fill(0);              // Array to track X plays
var Os = new Array(9).fill(0);              // Array to track O plays
var moves = [];                             // Array to record all moves

/* Psuedo Code
 * while !gameIsOver() {
     switch(current_player) {
        case 0:  // human
            hintForPlayer();    // get hints for winning or blocking moves by hi-lighting squares
            awaiting click event
            break;
        case 1:  // computer
            hintForPlayer();    // This should return squareid to play
            playTheMove();
            break;
     } 
 }
 */

/* Description:
 * isWinner(), a boolean type,
 * determines whether a player's is a winner.
 * 
 * Params:
 * player = Integer to denote which player X or O
 *
 * Returns:
 * Boolean true if is a winner or false if not
 */
function isWinner(player) {
    // Get player's plays
    var plays = eval(players[player] + 's');

    // Check winning combinations
    // if sum of 3 squares equals to 3, that combination is a winner
    return (
        (plays[0] + plays[1] + plays[2] == 3) ||    // Row 1 across
        (plays[3] + plays[4] + plays[5] == 3) ||    // Row 2 across
        (plays[6] + plays[7] + plays[8] == 3) ||    // Row 3 across
        (plays[0] + plays[4] + plays[8] == 3) ||    // Left to right diagonal
        (plays[2] + plays[4] + plays[6] == 3) ||    // Right to left diagonal
        (plays[0] + plays[3] + plays[6] == 3) ||    // Col 1 down
        (plays[1] + plays[4] + plays[7] == 3) ||    // Col 2 down
        (plays[2] + plays[5] + plays[8] == 3)       // Col 3 down
    );
}

/* Description:
 * isGameOver(), a boolean type,
 * determines whether the game is over; 
 * Definition of Game Over is when there is no more square left to be played; thus a tie.
 * In this function, we can use either Xs or Os array to look for empty squares.
 * 
 * Params:
 * None
 *
 * Returns:
 * Boolean true if no empty squares to play or false if not
 */
function gameIsOver() {
    // Set local vars
    gameOver = true;
    
    // Loop to look for empty squares
    // If no empty squares, then all moves are made and thus a tie game
    for (var i = 0; i <= 9; i++) {
        if (Xs[i] == 0) {
            gameOver = false;
            break;
        }
    }
    
    return gameOver;
}

/* Description:
 * squareIsEmpty(), a boolean type, determines whether a square is occupied.
 * 
 * Params:
 * squareid = An integer (0..9) representing the game board
 *
 * Returns:
 * Boolean true if square is empty or false if not
 */
function squareIsEmpty(squareid) {
    // Check square's text is empty using squareid attribute
    return (
        $('*[squareid="'+squareid+'"').text() == ""
    );
}

/* Description:
 * possibleWinningMove(), a Integer type,
 * Given a 3 squares combination, this function returns the next move to win.
 * This same logic is used to determine next move to block.
 * 
 * Params:
 * plays = Array of recorded moves (or plays)
 * s1, s2, s3 = Integers of 3 square winning combination
 *
 * Returns:
 * nextMove = -1 denotes 3 squares combination is still undetermined (or not close to win)
 *          = s1, s2 or s3 to denote next move to win or to block.
 */
function possibleWinningMove(plays, s1, s2, s3) {
    // Set default as -1 to denote no move found
    var nextMove = -1;
    
    // If sum of combination > 1, then empty square is the next move to block or to win
    if ( plays[s1]+plays[s2]+plays[s3] > 1 ) {
        if (plays[s1] == 0) { nextMove = s1; }
        if (plays[s2] == 0) { nextMove = s2; }
        if (plays[s3] == 0) { nextMove = s3; }
    }
    
    return nextMove;
}

/* Description:
 * findNextMoves(), an action function,
 * This method changes the square background color to hint plays to block and to win.
 * It uses possibleWinningMove() function to find next possible moves.
 * Currently I defined 'winning-move' as green and 'blocking-move' as red classnames,
 * what that means is that if classname does not match, nothing happens.
 * 
 * Params:
 * plays = Array of recorded moves (or plays)
 * moveType = String of CSS classname 'winning-move' or 'blocking-move'
 *
 * Returns:
 * None
 */
function findNextMoves(plays, moveType) {
    // Set nextMoves as empty Array
    var nextMoves = [];
    
    // Remove current hints
    $("."+moveType).removeClass(moveType);
                    
    // Record possible winning/blocking moves
    nextMoves.push(possibleWinningMove(plays, 0, 1, 2));    // Row 1 winning combination
    nextMoves.push(possibleWinningMove(plays, 3, 4, 5));    // Row 2 winning combination
    nextMoves.push(possibleWinningMove(plays, 6, 7, 8));    // Row 3 winning combination
    nextMoves.push(possibleWinningMove(plays, 0, 3, 6));    // Col 2 winning combination
    nextMoves.push(possibleWinningMove(plays, 1, 4, 7));    // Col 2 winning combination
    nextMoves.push(possibleWinningMove(plays, 2, 5, 8));    // Col 3 winning combination
    nextMoves.push(possibleWinningMove(plays, 0, 4, 8));    // L-R Diagnal winning combination
    nextMoves.push(possibleWinningMove(plays, 2, 4, 6));    // R-L Diagnal winning combination
    
    // Loop nextMoves and add CSS class to denote hints onto game board
    for (var i = 0; i < nextMoves.length; i++) {
        if (nextMoves[i] != -1) {
            $('*[squareid="'+nextMoves[i]+'"').addClass(moveType);
        }
    }
}

/* Description:
 * hintForPlayer(), an action function,
 * For each player, this function analyzes the recorded plays to findNextMoves to block and to win.
 * 
 * Params:
 * None
 *
 * Returns:
 * None
 */
function hintForPlayer() {
    // Set alternate recorded plays by current Player
    var plays1 = eval(players[current_player] + 's');
    var plays2 = eval(players[1 - current_player] + 's');

    // Find winning and blocking moves
    findNextMoves(plays1, 'winning-move');
    findNextMoves(plays2, 'blocking-move');
}

/* Description:
 * displayMessage(), an action function,
 * This function displays pre-defined messages
 * 
 * Params:
 * messageid = an Integer (0..3)
 *
 * Returns:
 * None
 */
function displayMessage() {
    // Set message text by messageid
    switch (game_status) {
        case "Intro":
            message = "Shall we play a game?<br><br>" + 
                      "You are " + players[current_player] + " to move first.";
            game_status = "";
            break;
        case "Tie":
            message = "Tie game!";
            break;
        case "Winner":
            message = players[current_player] + " Wins!";
            console.log(moves);
            break;
        case "":
            message = players[current_player] + " to move.";
            break;
    }
    
    // Display message
    $("#message").html(message);
    if (responsiveVoice.voiceSupport()) {
      responsiveVoice.speak(message.replace(/(<([^>]+)>)/ig,""), "UK English Female", {pitch: -2});
    }
}

function gameNotOver () {
    return (game_status == "");
}

function playTheMove(squareid) {
    // Play the move only if square empty and game is not over
    if ( squareIsEmpty(squareid) && gameNotOver() ) {                        
        // Mark the square as current player value
        $('*[squareid="' + squareid +'"').text(players[current_player]);

        // Record game moves
        moves.push(players[current_player] + squareid);
        // console.log(moves);

        // Record Player's move
        eval(players[current_player] + 's[' + squareid + '] = 1');
        eval(players[1 - current_player] + 's[' + squareid + '] = -1');

        evaluateGameStatus();

        if ( gameNotOver() ) {
            switchPlayer();
        }

        displayMessage();

        hintForPlayer();

        if (current_player == computer) { alert ("Computer turn"); }
    }
}

function evaluateGameStatus() {
    if (isWinner(current_player)) {
        game_status = "Winner";
    } else if (gameIsOver()) {
        game_status = "Tie";
    }
}

function switchPlayer() {
    current_player = 1 - current_player;
}


// Define Tic-Tac-Toe behaviors
$(document).ready(function () {    
    // Display intro message
    displayMessage();
        
    // Define click event for the Squares
    // Click event is played by human
    $(".square").click(function () {
        // Get Square ID
        var squareid = $(this).attr('squareid');

        playTheMove(squareid);
    });
    
    // Define Clear Board event
    $("#clear-board").click(function () {
        // Clear all Xs & Os from game board
        $(".square").text("");
        
        // Remove current hints
        $(".winning-move").removeClass("winning-move");
        $(".blocking-move").removeClass("blocking-move");
        
        // Reset global variables
        current_player = 0;
        game_status = "Intro";
        Xs = new Array(9).fill(0);
        Os = new Array(9).fill(0);
        moves = [];
        
        // Display new game message
        displayMessage();
    });
});
