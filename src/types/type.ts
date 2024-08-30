export type ShipType =
    | "aircraft_carrier"
    | "battleship"
    | "destroyer"
    | "submarine"
    | "cruiser";

export type Direction = "hor" | "vert";

export type Coords = {
    x: number;
    y: number;
};
