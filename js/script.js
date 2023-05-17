// 5 x 5
// let hints = {
//   rowHints: [[2, 2], [], [1, 2], [3], [3]],
//   colHints: [[1, 2], [1, 2], [2], [1, 1, 1], [1, 1]],
// };

// 10 x 10
// let hints = {
//   rowHints: [
//     [1, 3, 2],
//     [1, 2],
//     [1, 2],
//     [5],
//     [3],
//     [3, 4],
//     [1, 1, 3, 1],
//     [2, 1],
//     [1, 1, 2, 2],
//     [1, 3, 1],
//   ],
//   colHints: [
//     [2, 1, 2],
//     [1, 1],
//     [1, 3, 1],
//     [2, 3, 1, 1],
//     [1, 2, 3],
//     [1, 2, 2, 2],
//     [2, 2],
//     [1, 1, 2],
//     [1, 1, 2],
//     [1, 2],
//   ],
// };

let hints = {
  rowHints: [
    [1, 2, 1],
    [2, 2, 1],
    [1, 2, 1],
    [2, 2, 1],
    [2, 2, 1],
    [1, 3],
    [2, 2],
    [5, 2],
  ],
  colHints: [
    [5, 1],
    [1, 2, 2],
    [2],
    [1, 2, 1, 1],
    [5, 2],
    [1, 3],
    [1, 1, 1, 1],
    [2, 2, 1],
  ],
};

// 5 x 5
// let solution = [
//   [1, 1, 0, 1, 1],
//   [0, 0, 0, 0, 0],
//   [1, 0, 0, 1, 1],
//   [1, 1, 1, 0, 0],
//   [0, 1, 1, 1, 0],
// ];

// 10 x 10
// let solution = [
//   [1, 0, 0, 1, 1, 1, 0, 1, 1, 0],
//   [1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
//   [0, 1, 0, 0, 0, 1, 1, 0, 0, 0],
//   [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
//   [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
//   [0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
//   [1, 0, 1, 0, 0, 1, 1, 1, 0, 1],
//   [0, 0, 0, 1, 1, 0, 0, 0, 1, 0],
//   [1, 0, 1, 0, 1, 1, 0, 0, 1, 1],
//   [1, 0, 0, 1, 1, 1, 0, 0, 0, 1]
// ];

// 8 x 8
let solution = [
  [1, 0, 0, 1, 1, 0, 1, 0],
  [1, 1, 0, 0, 1, 1, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 1, 0, 1, 1, 0, 1, 0],
  [1, 1, 0, 0, 1, 1, 0, 1],
  [0, 0, 0, 1, 0, 1, 1, 1],
  [0, 1, 1, 0, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 0, 1, 1],
];

