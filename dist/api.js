/*(function(href){

  for(var i = 0; i < document.styleSheets.length; i++){
    if(document.styleSheets[i].href == href){
      return;
    }
  }
  var head  = document.getElementsByTagName('head')[0];
  var link  = document.createElement('link');
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = href;
  head.appendChild(link);
})("http://.../widget/css/xm-widget.css");*/

(function () {
  "use strict";

  function getSize(size) {
    return ["980-90", "728-90", "720-300", "300-250", "250-250", "300-600", "240-400", "160-600"].indexOf(size) == -1 ? "720-300": size;
  }

  function getBgColor(color) {
    return ["white", "gray"].indexOf(color) == -1 ? "white": color;
  }

  function getLanguage(lang) {
    return ["en", "uk", "ru"].indexOf(lang) == -1 ? "en": lang;
  }

  function createQuery(options){
    return ["?lg=", getLanguage(options.language), "&bg=", getBgColor(options.background), "&s=", getSize(options.size), "&lt=", options.lt].join("");
  }

  function initWidgetBlood(placeholder, options){
    var iframe = document.createElement("iframe"),
      wSize = getSize(options.size),
      wSizeArr = wSize.split("-")
    ;

    //iframe.id = 'xm-widget-blood-iframe';
    iframe.width = wSizeArr[0];
    iframe.height = wSizeArr[1];
    iframe.scrolling = "no";
    iframe.style.border = "none";
    iframe.src = 'https://kmck-xm.icthh.com/widget/blood/index.html' + createQuery(options);
    placeholder.innerHTML = "";
    placeholder.appendChild(iframe);
  }

  function initWidgetAeChargeMap(placeholder, options){
    var iframe = document.createElement("iframe");
    if(options.size){
       var wSize = options.size,
        wSizeArr = wSize.split("-")
    ;
      iframe.width = wSizeArr[0];
      iframe.height = wSizeArr[1];
    }
    else{
      iframe.width = '100%';
      iframe.height = '100%';
    }
    iframe.scrolling = "no";
    iframe.style.border = "none";
    iframe.src = 'http://127.0.0.1:8080';
    placeholder.innerHTML = "";
    //console.log(options);
    placeholder.appendChild(iframe);
  }

  window.XM || (window.XM = {});

  XM.Widgets = {
    init: function (id, options, mode) {
      options || (options = {});
      var placeholder = document.getElementById(id);
      if (!placeholder) return;

      switch (mode) {
        case 1:
          initWidgetBlood(placeholder, options);
          break;
        case 2:
          initWidgetAeChargeMap(placeholder, options);
          break;
      }
    }
  };

  if (typeof window.xmWidgetInit === "function") {
    window.xmWidgetInit();
  }

})();
