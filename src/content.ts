/**
 * 트윗 아티클 단위로 정보 취합?
 * 스레드 내 트윗 작성 일시 단위로 취합하는 게 좋을까?(번호 붙이기)
 */
class TweetArticle {
	author: string;
	date: string;
	src: string[];
	//format: string[];

	constructor(
		author: string,
		Date: string,
		src: string[] /* , format: string[] */
	) {
		this.author = author;
		this.date = Date;
		this.src = src;
		//this.format = format;
	}
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message == "download the article img") {
		const article: HTMLElement = document.querySelector(
			"article"
		) as HTMLElement;
		const textContents = article.querySelectorAll("a");
		//textContent와 innerText의 차이?

		const author = textContents[2].textContent as string; //아이디

		let date = textContents[4].textContent as string; //날짜
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

		const imgList: NodeListOf<HTMLImageElement> =
			article.querySelectorAll('img[alt="이미지"]');
		let imgSrcArr: string[] = [];
		//let imgFormatArr: string[] = [];
		for (let i = 0; i < imgList.length; i++) {
			const imgSrc = imgList[i].src;
			const originImg: string = imgSrc.replace(/(?<=name=)\w+/gi, "orig");
			imgSrcArr.push(originImg);
			//imgSrc.match(/(?<=format=)\w+/gi);
		}

		const tweet = new TweetArticle(author, dateText, imgSrcArr);
		//article id 검증 파트
		//각 article에서 이미지 src 추출 파트
		sendResponse(tweet);
	}
});
