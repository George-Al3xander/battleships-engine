import { directionTypes, shipsLength } from "@/consts";
import Ship from "@/ship";

import { TCoords, Direction, ShipType } from "@/types/type";
import {
    convertStringToCoords,
    generateGameBoardCells,
    generateRandomDir,
    generateRandomShip,
} from "@/utils";
import Coords from "@/coords";
import random from "lodash/random";

export default class GameBoard {
    ships: Map<ShipType, Ship> = new Map();
    takenCells: Map<string, ShipType> = new Map();
    missed: Map<string, boolean> = generateGameBoardCells();

    constructor(ships?: Map<ShipType, Ship>) {
        if (ships) {
            this.ships = ships;
            this.ships.forEach((...params) =>
                this.fillTakenCellsWithShip(...params),
            );
        } else this.randomlyPlaceShips();
    }

    private fillTakenCellsWithShip(
        ship: Ship,
        shipType: ShipType,
        _map?: Map<ShipType, Ship>,
    ) {
        for (const coord of ship)
            this.takenCells.set(coord.toString(), shipType);
    }

    inspectCoordsInShips({
        coords: paramCoords,
        missCb,
        matchCb,
    }: {
        coords: TCoords;
        matchCb: (ship: Ship) => void;
        missCb: () => void;
    }) {
        if (this.ships.size > 0) {
            const coords = new Coords(paramCoords);
            const shipType = this.takenCells.get(coords.toString());

            if (shipType) {
                const ship = this.ships.get(shipType);
                if (!ship) throw new Error(`${shipType} does not exist`);
                matchCb(ship);
            } else missCb();
        } else missCb();
    }

    public placeShip({
        shipType,
        ...params
    }: {
        shipType: ShipType;
        coords: TCoords;
        direction: Direction;
    }) {
        this.inspectCoordsInShips({
            coords: params.coords,
            missCb: () => {
                const newShip = new Ship({
                    length: shipsLength[shipType],
                    ...params,
                });
                for (const coords of newShip) {
                    if (this.takenCells.has(coords.toString())) {
                        throw new Error(
                            "Ship placement error: The ship overlaps with another ship.",
                        );
                    }
                }
                this.ships.set(shipType, newShip);
                this.fillTakenCellsWithShip(newShip, shipType);
            },
            matchCb: () => {
                throw new Error(
                    "Ship placement error: The ship overlaps with another ship.",
                );
            },
        });
    }

    public receiveAttack(coords: TCoords) {
        const coordsClass = new Coords(coords);
        if (this.missed.get(coordsClass.toString()) === true)
            throw new Error(
                `The coordinate (X: ${coords.x}, Y: ${coords.y}) has already been targeted and missed.`,
            );

        const fromTaken = this.takenCells.get(coordsClass.toString());
        if (fromTaken) {
            const ship = this.ships.get(fromTaken);

            if (!ship) throw new Error(`${fromTaken} does not exist`);
            else ship.hit();
        } else this.missed.set(coordsClass.toString(), true);
    }

    public hasLost() {
        const currShips = Array.from(this.ships.keys());
        if (currShips.length > 0) {
            return !currShips
                .map((ship) => this.ships.get(ship)?.isSunk())
                .includes(false);
        } else return false;
    }

    public randomlyPlaceShip({
        shipType,
        direction = generateRandomDir(),
    }: {
        shipType: ShipType;
        direction?: Direction;
    }) {
        if (this.takenCells.size > 0) {
            const allCells = generateGameBoardCells();
            const emptyCells: string[] = [];
            for (const [cell] of allCells) {
                if (!this.takenCells.has(cell)) emptyCells.push(cell);
            }

            const shipLength = shipsLength[shipType];

            const possibleStarts = emptyCells.filter((str) => {
                const { x, y } = convertStringToCoords(str);
                const newShip = new Ship({
                    coords: { x, y },
                    direction,
                    length: shipLength,
                });
                let isValid = true;

                if (direction === "hor") isValid = x + shipLength <= 10;
                else isValid = y + shipLength <= 10;

                if (isValid) {
                    for (const coord of newShip) {
                        isValid = !this.takenCells.has(coord.toString());
                        if (!isValid) break;
                    }
                } else {
                    return false;
                }
                return isValid;
            });

            if (possibleStarts.length === 0) {
                this.randomlyPlaceShip({
                    shipType,
                    direction: directionTypes.find((dir) => dir !== direction),
                });
            } else {
                const randomStart =
                    possibleStarts[random(possibleStarts.length - 1)];

                if (!randomStart) throw new Error("No available space");

                this.placeShip({
                    shipType,
                    coords: convertStringToCoords(randomStart),
                    direction,
                });
            }
        } else {
            generateRandomShip({ gameboard: this, shipType });
        }
    }

    randomlyPlaceShips() {
        this.ships = new Map();
        (Object.keys(shipsLength) as ShipType[]).forEach((shipType) =>
            this.randomlyPlaceShip({ shipType }),
        );
    }
}
