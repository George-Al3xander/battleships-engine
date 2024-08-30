import { shipsLength } from "@/consts";
import Ship from "@/ship";
import some from "lodash/some";
import isEqual from "lodash/isEqual";
import filter from "lodash/filter";
import { Coords, Direction, ShipType } from "@/types/type";

export default class GameBoard {
    ships: {
        [K in ShipType]?: Ship;
    } = {};
    missed: Coords[] = [];

    inspectCoordsInShips({
        coords,
        missCb,
        matchCb,
    }: {
        coords: Coords;
        matchCb: (ship: Ship) => void;
        missCb: () => void;
    }) {
        const currShips = Object.keys(this.ships);
        if (currShips.length > 0)
            currShips.forEach((shipType) => {
                const ship = this.ships[shipType as ShipType];
                if (!ship) throw new Error(`${shipType} does not exist`);
                let isMatch = false;

                for (let i = 0; i < ship.length; i++) {
                    if (
                        (ship.direction === "hor" &&
                            isEqual(
                                { y: ship.coords.y, x: ship.coords.x + i },
                                coords,
                            )) ||
                        (ship.direction === "vert" &&
                            isEqual(
                                { y: ship.coords.y + i, x: ship.coords.x },
                                coords,
                            ))
                    ) {
                        isMatch = true;

                        break;
                    }
                }

                if (isMatch) matchCb(ship);
                else missCb();
            });
        else missCb();
    }

    placeShip({
        shipType,
        ...params
    }: {
        shipType: ShipType;
        coords: Coords;
        direction: Direction;
    }) {
        this.inspectCoordsInShips({
            coords: params.coords,
            missCb: () => {
                this.ships[shipType] = new Ship({
                    length: shipsLength[shipType],
                    ...params,
                });
            },
            matchCb: () => {
                throw new Error(
                    "Ship placement error: The ship overlaps with another ship.",
                );
            },
        });
    }

    receiveAttack(coords: Coords) {
        if (some(this.missed, coords))
            throw new Error(
                `The coordinate (X: ${coords.x}, Y: ${coords.y}) has already been targeted and missed.`,
            );

        this.inspectCoordsInShips({
            coords: coords,
            matchCb: (ship) => ship.hit(),
            missCb: () => {
                if (some(this.missed, coords))
                    this.missed = filter(this.missed, coords);
                else this.missed.push(coords);
            },
        });
    }

    hasLost() {
        const currShips = Object.keys(this.ships);
        if (currShips.length > 0) {
            return !currShips
                .map((ship) => this.ships[ship as ShipType]?.isSunk())
                .includes(false);
        } else return false;
    }
}
