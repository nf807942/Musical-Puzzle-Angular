import { Piece } from './piece';

describe('Piece', () => {
  it('should create an instance', () => {
    expect(new Piece(0, 0, true, 0)).toBeTruthy();
  });
});
