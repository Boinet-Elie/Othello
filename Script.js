// Taille du plateau (8x8)
const size = 8;
// Plateau de jeu stocké dans une matrice 2D
let board = [];
// Joueur courant ("B" = noir, "W" = blanc)
let currentPlayer = "B";

// Initialise le plateau avec les 4 pièces centrales
function initBoard() {
  board = [];
  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i][j] = "."; // Case vide
    }
  }
  // Placement initial
  board[3][3] = "W";
  board[3][4] = "B";
  board[4][3] = "B";
  board[4][4] = "W";
}

// Affiche le plateau et les pions à l'écran
function drawBoard() {
  const table = document.getElementById("board");
  table.innerHTML = ""; // Nettoie le tableau

  for (let i = 0; i < size; i++) {
    const row = table.insertRow();
    for (let j = 0; j < size; j++) {
      const cell = row.insertCell();
      cell.onclick = () => handleClick(i, j); // Clic sur une case

      if (board[i][j] === "B" || board[i][j] === "W") {
        const piece = document.createElement("div");
        piece.className = "piece " + board[i][j];
        cell.appendChild(piece);
      }
    }
  }

  // Mise à jour du score
  const { black, white } = countPieces();
  document.getElementById("status").innerText =
    "Tour du joueur : " + (currentPlayer === "B" ? "Noir" : "Blanc");
  document.getElementById("score").innerText =
    `⚫ Noir : ${black} | ⚪ Blanc : ${white}`;
}

// Vérifie si une position est dans les limites
function inBounds(x, y) {
  return x >= 0 && x < size && y >= 0 && y < size;
}

// Liste des directions pour capturer
const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0], [1, 1]
];

// Vérifie si un coup est valide
function isValidMove(x, y, player) {
  if (board[x][y] !== ".") return false;

  let opponent = player === "B" ? "W" : "B";

  for (let [dx, dy] of directions) {
    let i = x + dx;
    let j = y + dy;
    let foundOpponent = false;

    while (inBounds(i, j) && board[i][j] === opponent) {
      i += dx;
      j += dy;
      foundOpponent = true;
    }

    if (foundOpponent && inBounds(i, j) && board[i][j] === player) {
      return true;
    }
  }
  return false;
}

// Joue un coup et retourne les pions
function makeMove(x, y, player) {
  board[x][y] = player;

  // Animation pour la pièce jouée
  setTimeout(() => {
    const cell = document.getElementById("board").rows[x].cells[y];
    const piece = cell.querySelector(".piece");
    if (piece) {
      piece.classList.add("flip");
      setTimeout(() => piece.classList.remove("flip"), 400);
    }
  }, 10);

  let opponent = player === "B" ? "W" : "B";

  // Vérifie dans toutes les directions
  for (let [dx, dy] of directions) {
    let i = x + dx;
    let j = y + dy;
    let path = [];

    while (inBounds(i, j) && board[i][j] === opponent) {
      path.push([i, j]);
      i += dx;
      j += dy;
    }

    if (inBounds(i, j) && board[i][j] === player) {
      for (let [px, py] of path) {
        board[px][py] = player;

        // Animation pour chaque pion retourné
        setTimeout(() => {
          const cell = document.getElementById("board").rows[px].cells[py];
          const piece = cell.querySelector(".piece");
          if (piece) {
            piece.classList.add("flip");
            setTimeout(() => piece.classList.remove("flip"), 400);
          }
        }, 10);
      }
    }
  }
}

// Vérifie si un joueur a au moins un coup
function hasValidMoves(player) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (isValidMove(i, j, player)) {
        return true;
      }
    }
  }
  return false;
}

// Compte les pions noirs et blancs
function countPieces() {
  let black = 0;
  let white = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === "B") black++;
      if (board[i][j] === "W") white++;
    }
  }
  return { black, white };
}

// Vérifie si la partie est terminée
function checkGameOver() {
  if (!hasValidMoves("B") && !hasValidMoves("W")) {
    let { black, white } = countPieces();
    let message = `Partie terminée.\nNoir : ${black} | Blanc : ${white}\n`;
    if (black > white) message += "🎉 Noir gagne !";
    else if (white > black) message += "🎉 Blanc gagne !";
    else message += "Match nul ! 🤝";
    alert(message);
  }
}

// Quand un joueur clique sur une case
function handleClick(x, y) {
  if (isValidMove(x, y, currentPlayer)) {
    makeMove(x, y, currentPlayer);
    currentPlayer = currentPlayer === "B" ? "W" : "B";

    if (!hasValidMoves(currentPlayer)) {
      currentPlayer = currentPlayer === "B" ? "W" : "B";
      if (!hasValidMoves(currentPlayer)) {
        checkGameOver();
        return;
      } else {
        alert("Aucun coup valide pour l'autre joueur. Tour sauté !");
      }
    }

    drawBoard();
  } else {
    alert("Coup invalide !");
  }
}

// Redémarre la partie
function restartGame() {
  currentPlayer = "B";
  initBoard();
  drawBoard();
}

// Initialise le jeu
initBoard();
drawBoard();