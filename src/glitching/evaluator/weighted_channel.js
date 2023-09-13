import { PixelEvaluator } from "../evaluator";

export class WeightedChannelEvaluator extends PixelEvaluator {
    constructor(channelWeightOrder) {
        super();
        this.channelWeightOrder = channelWeightOrder;
    }

    getPixelValue(pixel) {
        var channel0 = this.channelWeightOrder[0];
        var channel1 = this.channelWeightOrder[1];
        var channel2 = this.channelWeightOrder[2];

        return pixel[channel0] * 256 * 256 + pixel[channel1] * 256 + pixel[channel2];
    }
}