function bullets__() {
    //Register bullets objects (temporarily all circles)
    //Move bullets by state, and release bullet when out of screen
    var t=this;
    var bullets=[];
    this.addbullet=function(ccl) {
        bullets.push(ccl);
    };
    this.detectcoll=function(tx,ty) {
        for(var i=0;i<bullets.length;i++) if (bullets[i].entity) {
            var cx=bullets[i].attr('cx'),cy=bullets[i].attr('cy'),r=bullets[i].attr('r');
            if ((cx-tx)*(cx-tx)+(cy-ty)*(cy-ty)>(r+2)*(r+2)) { return true; }
        }
        return false;
    };
    this.nextmove=function() {
        for (var i=0;i<bullets.length;i++) {
            var nx=bullets[i].attr('cx')+bullets[i].deltax,ny=bullets[i].attr('cy')+bullets[i].deltay;
            var r=2*bullets[i].attr('r');
            if (nx<-r || nx>400+r || ny<-r || ny>400+r) {
                bullets[i].destroy();
                bullets.splice(i,1);
                i--;
                continue;
            }
            bullets[i].attr('cx',nx);
            bullets[i].attr('cy',ny);
            bullets[i].tick();
        }
    };
    this.clear=function() {
        for(var i=0;i<bullets.length;i++) bullets[i].destroy();
        bullets.splice(0,bullets.length);
    };
};
var bullets = new bullets__();
