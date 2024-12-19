class SudokuSolver {
  constructor(props) {
    // Define the rows and columns of the Sudoku grid
    this.rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    this.cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Map rows to their starting index in the string representation of the puzzle
    this.rowValue = {
      A: 0,
      B: 9,
      C: 18,
      D: 27,
      E: 36,
      F: 45,
      G: 54,
      H: 63,
      I: 72,
    };

    // Generate a "tree" graph structure representing each cell in the grid
    this.tree = this.buildGraph();
  }

  // Build a graph that maps each cell to its row and column
  buildGraph() {
    let graph = [];
    for (let row of this.rows) {
      for (let col of this.cols) {
        graph.push([row, col]); // Add each cell as [row, column]
      }
    }
    return graph;
  }

  // Validate the input puzzle string
  validate(puzzleString) {
    // Ensure the string has exactly 81 characters and contains only numbers or dots
    return puzzleString.length === 81 && /^[1-9.]+$/.test(puzzleString);
  }

  // Check if placing a value in a row is valid
  checkRowPlacement(puzzleString, row, column, value) {
    let rowStart = this.rowValue[row]; // Get the starting index of the row
    for (let i = rowStart; i < rowStart + 9; i++) {
      if (puzzleString[i] == value) return false; // Return false if value already exists in the row
    }
    return true;
  }

  // Check if placing a value in a column is valid
  checkColPlacement(puzzleString, row, column, value) {
    let colStart = column - 1; // Convert column number to zero-based index
    for (let i = colStart; i < 81; i += 9) {
      if (puzzleString[i] == value) return false; // Return false if value already exists in the column
    }
    return true;
  }

  // Check if placing a value in a 3x3 region is valid
  checkRegionPlacement(puzzleString, row, column, value) {
       //     Divides the zero-based column index by 3 to determine which 3-column block the column belongs to.
    // Uses Math.floor to ensure the result is rounded down to the nearest whole number (e.g., column 1, 2, and 3 will map to 0, while column 4, 5, and 6 will map to 1, and so on).
    //Multiplies the result by 3 to get the starting column index of the 3x3 grid.
    // For example:
    // If column = 1, (1 - 1) / 3 = 0, and the start index is 0 * 3 = 0.
    // If column = 4, (4 - 1) / 3 = 1, and the start index is 1 * 3 = 3.


    //Uses Math.floor to round the result down to the nearest whole number. Assuming rows are grouped into blocks of 27 units (e.g., 3x9), this helps identify the block.
    // Multiplies the result by 27 to get the starting index of the block of rows.
    // For example:
    // If this.rowValue[row] = 0, 0 / 27 = 0, and the start index is 0 * 27 = 0.
    // If this.rowValue[row] = 28, 28 / 27 = 1, and the start index is 1 * 27 = 27.
  
    let colStart = Math.floor((column - 1) / 3) * 3; // Determine the starting column of the 3x3 region
    let rowStart = Math.floor(this.rowValue[row] / 27) * 27; // Determine the starting row of the 3x3 region

    // Iterate over the 3x3 region
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        let scanIndex = colStart + rowStart + r + c * 9; // Calculate the index of the current cell
        if (puzzleString[scanIndex] == value) {
          return false; // Return false if value already exists in the region
        }
      }
    }
    return true;
  }

  // Check if a placement is valid across row, column, and region
  isValidPlacement(puzzleString, row, column, value) {
    return (
      this.checkRowPlacement(puzzleString, row, column, value) &&
      this.checkColPlacement(puzzleString, row, column, value) &&
      this.checkRegionPlacement(puzzleString, row, column, value)
    );
  }

  // Solve the Sudoku puzzle using backtracking
  solve(puzzleString) {
    let problem = puzzleString; // Copy the puzzle string for manipulation

    // Iterate through each cell in the puzzle
    for (let i = 0; i < problem.length; i++) {
      if (problem[i] == ".") { // If the cell is empty (denoted by ".")
        // Try numbers 1 through 9
        for (let testNumber = 1; testNumber <= 9; testNumber++) {
          // Check if placing the number is valid
          if (
            this.isValidPlacement(
              problem,
              this.tree[i][0], // Row of the cell
              this.tree[i][1], // Column of the cell
              testNumber       // Number to place
            )
          ) {
            problem.splice(i, 1, testNumber); // Place the number in the cell

            // Recursively attempt to solve the puzzle
            if (this.solve(problem)) return problem;

            problem[i] = "."; // Backtrack by resetting the cell to "."
          }
        }
        return false; // If no valid number can be placed, return false to backtrack
      }
    }

    // If the loop completes without issues, the puzzle is solved
    return problem;
  }
}

// Export the SudokuSolver class for use in other files
module.exports = SudokuSolver;
