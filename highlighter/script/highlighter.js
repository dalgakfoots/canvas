export default class Highlighter {
  constructor() {
    this.canvas = document.querySelector("#drawCanvas");
    this.context = this.canvas.getContext("2d");
    this.clearButton = document.querySelector("#clearButton");
    this.loadImageButton = document.querySelector("#loadImageButton");
    this.pointer = new Pointer(this.context);

    this.initEventListener();
  }

  initEventListener = () => {
    document.addEventListener("mousedown", this.pointer.setPosition);
    document.addEventListener("mouseup", this.pointer.setPosition);
    document.addEventListener("mousemove", this.pointer.draw);
    this.clearButton.addEventListener("click", this.clearCanvas, false);
    this.loadImageButton.addEventListener("click", this.loadImage, false);
  };

  clearCanvas = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  loadImage = () => {
    const img = new Image();
    img.src = "./blossom.jpg";
    img.onload = () => {
      this.context.globalAlpha = 1;
      this.context.drawImage(img, 0, 0, 500, 300);
    };
  };
}

class Pointer {
  constructor(context) {
    this.context = context;

    this.pos = { x: 0, y: 0 };
    this.context.lineWidth = 26;
    this.context.lineCap = "butt";
    this.context.strokeStyle = "orange";

    this.mousedown = false;
    this.start = false;
  }

  setPosition = (mouseEvent) => {
    if (mouseEvent.type === "mousedown") {
      this.mousedown = true;
      this.context.globalAlpha = 0.4;
    } else if (mouseEvent.type === "mouseup") {
      this.mousedown = false;
      this.context.globalAlpha = 1;
    }
    this.pos.x = mouseEvent.clientX;
    this.pos.y = mouseEvent.clientY;
  };

  draw = (mouseEvent) => {
    this.start = this.mousedown;
    if (!this.start) return;

    this.context.beginPath();
    this.context.moveTo(this.pos.x, this.pos.y);

    this.setPosition(mouseEvent);

    this.context.lineTo(this.pos.x, this.pos.y);

    this.context.stroke();
  };
}
