import random from "lodash/random";
import { coordsType } from "@/consts";
import type { TCoords } from "@/types/type";

export default class Coords {
    x: number = random(1, 10);
    y: number = random(1, 10);
    constructor(coords?: TCoords) {
        if (coords) {
            const { x, y } = coords;
            if (x > 10) {
                throw new Error("X should be less than or equal to 10");
            } else {
                this.x = x;
            }

            if (y > 10) {
                throw new Error("Y should be less than or equal to 10");
            } else {
                this.y = y;
            }

            if (x < 1) {
                throw new Error("X should be greater than 0");
            } else {
                this.x = x;
            }

            if (y < 1) {
                throw new Error("Y should be greater than 0");
            } else {
                this.y = y;
            }
        }
    }

    toString() {
        return `(${this.x},${this.y})`;
    }

    *[Symbol.iterator]() {
        for (const coordType of coordsType) {
            yield {
                type: coordType,
                number: this[coordType],
            };
        }
    }
}
