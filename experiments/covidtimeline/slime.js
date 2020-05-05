const DEPTH = 4;
const POPULATION = 10000000;

const split = (available, depth) => {
  if (depth <= 0) {
    return Promise.resolve([available]);
  }
  return Promise.all(Array(4).fill().map((_, idx) => {
    const value = idx === 3 ? available : Math.random() * available;
    available -= value;
    const worker = new Worker('./splitter.js');
    return new Promise((resolve) => {
      worker.onmessage = ({data}) => {
        worker.terminate();
        resolve(data.flat());
      }
      worker.postMessage({available: value, depth: depth - 1, idx})

    })
  })).then((data) => data.flat());
}

const main = async () => {
  const data = await split(POPULATION, DEPTH);
  const max = Math.max(...data);
  const width = data.length / 2;
  const height = width;
  const canvas = document.createElement('canvas', {alpha: true});
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = '768px';
  canvas.style.height = '768px';
  document.getElementsByTagName('body')[0].appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const r = 255, g = 255, b = 255;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let datIdx = 0;
      let inX = x;
      let inY = y;
      let quadWidth = width >> 1;

      while (inX > 1) {
        const quadX = inX % 2;
        const quadY = inY % 2;
        inX = inX >> 1;
        inY = inY >> 1;

        const quadIdx = quadY * 2 + quadX;
        datIdx += quadIdx * quadWidth;

        quadWidth = quadWidth >> 1;
      }
      const value = data[datIdx];
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + ((value) / max) * 255 + ')';
      ctx.fillRect(x, y, 1, 1);
    }
  }

}

console.log(`generating ${Math.pow(4, DEPTH)} datapoints...`);
main();
