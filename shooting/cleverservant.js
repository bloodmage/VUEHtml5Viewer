var reser = new reservoir(500,10,10,0,0.1,0.0001);
var cleverbullet = [];
var tick = 0;
function mayhit(bdata) {
    var time=tick-bdata[0];
    var bx=bdata[3][0], by=bdata[3][1];
    var ldist = ((bx-player.x)*(bx-player.x)+(by-player.y)*(by-player.y))/6.25;
    if (ldist>(time-0.5)*(time-0.5) && ldist<(time+0.5)*(time+0.5)) return true;
    else return false;
}
function tickreservoir(x,y) {
    var cresult = [];
    for (var i=0;i<10;i++) cresult.push(0);
    reser.buildresult(cresult,0,5,x);
    reser.buildresult(cresult,5,10,y);
    reser.tick(cresult);
    tick ++;
    for (var i=0;i<cleverbullet.length;i++)
    {
        if (cleverbullet[i][0]<tick-400) {
            cleverbullet.splice(i,1);
            i--;
            continue;
        }
        if (Math.random()>0.98&&mayhit(cleverbullet[i])) {
            cresult = [];
            for (var j=0;j<10;j++) cresult.push(0);
            reser.buildresult(cresult,0,5,player.x/400);
            reser.buildresult(cresult,5,10,player.y/400);
            reser.postadjust(cleverbullet[i][1],cleverbullet[i][2],cresult);
        }
    }
}
function cleverservant(r,angle) {
    var s=r.circle(200,50,10);
    s.deltax=Math.cos(angle);
    s.deltay=Math.sin(angle);
    //Make color
    s.attr({fill:Raphael.rgb(Math.random()*64+190,Math.random()*64+190,Math.random()*64+190),'fill-opacity':0.3});
    s.tick = function(onboundary) {
        if (onboundary) {
            if (s.attr('cx')>400&&s.deltax>0) s.deltax=-s.deltax;
            if (s.attr('cy')>400&&s.deltay>0) s.deltay=-s.deltay;
            if (s.attr('cx')<0&&s.deltax<0) s.deltax=-s.deltax;
            if (s.attr('cy')<0&&s.deltay<0) s.deltay=-s.deltay;
        }
        if (bullets.count()>80) return true;
        if (Math.random()>0.05) return true;
        var st1 = reser.predictstage1();
        var st2 = reser.predictstage2(st1);
        var wpred = reser.predictstage3(st2,0,5,400);
        var hpred = reser.predictstage3(st2,5,10,400);
        cleverbullet.push([tick,st1,st2,[wpred,hpred]]);
        //Make a bullet
        var cir=r.circle(s.attr('cx'),s.attr('cy'),5);
        var dx=player.x-s.attr('cx'), dy=player.y-s.attr('cy');
        var rmd=Math.sqrt(dx*dx+dy*dy+0.0001)/2.5;
        cir.deltax=dx/rmd;
        cir.deltay=dy/rmd;
        cir.destroy=cir.remove;
        cir.entity=false;
        cir.ticks=0;
        cir.mr=Math.random()*64+190;
        cir.mg=Math.random()*64+190;
        cir.mb=Math.random()*64+190;
        cir.attr({fill:Raphael.rgb(cir.mr,cir.mg,cir.mb),
                  'fill-opacity':0});
        cir.tick=function(){
            if(cir.ticks<50) {
                cir.ticks++;
                cir.attr({'fill-opacity':cir.ticks/50.0});
            } else { cir.entity=true; cir.attr({stroke:Raphael.rgb(200,0,0),'stroke-width':2});}
        };
        bullets.addbullet(cir);
        return true;
    };
    s.destroy = function() {
        s.remove();
        tick = 0;
        cleverbullet.splice(0,cleverbullet.length);
    };
    return s;
}