export default class Highlighter {
  constructor() {
    this.canvas = document.querySelector("#drawCanvas");
    this.context = this.canvas.getContext("2d");
    this.clearButton = document.querySelector("#clearButton");
    this.loadImageButton = document.querySelector("#loadImageButton");
    this.downloadButton = document.querySelector("#downloadButton");

    this.pointer = new NewPointer(this.context);

    this.initEventListener();
  }

  initEventListener = () => {
    document.addEventListener("mousedown", this.pointer.setPosition);
    document.addEventListener("mouseup", this.pointer.setPosition);
    document.addEventListener("mousemove", this.pointer.draw);

    document.addEventListener("touchstart", this.pointer.setPosition);
    document.addEventListener("touchend", this.pointer.setPosition);
    document.addEventListener("touchmove", this.pointer.draw);

    this.clearButton.addEventListener("click", this.clearCanvas, false);
    this.loadImageButton.addEventListener("click", this.loadImage, false);
    this.downloadButton.addEventListener("click", this.saveImage, false);
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

  saveImage = () => {
    let download = document.querySelector("#download");
    let img = this.canvas.toDataURL("image/octet-stream");
    download.setAttribute("href", img);
  };
}

class Pointer {
  constructor(context) {
    this.context = context;

    this.pos = { x: 0, y: 0 };
    this.context.lineWidth = 26;
    this.context.lineCap = "square";
    this.context.strokeStyle = "orange";

    this.mousedown = false;
    this.start = false;
  }

  setPosition = (e) => {
    let eventType = e.constructor.name;
    let type = e.type;

    if (eventType === "TouchEvent") {
      if (type === "touchstart") {
        this.setMousedownTrue();
      } else if (type === "touchend") {
        this.setMousedownFalse();
      }
      this.pos.x = e.changedTouches[0].clientX;
      this.pos.y = e.changedTouches[0].clientY;
    } else if (eventType === "MouseEvent") {
      if (type === "mousedown") {
        this.setMousedownTrue();
      } else if (type === "mouseup") {
        this.setMousedownFalse();
      }
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
    }
  };

  setMousedownTrue = () => {
    this.mousedown = true;
    this.context.globalAlpha = 0.2;
  };

  setMousedownFalse = () => {
    this.mousedown = false;
    this.context.globalAlpha = 1;
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

class NewPointer {
  constructor(context) {
    this.context = context;
    this.context.fillStyle = "#ff0";
    this.context.globalCompositeOperation = "multiply";

    this.mousedown = false;
    this.start = false;
    this.pos = { x: 0, y: 0 };
  }

  setPosition = (e) => {
    let eventType = e.constructor.name;
    let type = e.type;

    if (eventType === "TouchEvent") {
      if (type === "touchstart") {
        this.setMousedownTrue();
      } else if (type === "touchend") {
        this.setMousedownFalse();
      }
      this.pos.x = e.changedTouches[0].clientX;
      this.pos.y = e.changedTouches[0].clientY;
    } else if (eventType === "MouseEvent") {
      if (type === "mousedown") {
        this.setMousedownTrue();
      } else if (type === "mouseup") {
        this.setMousedownFalse();
      }
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
    }
  };

  setMousedownTrue = () => {
    this.mousedown = true;
  };

  setMousedownFalse = () => {
    this.mousedown = false;
  };

  draw = (event) => {
    this.start = this.mousedown;
    if (!this.start) return;
    this.setPosition(event);
    this.context.fillRect(this.pos.x - 20, this.pos.y - 20, 20, 20);
  };
}
