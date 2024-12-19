'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  // Helper to parse the puzzle string
  const parsePuzzle = puzzleString => 
    puzzleString.split('').map(char => (char === '.' ? '.' : parseInt(char)));

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.status(400).send({ error: 'Required field(s) missing' });
      }
      if (puzzle.length !== 81){
        return res.status(400).send({ error: 'Expected puzzle to be 81 characters long' });
      }
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.status(400).send({ error: 'Invalid coordinate'});
      }

      if (!/^[1-9]$/.test(value)) {
        return res.status(400).send({ error: 'Invalid value' });
      }
      if (!/^[1-9.]+$/.test(puzzle)) {
        return res.status(400).send({ error: 'Invalid characters in puzzle' });
      }

      const [row, column] = [coordinate[0], parseInt(coordinate[1])];
      const parsedPuzzle = parsePuzzle(puzzle);

      const rowValid = solver.checkRowPlacement(parsedPuzzle, row, column, value);
      const colValid = solver.checkColPlacement(parsedPuzzle, row, column, value);
      const regionValid = solver.checkRegionPlacement(parsedPuzzle, row, column, value);

      if (rowValid && colValid && regionValid) {
        return res.send({ valid: true });
      }

      return res.send({
        valid: false,
        conflict: [
          ...(rowValid ? [] : ['row']),
          ...(colValid ? [] : ['column']),
          ...(regionValid ? [] : ['region']),
        ],
      });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.status(400).send({ error: 'Required field missing' });
      }
      if (puzzle.length !== 81){
        return res.status(400).send({ error: 'Expected puzzle to be 81 characters long' });
      }
      if (puzzle.length !== 81 || /[^1-9\.]/.test(puzzle)) {
        return res.status(400).send({ error: 'Invalid characters in puzzle' });
      }

      const parsedPuzzle = parsePuzzle(puzzle);
      const solution = solver.solve(parsedPuzzle);
   
      if (!solution) {
        return res.status(400).send({ error: 'Puzzle cannot be solved' });
      }

      res.send({ "solution":solution.join('') });
    });
};
