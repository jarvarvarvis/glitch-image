import Image from "image-js";

export class Filter {
    applyToPixel(x, y, pixel) {
    }

    applyToImage(image) {
        var newImage = new Image({
            width: image.width,
            height: image.height,
            kind: "RGB"
        });

        for (var y = 0; y < image.height; y++) {
            for (var x = 0; x < image.width; x++) {
                var pixelValue = image.getPixelXY(x, y);
                var newPixel = this.applyToPixel(x, y, pixelValue);
                newImage.setPixelXY(x, y, newPixel);
            }
        }

        return newImage;
    }
}