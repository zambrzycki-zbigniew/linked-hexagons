export default {
    name: "character",
    props: {
        figure: Object,
        transform: Boolean
    },
    computed: {
        style() {
            // let scale = (this.height / 100)
            let obj = {
                position: 'absolute',
                top: this.top + "px",
                left: this.left + "px",
                height: 100 + "px",
                width: 86.603 + "px",
                transform: `rotateY(0deg)`,
                // transform: `scale(${scale})`,
                pointerEvents: 'none'
                // transition: `top 3s ease-in-out 0s, left 3s ease-in-out 0s, transform 3s ease-in-out 0s;`
            }
            if (this.inMove && !this.transform) obj.transform += ` translateZ(10px)`
            if (this.transform) {
                obj.transform += ` translate3d(0px,12px,24px) rotateX(-90deg)`
            }
            // if(this.flip) {
            //     obj.transition = `top 3s ease-in-out 0s, left 3s ease-in-out 0s, transform 0.5s ease-in-out 0s;`
            // }
            return obj
        },
        spriteStyle() {
            //100 - default tile height
            //48 - default sprite height
            //needed to center the image in hex after scaling
            // let scale = (this.height/100)*(100+86.603)/96/2
            let scale = 100 / 48
            this.maxFrame = this.figure.sprite[this.currentSprite].frames
            let obj = {
                height: 48 + "px",
                width: 48 + "px",
                transform: `scale(${scale}) translate(${30}%, ${5}%)`,
                background: `url('${this.figure.sprite[this.currentSprite].sprite}') 0px 0px`,
                backgroundPosition: `${48 * this.spriteFrame}px 0px`,
                pointerEvents: 'none'
                // transition: `top 3s ease-in-out 0s, left 3s ease-in-out 0s, transform 3s ease-in-out 0s;`
            }
            // if (this.transform) {
            //     obj.transform += `translate3d(0px,12px,24px) rotate3d(1,0,0,-60deg)`
            // }
            if (this.flip) {
                obj.transform += ` rotate3d(0,1,0,180deg)`
                // obj.transition = `transform 0.5s ease-in-out 0s;`
            }
            return obj
        },        
        clickableStyle() {
            //100 - default tile height
            //48 - default sprite height
            //needed to center the image in hex after scaling
            // let scale = (this.height/100)*(100+86.603)/96/2
            let obj = {                
                height: 48 + "px",
                width: 48 + "px",
                transform: `scale(${100 / 48}) translate(${12}%, ${-30}%) scaleX(0.4) scaleY(${3/4})`,
                borderRadius: "50% 50% 0 0",
                opacity: 0.8,
                pointerEvents: 'auto'
            }
            if (this.flip) {
                obj.transform += ` rotate3d(0,1,0,180deg) translateX(-75%)`
                // obj.transition = `transform 0.5s ease-in-out 0s;`
            }
            return obj
        }
    },
    watch: {
        currentSprite(sprite) {
            if (sprite !== 'inactive' && this.tID === null) {
                this.tID = setInterval(() => {
                    if (this.spriteFrame > 0) { this.spriteFrame = this.spriteFrame - 1; }
                    else { this.spriteFrame = this.maxFrame; }
                }
                    , 150);
            } else if (sprite === 'inactive') {
                clearInterval(this.tID)
                this.tID = null
            }
            this.spriteFrame = 0
        },
        height(height) {
            this.width = height / 2 * Math.sqrt(3)
        }
    },
    mounted() {
        this.figure.hex.figure = this
    },
    destroyed() {
        if (this.tID) clearInterval(this.tID)
        this.spriteFrame = 0
    },
    data() {
        return {
            height: 0,
            width: 0,
            tID: null,
            spriteFrame: 3,
            maxFrame: 3,
            currentSprite: "inactive",
            left: this.figure.hex.left,
            top: this.figure.hex.top,
            color: this.figure.hex.color,
            svgClass: this.figure.hex.class,
            visible: false,
            flip: false,
            inMove: false,
        }
    },
    methods: {
        selectCharacter(select = null) {
            if (select === null) select = this.currentSprite === "inactive"
            if (select) {
                this.currentSprite = "idle"
                this.$emit('selectCharacter', this, select)
            }
            else {
                this.currentSprite = "inactive"
                this.$emit('selectCharacter', this, select)
            }
        },
        attack(character) {
            this.currentSprite = "walk"
            let direction = this.figure.hex.isNeighbour(character.figure.hex).toLowerCase()
            this.inMove = true
            this.top = character.top
            this.left = character.left + this.width / 4
            if (direction.includes('right')) this.wait(2500).then(() => { this.flip = true })
            else this.flip = true
            this.wait(3000).then(() => {
                this.currentSprite = "attack1"
                this.wait(150).then(() => {
                    character.currentSprite = "hurt"
                    this.wait(450).then(() => {
                        character.figure.health--
                        if(character.figure.health < 1) character.die()
                        else character.currentSprite = "inactive"
                    })
                })
                this.wait(750).then(() => {
                    this.currentSprite = "walk"
                    this.top = this.figure.hex.top
                    this.left = this.figure.hex.left
                    if (direction.includes('right')) this.wait(2500).then(() => { this.flip = false })
                    else this.flip = false
                    this.wait(3000).then(() => {
                        this.currentSprite = "idle"
                        this.inMove = false
                    })
                })
            })
        },
        moveTo(hex) {
            this.currentSprite = "walk"
            let direction = this.figure.hex.isNeighbour(hex).toLowerCase()
            this.inMove = true
            this.top = hex.top
            this.left = hex.left
            this.figure.hex.figure = null
            this.figure.hex = hex
            hex.figure = this
            if (direction.includes('left')) {
                this.flip = true
                this.wait(2500).then(() => { this.flip = false })
            }
            this.wait(3000).then(() => {
                this.currentSprite = "idle"
                this.inMove = false
            })
        },
        die() {
            this.currentSprite = "death"
            this.wait(750).then(() => {
                clearInterval(this.tID)
                this.visible = false
            })
            this.spriteFrame = 0
            this.wait(3250).then(() => {
                let mapFigures = this.figure.map.figures
                this.figure.hex.figure = null
                this.figure.hex.hasObject = false
                this.figure.hex = null
                mapFigures.splice(mapFigures.findIndex(el => el === this.figure), 1)
            })
        },
        wait(time) {
            return new Promise(resolve => {
                setTimeout(() => { resolve() }, time)
            })
        },
        switchSprite() {
            switch (this.currentSprite) {

                case "inactive":
                    this.currentSprite = "idle"
                    console.log("idle")
                    break;
                case "idle":
                    this.currentSprite = "walk"
                    console.log("walk")
                    break;
                case "walk":
                    this.currentSprite = "run"
                    console.log("run")
                    break;
                case "run":
                    this.currentSprite = "attack1"
                    console.log("attack1")
                    break;

                case "attack1":
                    this.currentSprite = "attack2"
                    console.log("attack2")
                    break;
                case "attack2":
                    this.currentSprite = "attack3"
                    console.log("attack3")
                    break;
                case "attack3":
                    this.currentSprite = "climb"
                    console.log("climb")
                    break;
                case "climb":
                    this.currentSprite = "craft"
                    console.log("craft")
                    break;
                case "craft":
                    this.currentSprite = "death"
                    console.log("death")
                    break;
                case "death":
                    this.currentSprite = "hurt"
                    console.log("hurt")
                    break;
                case "hurt":
                    this.currentSprite = "jump"
                    console.log("jump")
                    break;
                case "jump":
                    this.currentSprite = "push"
                    console.log("push")
                    break;
                case "push":
                    this.currentSprite = "inactive"
                    console.log("inactive")
                    break;
            }
        },
    }
}