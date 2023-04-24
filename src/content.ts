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
function getDate(article: HTMLElement): string {
	interface dateObj {
		year: string;
		month: string;
		day: string;
	}

	const timestamp: NodeListOf<HTMLTimeElement> =
		article.querySelectorAll("time");
	if (!timestamp[0]) return "noTimeElement";
	//인용트윗의 time과 구분하기 위해 더 늦은 time을 사용
	const fstDate = new Date(timestamp[0].dateTime);
	//new Date(undefined)는 Invalid Date
	//Invalid Date.getTime은 NaN
	//NaN을 비교하면 false
	const secDate = new Date(timestamp[1]?.dateTime);
	const date = secDate.getTime() > fstDate.getTime() ? secDate : fstDate;

	const dateObj: dateObj = {
		year: date.getFullYear().toString().slice(2, 4),
		month: (date.getMonth() + 1).toString(),
		day: date.getDate().toString(),
	};

	const addZero = (str: string) => {
		return str.length < 2 ? "0" + str : str;
	};

	return dateObj.year + addZero(dateObj.month) + addZero(dateObj.day);
}

//arti img.src 취득
function getImgSrc(article: HTMLElement): string[] {
	const imgList: NodeListOf<HTMLImageElement> = article.querySelectorAll(
		'img[src*="/media/"]'
	);
	if (!imgList.length) {
		return [];
	}

	let imgSrcArr: string[] = [];

	for (const img of imgList) {
		const originImg: string = img.src.replace(/(?<=name=)\w+/gi, "orig");
		imgSrcArr.push(originImg);
	}

	return imgSrcArr;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message == "download the article img") {
		interface tweet {
			author: string;
			date: string;
			src: string[];
		}

		const article: HTMLElement | null = document.querySelector("article");

		if (article instanceof HTMLElement) {
			const tweet: tweet = {
				author: getAuthor(article),
				date: getDate(article),
				src: getImgSrc(article),
			};
			console.log(tweet);

			sendResponse(tweet);
		} else {
			console.error("constance article is not HTMLElemnet");
		}
	}
});

const injectObsever = setInterval(() => {
	//타임라인 내 트윗 container 노드를 찾음
	const tlFst: Element | null | undefined = document.querySelector(
		'div[aria-label="타임라인: 내 홈 타임라인"]'
	)?.firstElementChild;
	console.log("interval");

	if (tlFst && tlFst instanceof HTMLDivElement) {
		clearInterval(injectObsever);
		console.log("interval clear");

		setTimeout(() => {
			const tlSnd: Element | null | undefined = document.querySelector(
				'div[aria-label="타임라인: 내 홈 타임라인"]'
			)?.firstElementChild;
			console.log("variable init");

			const observer = new MutationObserver((mutationRecord) => {
				for (let record of mutationRecord) {
					//record.addedNodes[0]의 타입은 Node라서 querySelector에 경고 발생
					const tweet = record.addedNodes[0] as HTMLElement;
					//트윗이 생성된 경우만 진행
					if (!tweet) {
						continue;
					}
					//이미지가 로드된 후에 동작하도록 1초 대기
					setTimeout(() => {
						const tweetImg = tweet.querySelector("img[alt='이미지']");
						if (!tweetImg) {
							return;
						}

						const btn = document.createElement("button");
						btn.textContent = "Down";
						const newBtn = btn.cloneNode(true);
						newBtn.addEventListener("click", () => {
							// chrome.runtime.sendMessage({
							// 	message: "Download Button Click",
							// 	author: "",
							// 	date: "",
							// 	imgSrc: "",
							// });
							console.log(getAuthor(tweet), getDate(tweet), getImgSrc(tweet));
						});
						const imageAera = tweet.querySelector(".css-1dbjc4n.r-580adz");
						imageAera?.appendChild(newBtn);
					}, 1000);
				}
			});

			//container 안의 트윗의 변화를 감지
			observer.observe(tlSnd, { childList: true });
			console.log("start observe");
		}, 1000 * 1);
	}
}, 100);
