let workerID = "";
const API_SERVER = "http://************" // It need to be changed


function updateWorkerIdInPage() {
    chrome.storage.local.get(['workerID'], function(result) {
        let worker_html_str = "You have not yet submiited your Worker ID!";
        try {
            if (result.workerID != undefined || result.workerID == "")  {
                workerID = result.workerID;
                worker_html_str = workerID;
                //document.getElementById("worker-id-input").value = workerID;
            }
        } catch (e) {
            console.log(e);
            workerID = "";
        }
        document.getElementById("worker-id").innerHTML = worker_html_str;

        updateClientMsgs();
        updateServerMsgs();
    });
}

function updateClientMsgs() {
    chrome.storage.local.get(["pageDataList"], function(result) {
        let baseStr = "The number of page data: ";
        let localPageNums = "?";
        if (result.pageDataList != undefined) {
            localPageNums = result.pageDataList.length;
        }

        document.getElementById("client-msg").innerHTML = baseStr + localPageNums;
    });
}

function updateServerMsgs() {
    $.ajax({
        url:API_SERVER + "/msgs",
        data: {'id': workerID},
        type: "GET",
        contentType: "application/json",
        dataType: "json"
    }).done(function(returnedJson) {
        if (returnedJson.isValid == "True") {
            document.getElementById("msg1").innerHTML = returnedJson.msg1;
            document.getElementById("msg2").innerHTML = returnedJson.msg2;
            document.getElementById("msg3").innerHTML = returnedJson.msg3;
        }
    }).fail(function(xhr, status, errorThrown) {
        console.log(status);
        console.log("ajax error: " + errorThrown);
    }).always(function(xhr, status) {
        return;
    });
}


function showCurrentStats() {
    updateWorkerIdInPage();
}

/*
function submitWorkerID() {
    console.log("hello");
    workerID = document.getElementById("worker-id-input").value;
    chrome.storage.local.set({"workerID": workerID}, function() {
        showCurrentStats();
    });
}
*/

function resetWorkerId() {
    workerID = prompt("[WebMythBusters]\n\nPlease enter your workerID!");
    chrome.storage.local.set({"workerID": workerID}, function() {
        showCurrentStats();
    });
}



/* M A I N */
//document.querySelector("#worker-id-button").addEventListener("click", submitWorkerID);
showCurrentStats();

let resetWorkerIdButton = document.getElementById("reset-worker-id");
resetWorkerIdButton.addEventListener("click", resetWorkerId);

let reloadButton = document.getElementById("reload");
reloadButton.addEventListener("click", showCurrentStats);

// storage 변화 추적
chrome.storage.onChanged.addListener((changes, namespace) => {
    if ("workerID" in changes) {
        console.log("WorkerID is changed to " + changes["workerID"].newValue);
        workerID = changes["workerID"].newValue;
    }
});