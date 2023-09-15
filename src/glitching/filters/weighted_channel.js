import { Filter } from "../filter";

export class WeightedChannelFilter extends Filter {
    constructor(channel) {
        super();
        this.channel = channel;
    }

    applyToPixel(image, x, y) {
        var pixel = image.getPixelXY(x, y);
        
        if (this.channel < pixel.length) {
            var channelValue = pixel[this.channel];

            var otherChannelValues = [];
            for (var i = 0; i < pixel.length; i++) {
                if (i != this.channel) {
                    otherChannelValues.push(pixel[i]);
                }
            }

            var clamp = (x, min, max) => {
                return x < min ? min : 
                        x > max ? max : 
                            x;
            };

            var result = []
            for (var i = 0; i < pixel.length; i++) {
                result[i] = clamp((
                    channelValue
                    - otherChannelValues[0] / 2
                    - otherChannelValues[1] / 2
                ), 0, 255);
            }

            return result;
        }

        return pixel;
    }

    applyToImage(image) {
        return super.applyToImage(image);
    }
}