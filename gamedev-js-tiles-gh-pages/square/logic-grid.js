var map = {
  cols: 12,
  rows: 12,
  tsize: 64,
  blocks: [3, 5],
  layers: [
    [
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1,
      1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 2,
      2, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1,
      1, 2, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1,
      2, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 2,
      1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 2, 3,
      3, 3, 3, 3, 3,
    ],
    [
      4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 4, 4, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 5,
      4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3,
    ],
  ],
  getTile: function (layer, col, row) {
    return this.layers[layer][row * map.cols + col];
  },
  isSolidTileAtXY: function (x, y) {
    // console.log(x, y);
    var col = Math.floor(x / this.tsize);
    var row = Math.floor(y / this.tsize);

    // tiles 3 and 5 are solid -- the rest are walkable
    // loop through all layers and return TRUE if any tile is solid
    return this.layers.reduce(
      function (res, layer, index) {
        // console.log(index);
        var tile = this.getTile(index, col, row);
        var isSolid = this.blocks.includes(tile);

        return res || isSolid;
      }.bind(this),
      false
    );
  },

  isSolidTileAtXY2: function (x, y) {
    var col = Math.floor(x / this.tsize);
    var row = Math.floor(y / this.tsize);

    return this.layers.reduce(
      function (res, layer, index) {
        // console.log(index);
        var tile = this.getTile(index, col, row);
        var isSolid = this.blocks.includes(tile);

        return res || isSolid;
      }.bind(this),
      false
    );
  },

  // ????????? ?????????, ????????? ???,??? ???
  getCol: function (x) {
    return Math.floor(x / this.tsize);
  },
  getRow: function (y) {
    return Math.floor(y / this.tsize);
  },

  // ??? ?????? ???????????? X??? ???????????????
  getX: function (col) {
    return col * this.tsize;
  },
  // Y??? ???????????????
  getY: function (row) {
    return row * this.tsize;
  },
};

function Camera(map, width, height) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
  this.maxX = map.cols * map.tsize - width;
  this.maxY = map.rows * map.tsize - height;
}

Camera.prototype.follow = function (sprite) {
  this.following = sprite;
  sprite.screenX = 0;
  sprite.screenY = 0;
};

Camera.prototype.update = function () {
  // assume followed sprite should be placed at the center of the screen
  // whenever possible
  this.following.screenX = this.width / 2;
  this.following.screenY = this.height / 2;

  // make the camera follow the sprite
  this.x = this.following.x - this.width / 2;
  this.y = this.following.y - this.height / 2;
  // clamp values
  this.x = Math.max(0, Math.min(this.x, this.maxX));
  this.y = Math.max(0, Math.min(this.y, this.maxY));

  // in map corners, the sprite cannot be placed in the center of the screen
  // and we have to change its screen coordinates

  // left and right sides
  if (
    this.following.x < this.width / 2 ||
    this.following.x > this.maxX + this.width / 2
  ) {
    this.following.screenX = this.following.x - this.x;
  }
  // top and bottom sides
  if (
    this.following.y < this.height / 2 ||
    this.following.y > this.maxY + this.height / 2
  ) {
    this.following.screenY = this.following.y - this.y;
  }
};

function Hero(map, x, y) {
  this.map = map;
  this.x = x;
  this.y = y;
  this.width = map.tsize;
  this.height = map.tsize;
  this.c = 0;
  this.tempX = 0;
  this.tempY = 0;
  this.image = Loader.getImage("hero");
}

Hero.SPEED = 200; // pixels per second
// tsize??? ?????? ????????? ?????? ?????? ??????(?????????)
let i = 1;
let min = 64;
let realSpeed = 0;
const arr = [];
while (i <= map.tsize) {
  if (map.tsize % i === 0) {
    arr.push(i);
  }
  i++;
}
Hero.prototype.move = function (delta, dirX, dirY) {
  // move hero
  // ?????? ?????? ??????????????? ????????? ???????????? ?????? ????????? ????????? ?????? ????????????
  for (let i = 0; i < arr.length; i++) {
    c =
      arr[i] - Hero.SPEED * delta < 0
        ? -(arr[i] - Hero.SPEED * delta)
        : arr[i] - Hero.SPEED * delta;

    if (c < min) {
      min = c;
      realSpeed = arr[i];
    }
  }

  this.x += dirX * realSpeed;
  this.x = Math.round(this.x);

  this.y += dirY * realSpeed;
  this.y = Math.round(this.y);
  // check if we walked into a non-walkable tile
  this._collide(dirX, dirY);

  // clamp values
  var maxX = this.map.cols * this.map.tsize;
  var maxY = this.map.rows * this.map.tsize;
  this.x = Math.max(0, Math.min(this.x, maxX));
  this.y = Math.max(0, Math.min(this.y, maxY));
};

