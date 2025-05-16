var ChatTime = 0;
var Chat = undefined;
// -------------------------------------------------------------------------------------------
$(document).ready(function(){
	document.getElementById("ChatSubmit").addEventListener("keypress",function(event){
		if (event["key"] === "Enter"){
			var Message = $("#ChatSubmit").val();
			$.post("http://chat/ChatSubmit",JSON.stringify({ message: Message }));
			$("#ChatBackground").css("background","transparent");
			$("#ChatSubmit").css("display","none");

			if (Message === "" && ChatTime === 0){
				$("#ChatMessage").css("display","none");
			}
		}
	});

	document.onkeyup = function(event){
		switch (event["key"]){
			case "Escape":
				if ($("#ChatSubmit").css("display") === "block"){
					$.post("http://chat/ChatSubmit",JSON.stringify({ message: "" }));
					$("#ChatBackground").css("background","transparent");
					$("#ChatSubmit").css("display","none");
				}
			break;
		}
	}
});
// -------------------------------------------------------------------------------------------
window.addEventListener("message",function(event){
	switch (event["data"]["Action"]){
		case "Chat":
			if ($("#ChatSubmit").css("display") === "none"){
				$("#ChatSubmit").val("");
				$("#ChatSubmit").css("display","block");
				$("#ChatMessage").css("display","block");
				$("#ChatBackground").css("background","#141414");

				document.getElementById("ChatSubmit").focus();
				document.getElementById("ChatSubmit").select();
			}
		break;

		case "Message":
			var Html = `<div>${event["data"]["Author"]}: ${event["data"]["Message"]}</div>`;
			$(Html).appendTo("#ChatMessage");

			if ($("#ChatSubmit").css("display") === "none"){
				var element = document.getElementById("ChatMessage");
				element["scrollTop"] = element["scrollHeight"];

				$("#ChatMessage").css("display","block");
			}

			clearInterval(Chat);
			Chat = undefined;
			ChatTime = 1;

			Chat = setInterval(function(){
				ChatTime = ChatTime + 1;

				if (ChatTime > 5){
					if ($("#ChatSubmit").css("display") === "none"){
						$("#ChatMessage").css("display","none");
					}

					clearInterval(Chat);
					Chat = undefined;
					ChatTime = 0;
				}
			},1000);
		break;
	}
});