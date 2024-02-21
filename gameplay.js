// var candies = ["Blue", "Green", "Yellow", "Red", "Purple"];
// var board = [];
// var rows = 8;
// var columns = 8;


// window.onload = function() {
//     startGame();

//     //1/10th of a second
//     window.setInterval(function(){
//         // crushCandy();
//         slideCandy();
//         generateCandy();
//     }, 100);
// }


// function startGame() {
//     for (let r = 0; r < rows; r++) {
//         let row = [];
//         for (let c = 0; c < columns; c++) {
//             // <img id="0-0" src="./images/Red.png">
//             let tile = document.createElement("img");
//             tile.id = r.toString() + "-" + c.toString();
//             // tile.src = "./img/" + randomCandy() + ".png";
//             tile.src = "./img/blank.png";

//             document.getElementById("board").append(tile);
//             row.push(tile);
//         }
//         board.push(row);
//     }

//     console.log(board);
// }


// function randomCandy() {
//     return candies[Math.floor(Math.random() * candies.length)]; //0 - 4.99
// }

// function generateCandy() {
//     for (let c = 0; c < columns;  c++) {
//         if (board[0][c].src.includes("blank")) {
//             board[0][c].src = "./img/" + randomCandy() + ".png";
//         }
//     }
// }

// function slideCandy() {
//     for (let c = 0; c < columns; c++) {
//         let ind = rows - 1;
//         for (let r = columns-1; r >= 0; r--) {
//             if (!board[r][c].src.includes("blank")) {
//                 board[ind][c].src = board[r][c].src;
//                 ind -= 1;
//             }
//         }

//         for (let r = ind; r >= 0; r--) {
//             board[r][c].src = "./img/blank.png";
//         }
//     }
// }


var candies = {
    1: "Blue",
    2: "Green",
    3: "Yellow",
    4: "Red",
    5: "Purple"
};
var board = [];
const rows = 8;
const columns = 8;
var totalScore = 0;

window.onload = function() {
    startGame();
    // generateCandy();

    window.setInterval(function(){
        
        slideCandy();
        // generateCandy();
        // document.getElementById("score").innerText = totalScore;
    }, 100);
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = $("<img>");
            let newCandy = randomCandy();
            tile.attr("id", r.toString() + "-" + c.toString());
            tile.attr("src", getCandyImage(newCandy)); // 0 represents a blank tile
            tile.on('click', function() {
                handleTileClick(r, c);
            });
            $("#board").append(tile);
            row.push( newCandy ); // Initially, all tiles are blank
        }
        board.push(row);
    }
    console.log(board);
}

function getSameTypeAdjacent(r, c, visited = {}) {
    let key = `${r}-${c}`;
    if (visited[key]) {
        return [];
    }

    visited[key] = true;
    let candy = board[r][c];
    let sameTypeAdjacent = [{row: r, column: c}];

    // Check the candy above
    if (r > 0 && board[r - 1][c] === candy) {
        sameTypeAdjacent = sameTypeAdjacent.concat(getSameTypeAdjacent(r - 1, c, visited));
    }
    // Check the candy below
    if (r < rows - 1 && board[r + 1][c] === candy) {
        sameTypeAdjacent = sameTypeAdjacent.concat(getSameTypeAdjacent(r + 1, c, visited));
    }
    // Check the candy to the left
    if (c > 0 && board[r][c - 1] === candy) {
        sameTypeAdjacent = sameTypeAdjacent.concat(getSameTypeAdjacent(r, c - 1, visited));
    }
    // Check the candy to the right
    if (c < columns - 1 && board[r][c + 1] === candy) {
        sameTypeAdjacent = sameTypeAdjacent.concat(getSameTypeAdjacent(r, c + 1, visited));
    }

    return sameTypeAdjacent;
}


// function removeCandies(candies) {
//     candies.forEach(function(candy) {
//         board[candy.row][candy.column] = 0;
//     });
// }

function removeCandies(candies) {
    candies.forEach(candy => {
        let id = `#${candy.row}-${candy.column}`;
        $(id).addClass('remove-animation');

        // Listen for the end of the animation and then remove the candies
        $(id).on('animationend', function() {
            let [row, column] = this.id.split('-');
            board[row][column] = 0;
            $(this).removeClass('remove-animation');
            // updateUI();
        });
    });
}


function handleTileClick(r, c) {
    let candy = board[r][c];
    console.log("Clicked on tile at (" + r + ", " + c + ") with candy: " + candy);

    let sameTypeAdjacent = getSameTypeAdjacent(r, c);
    if (sameTypeAdjacent.length > 1) {
        
        console.log("This candy has adjacent candies of the same type at the following positions:");
        sameTypeAdjacent.forEach(function(position) {
            console.log("(" + position.row + ", " + position.column + ")");
        });

        // Calculate the score before removing the candies
        let score = Math.pow(sameTypeAdjacent.length - 2, 2);
        console.log("Score for this move: " + score);

        // Update the total score
        totalScore += score;
        $('#score').text(totalScore);
        console.log("Total score till this move: " + totalScore);

        console.log("Removing matched candies...");
        removeCandies(sameTypeAdjacent);
    } else {
        console.log("This candy does not have adjacent candies of the same type.");
    }
}

function randomCandy() {
    let keys = Object.keys(candies);
    return keys[Math.floor(Math.random() * keys.length)];
}

function getCandyImage(candy) {
    if (candy === 0) {
        return "./img/blank.png";
    } else {
        return "./img/" + candies[candy] + ".png";
    }
}

function generateCandy() {
    for (let c = 0; c < columns;  c++) {
        if (board[0][c] === 0) {
            let newCandy = randomCandy();
            board[0][c] = newCandy;
            document.getElementById("0-" + c).src = getCandyImage(newCandy);
        }
    }
}

// function slideCandy() {
//     for (let c = 0; c < columns; c++) {
//         let ind = rows - 1;
//         for (let r = rows -1; r >= 0; r--) {
//             if (board[r][c] !== 0) {
//                 board[ind][c] = board[r][c];
//                 document.getElementById(ind + "-" + c).src = getCandyImage(board[r][c]);
//                 ind -= 1;
//             }
//         }

//         for (let r = ind; r >= 0; r--) {
//             board[r][c] = 0;
//             document.getElementById(r + "-" + c).src = getCandyImage(0);
//         }
//     }
// }

function slideCandy() {
    let emptyColumns = [];

    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        let isEmptyColumn = true;

        for (let r = rows -1; r >= 0; r--) {
            if (board[r][c] !== 0) {
                board[ind][c] = board[r][c];
                document.getElementById(ind + "-" + c).src = getCandyImage(board[r][c]);
                ind -= 1;
                isEmptyColumn = false;
            }
        }

        if (isEmptyColumn) {
            emptyColumns.push(c);
        } else {
            for (let r = ind; r >= 0; r--) {
                board[r][c] = 0;
                document.getElementById(r + "-" + c).src = getCandyImage(0);
            }
        }
    }

    // Shift columns to the left if there are any empty columns
    emptyColumns.forEach((emptyColumn, index) => {
        for (let c = emptyColumn - index; c < columns - 1; c++) {
            for (let r = 0; r < rows; r++) {
                board[r][c] = board[r][c + 1];
                document.getElementById(r + "-" + c).src = getCandyImage(board[r][c]);
            }
        }

        // Set the last column to be empty
        for (let r = 0; r < rows; r++) {
            board[r][columns - 1] = 0;
            document.getElementById(r + "-" + (columns - 1)).src = getCandyImage(0);
        }
    });
}