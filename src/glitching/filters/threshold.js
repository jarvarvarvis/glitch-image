import { Filter } from "../filter";

export class ThresholdFilter extends Filter {
    constructor(lowerThreshold, upperThreshold) {
        super();
        this.lowerThreshold = lowerThreshold;
        this.upperThreshold = upperThreshold;
    }

    applyToPixel(x, y, pixel) {
        var result = [];
        
        var inThreshold = value => {
            return value >= this.lowerThreshold && 
                value <= this.upperThreshold
        };

        var allInThreshold = true;
        for (var i = 0; i < pixel.length; i++) {
            allInThreshold &&= inThreshold(pixel[i]);
        }

        for (var i = 0; i < pixel.length; i++) {
            result.push(allInThreshold ? 255 : 0);
        }

        return result;
    }

    applyToImage(image) {
        return super.applyToImage(image);
    }
}