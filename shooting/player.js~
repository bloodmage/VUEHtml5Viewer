var keyboard = function(window) {
    var keyboard = window.keyboard || {};

    if (!('isPressed' in keyboard)) {
        keyboard._keys = {};

        var handleron = function(e) {
            var key = String.fromCharCode(e.which).toLowerCase();

            keyboard._keys[key] = true;
        }
        var handleroff = function(e) {
            var key = String.fromCharCode(e.which).toLowerCase();

            keyboard._keys[key] = false;
        }

        $(document).on('keypress', handleron).
            on('keyup', handleroff);

        keyboard.isPressed = function(key) {
            key = key.toLowerCase();

            if(key in keyboard._keys) {
                return keyboard._keys[key];
            }

            return false;
        }

        keyboard.clear = function() {
            keyboard._keys = {};
        };
    }

    return keyboard;
}(window);


function player__() {
    var t = this;
    this.x = 200;
    this.y = 380;
    var speed = 3;
    this.tick = function() {
        var xf = 0, yf = 0;
        if (keyboard.isPressed('w')) {
            yf -= speed;
        }
        if (keyboard.isPressed('a')) {
            xf -= speed;
        }
        if (keyboard.isPressed('s')) {
            yf += speed;
        }
        if (keyboard.isPressed('d')) {
            xf += speed;
        }

        var nx=t.x+xf, ny=t.y+yf;
        if (nx>390) nx=390;
        if (nx<10) nx=10;
        if (ny>390) ny=390;
        if (ny<10) ny=10;
        this.x = nx;
        this.y = ny;

        //Move self
        this.sobj.attr('cx',this.x);
        this.sobj.attr('cy',this.y);
    };

    this.setself = function(s) {
        this.sobj = s;
    };

    this.dead = function() {
        this.sobj.remove();
        keyboard.clear();
    }
}
var player = new player__();