Hero.prototype._collide = function (dirX, dirY) {
  var row, col;
  // -1 in right and bottom is because image ranges from 0..63
  // and not up to 64
  var left = this.x - this.width / 2;
  var right = this.x + this.width / 2 - 1;
  var top = this.y - this.height / 2;
  var bottom = this.y + this.height / 2 - 1;
  // console.log(blockLeftUp);
  // ????????? ??????(??????)

  const blockLeftUp = this.map.isSolidTileAtXY(left, top);
  const blockLeftDown = this.map.isSolidTileAtXY(left, bottom);
  const blockRightUp = this.map.isSolidTileAtXY(right, top);
  const blockRightDown = this.map.isSolidTileAtXY(right, bottom);

  // ????????? ???????????? ???
  if (blockLeftUp && blockRightUp && !(blockRightDown || blockLeftDown)) {
    row = this.map.getRow(top);
    this.y = this.height / 2 + this.map.getY(row + 1);
    console.log("???????");
  }
  //???????????? ???????????? ???
  else if (blockLeftDown && blockRightDown && !(blockRightUp || blockLeftUp)) {
    row = this.map.getRow(bottom); //y???(??????)?????? ???????????? ????????? ??????????????? top ??? ??????
    this.y = -this.height / 2 + this.map.getY(row);
    console.log("?????????????");
  }
  //??????????????? ????????? ???
  else if (blockLeftUp && blockLeftDown && !(blockRightUp || blockRightDown)) {
    col = this.map.getCol(left);
    this.x = this.width / 2 + this.map.getX(col + 1);
    console.log("???????");
  } // ?????????????????? ????????? ???
  else if (blockRightUp && blockRightDown && !(blockLeftDown || blockLeftUp)) {
    col = this.map.getCol(right);
    this.x = -this.width / 2 + this.map.getX(col);
    console.log("?????????!");
  } // ????????? ?????? ?????? ????????????
  else if (blockLeftUp && blockRightUp && blockLeftDown) {
    col = this.map.getCol(left);
    this.x = this.width / 2 + this.map.getX(col + 1);
    row = this.map.getRow(top);
    this.y = this.height / 2 + this.map.getY(row + 1);
    console.log("??????");
  } // ?????????, ?????? ?????? ????????????
  else if (blockRightUp && blockLeftUp && blockRightDown) {
    row = this.map.getRow(top);
    this.y = this.height / 2 + this.map.getY(row + 1);
    col = this.map.getCol(right);
    this.x = -this.width / 2 + this.map.getX(col);
    console.log("??????");
  } // ??????, ????????? ?????? ????????????
  else if (blockLeftDown && blockRightDown && blockLeftUp) {
    col = this.map.getCol(left);
    this.x = this.width / 2 + this.map.getX(col + 1);
    row = this.map.getRow(bottom);
    this.y = -this.height / 2 + this.map.getY(row);
    console.log("??????");
  } // ?????????, ????????? ?????? ????????????
  else if (blockRightDown && blockRightUp && blockLeftDown) {
    row = this.map.getRow(bottom);
    this.y = -this.height / 2 + this.map.getY(row);
    col = this.map.getCol(right);
    this.x = -this.width / 2 + this.map.getX(col);
    console.log("??????");
  } // ?????? ????????? ????????? ?????????, ??? ????????? ?????????
  else if (blockLeftUp && !(blockRightDown && blockRightUp && blockLeftDown)) {
    let blockX = this.map.getX(this.map.getCol(left) + 1) + this.width / 2;
    let blockY = this.map.getY(this.map.getRow(top) + 1) + this.height / 2;

    if (blockX - this.x > blockY - this.y) {
      this.y = blockY;
    } else if (blockX - this.x < blockY - this.y) {
      this.x = blockX;
    } else {
      this.y = blockY;
      this.x = blockX;
    }
  } // ????????? ????????? ????????? ?????????, ??? ????????? ?????????
  else if (blockLeftDown && !(blockRightDown && blockRightUp && blockLeftUp)) {
    let blockX = this.map.getX(this.map.getCol(left) + 1) + this.width / 2;
    let blockY = this.map.getY(this.map.getRow(bottom)) - this.height / 2;

    if (blockX - this.x > this.y - blockY) {
      this.y = blockY;
    } else if (blockX - this.x < this.y - blockY) {
      this.x = blockX;
    } else {
      this.y = blockY;
      this.x = blockX;
    }
  }
  // ?????? ????????? ????????? ?????????, ??? ????????? ?????????
  else if (blockRightUp && !(blockRightDown && blockLeftDown && blockLeftUp)) {
    let blockX = this.map.getX(this.map.getCol(right)) - this.width / 2;
    let blockY = this.map.getY(this.map.getRow(top) + 1) + this.height / 2;

    if (this.x - blockX > blockY - this.y) {
      this.y = blockY;
    } else if (this.x - blockX < blockY - this.y) {
      this.x = blockX;
    } else {
      this.y = blockY;
      this.x = blockX;
    }
  }
  // ????????? ????????? ????????? ?????????, ??? ????????? ?????????
  else if (blockRightDown && !(blockLeftDown && blockRightUp && blockLeftUp)) {
    let blockX = this.map.getX(this.map.getCol(right)) - this.width / 2;
    let blockY = this.map.getY(this.map.getRow(bottom)) - this.height / 2;

    if (this.x - blockX > this.y - blockY) {
      this.y = blockY;
    } else if (this.x - blockX < this.y - blockY) {
      this.x = blockX;
    } else {
      this.y = blockY;
      this.x = blockX;
    }
  }
};

