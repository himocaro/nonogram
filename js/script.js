let hints = {
  rowHints: [[2, 2], [], [1, 2], [3], [3]],
  colHints: [[1, 2], [1, 2], [2], [1, 1, 1], [1, 1]],
};

let solution = [
  [1, 1, 0, 1, 1],
  [0, 0, 0, 0, 0],
  [1, 0, 0, 1, 1],
  [1, 1, 1, 0, 0],
  [0, 1, 1, 1, 0],
];


function createNonogram() {
  let table = document.getElementById("nonogram-table");

  let maxRowHints = Math.max(...hints.rowHints.map((hint) => hint.length));
  let maxColHints = Math.max(...hints.colHints.map((hint) => hint.length));

  for (let i = 0; i < maxColHints + 5; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < maxRowHints + 5; j++) {
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

createNonogram();
