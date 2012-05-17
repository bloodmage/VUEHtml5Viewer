var shootmodel = {
    bulletcount:ko.observable(5.0),
    fpscount:ko.observable(5.0)
};
$(function(){ko.applyBindings(shootmodel);});
(function() {

    var stTime=Date.now();
    var movingfps=0;

    oneframe = function(){
        var time=Date.now();
        movingfps = (movingfps*9+1000/(time-stTime))/10;
        stTime=time;
        shootmodel.fpscount(Math.floor(movingfps));
    };
})();
