/* global describe, beforeEach, afterEach, it */
var chai = require('chai');
var D = require('../dist/index');
var d;

var testData = {
  home: './base',
  assets: './base/dir/assets'
};

describe('d module:', function() {
  beforeEach(function() {
    d = D(testData);
  });

  afterEach(function() {
    d = null;
  });

  it('should have the right data set', function() {
    chai.expect(d).to.have.property('home', './base');
    chai.expect(d).to.have.property('assets', './base/dir/assets');
  });

  it('should correctly extend data', function() {
    d.$extend({ fargo: 'ND', home: '-ward bound' });

    chai.expect(d).to.have.property('fargo', 'ND');
    chai.expect(d).to.have.property('home', '-ward bound');
  });

  it('should correctly delete data', function() {
    d.$delete('home');

    chai.expect(d).to.not.have.property('home');
  });

  it('should work with single brackets', function () {
    d.$extend({ '?': 'Hankering' });

    chai.expect(d('{{?}}/{?}')).to.equal('Hankering/{?}');
  });

  it('should work with triple brackets', function () {
    d.$extend({ 'key': 'value' });

    chai.expect(d('{{{key}}}')).to.equal('{value}');
  });

  it('should interpolate nested object properties', function() {
    d.$extend({ 'a': { 'b': 'c' }});

    chai.expect(d('a/b/{{a.b}}/d')).to.equal('a/b/c/d');
  });
});

