try {
	let imgOrig = getImgSrc();
	let date = getDateTextStr();
	let username = getUserNameStr();
	let fileFormat = getFormatArr(imgOrig);
	let fileName = new Array();
	let imgFileObj = {
		imgUrl: imgOrig,
		imgName: null,
		username: null,
	};

	for (let i = 0; i < imgOrig.length; i++) {
		fileName[i] = username + date + "-" + (i + 1) + fileFormat[i];
	}
	imgFileObj.imgName = fileName;
	imgFileObj.username = username;
	imgFileObj;
} catch (e) {
	console.error(e);
}

// 이미지 정보 객체 생성자
const ImgObj = (url, fileName) => {
	this.url = url;
	this.fileName = fileName;
	console.table(url, fileName);
};

/**
 * 클래스가 알맞은 이미지 중 alt가 "이미지"인
 * 요소의 src를 추출해 오리지널 이미지 src로 바꾸는 함수
 */
function getImgSrc() {
	const imgSrc = [...document.querySelectorAll("img[alt='이미지']")];
	let imgOrigUrl = [];

	for (let i = 0; i < imgSrc.length; i++) {
		if (imgSrc[i].src)
			imgOrigUrl[i] = imgSrc[i].src.replace(/(?<=name=)\w+/gi, "orig");
	}
	return imgOrigUrl;
	//원 트윗 작성자의 이미지만 가져오려면?
}

/**
 * src에서 파일 포맷을 찾아 순서대로 배열에 기록해 반환하는 함수
 * @param {String[]} imgSrc
 */
function getFormatArr(imgSrc) {
	let format = [];

	for (let i = 0; i < imgSrc.length; i++) {
		format[i] = imgSrc[i].match(/(?<=format=)\w+/gi);
		format[i] = "." + format[i];
	}

	return format;
}

/**
 *
 * @returns
 */
function getUserNameStr() {
	const url = window.location.toString();
	const idBefore = url.match(/([A-Z])\w+/gi);
	let idAfter = "@" + idBefore[3];

	return idAfter;
	//좀 더 확실한 방법으로 고칠 것
}

function getDateTextStr() {
	const spanDate = document.querySelector("time").dateTime;
	let dateObj = new Date(spanDate) + 32400000;
	//9시간(+9 GMT)
	let dateString =
		dateObj.getFullYear().toString() +
		String(dateObj.getMonth() + 1) +
		dateObj.getDate();

	//.match(/(\d{2})/gi);
	let dateText = [];

	for (let i = 1; i <= 3; i++) {
		dateText.push(spanDate[i]);
	}
	dateText = dateText.join("");
	dateText = "-" + dateText;

	return dateText;
}
