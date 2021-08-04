var fps = 60, gMax = 12;

class Map{
  constructor(layers, cols, rows, tSize, tileSetPath, colsImage){
    this.layers = layers; // Dizer qual eh a camada que o jogador eh desenhado
    this.cols = cols;
    this.rows = rows;
    this.tSize = tSize;
    this.tileSet = new Image();
    this.tileSet.src = tileSetPath;
    this.xSet = new Image();
    this.xSet.src = "x.png";
    this.zSet = new Image();
    this.zSet.src = "z.png";
    this.colsImage = colsImage;
  }
  getTile(k, col, row){
    return this.layers[k].data[row * this.cols + col];
  }
  getTileX(index){
    index = index % 536870912;
    return (index - 1) % this.colsImage;
  }
  getTileY(index){
    index = index % 536870912;
    return ((index - 1) / this.colsImage) | 0;
  }
}

class Player{
  constructor(spriteSRC, spriteCFG, x, y, w, h, spdMax, jumpHeight, dashSpeed, dashLength){
    this.sprite = new Image(); //Sprite
    this.sprite.src = spriteSRC;
    this.spriteCFG = spriteCFG;
    this.x = x; this.y = y; this.w = w; this.h = h; // Posição no mundo
    this.xSRC = 0; this.ySRC = 0; this.wSRC = 0; this.hSRC = 0; // Coordenadas no sprite
    this.gapX = 0; this.gapY = 0;// Gap do frame
    this.dir = 1; this.orient = 1;
    this.spd = 0; this.spdMax = spdMax;
    this.g = 0; this.jumpSpeed = 0; this.jumpHeight = jumpHeight;
    this.dashSpeed = dashSpeed; this.dashDist = 0; this.dashLength = dashLength;
    this.dashCooldown = 0; this.dashCooldownMax = 15;
    this.cooldown = 0; this.cooldownMax = 10;
    this.humJump = 1; this.humDash = 1;
    this.shooting = 0; this.carga = 0;
    this.up = 0; this.down = 0; this.left = 0; this.right = 0; this.tiro = 0; // Controles
    this.andando = 0; this.atacando = 0; this.pulando = 0; this.caindo = 0; this.dash = 0; //Estados
    this.waitCount = 0; this.frameCount = 0; this.estado = 0; this.estado_a = 0; // Animação
    this.automato = []; this.estadoAtual = "I"; //Automato
    this.automato.push({q0:"I", i:"W", q1:"W"});
    this.automato.push({q0:"I", i:"J", q1:"J"});
    this.automato.push({q0:"I", i:"!C", q1:"F"});
    this.automato.push({q0:"I", i:"A", q1:"A"});
    this.automato.push({q0:"I", i:"D", q1:"D"});
    this.automato.push({q0:"W", i:"A", q1:"WA"});
    this.automato.push({q0:"W", i:"!C", q1:"WF"});
    this.automato.push({q0:"W", i:"J", q1:"WJ"});
    this.automato.push({q0:"W", i:"!W", q1:"I"});
    this.automato.push({q0:"W", i:"D", q1:"WD"});
    this.automato.push({q0:"J", i:"A", q1:"JA"});
    this.automato.push({q0:"J", i:"!J", q1:"F"});
    this.automato.push({q0:"J", i:"!JS", q1:"F"});
    this.automato.push({q0:"J", i:"T", q1:"F"});
    this.automato.push({q0:"J", i:"W", q1:"WJ"});
    this.automato.push({q0:"WJ", i:"!W", q1:"J"});
    this.automato.push({q0:"WJ", i:"!J", q1:"WF"});
    this.automato.push({q0:"WJ", i:"!JS", q1:"WF"});
    this.automato.push({q0:"WJ", i:"T", q1:"WF"});
    this.automato.push({q0:"WJ", i:"A", q1:"WJA"});
    this.automato.push({q0:"WJ", i:"A", q1:"WJA"});
    this.automato.push({q0:"F", i:"C", q1:"I"});
    this.automato.push({q0:"F", i:"A", q1:"FA"});
    this.automato.push({q0:"F", i:"W", q1:"WF"});
    this.automato.push({q0:"WF", i:"C", q1:"W"});
    this.automato.push({q0:"WF", i:"A", q1:"WFA"});
    this.automato.push({q0:"WF", i:"!W", q1:"F"});
    this.automato.push({q0:"A", i:"!A", q1:"I"});
    this.automato.push({q0:"A", i:"J", q1:"JA"});
    this.automato.push({q0:"A", i:"W", q1:"WA"});
    this.automato.push({q0:"A", i:"D", q1:"AD"});
    this.automato.push({q0:"A", i:"A", q1:"L"});
    this.automato.push({q0:"L", i:"!A", q1:"I"});
    this.automato.push({q0:"L", i:"J", q1:"JL"});
    this.automato.push({q0:"L", i:"W", q1:"WL"});
    this.automato.push({q0:"L", i:"D", q1:"LD"});
    this.automato.push({q0:"WA", i:"J", q1:"WJA"});
    this.automato.push({q0:"WA", i:"!W", q1:"A"});
    this.automato.push({q0:"WA", i:"!A", q1:"W"});
    this.automato.push({q0:"WA", i:"D", q1:"WAD"});
    this.automato.push({q0:"WA", i:"A", q1:"WL"});
    this.automato.push({q0:"WL", i:"J", q1:"WJL"});
    this.automato.push({q0:"WL", i:"!W", q1:"L"});
    this.automato.push({q0:"WL", i:"!A", q1:"W"});
    this.automato.push({q0:"WL", i:"D", q1:"WLD"});
    this.automato.push({q0:"JA", i:"!J", q1:"FA"});
    this.automato.push({q0:"JA", i:"!JS", q1:"FA"});
    this.automato.push({q0:"JA", i:"T", q1:"FA"});
    this.automato.push({q0:"JA", i:"!A", q1:"J"});
    this.automato.push({q0:"JA", i:"W", q1:"WJA"});
    this.automato.push({q0:"JA", i:"!A", q1:"J"});
    this.automato.push({q0:"JA", i:"A", q1:"JL"});
    this.automato.push({q0:"JL", i:"!J", q1:"FL"});
    this.automato.push({q0:"JL", i:"!JS", q1:"FL"});
    this.automato.push({q0:"JL", i:"T", q1:"FL"});
    this.automato.push({q0:"JL", i:"!A", q1:"J"});
    this.automato.push({q0:"JL", i:"W", q1:"WJL"});
    this.automato.push({q0:"JL", i:"!A", q1:"J"});
    this.automato.push({q0:"WJA", i:"!A", q1:"WJ"});
    this.automato.push({q0:"WJA", i:"!W", q1:"JA"});
    this.automato.push({q0:"WJA", i:"!J", q1:"WFA"});
    this.automato.push({q0:"WJA", i:"!JS", q1:"WFA"});
    this.automato.push({q0:"WJA", i:"T", q1:"WFA"});
    this.automato.push({q0:"WJA", i:"A", q1:"WJL"});
    this.automato.push({q0:"WJL", i:"!A", q1:"WJ"});
    this.automato.push({q0:"WJL", i:"!W", q1:"JL"});
    this.automato.push({q0:"WJL", i:"!J", q1:"WFL"});
    this.automato.push({q0:"WJL", i:"!JS", q1:"WFL"});
    this.automato.push({q0:"WJL", i:"T", q1:"WFL"});
    this.automato.push({q0:"FA", i:"!A", q1:"F"});
    this.automato.push({q0:"FA", i:"W", q1:"WFA"});
    this.automato.push({q0:"FA", i:"C", q1:"A"});
    this.automato.push({q0:"FA", i:"A", q1:"FL"});
    this.automato.push({q0:"FL", i:"!A", q1:"F"});
    this.automato.push({q0:"FL", i:"W", q1:"WFL"});
    this.automato.push({q0:"FL", i:"C", q1:"L"});
    this.automato.push({q0:"WFA", i:"!A", q1:"WF"});
    this.automato.push({q0:"WFA", i:"!W", q1:"FA"});
    this.automato.push({q0:"WFA", i:"C", q1:"WA"});
    this.automato.push({q0:"WFA", i:"A", q1:"WFL"});
    this.automato.push({q0:"WFL", i:"!A", q1:"WF"});
    this.automato.push({q0:"WFL", i:"!W", q1:"FL"});
    this.automato.push({q0:"WFL", i:"C", q1:"WL"});
    this.automato.push({q0:"D", i:"!D", q1:"I"}); //Colocar os outros (D->j->JD)
    this.automato.push({q0:"D", i:"J", q1:"JD"});
    this.automato.push({q0:"D", i:"W", q1:"WD"});
    this.automato.push({q0:"D", i:"A", q1:"AD"});
    this.automato.push({q0:"D", i:"!C", q1:"F"});
    this.automato.push({q0:"WD", i:"A", q1:"WAD"});
    this.automato.push({q0:"WD", i:"J", q1:"WJD"});
    this.automato.push({q0:"WD", i:"!D", q1:"W"});
    this.automato.push({q0:"WD", i:"!W", q1:"D"});
    this.automato.push({q0:"WD", i:"!C", q1:"WF"});
    this.automato.push({q0:"JD", i:"W", q1:"WJD"});
    this.automato.push({q0:"JD", i:"A", q1:"JAD"});
    this.automato.push({q0:"JD", i:"!J", q1:"FD"});
    this.automato.push({q0:"JD", i:"!JS", q1:"FD"});
    this.automato.push({q0:"JD", i:"T", q1:"FD"});
    this.automato.push({q0:"FD", i:"W", q1:"WFD"});
    this.automato.push({q0:"FD", i:"A", q1:"FAD"});
    this.automato.push({q0:"FD", i:"C", q1:"I"});
    this.automato.push({q0:"WJD", i:"A", q1:"WJAD"});
    this.automato.push({q0:"WJD", i:"!W", q1:"JD"});
    this.automato.push({q0:"WJD", i:"!J", q1:"WFD"});
    this.automato.push({q0:"WJD", i:"!JS", q1:"WFD"});
    this.automato.push({q0:"WJD", i:"T", q1:"WFD"});
    this.automato.push({q0:"WFD", i:"A", q1:"WFAD"});
    this.automato.push({q0:"WFD", i:"C", q1:"I"});
    this.automato.push({q0:"AD", i:"W", q1:"WAD"});
    this.automato.push({q0:"AD", i:"J", q1:"JAD"});
    this.automato.push({q0:"AD", i:"!D", q1:"A"});
    this.automato.push({q0:"AD", i:"!A", q1:"D"});
    this.automato.push({q0:"AD", i:"!C", q1:"FA"});
    this.automato.push({q0:"AD", i:"A", q1:"LD"});
    this.automato.push({q0:"LD", i:"W", q1:"WLD"});
    this.automato.push({q0:"LD", i:"J", q1:"JLD"});
    this.automato.push({q0:"LD", i:"!D", q1:"L"});
    this.automato.push({q0:"LD", i:"!A", q1:"D"});
    this.automato.push({q0:"LD", i:"!C", q1:"FL"});
    this.automato.push({q0:"WAD", i:"!W", q1:"AD"});
    this.automato.push({q0:"WAD", i:"!D", q1:"WA"});
    this.automato.push({q0:"WAD", i:"!A", q1:"WD"});
    this.automato.push({q0:"WAD", i:"J", q1:"WJAD"});
    this.automato.push({q0:"WAD", i:"!C", q1:"FA"});
    this.automato.push({q0:"WAD", i:"A", q1:"WLD"});
    this.automato.push({q0:"WLD", i:"!W", q1:"LD"});
    this.automato.push({q0:"WLD", i:"!D", q1:"WL"});
    this.automato.push({q0:"WLD", i:"!A", q1:"WD"});
    this.automato.push({q0:"WLD", i:"J", q1:"WJLD"});
  }
  fisica() {
    this.moveDash();
    this.jump();
    this.move();
    this.shoot();
    this.die();//WJAFD
  }
  move(){
    this.dir = this.right - this.left; // Andando
    if(this.dir && !this.estadoAtual.includes("W")){ // Começa a andar
      this.automatoNext("W");
      this.orient = this.dir;
    }if(this.estadoAtual.includes("W")){ // Andando
      this.orient = this.dir;
      if(this.dir && this.spd < this.spdMax){ // Acelerando
        this.spd++;
      }else if(this.dir && this.spd == this.spdMax){ // No loop

      }else if(!this.dir && this.spd > 0){ // Freando
        this.spd--;
        if(!this.spd) // Cabou de andar
          this.automatoNext("!W");
      }for(let s = this.spd; s > 0; s--){ // Aplicando pulo
        if(placeFree(this, this.x + s * this.orient, this.y)){
          this.x += s * this.orient;
          break;
        }
      }
    }
  }
  jump(){
    if(this.up && !placeFree(this, this.x, this.y + 1) && this.automatoNext("J") && this.humJump){ // Começando a pular
      this.jumpSpeed = this.jumpHeight;
      this.humJump = 0;
    }if(this.estadoAtual.includes("J")){ // Pulando
      if(placeFree(this, this.x, this.y - 1)){ // Bateu no teto
        this.jumpSpeed = 0;
        this.automatoNext("!J")
      }else if(!this.up){ // Soltou o pulo
        this.jumpSpeed = 0;
        this.automatoNext("!J")
      }else if(!this.jumpSpeed){ // Acabou o pulo
        this.jumpSpeed = 0;
        this.automatoNext("!J")
      }for(let h = this.jumpSpeed; h > 0; h--){
        if(placeFree(this, this.x, this.y - h)){
          this.y -= h;
          this.jumpSpeed--;
          break;
        }
      }
    }
  }
  moveDash(){

  }
  shoot(){

  }
  die() {

  }
  automatoNext(entrada){
    for(let i of this.automato){
      if(i.q0 == this.estadoAtual && i.i == entrada){
        console.log(i);
        this.estadoAtual = i.q1;
        return 1;
      }
    }
    return 0;
  }
	getEstado(){ //IWJFALD
    if(this.estadoAtual == "I"){

    }else if(this.estadoAtual.includes("W")){
      if(this.estadoAtual.includes("J")){
        if(this.estadoAtual.includes("A")){
          if(this.estadoAtual.includes("D")){

          }else{

          }
        }else if(this.estadoAtual.includes("L")){
          if(this.estadoAtual.includes("D")){

          }else{

          }
        }else if(this.estadoAtual.includes("D")){

        }else{

        }
      }else if(this.estadoAtual.includes("F")){
        if(this.estadoAtual.includes("A")){
          if(this.estadoAtual.includes("D")){

          }else{

          }
        }else if(this.estadoAtual.includes("L")){
          if(this.estadoAtual.includes("D")){

          }else{

          }
        }else if(this.estadoAtual.includes("D")){

        }else{

        }
      }else if(this.estadoAtual.includes("A")){
        if(this.estadoAtual.includes("D")){

        }else{

        }
      }else if(this.estadoAtual.includes("L")){
        if(this.estadoAtual.includes("D")){

        }else{

        }
      }else if(this.estadoAtual.includes("D")){

      }else{

      }
    }else if(this.estadoAtual.includes("J")){
      if(this.estadoAtual.includes("A")){
        if(this.estadoAtual.includes("D")){

        }else{

        }
      }else if(this.estadoAtual.includes("L")){
        if(this.estadoAtual.includes("D")){

        }else{

        }
      }else if(this.estadoAtual.includes("D")){

      }
    }else if(this.estadoAtual.includes("F")){
      if(this.estadoAtual.includes("A")){
        if(this.estadoAtual.includes("D")){

        }else{

        }
      }else if(this.estadoAtual.includes("L")){
        if(this.estadoAtual.includes("D")){

        }else{

        }
      }else if(this.estadoAtual.includes("D")){

      }else{

      }
    }else if(this.estadoAtual.includes("A")){
      if(this.estadoAtual.includes("D")){

      }else{

      }
    }else if(this.estadoAtual.includes("L")){
      if(this.estadoAtual.includes("D")){

      }else{

      }
    }else if(this.estadoAtual.includes("D")){

    }

		return this.estado;
	}
  anima(){
    if(this.getEstado() != this.estado_a){ // Mudou de estado
			this.estado_a = this.estado;
			this.waitCount = 0; // Contador dentro do frame
			this.frameCount = 0; // Contador de frames
		}
    this.x += (this.w - this.spriteCFG.states[this.estado].hitboxX);
    this.y += (this.h - this.spriteCFG.states[this.estado].hitboxY);
    this.w = this.spriteCFG.states[this.estado].hitboxX;
    this.h = this.spriteCFG.states[this.estado].hitboxY;
    this.gapX = this.spriteCFG.states[this.estado].gapX;
    this.gapY = this.spriteCFG.states[this.estado].gapY;
		this.xSRC = this.spriteCFG.states[this.estado].posicaoX + this.spriteCFG.states[this.estado].frameCounts[this.frameCount] * this.spriteCFG.states[this.estado].frameWidth; // Atualiza posição do frame
    this.ySRC = this.spriteCFG.states[this.estado].posicaoY;
    this.wSRC = this.spriteCFG.states[this.estado].frameWidth;
    this.hSRC = this.spriteCFG.states[this.estado].frameHeight;
		this.waitCount++; // Contando os Waits
		if(this.waitCount == this.spriteCFG.states[this.estado].frameWaits[this.frameCount]){
			this.waitCount = 0;
			this.frameCount++; // Contando os Frames
		}
		if(this.frameCount == this.spriteCFG.states[this.estado].nFrames){
			this.frameCount = 0;
		}
  }
  drawPlayer(){
    var ctx = game.canvas.getContext("2d");
    this.anima();
    ctx.save();
    if(this.orient == -1){ // Olhando pra esquerda
      ctx.translate(+this.x + this.w / 2, + this.y + this.h / 2);
      ctx.scale(-1, +1);
      ctx.translate(-this.x - this.w / 2, - this.y - this.h / 2);
    }
    ctx.drawImage(this.sprite, this.xSRC, this.ySRC, this.wSRC, this.hSRC, this.x - this.gapX, this.y - this.gapY, this.wSRC, this.hSRC);
    //ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.restore();
  }
}

