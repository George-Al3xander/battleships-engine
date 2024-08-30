import GameBoard from "@/gameboard";
import Ship from "@/ship";
import { after } from "lodash";
import { Coords, ShipType } from "@/types/type";
import { shipsLength } from "@/consts";

describe("GameBoard", () => {
    it("should place a ship", () => {
        const gameboard = new GameBoard();

        gameboard.placeShip({
            shipType: "cruiser",
            coords: { x: 1, y: 4 },
            direction: "hor",
        });

        expect(gameboard.ships["cruiser"]).toBeInstanceOf(Ship);
        expect(gameboard.ships["cruiser"]).toHaveProperty("coords");
        expect(gameboard.ships["cruiser"]).toHaveProperty("direction");
        expect(gameboard.ships["cruiser"]?.coords.x).toBe(1);
        expect(gameboard.ships["cruiser"]?.coords.y).toBe(4);
        expect(gameboard.ships["cruiser"]?.direction).toBe("hor");
    });
    describe("receiveAttack", () => {
        let gameboard: GameBoard | null = null;
        beforeEach(() => {
            gameboard = new GameBoard();
            gameboard.placeShip({
                shipType: "cruiser",
                coords: { x: 2, y: 1 },
                direction: "hor",
            });

            gameboard.placeShip({
                shipType: "battleship",
                coords: { x: 9, y: 1 },
                direction: "vert",
            });

            gameboard.placeShip({
                shipType: "submarine",
                coords: { x: 4, y: 9 },
                direction: "hor",
            });

            jest.spyOn(gameboard.ships["cruiser"]!, "hit");
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
            expect(gameboard!.ships["cruiser"]?.hit).toHaveBeenCalledTimes(2);
            expect(gameboard!.receiveAttack).toHaveBeenCalledTimes(10);
        });

        it("should sunk the ship", () => {
            expect(gameboard!.ships["cruiser"]?.isSunk()).toBe(true);
            expect(gameboard!.ships["cruiser"]?.beenHitTimes).toBe(2);
        });
        it("should add the coordinates to the 'missed' array", () => {
            expect(gameboard!.missed).toHaveLength(1);
        });
    });

    describe("defeat check", () => {
        it("should report whether or not all of the ships have been sunk.", () => {
            const gameboard = new GameBoard();

            const ships: { type: ShipType; coords: Coords }[] = [
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
                    shipType: type,
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
});
