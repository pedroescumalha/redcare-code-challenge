import { describe, it } from "node:test";
import { calculatePopularityScore } from "../repositories/calculatePopularityScore";
import assert from "node:assert";

describe("calculatePopularityScore", () => {
    const getOldDate = (): Date => {
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

        return fiveYearsAgo;
    };

    it("doesnt take into account repos that havent been updated for more than 1 year", () => {
        const score = calculatePopularityScore({
            forks: 0,
            stars: 0,
            updatedAt: getOldDate(),
            maxForks: 1,
            maxStars: 1,
        });

        assert.equal(score, 0);
    });

    it("takes into account stars", () => {
        const score = calculatePopularityScore({
            forks: 0,
            stars: 1,
            updatedAt: getOldDate(),
            maxForks: 1,
            maxStars: 1,
        });

        assert.equal(score, 0.5);
    });

    it("takes into account forks", () => {
        const score = calculatePopularityScore({
            forks: 1,
            stars: 0,
            updatedAt: getOldDate(),
            maxForks: 1,
            maxStars: 1,
        });

        assert.equal(score, 0.3);
    });

    it("takes into account recency score", () => {
        const score = calculatePopularityScore({
            forks: 0,
            stars: 0,
            updatedAt: new Date(),
            maxForks: 1,
            maxStars: 1,
        });

        assert.equal(score, 0.2);
    });
});
