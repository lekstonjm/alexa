module.exports = class Player {
    constructor() {
        this.state = {
            hand:[],
            deck:[],
            ki:0,
            life:0,
            position: [0,0],
            orientation: 0
        }
    }
}
