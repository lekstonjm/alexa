class Jutsu {
    constructor() {
        this.cost = 0;
    }
    Can(agressor, victim) {
        if (agressor.state.ki < this.cost) {
            return false;
        } 
        return true;
    }
    Execute(agressor, victim) {
        agressor.state.ki -= this.cost;
    }
    Contact(agressor, victim) {
        if (Math.abs(agressor.state.position - victim.state.position) > 1 ) {
            return false;
        }
        return true;
    }
}

class AThousandYearsOfPain extends Jutsu {
    constructor() {
        this.name = "A thousand years of pain";
        this.cost = 10;
    }
    Can(agressor, victim) {
        if (!super.Can(agressor,victim)) { return false;}
        if (!Contact(agressor,victim)) { return false;}
        if (agressor.state.ki >= this.cost) {
            return true;
        } 
        return false;
    }
    Execute(agressor, victim) {
        agressor.state.ki -= this.cost;
    }    
}

module.exports = {
    : 

    }
    "Supreme fireball jutsu":
    "Jump" :
    "Dive" :
    "Front" :
    "Back":
    "Left":
    "Right":

}