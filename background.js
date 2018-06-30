var counter=0;
function saveImg(s){
var xhr = new XMLHttpRequest();

var url = s;

xhr.responseType = 'arraybuffer'; //Set the response type to arraybuffer so xhr.response returns ArrayBuffer
xhr.open('GET', url , true);

xhr.onreadystatechange = function () {
    if (xhr.readyState == xhr.DONE) {
        //When request is done
        //xhr.response will be an ArrayBuffer
        var file = new Blob([xhr.response], {type:'image/jpeg'});
        saveAs(file, counter + '.jpeg');
    }
};

xhr.send(); //
}

(function() {
    const tabStorage = {};
    const networkFilters = {
        urls: [
            "*://*.google.com/*"
        ]
    };

    chrome.webRequest.onBeforeRequest.addListener((details) => {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId)) {
            return;
        }

        tabStorage[tabId].requests[requestId] = {
            requestId: requestId,
            url: details.url,
            startTime: details.timeStamp,
            status: 'pending'
        };
        console.log(tabStorage[tabId].requests[requestId]);
    }, networkFilters);

    chrome.webRequest.onCompleted.addListener((details) => {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
            return;
        }

        const request = tabStorage[tabId].requests[requestId];

        Object.assign(request, {
            endTime: details.timeStamp,
            requestDuration: details.timeStamp - request.startTime,
            status: 'complete'
        });
		
        console.log(tabStorage[tabId].requests[details.requestId]);
		
		console.log(request.url)
		var u = request.url
		if (u.includes("viewerng/img")){
			//var file = new Blob(request.body, {type: "image/jpeg;charset=utf-8"});
			//FileSaver.saveAs(file);
			saveImg(u);
			//var file = new Blob([request.response], {type:'image/jpeg'});
			//saveAs(file, 'image.jpeg');
		
		}
    }, networkFilters);

    chrome.webRequest.onErrorOccurred.addListener((details)=> {
        const { tabId, requestId } = details;
        if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
            return;
        }

        const request = tabStorage[tabId].requests[requestId];
        Object.assign(request, {
            endTime: details.timeStamp,           
            status: 'error',
        });
        console.log(tabStorage[tabId].requests[requestId]);
    }, networkFilters);

    chrome.tabs.onActivated.addListener((tab) => {
        const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
        if (!tabStorage.hasOwnProperty(tabId)) {
            tabStorage[tabId] = {
                id: tabId,
                requests: {},
                registerTime: new Date().getTime()
            };
        }
    });
    chrome.tabs.onRemoved.addListener((tab) => {
        const tabId = tab.tabId;
        if (!tabStorage.hasOwnProperty(tabId)) {
            return;
        }
        tabStorage[tabId] = null;
    });
}());
/*
inject = document.createElement('script');
inject.src = "https://cdn.rawgit.com/eligrey/FileSaver.js/5ed507ef8aa53d8ecfea96d96bc7214cd2476fd2/FileSaver.min.js";
document.getElementsByTagName('head')[0].appendChild(inject);
*/