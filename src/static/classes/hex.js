export default class Hex {
    constructor(leftHex = null, topLeftHex = null, topRightHex = null, hexes, limit = 10, promises) {
        this.topLeftHex = topLeftHex
        this.leftHex = leftHex
        this.topRightHex = topRightHex
        this.rightHex = null
        this.bottomRightHex = null
        this.bottomLeftHex = null
        this.rightHexPromise = null
        this.bottomLeftHexPromise = null
        this.bottomRightHexPromise = null
        this.top = 0
        this.left = 350
        this.style = {
            position: 'absolute',
            top: this.top,
            left: this.left
        }
        this.class = "hex"
        this.classObject = "hexObj"
        this.svgClassObject = "stickOut"
        this._height = 0
        this.width = 0
        this.countVertical = 0
        this.selectedObject = false
        this.selectedFloor = false
        this.hasObject = Math.random() > 0.9
        this.moveTo = {
            top: 0,
            left: 0,
            object: null,
            settle: false
        }
        this.color = "normal"
        if (this.topLeftHex)
            this.countVertical = this.topLeftHex.countVertical + 1
        else if (this.topRightHex)
            this.countVertical = this.topRightHex.countVertical + 1
        this.countHorizontal = 0
        if (this.leftHex)
            this.countHorizontal = this.leftHex.countHorizontal + 1
        Promise.all(promises).then(() => {
            if (limit > this.countHorizontal) {
                this.rightHexPromise = new Promise(resolve => {
                    if (limit > this.countHorizontal) {
                        let rightHex = new Hex(this, null, null, hexes, limit, promises)
                        hexes.push(rightHex)
                        resolve(rightHex)
                    } else resolve(null)
                }).then(rightHex => {
                    if (rightHex) {
                        this.rightHex = rightHex
                    }
                })
                promises.push(this.rightHexPromise)
            }
            if (!this.leftHex) {
                if (limit > this.countVertical) {
                    if (this.topLeftHex) {
                        if (limit > this.countVertical)
                            this.bottomLeftHexPromise = new Promise(resolve => {
                                if (limit > this.countVertical) {
                                    let bottomLeftHex = new Hex(null, null, this, hexes, limit, promises)
                                    hexes.push(bottomLeftHex)
                                    resolve(bottomLeftHex)
                                } else resolve(null)
                            }).then(bottomLeftHex => {
                                if (bottomLeftHex) {
                                    this.bottomLeftHex = bottomLeftHex
                                }
                            })
                        promises.push(this.bottomLeftHexPromise)
                    } else {
                        if (limit > this.countVertical)
                            this.bottomRightHexPromise = new Promise(resolve => {
                                if (limit > this.countVertical) {
                                    let bottomRightHex = new Hex(null, this, null, hexes, limit, promises)
                                    hexes.push(bottomRightHex)
                                    resolve(bottomRightHex)
                                } else resolve(null)
                            }).then(bottomRightHex => {
                                if (bottomRightHex) {
                                    this.bottomRightHex = bottomRightHex
                                }
                            })
                        promises.push(this.bottomRightHexPromise)
                    }
                }
            } else {
                this.findNeighbours()
            }
        })

    }
    get height() {
        return this._height
    }
    set height(h) {
        this._height = h
        this.width = h / 2 * Math.sqrt(3)
        this.calculatePosition()
        if (this.rightHex)
            this.rightHex.height = h
        if (!this.leftHex) {
            if (this.bottomRightHex)
                this.bottomRightHex.height = h
            if (this.bottomLeftHex)
                this.bottomLeftHex.height = h
        }
    }

    calculatePosition() {
        if (this.leftHex) {
            this.top = this.leftHex.top
            this.left = this.leftHex.left + this.leftHex.width
        } else if (this.topLeftHex) {
            this.top = this.topLeftHex.top + this.height * 3 / 4
            this.left = this.topLeftHex.left + this.width / 2
        } else if (this.topRightHex) {
            this.top = this.topRightHex.top + this.height * 3 / 4
            this.left = this.topRightHex.left - this.width / 2
        }
        this.style.top = this.top
        this.style.left = this.left
    }

    click() {
        if (this.class === "hex") {
            this.class = "selectedHex"
            if (this.topLeftHex)
                this.topLeftHex.class = "neighbourHex"
            if (this.topRightHex)
                this.topRightHex.class = "neighbourHex"
            if (this.leftHex)
                this.leftHex.class = "neighbourHex"
            if (this.bottomLeftHex)
                this.bottomLeftHex.class = "neighbourHex"
            if (this.bottomRightHex)
                this.bottomRightHex.class = "neighbourHex"
            if (this.rightHex)
                this.rightHex.class = "neighbourHex"
        } else {
            this.class = "hex"
            if (this.topLeftHex)
                this.topLeftHex.class = "hex"
            if (this.topRightHex)
                this.topRightHex.class = "hex"
            if (this.leftHex)
                this.leftHex.class = "hex"
            if (this.bottomLeftHex)
                this.bottomLeftHex.class = "hex"
            if (this.bottomRightHex)
                this.bottomRightHex.class = "hex"
            if (this.rightHex)
                this.rightHex.class = "hex"
        }
    }



    clickObject() {
        if (this.classObject === "hexObj") {
            this.classObject = "selectedHexObj"
            this.svgClassObject = "stickOut stickOutClicked"
        } else {
            this.classObject = "hexObj"
            this.svgClassObject = "stickOut"
        }
    }

    findNeighbours() {
        if (this.leftHex.topRightHex) {
            this.topLeftHex = this.leftHex.topRightHex
            this.topLeftHex.bottomRightHex = this
            this.topRightHex = this.topLeftHex.rightHex
            if (this.topRightHex)
                this.topRightHex.bottomLeftHex = this
        } else if (this.leftHex.topLeftHex) {
            if (this.leftHex.topLeftHex.rightHex) {
                this.leftHex.topRightHex = this.leftHex.topLeftHex.rightHex
                if (this.leftHex.topRightHex) {
                    this.topLeftHex = this.leftHex.topRightHex
                    this.topLeftHex.bottomRightHex = this
                    this.topRightHex = this.topLeftHex.rightHex
                    if (this.topRightHex)
                        this.topRightHex.bottomLeftHex = this
                }
            }
        }
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
    }
    get color() {
        return this._color
    }
}