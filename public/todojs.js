$(".todo-list").on("click", "li", function(){
	$(this).toggleClass("completed");
});