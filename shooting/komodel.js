var shootmodel = {
    bulletcount:ko.observable(0.0),
    fpscount:ko.observable(0.0),
    servantcount:ko.observable(0.0)
};
$(function(){ko.applyBindings(shootmodel);});
(function() {

    var stTime=Date.now();
    var movingfps=0.0;

    oneframe = function(){
        var time=Date.now();
        movingfps = (movingfps*9+1000/(time-stTime+1))/10;
        stTime=time;
        shootmodel.fpscount(Math.floor(movingfps));
    };
})();
