import { ColumnData, ImageView, RowData } from "../image_view";

export class ColumnRowRowData extends RowData {
    constructor(y) {
        super();
        this.y = y;
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
        };
    }
}

export class ColumnRowImageView extends ImageView {
    constructor(image) {
        super(image);
    }

    *rows() {
        for (var y = 0; y < this.image.height; y++) {
            yield new ColumnRowRowData(y);
        }
    }

    *columns(row) {
        for (var x = 0; x < this.image.width; x++) {
            yield new ColumnRowColumnData(x, row.y);
        }
    }
}