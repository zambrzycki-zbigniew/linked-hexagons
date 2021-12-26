const oppositeDirection = {
    topLeftHex: 'bottomRightHex',
    leftHex: 'rightHex',
    topRightHex: 'bottomLeftHex',
    bottomRightHex: 'topLeftHex',
    rightHex: 'leftHex',
    bottomLeftHex: 'topRightHex'
}

const neighboursDict = {
    topLeftHex: ['leftHex', 'topRightHex'],
    leftHex: ['topLeftHex', 'bottomLeftHex'],
    topRightHex: ['topLeftHex', 'rightHex'],
    bottomRightHex: ['rightHex', 'bottomLeftHex'],
    rightHex: ['topRightHex', 'bottomRightHex'],
    bottomLeftHex: ['leftHex', 'bottomRightHex']
}

const positionDelta = {
    topLeftHex: { top: 3 / 4, left: 1 / 2 },
    leftHex: { top: 0, left: 1 },
    topRightHex: { top: 3 / 4, left: -1 / 2 },
    bottomRightHex: { top: -3 / 4, left: -1 / 2 },
    rightHex: { top: 0, left: -1 },
    bottomLeftHex: { top: -3 / 4, left: 1 / 2 }
}

const directions = ['topLeftHex', 'leftHex', 'topRightHex', 'bottomRightHex', 'rightHex', 'bottomLeftHex']

export default class Hex {
    constructor(hexes, parent = null, parentDirection = null, limit = 10, top = null, left = null) {
        hexes.push(this)
        this.visible = false
        this._floor = null
        this._figure = null
        this.floorResolved
        this.waitingForFloor = new Promise(resolve => this.floorResolved = resolve)
        this.waitingForFloor.then(() => { this.visible = true; this.floor.visible = true })
        this.figureResolved
        this.initialFigureComponentFound = false
        this.waitingForFigure = new Promise(resolve => {
            this.figureResolved = resolve
        })
        this.waitingForFigure.then(() => {
            this.initialFigureComponentFound = true
            this.figure.visible = true
        })
        this.children = []
        this.limit = limit
        this.topLeftHex = null
        this.leftHex = null
        this.topRightHex = null
        this.rightHex = null
        this.bottomRightHex = null
        this.bottomLeftHex = null
        if (hexes[0].top) this.top = hexes[0].top
        else if (parent) this.top = parent.top
        else if (top) this.top = top
        if (!this.top) this.top = 0
        if (hexes[0].left) this.left = hexes[0].left
        else if (parent) this.left = parent.left
        else if (left) this.left = left
        if (!this.left) this.left = 0
        this.style = {
            position: 'absolute',
            top: this.top,
            left: this.left
        }
        this._class = null
        this._figureClass = null
        this._figureSvgClass = null
        this.class = "hex"
        this.figureClass = "hexObj"
        this.figureSvgClass = "stickOut"
        this._height = 0
        this.width = 0
        this.countVertical = 0
        this.selectedObject = false
        this.selectedFloor = false
        this.hasObject = Math.random() > 1 || hexes[0] === this
        this.moveTo = {
            top: 0,
            left: 0,
            object: null,
            settle: false
        }
        this.color = "no pride"
        this._color = "#000000"
        if (parent && parentDirection) {
            this.parent = parent
            this.parentDirection = parentDirection
            this[parentDirection] = parent
        }
        this.calculatingHeight = null
    }

    set floor(f) {
        this._floor = f
        this.floorResolved(f)
    }

    get floor() {
        return this._floor
    }

    set figure(f) {
        this._figure = f
        if (!this.initialFigureComponentFound)
            this.figureResolved(f)
    }

    get figure() {
        return this._figure
    }

    get height() {
        return this._height
    }
    set height(h) {
        this._height = h
        this.width = h / 2 * Math.sqrt(3)
        this.calculatePosition()
        this.calculatingHeight = new Promise(resolve => { setTimeout(() => { resolve() }, 0) }).then(async () => {
            for (let child of this.children) {
                child.height = h
            }
        })
    }

    get class() {
        return this._class
    }

    set class(c) {
        this._class = c
        this.waitingForFloor.then(floor => {
            floor.svgClass = c
        })
    }

    get figureClass() {
        return this._figureClass
    }

    set figureClass(c) {
        this._figureClass = c
        this.waitingForFigure.then(() => {
            if (this.figure) this.figure.figureClass = c
        })
    }

    get figureSvgClass() {
        return this._figureSvgClass
    }

    set figureSvgClass(c) {
        this._figureSvgClass = c
        this.waitingForFigure.then(() => {
            if (this.figure) this.figure.figureSvgClass = c
        })
    }

