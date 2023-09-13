import { ImageView } from "../image_view";

export class RowColumnImageView extends ImageView {
    constructor(image) {
        super(image);
    }

    iterate(firstAxisConsumer) {
        for (var y = 0; y < this.image.height; y++) {
            var iterate = secondAxisConsumer => {
                for (var x = 0; x < this.image.width; x++) {
                    secondAxisConsumer({
                        x: x,
                        y: y,
                    });
                }
            };
            var firstAxis = { iterate };
            firstAxisConsumer(firstAxis);
        }
    }
}