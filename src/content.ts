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
		interface dateObj {
			year: string;
			month: string;
			day: string;
		}

		const date: string | null | undefined =
			article.querySelector("time")?.textContent;
		if (!date) {
			return;
		}

		const dateArr = date.match(/[\d]+/g);
		if (!dateArr) {
			return;
		}

		const dateObj: dateObj = {
			year: dateArr[2].slice(2, 4),
			month: dateArr[3].length === 2 ? dateArr[3] : "0" + dateArr[3],
			day: dateArr[4].length === 2 ? dateArr[4] : "0" + dateArr[4],
		};

		const dateText = dateObj.year + dateObj.month + dateObj.day;
		return dateText;
	}

	//arti img.src 취득
	function getImgSrc(article: HTMLElement): string[] {
		const imgList: NodeListOf<HTMLImageElement> = article.querySelectorAll(
			'img[src*="/media/"]'
		);
		let imgSrcArr: string[] = [];

		if (!imgList.length) {
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
