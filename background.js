// ****************************************
const API_SERVER = "http://************" // It need to be changed

// 전역변수
let pageDataList = [];
let portFromCS;
let workerID = "";
let tabDataDict = {};       // key: tabId
let updateServerDataFlag = false;
const VERBOSITY = 'OUTPUT'; // DEBUG, OUTPUT, and so on.
let prevCpu = {};

// ****************************************
// 구조체 (Object)
function pageData() {
    this.workerID = workerID;
    this.version = "";
    this.backgroundTimeOrigin = 0;

    this.URL = "";
    this.referrer = "";
    
    this.tabId = 0;
    this.windowId = 0;

    this.outerHeight = 0;
    this.outerWidth = 0;
    this.documentOffsetHeight = 0; // 웹 페이지 전체 height
    this.documentClientHeight = 0; // 웹 페이지 전체 height

    this.navigationStart = 0;
    this.loadEventEnd = 0;
    this.loadTimeStamp = 0;
    
    this.scroll = new Array();
    this.click = new Array();
    this.visibilitychange = new Array();

    this.navigationTiming = new Object();

    this.resources =  new Array()

    this.stats = new Object();

    this.networkInformation = new Object();
    this.performanceMemory = new Object();
    this.navigationType = 0;

    this.batteryInformation = new Object();
    this.cpu = new Object();
    this.prevCpu = new Object();
    this.memory = new Object();
    this.geolocation = new Object();

    this.surveyDone = false;
    this.surveyValue = "";
    this.surveyProb = 0;
    this.surveyTime = 0;
    this.surveyIndex = 0;

    this.startTime = 0;
    this.endTime = 0;

    this.numTabs = 0;
}

// ****************************************
// 함수
function log(msg) {
    if (VERBOSITY == "DEBUG") {
        console.log(msg);
    }
}

function updatePageDataList(tabId) {
    if (tabId in tabDataDict && tabDataDict[tabId].URL != "") {
        // 객체에 있고, 쓰레기 값이 아닌 경우 리스트에 저장해준다
        tabDataDict[tabId].endTime = performance.now();
        pageDataList.push(tabDataDict[tabId]);
    }

    updateStorageData();
}

function generateNewPageData(tab) {
    tabDataDict[tab.id] = new pageData();
    try {
        tabDataDict[tab.id].tabId = tab.id;
        tabDataDict[tab.id].windowId = tab.windowId;
        tabDataDict[tab.id].numTabs = Object.keys(tabDataDict).length;
        tabDataDict[tab.id].startTime = performance.now();
        tabDataDict[tab.id].backgroundTimeOrigin = performance.timeOrigin;
    } catch {

    }
}

function handlePageChange(tab) {
    updatePageDataList(tab.id);
    generateNewPageData(tab);
}

function afterBackgroundConnection(m, sender) {
    tabDataDict[sender.tab.id].workerID = workerID;
    tabDataDict[sender.tab.id].version = m.version;
    tabDataDict[sender.tab.id].URL = m.URL;
    tabDataDict[sender.tab.id].referrer = m.referrer;
    tabDataDict[sender.tab.id].navigationStart = m.navigationStart;
    tabDataDict[sender.tab.id].outerHeight = m.outerHeight;
    tabDataDict[sender.tab.id].outerWidth = m.outerWidth;
}

function handleClick(m, sender) {
    tabDataDict[sender.tab.id].click.push(m.click);
}

function handleScroll(m, sender) {
    tabDataDict[sender.tab.id].scroll.push(m.scroll);
}

function handleVisibilitychange(m, sender) {
    tabDataDict[sender.tab.id].visibilitychange.push(m.visibilitychange);
}

function handleLoad1(m, sender) {
    tabDataDict[sender.tab.id].loadEventEnd = m.loadEventEnd;
    tabDataDict[sender.tab.id].loadTimeStamp = m.loadTimeStamp;
}

function handleLoad2(m, sender) {
    tabDataDict[sender.tab.id].resources = m.resources;
}

function handleLoad3(m, sender) {
    tabDataDict[sender.tab.id].navigationTiming = m.navigationTiming;
    tabDataDict[sender.tab.id].stats = m.stats;
}

function handleSurvey(m, sender) {
    tabDataDict[sender.tab.id].surveyDone = true;
    tabDataDict[sender.tab.id].surveyValue = m.surveyValue;
    tabDataDict[sender.tab.id].surveyProb = m.surveyProb;
    tabDataDict[sender.tab.id].surveyTime = m.surveyTime;
    tabDataDict[sender.tab.id].surveyIndex = m.surveyIndex;
}

function handleTTI(m, sender) {
    tabDataDict[sender.tab.id].longtasks = m.longtasks;
    tabDataDict[sender.tab.id].tti = m.tti;
}

