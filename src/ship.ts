import type { Direction, ShipType, TCoords } from "@/types/type";
import { directionTypes, shipsLength } from "@/consts";
import Coords from "@/coords";

export default class Ship {
    readonly length: number = 0;
    public type: ShipType;
    beenHitTimes: number = 0;
    coords: Coords;
    public direction: Direction = "hor";
    constructor({
        coords,
        type,
        direction,
    }: {
        coords: TCoords;
        direction: Direction;
        type: ShipType;
    }) {
        if (!Object.keys(shipsLength).includes(type))
            throw new Error("Invalid ship type");
        this.type = type;

        this.length = shipsLength[type];
        if (this.length < 2)
            throw new Error("Length should more than or equal to 2");

        if (!directionTypes.includes(direction))
            throw new Error("Invalid direction type");

        this.coords = new Coords(coords);

        this.direction = direction;
    }

    hit() {
        if (this.beenHitTimes >= this.length) {
            throw new Error("This ship has already sunk.");
        }
        this.beenHitTimes++;
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
