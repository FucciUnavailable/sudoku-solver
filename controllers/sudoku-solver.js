class SudokuSolver {
  constructor(props){
   
  }

  validate(puzzleString) {
  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    let graph =[]
    let  cols = ["A","B","C","D","E","F","G","H","I"]
    let rows = [1,2,3,4,5,6,7,8,9]
    for (let col of cols) {
      for (let row of rows) {
        graph.push([col, row]);
      }
    }
    console.log(graph);
  }
}

module.exports = SudokuSolver;

