import { ColumnData, ImageView, RowData } from "../image_view";

export class ReverseRowColumnRowData extends RowData {
    constructor(x) {
        super();
        this.x = x;
    }
}

export class ReverseRowColumnColumnData extends ColumnData {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    getXY() {
        return {
            x: this.x,
            y: this.y,
        }
    }
}

export class ReverseRowColumnImageView extends ImageView {
    constructor(image) {
        super(image);
    }

    *rows() {
        for (var x = 0; x < this.image.width; x++) {
            yield new ReverseRowColumnRowData(x);
        }
    }

    *columns(row) {
        for (var y = this.image.height - 1; y >= 0; y--) {
            yield new ReverseRowColumnColumnData(row.x, y);
        }
    }
}