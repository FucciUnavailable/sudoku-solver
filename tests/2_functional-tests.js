const chaiHttp = require('chai-http');
const chai = require('chai');
const { assert, expect } = chai; // Use both if necessary
const server = require('../server');
const puzzlesAndSolutions = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  suite('POST /api/solve', function () {
    const validPuzzle = {
      puzzle: puzzlesAndSolutions[0][0],
    };
    const validSolution = puzzlesAndSolutions[0][1];

    test('Solve a puzzle with valid puzzle string', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send(validPuzzle)
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'solution', 'Response should have a solution');
          assert.equal(res.body.solution, validSolution, 'Solution should match the expected solution');
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 400, 'Response status should be 400');
          assert.property(res.body, 'error', 'Response should have an error property');
          assert.equal(res.body.error, 'Required field missing', 'Error message should match');
          done();
        });
    });

    test('Solve a puzzle with invalid characters', function (done) {
      const invalidPuzzle = { puzzle: '..9..5.1.85.4....2432......1...69.8A.9.....6.62.71...9......1945....4.37.4.3..6..' };
      chai
        .request(server)
        .post('/api/solve')
        .send(invalidPuzzle)
        .end((err, res) => {
          assert.equal(res.status, 400, 'Response status should be 400');
          assert.property(res.body, 'error', 'Response should have an error property');
          assert.equal(res.body.error, 'Invalid characters in puzzle', 'Error message should match');
          done();
        });
    });

    test('Solve a puzzle that cannot be solved', function (done) {
      const unsolvablePuzzle = {
        puzzle: '1.5..2.84..63.612.7.2..5.....9..1....8.2.3674.3...5.6..4...3..89...1...6..3.7.2..',
      };
      chai
        .request(server)
        .post('/api/solve')
        .send(unsolvablePuzzle)
        .end((err, res) => {
          assert.equal(res.status, 400, 'Response status should be 400');
          assert.property(res.body, 'error', 'Response should have an error property');
          assert.equal(res.body.error, 'Puzzle cannot be solved', 'Error message should match');
          done();
        });
    });

    test('Solve a puzzle with incorrect length', function (done) {
      const shortPuzzle = { puzzle: '1.5..2.84..63.12.7.2..5.....9..1...' }; // Too short
      chai
        .request(server)
        .post('/api/solve')
        .send(shortPuzzle)
        .end((err, res) => {
          assert.equal(res.status, 400, 'Response status should be 400');
          assert.property(res.body, 'error', 'Response should have an error property');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'Error message should match');
          done();
        });
    });
  });

  suite('POST /api/check', function () {
    const validPuzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';

    test('Check a puzzle placement with all fields', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A1', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.isObject(res.body, 'Response should be an object');
          assert.property(res.body, 'valid', 'Response should have a valid property');
          assert.isBoolean(res.body.valid, 'Valid property should be a boolean');
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A1', value: '2' })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.property(res.body, 'valid', 'Response should have a valid property');
          assert.isFalse(res.body.valid, 'Valid property should be false');
          assert.property(res.body, 'conflict', 'Response should have a conflict property');
          assert.isArray(res.body.conflict, 'Conflict should be an array');
          assert.lengthOf(res.body.conflict, 1, 'Conflict array should have one conflict');
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '5' })
        .end((err, res) => {
          assert.equal(res.status, 200, 'Response status should be 200');
          assert.property(res.body, 'valid', 'Response should have a valid property');
          assert.isFalse(res.body.valid, 'Valid property should be false');
          assert.property(res.body, 'conflict', 'Response should have a conflict property');
          assert.isArray(res.body.conflict, 'Conflict should be an array');
          assert.lengthOf(res.body.conflict, 3, 'Conflict array should have three conflicts');
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A1' }) // Missing "value"
        .end((err, res) => {
          assert.equal(res.status, 400, 'Response status should be 400');
          assert.property(res.body, 'error', 'Response should have an error property');
          assert.equal(res.body.error, 'Required field(s) missing', 'Error message should match');
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', function (done) {
      const invalidPuzzle = '1.5..2.84.7..8.2.3674.3...5.6..4...3..89...1...6..3.7.2..';
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: invalidPuzzle, coordinate: 'A1', value: '7' })
        .end((err, res) => {
          assert.equal(res.status, 400, 'Response status should be 400');
          assert.property(res.body, 'error', 'Response should have an error property');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'Error message should match');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement coordinate', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'Z9', value: '7' }) // Invalid coordinate
        .end((err, res) => {
          assert.equal(res.status, 400, 'Response status should be 400');
          assert.property(res.body, 'error', 'Response should have an error property');
          assert.equal(res.body.error, 'Invalid coordinate', 'Error message should match');
          done();
        });
    });

    test('Check a puzzle placement with invalid placement value', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A1', value: 'd' }) // Invalid value
        .end((err, res) => {
          assert.equal(res.status, 400, 'Response status should be 400');
          assert.property(res.body, 'error', 'Response should have an error property');
          assert.equal(res.body.error, 'Invalid value', 'Error message should match');
          done();
        });
    });
    test('Check a puzzle placement with invalid placement value', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({ puzzle: validPuzzle, coordinate: 'A1', value: 'd' }) // Invalid value
          .end((err, res) => {
            assert.equal(res.status, 400, 'Response status should be 400');
            assert.property(res.body, 'error', 'Response should have an error property');
            assert.equal(res.body.error, 'Invalid value', 'Error message should match');
            done();
          });
      });
      test('Check a puzzle placement with invalid placement value', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({ puzzle: validPuzzle, coordinate: 'A1', value: 'd' }) // Invalid value
          .end((err, res) => {
            assert.equal(res.status, 400, 'Response status should be 400');
            assert.property(res.body, 'error', 'Response should have an error property');
            assert.equal(res.body.error, 'Invalid value', 'Error message should match');
            done();
          });
      });
  });
  
});
