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
});
