 var monitor = document.querySelector('#monitor');

 var ext = document.querySelector('#ext');
 var det = document.querySelector('#det');

 var remoteUrl = "https://illegible.us:9080";
 var localUrl = "localhost:9080";
 var imagepath = "images/"
 var url = remoteUrl;
 var useSecure = true;
 if (window.location.hostname === "localhost") {
     url = localUrl;
     useSecure = false;
     imagepath = "../oversee/images/";
 }
 var socket = io(url, {
     secure: useSecure
 });
 console.log(socket);

 //var socket = io('138.197.195.36:9080');
 socket.on('message', function (data) {
     var art = document.createElement('article');
     if (typeof data === "string") {
         art.textContent = data;
     } else {
         art.textContent = JSON.stringify(data);
         art.style.whiteSpace = "pre";
     }
     monitor.appendChild(art);
     if (monitor.querySelectorAll('article').length > 200) {
         monitor.removeChild(document.querySelector('article'));
     }
     monitor.scrollTop = monitor.scrollHeight;
 });

 socket.on('url', function (data) {
     console.log(data);
     var title, target, img;
     ext.textContent = "";

     if (data.title) {
         title = data.title;
         var titleDiv = document.createElement('div');
         titleDiv.classList.add('imgtitle');
         titleDiv.textContent = title;
         ext.appendChild(titleDiv);
     }
     img = document.createElement('img');
     img.classList.add('webshot');

     ext.appendChild(img);
     img.style.display = "block";
     target = imagepath + data.url + '.jpg';
     console.log(target);
     img.src = target + "?" + new Date().getTime(); 
     img.alt = target + title;
     img.load

 });


 socket.on('txt', function (data) {
     ext.textContent = data;
 });

 socket.on('detail', function (data) {
     //console.log(data);
     var art = document.createElement('article');
     if (typeof data === "string") {
         art.textContent = data;
     } else {
         art.textContent = JSON.stringify(data);
         art.style.whiteSpace = "pre";
     }
     det.appendChild(art);
     if (det.querySelectorAll('article').length > 20) {
         det.removeChild(det.firstChild);
     }
     det.scrollTop = det.scrollHeight;
 });

 socket.on('progress', function (data) {
     //console.log(data);
     var target = document.querySelector("#" + data.id);
     if (!target) {
         var art = document.createElement("article");
         var tit = document.createElement("label");
         tit.textContent = data.id + " download %";
         tit.setAttribute("for", data.id)
         var prog = document.createElement("progress");
         prog.setAttribute("id", data.id);
         prog.setAttribute("max", 100);
         prog.setAttribute("value", 0);
         art.appendChild(tit);
         art.appendChild(prog);
         monitor.appendChild(art);
         target = document.querySelector("#" + data.id);
     }
     target.value = data.pct;
     monitor.scrollTop = monitor.scrollHeight;



 });


 socket.once('connect', function () {
     document.querySelector('html').classList.add("wait");
 });

 socket.on('disconnect', function () {
     document.querySelector('html').classList.remove("wait");
 });


 Hearing.prototype.draw = function () {
     var hearSecs = document.querySelectorAll('.hearing');
     for (var i = 0; i < hearSecs.length; i++) {
         if (hearSecs[i].dataset.shortdate === hearSecs) {
             //it already exists, but might need to be updated?
         } else {
             var sec = document.createElement('section');
             sec.classList.add('hearing');
             sec.dataset.shortdate = this.shortdate;
             var title = document.createElement('h1');
             title.textContent = this.title;
             sec.appendChild(title);
             document.body.appendChild(sec);
         }
     }

 };

 var intel = new Committee({
     committee: "Intelligence",
     chamber: "senate",
     url: "http://www.intelligence.senate.gov",
     hearingIndex: "http://www.intelligence.senate.gov/hearings/open",
     shortname: "intel"
 });

 socket.on('hearing', function (hearing) {
     var hear = intel.addHearing(hearing);
     hear.draw();
 });