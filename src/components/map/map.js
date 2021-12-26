import HexagonComponent from "./hexagon/hexagon.vue"
//import FigureComponent from "./hexagon/figure.vue"
import CharacterComponent from "./hexagon/character/character.vue"

import Hex from "../../static/classes/hex2.js"
import SpriteSet from "../../static/classes/spriteSet.js"

export default {
    name: 'HexMap',
    components: {
        HexagonComponent, CharacterComponent
    },
    watch: {
        height(height) {
            let width = height / 2 * Math.sqrt(3)
            this.width = Math.round(width * 1000) / 1000
        }
    },
    computed: {
        mapStyle() {
            let perspective = 1000
            let rotation = 60
            // let scaleSkew = Math.cos(rotation * this.rad)
            // let perspectiveSkew = Math.sin(rotation * this.rad)
            let scaleSkew = 1
            let perspectiveSkew = 1
            if (this.mapContainerElement && this.mapContainerElement.clientHeight > 0)
                perspective = this.mapContainerElement.clientHeight / perspectiveSkew
            let transform = `scale(${this.scale})`
            // let transform = ``
            if(this.transform) transform = `scale(${this.scale*scaleSkew}) perspective(${perspective}px) rotateX(${rotation*this.rotateY}deg)  rotateZ(${rotation*this.rotateX}deg)`
            // if (this.transform) transform = `perspective(${perspective}px) rotate3d(1,0,0,${rotation}deg)`
            return {
                height: `${100/this.scale}%`,
                width: `${100/this.scale}%`,
                transform,
            }
        }
        // figures() {
        //     return this.hexes.filter(h => h.hasObject)
        // }
    },
    created() {
        let resolveElement
        let awaitElement = new Promise(resolve => resolveElement = resolve)
        let component = this
        let timeoutFunction = () => {
            setTimeout(() => {
                if (component.$refs && component.$refs.theParent) {
                    component.mapContainerElement = component.$refs.theParent
                    resolveElement()
                }
                else setTimeout(timeoutFunction, 1)
            }, 1)
        }
        timeoutFunction()
        awaitElement.then(async () => {
            let clientY = this.mapContainerElement.clientHeight
            let clientX = this.mapContainerElement.clientWidth
            this.firstHex = new Hex(this.hexes, null, null, this.hexCount, clientY / 2 - 50, clientX / 2 - 86.603 / 2)
            // if(this.hexCount > 1)
            this.firstHex.generateMap(this.hexes, this.hexCount)
            this.firstHex.color = "#FF0000"
            this.firstHex.height = 100
            let asyncAwait = async () => {
                let len = 0
                let promises = this.hexes.map(h => h.calculatingHeight).filter(h => h !== null)
                while (promises.length < this.hexes.length) {
                    await new Promise(resolve => { setTimeout(() => { resolve() }, 1) })
                    promises = this.hexes.map(h => h.calculatingHeight).filter(h => h !== null)
                }
                while (promises.length !== len) {
                    len = promises.length
                    promises = this.hexes.map(h => h.calculatingHeight).filter(h => h !== null)
                    await Promise.all(promises)
                }
            }
            await asyncAwait()
            this.calculateCenter()
            this.figures = this.hexes.filter(h => h.hasObject).map(hex => ({
                hex: hex,
                health: 2,
                map: this,
                id: Math.random(),
                sprite: this.sprites[Math.floor(Math.random() * 3)]
            }))
            window.addEventListener("resize", this.calculateCenter);
        })
    },
    destroyed() {
        window.removeEventListener("resize", this.calculateCenter);
    },
    data: () => ({
        sprites: [
            new SpriteSet("GraveRobber"),
            new SpriteSet("Woodcutter"),
            new SpriteSet("SteamMan")
        ],
        figures: [],
        rotateX: 0,
        rotateY: 1,
        height: 50,
        ready: false,
        hexCount: 21,
        rowLength: 4,
        firstHex: null,
        rad: 0.01745329252,
        transform: false,
        mapContainerElement: null,
        hexes: [],
        width: 25 * Math.sqrt(3),
        scale: 0.1,
        selectedCharacter: null,
        selectedObject: null,
        selectedFloor: null,
        testFlag: false,
        testHeight: 100,
        testWidth: 50 * Math.sqrt(3),
        testViewbox: `0 0 ${50 * Math.sqrt(3)} 100`,
        testStyle: {
            cursor: 'pointer',
            fillOpacity: 0.4,
            stroke: '#000',
            strokeWidth: 1,
        },
        trackMouse: false,
    }),
    methods: {
        mouseDownHandler() {
            this.trackMouse = true
        },
        mouseUpHandler() {
            this.trackMouse = false
        },
        mouseMoveHandler(e) {
            if(this.trackMouse) {
                this.rotateX +=2*e.movementX/this.mapContainerElement.clientWidth
                this.rotateY +=2*e.movementY/this.mapContainerElement.clientHeight
            }
        },
        selectCharacter(character, selected) {
            let hex = character.figure.hex
            console.log(this.selectedCharacter ? this.selectedCharacter._uid : null, character._uid, selected)
            if (selected) {
                if (this.selectedCharacter) {
                    if (hex.isNeighbour(this.selectedCharacter.figure.hex)) {
                        //character.selectCharacter(false)
                        return this.selectedCharacter.attack(character)
                    }
                    else this.selectedCharacter.selectCharacter(false)
                }
                this.selectedCharacter = character
            }
            else {
                if (this.selectedCharacter === character) this.selectedCharacter = null
            }
            character.figure.hex.floor.clickFloor(selected)
        },
        selectFloor(hex, select = true) {
            let moveTo = this.selectedCharacter && hex && hex.isNeighbour(this.selectedCharacter.figure.hex) && !hex.figure
            if (this.selectedFloor) {
                if (this.selectedFloor.selectedFloor)
                    this.selectedFloor.click()
                this.selectedFloor.selectedFloor = false
                this.selectedFloor = null
            }
            if (select) {
                this.selectedFloor = hex
                if (hex) {
                    hex.click()
                    hex.selectedFloor = true
                }
                if (moveTo) {
                    this.selectedCharacter.moveTo(hex)
                }
            }
        },
        deselectFloor() {
            this.selectFloor(null)
        },
        addPerspective() {
            // let skewFactor = 1 / Math.cos(60 * this.rad)
            this.transform = !this.transform
            this.calculateCenter()
            // let clientHeight = this.mapContainerElement.clientHeight
            // if (this.transform) {
            //     this.height = this.height / skewFactor
            //     this.firstHex.top = (this.firstHex.top - clientHeight / (4 * skewFactor))
            // }
        },
        calculateCenter() {
            let topHex = this.hexes.map(hex => hex.top).reduce(function (prev, curr) {
                return prev < curr ? prev : curr;
            });
            let bottomHex = this.hexes.map(hex => hex.top).reduce(function (prev, curr) {
                return prev > curr ? prev : curr;
            });
            let leftHex = this.hexes.map(hex => hex.left).reduce(function (prev, curr) {
                return prev < curr ? prev : curr;
            });
            let rightHex = this.hexes.map(hex => hex.left).reduce(function (prev, curr) {
                return prev > curr ? prev : curr;
            });
            let yDelta = bottomHex - topHex
            let xDelta = rightHex - leftHex
            let clientY = this.mapContainerElement.clientHeight
            let clientX = this.mapContainerElement.clientWidth
            let heightScale = 1 + (clientY - yDelta) / clientY
            let widthScale = 1 + (clientX - xDelta) / clientX
            if (heightScale < widthScale) {
                this.scale = heightScale * 0.8
                widthScale = 1
            } else {
                this.scale = widthScale * 0.8
                heightScale = 1
            }
            console.log(this.scale, clientY, yDelta, bottomHex, topHex)
            this.firstHex.top = (this.mapContainerElement.clientHeight / 2 - 50) / this.scale
            this.firstHex.left = (this.mapContainerElement.clientWidth / 2 - 86.603 / 2) / this.scale
            this.firstHex.height = 100
        },
        selectObject(hex) {
            if (this.selectedObject) {
                if (this.selectedObject.selectedObject)
                    this.selectedObject.clickObject()
                this.selectedObject.selectedObject = false
                this.selectedObject = null
            } if (this.selectedFloor) {
                if (this.selectedFloor.selectedFloor)
                    this.selectedFloor.click()
                this.selectedFloor.selectedFloor = false
                this.selectedFloor = null
            }
            if (hex) {
                this.selectedFloor = hex
                hex.selectedFloor = true
                hex.click()
                this.selectedObject = hex
                hex.selectedObject = true
                hex.clickObject()
            }
        },
        deselectObject(hex) {
            if (hex.moveTo.object && hex.moveTo.object !== hex) {
                hex.moveTo = {
                    ...hex.moveTo,
                    settle: true
                }
                setTimeout(() => {
                    this.selectObject(null)
                    hex.moveTo.object.hasObject = true
                    hex.hasObject = false
                }, 1000)
            }
            else this.selectObject(null)
        },
        async awaitPromiseStream(promises) {
            let len = 0
            while (promises.length !== len) {
                len = promises.length
                await Promise.all(promises)
            }
        },
    }
}