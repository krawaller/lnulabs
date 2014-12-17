window.Chat = function(selector){
	function create(tag,content,listener,event){
		var node = document.createElement(tag);
		node.innerHTML = content || "";
		if (listener){ node.addEventListener(event||"click",listener.bind(app)); }
		return node;
	}
	function createForm(initial,btntxt,callback){
		function send(){
			callback.call(app,input.value);
			input.value = "";
		}
		function keyPress(e){
			if (e.keyCode===13 && !e.shiftKey){
				send();
				e.preventDefault();
			}
		}
		var input, form = create("div");
		form.appendChild((input = create("textarea",initial,keyPress,"keypress")));
		form.appendChild(create("button",btntxt,send));
		return form;
	}
	var app = {
		msgs: [],
		editing: {},
		init: function(selector){
			var container = document.querySelector(selector);
			container.appendChild((this.msglist = create("div")));
			container.appendChild((this.counter = create("div")));
			container.appendChild(createForm("","Skicka!",this.addMessage));
			container.classList.add("chatapp");
			this.drawMessages();
		},
		addMessage: function(txt){
			this.msgs.push({
				time: new Date(),
				text: txt
			});
			this.drawMessages();
		},
		drawMessages: function(){
			this.msglist.innerHTML = '';
			this.msgs.map(this.drawMessage.bind(this));
			this.msglist.appendChild(create("div","Antal: "+this.msgs.length));
		},
		drawMessage: function(msg,n){
			var msg = create("div");
			if (this.editing[n]){
				msg.appendChild(createForm(this.msgs[n].text,"Uppdatera",this.updateMessage.bind(this,n)));
			} else {
				msg.appendChild(create("span",this.msgs[n].text.replace(/\n/g,"<br/>")));
				msg.insertBefore(create("button","X",this.deleteMessage.bind(this,n)),msg.firstChild);
				msg.insertBefore(create("button","?",this.tellTime.bind(this,n)),msg.firstChild);
			}
			msg.insertBefore(create("button",this.editing[n]?"avbryt":"ändra",this.toggleEdit.bind(this,n)),msg.firstChild);
			msg.classList.add("message")
			this.msglist.appendChild(msg);
		},
		toggleEdit: function(n){
			this.editing[n] = !this.editing[n];
			this.drawMessages();
		},
		updateMessage: function(n,text){
			this.msgs[n].text = text;
			delete this.editing[n];
			this.drawMessages();
		},
		tellTime: function(n){
			alert("Skapad klockan: "+this.msgs[n].time);
		},
		deleteMessage: function(n){
			if (confirm("Är du helt säker på att du vill radera meddelandet?")){
				delete this.editing[n];
				this.msgs.splice(n,1);
				this.drawMessages();
			}
		}
	};
	app.init(selector);
};