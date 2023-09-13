import { Filter } from "../filter";

export class ExtractChannelFilter extends Filter {
    constructor(channel) {
        super();
        this.channel = channel;
    }

    applyToPixel(x, y, pixel) {
        if (this.channel < result.length) {
            var result = [];
            for (var i = 0; i < pixel.length; i++) {
                result.push(0);
            }
            
            var value = pixel[this.channel];
            result[this.channel] = value;
            return result;
        }

        return pixel;
    }

    applyToImage(image) {
        return super.applyToImage(image);
    }
}