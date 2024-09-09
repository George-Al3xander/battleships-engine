import type { ShipType } from "@/types/type";

export const shipsLength: { [K in ShipType]: number } = {
    aircraft_carrier: 5,
    battleship: 4,
    destroyer: 3,
    submarine: 3,
    cruiser: 2,
};

export const directionTypes = ["vert", "hor"] as const;
export const coordsType = ["x", "y"] as const;
export const numberRegExp = /\d+/;
