export default function shuffle(items, randomFunc) {
    if(!randomFunc) {
        randomFunc = Math.random;
    }
    var shuffled = items.slice(0);

    var currentIndex = shuffled.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(randomFunc() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = shuffled[currentIndex];
        shuffled[currentIndex] = shuffled[randomIndex];
        shuffled[randomIndex] = temporaryValue;
    }

    return shuffled;
}