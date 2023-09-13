import Image from "image-js";

export class Filter {
    applyToPixel(image, x, y) {
    }

    applyToImage(image) {
        var newImage = new Image({
            width: image.width,
            height: image.height,
            kind: "RGB"
        });

        for (var y = 0; y < image.height; y++) {
            for (var x = 0; x < image.width; x++) {
                var newPixel = this.applyToPixel(image, x, y);
                newImage.setPixelXY(x, y, newPixel);
            }
        }

        return newImage;
    }
}