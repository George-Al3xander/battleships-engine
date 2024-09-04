import { Direction, TCoords } from "@/types/type";
import { directionTypes } from "@/consts";
import Coords from "@/coords";

export default class Ship {
    public length: number = 0;
    beenHitTimes: number = 0;
    coords: Coords;
    public direction: Direction = "hor";
    constructor({
        coords,
        length,
        direction,
    }: {
        coords: TCoords;
        direction: Direction;
        length: number;
    }) {
        if (length < 2)
            throw new Error("Length should more than or equal to 2");

        if (!directionTypes.includes(direction))
            throw new Error("Invalid direction type");

        this.coords = new Coords(coords);
        this.length = length;
        this.direction = direction;
    }

    hit() {
        this.beenHitTimes = this.beenHitTimes + 1;
    }
    isSunk() {
        return this.beenHitTimes === this.length;
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            let obj = { x: this.coords.x, y: this.coords.y + i } as TCoords;
            if (this.direction === "hor")
                obj = {
                    x: this.coords.x + i,
                    y: this.coords.y,
                };

            yield { toString: new Coords(obj).toString, ...obj };
        }
    }
}
