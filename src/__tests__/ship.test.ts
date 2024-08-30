import Ship from "@/ship";

describe("Ship class", () => {
    it("should be truthy", () => {
        expect(Ship).toBeTruthy();
    });
    it("should throw an error if the constructor's parameter's wrong", () => {
        expect(
            () =>
                new Ship({
                    coords: { x: 1, y: 4 },
                    length: 1,
                    direction: "hor",
                }),
        ).toThrow("Length should more than or equal to 2");

        expect(
            () =>
                new Ship({
                    coords: { x: -2, y: 1 },
                    length: 4,
                    direction: "hor",
                }),
        ).toThrow("X should be greater than 0");

        expect(
            () =>
                new Ship({
                    coords: { x: 1, y: -40 },
                    length: 4,
                    direction: "hor",
                }),
        ).toThrow("Y should be greater than 0");

        expect(
            () =>
                new Ship({
                    coords: { x: 12, y: 10 },
                    length: 4,
                    direction: "hor",
                }),
        ).toThrow("X should be less than or equal to 10");

        expect(
            () =>
                new Ship({
                    coords: { x: 10, y: 12 },
                    length: 4,
                    direction: "hor",
                }),
        ).toThrow("Y should be less than or equal to 10");

        expect(
            () =>
                new Ship({
                    coords: { x: 10, y: 10 },
                    length: 4,
                    //@ts-ignore
                    direction: "invalid",
                }),
        ).toThrow("Invalid direction type");
    });

    it("should have default properties", () => {
        const ship = new Ship({
            coords: { x: 0, y: 4 },
            length: 4,
            direction: "hor",
        });
        const correctProperties = [
            "length",
            "coords",
            "direction",
            "isSunk",
            "hit",
        ];
        const wrongProperties = ["iDoNotExist", "foo", "bar"];
        correctProperties.forEach((prop) => expect(ship).toHaveProperty(prop));
        wrongProperties.forEach((prop) =>
            expect(ship).not.toHaveProperty(prop),
        );
    });

    it("should change isSunk after ship been fully hit", () => {
        const length = 4;
        const ship = new Ship({
            coords: { x: 0, y: 4 },
            length,
            direction: "hor",
        });

        for (let i = 0; i < length; i++) {
            ship.hit();
        }

        expect(ship.isSunk()).toBe(true);
    });
});
