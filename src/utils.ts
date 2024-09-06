import random from "lodash/random";
import { Direction, ShipType, TCoords } from "@/types/type";
import {
    coordsType,
    directionTypes,
    numberRegExp,
    shipsLength,
} from "@/consts";
import GameBoard from "@/gameboard";
import Coords from "@/coords";

export const generateRandomCoords = (): Coords =>
    new Coords({ x: random(1, 10), y: random(1, 10) });

export const generateRandomDir = (): Direction =>
    directionTypes[random(1) as 0 | 1];

export const generateRandomShip = ({
    gameboard,
    shipType,
}: {
    gameboard: GameBoard;
    shipType: ShipType;
}) => {
    let coords = generateRandomCoords();
    const direction = generateRandomDir();
    if (direction === "hor" && coords.x + shipsLength[shipType] > 10) {
        const { x, y } = coords;
        coords.x = x - 1;
    } else if (direction === "vert" && coords.y + shipsLength[shipType] > 10) {
        const { x, y } = coords;
        coords.y = y - 1;
    }
    try {
        gameboard.placeShip({
            coords,
            direction,
            type: shipType,
        });
    } catch (e) {
        generateRandomShip({ gameboard, shipType });
    }
};

export const generateGameBoardCells = (): Map<string, boolean> => {
    const map = new Map<string, boolean>();

    coordsType.forEach((coordsType) => {
        for (let i = 1; i <= 10; i++) {
            for (let j = 1; j <= 10; j++) {
                map.set(`(${i},${j})`, false);
            }
        }
    });

    return map;
};

export const convertStringToCoords = (str: string): TCoords => {
    const [x, y] = str.split(",").map((word) => {
        if (word) {
            const matches = word.match(numberRegExp);
            if (!matches) return;
            return Number(matches[0]);
        }
    });

    if (!x || !y) throw new Error("Invalid string provided");
    return { x, y };
};

export const isGameboardValid = (gameboard: GameBoard) => {
    let isMatch = false;
    if (gameboard.ships.size <= 4) return false;
    else {
        gameboard.ships.forEach((currentShip, currentShipType) => {
            for (const [anyShipType, anyShip] of gameboard.ships.entries()) {
                if (currentShipType != anyShipType) {
                    for (const anyShipCoords of anyShip) {
                        for (const currentShipCoords of currentShip) {
                            isMatch =
                                anyShipCoords.toString() !==
                                currentShipCoords.toString();
                            if (isMatch) break;
                        }
                        if (isMatch) break;
                    }
                }
            }
        });
    }
    return isMatch;
};
