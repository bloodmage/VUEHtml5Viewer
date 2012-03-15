/* This is a smallest model for VUE, implements least part of VUE dataformat
 * To support demanded VUE file to display
 */

function VUELiteNode(N) {
	this.ID = N.attr('ID');
	this.x = parseFloat(N.attr('x'));
	this.y = parseFloat(N.attr('y'));
	this.width = parseFloat(N.attr('width'));
	this.height = parseFloat(N.attr('height'));
	this.label = N.attr('label');
	if (this.label == undefined) this.label = "";
	
	this.fillColor = $('fillColor', N).text();
	this.strokeColor = $('strokeColor', N).text();
	this.textColor = $('textColor', N).text();
	this.strokeWidth = parseFloat(N.attr('strokeWidth'));
	
	this.fontDef = $('font', N).text();
	//Parse font
	var fontparts = this.fontDef.split('-');
	this.font = {
		face: fontparts[0],
		style: fontparts[1],
		size: parseFloat(fontparts[2])
	};
	
	//TODO: current everything is roundRect
};

function VUELiteLink(N, model) {
	this.ID = N.attr('ID');
	this.x = parseFloat(N.attr('x'));
	this.y = parseFloat(N.attr('y'));
	this.width = parseFloat(N.attr('width'));
	this.height = parseFloat(N.attr('height'));
	this.label = N.attr('label');
	this.arrowState = N.attr('arrowState');
	if (this.label == undefined) this.label = "";
	
	this.strokeColor = $('strokeColor', N).text();
	this.textColor = $('textColor', N).text();
	this.strokeWidth = parseFloat(N.attr('strokeWidth'));
	
	this.fontDef = $('font', N).text();
	//Parse font
	var fontparts = this.fontDef.split('-');
	this.font = {
		face: fontparts[0],
		style: fontparts[1],
		size: fontparts[2]
	};
	
	var pt = $('point1', N);
	this.point1 = {
		x: parseFloat(pt.attr('x')),
		y: parseFloat(pt.attr('y')),
		obj: model.IDMap[$('ID1', N).text()]
	};
	pt = $('point2', N);
	this.point2 = {
		x: parseFloat(pt.attr('x')),
		y: parseFloat(pt.attr('y')),
		obj: model.IDMap[$('ID2', N).text()]
	};

};

function VUELiteModel(xmlobj) {
	var t = this;
	$('#logpane').prepend('analysis data...<br/>');
	xmlobj = this.xmlobj = $(xmlobj);
	this.xmlnodes = $("child[xsi\\:type='node']",xmlobj);
	$('#logpane').prepend(this.xmlnodes.length.toString()+" Nodes found.<br/>");
	this.xmllinks = $("child[xsi\\:type='link']",xmlobj);
	$('#logpane').prepend(this.xmllinks.length.toString()+" Edges found.<br/>");
	
	//Make ID based mapping
	this.XmlIDMap = {};
	this.IDMapCount = 0;
	$("child",xmlobj).each(function(idx,val){
		val = $(val);
		t.XmlIDMap[val.attr('ID')] = val;
		t.IDMapCount ++;
	});
	$('#logpane').prepend(this.IDMapCount.toString()+" ID indexed.<br/>");
	
	//Get VUE graph total size
	this.xmin = this.ymin = 1e10;
	this.xmax = this.ymax = -1e10;
	$.each(this.XmlIDMap, function(key,val){
		t.xmin = Math.min(t.xmin,parseFloat(val.attr('x')));
		t.ymin = Math.min(t.ymin,parseFloat(val.attr('y')));
		t.xmax = Math.max(t.xmax,parseFloat(val.attr('x')+parseFloat(val.attr('width'))));
		t.ymax = Math.max(t.ymax,parseFloat(val.attr('y')+parseFloat(val.attr('height'))));
	});
	this.xmin = Math.floor(this.xmin - 10);
	this.ymin = Math.floor(this.ymin - 10);
	this.xmax = Math.ceil(this.xmax + 10);
	this.ymax = Math.ceil(this.ymax + 10);
	this.width = this.xmax - this.xmin + 1;
	this.height = this.ymax - this.ymin + 1;
	$('#logpane').prepend('Draw area: ('+this.xmin.toString()+','+this.ymin.toString()+') - ('+this.xmax.toString()+','+this.ymax.toString()+')<br/>');
	
	//Make clean representation of nodes
	
	this.IDMap = {};
	this.nodes = [];
	$.each(this.xmlnodes, function(id,val) {
		var node = new VUELiteNode($(val));
		t.nodes.push(node);
		t.IDMap[node.ID] = node;
	});
	this.links = [];
	$.each(this.xmllinks, function(id, val){
		var link = new VUELiteLink($(val),t);
		t.links.push(link);
		t.IDMap[link.ID] = link;
	});
	
	//Analysis user origin/zoom
	this.userZoom = parseFloat($('userZoom', xmlobj).text());
	var origin = $('userOrigin', xmlobj);
	this.userOrigin = {
		x: parseFloat(origin.attr('x')),
		y: parseFloat(origin.attr('y'))		
	};
	
	$('#logpane').prepend('Model construction completed.<br/>');
};

