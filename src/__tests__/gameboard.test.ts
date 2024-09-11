import GameBoard from "@/gameboard";
import Ship from "@/ship";
import type { ShipType, TCoords } from "@/types/type";
import { shipsLength } from "@/consts";
import { isGameboardValid } from "@/utils";

describe("GameBoard", () => {
    it("should place a ship", () => {
        const gameboard = new GameBoard();
        gameboard.placeShip({
            type: "cruiser",
            coords: { x: 1, y: 4 },
            direction: "hor",
        });

        expect(gameboard.ships.get("cruiser")).toBeInstanceOf(Ship);
        expect(gameboard.ships.get("cruiser")).toHaveProperty("coords");
        expect(gameboard.ships.get("cruiser")).toHaveProperty("direction");
        expect(gameboard.ships.get("cruiser")?.coords.x).toBe(1);
        expect(gameboard.ships.get("cruiser")?.coords.y).toBe(4);
        expect(gameboard.ships.get("cruiser")?.direction).toBe("hor");
    });

    it("should throw the ship overlap error", () => {
        const gameboard = new GameBoard();
        gameboard.placeShip({
            type: "cruiser",
            coords: { x: 1, y: 4 },
            direction: "hor",
        });

        try {
            gameboard.placeShip({
                type: "cruiser",
                coords: { x: 2, y: 4 },
                direction: "vert",
            });
            expect(1).toBe(2);
        } catch (e) {
            expect(e instanceof Error ? e.message : "Bad").toBe(
                "Ship placement error: The ship overlaps with another ship.",
            );
        }
    });

    describe("utils", () => {
        it("should fill taken cells with  ship coordinates", () => {
            const gameboard = new GameBoard();
            const type: ShipType = "aircraft_carrier";
            const size = shipsLength[type];
            gameboard.takenCells = new Map();
            expect(gameboard.takenCells.size).toBe(0);
            const ship = new Ship({
                type,
                coords: { x: 1, y: 4 },
                direction: "hor",
            });
            (gameboard as any).fillTakenCellsWithShip(ship, "aircraft_carrier");

            for (const coord of ship) {
                expect(gameboard.takenCells.has(coord.toString())).toBe(true);
            }
            expect(gameboard.takenCells.size).toBe(size);
        });

        it("should inspect", () => {
            const gameboard = new GameBoard([
                new Ship({
                    type: "cruiser",
                    direction: "hor",
                    coords: { x: 1, y: 1 },
                }),

                new Ship({
                    type: "battleship",
                    direction: "vert",
                    coords: { x: 1, y: 4 },
                }),
            ]);
            const matchCb = jest.fn();
            const missCb = jest.fn();
            (gameboard as any).inspectCoordsInShips({
                coords: { x: 1, y: 1 },
                matchCb,
                missCb,
            });

            (gameboard as any).inspectCoordsInShips({
                coords: { x: 1, y: 5 },
                matchCb,
                missCb,
            });

            (gameboard as any).inspectCoordsInShips({
                coords: { x: 9, y: 9 },
                matchCb,
                missCb,
            });

            expect(missCb).toHaveBeenCalledTimes(1);
            expect(matchCb).toHaveBeenCalledTimes(2);
        });
    });

    describe("receiveAttack", () => {
        let gameboard: GameBoard | null = null;
        beforeEach(() => {
            gameboard = new GameBoard();
            gameboard.placeShip({
                type: "cruiser",
                coords: { x: 2, y: 1 },
                direction: "hor",
            });

            gameboard.placeShip({
                type: "battleship",
                coords: { x: 9, y: 1 },
                direction: "vert",
            });

            gameboard.placeShip({
                type: "submarine",
                coords: { x: 4, y: 9 },
                direction: "hor",
            });

            jest.spyOn(gameboard.ships.get("cruiser")!, "hit");
            jest.spyOn(gameboard, "receiveAttack");

            gameboard.receiveAttack({ x: 2, y: 1 });
            gameboard.receiveAttack({ x: 3, y: 1 });

            gameboard.receiveAttack({ x: 4, y: 9 });
            gameboard.receiveAttack({ x: 5, y: 9 });
            gameboard.receiveAttack({ x: 6, y: 9 });

            gameboard.receiveAttack({ x: 9, y: 1 });
            gameboard.receiveAttack({ x: 9, y: 2 });
            gameboard.receiveAttack({ x: 9, y: 3 });
            gameboard.receiveAttack({ x: 9, y: 4 });

            gameboard.receiveAttack({ x: 4, y: 10 });
        });
        afterEach(() => jest.clearAllMocks());
        it("should call the hit function after the successful receiveAttack call", () => {
            const ship = gameboard!.ships.get("cruiser")!;
            expect(ship.hit).toHaveBeenCalledTimes(ship.length);
            expect(gameboard!.receiveAttack).toHaveBeenCalledTimes(10);
        });

        it("should sunk the ship", () => {
            expect(gameboard!.ships.get("cruiser")?.isSunk()).toBe(true);
            expect(gameboard!.ships.get("cruiser")?.beenHitTimes).toBe(2);
        });
        it("should add the coordinates to the 'missed' array", () => {
            expect(gameboard!.missed.get("(4,10)")).toBe(true);
        });
    });

    describe("defeat check", () => {
        it("should report whether or not all of the ships have been sunk.", () => {
            const gameboard = new GameBoard();
            const ships: { type: ShipType; coords: TCoords }[] = [
                {
                    type: "cruiser",
                    coords: { x: 1, y: 1 },
                },
                {
                    type: "battleship",
                    coords: { x: 1, y: 4 },
                },
            ];

            ships.forEach(({ type, coords }) => {
                gameboard.placeShip({
                    type,
                    coords,
                    direction: "hor",
                });
                for (let i = 0; i < shipsLength[type]; i++) {
                    gameboard.receiveAttack({ x: coords.x + i, y: coords.y });
                }
            });

            expect(gameboard.hasLost()).toBe(true);
        });
    });
    it("should randomly place ships", () => {
        const gameboard = new GameBoard();
        const oldShips = gameboard.ships;
        gameboard.randomlyPlaceShips();
        const newShips = gameboard.ships;
        expect(isGameboardValid(gameboard)).toBe(true);
        expect(oldShips).not.toMatchObject(newShips);
    });
});