class Projetil{
  constructor(spriteSRC, spriteCFG, x, y, w, h, spd, dir, estado){
    this.sprite = new Image();
    this.sprite.src = spriteSRC;
    this.spriteCFG = spriteCFG;
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.xSRC = 0; this.ySRC = 0; this.wSRC = 0; this.hSRC = 0;
    this.dir = dir; this.spd = spd;
    this.waitCount = 0; this.frameCount = 0; this.estado = estado; this.estado_a = 0;
  }
  moveProjetil(){
    for(let s = this.spd; s > 0; s--){
      if (placeFree(this, this.x + s * this.dir, this.y)){
        this.x += s * this.dir;
        break;
      }else if(s == 1){
        let x = projetils.indexOf(this);
        projetils.splice(x, 1);
      }
    }
  }
  anima(){
    /*if(this.getEstado() != this.estado_a){ // Mudou de estado
			this.estado_a = this.estado;
			this.waitCount = 0; // Contador dentro do frame
			this.frameCount = 0; // Contador de frames
		}*/
    this.x += (this.w - this.spriteCFG.states[this.estado].hitboxX);
    this.y += (this.h - this.spriteCFG.states[this.estado].hitboxY);
    this.w = this.spriteCFG.states[this.estado].hitboxX;
    this.h = this.spriteCFG.states[this.estado].hitboxY;
    this.gapX = this.spriteCFG.states[this.estado].gapX;
    this.gapY = this.spriteCFG.states[this.estado].gapY;
		this.xSRC = this.spriteCFG.states[this.estado].posicaoX + this.spriteCFG.states[this.estado].frameCounts[this.frameCount] * this.spriteCFG.states[this.estado].frameWidth; // Atualiza posição do frame
    this.ySRC = this.spriteCFG.states[this.estado].posicaoY;
    this.wSRC = this.spriteCFG.states[this.estado].frameWidth;
    this.hSRC = this.spriteCFG.states[this.estado].frameHeight;
		this.waitCount++; // Contando os Waits
		if(this.waitCount == this.spriteCFG.states[this.estado].frameWaits[this.frameCount]){
			this.waitCount = 0;
			this.frameCount++; // Contando os Frames
		}
		if(this.frameCount == this.spriteCFG.states[this.estado].nFrames){
			this.frameCount = 0;
		}
  }
  drawProjetil(){
    var ctx = game.canvas.getContext("2d");
    this.anima();
    ctx.save();
    if(this.dir == -1){ // Olhando pra esquerda
      ctx.translate(+this.x + this.w / 2, + this.y + this.h / 2);
      ctx.scale(-1, +1);
      ctx.translate(-this.x - this.w / 2, - this.y - this.h / 2);
    }
    ctx.drawImage(this.sprite, this.xSRC, this.ySRC, this.wSRC, this.hSRC, this.x - this.wSRC/2+this.w/2, this.y-this.hSRC/2+this.h/2, this.wSRC, this.hSRC);
    //ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.restore();
  }
}

