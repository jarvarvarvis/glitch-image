import { ColumnData, ImageView, RowData } from "../image_view";

export class InvertedRowColumnRowData extends RowData {
    constructor(y) {
        super();
        this.y = y;
    }
}

export class InvertedRowColumnColumnData extends ColumnData {
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

export class InvertedRowColumnImageView extends ImageView {
    constructor(image) {
        super(image);
    }

    *rows() {
        for (var y = 0; y < this.image.height; y++) {
            yield new InvertedRowColumnRowData(y);
        }
    }

    *columns(row) {
        for (var x = this.image.width - 1; x >= 0; x--) {
            yield new InvertedRowColumnColumnData(x, row.y);
        }
    }
}