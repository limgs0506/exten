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
	//text author 취득
	function getAuthor(article: HTMLElement): string {
		const anchorList: NodeListOf<HTMLAnchorElement> =
			article.querySelectorAll("a");

		for (const anchor of anchorList) {
			const anchorText: string | null = anchor.textContent;

			if (!anchorText) {
				continue;
			}

			if (anchorText[0] === "@") {
				return anchorText;
			}
		}
		return "UsernameNotFound";
	}

	//text datetext 취득
	function getDate(article: HTMLElement) {
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

		return dateText;
	}

	//arti img.src 취득
	function getImgSrc(article: HTMLElement): string[] {
		const imgList: NodeListOf<HTMLImageElement> = article.querySelectorAll(
			'img[src*="/media/"]'
		);
		let imgSrcArr: string[] = [];

		if (imgList.length) {
			return [];
		}

		for (const img of imgList) {
			const imgSrc: string = img.src;
			const originImg: string = imgSrc.replace(/(?<=name=)\w+/gi, "orig");

			imgSrcArr.push(originImg);
		}

		return imgSrcArr;
	}

	if (message == "download the article img") {
		const article = document.querySelector("article");
		const textContents = article.querySelectorAll("a");

		const author = getAuthor(textContents);
		const dateText = getDate(article);
		const imgSrcArr = getImgSrc(article);

		const tweet = new TweetArticle(author, dateText, imgSrcArr);
		console.log(tweet);

		sendResponse(tweet);
	}
});
