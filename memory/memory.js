window.Memory = function(x,y,selector){
	function create(tag,content,listener,event){
		var node = document.createElement(tag);
		node.innerHTML = content || "";
		if (listener){ node.addEventListener(event||"click",listener.bind(app)); }
		return node;
	}
	var app = {
		tiles: [],
		matches: 0,
		fails: 0,
		init: function(x,y,selector){
			this.arr = _.shuffle(_.range(0,x*y/2).concat(_.range(0,x*y/2)));
			var table = create("table");
			_.range(0,y).map(function(r){
				var row = create("tr");
				_.range(0,x).map(function(c){
					var tile = create("td","<div>"+this.arr[r*x+c]+"</div><div>?</div>",this.clickTile.bind(this,r*x+c));
					tile.classList.add("hidden");
					this.tiles.push(tile);
					row.appendChild(tile);
				},this);
				table.appendChild(row);
			},this);
			var box = create("div");
			box.appendChild(table);
			box.appendChild((this.status = create("p","Let's begin!")));
			box.classList.add("memogame");
			document.querySelector(selector).appendChild(box);
		},
		setTileState: function(n,state){
			this.tiles[n].classList.remove("hidden","revealed","correct","wrong");
			this.tiles[n].classList.add(state);
			if (state==="wrong"){
				setTimeout(function(){
					this.setTileState(n,"hidden");
				}.bind(this),1000);
			}
		},
		clickTile: function(n){
			if (this.tiles[n].classList.contains("hidden")){
				if (this.current === undefined){
					this.firstTile(n);
				} else if (this.arr[n] === this.arr[this.current]){
					this.correctTile(n);
				} else {
					this.wrongTile(n);
				}
			}
		},
		firstTile: function(n){
			this.current = n;
			this.setTileState(n,"revealed");
			this.setStatus("Where might the other be?");
		},
		correctTile: function(n){
			this.setTileState(n,"correct");
			this.setTileState(this.current,"correct");
			delete this.current;
			this.matches++;
			if (this.matches===this.tiles.length/2){
				this.setStatus("You made it with only "+this.fails+" fails!");
			} else {
				this.setStatus("Found a pair! Only "+(this.tiles.length/2-this.matches)+" left!");
			}
		},
		wrongTile: function(n){
			this.setTileState(n,"wrong");
			this.setTileState(this.current,"wrong");
			this.setStatus("Ack, wrong! Sorry!");
			delete this.current;
			this.fails++;
		},
		setStatus: function(msg){
			this.status.innerHTML = msg;
		}
	};
	app.init(x,y,selector);
};