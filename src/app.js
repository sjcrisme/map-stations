// chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
//chromium-browser --disable-web-security --user-data-dir

var resources = [];
var markers  = [];
var error_resources = [];
var markerCluster = {};
var accessToken;
var filters = [false,false,false];
var keyLoginUrl  = 'https://ecs-xm.icthh.com/cxf/xm-security-rs-api/v1/auth/login';
var resourcesUrl = 'https://ecs-xm.icthh.com/cxf/xm-search-rs-api/v1/search';

var loginJson = {"credentials": {
		             "user": "forwidget",
		             "password": "forwidget" 
					}};
var resourceJson = {"entries":[{
  		         "key":{
  		            "entityType":{ "name":"RESOURCE_ENTITY" }
  		         },
  		         "value":"rd_r_type_code:PHYSICAL_ATOMIC_CP AND entity_state:AVAILABLE" 
  		      }],
  		   "pagination":{  
  		      "offset":0,
  		      "limit":1000
  		   }
    		};
var Ukraine = {lat: 48.87916715,lng: 32.84912109};
var iconBase = 'gmarkers/';
var icons = {
			fast: {
				icon: iconBase + 'orange.svg'
			},
			normal: {
				icon: iconBase + 'green.svg'
			},
			claster: {
				icon: iconBase + 'claster.png'
			}
		};

// var icons = {
// 	fast:{//#f98c34 orange  .   #0091ea; blue bizzy ; 43a047 green -free
// 		1:{free:"ic_c_01.png",buzy:"ic_c_01-1.png"},
// 		2:{free:"ic_c_01.png",buzy:"ic_c_01-1.png",fullbuzy:"ic_c_01-1.png"},
// 		3:{free:"ic_c_03.png",buzy:"ic_c_03-2.png",byzzyhalf:"ic_c_01-1.png",fullbuzy:"ic_c_03-2.png"}
// 	},
// 	normal:{ //free green
// 		1:{free:"ic_j_01.png",buzy:"ic_j_01-1.png"},
// 		2:{free:"ic_j_02.png",buzy:"ic_j_02-1.png",fullbuzy:"ic_j_02-2.png"},
// 		3:{free:"ic_j_03.png",buzy:"ic_j_03-1.png",byzzyhalf:"ic_j_03-2.png",fullbuzy:"ic_j_03-3.png"}
// }};

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
	  //var icon = !value.is_no_control ? (value.connectors + (value.is_fast ? 'f' : '') + '-' + count_green + 'a-' + count_red + 'o') : '0-g';
	  //var icon = slots.length + (is_fast ? 'f' : '') + '-' + slots.freeSlot + 'a-' + (slots.length - slots.freeSlot) + 'o';
  	//console.log(icon);
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

function isNormalCharges(obj) {
	if(obj.type == 'j-1772') {
			return true;
	}
	else{
			return false;
	}
}
function isFasterCharges(obj) {
	if(obj.type == 'CHAdeMO') {
			return true;
	}
	else{
			return false;
	}
}

function TypeResource(type,arrayOfreturns){
	if(type =='CHAdeMO')
		return arrayOfreturns[0];
	if(type == 'J1772')
		return arrayOfreturns[1];
};


function hasOwnProperties(target, path, value){
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
	allCenterText.innerHTML = 'All charges';
	allCenterUI.appendChild(allCenterText);


	// Set CSS for the control border
	var goCenterUI = document.createElement('div');
	goCenterUI.id = 'goCenterUI';
	goCenterUI.title = 'Click to to change for normal charges';
	controlDiv.appendChild(goCenterUI);
	// Set CSS for the control interior
	var goCenterText = document.createElement('div');
	goCenterText.id = 'goCenterText';
	goCenterText.className = (filters[1])? "mapFilterButtons active" : " mapFilterButtons ";
	goCenterText.innerHTML = 'Normal charges j-1772';
	goCenterUI.appendChild(goCenterText);

	// Set CSS for the setCenter control border
	var setCenterUI = document.createElement('div');
	setCenterUI.id = 'setCenterUI';
	setCenterUI.title = 'Click to change for fast charges';
	controlDiv.appendChild(setCenterUI);

	// Set CSS for the control interior
	var setCenterText = document.createElement('div');
	setCenterText.id = 'setCenterText';
	setCenterText.className = (filters[2])? "mapFilterButtons active" : " mapFilterButtons ";
	setCenterText.innerHTML = 'Fast charges CHAdeMO';
	setCenterUI.appendChild(setCenterText);

	allCenterUI.addEventListener('click', function() {

		//setActiveButton(this);
		filters = [true,false,false];
		resendRequest('all',filters);
	});

	goCenterUI.addEventListener('click', function() {
			//google.maps.event.trigger(map,'resize');
		////	console.log(resources.filter(isNormalCharges));
		//setActiveButton(this);
		filters = [false,true,false];
		resendRequest('normal',filters);
	});

	setCenterUI.addEventListener('click', function() {
	//		console.log(resources.filter(isFasterCharges));
		//setActiveButton(this);
		filters = [false,false ,true];
		resendRequest('fast',filters);
	});
}
function getCountFreeslots(array){
	var counter = 0;
	for(var i=0;i<array.length;i++){
		if(array[i].status == "Available"){
			counter++;
		}
	}
	return counter;
}

