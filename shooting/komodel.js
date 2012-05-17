var shootmodel = {
    bulletcount:ko.observable(0.0),
    fpscount:ko.observable(0.0),
    servantcount:ko.observable(0.0),
    mousex:ko.observable(0.0),
    mousey:ko.observable(0.0),
    predmx:ko.observable(0.0),
    predmy:ko.observable(0.0),
    range:ko.observable(''),
    time:ko.observable(0.0),
    besttime:ko.observable(0.0)
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
