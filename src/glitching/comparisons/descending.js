import { ComparisonFunction } from "../comparison";

export class DescendingComparison extends ComparisonFunction {
    constructor() {
        super();
    }

    comparePixels(left, right) {
        return right - left;
    }
}