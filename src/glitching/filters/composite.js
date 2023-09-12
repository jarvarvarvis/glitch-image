import { Filter } from "../filter";

export class CompositeFilter extends Filter {
    constructor(...filters) {
        super();
        this.filters = [...filters];
        console.log(this.filters);
    }

    applyToPixel(x, y, pixel) {
        var currentPixel = pixel;
        for (var i = 0; i < this.filters.length; i++) {
            var filter = this.filters[i];
            currentPixel = filter.applyToPixel(x, y, currentPixel);
        }
        return currentPixel;
    }
    
    applyToImage(image) {
        return super.applyToImage(image);
    }
}