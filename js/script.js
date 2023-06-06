function countDaysFromDate(targetDate) {
  const currentDate = new Date();
  const targetDateObj = new Date(targetDate);

  // Calculate the time difference in milliseconds
  const timeDiff = currentDate - targetDateObj;

  // Calculate the number of days
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  return daysDiff;
}

const START_DATE = '2023-05-24';
const daysCount = countDaysFromDate(START_DATE);


let hints = DAILY_HINTS[daysCount];
let solution = DAILY_SOLUTIONS[daysCount];

const NUM_OF_ROWS = solution.length;
const NUM_OF_COLS = solution[0].length;
const MAX_ROW_HINTS = Math.max(...hints.rowHints.map((hint) => hint.length));
const MAX_COL_HINTS = Math.max(...hints.colHints.map((hint) => hint.length));
// Initialize table state array with all cells empty.
const TABLE_STATE = Array.from({ length: NUM_OF_ROWS }, () =>
  Array.from({ length: NUM_OF_COLS }, () => 0)
);

const TABLE = document.getElementById("nonogram-table");


function createNonogram() {
  for (let i = 0; i < MAX_COL_HINTS + NUM_OF_ROWS; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < MAX_ROW_HINTS + NUM_OF_COLS; j++) {
      let cell = document.createElement("td");
      if (i < MAX_COL_HINTS && j >= MAX_ROW_HINTS) {
        // Column hints
        let hint = [...hints.colHints[j - MAX_ROW_HINTS]].reverse();
        if (hint && hint[MAX_COL_HINTS - i - 1] !== undefined) {
          cell.textContent = hint[MAX_COL_HINTS - i - 1];
          // cell.textContent = hint[i - 1];
          cell.classList.add("hint");
        }
      } else if (j < MAX_ROW_HINTS && i >= MAX_COL_HINTS) {
        // Row hints
        let hint = [...hints.rowHints[i - MAX_COL_HINTS]].reverse();
        if (hint && hint[MAX_ROW_HINTS - j - 1] !== undefined) {
          cell.textContent = hint[MAX_ROW_HINTS - j - 1];
          cell.classList.add("hint");
        }
      } else if (i >= MAX_COL_HINTS && j >= MAX_ROW_HINTS) {
        // Cells
        cell.classList.add("cell");
      }
      row.appendChild(cell);
    }
    TABLE.appendChild(row);
  }

  for (let i = 0; i < MAX_COL_HINTS + 5; i++) {
    let row = i - MAX_COL_HINTS;
    validateRow(row, MAX_ROW_HINTS);
    for (let j = 0; j < MAX_ROW_HINTS + 5; j++) {
      let col = j - MAX_ROW_HINTS;
      validateColumn(col, MAX_COL_HINTS);
    }
  }
}

function getHintFromRow(row) {
  if (!row) return [];
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
  const currentRow = TABLE_STATE[rowIndex];
  const hint = getHintFromRow(currentRow);
  if (arraysEqual(hint, hints.rowHints[rowIndex])) {
    const rowCells = Array.from(
      document.querySelectorAll(
        `#nonogram-table tr:nth-child(${rowIndex + offset + 1}) .cell`
      )
    );
    rowCells.forEach((cell) => {
      if (!cell.classList.contains("filled")) {
        cell.classList.add("empty-correct");
        cell.classList.add("filled");
      }
    });
  }
}

function validateColumn(colIndex, offset) {
  const currentCol = [];

  for (let r = 0; r < NUM_OF_ROWS; ++r) {
    currentCol.push(TABLE_STATE[r][colIndex]);
  }
  const hint = getHintFromRow(currentCol);
  if (arraysEqual(hint, hints.colHints[colIndex])) {
    const colCells = Array.from(
      document.querySelectorAll(
        `#nonogram-table tr .cell:nth-child(${colIndex + offset + 1})`
      )
    );
    colCells.forEach((cell) => {
      if (!cell.classList.contains("filled")) {
        cell.classList.add("empty-correct");
        cell.classList.add("filled");
      }
    });
  }
}

// Function to handle cell click
function handleNonogramCellSelection(cell) {
  if (cell.classList.contains("filled") || cell.classList.contains("hint")) {
    return;
  }
  const CELLS = Array.from(TABLE.querySelectorAll(".cell"));
  const row = Math.floor(CELLS.indexOf(cell) / NUM_OF_COLS);
  const col = CELLS.indexOf(cell) % NUM_OF_COLS;
  cell.classList.add("filled");
  if (solution[row][col] === 1) {
    cell.classList.add("correct");
    TABLE_STATE[row][col] = 1;

    validateRow(row, MAX_ROW_HINTS);
    validateColumn(col, MAX_COL_HINTS);
  } else {
    cell.classList.add("incorrect");
  }
}

function attachNonogramCellSelectionEventHandlers() {
  let isDragging = false; // Flag to track if dragging is in progress

  function handleStart(event) {
    isDragging = true;
    handleNonogramCellSelection(event.target);
  }

  function handleMove(event) {
    if (isDragging) {
      event.preventDefault(); // Prevent scrolling while dragging
      handleNonogramCellSelection(event.target);
    }
  }

  function handleEnd(event) {
    isDragging = false;
  }

  // Event listener for mouse/finger down event
  TABLE.addEventListener("mousedown", handleStart);
  TABLE.addEventListener("touchstart", handleStart);

  // Event listener for mouse/finger move event
  TABLE.addEventListener("mousemove", handleMove);
  TABLE.addEventListener("touchmove", handleMove);

  // Event listener for mouse/finger up event
  window.addEventListener("mouseup", handleEnd);
  window.addEventListener("touchend", handleEnd);
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
    return "\u{2B1C}";  // ⬜
  }
}


function getNonogramAsEmoji() {
  let res = "";
  // Get all the rows in the table
  var rows = TABLE.getElementsByTagName("tr");

  // Loop over each row
  for (var i = 0; i < rows.length; i++) {
    // Get all the cells in the current row
    var cells = rows[i].getElementsByTagName("td");

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
      .writeText(sharedText);
  });
}

function enableHowToModal() {
  var modal = document.getElementById("how-to-modal");
  var openButton = document.getElementById("open-how-to-modal");
  var closeButton = document.getElementById("close-how-to-modal");
  openButton.onclick = function() {
    modal.style.display = "block";
  }
  
  closeButton.onclick = function() {
    modal.style.display = "none";
  }
  
  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

function enableShareModal() {
  var modal = document.getElementById("share-modal");
  var openButton = document.getElementById("open-share-modal");
  var closeButton = document.getElementById("close-share-modal");
  var nonogramPreview = document.getElementById("nonogram-preview");
  openButton.onclick = function() {
    modal.style.display = "block";
    nonogramPreview.textContent = getNonogramAsEmoji();
  }
  
  closeButton.onclick = function() {
    modal.style.display = "none";
  }
  
  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

createNonogram();
attachNonogramCellSelectionEventHandlers();
enableShareButton();
enableHowToModal();
enableShareModal();
