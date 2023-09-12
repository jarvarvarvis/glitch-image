import Image from "image-js";

export class Glitcher {
    glitchImage(image, spanGatherer, sortComparisonFunction) {
        var resultImage = Image.createFrom({
            width: image.width,
            height: image.height,
            kind: "RGB"
        });

        for (var y = 0; y < image.height; y++) {
            //console.log("Starting on row " + y);
            var spans = spanGatherer.gatherSpansAt(image, y);

            // Gather the colors in all spans and sort them
            // using the provided comparison function
            var spanColorsList = [];
            for (var i = 0; i < spans.length; i++) {
                var span = spans[i];
                var spanColors = [];

                for (var x = span.lowerIndex; x <= span.upperIndex; x++) {
                    var pixel = image.getPixelXY(x, y);
                    spanColors.push(pixel);
                }
                
                spanColors.sort(sortComparisonFunction);
                spanColorsList.push(spanColors);
            }

            // Write into result image
            for (var x = 0; x < image.width; x++) {
                var currentColor = image.getPixelXY(x, y);

                // Find a span that contains the current X index
                for (var i = 0; i < spans.length; i++) {
                    var span = spans[i];
                    var colors = spanColorsList[i];

                    if (span.isInSpan(x)) {
                        currentColor = colors[x - span.lowerIndex];
                        break;
                    }
                }
                
                resultImage.setPixelXY(x, y, currentColor);
            }
        }

        return resultImage;
    }
}