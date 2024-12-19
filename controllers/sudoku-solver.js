class SudokuSolver {
  constructor(props) {
    this.rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    this.cols = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
    this.tree = this.buildGraph();
  }
  buildGraph() {
    let graph = [];
    for (let row of this.rows) {
      for (let col of this.cols) {
        graph.push([row, col]);
      }
    }
    return graph;
  }
  validate(puzzleString) {
    return puzzleString.length === 81 && /^[1-9.]+$/.test(puzzleString);
  }
  checkRowPlacement(puzzleString, row, column, value) {
    let rowStart = this.rowValue[row];
    for (let i = rowStart; i < rowStart + 9; i++) {
      if (puzzleString[i] == value) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colStart = column - 1;
    for (let i = colStart; i < 81; i += 9) {
      if (puzzleString[i] == value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let colStart = Math.floor((column - 1) / 3) * 3;
    let rowStart = Math.floor(this.rowValue[row] / 27) * 27;
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 3; r++) {
        let scanIndex = colStart + rowStart + r + c * 9;
        if (puzzleString[scanIndex] == value) {
          return false;
        }
      }
    }
    return true;
  }
  isValidPlacement(puzzleString, row, column, value) {
    return (
      this.checkRowPlacement(puzzleString, row, column, value) &&
      this.checkColPlacement(puzzleString, row, column, value) &&
      this.checkRegionPlacement(puzzleString, row, column, value)
    );
  }
  solve(puzzleString) {
    let problem = puzzleString;
  
 
    for (let i = 0; i < problem.length; i++) {
      if (problem[i] == ".") {
        for (let testNumber = 1; testNumber <= 9; testNumber++) {
          if (
            this.isValidPlacement(
              problem,
              this.tree[i][0],
              this.tree[i][1],
              testNumber
            )
          ) {
            problem.splice(i, 1, testNumber);
            if(this.solve(problem))return problem
            problem[i] = "."
          }
        }
        return false
      }
    }
    return problem
  }
}

module.exports = SudokuSolver;
