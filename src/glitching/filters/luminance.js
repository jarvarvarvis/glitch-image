import { Filter } from "../filter";

export class LuminanceFilter extends Filter {
    constructor() {
        super();
    }

    applyToPixel(image, x, y) {
        var pixel = image.getPixelXY(x, y);
        
        var red = pixel[0];
        var green = pixel[1];
        var blue = pixel[2];
        var luminance = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);
        
        var newPixel = [luminance, luminance, luminance];
        return newPixel;
    }

    applyToImage(image) {
        return super.applyToImage(image);
    }
}