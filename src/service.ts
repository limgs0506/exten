chrome.action.onClicked.addListener(() => {
	chrome.tabs.query({ currentWindow: true, active: true }, (result) => {
		//확장을 사용한 탭의 ID get
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
						//1. jpg => jfif 문제 해결
						//2. 복수 이미지를 2장까지 밖에 인식하지 못하는 문제 해결
						//3. 이름 끝에 번호가 안붙는 문제 해결
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
