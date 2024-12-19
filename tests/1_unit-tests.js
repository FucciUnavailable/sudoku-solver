const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test('should handle a valid puzzle string of 81 characters', function () {
        const validPuzzle = "53..7....6..195....98....6.8...6...34..8..6...1...8...6....28....419..5....8..79";
        const isValid = solver.validatePuzzle(validPuzzle);
        assert.ok(isValid, "Puzzle should be valid");
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
        const invalidPuzzle = '1234@6789' + '.'.repeat(72);
        const isValid = solver.validatePuzzle(invalidPuzzle);
        const error = { error: 'Invalid characters in puzzle' }
        assert.deepEqual(isValid,error, "Puzzle should be invalid due to the presence of invalid characters");
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function () {
        const invalidPuzzle = "53a.7b.c.6..195......6...34..8..6...1...8...6....28....419..5....8..79"; // 80 characters
        const error = { error: 'Expected puzzle to be 81 characters long' };
        const result = solver.validatePuzzle(invalidPuzzle);
        assert.deepEqual(result, error, "Puzzle should return the correct error message for length");
    });
    test('Logic handles a valid row placement', function(){
        const row = "A"
        const col = 2
        const val = 6
        const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        let test = solver.checkRowPlacement(puzzle, row, col, val)
        assert.deepEqual(test, true, "puzzle should return valid for valid row")
    })
    test('Logic handles an invalid row placement', function(){
        const row = "A"
        const col = 2
        const val = 5
        const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        let test = solver.checkRowPlacement(puzzle, row, col, val)
        assert.deepEqual(test, false, "puzzle should return false for invalid row")
    })
    test('Logic handles a valid column placement', function(){
        const row = "A"
        const col = 2
        const val = 6
        const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        let test = solver.checkColPlacement(puzzle, row, col, val)
        assert.deepEqual(test, true, "puzzle should return true for invalid col")
    })
    test('Logic handles an invalid column placement', function(){
        const row = "A"
        const col = 2
        const val = 5
        const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        let test = solver.checkColPlacement(puzzle, row, col, val)
        assert.deepEqual(test, false, "puzzle should return true for invalid col")
    })
    test('Logic handles a valid grid placement', function(){
        const row = "A"
        const col = 2
        const val = 6
        const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        let test = solver.checkRegionPlacement(puzzle, row, col, val)
        assert.deepEqual(test, true, "puzzle should return true for invalid grid")
    })
    test('Logic handles an invalid grid placement', function(){
        const row = "A"
        const col = 2
        const val = 5
        const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        let test = solver.checkRegionPlacement(puzzle, row, col, val)
        assert.deepEqual(test, false, "puzzle should return true for invalid grid")
    })
    test('Valid puzzle strings pass the solver', function(){

        const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        const response = '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
        let test = solver.solve(puzzle.split(''))
        assert.deepEqual(test.join(''), response, "Valid puzzle strings pass the solver")
    })
    test('Invalid puzzle strings fail the solver', function(){
 
        const puzzle = '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.'

        let test = solver.solve(puzzle.split(''))
        assert.deepEqual(test, false, "Invalid puzzle strings fail the solver")
    })
    test('Solver returns the expected solution for an incomplete puzzle', function(){

        const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
        const response = '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
        let test = solver.solve(puzzle.split(''))
        assert.deepEqual(test.join(''), response, "Valid puzzle strings pass the solver")
    })
});

