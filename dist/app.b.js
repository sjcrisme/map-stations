/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// import _ from 'lodash';
//import css from './css/app.css';

// let a  = 'a';
// console.log('Hello webpack 2', _.isEqual(2,2));

// chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
//chromium-browser --disable-web-security --user-data-dir
var keyLoginUrl = 'https://ecs-xm.icthh.com/cxf/xm-security-rs-api/v1/auth/login';
var resourcesUrl = 'https://ecs-xm.icthh.com/cxf/xm-search-rs-api/v1/search';

var loginJson = { "credentials": {
    "user": "forwidget",
    "password": "forwidget"
  } };
var resourceJson = {
  "entries": [{
    "key": {
      "entityType": { "name": "RESOURCE_ENTITY" }
    },
    "value": "rd_r_type_code:PHYSICAL_ATOMIC_CP AND entity_state:AVAILABLE"
  }],
  "pagination": {
    "offset": 0,
    "limit": 1000
  }
};

function oldxhr(obj) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open(obj.method || "GET", obj.url);
    if (obj.headers) {
      Object.keys(obj.headers).forEach(function (key) {
        xhr.setRequestHeader(key, obj.headers[key]);
      });
    }
    //xhr.onload = _ => JSON.parse(xhr.response);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = function () {
      reject(xhr.statusText);
    };

    xhr.send(obj.body);
  });
}

var makeAsyncRequest = async function makeAsyncRequest() {
  try {
    var accessToken = void 0;
    var dataLogin = await oldxhr({
      url: keyLoginUrl,
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(loginJson)
    });
    accessToken = JSON.parse(dataLogin).accessToken;

    var dataResources = await oldxhr({
      url: resourcesUrl,
      method: "POST",
      headers: { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'XM-CLIENT-ACCESSTOKEN': accessToken
      },
      body: JSON.stringify(resourceJson)
    });
    return JSON.parse(dataResources).entities;
  } catch (e) {
    console.log(e);
  }
};

function initMap() {
  makeAsyncRequest().then(function (data) {
    //    	console.log(data);
    var resources = [];
    var error_resources = [];
    var markers = [];

    //var Ukraine = {lat: 50.47149085,lng: 30.54199219};
    var Ukraine = { lat: 48.87916715, lng: 32.84912109 };
    var Kiev = { lat: 50.45619254, lng: 30.52310944 };

    var iconOfTypeResource = function iconOfTypeResource(type) {
      if (type == 'CHAdeMO') return icons.fast.icon;
      if (type == 'j-1772') return icons.normal.icon;
    };
    var textTypeResource = function textTypeResource(type) {
      if (type == 'CHAdeMO') return 'швидка';
      if (type == 'j-1772') return 'типова';
    };

    data.map(function (elm) {
      if (elm.source.cf.cf_group_cpAttributes.cf_char_gpsLatitude[0] !== undefined || elm.source.cf.cf_group_cpAttributes.cf_char_gpsLongitude[0] !== undefined) {
        resources.push({
          'id': elm.entityId,
          'name': elm.representationName,
          'address': elm.source.cf.cf_group_cpAttributes.cf_char_address[0],
          'type': elm.source.cf.cf_group_cpAttributes.cf_char_stationType[0],
          'lat': elm.source.cf.cf_group_cpAttributes.cf_char_gpsLatitude[0],
          'lng': elm.source.cf.cf_group_cpAttributes.cf_char_gpsLongitude[0],
          'count': elm.source.cf.cf_group_cpAttributes.cf_char_slotsCount[0]
        });
      } else {
        error_resources.push({
          'id': elm.entityId,
          'name': elm.representationName,
          'address': elm.source.cf.cf_group_cpAttributes.cf_char_address[0]
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

    var markers = resources.map(function (location) {
      var point = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        icon: iconOfTypeResource(location.type)
        // label:location.id
      });
      var infowindow = new google.maps.InfoWindow({
        content: '<div><b>' + location.name + '</b></div>' + '<p>' + location.address + '</p>' + '<p><b>тип станцii:</b> ' + textTypeResource(location.type) + '</p>'
      });
      point.addListener('click', function () {
        infowindow.open(map, point);
      });

      return point;
    });

    // Add a marker clusterer to manage the markers.
    var markerCluster = new MarkerClusterer(map, markers, { imagePath: iconBase });
  });
}
window.initMap = initMap;

/***/ })
/******/ ]);