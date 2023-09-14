import Image from "image-js";

export class Glitcher {
    constructor(spanGatherer, sortComparisonFunction) {
        this.spanGatherer = spanGatherer;
        this.sortComparisonFunction = sortComparisonFunction;
    }

    glitchImage(imageView) {
        var resultImage = Image.createFrom({
            width: imageView.image.width,
            height: imageView.image.height,
            kind: "RGB"
        });

        //for (var y = 0; y < image.height; y++) {
        for (var row of imageView.rows()) {
            var spans = this.spanGatherer.gatherSpansAt(imageView, row);

            // Gather the colors in all spans and sort them
            // using the provided comparison function
            var spanColorsList = [];
            for (var i = 0; i < spans.length; i++) {
                var span = spans[i];
                var spanColors = [];

                for (var coordinate of span.coordinates) {
                    var pixel = imageView.getPixelXY(coordinate.x, coordinate.y);
                    spanColors.push(pixel);
                }
                
                spanColors.sort(this.sortComparisonFunction);
                spanColorsList.push(spanColors);
            }

            // Write into result image
            //for (var x = 0; x < image.width; x++) {
            for (var column of imageView.columns(row)) {
                var { x, y } = column.getXY();
                var currentColor = imageView.getPixelXY(x, y);

                // Find a span that contains the current X index
                for (var i = 0; i < spans.length; i++) {
                    var span = spans[i];
                    var colors = spanColorsList[i];

                    var colorIndex = span.findIndex({x: x, y: y});
                    if (colorIndex != -1) {
                        currentColor = colors[colorIndex];
                        break;
                    }
                }
                
                resultImage.setPixelXY(x, y, currentColor);
            }
        }

        return resultImage;
    }
}