class TweetArticle {
	author: string;
	date: string;
	src: string[];

	constructor(author: string, Date: string, src: string[]) {
		this.author = author;
		this.date = Date;
		this.src = src;
	}
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message == "download the article img") {
		const article: HTMLElement = document.querySelector(
			"article"
		) as HTMLElement;
		const textContents = article.querySelectorAll("a");

		const author =
			textContents[2].textContent[0] === "@"
				? (textContents[2].textContent as string)
				: (textContents[3].textContent as string);

		const date: string = article.querySelector("time").textContent as string;

		let temp = date.match(/[\d]+/g) as RegExpMatchArray;
		const TEMP_LENGTH = 5;

		temp[2] = temp[2].slice(2, 4);
		let tempTwo: string[] = [];
		tempTwo.push(temp[2]);
		for (let i = 3; i < TEMP_LENGTH; i++) {
			if (temp[i].length < 2) {
				temp[i] = "0" + temp[i];
			}
			tempTwo.push(temp[i]);
		}
		const dateText = tempTwo.join("");

		const imgList: NodeListOf<HTMLImageElement> = article.querySelectorAll(
			'img[src*="/media/"]'
		);
		let imgSrcArr: string[] = [];
		for (let i = 0; i < imgList.length; i++) {
			const imgSrc = imgList[i].src;
			const originImg: string = imgSrc.replace(/(?<=name=)\w+/gi, "orig");
			imgSrcArr.push(originImg);
		}

		const tweet = new TweetArticle(author, dateText, imgSrcArr);
		console.log(tweet);

		sendResponse(tweet);
	}
});
