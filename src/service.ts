chrome.action.onClicked.addListener(() => {
	chrome.tabs.query({ currentWindow: true, active: true }, (result) => {
		const currentTabID = result[0].id as number;
		//확장을 사용한 탭의 ID get
		chrome.tabs.sendMessage(currentTabID, "testMessage", (response) => {
			console.log(response);
		});
	});
});
