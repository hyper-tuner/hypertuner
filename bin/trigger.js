console.log('------------ start ------------');

const miata_9905 = [
  // Split into 5 degree blocks (12 per line)
  0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, // Single cam tooth
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, // Pulse at 100*
  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, // Pulse at 170*
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // No pulse
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, // Pulse at 280*
  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, // Pulse at 350*
  0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, // Double cam pulses
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, // Pulse at 460*
  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, // Pulse at 530*
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // No pulse
  0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, // Pulse at 640
  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, // Pulse at 710
];

const generate = (pattern) => {
  const maxDeg = 720;
  const resolution = maxDeg / pattern.length;
  const crank = [];
  const cam = [];
  let camLast = 0;
  let crankLast = 0;

  [...Array(maxDeg).keys()].forEach((index) => {

    if (index === 0 || index % resolution === 0) {
      const patternIndex = index / resolution;
      const current = pattern[patternIndex];

      switch (current) {
        case 0:
          crank[index] = 0;
          cam[index] = 0;
          crankLast = 0;
          camLast = 0;
          break;
        case 1:
          crank[index] = 1;
          crankLast = 1;
          break;
        case 2:
          cam[index] = 1;
          camLast = 1;
          break;
        case 3:
          crank[index] = 1;
          cam[index] = 1;
          crankLast = 1;
          camLast = 1;
          break;
        default:
          throw new Error(`Invalid pattern [${current}] at: ${patternIndex}`);
      }

      return;
    }

    // TODO: count length of a tooth
    crank[index] = 0;
    cam[index] = 0;
  });

  return {
    crank,
    cam,
  };
};

const { crank, cam } = generate(miata_9905);

console.log('== crank ==');
console.log(
  crank.map((val, index) => val ? '▔' : '.' ).join(''),
);
console.log('== cam ==');
console.log(
  cam.map((val, index) => val ? '▔' : '.' ).join(''),
);

console.log('------------ end ------------');
