// chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
//chromium-browser --disable-web-security --user-data-dir
(function(){
    "use strict";

var resources = [];
var markers  = [];
var error_resources = [];

var filters = [false,false,false];
var UrlResources = "https://ecs-xm.test.icthh.com/cxf/xm-widgets-api/v0.1/widgets/AeChargePointWidget/content-records";
var JSONLANG = JSON.parse(document.getElementById('LangJson').innerHTML);
var LANG = (window.frameElement)? window.frameElement.lang : "uk"; 
var foundlang = false;
for(var i=0;i<JSONLANG.length;i++){
		if(JSONLANG[i].lang ==LANG){
			foundlang = true;
		}
}
if(!foundlang){
	console.log("%c [warning] this widget don't have that lang:" + LANG,"color:#FF6A00");
	LANG='uk';
}

var thisPopup;
var Ukraine = {lat: 48.87916715,lng: 32.84912109};
var kiev    = {lat:50.431782, lng:30.516382};
var iconBase = 'gmarkers/';

function getProperIcon(is_fast,slots){
	
	var count_green = 0;
	var count_red = 0;
	var namefile  = "";
	
	if(is_fast){
		namefile = "ic_c_";
	}
	else{
		namefile = "ic_j_";
	}
	var buzzy_slots = slots.length - slots.freeSlot;
	var temp_string = (buzzy_slots)? "-"+buzzy_slots : '';
	var icon = namefile + "0"+ slots.length + temp_string + '.png';
	return "gmarkers/"+icon;
}

function request(obj,done,error) {
    var xhr = new XMLHttpRequest();

	xhr.open(obj.method || "GET", obj.url);
	if (obj.headers) {
		Object.keys(obj.headers).forEach(function(key) {
			xhr.setRequestHeader(key, obj.headers[key]);
		});
	}
	//xhr.onload = _ => JSON.parse(xhr.response);
	xhr.onload = function() {
		if (xhr.status >= 200 && xhr.status < 300) {
			done(xhr.response);
		} else {
			error(xhr.statusText);
		}
	};
	xhr.onerror = function() {
		error(xhr.statusText);
	};
	xhr.send(obj.body);
}

function TypeResource(type,arrayOfreturns) {
	if(type =='CHAdeMO' || type == 'TSL2')
		return arrayOfreturns[0];
	if(type == 'J1772')
		return arrayOfreturns[1];
};

function hasOwnProperties(target, path, value) {
	if (typeof target !== 'object' || target === null) { return false; }

	var parts = path.split('.');

	while(parts.length) {
		var property = parts.shift();
		if (!(target.hasOwnProperty(property))) {
			return false;
		}
		target = target[property];
	}

	if(value){
		return target === value;
	}else{
		return true;
	}
}

function CetLegengs(controlDiv, map){
	var control = this;
	var element = document.getElementById('ico-map');
	
	var table = element.innerHTML;
	for(var i=0;i<JSONLANG.length;i++){
		if(JSONLANG[i].lang ==LANG){
			table = table.replace("{CAR}", JSONLANG[i].content.langing.CAR);
			table =table.replace("{FAST_CHARGE}", JSONLANG[i].content.langing.FAST_CHARGE);
			table =table.replace("{NORMAL_CHARGE}", JSONLANG[i].content.langing.NORMAL_CHARGE);
			table =table.replace("{CLUSTER_OF_CHARGE}", JSONLANG[i].content.langing.CLUSTER_OF_CHARGE);
		}
	}

	controlDiv.style.clear = 'both';
	var legendsUI = document.createElement('div');
	legendsUI.id = 'legendsUI';
	legendsUI.title = 'Legend of map';
	controlDiv.appendChild(legendsUI);
	// Set CSS for the control interior

	var legendText = document.createElement('div');
	legendText.id = 'allCenterText';
	legendText.className = " mapLegends ";
	legendText.innerHTML = table ;
	/*
	*/
	legendsUI.appendChild(legendText);
}

function CenterControl(controlDiv, map, resources,filters) {
	var control = this;
	controlDiv.style.clear = 'both';

	var allCenterUI = document.createElement('div');
	allCenterUI.id = 'allCenterUI';
	allCenterUI.title = 'Click to show all charges';
	controlDiv.appendChild(allCenterUI);
	// Set CSS for the control interior
	var allCenterText = document.createElement('div');
	allCenterText.id = 'allCenterText';
	allCenterText.className = (filters[0])? "mapFilterButtons active" : " mapFilterButtons ";

	for(var i=0;i<JSONLANG.length;i++){
			if(JSONLANG[i].lang == LANG){
				allCenterText.innerHTML = JSONLANG[i].content.filter.ALL;
			}
	}
	allCenterUI.appendChild(allCenterText);


	// Set CSS for the control border
	var goCenterUI = document.createElement('div');
	goCenterUI.id = 'goCenterUI';
	goCenterUI.title = 'Click to to change for normal charges J1772';
	controlDiv.appendChild(goCenterUI);
	// Set CSS for the control interior
	var goCenterText = document.createElement('div');
	goCenterText.id = 'goCenterText';
	goCenterText.className = (filters[1])? "mapFilterButtons active" : " mapFilterButtons ";
	goCenterText.innerHTML = 'J1772';
	goCenterUI.appendChild(goCenterText);

	// Set CSS for the setCenter control border
	var setCenterUI = document.createElement('div');
	setCenterUI.id = 'setCenterUI';
	setCenterUI.title = 'Click to change for fast charges CHAdeMO';
	controlDiv.appendChild(setCenterUI);

	// Set CSS for the control interior
	var setCenterText = document.createElement('div');
	setCenterText.id = 'setCenterText';
	setCenterText.className = (filters[2])? "mapFilterButtons active" : " mapFilterButtons ";
	setCenterText.innerHTML = 'CHAdeMO';
	setCenterUI.appendChild(setCenterText);

	// Set CSS for the control interior

	allCenterUI.addEventListener('click', function() {
		filters = [true,false,false];
		resendRequest('all',filters);
	});

	goCenterUI.addEventListener('click', function() {
		filters = [false,true,false];
		resendRequest('normal',filters);
	});

	setCenterUI.addEventListener('click', function() {
		filters = [false,false ,true];
		resendRequest('fast',filters);
	});
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
							'Error: The Geolocation service failed.' :
							'Error: Your browser doesn\'t support geolocation.');
}

function mapDataInit(map,filters){

	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map, resources,filters);
	centerControlDiv.index = 1;
	centerControlDiv.style['padding-top'] = '5px';
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);

	//CetLegengs
	var legendControlDiv = document.createElement('div');
	var legendsControl = new CetLegengs(legendControlDiv, map);
	legendControlDiv.index = 1;
	legendControlDiv.style['padding-top'] = '5px';
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(legendControlDiv);

	var infowindow = new google.maps.InfoWindow();
	var activeInfoWindow = new google.maps.InfoWindow();

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
//console.log(typeof pos.lat);
//console.log(typeof pos.lng);
		map.setCenter(pos);
		map.setZoom(12);
		}, function() {
			handleLocationError(true, infowindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	markers = resources.map(function(location) {

		var icon = {
			url: getProperIcon(TypeResource(location.type,[true,false]),location.slots), // url
			scaledSize: new google.maps.Size(25, 35), // scaled size
			origin: new google.maps.Point(0,0), // origin
			anchor: new google.maps.Point(0, 0) // anchor
		};
		var point =  new google.maps.Marker({
				"position":{lat:location.lat,lng:location.lng},
				"icon": icon,
				"category":TypeResource(location.type,['fast','normal']),
				"slots":location.slots,
				"pointId":location.id
			});

		for(var i=0;i<JSONLANG.length;i++){
			if(JSONLANG[i].lang == LANG){
				var infowindow = new google.maps.InfoWindow({
						content:'<table class="'+TypeResource(location.type,['charge-fast-ico','charge-normal-ico'])+'"><tr><td colspan="2"><b>' + location.name + '</b> <div style="float:right;margin-bottom:0px;margin-left:15px;" ><b>N'+location.id+'</b></div></td></tr>'+
								'<tr><td width="24"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M8,18V13.5H6L10,6V11H12L8,18Z" /></svg></td><td class="left"><span>'+TypeResource(location.type,[JSONLANG[i].content.marker.M_FAST,JSONLANG[i].content.marker.M_NORMAL])+' ('+location.type+')</span></td></tr>'+
								'<tr><td valign="top" width="24"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" /></svg></td><td class="left"><span>' + location.address + '</span></td></tr>'+
						'</table>'
				});
			}
		}

		point.addListener('click', function() {
			
			infowindow.open(map, point);
			if(typeof thisPopup !='undefined'){
				if(this.pointId != thisPopup.pointId ){
					activeInfoWindow&&activeInfoWindow.close();
				}
			}
			thisPopup = this;
  			activeInfoWindow = infowindow;
		});
		
		return point;
	});

	 MarkerClusterer.prototype.setCalculator(function(markers, numStyles) {
            var count = 0;
			var buzy = 0;
            for (var i=0;i<markers.length;i++) {
                count += markers[i].slots.length;
				buzy += markers[i].slots.length - markers[i].slots.freeSlot;
            }

            return {
				buzy:buzy,
                text: count,
                index: 1
            };
        });
	// Add a marker clusterer to manage the markers.
	var markerCluster = new MarkerClusterer(map, markers,{styles: [{url: 'gmarkers/2.png', height: 40, width: 40, textSize: 12}]});

	
}

/**
 * resource obj convert to map model and validate
*/
function validateData(data){
	resources = [];
	for(var i=0;i<data.length;i++){

		if(hasOwnProperties(data[i],'values.type') && 
			hasOwnProperties(data[i],'values.lt') && hasOwnProperties(data[i],'values.lg') && 
			(typeof data[i].values.lt == 'number') && (typeof data[i].values.lg == 'number')){
			
			resources.push({
				'id':data[i].id,
				'name':data[i].values.name,
				'address':(data[i].values.address) ? data[i].values.address : '',
				'type':data[i].values.type,
				'lat':data[i].values.lt,
				'lng':data[i].values.lg,
				"freeSlots": data[i].values.freeSlots,
				'slots':{ "data": "slots", "freeSlot":data[i].values.freeSlots, "length": data[i].values.slots }
			});
		}
		else{
			error_resources.push({'id':data[i].id,'obj':data[i].values});
//			console.log({'id':data[i].id,'obj':data[i].values});
		}
	} //end for	
}
function getZoom(html){
	for(var i=0;i<JSONLANG.length;i++){
		if(JSONLANG[i].lang == LANG){
			html = html.replace('Zoom in',JSONLANG[i].content.zoom.ZOOM_IN);
			html = html.replace('Zoom out',JSONLANG[i].content.zoom.ZOOM_OUT);
		}
	}
	return html;
}

function addZoomTranslate(map){
	google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
		
		var elementZoom = document.getElementsByClassName('gmnoprint');
		if(typeof elementZoom[3].children == undefined){
			setTimeout(function() {
				 elementZoom[3].children[0].innerHTML= getZoom(elementZoom[3].children[0].innerHTML);
			}, 1000);
		}else{
			elementZoom[3].children[0].innerHTML = getZoom(elementZoom[3].children[0].innerHTML);
		}
    //this part runs when the mapobject is created and rendered
   /* google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        //this part runs when the mapobject shown for the first time
		console.log("1");
    });*/
	});
}

function resendRequest(search,filters,map){
	//error_resources =[];
	var filterstation = "{}";

	var map = new google.maps.Map(document.getElementById('map'), {zoom: 7, center: kiev, zoomControl: true,mapTypeControl: false, scrollwheel: false,language:"fr"});

	if (search == 'normal') {
		filterstation = '{"type" : "J1772"}';
	}
	else {
		filterstation = '{"type" : "CHAdeMO"}';
	}

	if(search == 'all'){
		filterstation = "{}";
	}

	request({
			url:UrlResources,
			method:"POST",
			headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'},
			body:filterstation
			},function(data){
				var resursec = JSON.parse(data);
				validateData(resursec);
				mapDataInit(map,filters);
				
				//addZoomTranslate(map);
				//console.log(JSON.parse(data));
			},
			function(error){
				console.log(error);
			});
}

function initMap() {
	filters = [true,false,false];
	var map = new google.maps.Map(document.getElementById('map'), {zoom: 7, center: kiev, zoomControl: true,mapTypeControl: false,scrollwheel: false });

	resendRequest('all',filters,map);
}

window.initMap = initMap;

})();