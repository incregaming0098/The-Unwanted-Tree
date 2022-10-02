addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "rgb(49, 174, 176)",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    update(diff) {
        player.timeMult = player.timeMult.add(diff)
    },
})

addLayer("sb", {
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#9991db",
    requires: new Decimal(8.2), // Can be a function that takes requirement increases into account
    resource: "small booster(s)", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.76, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1.9)
        if (player.csg.unlocked) mult = mult.mul(tmp.csg.effect.z)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Small Boosters", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){ return player.points.gte(8.2) || player.sb.unlocked},
    effect() {
        let eff = player.sb.points.add(1).log(3).add(1)
        return eff
    },
    effectDescription() {
        return "boosting your point gain by " + format(tmp.sb.effect) + "x."
    },
    onPrestige() {
        player.points = new Decimal(0)
        player.timeMult = new Decimal(0)
    },
    milestones: {
        0: {
            requirementDescription: "5 small boosters",
            effectDescription() {
                return "Timewalls are annoying, so here's an extra boost of 2.50x to point gain."
            },
            done() {
                return player.sb.points.gte(5)
            }
        },
        1: {
            requirementDescription: "7 small boosters",
            effectDescription() {
                return "Here's another boost: a 2x multiplier that decays as you spend more time in a SB run, currently " + format(tmp.sb.milestones[1].effect) + "x."
            },
            done() {
                return player.sb.points.gte(7)
            },
            effect() {
                let coolFormula = player.timeMult.add(1).pow(0.2)
                let eff = new Decimal(2).div(coolFormula)
                return eff
            }
        },
        2: {
            requirementDescription() { 
                if (player.sb.points.lt(20))return player.sb.points.add(1).max(10).min(20) + " small boosters" 
                else return "Pointless Resetting"
            },
            effectDescription() {
                return "Nullify the second softcap."
            },
            done() {
                return player.sb.points.gte(20)
            },
            unlocked() {
                return player.sb.points.gte(10) || hasMilestone('sb',2)
            }
        },
        3: {
            requirementDescription: "30 small boosters",
            effectDescription() {
                return "The dev evidently tried to prevent inflation but he sucked at it. Nullify the sixth hardcap."
            },
            done() {
                return player.sb.points.gte(30)
            },
            unlocked() {
                return hasMilestone('sb',3)
            }
        },
    }
})

addLayer("csg", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        generated: new Decimal(0),
    }},
    color: "rgb(163, 217, 165)",
    requires: new Decimal(50), // Can be a function that takes requirement increases into account
    resource: "comically sized generator(s)", // Name of prestige currency
    baseResource: "small booster(s)", // Name of resource prestige is based on
    baseAmount() {return player.sb.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.87, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1.7)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for CSG.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.sb.points.gte(30) || player.csg.unlocked},
    update(diff) {
        if (player.csg.unlocked) player.csg.generated = player.csg.generated.add(new Decimal(diff).mul(tmp.csg.effect.x))
    },
    tabFormat: [
        "main-display",
        "blank",
        "prestige-button",
        "resource-display",
        ["display-text", function() {
            return "You have " + format(player.csg.generated) + " comically-sized generator power, which is boosting point gain by " + format(tmp.csg.effect.y) + "x and is making small booster gain be multiplied by " + format(tmp.csg.effect.z) + "x."
        }],
    ],
    effectDescription() {
        return "generating " + format(tmp.csg.effect.x) + " CSG power." 
    },
    effect() {
        let x = player.timeMult.pow(new Decimal(1.5)).mul(player.csg.points.add(1).log(3).add(1))
        let y = player.csg.generated.add(1).log(1000).add(1)
        let z = player.csg.generated.add(1).log(25000000).add(1)
        return {
            x:x,
            y:y,
            z:z,
        }
    },
    onPrestige() {
        player.points = new Decimal(0)
        player.sb.points = new Decimal(0)
        player.timeMult = new Decimal(0)
    },
})
