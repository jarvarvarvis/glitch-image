import { Filter } from "../filter";

export class ChannelValueFilter extends Filter {
    constructor(channel) {
        super();
        this.channel = channel;
    }

    applyToPixel(x, y, pixel) {
        if (this.channel < pixel.length) {
            var value = pixel[this.channel];
            
            var result = [];
            for (var i = 0; i < pixel.length; i++) {
                result.push(value);
            }

            return result;
        }

        return pixel;
    }
}