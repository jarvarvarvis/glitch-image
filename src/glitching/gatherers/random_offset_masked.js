import { arraysEqual } from "@/utils/array";

import { PixelRowSpan } from "../span";
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

                if (this.maxOffset > 0) {
                    if (Math.random() <= this.offsetChance) {
                        x += this.getRandomOffset();

                        // Clamp x
                        if (x < 0) {
                            x = 0;
                        }
                        if (x >= this.maskImage.width) {
                            x = this.maskImage.width - 1;
                        }
                    }
                }

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