import { Filter } from "../filter";

export class CompositeFilter extends Filter {
    constructor(...filters) {
        super();
        this.filters = [...filters];
    }

    applyToPixel(image, x, y) {
        var pixel = image.getPixelXY(x, y);

        var currentPixel = pixel;
        for (var i = 0; i < this.filters.length; i++) {
            var filter = this.filters[i];
            
            // Temporarily store the current pixel into the
            // image to pass it to the next filter
            var previousPixel = image.getPixelXY(x, y);
            image.setPixelXY(x, y, currentPixel);
            currentPixel = filter.applyToPixel(image, x, y);
            image.setPixelXY(x, y, previousPixel);
        }
        
        return currentPixel;
    }
    
    applyToImage(image) {
        return super.applyToImage(image);
    }
}