import { ComparisonFunction } from "../comparison";

export class AscendingComparison extends ComparisonFunction {
    constructor() {
        super();
    }

    comparePixels(left, right) {
        return left - right;
    }
}