window.Quiz = function(selector){
	function create(tag,content,listener,event){
		var node = document.createElement(tag);
		node.innerHTML = content || "";
		if (listener){ node.addEventListener(event||"click",listener.bind(app)); }
		return node;
	}
	var app = {
		errors: [],
		url: "http://vhost3.lnu.se:20080/question/1",
		init: function(selector){
			this.container = document.querySelector(selector);
			this.container.appendChild((this.msglist = create("div")));
			var form = create("div");
			form.appendChild((this.input = create("input","",this.keyInForm,"keypress")));
			form.appendChild(create("button","Skicka!",this.answerQuestion));
			form.classList.add("form");
			this.container.appendChild(form);
			this.container.classList.add("quizgame");
			this.fetchQuestion();
		},
		keyInForm: function(e){
			if (e.keyCode===13){this.answerQuestion();}
		},
		log: function(type,text){
			var msg = create("div",text);
			msg.classList.add(type);
			this.msglist.appendChild(msg);
		},
		fetchQuestion: function(){
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState === 4){
					this.receiveQuestion(JSON.parse(xhr.responseText));
				}
			}.bind(this);
			xhr.open("GET", this.url, true);
			xhr.send(null);
		},
		receiveQuestion: function(data){
			this.container.classList.add("hasquestion");
			this.errors.push(0);
			this.url = data.nextURL;
			this.log("question",data.question);
			this.input.focus();
		},
		answerQuestion: function(){
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState === 4){
					this.input.value = "";
					if (xhr.status === 400){
						this.wrongAnswer();
					} else {
						this.correctAnswer(JSON.parse(xhr.responseText));
					}
				}
			}.bind(this);
			xhr.open("POST", this.url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify({answer:this.input.value}));
		},
		correctAnswer: function(data){
			this.log("correct","Yes, det var rätt!");
			this.container.classList.remove("hasquestion");
			if (data.nextURL){
				this.url = data.nextURL;
				this.fetchQuestion();
			} else {
				this.finish();
			}
		},
		wrongAnswer: function(){
			this.errors[this.errors.length-1] = this.errors[this.errors.length-1]+1;
			this.log("error","Fel! Försök #"+(this.errors[this.errors.length-1]+1)+":");
		},
		finish: function(){
			this.container.classList.remove("hasquestion");
			this.log("ending","Du hade totalt "+this.errors.reduce(function(m,i){return m+i;},0)+" fel!");
		}
	};
	app.init(selector);
};