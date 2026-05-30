export { Player }

class Ship {
    constructor(length, coords) {
        this.length = length;
        this.coords = coords;
        this.hits = 0;
        this.sunk = false;
    }

    hit() {
        this.hits++;
    }

    isSunk() {
        if (this.hits === this.length) {
            this.sunk = true;
        }
        return this.sunk
    }
}

class Gameboard {
    constructor() {
        this.ships = [];
        this.adjacent = [];
        this.missed = [];
        this.hits = [];
    }

    placeShip(length, coords) {
        this.ships.push(new Ship(length, coords));
        this.adjacent.push(...this.calculateAdjacent(coords));
    }

    recieveAttack(coords) {
        for (let i = 0; i < this.ships.length; i++) {
            let current = this.ships[i];
            if (this.checkInclusion(current.coords, coords)) {
                if (this.checkInclusion(this.hits, coords)) return
                current.hit();
                this.hits.push(coords);
                current.isSunk();
                return
            }
        }
        this.missed.push(coords);
    }

    checkInclusion(array, coords) {
        for (let i = 0; i < array.length; i++) {
            let current = array[i];
            if (current[0] === coords[0] && current[1] === coords[1]) return true
        }
        return false
    }

    checkGameOver() {
        for (let i = 0; i < this.ships.length; i++) {
            let current = this.ships[i];
            if (current.sunk === false) return false
        }
        return true
    }

    isValidPosition(coords) {
        for (let i = 0; i < this.ships.length; i++) {
            let current = this.ships[i];
            for (let i = 0; i < current.coords.length; i++) {
                let position = current.coords[i];
                if (this.checkInclusion(coords, position)) return false
            }
        }
        for (let i = 0; i < coords.length; i++) {
            let current = coords[i];
            if (this.checkInclusion(this.adjacent, current)) return false
        }
        return true
    }

    calculateAdjacent(coords) {
        let adjacent = [];
        let orientation = this.getOrientation(coords)
        let start = coords[0];
        let end = coords[coords.length - 1];
        if (orientation === "vertical+") {
            adjacent.push([start[0] - 1, start[1]]);
            adjacent.push([end[0] + 1, end[1]]);
        }
        else if (orientation === "vertical-") {
            adjacent.push([start[0] + 1, start[1]]);
            adjacent.push([end[0] - 1, end[1]]);
        }
        else if (orientation === "horizontal+") {
            adjacent.push([start[0], start[1] - 1]);
            adjacent.push([end[0], end[1] + 1]);
        }
        else {
            adjacent.push([start[0], start[1] + 1]);
            adjacent.push([end[0], end[1] - 1]);
        }
        for (let i = 0; i < coords.length; i++) {
            let current = coords[i];
            if (orientation === "vertical+" || orientation === "vertical-") {
                adjacent.push([current[0], current[1] - 1]);
                adjacent.push([current[0], current[1] + 1]);
            }
            else {
                adjacent.push([current[0] - 1, current[1]]);
                adjacent.push([current[0] + 1, current[1]]);
            }
        }
        adjacent = adjacent.filter((position) => !this.isOutOfBounds(position));
        return adjacent
    }

    getOrientation(coords) {
        let index1 = coords[0];
        let index2 = coords[1];

        if (index1[1] === index2[1]) {
            if (index1[0] < index2[0]) return "vertical+"
            else return "vertical-"
        }
        else if (index1[1] < index2[1]) return "horizontal+"
        else return "horizontal-"
    }

    isOutOfBounds(position) {
        if (position[0] < 0 || position[0] > 9 || position[1] < 0 || position[1] > 9) return true
        else return false
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.gameBoard = new Gameboard;
    }
}