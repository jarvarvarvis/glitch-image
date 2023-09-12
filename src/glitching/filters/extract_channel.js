import { Filter } from "../filter";

export class ExtractChannelFilter extends Filter {
    constructor(channel) {
        super();
        this.channel = channel;
    }

    applyToPixel(x, y, pixel) {
        var value = pixel[this.channel];
        var result = [0, 0, 0];
        result[this.channel] = value;

        return result;
    }

    applyToImage(image) {
        return super.applyToImage(image);
    }
}