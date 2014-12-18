window.Minesweeper = function(x,y,mines,selector){
	function create(tag,content,listener,event){
		var node = document.createElement(tag);
		node.innerHTML = content || "";
		if (listener){ node.addEventListener(event||"click",listener.bind(app)); }
		return node;
	}
	function nextTo(n){
		var ret = [n-1,n+1,n-x-1,n-x,n-x+1,n+x-1,n+x,n+x+1].filter(function(i){return i >= 0 && i < x*y;});
		if (!(n%x)) ret = _.difference(ret,[n-1,n-x-1,n+x-1]);
		if ((n%x)===x-1) ret = _.difference(ret,[n+1,n-x+1,n+x+1]);
		return ret;
	}
	var app = {
		squares: [], // game board (either M or number of adjacent mines)
		tiles: [], // DOM nodes
		states: [], // either "hidden", "revealed", "boom", "flag"
		init: function(){
			this.drawBoard();
			this.resetGame();
		},
		drawBoard: function(){
			var table = create("table");
			_.range(0,y).map(function(r){
				var row = create("tr");
				_.range(0,x).map(function(c){
					var tile = create("td","",this.leftClickTile.bind(this,r*x+c));
					tile.addEventListener("contextmenu",function(e){
						e.preventDefault();
						this.rightClickTile(r*x+c);
					}.bind(this));
					this.tiles.push(tile);
					row.appendChild(tile);
				},this);
				table.appendChild(row);
			},this);
			var box = create("div");
			box.appendChild(table);
			box.appendChild((this.msg = create("p")));
			box.appendChild(create("button","Reset",this.resetGame.bind(this)));
			box.classList.add("minesweeper");
			document.querySelector(selector).appendChild(box);
		},
		resetGame: function(){
			this.squares = _.range(0,x*y).map(function(n){return 0;});
			this.states = _.range(0,x*y).map(function(n){return "hidden";});
			_.first(_.shuffle(_.range(0,x*y)),mines).map(function(n){
				this.squares[n]="M";
				nextTo(n).map(function(i){
					if (this.squares[i]!=="M") this.squares[i] = this.squares[i]+1;
				},this);
			},this);
			_.range(0,x*y).map(this.updateTile.bind(this));
			this.finished = false;
			this.flags = 0;
			this.revealed = 0;
			this.updateState();
		},
		updateTile: function(n){
			this.tiles[n].classList.remove("hidden","revealed","boom","flag","bogusflag");
			this.tiles[n].classList.add(this.states[n]);
			this.tiles[n].innerHTML = {
				hidden: " ",
				revealed: this.squares[n] || " ",
				flag: "f",
				boom: "X"
			}[this.states[n]];
		},
		leftClickTile: function(n){
			if (!this.finished && this.states[n]==="hidden"){
				if (this.squares[n]==="M"){
					this.states[n]="boom";
				} else {
					this.states[n]="revealed";
					this.revealed = this.revealed+1;
					if (this.squares[n]===0){
						nextTo(n).map(this.leftClickTile.bind(this));
					}
				}
				this.updateTile(n);
				this.updateState(n);
			}
		},
		rightClickTile: function(n){
			if (!this.finished){
				if (this.states[n]==="hidden" && this.flags < mines){
					this.states[n]="flag";
					this.flags = this.flags+1;
				} else if (this.states[n]==="flag"){
					this.states[n]="hidden";
					this.flags = this.flags-1;
				}
				this.updateTile(n);
				this.updateState(n);
			}
		},
		updateState: function(n){
			if (this.states[n]==="boom"){
				this.finished = true;
				_.range(0,x*y).map(function(n){
					if (this.states[n] === "flag" && this.squares[n]!=="M"){
						this.tiles[n].classList.add("bogusflag");
					}
				}.bind(this));
				this.msg.innerHTML = "You went BOOM! :(";
			} else if (this.revealed+this.flags===x*y){
				this.finished = true;
				this.msg.innerHTML = "You win!! :)";
			} else {
				this.msg.innerHTML = (mines-this.flags)+" mines left";
			}
		}
	};
	app.init();
};