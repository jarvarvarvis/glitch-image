export class RowData {
    constructor() {
    }
}

export class ColumnData {
    constructor() {
    }

    /**
     * Returns the true pixel coordinates in the image
     * 
     * @returns An object containing the pixel coordinates: `{x: ..., y: ...}`
     */
    getXY() {
    }
}

export class ImageView {
    constructor(image) {
        this.image = image;
    }

    /**
     * Returns a list of row data of the image view.
     * 
     * This list can be iterated over in a for loop or using 
     * `forEach`.
     * 
     * @returns A list of row data
     */
    rows() {
    }

    /**
     * Returns a list of column data of the current row of the image
     * view. 
     * 
     * This list can be iterated over in a for loop or using
     * `forEach`.
     * 
     * @param {*} row The current row
     * @returns A list of column data for the current row
     */
    columns(row) {
    }

    /**
     * Returns the pixel value of the internal image at (x,y).
     * 
     * @param {*} x The x coordinate
     * @param {*} y The y coordinate
     * @returns The pixel value (an array of numbers) of the image
     */
    getPixelXY(x, y) {
        return this.image.getPixelXY(x, y);
    }
}