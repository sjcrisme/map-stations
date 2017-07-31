// console.log("hello webpack ++");
import _ from 'lodash';
//import css from './css/app.css';

let a  = 'a';
console.log('Hello webpack 2', _.isEqual(2,2));


function request(obj) {
    var xhr = new XMLHttpRequest();
    xhr.open(obj.method || "GET", obj.url);
    if (obj.headers) {
        Object.keys(obj.headers).forEach(function(key) {
            xhr.setRequestHeader(key, obj.headers[key]);
        });
    }
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          // console.log(xhr.response);
        } else {
            console.log(xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.log(xhr.statusText);
    };
    xhr.send(obj.body);
    return xhr;
}


const makeRequest = async () => {
 console.log(await request({
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
  }))
 return "done"
}


makeRequest().then((result) => {
	console.log("then");
	console.log(result);
});