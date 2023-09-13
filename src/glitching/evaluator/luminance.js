import { PixelEvaluator } from "../evaluator";

function luminance(pixel) {
    var red = pixel[0];
    var green = pixel[1];
    var blue = pixel[2];
    return Math.round(0.299 * red + 0.587 * green + 0.114 * blue);
}

export class LuminanceEvaluator extends PixelEvaluator {
    constructor() {
        super();
    }

    getPixelValue(pixel) {
        return luminance(pixel);
    }
}