import { arraysEqual } from "@/utils/array";

import { PixelSpan } from "../span";
import { SpanGatherer } from "../span_gatherer";

export class RandomOffsetMaskedSpanGatherer extends SpanGatherer {
    constructor(maskImage, maxOffset, offsetChance) {
        super();
        this.maskImage = maskImage;
        this.maxOffset = maxOffset;
        this.offsetChance = offsetChance;
    }

    getRandomOffset() {
        return Math.ceil(Math.random() * this.maxOffset);
    }

    gatherSpansAt(imageView, row) {
        var spans = [];

        var lastSpanCompleted = true;

        var maskTrue = [255, 255, 255];
        var maskFalse = [0, 0, 0];

        var extraColumnsToBeIncluded = 0;

        //for (var x = 0; x < this.maskImage.width; x++) {
        for (var column of imageView.columns(row)) {
            var { x, y } = column.getXY();
            var pixel = this.maskImage.getPixelXY(x, y);

            // If the value of the mask is true or there are extra
            // columns to be included in the current span, ...
            if (arraysEqual(pixel, maskTrue) || extraColumnsToBeIncluded > 0) {
                if (lastSpanCompleted) {
                    spans.push(new PixelSpan());
                    lastSpanCompleted = false;
                }

                // Only add extra columns if none are currently set
                if (this.maxOffset > 0 && extraColumnsToBeIncluded == 0) {
                    if (Math.random() <= this.offsetChance) {
                        extraColumnsToBeIncluded += this.getRandomOffset();
                    }
                }

                spans[spans.length - 1].addCoordinate({
                    x: x,
                    y: y
                });

                // Update the value of `extraColumnsToBeIncluded`.
                // Finish the current span if `extraColumnsToBeIncluded` reached 0 
                // in the current step.

                if (extraColumnsToBeIncluded > 0) {
                    extraColumnsToBeIncluded--;

                    if (extraColumnsToBeIncluded == 0) {
                        lastSpanCompleted = true;
                    }
                }
            }
            else if (arraysEqual(pixel, maskFalse)) {
                lastSpanCompleted = true;
            }
        }

        return spans;
    }
}