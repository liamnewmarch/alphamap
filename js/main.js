const ERR_WORKER_SUPPORT = () => 'this browser does not support Workers.';
const ERR_CONCURRENCY = (actual, expected) => new Error(
  `hardware concurrency ${actual} is too low, ${expected} workers are required.`);
const ERR_WRAPPER = (message) =>  `Oh no! There was an error – ${message}`;

class AlphaMap {
  constructor() {
    this._workers = this._createWorkers(3);
  }

  _createWorkers(workerCount) {
    const concurrency = navigator.hardwareConcurrency || 0;
    if (!window.Worker) throw ERR_WORKER_SUPPORT();
    if (concurrency < workerCount) throw ERR_CONCURRENCY(concurrency, workerCount);
    return Array(workerCount).fill().map(() => new Worker('js/worker.js'));
  }

  _generateChannel(worker, width, height) {
    return new Promise(resolve => {
      worker.addEventListener('message', (event) => {
        const channelData = new Uint8ClampedArray(event.data.arrayBuffer);
        resolve(channelData);
      }, { once: true });
      worker.postMessage({ height, width });
    });
  }

  async generate({ height, width }) {
    const channels = await Promise.all(this._workers.map((worker) => {
      return this._generateChannel(worker, width, height);
    }));
    const imageData = new ImageData(width, height);
    for (let i = 0; i < width * height; i++) {
      imageData.data[i * 4 + 0] = channels[0][i];
      imageData.data[i * 4 + 1] = channels[1][i];
      imageData.data[i * 4 + 2] = channels[2][i];
      imageData.data[i * 4 + 3] = 255;
    }
    return imageData;
  }
}

customElements.define('x-app', class extends HTMLElement {
  constructor() {
    super();
    this.update = this.update.bind(this);
  }

  connectedCallback() {
    try {
      this._alphaMap = new AlphaMap();
      this._canvas = document.createElement('canvas');
      this._context = this._canvas.getContext('2d');
      this.appendChild(this._canvas);
      this.update();
      this.addEventListener('click', () => this.update());
    } catch (error) {
      this.textContent = ERR_WRAPPER(error.message);
    }
  }

  async update() {
    const width = window.innerWidth * devicePixelRatio;
    const height = window.innerHeight * devicePixelRatio;
    const imageData = await this._alphaMap.generate({ height, width });
    this._canvas.width = width;
    this._canvas.height = height;
    this._context.putImageData(imageData, 0, 0);
  }
});
