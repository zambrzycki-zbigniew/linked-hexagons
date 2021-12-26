export default {
    name: "floor",
    props: {
        hex: Object,
        width: Number,
        height: Number,
    },
    computed: {
        style() {
            return {
                position: 'absolute',
                top: this.top,
                left: this.left,
                color: this.color,
                height: 100,
                width: 86.603,
                // transform: `scale(${this.height / 100})`,
            }
        },
        floorEdges() {
            // let height = Math.round(this.floorHeight * 25 * 100)/100
            let floorEdges = []
            let w = 86.603
            let h = 100
            for (let index = 0; index < this.floorCorners.length - 1; index++) {
                // let c1 = this.floorCorners[index]
                // let trig = 1/(8*Math.cos((30+60*index)*Math.PI/180)+7*Math.sin((60*index)*Math.PI/180))
                // let trig = 0.14433756729740643
                let trig = 1/(Math.sqrt(2)*4)
                let trig2 = 1/(Math.sqrt(3)*4)
                // let trig = Math.tan((30+60*index)*Math.PI/180)/4
                let style = {
                    position: 'absolute',
                    top: this.top,
                    left: this.left,
                    color: this.color,
                    height: h,
                    width: w,
                    transformOrigin: "center",
                    // transform: `scale(${this.height / 100}) translate3d(${c1[0]}px,${c1[1]}px,${-height}px) rotateZ(${30+60*(index)}deg)`,
                    transform: `scale(${(this.height / h)}) translate3d(${w*trig}px, ${h*trig}px, 0) rotateZ(${30+60*(index)}deg)`,
                } // translate3d(${w/(8*Math.cos((30+60*index)*Math.PI/180))}px, ${h/(8*Math.cos((30+60*index)*Math.PI/180))}px, 0)
                // console.log(30+60*index, Math.cos((30+60*index)*Math.PI/180), Math.sin((30+60*index)*Math.PI/180), trig)
                console.log(30+60*index, trig, trig2, 8*Math.cos((30+60*index)*Math.PI/180), 8*Math.sin((60*index)*Math.PI/180))
                // console.log(60+60*index, Math.cos((60+60*index)*Math.PI/180), Math.sin((60+60*index)*Math.PI/180),Math.sqrt(3)*4, 1/(Math.sqrt(3)*4))
                floorEdges.push(style)
            }
            return floorEdges
        }
    },
    watch: {
        height() {
        },
        floorClass(current, previous) {
            console.log(current, previous)
        }
    },
    data() {
        return {
            left: this.hex.left,
            top: this.hex.top,
            color: this.hex.color,
            svgClass: this.hex.class,
            visible: false,
            floorHeight: 0,
            floorCorners: [
                [43.302, 0],
                [86.603, 25],
                [86.603, 75],
                [43.302, 100],
                [0, 75],
                [0, 25],
                [43.302, 0]
            ],
            edge: "",
            rad: 0.0174532925
        }
    },
    mounted() {
        this.hex.floor = this
    },
    created() {
        this.floorHeight = 0.1+Math.random()
        let height = Math.round(this.floorHeight * 25 * 100)/100
        this.edge = `0,0 50,0 50,${height} 0,${height}`
    },
    methods: {
        clickFloor(select = true) {
            if (!this.hex.selectedFloor) this.$emit('select', { object: this.hex, event: 'selectedFloor', select })
            else this.$emit('select', { object: this.hex, event: 'deselectedFloor', select })
        },
    }
}