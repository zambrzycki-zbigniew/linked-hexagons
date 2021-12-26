export default class SpriteSet {
    constructor(name) {
        let context = require.context(`../../assets/characters/`, true, /\.png$/)
        let things = []
        context.keys().forEach(key => (things.push({ pathLong: context(key), pathShort: key })));
        things = things.filter(thing => thing.pathShort.includes(name))
        things.forEach(thing => {
            let key = thing.pathShort.replace(`./${name}/${name}`, '').replace('.png', '').replace('_', '')
            let sprite = {frames: 5, sprite: thing.pathLong}
            if(key === "hurt")
                sprite.frames = 2
            else if(key === "idle")
                sprite.frames = 3
            if(key === '') {
                key = 'inactive'
                sprite.frames = 0
            }
            this[key] = sprite
        })
    }
}