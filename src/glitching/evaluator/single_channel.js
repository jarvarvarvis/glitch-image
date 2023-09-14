import { PixelEvaluator } from "../evaluator";

export class SingleChannelEvaluator extends PixelEvaluator {
    constructor(channelIndex) {
        super();
        this.channelIndex = channelIndex;
    }

    getPixelValue(pixel) {
        return pixel[this.channelIndex];
    }
}