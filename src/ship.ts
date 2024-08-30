import { Coords, Direction } from "@/types/type";
import { coordType, directionTypes } from "@/consts";

export default class Ship {
    public length: number = 0;
    beenHitTimes: number = 0;
    public coords: Coords = { x: 0, y: 0 };
    public direction: Direction = "hor";
    constructor({
        coords,
        length,
        direction,
    }: {
        coords: Coords;
        direction: Direction;
        length: number;
    }) {
        if (length < 2)
            throw new Error("Length should more than or equal to 2");

        coordType.forEach((coordType) => {
            const num = coords[coordType];
            if (num < 1)
                throw new Error(
                    `${coordType.toUpperCase()} should be greater than 0`,
                );
            if (num > 10)
                throw new Error(
                    `${coordType.toUpperCase()} should be less than or equal to 10`,
                );
        });

        if (!directionTypes.includes(direction))
            throw new Error("Invalid direction type");

        this.length = length;
        this.direction = direction;
        this.coords = coords;
    }

    hit() {
        this.beenHitTimes = this.beenHitTimes + 1;
    }
    isSunk() {
        return this.beenHitTimes === this.length;
    }
}
