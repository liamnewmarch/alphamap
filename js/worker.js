const average = (...args) => {
  return args.reduce((total, current) => total + current, 0) / args.length;
};

const variance = (amount) => {
  return amount - Math.random() * (amount * 2);
};

const map = (width, height) => {
  const array = new Uint8ClampedArray(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;

      // 0, 0
      if (x === 0 && y === 0) {
        array[index] = Math.random() * 255;
        continue;
      }

      // 0, y
      if (x === 0) {
        const top = array[(y - 1) * width + x];
        array[index] = top + variance(16);
        continue;
      }

      // x, 0
      if (y === 0) {
        const left = array[y * width + (x - 1)];
        array[index] = left + variance(16);
        continue;
      }

      // x, y
      const top = array[(y - 1) * width + x];
      const left = array[y * width + (x - 1)];
      array[index] = average(top, left) + variance(8);
    }
  }
  return array.buffer;
};

self.addEventListener('message', (event) => {
  const { height, width } = event.data;
  const arrayBuffer = map(width, height);
  self.postMessage({ arrayBuffer }, [arrayBuffer]);
});
