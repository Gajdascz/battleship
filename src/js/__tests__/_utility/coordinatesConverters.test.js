import { describe, it, expect } from 'vitest';
import {
  convertToDisplayFormat,
  convertToInternalFormat
} from '../../utility/coordinatesConverters';

describe('convertToDisplayFormat', () => {
  it('Should format row and column to letter-number by default', () => {
    expect(convertToDisplayFormat(0, 1)).toBe('A1');
  });

  it('Should format row and column to number-letter when isLetterRow is false', () => {
    expect(convertToDisplayFormat(0, 1, false)).toBe('0B');
  });

  it('Should handle zero values correctly', () => {
    expect(convertToDisplayFormat(0, 0)).toBe('A0');
  });

  it('Should handle zero values correctly with isLetterRow false', () => {
    expect(convertToDisplayFormat(0, 0, false)).toBe('0A');
  });
});

describe('convertToInternalFormat', () => {
  it('Should convert letter-number coordinate to internal format', () => {
    expect(convertToInternalFormat('A1')).toEqual([0, 1]);
  });

  it('Should throw an error for invalid coordinate format', () => {
    expect(() => convertToInternalFormat('Invalid')).toThrowError();
  });
  it('Should correctly interpret lowercase letters', () => {
    expect(convertToInternalFormat('a1')).toEqual([0, 1]);
  });

  it('Should handle edge coordinates correctly', () => {
    expect(convertToInternalFormat('Z99')).toEqual([25, 99]);
  });

  it('Should correctly interpret coordinates with multi-digit numbers', () => {
    expect(convertToInternalFormat('A10')).toEqual([0, 10]);
  });

  it('Should throw an error for coordinates with no letters', () => {
    expect(() => convertToInternalFormat('123')).toThrowError();
  });

  it('Should throw an error for coordinates with no numbers', () => {
    expect(() => convertToInternalFormat('ABC')).toThrowError();
  });
});
