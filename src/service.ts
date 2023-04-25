chrome.action.onClicked.addListener(() => {
	download();
});

chrome.commands.onCommand.addListener((command) => {
	if (command === "run") {
		download();
	}
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.message === "Download Button Click") {
		//chrome.downloads.download();
		console.log(message);
		for (let i = 0; i < message.src.length; i++) {
			const fileFormat = message.src[i].match(/(?<=format=)\w+/gi, "orig");

			chrome.downloads.download({
				url: message.src[i],
				filename: `twimg/${message.author}/${message.author}-${message.date}-${
					i + 1
				}.${fileFormat}`,
			});
		}
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
					filename: `twimg/${response.author}/${response.author}-${
						response.date
					}-${i + 1}.${fileFormat}`,
				});
			}
		});
	});
};