/**
 * resource obj convert to map model and validate
*/
function validatePreparedData(tempresursec){
	resources = [];
	for(var i=0;i<tempresursec.length;i++){

		if(hasOwnProperties(tempresursec[i],'source.cf.cf_group_cpAttributes.cf_char_gpsLatitude') &&
				hasOwnProperties(tempresursec[i],'source.cf.cf_group_cpAttributes.cf_char_gpsLongitude') && 
				hasOwnProperties(tempresursec[i],'source.cf.cf_group_cpAttributes.cf_char_stationType')){
					if(typeof tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_stationType == 'object' &&
					typeof tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_gpsLongitude == 'object' &&
					typeof tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_gpsLatitude == 'object' &&
					typeof tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_gpsLongitude[0] !== 'undefined' &&
					typeof tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_gpsLatitude[0]  !== 'undefined' &&
					typeof tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_stationType[0] !== 'undefined' && 
					typeof tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_telemetryInfo[0] !== 'undefined'){
						var slots = JSON.parse(tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_telemetryInfo[0]);
					resources.push({
						'id':tempresursec[i].entityId,
						'name':tempresursec[i].representationName,
						'address':(tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_address[0])?tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_address[0]:'',
						'type':tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_stationType[0],
						'lat':tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_gpsLatitude[0],
						'lng':tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_gpsLongitude[0],
						'count':(tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_slotsCount[0])?tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_slotsCount[0]:'',
						'slots':{ data: slots, freeSlot:getCountFreeslots(slots), length: slots.length }
					}); 
					}
					else{
						error_resources.push({'id':tempresursec[i].entityId,'obj':tempresursec[i].source});
					}
				}
	} //end for	
}