    set color(color) {
        if (color === "pride") {
            let red = Math.floor(Math.random() * 16 * 16).toString(16) + ""
            let green = Math.floor(Math.random() * 16 * 16).toString(16) + ""
            let blue = Math.floor(Math.random() * 16 * 16).toString(16) + ""
            if (red.length === 1) red = "0" + red
            if (green.length === 1) green = "0" + green
            if (blue.length === 1) blue = "0" + blue
            this._color = "#" + red + green + blue
        } else if (color === "no pride") {
            this._color = "#000000"
        } else if (color === "normal") {
            let red = Math.floor(50 + Math.random() * 10 * 10).toString(16) + ""
            let green = Math.floor(Math.random() * 10 * 10).toString(16) + ""
            let blue = Math.floor(Math.random() * 4 * 4).toString(16) + ""
            if (red.length === 1) red = "0" + red
            if (green.length === 1) green = "0" + green
            if (blue.length === 1) blue = "0" + blue
            this._color = "#" + red + green + blue
        } else this._color = color
        this.waitingForFloor.then(floor => {
            floor.color = this._color
        })
    }
    get color() {
        return this._color
    }

    click() {
        if (this.class === "hex") {
            this.class = "selectedHex"
            directions.forEach(direction => {
                if (this[direction]) this[direction].class = "neighbourHex"
            })
            if (this.parent) this.parent.class = "parentHex"
            this.children.forEach(child => child.class = "childHex")
        } else {
            this.class = "hex"
            directions.forEach(direction => {
                if (this[direction]) this[direction].class = "hex"
            })
        }
    }

    clickObject() {
        if (this.figureClass === "hexObj") {
            this.figureClass = "selectedHexObj"
            this.figureSvgClass = "stickOut stickOutClicked"
        } else {
            this.figureClass = "hexObj"
            this.figureSvgClass = "stickOut"
        }
    }

    calculatePosition() {
        // console.log(this.top, this.left)
        if (this.parent) {
            let delta = positionDelta[this.parentDirection]
            this.top = this.parent.top + this.height * delta.top
            this.left = this.parent.left + this.width * delta.left
        }
        this.style.top = this.top
        this.style.left = this.left
        this.waitingForFloor.then(floor => {
            floor.top = this.top
            floor.left = this.left
        })
        this.waitingForFigure.then(() => {
            this.figure.top = this.top
            this.figure.left = this.left
            this.figure.height = this.height
        })
        //console.log(this.style)
    }

    async generateMap(arrayOfAllHexes, limit) {
        let findNeighbours = (arrayOfAllHexes, limit) => {
            for (let hex of arrayOfAllHexes.filter(hex => {
                let doesntHaveAllNeighbours = false
                directions.forEach(direction => {
                    doesntHaveAllNeighbours = doesntHaveAllNeighbours || hex[direction] === null
                    if (doesntHaveAllNeighbours) return doesntHaveAllNeighbours
                })
                return doesntHaveAllNeighbours
            })) {
                for (let direction of directions) {
                    hex.findNeighbour(direction, arrayOfAllHexes, limit * 10)
                }
            }
        }
        while (arrayOfAllHexes.length < limit) {
            findNeighbours(arrayOfAllHexes, limit)
        }
        findNeighbours(arrayOfAllHexes, limit)
    }

    isNeighbour(hex) {
        let result = false
        for (let direction of directions) {
            result = result || this[direction] === hex
            if (result) return direction
        }
        return result

    }

    findNeighbour(direction, hexes, limit = 10) {
        if (!this[direction]) {
            let neighbours = neighboursDict[direction]
            if (this[neighbours[0]] && this[neighbours[0]][neighbours[1]]) {
                this[direction] = this[neighbours[0]][neighbours[1]]
                if (!this[neighbours[0]][neighbours[1]][oppositeDirection[direction]])
                    this[neighbours[0]][neighbours[1]][oppositeDirection[direction]] = this
                if (this[neighbours[1]] && this[neighbours[1]][neighbours[0]]
                    && !this[neighbours[1]][neighbours[0]][oppositeDirection[direction]])
                    this[neighbours[1]][neighbours[0]][oppositeDirection[direction]] = this
            }
            else if (this[neighbours[1]] && this[neighbours[1]][neighbours[0]]) {
                this[direction] = this[neighbours[1]][neighbours[0]]
                if (!this[neighbours[1]][neighbours[0]][oppositeDirection[direction]])
                    this[neighbours[1]][neighbours[0]][oppositeDirection[direction]] = this
                if (this[neighbours[0]] && this[neighbours[0]][neighbours[1]]
                    && !this[neighbours[0]][neighbours[1]][oppositeDirection[direction]])
                    this[neighbours[0]][neighbours[1]][oppositeDirection[direction]] = this
            }
            else if (hexes.length < limit) {
                this[direction] = new Hex(hexes, this, oppositeDirection[direction], limit, hexes[0].top, hexes[0].left)
                this.children.push(this[direction])
            }
        }
    }
}