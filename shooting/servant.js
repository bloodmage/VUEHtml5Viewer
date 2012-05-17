//In tohou, only servant or enemy can shoot bullets

function servantsystem__() {
    var t=this;
    var servants=[];
    this.addservant=function(ccl) {
        servants.push(ccl);
        bullets.addbullet(ccl);
    };
    this.tick=function() {
        //Move servant
        for (var i=0;i<servants.length;i++) {
            var nx=servants[i].attr('cx')+servants[i].deltax,ny=servants[i].attr('cy')+servants[i].deltay;
            var r=0;
            var oob=false;
            if (nx<-r || nx>400+r || ny<-r || ny>400+r) { oob=true; }  //indicate servant is out-of-bound
            servants[i].attr('cx',nx);
            servants[i].attr('cy',ny);

            if (!servants[i].tick(oob)) {
                servants[i].destroy();
                servants.splice(i,1);
                i--;
                continue;
            }
        }
        shootmodel.servantcount(servants.length);
    };
    this.clear=function() {
        for (var i=0;i<servants.length;i++) servants[i].destroy();
        servants.splice(0,servants.length);
    };
}

var servants = new servantsystem__();

function servantbullet(servant,bullet) {
    bullet.attr('cx',servant.attr('cx'));
    bullet.attr('cy',servant.attr('cy'));
    return bullet;
}

function randomservant(r) {
    //Factory function, create servant from circle object
    var s=r.circle(200,50,10);
    var dx=Math.random()-0.5,dy=Math.random()-0.5;
    var rmd=Math.sqrt(dx*dx+dy*dy);
    s.deltax=dx/rmd;
    s.deltay=dy/rmd;
    //Make color
    s.attr({fill:Raphael.rgb(Math.random()*64+190,Math.random()*64+190,Math.random()*64+190),'fill-opacity':0.3});
    s.state = Math.random()*5+20;
    s.tick = function(onboundary) {
        if (onboundary) {
            if (s.attr('cx')>400&&s.deltax>0) s.deltax=-s.deltax;
            if (s.attr('cy')>400&&s.deltay>0) s.deltay=-s.deltay;
            if (s.attr('cx')<0&&s.deltax<0) s.deltax=-s.deltax;
            if (s.attr('cy')<0&&s.deltay<0) s.deltay=-s.deltay;
        }
        s.state -= 1;
        if (s.state<0) {
            //Make bullet
            if (dead) return;
            var cir=r.circle(s.attr('cx'),s.attr('cy'),5);
//            cir.attr({'stroke-width':0});
            var dx=Math.random()-0.5, dy=Math.random()-0.5;
            var rmd=Math.sqrt(dx*dx+dy*dy)/(Math.random()*1.5+0.5);
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

            s.state = Math.random()*5+20;
        }
        return true;
    };
    s.destroy=s.remove;
    return s;
}