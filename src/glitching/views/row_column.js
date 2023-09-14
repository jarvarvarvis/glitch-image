import { ColumnData, ImageView, RowData } from "../image_view";

export class RowColumnRowData extends RowData {
    constructor(y) {
        super();
        this.y = y;
    }
}

export class RowColumnColumnData extends ColumnData {
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

export class RowColumnImageView extends ImageView {
    constructor(image) {
        super(image);
    }

    *rows() {
        for (var y = 0; y < this.image.height; y++) {
            yield new RowColumnRowData(y);
        }
    }

    *columns(row) {
        for (var x = 0; x < this.image.width; x++) {
            yield new RowColumnColumnData(x, row.y);
        }
    }
}