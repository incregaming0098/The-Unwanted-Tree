let modInfo = {
	name: "The Unwanted Tree",
	id: "ununungwa",
	author: "IncreGaming0098",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let coolFormula = player.points.add(1).log(3).pow(1.7).add(1)
	let coolFormula2 = player.points.add(1).log(10).add(1)
	let coolFormula3 = player.timeMult.pow(2)
	let coolFormula4 = player.points.add(1).log(1.2).pow(1.2).add(1)
	let gain = new Decimal(1)
	if (player.points.gte(5)) gain = gain.div(coolFormula)
	if (player.points.gte(7.5) && !hasMilestone('sb',2)) gain = gain.div(coolFormula2)
	if (player.points.gte(8)) gain = gain.pow(2)
	if (player.points.gte(8.2)) gain = gain.div(coolFormula3)
	if (player.points.gte(8.8)) gain = gain.div(coolFormula4)
	if (player.points.gte(3.7) && hasMilestone('sb',2) && !hasMilestone('sb',3)) gain = gain.min(2)
	gain = gain.mul(tmp.sb.effect)
	if (hasMilestone('sb',0)) gain = gain.mul(2.5)
	if (hasMilestone('sb',1)) gain = gain.mul(tmp.sb.milestones[1].effect)
	gain = gain.mul(tmp.csg.effect.y)	
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	timeMult: new Decimal(0)
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		let text = ""
		let coolFormula = player.points.add(1).log(3).pow(1.7).add(1)
		let coolFormula2 = player.points.add(1).log(10).add(1)
		let coolFormula3 = player.timeMult.pow(2)
		let coolFormula4 = player.points.add(1).log(1.2).pow(1.2).add(1)
		let firstNerf = "<br>Uh Oh! Looks like your points are now Tax collectors and now production is divided by /" + format(coolFormula) + "."
		let secondNerf = "<br>Well, you just hit another timewall dividing production by /" + format(coolFormula2) + "."
		let thirdNerf = "<br>The developer became Troll Mode and square rooted your production."
		let fourthNerf = "<br>There's now a multiplier that increases based on time spent on this prestige reset, dividing production, as of now the multiplier is " + format(coolFormula3) + "x."
		let fifthNerf = "<br>Haha, look! There's now a divider of /" + format(coolFormula4) + "."
		let sixthNerf = "<br>As of now, if you have more than 5.7 points, production is hardcapped at 2/s."
		if (player.points.gte(5)) text += firstNerf
		if (player.points.gte(7.5) && !hasMilestone('sb',2)) text += secondNerf
		if (player.points.gte(8)) text += thirdNerf
		if (player.points.gte(8.2)) text += fourthNerf
		if (player.points.gte(8.8)) text += fifthNerf
		if (player.points.gte(3.7) && hasMilestone('sb',1) && !hasMilestone('sb',3)) text += sixthNerf
		return text
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.p.points.gte(1)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}