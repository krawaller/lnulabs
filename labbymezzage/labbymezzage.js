window.Chat = function(selector){
	function create(tag,content,listener,event){
		var node = document.createElement(tag);
		node.innerHTML = content || "";
		if (listener){ node.addEventListener(event||"click",listener.bind(app)); }
		return node;
	}
	var app = {
		msgs: [],
		init: function(){
			var container = document.querySelector(selector);
			container.appendChild((this.msglist = create("div")));
			container.appendChild((this.counter = create("div")));
			var form = create("div");
			form.appendChild((this.input = create("textarea",'',this.keyInForm,"keypress")));
			form.appendChild(create("button",'Skicka!',this.addMessage));
			container.appendChild(form);
			container.classList.add("chatapp");
			this.drawMessages();
		},
		addMessage: function(){
			this.msgs.push({
				time: new Date(),
				text: this.input.value
			});
			this.input.value = "";
			this.drawMessages();
		},
		keyInForm: function(e){
			if (e.keyCode===13 && !e.shiftKey){
				this.addMessage();
				e.preventDefault();
			}
		},
		drawMessages: function(){
			this.msglist.innerHTML = '';
			this.msgs.map(this.drawMessage.bind(this));
			this.msglist.appendChild(create("div","Antal: "+this.msgs.length));
		},
		drawMessage: function(msg,n){
			var msg = create("div",this.msgs[n].text.replace(/\n/g,"<br/>"));
			msg.insertBefore(create("button","X",this.deleteMessage.bind(this,n)),msg.firstChild);
			msg.insertBefore(create("button","?",this.tellTime.bind(this,n)),msg.firstChild);
			msg.classList.add("message");
			this.msglist.appendChild(msg);
		},
		tellTime: function(n){
			alert("Created at: "+this.msgs[n].time);
		},
		deleteMessage: function(n){
			if (confirm("Är du helt säker på att du vill radera meddelandet?")){
				this.msgs.splice(n,1);
				this.drawMessages();
			}
		}
	};
	app.init();
};