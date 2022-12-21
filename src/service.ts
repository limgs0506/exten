chrome.action.onClicked.addListener(() => {
	chrome.tabs.query({ currentWindow: true, active: true }, (result) => {
		const currentTabID = result[0].id as number;
		const msg = { down: "download the article img" };
		chrome.tabs.sendMessage(currentTabID, msg.down, (response) => {
			console.log(response);
			for (let src of response.src) {
				let count = 0;
				count++;
				chrome.downloads.download({
					url: src,
				});
				chrome.downloads.onDeterminingFilename.addListener(
					(downloadItem, suggest) => {
						const fileFormat = downloadItem.mime.split("/");
						console.log(fileFormat);
						if (fileFormat[1] === "jpeg") {
							fileFormat[1] = "jpg";
						}
						console.log(fileFormat[1]);

						suggest({
							filename: `${response.author}/${response.author}-${
								response.date
							}-${count.toString()}.${fileFormat[1]}`,
						});
					}
				);
			}
		});
	});
});
