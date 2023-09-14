export class PixelSpan {
    constructor() {
        this.coordinates = [];
    }

    addCoordinate(coordinate) {
        this.coordinates.push(coordinate);
    }

    isInSpan(searched) {
        return this.coordinates
            .find(
                value => value.x == searched.x && value.y == searched.y
            ) != undefined;
    }

    findIndex(searched) {
        return this.coordinates
            .findIndex(
                value => value.x == searched.x && value.y == searched.y
            );
    }

    toString() {
        return "PixelSpan(" +
            "coordinates=" + String(this.coordinates) +
            ")";
    }
}