function mapDataInit(map,filters){
	var Symbol=function(id,width,height,fill){
		var s={ 
		heart:  {
					p:'M340.8,83C307,83,276,98.8,256,124.8c-20-26-51-41.8-84.8-41.8C112.1,83,64,131.3,64,190.7c0,27.9,10.6,54.4,29.9,74.6 L245.1,418l10.9,11l10.9-11l148.3-149.8c21-20.3,32.8-47.9,32.8-77.5C448,131.3,399.9,83,340.8,83L340.8,83z',
					v:'0 0 512 512'
				},
		gear:   {
					p:'M462,280.72v-49.44l-46.414-16.48c-3.903-15.098-9.922-29.343-17.675-42.447l0.063-0.064l21.168-44.473l-34.96-34.96 l-44.471,21.167l-0.064,0.064c-13.104-7.753-27.352-13.772-42.447-17.673L280.72,50h-49.44L214.8,96.415 c-15.096,3.9-29.343,9.919-42.447,17.675l-0.064-0.066l-44.473-21.167l-34.96,34.96l21.167,44.473l0.066,0.064 c-7.755,13.104-13.774,27.352-17.675,42.447L50,231.28v49.44l46.415,16.48c3.9,15.096,9.921,29.343,17.675,42.447l-0.066,0.064 l-21.167,44.471l34.96,34.96l44.473-21.168l0.064-0.063c13.104,7.753,27.352,13.771,42.447,17.675L231.28,462h49.44l16.48-46.414 c15.096-3.903,29.343-9.922,42.447-17.675l0.064,0.063l44.471,21.168l34.96-34.96l-21.168-44.471l-0.063-0.064 c7.753-13.104,13.771-27.352,17.675-42.447L462,280.72z M256,338.4c-45.509,0-82.4-36.892-82.4-82.4c0-45.509,36.891-82.4,82.4-82.4 c45.509,0,82.4,36.891,82.4,82.4C338.4,301.509,301.509,338.4,256,338.4z',
					v:'0 0 512 512'
				},
		vader:  {
					p:'M 454.5779,419.82295 328.03631,394.69439 282.01503,515.21933 210.30518,407.97233 92.539234,460.65437 117.66778,334.11278 -2.8571457,288.09151 104.38984,216.38165 51.707798,98.615703 178.2494,123.74425 224.27067,3.2193247 295.98052,110.46631 413.74648,57.784277 388.61793,184.32587 509.14286,230.34714 401.89587,302.057 z',
					v:'0 0 512 512'
				}
		}
		//<path id="arc1" fill="none" stroke="green" stroke-width="20" />
		return ('data:image/svg+xml;base64,'
		+window.btoa('<svg xmlns="http://www.w3.org/2000/svg" height="'+height+'" viewBox="0 0 512 512" width="'+width+'" ><g><path fill="'+fill+'" d="'+s[id].p+'" /></g></svg>'));
	}

	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map, resources,filters);
	centerControlDiv.index = 1;
	centerControlDiv.style['padding-top'] = '5px';
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);

	var infoWindow = new google.maps.InfoWindow();
	markers = resources.map(function(location) {
		var point =  new google.maps.Marker({
				position:{lat:location.lat,lng:location.lng},
				icon: getProperIcon(TypeResource(location.type,[true,false]),location.slots),
			//	icon: TypeResource(location.type,[icons.fast.icon, icons.normal.icon]),
				category:TypeResource(location.type,['fast','normal']),
				slots:location.slots
				// label:location.id
			});
			
		infoWindow = new google.maps.InfoWindow({
				content: '<div><b>' + location.name + '</b></div>' +
									'<p>' + location.address + '</p>' +
									'<p><b>тип станцii:</b> ' + TypeResource(location.type,['CHAdeMO','j1772']) + '</p>'+'<p>' + location.slots.data + '</p>'
		});
		point.addListener('click', function() {
				infoWindow.open(map, point);
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
	
	MarkerClusterer.prototype.AddCluster = function(clat, clng, csize)
	{
		console.log("My cluster function");
			this.setZoomOnClick(false);
			if (typeof this.aAddClusterIcons == "undefined"){
				this.aAddClusterIcons = [];
			}

			this.activeMap_ = this.getMap();
			var clusterlocation = new google.maps.LatLng(clat, clng)
			var CI = new ClusterIcon(new Cluster(this), this.getStyles, this.getGridSize());
			var index = 0;
			var dv = csize;
			while (dv !== 0) {
				dv = parseInt(dv / 10, 10);
				index++;
			}
			var style = this.styles_[index-1];
			$.extend(CI, {sums_ : {text : csize, index: index}, url_ : style['url'], width_ : style['width'], height_ : style['height'], anchorIcon_: [clat, clng]});
			CI.setCenter(clusterlocation);
			CI.setMap(this.activeMap_);
			CI.show();

			this.aAddClusterIcons.push(CI);
	}
		// Add a marker clusterer to manage the markers.
	markerCluster = new MarkerClusterer(map, markers,{styles: [{url: 'gmarkers/2.png', height: 40, width: 40, textSize: 12}]});
	//USGSOverlay.prototype = new google.maps.OverlayView();
/*	markerCluster = new MarkerClusterer(map, markers,{styles:[
																{ textColor:'yellow',textSize:'12',width:50,height:50,url:Symbol('vader',50,50,'red')},
																// {textColor:'dark',textSize:'12',width:50,height:50,url:Symbol('heart',75,75,'green')},
																// {textColor:'red',textSize:'12',width:50,height:50,url:Symbol('heart',90,90,'blue')},
																//{width:75,height:75,url:Symbol('gear',75,75,'green')},
																//{textColor:'tomato',textSize:'18',width:100,height:100,url:Symbol('vader',100,100,'blue')}
															]});
*/
	
	// MarkerClusterer.prototype.addMarker = function(clat, clng, csize)
	// {
	// 	console.log("My cluster function");
	// 		this.setZoomOnClick(false);
	// 		if (typeof this.aAddClusterIcons == "undefined"){
	// 			this.aAddClusterIcons = [];
	// 		}

	// 		this.activeMap_ = this.getMap();
	// 		var clusterlocation = new google.maps.LatLng(clat, clng)
	// 		var CI = new ClusterIcon(new Cluster(this), this.getStyles, this.getGridSize());
	// 		var index = 0;
	// 		var dv = csize;
	// 		while (dv !== 0) {
	// 			dv = parseInt(dv / 10, 10);
	// 			index++;
	// 		}
	// 		var style = this.styles_[index-1];
	// 		$.extend(CI, {sums_ : {text : csize, index: index}, url_ : style['url'], width_ : style['width'], height_ : style['height'], anchorIcon_: [clat, clng]});
	// 		CI.setCenter(clusterlocation);
	// 		CI.setMap(this.activeMap_);
	// 		CI.show();

	// 		this.aAddClusterIcons.push(CI);
	// }
	// MarkerClusterer.prototype.RemoveClusters = function(clat, clng, csize)
	// {
	// 		if (typeof this.aAddClusterIcons == "undefined"){
	// 			this.aAddClusterIcons = [];
	// 		}

	// 		$.each(this.aAddClusterIcons, function(iIndex, oObj){
	// 			oObj.onRemove();
	// 		});
	// 		this.aAddClusterIcons = [];
	// }

}

function resendRequest(search,filters){
	error_resources =[];

	var map = new google.maps.Map(document.getElementById('map'), {zoom: 7, center: Ukraine, disableDefaultUI: true});
	if(search == 'all'){
		
		request({
					url:resourcesUrl,
					method:"POST",
					headers:{'Content-Type':'application/json',
						  		 'Access-Control-Allow-Origin':'*',
						  		 'XM-CLIENT-ACCESSTOKEN':accessToken,
						  		},
						  	body:JSON.stringify(resourceJson)
				},
				function(result){
					var tempresursec = JSON.parse(result).entities;
					validatePreparedData(tempresursec);
					mapDataInit(map,filters);
					console.log(error_resources);
				},
				function(error){
					console.log(error);
				});

	}else{
		var filterstation;
		if(search == 'normal'){
		 	filterstation = 'J1772';
		}
		else{
			filterstation = 'CHAdeMO';
		}
		
		var filterJsone = {  
					"entries":[  
							{  
								"key":{  
										"entityType":{  
											"name":"RESOURCE_ENTITY" 
										}
								},
								"value":"rd_r_type_code:PHYSICAL_ATOMIC_CP AND entity_state:AVAILABLE AND cf.cf_group_cpAttributes.cf_char_stationType:"+filterstation 
							}
					],
					"pagination":{  
							"offset":0,
							"limit":1000
					}
		};
		request({
							url:resourcesUrl,
							method:"POST",
							headers:{'Content-Type':'application/json',
											'Access-Control-Allow-Origin':'*',
											'XM-CLIENT-ACCESSTOKEN':accessToken,
											},
										body:JSON.stringify(filterJsone)
						},function(rerequest){

								var tempresursec = JSON.parse(rerequest).entities;
								validatePreparedData(tempresursec);
								mapDataInit(map,filters);
								console.log(resources);
						},function(error){
							console.log(error);
						});
	}
}

function initMap() {

	var map = new google.maps.Map(document.getElementById('map'), {zoom: 7, center: Ukraine, disableDefaultUI: true});
	request({
			url:keyLoginUrl,
			method:"POST",
			headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'},
			body:JSON.stringify(loginJson)
			},function(data){
				accessToken = JSON.parse(data).accessToken;
				request({
					url:resourcesUrl,
					method:"POST",
					headers:{'Content-Type':'application/json',
						  		 'Access-Control-Allow-Origin':'*',
						  		 'XM-CLIENT-ACCESSTOKEN':JSON.parse(data).accessToken,
						  		},
						  	body:JSON.stringify(resourceJson)
				},
				function(result){
					
					var tempresursec = JSON.parse(result).entities;
					validatePreparedData(tempresursec);
					mapDataInit(map,filters);
					console.log(error_resources);
				},
				function(error){
					console.log(error);
				});
				
				//console.log(JSON.parse(data).accessToken);
			},function(error){
				console.log(error);
			});
}
window.initMap = initMap;
//https://stackoverflow.com/questions/39197080/google-maps-markercluster-api-how-to-get-clusters-outside-of-screens-view

//https://stackoverflow.com/questions/8297456/google-maps-v3-clustering-with-custom-markers
//https://stackoverflow.com/questions/4811042/manually-draw-a-cluster-with-markerclusterer-for-maps-v3