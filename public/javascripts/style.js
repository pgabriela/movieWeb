window.onresize = function(){
    var vw = $(window).width();
    if(vw < 1000){
        
    }
    if(vw < 1500){
        $("#font3").addClass("invisible");
        $("#font4").removeClass("invisible");
    }
};

window.onload = function(){
    var vw = $(window).width();
    if(vw < 1500){
        $("#font3").addClass("invisible");
        $("#font4").removeClass("invisible");
    }
};