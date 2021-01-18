const fs = require('fs');
const path = require('path');

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

const flattenPattern = (pattern) => {
  const multiplayer = 720 / pattern.length;
  const result = [];

  pattern.forEach((val) =>
    result.push(...(new Array(multiplayer).fill(val))));

  return result;
};

const splitPattern = (pattern) => {
  const result = {
    crank: new Array(720).fill(0),
    cam: new Array(720).fill(0),
  };

  pattern.forEach((val, index) => {
    switch (val) {
      case 0:
        result.crank[index] = 0;
        result.cam[index] = 0;
        break;
      case 1:
        result.crank[index] = 1;
        break;
      case 2:
        result.cam[index] = 1;
        break;
      case 3:
        result.crank[index] = 1;
        result.cam[index] = 1;
        break;
      default:
        throw new Error(`Invalid value [${val}] at index [${index}]`);
    }
  });

  return result;
};

// flat
// console.dir(flattenPattern(miata_9905), { maxArrayLength: null });

// split
// console.dir(splitPattern(flattenPattern(miata_9905)), { maxArrayLength: null });

// csv out flat
fs.writeFileSync(
  path.join(__dirname, 'trigger_flat.csv'),
  flattenPattern(miata_9905).join(','),
);

// csv out split
const { crank, cam } = splitPattern(flattenPattern(miata_9905));
fs.writeFileSync(
  path.join(__dirname, 'trigger_split.csv'),
  [crank.join(','), cam.join(',')].join('\n'),
);

console.log('------------ end ------------');
