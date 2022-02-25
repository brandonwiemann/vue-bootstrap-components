class ImageHelper {

    static base64ImageToBlob(base64Image: string, mime: string): Blob {
        mime = mime || 'image/jpg';
        const base64 = base64Image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        const sliceSize = 1024;
        const byteChars = window.atob(base64);
        const byteArrays = [];

        for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            const slice = byteChars.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mime });
    }

    static blobToDataURI(blob: Blob): Promise<string | ArrayBuffer> {
        return new Promise(function(resolve) {
            const a = new FileReader();
            a.onload = function(e) {
                resolve(e.target?.result);
            };
            a.readAsDataURL(blob);
        });
    }

    static dataURItoBlob(dataURI: string): Blob {
        let byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
        else byteString = unescape(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    }

    static getImageData(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            if (!src) reject('No image source provided');
            const img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.src = src;
        });
    }

    static getImageFromFileUpload(file: File): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.match(/image.*/)) {
                return reject('Not a valid image file');
            }
            const reader = new FileReader();
            reader.onload = function(readerEvent) {
                resolve(readerEvent.target?.result);
            };
            reader.readAsDataURL(file);
        });
    }

}

export default ImageHelper;