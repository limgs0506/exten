chrome.action.onClicked.addListener(() => {
	chrome.tabs.query({ currentWindow: true, active: true }, (result) => {
		//확장을 사용한 탭의 ID get
		const currentTabID = result[0].id as number;
		const msg = { down: "download the article img" };
		chrome.tabs.sendMessage(currentTabID, msg.down, (response) => {
			console.log(response);
			/* imgObj = result[0].result;

			for (let i = 0; i < imgObj.imgName.length; i++) {
				chrome.downloads.download({
					url: imgObj.imgUrl[i],
					filename: imgObj.username + "/" + imgObj.imgName[i],
				});
			} */
		});
	});
});
