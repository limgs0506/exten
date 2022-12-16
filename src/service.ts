chrome.action.onClicked.addListener((tab) => {
	console.log("트위터 이미지 다운로더 실행됨12");
	chrome.scripting.executeScript(
		{
			target: {
				tabId: tab.id,
			},
			files: ["content.js"],
		},
		(result) => {
			imgObj = result[0].result;

			for (let i = 0; i < imgObj.imgName.length; i++) {
				chrome.downloads.download({
					url: imgObj.imgUrl[i],
					filename: imgObj.username + "/" + imgObj.imgName[i],
				});
			}
		}
	);
});

/* 
chrome.action.onClicked.addListener((tab) => {
	for(url in imgOrig) {
		chrome.downloads.download({
			url: url,
			filename: ,
			saveAs: false//true로 하면 실행 안됨
		});
	}
}) 
*/

/* try {
	chrome.contextMenus.create({
		"title": "Tweet Image",
		"id": "1st menu",
		"type": "normal",
		"contexts": ["image"]
	});

	function getIdFromUrl(url) {
		const idBefore = url.match(/([A-Z])\w+/gi);
		let idAfter = "@";
		idAfter += idBefore[3];
		return idAfter;
	}

	function getOriginImage(url) {
		const newUrl = url.replace(/(?<=name=)\w+/gi, "orig");
		return newUrl;
	}

	function getFileFormat(url) {
		const fileFormat = url.match(/(?<=format=)\w+/gi);
		return fileFormat;
	}

	chrome.contextMenus.onClicked.addListener((info, tab) => {
		let idFromUrl = getIdFromUrl((info.linkUrl ?? tab.url));
		const originImage = getOriginImage(info.srcUrl);
		//const 날짜;
		const fileFormat = getFileFormat(originImage);
		//idFromUrl += 날짜;
		idFromUrl += ".";
		idFromUrl += fileFormat;

		console.log(fileFormat);
		chrome.downloads.download({
			url: originImage,
			filename: idFromUrl,
			saveAs: false//true로 하면 실행 안됨
		});
	});
} catch (e) {
	console.log(e);
} */
