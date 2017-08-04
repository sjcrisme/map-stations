// chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
//chromium-browser --disable-web-security --user-data-dir

var resources = [];
var markers  = [];
var error_resources = [];
var markerCluster = {};
var accessToken;
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
var iconBase = 'markers/';
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
	if(type == 'j-1772')
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

function filterMarkers(category){
	
	for(var i=0;i< markers.length;i++){

		if(markers[i].category == category || category == 'all'){
			markers[i].setVisible(true);
		}
		else{
			markers[i].setVisible(false);
		}
	}
	// markerCluster.clearMarkers();
	// markerCluster.addMarkers(marker);
}

function CenterControl(controlDiv, map, resources) {
	var control = this;
	controlDiv.style.clear = 'both';

	var allCenterUI = document.createElement('div');
	allCenterUI.id = 'allCenterUI';
	allCenterUI.title = 'Click to show all charges';
	controlDiv.appendChild(allCenterUI);
	// Set CSS for the control interior
	var allCenterText = document.createElement('div');
	allCenterText.id = 'allCenterText';
	allCenterText.className = "mapFilterButtons";
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
	goCenterText.className = "mapFilterButtons";
	goCenterText.innerHTML = 'Normal charges';
	goCenterUI.appendChild(goCenterText);

	// Set CSS for the setCenter control border
	var setCenterUI = document.createElement('div');
	setCenterUI.id = 'setCenterUI';
	setCenterUI.title = 'Click to change for fast charges';
	controlDiv.appendChild(setCenterUI);

	// Set CSS for the control interior
	var setCenterText = document.createElement('div');
	setCenterText.id = 'setCenterText';
	setCenterText.className = "mapFilterButtons";
	setCenterText.innerHTML = 'Fast charges';
	setCenterUI.appendChild(setCenterText);

	allCenterUI.addEventListener('click', function(result) {

			filterMarkers('all');
				var elements = document.getElementsByClassName('mapFilterButtons');
				for(var i=0;i<3;i++){
					elements[i].className = "mapFilterButtons";
				}
				this.firstElementChild.className = "mapFilterButtons active";
				resendRequest('all');
	});

	goCenterUI.addEventListener('click', function() {
			filterMarkers('normal');
			//google.maps.event.trigger(map,'resize');
		////	console.log(resources.filter(isNormalCharges));
			resendRequest('normal');
	});

	setCenterUI.addEventListener('click', function(event) {
	//		filterMarkers('fast');
	//		console.log(resources.filter(isFasterCharges));
				resendRequest('fast');
	});
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
					typeof tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_stationType[0] !== 'undefined'){

					resources.push({
						'id':tempresursec[i].entityId,
						'name':tempresursec[i].representationName,
						'address':(tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_address[0])?tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_address[0]:'',
						'type':tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_stationType[0],
						'lat':tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_gpsLatitude[0],
						'lng':tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_gpsLongitude[0],
						'count':(tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_slotsCount[0])?tempresursec[i].source.cf.cf_group_cpAttributes.cf_char_slotsCount[0]:''
						}); 
					}
					else{
						error_resources.push({'id':tempresursec[i].entityId,'obj':tempresursec[i].source});
					}
				}
	} //end for	
}

function mapDataInit(map){

	var centerControlDiv = document.createElement('div');
	var centerControl = new CenterControl(centerControlDiv, map, resources);
	centerControlDiv.index = 1;
	centerControlDiv.style['padding-top'] = '5px';
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);

	var infoWindow = new google.maps.InfoWindow();

	markers = resources.map(function(location) {
		var point =  new google.maps.Marker({
				position:{lat:location.lat,lng:location.lng},
				icon: TypeResource(location.type,[icons.fast.icon, icons.normal.icon]),
				category:TypeResource(location.type,['fast','normal'])
				// label:location.id
			});
		var infowindow = new google.maps.InfoWindow({
				content: '<div><b>' + location.name + '</b></div>' +
									'<p>' + location.address + '</p>' +
									'<p><b>тип станцii:</b> ' + TypeResource(location.type,['fast','normal']) + '</p>'
		});
		point.addListener('click', function() {
				infowindow.open(map, point);
		});

		return point;
	});
		// Add a marker clusterer to manage the markers.
	markerCluster = new MarkerClusterer(map, markers,{imagePath: iconBase});
}

function resendRequest(search){
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
					mapDataInit(map);
					console.log(error_resources);
				},
				function(error){
					console.log(error);
				});

	}else{
		var filterstation;
		if(search == 'normal'){
		 	filterstation = 'j-1772';
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
								mapDataInit(map);
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
					mapDataInit(map);
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