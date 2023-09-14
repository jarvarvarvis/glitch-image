import { ColumnData, ImageView, RowData } from "../image_view";

export class ReverseColumnRowRowData extends RowData {
    constructor(y) {
        super();
        this.y = y;
    }
}

export class ReverseColumnRowColumnData extends ColumnData {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    getXY() {
        return {
            x: this.x,
            y: this.y,
        };
    }
}

export class ReverseColumnRowImageView extends ImageView {
    constructor(image) {
        super(image);
    }

    *rows() {
        for (var y = 0; y < this.image.height; y++) {
            yield new ReverseColumnRowRowData(y);
        }
    }

    *columns(row) {
        for (var x = this.image.width - 1; x >= 0; x--) {
            yield new ReverseColumnRowColumnData(x, row.y);
        }
    }
}