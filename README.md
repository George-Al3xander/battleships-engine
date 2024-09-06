# Battleship Engine

This TypeScript package is a core engine for implementing the classic game of Battleship. It allows for the creation of game boards, the placement of ships, and tracking of hits and misses, as well as determining when a player has lost.

## Features

- Create and manage a game board.
- Place ships randomly or manually.
- Track hits, misses, and sunken ships.
- Detect when a player has lost the game.

## Installation

To install the package, run:

```bash
npm install battleship-ts-engine
```

## Usage

### Importing

You can import the necessary classes and types from the package:

```typescript
import GameBoard from "battleships-engine";
import { TCoords, ShipType, Direction } from "battleships-engine/types";
```

### Example

#### Creating a Game Board

You can create a new game board, either with predefined ships or by randomly placing them:
```typescript
const gameBoard = new GameBoard();
gameBoard.randomlyPlaceShips();
```

#### Placing a Ship Manually

```typescript
gameBoard.placeShip({
    type: "battleship",
       coords: { x: 3, y: 5 },
           direction: "hor", // horizontal
});
```
 #### Receiving an Attack

```typescript
gameBoard.receiveAttack({ x: 3, y: 5 });
```

#### Checking if a Player has Lost

```typescript
if (gameBoard.hasLost()) {
    console.log("You have lost the game!");
}
```

## API Reference

### `GameBoard`

The `GameBoard` class is responsible for managing the state of the game board, including ships, hits, and misses.

- `ships: Map<ShipType, Ship>`: A map containing the ships on the board.
- `takenCells: Map<string, ShipType>`: A map of all cells occupied by ships.
- `missed: Map<string, boolean>`: A map of all missed attacks.

#### Methods:

- `randomlyPlaceShips()`: Randomly places ships on the game board.
- `placeShip(params: { type: ShipType; coords: TCoords; direction: Direction })`: Places a ship on the game board at specific coordinates and direction.
- `receiveAttack(coords: TCoords)`: Processes an attack at the given coordinates.
- `hasLost()`: Returns `true` if all ships are sunk.

### `Ship`

The `Ship` class defines a ship's properties and actions.

- `type: ShipType`: The type of the ship.
- `length: number`: The length of the ship.
- `beenHitTimes: number`: The number of times the ship has been hit.

#### Methods:

- `hit()`: Marks the ship as hit.
- `isSunk()`: Returns `true` if the ship is completely sunk.

### `Coords`

The `Coords` class is used to represent a coordinate on the game board.

- `x: number`: The x-coordinate.
- `y: number`: The y-coordinate.

#### Methods:

- `toString()`: Returns the coordinate in string format as `(x,y)`.


