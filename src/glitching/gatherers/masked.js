import { arraysEqual } from "@/utils/array";

import { PixelSpan } from "../span";
import { SpanGatherer } from "../span_gatherer";

export class MaskedSpanGatherer extends SpanGatherer {
    constructor(maskImage) {
        super();
        this.maskImage = maskImage;
    }

    gatherSpansAt(imageView, row) {
        var spans = [];

        var lastSpanCompleted = true;

        var maskTrue = [255, 255, 255];
        var maskFalse = [0, 0, 0];

        //for (var x = 0; x < this.maskImage.width; x++) {
        for (var column of imageView.columns(row)) {
            var { x, y } = column.getXY();
            var pixel = this.maskImage.getPixelXY(x, y);

            if (arraysEqual(pixel, maskTrue)) {
                if (lastSpanCompleted) {
                    spans.push(new PixelSpan());
                    lastSpanCompleted = false;
                }

                spans[spans.length - 1].addCoordinate({
                    x: x,
                    y: y
                });
            }

            if (arraysEqual(pixel, maskFalse)) {
                lastSpanCompleted = true;
            }
        }

        return spans;
    }
}