function handleExtraInfo(m, sender) {
    // 네트워크 정보
    tabDataDict[sender.tab.id].networkInformation = m.networkInformation;
    tabDataDict[sender.tab.id].performanceMemory = m.performanceMemory;
    tabDataDict[sender.tab.id].navigationType = m.navigationType;
    tabDataDict[sender.tab.id].documentOffsetHeight = m.documentOffsetHeight;
    tabDataDict[sender.tab.id].documentClientHeight = m.documentClientHeight;

    // 배터리 정보
    var batteryInformation = {};
    window.navigator.getBattery().then(function(battery) {
        batteryInformation = {
            charging: battery.charging,
            level: battery.level,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
        };
        
        tabDataDict[sender.tab.id].batteryInformation = batteryInformation;
    });

    // CPU 정보
    chrome.system.cpu.getInfo(function(info) {
        tabDataDict[sender.tab.id].prevCpu = prevCpu;
        tabDataDict[sender.tab.id].cpu = info;
        prevCpu = info;
    });

    // 메모리 정보
    chrome.system.memory.getInfo(function(info) {
        tabDataDict[sender.tab.id].memory = info;
    });

    // 지리 정보
    function success(position) {
        var geolocation = {
            accuracy: position.coords.accuracy,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            timestamp: position.timestamp
        };
        
        tabDataDict[sender.tab.id].geolocation = geolocation;
    }
    function error() {
        log("geolocation error");
    }
    navigator.geolocation.getCurrentPosition(success, error);

    // IP 정보
}

function setWorkerID(m, sender) {
    workerID = m.workerID;

    for (const [key, val] of Object.entries(tabDataDict)) {
        val.workerID = workerID;
    }

    // local storage에 workerID 저장
    chrome.storage.local.set({"workerID": workerID}, function() {
        log("workerID is updated");
    });
}

function initStart(m, sender) {
    let isNeededWorkerID = false;
    if (workerID == "" || workerID == undefined) {
        isNeededWorkerID = true;
    }

    // 해당 tab의 변화를 감지해야 한다.
    handlePageChange(sender.tab);

    portFromCS.postMessage({msg: "initStart", isNeededWorkerID: isNeededWorkerID});
}

// 버퍼 이후는 initDone 이후에 발생함!
function initDone(m, sender) {
    portFromCS.postMessage({msg: "initDone"});
}

function connected(p) {
    portFromCS = p;
    portFromCS.postMessage({msg: "Hi there content script!"});
    portFromCS.onMessage.addListener(function(m, sender) {
        if ("func" in m )  {
            if (typeof window[m.func] == "function") {
                try {
                    window[m.func](m, sender.sender);
                } catch {

                }                
            } else {
                log(m.func + " is not a function!");
            }
        }

        if ("greeting" in m) {
            log(m.greeting);
        }
    });
}

function updateStorageData() {
    chrome.storage.local.set({"pageDataList": pageDataList}, function() {
        let dataLength = pageDataList.length;
        if (dataLength >= 10) {
            updateServerDataFlag = true;
        }
    });
}

function updateServerData() {
    if (!updateServerDataFlag) {
        return;
    }

    let data = {pageDataList: pageDataList};
    data["workerID"] = workerID;
    let dataString = JSON.stringify(data, null, 2);

    $.ajax({
        url:API_SERVER + "/data",
        data: dataString,
        type: "POST",
        contentType: "application/json",
        dataType: "json"
    }).done(function(returnedJson) {
        log("ajax data # " + returnedJson.len);

        // heap data를 초기화 한다 (workerID는 보호한다)
        pageDataList = new Array();

        // local storage 데이터의 pageDataList를 제거한다.
        chrome.storage.local.remove(["pageDataList"], function() {
            log("pageDataList is removed");
        })
    }).fail(function(xhr, status, errorThrown) {
        log(status);
        log("ajax error: " + errorThrown);
    }).always(function(xhr, status) {
        log("Ajax done!");
        updateServerDataFlag = false;
    });
}


// **********************************************************
// Main Start!

// 초기화 작업
// 1. workerID를 얻는다.
// 2. pageKeys를 얻는다.
chrome.storage.local.get(['workerID', 'pageDataList'], function(result) {
    log("Initial storage.local.get Done!");

    if (result.workerID != undefined) {
        workerID = result.workerID;
    }
    
    if (result.pageDataList != undefined) {
        pageDataList = result.pageDataList;
    }
});

/*
// Option 쪽에서 workerID가 변경된 경우, 이를 감지하고 반영해야 한다.
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if ("workerID" in changes) {
        workerID = changes["workerID"].newValue;
        console.log("workerID is changed! =>", workerID);
    }
});
*/

// Content script와의 통신을 연다. (TODO check)
chrome.runtime.onConnect.addListener(connected);


// *******************************************************************
// Tab & Window 관련

// 모든 Tab을 얻는다
chrome.windows.getAll({populate: true}, function(windows) {
    log("getAll() done!");
    for (var x of windows) {
        for (var y of x.tabs) {
            generateNewPageData(y);
        }
    }
});

// Tab의 생성을 감지한다.
chrome.tabs.onCreated.addListener(function(tab) {
    generateNewPageData(tab);
    log("Hello tab", tab.id);
});

// Tab의 삭제를 감지한다. (웹 페이지 종료 감지 1)
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    updatePageDataList(tabId);

    delete(tabDataDict[tabId]);
    log("Bye tab", tabId, removeInfo);
});

// storage의 변화를 감지한다 --> workerID
chrome.storage.onChanged.addListener((changes, namespace) => {
    if ("workerID" in changes) {
        log("WorkerID is changed to " + changes["workerID"].newValue);
        workerID = changes["workerID"].newValue;
    }
});

// 10초에 한번씩 ajax 통신하기
setInterval(updateServerData, 10000);