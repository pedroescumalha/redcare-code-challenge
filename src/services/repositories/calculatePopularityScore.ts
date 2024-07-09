import { utils } from "../../common";

const STARS_SCORE_MULTIPLIER = 0.5;
const FORKS_SCORE_MULTIPLIER = 0.3;
const RECENCY_SCORE_MULTIPLIER = 0.2;

// written with the help of chatGPT
export function calculatePopularityScore(input: {
    stars: number;
    forks: number;
    updatedAt: Date;
    maxStars: number;
    maxForks: number;
}): number {
    const starsScore = calculaStarsScore(input.stars, input.maxStars);
    const forksScore = calculateForksScore(input.forks, input.maxForks);
    const recencyScore = calculateRecencyScore(input.updatedAt);
 
    return utils.round(
        (starsScore * STARS_SCORE_MULTIPLIER) +
        (forksScore * FORKS_SCORE_MULTIPLIER) +
        (recencyScore * RECENCY_SCORE_MULTIPLIER)
    );
}

function calculaStarsScore(stars: number, maxStars: number): number {
    return Math.min(stars / maxStars, 1);
}

function calculateForksScore(forks: number, maxForks: number): number {
    return Math.min(forks / maxForks, 1);
}

function calculateRecencyScore(updatedAt: Date): number {
    const currentDate = new Date();
    const oneYearAgo = currentDate.setFullYear(currentDate.getFullYear() - 1);

    const recencyScore =
        (updatedAt.getTime() - oneYearAgo <= 0 ? 0 : updatedAt.getTime() - oneYearAgo) / // interval between updatedAt and one year ago
        (Date.now() - oneYearAgo); // one year interval

    return recencyScore;
}
