export class PixelRowSpan {
    constructor(lowerIndex, upperIndex) {
        this.lowerIndex = lowerIndex;
        this.upperIndex = upperIndex;
    }

    isInSpan(value) {
        return value >= this.lowerIndex && value <= this.upperIndex;
    }

    toString() {
        return "PixelRowSpan(" +
            "lowerIndex=" + this.lowerIndex +
            ", upperIndex=" + this.upperIndex +
            ")";
    }
}