Game.load = function () {
  return [
    Loader.loadImage("tiles", "../assets/tiles.png"),
    Loader.loadImage("hero", "../assets/character.png"),
  ];
};

Game.init = function () {
  Keyboard.listenForEvents([
    Keyboard.LEFT,
    Keyboard.RIGHT,
    Keyboard.UP,
    Keyboard.DOWN,
  ]);
  this.tileAtlas = Loader.getImage("tiles");

  this.hero = new Hero(map, 160, 160);
  this.camera = new Camera(map, 512, 512);
  this.camera.follow(this.hero);
};

Game.update = function (delta) {
  // handle hero movement with arrow keys
  var dirX = 0;
  var dirY = 0;
  // -----------------------------temp ?????? ?????? ???????????? ??????-------------------------------
  if (Keyboard.isDown(Keyboard.LEFT)) {
    this.hero.tempX = -1;
    dirX = -1;

    if (Keyboard.isDown(Keyboard.UP)) {
      dirY = -1;
      this.hero.tempY = -1;
    }
    if (Keyboard.isDown(Keyboard.DOWN)) {
      dirY = 1;
      this.hero.tempY = 1;
    }
  } else if (Keyboard.isDown(Keyboard.RIGHT)) {
    dirX = 1;
    this.hero.tempX = 1;

    if (Keyboard.isDown(Keyboard.UP)) {
      dirY = -1;
      this.hero.tempY = -1;
    }
    if (Keyboard.isDown(Keyboard.DOWN)) {
      dirY = 1;
      this.hero.tempY = 1;
    }
  }

  if (Keyboard.isDown(Keyboard.UP)) {
    dirY = -1;
    this.hero.tempY = -1;
  } else if (Keyboard.isDown(Keyboard.RIGHT)) {
    dirX = 1;
    this.hero.tempX = 1;
  } else if (Keyboard.isDown(Keyboard.LEFT)) {
    dirX = -1;
    this.hero.tempX = -1;
  }

  if (Keyboard.isDown(Keyboard.DOWN)) {
    dirY = 1;
    this.hero.tempY = 1;
  } else if (Keyboard.isDown(Keyboard.RIGHT)) {
    dirX = 1;
    this.hero.tempX = 1;
  } else if (Keyboard.isDown(Keyboard.LEFT)) {
    dirX = -1;
    this.hero.tempX = -1;
  }

  let locatX = (this.hero.x - 160) % map.tsize !== 0;
  let locatY = (this.hero.y - 160) % map.tsize !== 0;

  if (dirX !== 0 || locatX) {
    dirX = this.hero.tempX;
  }
  if (dirY !== 0 || locatY) {
    dirY = this.hero.tempY;
  }

  this.hero.move(delta, dirX, dirY);
  this.camera.update();

  //   if (locat) {
  //     console.log(this.hero.x);
  //   }
};

Game._drawLayer = function (layer) {
  var startCol = Math.floor(this.camera.x / map.tsize);
  var endCol = startCol + this.camera.width / map.tsize;
  var startRow = Math.floor(this.camera.y / map.tsize);
  var endRow = startRow + this.camera.height / map.tsize;
  var offsetX = -this.camera.x + startCol * map.tsize;
  var offsetY = -this.camera.y + startRow * map.tsize;

  for (var c = startCol; c <= endCol; c++) {
    for (var r = startRow; r <= endRow; r++) {
      var tile = map.getTile(layer, c, r);
      var x = (c - startCol) * map.tsize + offsetX;
      var y = (r - startRow) * map.tsize + offsetY;
      if (tile !== 0) {
        // 0 => empty tile
        this.ctx.drawImage(
          this.tileAtlas, // image
          (tile - 1) * map.tsize, // source x
          0, // source y
          map.tsize, // source width
          map.tsize, // source height
          Math.round(x), // target x
          Math.round(y), // target y
          map.tsize, // target width
          map.tsize // target height
        );
      }
    }
  }
};

Game._drawGrid = function () {
  var width = map.cols * map.tsize;
  var height = map.rows * map.tsize;
  var x, y;
  for (var r = 0; r < map.rows; r++) {
    x = -this.camera.x;
    y = r * map.tsize - this.camera.y;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(width, y);
    this.ctx.stroke();
  }
  for (var c = 0; c < map.cols; c++) {
    x = c * map.tsize - this.camera.x;
    y = -this.camera.y;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, height);
    this.ctx.stroke();
  }
};

Game.render = function () {
  // draw map background layer
  this._drawLayer(0);

  // draw main character
  this.ctx.drawImage(
    this.hero.image,
    this.hero.screenX - this.hero.width / 2,
    this.hero.screenY - this.hero.height / 2
  );

  // draw map top layer
  this._drawLayer(1);

  this._drawGrid();
};
