chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message == "testMessage") {
		sendResponse("message recieved");
	}
});
