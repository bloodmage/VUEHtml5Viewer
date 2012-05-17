function reservoir(nodes,inputs,outputs,rbias,sparse,rout) {
    var weight = [];
    var bias = [];
    var obias = [];
    var iw = [];
    var ow = [];
    var biasv = -Math.log(1/sparse-1);
    for (var i=0;i<nodes;i++)
    {
        var tw = [];
        var selfv;
        for (var j=0;j<nodes;j++)
            if(i==j) { selfv = Math.random()*5.0+0.3; tw.push(selfv); }
            else tw.push((Math.random()-0.5)/nodes*200);
        weight.push(tw);
        bias.push(-selfv*sparse-Math.log(1/sparse-1));
    }
    for (var i=0;i<inputs;i++)
    {
        var tw = [];
        for (var j=0;j<nodes;j++)
            tw.push((Math.random()-0.5)/nodes);
        iw.push(tw);
    }
    for (var i=0;i<outputs;i++)
    {
        var tw = [];
        for (var j=0;j<nodes;j++)
            tw.push((Math.random()-0.5)/nodes);
        ow.push(tw);
        obias.push(0.0);
    }

    this.weight = weight;
    this.bias = bias;
    this.obias = obias;
    this.iw = iw;
    this.ow = ow;

    this.sparse = sparse;
    this.state = [];
    for (var i=0;i<nodes;i++)
        this.state.push((Math.random()-0.5)/100+sparse);
    
    this.tick = function(input) {
        //Translate input and self state
        var nstate = [];
        for (var i=0;i<nodes;i++) nstate.push(this.bias[i]);
        for (var i=0;i<inputs;i++)
            for (var j=0;j<nodes;j++)
                nstate[j]+=input[i]*this.iw[i][j];
        for (var i=0;i<nodes;i++)
            for (var j=0;j<nodes;j++)
                nstate[j]+=this.state[i]*this.weight[i][j];

        for (var i=0;i<nodes;i++)
            nstate[i]=1/(1+Math.exp(-nstate[i]-(Math.random()-0.5)/100));

        this.state = nstate;
        
        //Fix bias
        for (var i=0;i<nodes;i++)
            if (nstate[i]>sparse) this.bias[i]-=rbias; else this.bias[i]+=rbias;
    };
    
    this.predictstage1 = function() { return this.state; };
    this.predictstage2 = function(state) {
        var nstate = [];
        for (var i=0;i<outputs;i++) nstate.push(this.obias[i]);
        for (var j=0;j<outputs;j++)
            for (var i=0;i<nodes;i++)
                nstate[j]+=state[i]*this.ow[j][i];
        return nstate;
    };
    this.predictstage3 = function(ostate,lrange,rrange,scaledrange) {
        //Find biggest value point within [lrange,rrange)
        var lpt = lrange, mean = 0;
        for (var i=lrange;i<rrange;i++) {
            if (ostate[lpt]<ostate[i]) lpt = i;
            mean += ostate[i];
        }
        mean /= rrange-lrange;
        //Find skew relationship with others
        var rng = 1;
        if (lpt==rrange-1) rng = -1;
        else if (lpt==0) rng = 1;
        else
            if (ostate[lpt-1]>ostate[lpt+1]) rng = -1; else rng = 1;
        if (rng==-1) lpt --;
        //Use arctan to test scale
        var lp = ostate[lpt] - mean; rp = ostate[lpt+1] - mean;
        var scale = 0;
        if (lp<0) scale = 1; else if (rp<0) scale = 0; else scale = Math.atan(rp/lp)/Math.PI*2;
        //Decide point-of-range
        var percent=(scale+lp-0.5)/(rrange-lrange-1);
        if (percent<0) percent=0;
        if (percent>1) percent=1;
        return scaledrange*percent;
    };
    this.buildresult = function(gostate,lrange,rrange,percent) {
        for (var i=lrange;i<rrange;i++)
            gostate[i] = 0.01;
        var posi=percent*(rrange-lrange-1)+0.5;
        var lposi=Math.floor(posi);
        posi -= lposi;
        posi *= Math.PI/2;
        gostate[lposi]+=0.98*Math.cos(posi);
        gostate[lposi+1]+=0.98*Math.sin(posi);
        return gostate;
    };
    this.postadjust = function(state,ostate,gostate) {
        var delta = [];
        for (var i=0;i<outputs;i++) delta.push(gostate[i]-ostate[i]);
        for (var j=0;j<outputs;j++) {
            for (var i=0;i<nodes;i++)
                this.ow[j][i] += rout * state[i] * delta[j];
            this.obias[j] += rout * delta[j];
        }
    };
}

