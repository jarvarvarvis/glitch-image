import { ColumnData, ImageView, RowData } from "../image_view";

export class ColumnRowRowData extends RowData {
    constructor(x) {
        super();
        this.x = x;
    }
}

export class ColumnRowColumnData extends ColumnData {
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

export class ColumnRowImageView extends ImageView {
    constructor(image) {
        super(image);
    }

    *rows() {
        for (var x = 0; x < this.image.width; x++) {
            yield new ColumnRowRowData(x);
        }
    }

    *columns(row) {
        for (var y = 0; y < this.image.height; y++) {
            yield new ColumnRowColumnData(row.x, y);
        }
    }
}