class ImageHelper {

	static base64ImageToBlob(base64Image, mime) {
		mime = mime || 'image/jpg';
		let base64 = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
		let sliceSize = 1024;
		let byteChars = window.atob(base64);
		let byteArrays = [];

		for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
			let slice = byteChars.slice(offset, offset + sliceSize);

			let byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			let byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		return new Blob(byteArrays, {type: mime});
    }

    static blobToDataURI(blob) {
        return new Promise(function(resolve, reject) {
            var a = new FileReader();
            a.onload = function(e) {
                resolve(e.target.result);
            }
            a.readAsDataURL(blob);
        });
    }

    static dataURItoBlob(dataURI) {
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
        else byteString = unescape(dataURI.split(',')[1]);
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        let ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    }

	static getImageData(src) {
		return new Promise((resolve, reject) => {
			if(!src) reject('No image source provided');
			let img = new Image();
			img.onload = () => {
				resolve(img);
			}
			img.src = src;
		});
	}

	static getImageFromFileUpload(file) {
		return new Promise((resolve, reject) => {
			if(!file || !file.type.match(/image.*/)) {
				reject("Not a valid image file");
			}
			let reader = new FileReader();
			reader.onload = function(readerEvent) {
				resolve(readerEvent.target.result);
			}
			reader.readAsDataURL(file);
		});
	}

}

export default ImageHelper;