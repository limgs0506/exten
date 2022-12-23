chrome.action.onClicked.addListener(() => {
	download();
});

chrome.commands.onCommand.addListener((command) => {
	if (command === "run") {
		download();
	}
});

const download = () => {
	chrome.tabs.query({ currentWindow: true, active: true }, (result) => {
		const currentTabID = result[0].id as number;
		const msg = { down: "download the article img" };
		chrome.tabs.sendMessage(currentTabID, msg.down, (response) => {
			for (let i = 0; i < response.src.length; i++) {
				const fileFormat = response.src[i].match(/(?<=format=)\w+/gi, "orig");

				chrome.downloads.download({
					url: response.src[i],
					filename: `${response.author}/${response.author}-${response.date}-${
						i + 1
					}.${fileFormat}`,
				});
			}
		});
	});
};
