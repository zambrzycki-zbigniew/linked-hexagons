import Character from "./character/character.vue"

export default {
    name: 'figureComponent',
    components: {
        Character
    },
    props: {
        hex: Object,
        sprites: Array,
        transform: Boolean
    },
    data: () => ({
        randomSprite: Math.floor(Math.random()*3),
    }),
    methods: {
        passEvent(...e) {
            console.log(e)
            //this.$emit(e.event, e.object)
        }
    }
}