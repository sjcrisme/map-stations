// import _ from 'lodash';
//import css from './css/app.css';

// let a  = 'a';
// console.log('Hello webpack 2', _.isEqual(2,2));

// chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
//chromium-browser --disable-web-security --user-data-dir
/*
const keyLoginUrl  = 'https://ecs-xm.icthh.com/cxf/xm-security-rs-api/v1/auth/login';
const resourcesUrl = 'https://ecs-xm.icthh.com/cxf/xm-search-rs-api/v1/search';

const loginJson = {"credentials": {
		             "user": "forwidget",
		             "password": "forwidget" 
					}};
const resourceJson = {  
  		   "entries":[  
  		      {
  		         "key":{
  		            "entityType":{ "name":"RESOURCE_ENTITY" }
  		         },
  		         "value":"rd_r_type_code:PHYSICAL_ATOMIC_CP AND entity_state:AVAILABLE" 
  		      }
  		   ],
  		   "pagination":{  
  		      "offset":0,
  		      "limit":1000
  		   }
    		};

 function oldxhr(obj) {
 	return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    	xhr.open(obj.method || "GET", obj.url);
    	if (obj.headers) {
	        Object.keys(obj.headers).forEach(function(key) {
	            xhr.setRequestHeader(key, obj.headers[key]);
	        });
    	}
		//xhr.onload = _ => JSON.parse(xhr.response);
		xhr.onload = function() {
	        if (xhr.status >= 200 && xhr.status < 300) {
	           resolve(xhr.response);
	        } else {
	            reject(xhr.statusText);
	        }
	    };
	    xhr.onerror = function() {
	        reject(xhr.statusText);
	    };
    
		xhr.send(obj.body);
	})
}


const makeAsyncRequest  = async () => {
 	try{
 		let accessToken;
 		let dataLogin = await oldxhr({
						  	url:keyLoginUrl,
						  	method:"POST",
						  	headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'},
						  	body:JSON.stringify(loginJson)
						  });
 		accessToken = JSON.parse(dataLogin).accessToken;

 		let dataResources = await oldxhr({
						  	url:resourcesUrl,
						  	method:"POST",
						  	headers:{'Content-Type':'application/json',
						  			 'Access-Control-Allow-Origin':'*',
						  			 'XM-CLIENT-ACCESSTOKEN':accessToken,
						  			},
						  	body:JSON.stringify(resourceJson)
						  });
 		return JSON.parse(dataResources).entities;
 	}
 	catch(e){
 		console.log(e);
 	}
 }

function initMap() {
    makeAsyncRequest().then(function(data){ 
//    	console.log(data);
    	var resources =[];
    	var error_resources=[];
    	var markers =[];

		//var Ukraine = {lat: 50.47149085,lng: 30.54199219};
    	var Ukraine = {lat: 48.87916715,lng: 32.84912109};
        var Kiev = {lat:50.45619254,lng:30.52310944};

        const iconOfTypeResource = function(type){
        	if(type =='CHAdeMO')
        		return icons.fast.icon;
        	if(type == 'j-1772')
        		return icons.normal.icon;
        };
        const textTypeResource = function(type){
        	if(type =='CHAdeMO')
        		return 'швидка';
        	if(type == 'j-1772')
        		return 'типова';
        };

    	data.map((elm) => {
    	 	if(elm.source.cf.cf_group_cpAttributes.cf_char_gpsLatitude[0]!==undefined ||
    	 	 	elm.source.cf.cf_group_cpAttributes.cf_char_gpsLongitude[0]!==undefined){
	    	 	  resources.push({
					'id':elm.entityId,
		    	 	'name':elm.representationName,
		    	 	'address':elm.source.cf.cf_group_cpAttributes.cf_char_address[0],
		    	 	'type':elm.source.cf.cf_group_cpAttributes.cf_char_stationType[0],
		    	 	'lat':elm.source.cf.cf_group_cpAttributes.cf_char_gpsLatitude[0],
		    	 	'lng':elm.source.cf.cf_group_cpAttributes.cf_char_gpsLongitude[0],
		    	 	'count':elm.source.cf.cf_group_cpAttributes.cf_char_slotsCount[0]
	    	      });
    	 	}
    	 	else{
    	 		error_resources.push({
    	 			'id':elm.entityId,
    	 			'name':elm.representationName,
    	 			'address':elm.source.cf.cf_group_cpAttributes.cf_char_address[0]
    	 		});
    	 	}
    	});
				console.log(error_resources);
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: Ukraine
        });

				var iconBase = 'http://127.0.0.1:8080/markers/';
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

        //  // Create markers.
        // resources.forEach(function(feature) {
        //   var marker = new google.maps.Marker({
        //     position: new google.maps.LatLng(feature.lat,feature.lng),
        //     icon: iconOfTypeResource(feature.type),
        //     map: map
        //   });
        // });  
        var infoWindow = new google.maps.InfoWindow();
        
        var markers = resources.map(function(location) {
          let point =  new google.maps.Marker({
	            position:{lat:location.lat,lng:location.lng},
	            icon: iconOfTypeResource(location.type)
	            // label:location.id
	          });
          let infowindow = new google.maps.InfoWindow({
    					content: '<div><b>' + location.name + '</b></div>' +
    										'<p>' + location.address + '</p>' +
    										'<p><b>тип станцii:</b> ' + textTypeResource(location.type) + '</p>'
  		  	});
          point.addListener('click', function() {
    					infowindow.open(map, point);
  				});

          return point;
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: iconBase});

    });
}*/
var resources = [];
var markers  = [];
var error_resources = [];
var markerCluster = {};
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
var filterJsone = {  
   "entries":[  
      {  
         "key":{  
            "entityType":{  
               "name":"RESOURCE_ENTITY" 
            }
         },
         "value":"rd_r_type_code:PHYSICAL_ATOMIC_CP AND entity_state:AVAILABLE AND cf.cf_group_cpAttributes.cf_char_stationType:{$filter}" 
      }
   ],
   "pagination":{  
      "offset":0,
      "limit":1000
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


function initMap() {
	console.log("Run");
	request({
			url:keyLoginUrl,
			method:"POST",
			headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'},
			body:JSON.stringify(loginJson)
			},function(data){

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
					var Ukraine = {lat: 48.87916715,lng: 32.84912109};
					//TypeResource(type,arrayOfreturns)

					var tempresursec = JSON.parse(result).entities;
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

					var map = new google.maps.Map(document.getElementById('map'), {zoom: 7, center: Ukraine, disableDefaultUI: true});

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
					// Create the DIV to hold the control and call the CenterControl()
					// constructor passing in this DIV.
					var centerControlDiv = document.createElement('div');
					var centerControl = new CenterControl(centerControlDiv, map, resources,result);
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

					function CenterControl(controlDiv, map, resources,result) {
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

            allCenterUI.addEventListener('click', function() {

								filterMarkers('all');
								 var elements = document.getElementsByClassName('mapFilterButtons');
								 for(var i=0;i<3;i++){
									 elements[i].className = "mapFilterButtons";
								 }
								 this.firstElementChild.className = "mapFilterButtons active";

            });

            goCenterUI.addEventListener('click', function() {
                // var currentCenter = control.getCenter();
                // map.setCenter(currentCenter);
								filterMarkers('normal');
								google.maps.event.trigger(map,'resize');
                console.log(resources.filter(isNormalCharges));
								//console.log(resources);
								var elements = document.getElementsByClassName('mapFilterButtons');
								 for(var i=0;i<3;i++){
									 elements[i].className = "mapFilterButtons";
								 }
								 this.firstElementChild.className= "mapFilterButtons active";

								 	// request({
									// 	url:resourcesUrl,
									// 	method:"POST",
									// 	headers:{'Content-Type':'application/json',
									// 					'Access-Control-Allow-Origin':'*',
									// 					'XM-CLIENT-ACCESSTOKEN':JSON.parse(data).accessToken,
									// 					},
									// 	body:JSON.stringify(resourceJson)
									// 	});
            });

            // Set up the click event listener for 'Set Center': Set the center of
            // the control to the current center of the map.
            setCenterUI.addEventListener('click', function() {
                // var newCenter = map.getCenter();
                // control.setCenter(newCenter);
								filterMarkers('fast');
                console.log(resources.filter(isFasterCharges));
								//console.log(resources);
								var elements = document.getElementsByClassName('mapFilterButtons');
								 for(var i=0;i<3;i++){
									 elements[i].className = "mapFilterButtons";
								 }
								 this.firstElementChild.className= "mapFilterButtons active";
            });
          }

					  // Add a marker clusterer to manage the markers.
        	markerCluster = new MarkerClusterer(map, markers,{imagePath: iconBase});

					console.log(error_resources);
				//	console.log(resources);
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