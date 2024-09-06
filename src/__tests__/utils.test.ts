import GameBoard from "@/gameboard";
import {
    convertStringToCoords,
    generateRandomShip,
    isGameboardValid,
} from "@/utils";
import Ship from "@/ship";

const repeatTestTimes = (cb: Function, count: number | undefined = 5) => {
    for (let i = 0; i < count; i++) {
        cb();
    }
};

describe("generateRandomShip", () => {
    it("should generate a random ship object with a correct placement", () =>
        repeatTestTimes(() => {
            const gameboard = new GameBoard();

            generateRandomShip({ gameboard, shipType: "cruiser" });

            expect(
                gameboard.ships.get("cruiser")?.coords.x,
            ).toBeLessThanOrEqual(10);
            expect(
                gameboard.ships.get("cruiser")?.coords.y,
            ).toBeLessThanOrEqual(10);

            expect(
                gameboard.ships.get("cruiser")?.coords.x,
            ).toBeGreaterThanOrEqual(1);
            expect(
                gameboard.ships.get("cruiser")?.coords.y,
            ).toBeGreaterThanOrEqual(1);
        }));

    it("should not throw the ship overlap error", () =>
        repeatTestTimes(() => {
            const gameboard = new GameBoard();

            generateRandomShip({ gameboard, shipType: "cruiser" });
            try {
                generateRandomShip({ gameboard, shipType: "battleship" });
                expect(1).toBe(1);
            } catch (e) {
                expect(1).toBe(2);
            }
        }));
});

it("should convert string to a coords object", () => {
    expect(convertStringToCoords("(1,2)")).toMatchObject({ x: 1, y: 2 });
    expect(convertStringToCoords("(12,4)")).toMatchObject({ x: 12, y: 4 });
    expect(convertStringToCoords("( 12 , 4 )")).toMatchObject({ x: 12, y: 4 });
    expect(() => convertStringToCoords("bad string")).toThrow(
        "Invalid string provided",
    );
});

it("should check gameboard", () => {
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
        new Ship({
            type: "aircraft_carrier",
            direction: "hor",
            coords: { x: 1, y: 6 },
        }),
        new Ship({
            type: "destroyer",
            direction: "vert",
            coords: { x: 6, y: 1 },
        }),
        new Ship({
            type: "submarine",
            direction: "hor",
            coords: { x: 8, y: 4 },
        }),
    ]);

    expect(isGameboardValid(gameboard)).toBe(true);
});