map = new Map(mapas.layers, 100, 40, 16, "tiles.png", 3);
player = new Player("x.png", spriteX, 267, 353, 18, 31, 2, 5, 4, 40);
projetils = [];

var game = {
  canvas: document.createElement("canvas"),
  start: function(){
    this.width = 1600;
    this.height = 640;
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(update, 1000 / fps);
    window.addEventListener('keydown', function (e) {
      game.keys = (game.keys || []);
      game.keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('keyup', function (e) {
      game.keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('mousemove', function (e) {
        game.mouseX = e.pageX - 10 + cam.x;
        game.mouseY = e.pageY - 10 + cam.y;
    })
    /*window.addEventListener('click', function (e) {
        game.mouseX = (e.pageX - 10 + cam.x) - (e.pageX - 10 + cam.x) % 64;
        game.mouseY = (e.pageY - 10 + cam.y) - (e.pageY - 10 + cam.y) % 64;
        walls.push({x:game.mouseX, y:game.mouseY, w:64, h:64});
    })*/
  },
  clear: function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

var cam = {
  x: 0,
  y: 0,
  w: 640,
  h: 480,
  port: 0.25,
  leftEdge: function(){ // Janela imóvel
    return this.x + this.port * this.w;
  },
  rightEdge: function(){
    return this.x + (1 - this.port) * this.w;
  },
  topEdge: function(){
    return this.y + this.port * this.h;
  },
  bottomEdge: function(){
    return this.y + (1 - this.port) * this.h;
  },
  center: function(){ // Centraliza câmera
    if(player.x < this.leftEdge()){
      this.x = player.x - this.port * this.w;
    }
    if(player.x + player.w > this.rightEdge()){
      this.x = player.x + player.w - (1 - this.port) * this.w;
    }
    if(player.y < this.topEdge()){
      this.y = player.y - this.port * this.h;
    }
    if(player.y + player.h > this.bottomEdge()){
      this.y = player.y + player.h - (1 - this.port) * this.h;
    }this.x = this.x | 0; this.y = this.y | 0;

    if(this.x < 0){ // Limites da câmera
      this.x = 0;
    }
    if( this.x + this.w > game.width){
      this.x = game.width - this.w;
    }
    if(this.y < 0){
      this.y = 0;
    }
    if( this.y + this.h > game.height){
      this.y = game.height - this.h;
    }
  }
};

function startGame(){
  game.start();
}

function update(){
    redraw();
    controls();
    physic();
    debug();
}
function redraw(){
  game.clear();
  var ctx = game.context;
  cam.center();
  ctx.save();
  ctx.translate(-cam.x, -cam.y);
  drawWalls();
  //drawPlayer();
  ctx.restore();

}
function controls(){
  keyPressed();
  keyReleased();
}
function physic(){
  player.fisica();
  for(let i = 0; i < projetils.length; i++){
    projetils[i].moveProjetil();
  }
}

// Redraw
function drawWalls(){
  var ctx = game.canvas.getContext("2d");
  ctx.fillStyle = "#4F4";
  for(let k = 0; k < map.layers.length - 1; k++){
    for(let i = 0; i < map.cols; i++){
      for(let j = 0; j < map.rows; j++){
        if(map.getTile(k, i, j)){
          ctx.save();
          if((map.getTile(k, i, j) / 536870912) & 4){
            ctx.translate(+map.tSize / 2 + i * map.tSize, +map.tSize / 2 + j * map.tSize);
            ctx.scale(-1, +1);
            ctx.translate(-map.tSize / 2 - i * map.tSize, -map.tSize / 2 - j * map.tSize);
          }
          if((map.getTile(k, i, j) / 536870912) & 2){
            ctx.translate(+map.tSize / 2 + i * map.tSize, +map.tSize / 2 + j * map.tSize);
            ctx.scale(+1, -1);
            ctx.translate(-map.tSize / 2 - i * map.tSize, -map.tSize / 2 - j * map.tSize);
          }
          if((map.getTile(k, i, j) / 536870912) & 1){
            ctx.translate(+map.tSize / 2 + i * map.tSize, +map.tSize / 2 + j * map.tSize);
            ctx.scale(-1, +1);
            ctx.rotate(1.57);
            ctx.translate(-map.tSize / 2 - i * map.tSize, -map.tSize / 2 - j * map.tSize);
          }
          ctx.drawImage(map.tileSet, map.getTileX(map.getTile(k, i, j)) * map.tSize, map.getTileY(map.getTile(k, i, j)) * map.tSize, map.tSize, map.tSize, i * map.tSize, j * map.tSize, map.tSize, map.tSize);
          ctx.restore();
        }
      }
    }
    if(k == 1){
      player.drawPlayer();
      for(let i = 0; i < projetils.length; i++){
        projetils[i].drawProjetil();
      }
    }
  }
}

// Controls
var keyPressed = function() {
  if ((game.keys && game.keys[75])) { // Pula
     player.up = 1;
  }
  if ((game.keys && game.keys[65])) { // Left
     player.left = 1;
  }
  if ((game.keys && game.keys[83])) { // Down
     player.down = 1;
  }
  if ((game.keys && game.keys[68])) { // Right
     player.right = 1;
  }
  if ((game.keys && game.keys[74])) { // Tiro
     player.tiro = 1;
  }
  if ((game.keys && game.keys[76])) { // Dash
     player.dash = 1;
  }
};
var keyReleased = function() {
  if (!(game.keys && game.keys[75])) { // Pula
    player.up = 0;
  }
  if (!(game.keys && game.keys[65])) { // Left
    player.left = 0;
  }
  if (!(game.keys && game.keys[83])) { // Down
    player.down = 0;
  }
  if (!(game.keys && game.keys[68])) { // Right
    player.right = 0;
  }
  if (!(game.keys && game.keys[74])) { // Tiro
     player.tiro = 0;
  }
  if (!(game.keys && game.keys[76])) { // Dash
     player.dash = 0;
  }
};

// Física
var collision = function(r1, r2) {
  if (r1.x+ r1.w > r2.x &&
      r1.x < r2.x + r2.w &&
      r2.y + r2.h > r1.y &&
      r2.y < r1.y + r1.h) {
        return true;
  } else {
    return false;
  }
};
var placeFree = function(entity, xNew, yNew) {
  var temp = { x: xNew, y: yNew, w: entity.w, h: entity.h};
  for(let i = 0; i < map.cols; i++){
    for(let j = 0; j < map.rows; j++){
      if(collision(temp, {x:i * map.tSize, y:j * map.tSize, w:map.tSize, h:map.tSize}) && map.getTile(map.layers.length - 1, i, j)){
        return false;
      }
    }
  }
  return true;
}

// Debug
function debug(){
  text = "";
  //text += "Mouse: (" + game.mouseX + ", " + game.mouseY + ")";
  //text += "Posicao Player: (" + player.x + ", " + player.y + ")";
  text += "Posicao Player: (" + Math.floor(player.x) + ", " + Math.floor(player.y) + ")";
  text += "<br><br>Estado Player: ";
  text += "<br><br>Andando: " + player.dir;
  text += "<br><br>Atacando: " + player.atacando;
  text += "<br><br>Pulando: " + player.up;
  text += "<br><br>Dash: " + player.dash;
  //text += "Posição Enemy: (" + enemy.x + ", " + enemy.y + ")";
  //text += "Move Enemy: (" + enemy.up + ", " + enemy.left + ", " + enemy.down + ", " + enemy.right + ")";
  text += "<br><br>Posição Câmera: (" + cam.x + ", " + cam.y + ")";
  text += "<br><br>W: Jump | A: <= | D: =>";
  text += "<br><br>Move: (" + player.dir + "/" + player.orient + ")";
  text += "<br><br>Speed: (" + player.spd + "/" + player.spdMax + ")";
  text += "<br><br>Cooldown: (" + player.cooldown + "/" + player.cooldownMax + ")";
  text += "<br><br>Dash: (" + player.dashDist + "/" + player.dashLength + ")";
  text += "<br><br>DashCooldown: (" + player.dashCooldown + "/" + player.dashCooldownMax + ")";
  text += "<br><br>Jump : (" + player.jumpSpeed + "/" + player.jumpHeight + ")";
  text += "<br><br>Fall Speed: (" + player.g + "/" + gMax + ")";
  text += "<br><br>Carga: " + player.carga;
  /*if (player.dir == 1) {
    text += "<br><br>Indo: Direita";
  }else if(player.dir == -1){
    text += "<br><br>Indo: Esquerda";
  }else {
    text += "<br><br>Indo: Parado";
  }
  text += "<br><br>Direção: " + player.orient;
  //player.andando = "Andando";
  //player.atacando = "Atacando";
  //player.pulando = "Pulando";
  //player.caindo = "Caindo";
  //player.dash = "Dash";
  text += "<br><br>Estado:";
  if(player.andando)
    text += " / Andando";
  if(player.atacando)
    text += " / Atacando";
  if(player.pulando)
    text += " / Pulando";
  if(player.caindo)
    text += " / Caindo";
  if(player.dash)
    text += " / Dash:";
  text += "<br><br>Frame:" + spriteX.states[0].nFrames;
  text += "<br><br>Mapa:" + mapas.layers[0].data[0];
	text += "<br><br>Sprite: (" + player.waitCount + "/" + player.spriteCFG.states[player.estado].frameWaits[player.frameCount];
	text += ", " + player.frameCount + "/" + player.spriteCFG.states[player.estado].nFrames + ")";
  text += "<br><br>Projeteis: " + projetils.length;
  text += "<br><br>Left Edge: " + cam.leftEdge();
  text += "<br><br>Right Edge: " + cam.rightEdge();
  text += "<br><br>Top Edge: " + cam.topEdge();
  text += "<br><br>Bottom Edge: " + cam.bottomEdge();
  text += "<br><br>Image Width: " + map.tileSet.width;
  text += "<br><br>Tile Size: " + map.tSize;
  text += "<br><br>ColsImage: " + map.colsImage;
  for(let i = 0; i < 0; i++){
    text += "<br><br>Tile" + i + ": " + map.getTile(i, 0);
    text += "<br><br>Tile" + i + "X: " + map.getTileX(map.getTile(i, 0) % 536870912);
    text += "<br><br>Tile" + i + "Y: " + map.getTileY(map.getTile(i, 0) % 536870912);
  }*/
  document.getElementById("stats").innerHTML = text;
}
