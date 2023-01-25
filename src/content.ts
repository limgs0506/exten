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
	function getDate(article: HTMLElement): string {
		interface dateObj {
			year: string;
			month: string;
			day: string;
		}

		//인용 트윗은 article 안에 time이 2개 있기 때문에
		//querySelectorAll()로 NodeList를 만들어
		//마지막 time 요소를 취한다
		const dateList: NodeListOf<HTMLTimeElement> =
			article.querySelectorAll("time");
		const date: string | null = dateList.item(dateList.length - 1).textContent;
		if (!date) {
			return "error";
		}

		const dateArr = date.match(/[\d]+/g);
		if (!dateArr) {
			return "error";
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
		if (!imgList.length) {
			return [];
		}

		let imgSrcArr: string[] = [];

		for (const img of imgList) {
			//이미지 링크 url의 트윗 번호? 식별자?를 페이지 url과 비교
			//.../status/"18263780" <= 이 부분
			if (img.closest("a")?.href.split("/")[5] === document.URL.split("/")[5]) {
				const imgSrc: string = img.src;
				const originImg: string = imgSrc.replace(/(?<=name=)\w+/gi, "orig");

				imgSrcArr.push(originImg);
			}
		}

		return imgSrcArr;
	}

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
