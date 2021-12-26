import Floor from "./floor/floor.vue"
import Figure from "./figure/figure.vue"
import Character from "./character/character.vue"

export default {
    name: 'hexagon',
    components: {
        Floor, Figure, Character
    },
    props: {
        height: Number,
        width: Number,
        hex: Object,
    },
    computed: {
        blockStyles() {
            return this.blockTransforms.map(s => {
                return { ...this.style, ...s }
            })
        },
        selectedObject() {
            return this.hex.selectedObject
        },
        moveTo() {
            return this.hex.moveTo
        },
    },
    watch: {
        height(h) {
            //let tmpClass = this.hex.svgClassObject
            this.hex.figureSvgClass = this.hex.figureSvgClass.replace('stickOut', '')
            //front
            this.blockTransforms[0].transform =
                `translate3d(0,${this.width/4}px,${h/4}px) rotate3d(1,0,0,-90deg)`
            //back
            this.blockTransforms[1].transform =
                `translate3d(0,${-this.width/4}px,${h/4}px) rotate3d(1,0,0,-90deg)`
            //left
            this.blockTransforms[2].transform =
                `translate3d(${h/4.5}px,0,${h/4}px) rotate3d(1,0,0,-90deg) rotate3d(0,1,0,90deg)`
            //right
            this.blockTransforms[3].transform =
                `translate3d(${-h/4.5}px,0,${h/4}px) rotate3d(1,0,0,-90deg) rotate3d(0,1,0,90deg)`
            //top
            this.blockTransforms[4].transform =
                `scale3d(1,0.9,1) translate3d(0,0,${h / 2}px)`
            //bottom
            this.blockTransforms[5].transform =
                `scale3d(1,0.9,1)`
            //this.hex.svgClassObject = tmpClass
        },
        moveTo(m) {
            console.log("moveTo")
            let topDelta = m.top - this.hex.top
            let leftDelta = m.left - this.hex.left
            let settle = 1
            if(m.settle) settle = 0
            //front
            this.blockTransforms[0].transform =
                `translate3d(${leftDelta}px,${topDelta+this.height/4.5}px,${settle*this.height/2 + this.height/4}px) rotate3d(1,0,0,-90deg)`
            //back
            this.blockTransforms[1].transform =
                `translate3d(${leftDelta}px,${topDelta-this.height/4.5}px,${settle*this.height/2 + this.height/4}px) rotate3d(1,0,0,-90deg)`
            //left
            this.blockTransforms[2].transform =
                `translate3d(${leftDelta+this.width/4}px,${topDelta}px,${settle*this.height/2 + this.height/4}px) rotate3d(1,0,0,-90deg) rotate3d(0,1,0,90deg)`
            //right
            this.blockTransforms[3].transform =
                `translate3d(${leftDelta-this.width/4}px,${topDelta}px,${settle*this.height/2 + this.height/4}px) rotate3d(1,0,0,-90deg) rotate3d(0,1,0,90deg)`
            //top
            this.blockTransforms[4].transform =
                `scale3d(1,0.9,1) translate3d(${leftDelta}px,${topDelta/0.9}px,${settle*this.height/2 + this.height/2}px)`
            //bottom
            this.blockTransforms[5].transform =
                `scale3d(1,0.9,1) translate3d(${leftDelta}px,${topDelta/0.9}px,${settle*this.height/2}px)`
            //this.hex.svgClassObject = tmpClass
        },
        selectedObject(p) {
            console.log("selectedObject")
            let a = this.height/2
            if (!p) {
                //front
                this.blockTransforms[0].transform =
                    `translate3d(0,22%,${this.height / 4}px) rotate3d(1,0,0,-90deg)`
                //back
                this.blockTransforms[1].transform =
                    `translate3d(0,-22%,${this.height / 4}px) rotate3d(1,0,0,-90deg)`
                //left
                this.blockTransforms[2].transform =
                    `translate3d(25.5%,0,${this.height / 4}px) rotate3d(1,0,0,-90deg) rotate3d(0,1,0,90deg)`
                //right
                this.blockTransforms[3].transform =
                    `translate3d(-25.5%,0,${this.height / 4}px) rotate3d(1,0,0,-90deg) rotate3d(0,1,0,90deg)`
                //top
                this.blockTransforms[4].transform =
                    `scale3d(1,0.9,1) translate3d(0,0,${this.height / 2}px)`
                //bottom
                this.blockTransforms[5].transform =
                    `scale3d(1,0.9,1)`
            } else {
                //front
                this.blockTransforms[0].transform =
                    `translate3d(0,22%,${a + this.height / 4}px) rotate3d(1,0,0,-90deg)`
                //back
                this.blockTransforms[1].transform =
                    `translate3d(0,-22%,${a + this.height / 4}px) rotate3d(1,0,0,-90deg)`
                //left
                this.blockTransforms[2].transform =
                    `translate3d(25.5%,0,${a + this.height / 4}px) rotate3d(1,0,0,-90deg) rotate3d(0,1,0,90deg)`
                //right
                this.blockTransforms[3].transform =
                    `translate3d(-25.5%,0,${a + this.height / 4}px) rotate3d(1,0,0,-90deg) rotate3d(0,1,0,90deg)`
                //top
                this.blockTransforms[4].transform =
                    `scale3d(1,0.9,1) translate3d(0,0,${a + this.height / 2}px)`
                //bottom
                this.blockTransforms[5].transform =
                    `scale3d(1,0.9,1) translate3d(0,0,${a}px)`
            }
        }
    },
    data: () => ({
        randomSprite: Math.floor(Math.random()*3),
        top: 0,
        left: 0,
        color: "",
        floor: false,
        style: { position: 'absolute', top: null, left: null, color: '#000000' },
        blockTransforms: [
            { //front
                transform: "translate3d(0,22%,10px) rotate3d(1,0,0,-90deg)"
            },
            { //back
                transform: "translate3d(0,-22%,10px) rotate3d(1,0,0,-90deg)"
            },
            { //left
                transform: "translate3d(25.5%,0,10px) rotate3d(1,0,0,-90deg) rotate3d(0,1,0,90deg)"
            },
            { //right
                transform: "translate3d(-25.5%,0,10px) rotate3d(1,0,0,-90deg) rotate3d(0,1,0,90deg)"
            },
            { //top
                transform: "scale3d(1,0.9,1) translate3d(0,0,20px)"
            },
            { //bottom
                transform: "scale3d(1,0.9,1)"
            },
        ]
    }),
    methods: {
        passEvent(e) {
            this.$emit(e.event, e.object, e.select)
        }
    }
}