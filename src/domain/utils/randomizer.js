export function createRandomizer(seed = Date.now()) {
  let currentSeed = seed;

  return {
    next() {
      currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
      return currentSeed / 4294967296;
    },
    getSeed() {
      return currentSeed;
    },
  };
}
