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


// makeRequest().then((result) => {
// 	console.log("then");
// });


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
		            "entityType":{  
		               "name":"RESOURCE_ENTITY" 
		            }
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
		// return JSON.parse(data).entities;

	}).catch(function(err){
		console.error('Augh, there was an error with getting resourcess!', err.statusText);
	});


})
.catch(function (err) {
  console.error('Augh, there was an error with getting accessToken!', err.statusText);
});