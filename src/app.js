// console.log("hello webpack ++");
import _ from 'lodash';
//import css from './css/app.css';

let a  = 'a';
console.log('Hello webpack 2', _.isEqual(2,2));


function request(obj,done) {
    var xhr = new XMLHttpRequest();

    xhr.open(obj.method || "GET", obj.url);
    if (obj.headers) {
        Object.keys(obj.headers).forEach(function(key) {
            xhr.setRequestHeader(key, obj.headers[key]);
        });
    }
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
           done(xhr.response);
        } else {
            console.log(xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.log(xhr.statusText);
    };
    xhr.send(obj.body);
}

//JSON.parse(data)

// const makeRequest = async () => {
//  console.log( await request({
//      url:"https://ecs-xm.icthh.com/cxf/xm-security-rs-api/v1/auth/login",
//      method:"POST",
//      headers:{
//          'Content-Type':'application/json',
//          'Access-Control-Allow-Origin':'*'
//     },
//      body:JSON.stringify({
//          "credentials": {
//              "user": "forwidget",
//              "password": "forwidget" 
//          }
//       })
//    },function(data){
//    	console.log(">>");
//    		console.log(data);
//    } ));
 
// }

/*
function print(data){
	//console.log(data);
//	 var myDiv = document.getElementById("resources");
	 //var myP = document.createElement("<p>");
	// myP.appendChild(document.createTextNode(data.representationName));
	 //myDiv.appendChild(document.createTextNode(data.representationName + ' '));

	 // document.getElementById('resources')
	 // .innerHTML = '<span >' + data.representationName +'</span><br>';
 var ul = document.getElementById("list");
    var li = document.createElement("li");
    var children = ul.children.length + 1
    li.setAttribute("id", "element"+data.entityId)
    li.appendChild(document.createTextNode(
    '('+ data.representationName +')  '+ data.source.cf.cf_group_cpAttributes.cf_char_address[0]));
    ul.appendChild(li);
}

function request(obj) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open(obj.method || "GET", obj.url);
    if (obj.headers) {
        Object.keys(obj.headers).forEach(function(key) {
            xhr.setRequestHeader(key, obj.headers[key]);
        });
    }
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

request({
     url:"https://ecs-xm.icthh.com/cxf/xm-security-rs-api/v1/auth/login",
     method:"POST",
     headers:{
         'Content-Type':'application/json',
         'Access-Control-Allow-Origin':'*'
    },
     body:JSON.stringify({
         "credentials": {
             "user": "forwidget",
             "password": "forwidget" 
         }
      })
})
.then(function (datums) {
  var accessToken = JSON.parse(datums).accessToken;

  request({
     url:"https://ecs-xm.icthh.com/cxf/xm-search-rs-api/v1/search",
     method:"POST",
     headers:{
     	 'XM-CLIENT-ACCESSTOKEN':accessToken,
         'Content-Type':'application/json',
         'Access-Control-Allow-Origin':'*'
    },
     body:JSON.stringify({  
		   "entries":[  
		      {  
		         "key":{  
		            "entityType":{"name":"RESOURCE_ENTITY"}
		         },
		         "value":"rd_r_type_code:PHYSICAL_ATOMIC_CP AND entity_state:AVAILABLE" 
		      }
		   ],
		   "pagination":{  
		      "offset":0,
		      "limit":1000
		   }
  		})
	}).then(function(data){
		console.log( JSON.parse(data).entities);
		_.map(JSON.parse(data).entities, print);
		// return JSON.parse(data).entities;

	}).catch(function(err){
		console.error('Augh, there was an error with getting resourcess!', err.statusText);
	});

})
.catch(function (err) {
  console.error('Augh, there was an error with getting accessToken!', err.statusText);
});
*/

// chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
//chromium-browser --disable-web-security --user-data-dir
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
        
        var markers = resources.map(function(location) {
          return new google.maps.Marker({
            position:{lat:location.lat,lng:location.lng},
            icon: iconOfTypeResource(location.type),
            label:location.id
          });
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: iconBase});
    });
}
window.initMap = initMap;