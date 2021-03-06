/* VUE Render cooperates with raphael library
 * Give VUELiteModel, draw things on SVG canvas
 */

function GetFont(paper,fontobj) {
	return paper.getFont(fontobj.face);
}
function VUERender(model, tag) {
	var paper = Raphael(tag, model.width+1000, model.height+1000);
	
	//Draw roundrect on place
	$.each(model.nodes, function(idx,val){
		//Draw outline
		var rect = paper.rect(val.x-model.xmin,val.y-model.ymin,val.width,val.height,10);
		rect.attr({
			fill: val.fillColor,
			stroke: val.strokeColor,
			"stroke-width": val.strokeWidth
		});
		//Draw text
		var text = paper.text(val.x-model.xmin+val.width/2,val.y-model.ymin+val.height/2,val.label);
		$('#logpane').prepend(val.label+'<br/>');
		text.attr({
			fill: val.textColor,
			"font-family": val.font.face,
			"font-size": val.font.size
		});
	});
	
	//Draw lines on place
	$.each(model.links, function(idx,val){
		//Draw line
		var line = paper.path(
		"M"+(val.point1.x-model.xmin).toString()+","+(val.point1.y-model.ymin).toString()+"L"+
			(val.point2.x-model.xmin).toString()+","+(val.point2.y-model.ymin).toString());
		line.attr({
			stroke:val.strokeColor,
			"stroke-width":val.strokeWidth});
		//Draw text
		if (val.label != "") {
			var text = paper.text(val.x - model.xmin + val.width / 2, val.y - model.ymin + val.height / 2, val.label);
			$('#logpane').prepend(val.label + '<br/>');
			text.attr({
				fill: val.textColor,
				"font-family": val.font.face,
				"font-size": val.font.size
			});
		}
	});
}


