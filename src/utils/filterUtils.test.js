
import { describe, it, expect } from 'vitest';
import { normalizeString, parseYear, getEra, matchesEra, matchesArtist, matchesSearchQuery } from './filterUtils';

describe('filterUtils', () => {
    describe('normalizeString', () => {
        it('should handle basic strings', () => {
            expect(normalizeString('Hello')).toBe('hello');
        });
        it('should remove accents', () => {
            expect(normalizeString('Crème Brûlée')).toBe('creme brulee');
        });
        it('should collapse whitespace', () => {
            expect(normalizeString('  Van   Gogh  ')).toBe('van gogh');
        });
        it('should handle null/undefined', () => {
            expect(normalizeString(null)).toBe('');
            expect(normalizeString(undefined)).toBe('');
        });
    });

    describe('parseYear', () => {
        it('should extract 4-digit years', () => {
            expect(parseYear("1889")).toBe(1889);
            expect(parseYear("c. 1890")).toBe(1890);
            expect(parseYear("1888-1890")).toBe(1888);
        });
        it('should extract century', () => {
            expect(parseYear("19th century")).toBe(1800);
            expect(parseYear("20th Century")).toBe(1900);
        });
        it('should return null for invalid inputs', () => {
            expect(parseYear("Unknown")).toBe(null);
            expect(parseYear("abcd")).toBe(null);
        });
    });

    describe('getEra', () => {
        it('should categorize correctly', () => {
            expect(getEra(400)).toBe('Ancient');
            expect(getEra(1200)).toBe('Medieval');
            expect(getEra(1500)).toBe('Renaissance');
            expect(getEra(1700)).toBe('Modern');
            expect(getEra(1850)).toBe('Modern');
            expect(getEra(1950)).toBe('Contemporary');
        });
    });

    describe('matchesArtist', () => {
        it('should match exact artists robustly', () => {
            const artwork = { artist: 'Vincent van Gogh' };
            expect(matchesArtist(artwork, 'Vincent van Gogh')).toBe(true);
            expect(matchesArtist(artwork, 'vincent van gogh')).toBe(true); // Case
        });

        it('should be strict (not partial for dropdowns)', () => {
            const artwork = { artist: 'Vincent van Gogh' };
            expect(matchesArtist(artwork, 'Vincent')).toBe(false); // Dropdown logic is strict
        });
    });

    describe('matchesSearchQuery', () => {
        const artwork = {
            title: "Starry Night",
            artist: "Vincent van Gogh",
            medium: "Oil on canvas",
            description: "A famous painting."
        };

        it('should match single token', () => {
            expect(matchesSearchQuery(artwork, "Vincent")).toBe(true);
            expect(matchesSearchQuery(artwork, "night")).toBe(true);
        });

        it('should match multiple tokens (AND logic)', () => {
            expect(matchesSearchQuery(artwork, "Vincent Night")).toBe(true); // "Vincent" and "Night" both present
            expect(matchesSearchQuery(artwork, "Gogh Oil")).toBe(true);
        });

        it('should fail if one token is missing', () => {
            expect(matchesSearchQuery(artwork, "Vincent Potato")).toBe(false);
        });

        it('should match partial tokens', () => {
            expect(matchesSearchQuery(artwork, "Vinc")).toBe(true);
        });

        it('should be case insensitive', () => {
            expect(matchesSearchQuery(artwork, "starry NIGHT")).toBe(true);
        });
    });
});
