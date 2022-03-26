let mcan = document.getElementById("maincanvas");
mcan.style.width = window.innerHeight*0.8.toString()+"px";
mcan.style.height = window.innerHeight*0.8.toString()+"px";
mcan.style.margin = window.innerHeight*0.05.toString()+"px";
let mctx = mcan.getContext("2d");
let mcw = 16;
let mch = 16;
let generateButton = document.getElementById("generatebutton");

let magicTypes = ["fire", "water", "plants", "energy"];
let magicThemes = ["shadow", "light", "cold", "warm"];
let bitsToHSVGuide = [20, 10, 0, 25, 0, 25];
let lengths = ["short", "medium", "long"];
let eyeColors = [60, 120, 240, 30, 180, 270];

class Catty{
    constructor(){
        this.genes = [];
        for (let i=0; i<118; i++) {
            this.genes.push(Math.floor(Math.random()*2));
        }
        this.tailAmount = 1;
        if (arraySum(this.genes.slice(78, 80)) == 0) {
            this.tailAmount = 2;
        }
        this.magicPowers = [];
        let magicSums = [];
        let biggestMagic = 0;
        let tailsToAdd = 0;
        for (let i=0; i<4; i++) {
            let magicSum = arraySum(this.genes.slice(i*4, (i+1)*4));
            if (magicSum > biggestMagic) {
                biggestMagic = magicSum;
            }
            if (i == 4) {
                if (magicSum >= 3) {
                    tailsToAdd ++;
                }
            } else {
                if (magicSum >= 4) {
                    tailsToAdd ++;
                }
            }
            magicSums.push({type: i, sum: magicSum});
        }
        if (tailsToAdd != 0) {
            tailsToAdd --;
        }
        this.tailAmount += tailsToAdd;
        if (biggestMagic >= 3) {
            for (let i=0; i<magicSums.length; i++) {
                if (magicSums[i].sum < biggestMagic) {
                    magicSums.splice(i, 1);
                    i --;
                } else {
                    magicSums[i] = magicSums[i].type;
                }
            }
            if (magicSums.length == 1) {
                this.magicPowers.push(magicTypes[magicSums[0]]);
            } else {
                if (Math.random() < 0.5) {
                    if (Math.random() < 1/3) {
                        if (magicSums[magicSums.length-1] == 3) {
                            magicSums.splice(magicSums.length-1, 1);
                        }
                        magicSums.forEach((magicSum)=>{
                            this.magicPowers.push(magicTypes[magicSum]);
                        });
                    } else {
                        if (magicSums[2] == 2) {
                            this.magicPowers = ["energy"];
                        } else {
                            if (magicSums[magicSums.length-1] == 3) {
                                magicSums.splice(magicSums.length-1, 1);
                                this.magicPowers.push("energy");
                            }
                            if (magicSums.length == 1) {
                                this.magicPowers.push(magicTypes[magicSums[0]]);
                            } else {
                                if (magicSums[0] == 0) {
                                    if (magicSums[1] == 1) {
                                        this.magicPowers.push("water");
                                    } else {
                                        this.magicPowers.push("fire");
                                    }
                                } else {
                                    this.magicPowers.push("plants");
                                }
                            }
                        }
                    }
                }
            }
        }
        this.magicBrightness = 0;
        this.magicColors = [];
        this.magicThemes = [];
        this.ma = {c: 0, f: 0};
        if (this.magicPowers.length != 0) {
            this.ma.c = arraySum(this.genes.slice(20, 22));
            this.ma.f = arraySum(this.genes.slice(22, 26));
            if (this.genes[16]+this.genes[17] != 1) {
                this.magicThemes.push(magicThemes[this.genes[16]]);
                this.magicBrightness += this.genes[16]*2-1;
            }
            if (this.genes[18]+this.genes[19] != 1) {
                this.magicThemes.push(magicThemes[this.genes[18]+2]);
                this.magicBrightness += this.genes[18]*2-1;
            }
            this.magicColors = [];
            let hsv = [arraySum(this.genes.slice(26, 38))*30, 100, 100];
            this.magicPowers.forEach((magicPower)=>{
                let mhsv = [];
                if (magicPower == "fire") {
                    mhsv = [0, 100, 100];
                }
                if (magicPower == "water") {
                    mhsv = [240, 100, 100];
                }
                if (magicPower == "plants") {
                    mhsv = [120, 100, 100];
                }
                if (magicPower == "energy") {
                    mhsv = [60, 0, 100];
                }
                if (Math.sign(this.magicBrightness == 1)) {
                    for (let i=0; i<this.magicBrightness; i++) {
                        mhsv[1] *= 0.5;
                    }
                } else {
                    for (let i=0; i<this.magicBrightness*-1; i++) {
                        mhsv[2] *= 0.5;
                    }
                }
                if (this.ma.c == 0) {
                    this.magicColors.push(hsv);
                }
                if (this.ma.c == 1) {
                    mhsv = combineArrays(mhsv, 2/3, hsv, 1/3);
                    this.magicColors.push(mhsv);
                }
                if (this.ma.c == 2) {
                    this.magicColors.push(mhsv);
                }
            });
        }
        this.colors = [];
        for (let i=0; i<3; i++) {
            this.colors.push(bitsToHSV(this.genes.slice(38+i*12, 38+(i+1)*12), bitsToHSVGuide));
        }
        if (this.ma.f == 4) {
            this.colors[0] = randomItem(this.magicColors);
        }
        if (this.ma.f == 3) {
            this.colors[1] = randomItem(this.magicColors);
        }
        if (this.ma.f == 2) {
            this.colors[1] = combineArrays(this.colors[1], 0.5, randomItem(this.magicColors), 0.5);
            this.colors[2] = this.magicColors[randomBetween(0, this.magicColors.length, 1)];
        }
        if (this.ma.f == 1) {
            this.colors[2] = combineArrays(this.colors[1], 0.75, randomItem(this.magicColors), 0.25);
        }
        this.furLength = lengths[arraySum(this.genes.slice(74, 76))];
        this.tailLength = lengths[arraySum(this.genes.slice(76, 78))];
        this.eyeColor = 0;
        if (this.ma.c == 0) {
            this.eyeColor = [eyeColors[arraySum(this.genes.slice(80, 82))], 100, 100];
        }
        if (this.ma.c == 1) {
            this.eyeColor = [eyeColors[arraySum(this.genes.slice(80, 82))+3], 100, 100];
        }
        if (this.ma.c == 2) {
            this.eyeColor = randomItem(this.magicColors);
        }
        let eyeBrightness = arraySum(this.genes.slice(82, 84));
        if (eyeBrightness == 0) {
            this.eyeColor[2] *= 0.5;
        }
        if (eyeBrightness == 2) {
            this.eyeColor[1] *= 0.5;
        }
    }
}

function randomBetween(min, max, precision){
    return Math.floor((Math.random()*(max-min)+min)/precision)*precision;
}

function colorString(r, g, b, a){
    r = Math.floor(r*255)*256*256*256;
    g = Math.floor(g*255)*256*256;
    b = Math.floor(b*255)*256;
    a = Math.floor(a*255);
    return "#"+(r+g+b+a).toString(16).padStart(8, "0");
}

function combineArrays(a1, m1, a2, m2){
    let array = [];
    for (let i=0; i<a1.length; i++) {
        array.push(a1[i]*m1+a2[i]*m2);
    }
    return array;
}

function randomItem(array){
    return array[randomBetween(0, array.length, 1)];
}

function bitsToHSV(bits, guide){
    let hsv = [];
    for (let i=0; i<3; i++) {
        hsv.push(guide[i*2]+guide[i*2+1]*arraySum(bits.slice(i*4, (i+1)*4)));
    }
    return hsv;
}

function arraySum(array){
    let sum = 0;
    array.forEach((item)=>{
        sum += item;
    });
    return sum;
}

function generateButtonClicked() {
    let catty = new Catty();
    console.log(catty.eyeColor, catty.ma.c);
}
generateButton.addEventListener("click", generateButtonClicked);