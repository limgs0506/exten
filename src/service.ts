chrome.action.onClicked.addListener(() => {
	chrome.tabs.query({ currentWindow: true, active: true }, (result) => {
		//확장을 사용한 탭의 ID get
		const currentTabID = result[0].id as number;
		const msg = { down: "download the article img" };
		chrome.tabs.sendMessage(currentTabID, msg.down, (response) => {
			console.log(response);
			for (let src of response.src) {
				chrome.downloads.download({
					url: src,
				});
				chrome.downloads.onDeterminingFilename.addListener(
					(downloadItem, suggest) => {
						const fileFormat = downloadItem.mime.split("/");
						suggest({
							filename: `${response.author}/${response.author}-${response.date}.${fileFormat[1]}`,
						});
					}
				);
			}
		});
	});
});
