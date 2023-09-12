import { arraysEqual } from "@/utils/array";

import { PixelRowSpan } from "../span";
import { SpanGatherer } from "../span_gatherer";

export class MaskedSpanGatherer extends SpanGatherer {
    constructor(maskImage) {
        super();
        this.maskImage = maskImage;
    }

    gatherSpansAt(image, y) {
        var spans = [];

        var startedOnSpan = false;
        var spanStart = 0;

        var maskTrue = [255, 255, 255];
        var maskFalse = [0, 0, 0];

        for (var x = 0; x < this.maskImage.width; x++) {
            var pixel = this.maskImage.getPixelXY(x, y);

            if (arraysEqual(pixel, maskTrue) && !startedOnSpan) {
                startedOnSpan = true;
                spanStart = x;
            }

            if (arraysEqual(pixel, maskFalse) && startedOnSpan) {
                startedOnSpan = false;
                spans.push(new PixelRowSpan(spanStart, x - 1));
            }
        }

        // Push left-over span
        if (startedOnSpan) {
            spans.push(new PixelRowSpan(spanStart, this.maskImage.width - 1));
        }

        return spans;
    }
}