function createNonogram() {
  let table = document.getElementById("nonogram-table");

  const numOfRows = solution.length;
  const numOfCols = solution[0].length;
  let maxRowHints = Math.max(...hints.rowHints.map((hint) => hint.length));
  let maxColHints = Math.max(...hints.colHints.map((hint) => hint.length));

  for (let i = 0; i < maxColHints + numOfRows; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < maxRowHints + numOfCols; j++) {
      let cell = document.createElement("td");
      if (i < maxColHints && j >= maxRowHints) {
        // Column hints
        let hint = [...hints.colHints[j - maxRowHints]].reverse();
        if (hint && hint[maxColHints - i - 1] !== undefined) {
          cell.textContent = hint[maxColHints - i - 1];
          // cell.textContent = hint[i - 1];
          cell.classList.add("hint");
        }
      } else if (j < maxRowHints && i >= maxColHints) {
        // Row hints
        let hint = [...hints.rowHints[i - maxColHints]].reverse();
        if (hint && hint[maxRowHints - j - 1] !== undefined) {
          cell.textContent = hint[maxRowHints - j - 1];
          cell.classList.add("hint");
        }
      } else if (i >= maxColHints && j >= maxRowHints) {
        // Cells
        cell.classList.add("cell");
        let row = i - maxColHints;
        let col = j - maxRowHints;
        cell.addEventListener("click", function () {
          console.log(this.classList.contains("filled"));
          if (this.classList.contains("filled")) {
            return;
          }
          this.classList.add("filled");
          if (solution[row][col] === 1 && this.classList.contains("filled")) {
            this.classList.add("correct");
            this.classList.remove("incorrect");
          } else if (
            solution[row][col] === 0 &&
            this.classList.contains("filled")
          ) {
            this.classList.add("incorrect");
            this.classList.remove("correct");
          } else {
            this.classList.remove("correct", "incorrect");
          }
          validateRow(row, maxRowHints);
          validateColumn(col, maxColHints);
        });
      }
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  for (let i = 0; i < maxColHints + 5; i++) {
    let row = i - maxColHints;
    validateRow(row, maxRowHints);
    for (let j = 0; j < maxRowHints + 5; j++) {
      let col = j - maxRowHints;
      validateColumn(col, maxColHints);
    }
  }
}

function getHintFromRow(row) {
  let hint = [];
  let count = 0;
  for (let i = 0; i < row.length; i++) {
    if (row[i] === 1) {
      count++;
    } else if (count > 0) {
      hint.push(count);
      count = 0;
    }
  }
  if (count > 0) {
    hint.push(count);
  }
  return hint;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function validateRow(rowIndex, offset) {
  let rowCells = Array.from(
    document.querySelectorAll(
      `#nonogram-table tr:nth-child(${rowIndex + offset + 2}) .cell`
    )
  );
  let currentRow = rowCells.map((cell) =>
    cell.classList.contains("correct") ? 1 : 0
  );
  let hint = getHintFromRow(currentRow);
  if (arraysEqual(hint, hints.rowHints[rowIndex])) {
    rowCells.forEach((cell) => {
      if (!cell.classList.contains("filled")) {
        cell.classList.add("empty-correct");
        cell.classList.add("filled");
      }
    });
  }
}

function validateColumn(colIndex, offset) {
  let colCells = Array.from(
    document.querySelectorAll(
      `#nonogram-table tr .cell:nth-child(${colIndex + offset})`
    )
  );
  let currentCol = colCells.map((cell) =>
    cell.classList.contains("correct") ? 1 : 0
  );
  let hint = getHintFromRow(currentCol);
  if (arraysEqual(hint, hints.colHints[colIndex])) {
    colCells.forEach((cell) => {
      if (!cell.classList.contains("filled")) {
        cell.classList.add("empty-correct");
        cell.classList.add("filled");
      }
    });
  }
}

function getCellEmoji(cell) {
  if (cell.classList.contains("correct")) {
    return "\u{1F7E9}";  // 🟩
  } else if (cell.classList.contains("incorrect")) {
    return "\u{1F7E5}";  // 🟥
  } else if (cell.classList.contains("empty-correct")) {
    return "\u{1F7E8}";  // 🟨
  } else if (cell.classList.contains("hint")) {
    if (cell.innerText === "1") {
      return "\u{0031}\u{FE0F}\u{20E3}";  // 1️⃣
    } else if (cell.innerText === "2") {
      return "\u{0032}\u{FE0F}\u{20E3}";  // 2️⃣
    } else if (cell.innerText === "3") {
      return "\u{0033}\u{FE0F}\u{20E3}";  // 3️⃣
    } else if (cell.innerText === "4") {
      return "\u{0034}\u{FE0F}\u{20E3}";  // 4️⃣
    } else if (cell.innerText === "5") {
      return "\u{0035}\u{FE0F}\u{20E3}";  // 5️⃣
    } else if (cell.innerText === "6") {
      return "\u{0036}\u{FE0F}\u{20E3}";  // 6️⃣
    } else if (cell.innerText === "7") {
      return "\u{0037}\u{FE0F}\u{20E3}";  // 7️⃣
    } else if (cell.innerText === "8") {
      return "\u{0038}\u{FE0F}\u{20E3}";  // 8️⃣
    } else if (cell.innerText === "9") {
      return "\u{0039}\u{FE0F}\u{20E3}";  // 9️⃣
    }
  } else {
    return "\u{2B1C}\u{FE0F}";  // ⬜️
  }
}


function getNonogramAsEmoji() {
  let res = "";
  // Get the nonogram table
  var table = document.getElementById("nonogram-table");

  // Get all the rows in the table
  var rows = table.getElementsByTagName("tr");

  // Loop over each row
  for (var i = 0; i < rows.length; i++) {
    // Get all the cells in the current row
    var cells = rows[i].getElementsByTagName("td");
    const resRow = [];

    // Loop over each cell
    for (var j = 0; j < cells.length; j++) {
      // Now you have access to each cell
      var cell = cells[j];

      // Add emoji to string
      res += getCellEmoji(cell);
    }
    res += "\n";
  }
  return res;
}

function enableShareButton() {
  const shareButton = document.getElementById("share-button");
  shareButton.addEventListener("click", function () {
    let sharedText = "@nonogrammers 8762\n\n";
    sharedText += getNonogramAsEmoji();
    navigator.clipboard
      .writeText(sharedText)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  });
}

createNonogram();
enableShareButton();
