import Coords from "@/coords";

describe("Coords class", () => {
    it("should throw an error if x or y is incorrect", () => {
        expect(() => new Coords({ x: 12, y: 4 })).toThrow();
        expect(() => new Coords({ x: 1, y: 14 })).toThrow();
        expect(() => new Coords({ x: -1, y: 14 })).toThrow();
        expect(() => new Coords({ x: 1, y: -14 })).toThrow();
    });

    it("should properly return toString", () => {
        expect(new Coords({ x: 1, y: 4 }).toString()).toEqual("(1,4)");
    });

    it("should return correct value while iterate", () => {
        const coords = new Coords({ x: 1, y: 4 });
        expect(coords.x).toBe(1);
        expect(coords.y).toBe(4);
        [...coords].forEach((coord) => {
            if (coord!.type === "x") expect(coord!.number).toBe(1);
            else expect(coord!.number).toBe(4);
        });
    });
});
