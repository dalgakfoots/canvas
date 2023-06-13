export default class ImageCropper {
  constructor() {
    this.canvas = document.querySelector("#drawCanvas");
    this.context = this.canvas.getContext("2d");
    this.clearButton = document.querySelector("#clearButton");
    this.undoButton = document.querySelector("#undo");
    this.loadImageButton = document.querySelector("#loadImageButton");
    this.downloadButton = document.querySelector("#downloadButton");
    this.cropButton = document.querySelector('#crop');

    this.context.canvasX = this.canvas.offsetLeft;
    this.context.canvasY = this.canvas.offsetTop;
    this.context.canvasWidth = this.canvas.width;
    this.context.canvasHeight = this.canvas.height;
    this.pointer = new Pointer(this.context);

    this.initEventListener();
  }

  initEventListener = () => {
    document.addEventListener("mousedown", this.pointer.setStartPosition);
    document.addEventListener("mouseup", this.pointer.setEndPosition);
    document.addEventListener("mousemove", this.pointer.draw);

    document.addEventListener("touchstart", this.pointer.setStartPosition);
    document.addEventListener("touchend", this.pointer.setEndPosition);
    document.addEventListener("touchmove", this.pointer.draw);

    this.clearButton.addEventListener("click", this.pointer.clearCanvas, false);
    this.undoButton.addEventListener("click", this.pointer.undo, false);
    this.loadImageButton.addEventListener("click", this.pointer.imgStart, false);
    this.cropButton.addEventListener('click', this.pointer.crop, false);
    this.downloadButton.addEventListener("click", this.pointer.saveImage, false);
  };
}

class Pointer {
  constructor(context) {
    this.context = context;

    this.img = new Image(800, 600);
    this.img.src = "./loremipsum.png"; // TODO : 사용자가 올린 파일 URL

    this.context.lineWidth = 3;
    this.context.strokeStyle = "#000000";

    this.mousedown = false;
    this.start = false;
    this.isImageLoaded = false;

    this.pos = { sx: 0, sy: 0, ex: 0, ey: 0 };
    this.lastestRect = { x: 0, y: 0, width: 0, height: 0 };
  }

  isInCanvas = (e) => {
    let eventType = e.constructor.name;
    let x, y = 0;

    if (eventType === 'TouchEvent') {
      x = e.changedTouches[0].clientX - this.context.canvasX;
      y = e.changedTouches[0].clientY - this.context.canvasY;
    } else if (eventType === 'MouseEvent') {
      x = e.clientX - this.context.canvasX;
      y = e.clientY - this.context.canvasY;
    }

    if (x < 0 || y < 0) return false;
    if (x > this.context.canvasWidth || y > this.context.canvasHeight) return false;
    return true;
  }

  // 1. 최초 클릭 했을 때의 좌표 설정
  setStartPosition = (e) => {

    if (this.isInCanvas(e)) {
      this.start = true;
      this.getPosition(e);
      console.log(this.pos);
    }

  }

  // 2. 클릭이 유지되고 있을 때 사각형을 draw 한다
  draw = (e) => {
    if (this.start && this.isInCanvas(e)) {
      // this.context.clearRect(0, 0, this.context.canvasWidth, this.context.canvasHeight);
      this.getPosition(e);
      let property = this.getRectProperty(this.pos);
      let { x, y, width, height } = property;

      if (this.isImageLoaded) {
        this.context.drawImage(this.img, 0, 0, this.context.canvasWidth, this.context.canvasHeight);
      } else {
        this.context.clearRect(0, 0, this.context.canvasWidth, this.context.canvasHeight);
      }

      // this.context.strokeRect(x, y , width , height);
      this.context.beginPath();
      this.context.rect(x, y, width, height);

      this.lastestRect.x = x;
      this.lastestRect.y = y;
      this.lastestRect.width = width;
      this.lastestRect.height = height;

      this.context.stroke();
      this.context.closePath();
    }
  }

  // 3. 클릭이 release 됐을 때의 좌표 설정
  setEndPosition = (e) => {
    if (this.isInCanvas(e)) {
      this.getPosition(e);
      this.start = false;
      console.log(this.pos);
    }
  }

  getPosition = (e) => {
    let eventType = e.constructor.name;

    if (eventType === 'TouchEvent') {
      if (e.type === 'touchstart') {
        this.pos.sx = e.changedTouches[0].clientX - this.context.canvasX;
        this.pos.sy = e.changedTouches[0].clientY - this.context.canvasY;
      } else {
        this.pos.ex = e.changedTouches[0].clientX - this.context.canvasX;
        this.pos.ey = e.changedTouches[0].clientY - this.context.canvasY;
      }
    } else if (eventType === 'MouseEvent') {
      if (e.type === 'mousedown') {
        this.pos.sx = e.clientX - this.context.canvasX;
        this.pos.sy = e.clientY - this.context.canvasY;
      } else {
        this.pos.ex = e.clientX - this.context.canvasX;
        this.pos.ey = e.clientY - this.context.canvasY;
      }

    }
  }

  getRectProperty = (pos) => {
    let startingPoint = this.getStartingPoint(pos);
    let width = this.getWidth(pos);
    let height = this.getHeight(pos);
    return {
      x: startingPoint.x,
      y: startingPoint.y,
      width,
      height,
    }
  }

  getStartingPoint = (pos) => {
    return {
      x: pos.sx <= pos.ex ? pos.sx : pos.ex,
      y: pos.sy <= pos.ey ? pos.sy : pos.ey
    };
  }

  getWidth = (pos) => {
    let width = pos.sx <= pos.ex ? pos.ex - pos.sx : pos.sx - pos.ex;
    return width;
  }

  getHeight = (pos) => {
    return pos.sy <= pos.ey ? pos.ey - pos.sy : pos.sy - pos.ey;
  }

  imgStart = () => {
    this.context.drawImage(this.img, 0, 0, this.context.canvasWidth, this.context.canvasHeight);
    this.isImageLoaded = true;
  }

  clearCanvas = () => {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.isImageLoaded = false;

    let cropCanvas = document.querySelector('#cropCanvas');
    let cropCanvasContext = cropCanvas.getContext("2d");
    cropCanvasContext.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
  };

  undo = () => {
    if (this.isImageLoaded) {
      this.context.drawImage(this.img, 0, 0, this.context.canvasWidth, this.context.canvasHeight);
    } else {
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
  }

  crop = () => {
    let canvas = document.querySelector('#drawCanvas');
    let cropCanvas = document.querySelector('#cropCanvas');
    let cropCanvasContext = cropCanvas.getContext("2d");

    cropCanvas.width = this.lastestRect.width;
    cropCanvas.height = this.lastestRect.height;

    let img = new Image();
    img.src = canvas.toDataURL();

    img.onload = () => {
      cropCanvasContext.drawImage(img, this.lastestRect.x,
        this.lastestRect.y,
        this.lastestRect.width,
        this.lastestRect.height,
        0,
        0,
        this.lastestRect.width,
        this.lastestRect.height);
    };
  }

  saveImage = () => {
    let download = document.querySelector("#download");
    let outputImg = cropCanvas.toDataURL('image/octet-stream');
    download.setAttribute('href', outputImg);
  }
}
