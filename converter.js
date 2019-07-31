

var teamsData = require('./JSON/Teams.json');
var playerData = require('./JSON/Players.json');
var freeAgents = require('./JSON/FreeAgents.json');


var draftData = require('./JSON/DraftData.json');


//for draft trades
let inDraft = false;

function setInDraft() {
    inDraft = true;
}

let franchise;
let selectedTeam;
let home;
let away;
const POS_C = 0;
const POS_LW = 1;
const POS_RW = 2;
const POS_D = 3;
const POS_G = 4;


const rosterSize = 500;
const CAPROOM = 85000000;
const VETERANSMINIMUM = 900000;

const POS_C_REQUIREMENTS = 4;
const POS_LW_REQUIREMENTS = 4;
const POS_RW_REQUIREMENTS = 4;
const POS_D_REQUIREMENTS = 6;
const POS_G_REQUIREMENTS = 2;


//sliders
let twoPointPercentageLow = 20;
let twoPointPercentageHigh = 73;
let threePointPercentageLow = 25;
let threePointPercentageHigh = 55;
let defenseLow = 0;
let defenseHigh = 16;
let secondsOffClock = 16;
let tradeThreshold = 0.3;
let reboundSlider = 50;
let trainingPointsAvailable = 2;
//Seconds Off Clock Random Factor
let secondsOffClockRandomFactor = 6;
let gamesPerSeason = 82;
let playoffSeeds = 8;
let seriesWinCount = 4;
let conferencesOn = true;
let collegeMode = false;
let difficulty = -1;
//************************************ */

let autoSign = true;

function setAutoSign(bool) {
    autoSign = bool;
}




function resetSliders() {
    twoPointPercentageLow = 20;
    twoPointPercentageHigh = 73;
    threePointPercentageLow = 25;
    threePointPercentageHigh = 55;
    defenseLow = 0;
    defenseHigh = 16;
    secondsOffClock = 16;
    gamesPerSeason = 82;
    playoffSeeds = 8;
    seriesWinCount = 4;
    conferencesOn = true;
    collegeMode = false;
    difficulty = -1;
    tradeThreshold = 0.3;
    reboundSlider = 50;
    trainingPointsAvailable = 2;
}

function collegeSliderPreset() {
    twoPointPercentageLow = 20;
    twoPointPercentageHigh = 73;
    threePointPercentageLow = 25;
    threePointPercentageHigh = 55;
    defenseLow = 0;
    defenseHigh = 16;
    secondsOffClock = 24;
    gamesPerSeason = 38;
    seriesWinCount = 1;
    conferencesOn = false;
    collegeMode = true;
    difficulty = -1;
    tradeThreshold = 0.3;
    reboundSlider = 50;
    trainingPointsAvailable = 2;

    if (teams.length >= 64) {
        playoffSeeds = 64;
    } else if (teams.length >= 32) {
        playoffSeeds = 32;
    }
    else if (teams.length >= 16) {
        playoffSeeds = 16;
    } else if (teams.length >= 8) {
        playoffSeeds = 8;
    }
    else if (teams.length >= 4) {
        playoffSeeds = 4;
    }
    else if (teams.length >= 2) {
        playoffSeeds = 2;
    }
    else if (teams.length >= 1) {
        playoffSeeds = 1;
    }
}

function setSliders(twopl, twoph, thrpl, thrph, dl, dh, soc, diff, tradeDiff, rebSli, tptsavail) {
    twoPointPercentageLow = twopl;
    twoPointPercentageHigh = twoph;
    threePointPercentageLow = thrpl;
    threePointPercentageHigh = thrph;
    defenseLow = dl;
    defenseHigh = dh;
    secondsOffClock = soc;
    difficulty = diff;
    tradeThreshold = tradeDiff;
    if (rebSli == null) {
        reboundSlider = 50;
    } else {
        reboundSlider = rebSli;
    }
    if (tptsavail == null) {
        trainingPointsAvailable = 2;
    } else {
        trainingPointsAvailable = tptsavail;
    }
}

function setFranchiseSliders(gps, ps, swc, confOn, collm, skipNew) {
    gamesPerSeason = gps;
    playoffSeeds = ps;
    seriesWinCount = swc;
    conferencesOn = confOn;
    collegeMode = collm;

    if (skipNew === true) {
        console.log('Load Franchise Save')
        return;
    }
    franchise = new Franchise();
}

let refreshOff;

function setRefreshOff(ans) {
    refreshOff = ans;
}



class Player {
    constructor(player) {
        this.name = player.name;
        this.position = player.position;
        this.positionString;
        this.getPositionString();
        this.faceSrc = player.faceSrc;
        this.teamLogoSrc;
        this.teamName;
        this.usage = 0;
        this.reboundUsage = 0;
        this.number = player.number;
        this.height = "6\"2'";
        this.years = player.years;
        this.age = player.age;
        this.salary = player.salary;
        this.previousSeasonsStats = [];
        this.role = 0;
        this.tempRole = 0;
        this.trained = false;

        //rotation
        this.minutes = 0;
        this.minutesRemaining = 0;
        this.minutesPlayed = 0;
        this.minutesPlayedThisQuarter = 0;


        //game stats
        this.points = 0;
        this.rebounds = 0;
        this.offRebounds = 0;
        this.twoPointersAtt = 0;
        this.twoPointersMade = 0;
        this.threePointersAtt = 0;
        this.threePointersMade = 0;
        this.freeThrowsMade = 0;
        this.freeThrowsAttempted = 0;


        //season stats
        this.seasonPoints = 0;
        this.seasonRebounds = 0;
        this.seasonOffRebounds = 0;
        this.seasonTwoPointersAtt = 0;
        this.seasonTwoPointersMade = 0;
        this.seasonThreePointersAtt = 0;
        this.seasonThreePointersMade = 0;
        this.seasonFreeThrowsMade = 0;
        this.seasonFreeThrowsAttempted = 0;
        this.statsHistory = [];
        //ratings
        this.off = player.off;
        this.def = player.def;
        this.threePoint = 40;
        this.reb = 40;
        this.ft = 40;

        //for training screen
        this.offOld = player.off;
        this.defOld = player.def;
        this.passOld = player.pass;
        this.faceOffOld = player.faceOff;
        this.saveOld = player.save;

        this.rating = 80;

        //JSON
        this.team = player.team;

        //hockey
        this.save = player.save;
        this.faceOff = player.faceOff;
        this.pass = player.pass;

        //hockey stats
        this.saves = 0;
        this.goalsAllowed = 0;
        this.shots = 0;
        this.goals = 0;
        this.assists = 0;
        this.assistUsage = 0;

        this.iceTime = 0;
        this.shiftLength = 0;

        this.seasonGoals = 0;
        this.seasonSaves = 0;
        this.seasonGoalsAllowed = 0;
        this.seasonShots = 0;
        this.seasonAssists = 0;

        // console.log(this.name + " " + this.years + " " + this.salary);


    }

    getPositionString() {
        if (this.position === 0) {
            this.positionString = 'C'
        } else if (this.position === 1) {
            this.positionString = 'LW'
        } else if (this.position === 2) {
            this.positionString = 'RW'
        } else if (this.position === 3) {
            this.positionString = 'D'
        } else if (this.position === 4) {
            this.positionString = 'G'
        }
    }

    calculateRating() {

        //BLOCK OVER 99
        if (this.off >= 99) {
            this.off = 99;
        }
        if (this.def >= 99) {
            this.def = 99;
        }
        if (this.save >= 99) {
            this.save = 99;
        }
        if (this.faceOff >= 99) {
            this.faceOff = 99;
        }
        if (this.pass >= 99) {
            this.pass = 99;
        }

        //under 40 too
        if (this.off <= 40) {
            this.off = 40;
        }
        if (this.def <= 40) {
            this.def = 40;
        }
        if (this.save <= 40) {
            this.save = 40;
        }
        if (this.faceOff <= 40) {
            this.faceOff = 40;
        }
        if (this.pass <= 40) {
            this.pass = 40;
        }


        let bestrating = [this.off, this.def, this.pass, this.faceOff];
        bestrating.sort(function (a, b) {
            if (a < b) {
                return 1;
            }
            if (a > b) {
                return -1;
            }
            return 0;
        });



        if (this.position != 4) {
            this.rating = Math.round(((this.off * 2) + (this.def * 2) + (this.faceOff / 2) + (this.pass / 2) + (bestrating[0] * 2)) / 7);
            if (this.rating >= 99) {
                this.rating = 99;
            }
        } else {
            this.rating = this.save;
        }

    }

}
class Team {

    constructor(team) {
        this.conferenceId = team.conferenceId;
        this.id = team.id;
        this.name = team.name;
        this.rating = 0;
        this.logoSrc = team.logoSrc;
        this.uri = null;
        this.schedule = [];
        this.played = [];
        this.wins = 0;
        this.losses = 0;
        this.otLosses = 0;
        this.roster = [];
        this.lineup = [];
        this.history = [];
        this.seed = 1;
        this.ratingRank;
        this.powerRanking = 30;
        // this.calculateRating();
        this.firstTeam;
        this.secondTeam = [];
        this.bench = [];
        this.constantBench = [];
        this.trainingPoints = 0;
        // this.reorderLineup();


        this.draftPicks = [{
            round: 1,
            originalTeam: this.name,
            value: null,
            salary: 0,
            isPick: true,
            projectedPick: null,
            currentTeam: null
        },
        {
            round: 2,
            originalTeam: this.name,
            value: null,
            salary: 0,
            isPick: true,
            projectedPick: null,
            currentTeam: null
        },
        {
            round: 3,
            originalTeam: this.name,
            value: null,
            salary: 0,
            isPick: true,
            projectedPick: null,
            currentTeam: null
        },
        {
            round: 4,
            originalTeam: this.name,
            value: null,
            salary: 0,
            isPick: true,
            projectedPick: null,
            currentTeam: null
        },
        {
            round: 5,
            originalTeam: this.name,
            value: null,
            salary: 0,
            isPick: true,
            projectedPick: null,
            currentTeam: null
        },
        {
            round: 6,
            originalTeam: this.name,
            value: null,
            salary: 0,
            isPick: true,
            projectedPick: null,
            currentTeam: null
        },
        {
            round: 7,
            originalTeam: this.name,
            value: null,
            salary: 0,
            isPick: true,
            projectedPick: null,
            currentTeam: null
        },
        ]



        //stats
        this.seasonPoints = 0;
        this.seasonPointsAllowed = 0;
        this.seasonShots = 0;
        this.seasonSaves = 0;
        this.seasonGoalsAllowed = 0;

        this.seasonRebounds = 0;
        this.seasonOffRebounds = 0;
        this.seasonFieldGoalsAttempted = 0;
        this.seasonFieldGoalsMade = 0;
        this.seasonThreesAttempted = 0;
        this.seasonThreesMade = 0;
        this.seasonFreeThrowsMade = 0;
        this.seasonFreeThrowsAttempted = 0;

        this.expiring = {
            name: 'Expiring Contracts',
            roster: [],
            logoSrc: 'https://i.ibb.co/51fFLv2/GENERIC.png',
            reorderLineup: function () {
                availableFreeAgents.roster.sort(function (a, b) {
                    if (a.rating > b.rating)
                        return -1;
                    if (a.rating < b.rating)
                        return 1;
                    return 0;
                })
            }
        };


        //salary cap
        this.salary = 0;


        //position count
        this.pg = 0;
        this.sg = 0;
        this.sf = 0;
        this.pf = 0;
        this.c = 0;

        //Coach Sliders
        this.offVsDefFocus = Math.round(Math.random() * 6) - 3;
        this.qualityVsQuantity = Math.round(Math.random() * 6) - 3;
        this.defenseAggresiveVsConservative = Math.round(Math.random() * 6) - 3;
        this.forwardsVsDefensemen = Math.round(Math.random() * 6) - 3;

        //hockey coach sliders
        this.freezeThePuckVsPlayThePuck = Math.round(Math.random() * 6) - 3;

        //hockey
        this.offLine1 = [];
        this.defLine1 = [];
        this.offLine2 = [];
        this.defLine2 = [];
        this.offLine3 = [];
        this.defLine3 = [];
        this.offLine4 = [];
        this.goalies = [];
        this.onIce = [];


        this.defShiftOnIce = 1;
        this.offShiftOnIce = 1;


    }

    manageHockeyLineups() {
        this.roster.sort(function (a, b) {
            if (a.rating > b.rating)
                return -1;
            if (a.rating < b.rating)
                return 1;
            return 0;
        })

        this.offLine1 = [];
        this.offLine2 = [];
        this.offLine3 = [];
        this.offLine4 = [];
        this.defLine1 = [];
        this.defLine2 = [];
        this.defLine3 = [];
        this.goalies = [];


        for (let i = 0; i < this.roster.length; i++) {
            let ply = this.roster[i];
            if (ply.position <= 2) {
                //off
                if (this.offLine1.length < 3) {
                    this.offLine1.push(ply);
                }
                else if (this.offLine2.length < 3) {
                    this.offLine2.push(ply);

                }
                else if (this.offLine3.length < 3) {
                    this.offLine3.push(ply);

                }
                else if (this.offLine4.length < 3) {
                    this.offLine4.push(ply);

                }
            }
            if (ply.position === 3) {
                if (this.defLine1.length < 2) {
                    this.defLine1.push(ply);

                }
                else if (this.defLine2.length < 2) {
                    this.defLine2.push(ply);

                }
                else if (this.defLine3.length < 2) {
                    this.defLine3.push(ply);

                }

            }
            if (ply.position === 4) {
                this.goalies.push(ply);

            }

        }

        if (this.offLine1.length < 3) {
            console.log(this.name);
        }
        if (this.offLine2.length < 3) {
            console.log(this.name);
        }
        if (this.offLine3.length < 3) {
            console.log(this.name);
        }
        if (this.offLine4.length < 3) {
            console.log(this.name);
        }
        if (this.defLine1.length < 2) {
            console.log(this.name);
        }
        if (this.defLine2.length < 2) {
            console.log(this.name);
        }
        if (this.defLine3.length < 2) {
            console.log(this.name);
        }
        if (this.goalies.length < 2) {
            console.log(this.name);
        }

        this.onIce = this.offLine1.concat(this.defLine1);
        //quick fixs
        this.firstTeam = this.onIce;

        this.offLine1.sort(function (a, b) {
            if (a.position < b.position)
                return -1;
            if (a.position > b.position)
                return 1;
            return 0;
        })
        this.offLine2.sort(function (a, b) {
            if (a.position < b.position)
                return -1;
            if (a.position > b.position)
                return 1;
            return 0;
        })
        this.offLine3.sort(function (a, b) {
            if (a.position < b.position)
                return -1;
            if (a.position > b.position)
                return 1;
            return 0;
        })
        this.offLine4.sort(function (a, b) {
            if (a.position < b.position)
                return -1;
            if (a.position > b.position)
                return 1;
            return 0;
        })
    }

    releaseExpiring() {
        for (let i = 0; i < this.expiring.roster.length; i++) {
            availableFreeAgents.roster.push(this.expiring.roster[i]);
        }
        this.expiring.roster = [];
    }


    calculateRating() {

        try {

            let total = 0;
            for (let i = 0; i < this.roster.length; i++) {
                total += this.roster[i].rating;
            }
            let bests = 0;
            for (let i = 0; i < 6; i++) {
                bests += this.roster[i].rating;
            }


            this.rating = Math.round((total + bests + bests + bests + bests) / (this.roster.length + 24));
        } catch (err) {
            console.log(this.name);
        }

    }

    /*
1st quarter, first 8 minutes: 1st team
1st quarter, last 4 minutes; 
2nd quarter, first 4 minutes: 2nd team
3rd quarter, first 8 minutes: 1st team
3rd quarter, last 4 minutes;

4th quarter, first 4 minutes: 2nd team
4th quarter, last 8 minutes: 1st team

*/


    reorderLineup() {
        this.manageHockeyLineups();
        this.calculateRating();
    }

    setPlayerRoles() {
        try {


            for (let i = 0; i < this.roster.length; i++) {
                this.roster[i].role = 0;
                this.roster[i].tempRole = 0;
            }

            for (let i = 0; i < this.firstTeam.length; i++) {
                this.firstTeam[i].role = 3;
                this.firstTeam[i].tempRole = 3;
            }

            for (let i = 0; i < this.secondTeam.length; i++) {
                this.secondTeam[i].role = 1;
                this.secondTeam[i].tempRole = 1;
            }

            let tot = 0;
            for (let i = 0; i < this.firstTeam.length; i++) {
                tot += this.firstTeam[i].rating;
            }

            for (let i = 0; i < this.firstTeam.length; i++) {
                let amt = (this.firstTeam[i].rating / tot) * 100
                if (amt > 21) {
                    // console.log(this.firstTeam[i].name);
                    this.firstTeam[i].role = 4;
                    this.firstTeam[i].tempRole = 4;
                    break;
                }
            }

            this.secondTeam.sort(function (a, b) {
                if (a.rating > b.rating) {
                    return -1;
                }
                if (a.rating < b.rating) {
                    return 1;
                }
                else { return 0 }
            })

            this.secondTeam[0].role = 2;
            this.secondTeam[0].tempRole = 2;
        } catch (err) {
            console.log("Role Error");
        }

    }

    manageUsage() {
        try {

            let rebTotal = 0;
            for (let i = 0; i < this.firstTeam.length; i++) {
                rebTotal += this.firstTeam[i].reb + (this.firstTeam[i].position * 20);
            }

            for (let i = 0; i < this.firstTeam.length; i++) {
                this.firstTeam[i].reboundUsage = ((this.firstTeam[i].reb + (this.firstTeam[i].position * 20)) / rebTotal) * 100;
            }

            // rebTotal = 0;
            // for (let i = 0; i < this.secondTeam.length; i++) {
            //     rebTotal += this.secondTeam[i].reb + (this.secondTeam[i].position * 20);
            // }

            // for (let i = 0; i < this.secondTeam.length; i++) {
            //     this.secondTeam[i].reboundUsage = ((this.secondTeam[i].reb + (this.secondTeam[i].position * 20)) / rebTotal) * 100;
            // }


            let tot = 0;
            for (let i = 0; i < this.firstTeam.length; i++) {
                tot += (scaleBetween(this.firstTeam[i].off, 0, 400, 40, 99) + (scaleBetween(this.firstTeam[i].threePoint, 0, 400, 40, 99) / 4));
                if (i < 2) {
                    //backcourt
                    tot += this.frontCourtVsBackCourt * 35;
                } else {
                    //frontcourt
                    tot -= (this.frontCourtVsBackCourt * 35);
                }


            }

            for (let i = 0; i < this.firstTeam.length; i++) {
                let usage = (scaleBetween(this.firstTeam[i].off, 0, 400, 40, 99) + (scaleBetween(this.firstTeam[i].threePoint, 0, 400, 40, 99) / 4));
                if (i < 2) {
                    //backcourt
                    tot += this.frontCourtVsBackCourt * 35;
                } else {
                    //frontcourt
                    tot -= (this.frontCourtVsBackCourt * 35);
                }

                this.firstTeam[i].usage = (usage / tot) * 100;

            }

            // tot = 0;
            // for (let i = 0; i < this.secondTeam.length; i++) {
            //     tot += (this.secondTeam[i].off + (this.secondTeam[i].threePoint / 4));
            // }

            // for (let i = 0; i < this.secondTeam.length; i++) {
            //     this.secondTeam[i].usage = ((this.secondTeam[i].off + (this.secondTeam[i].threePoint / 4)) / tot) * 100;
            // }




            if (this.roster.length <= this.rotationSize) {
                console.log(this.name + " Does not have enough players");
                this.rotationSize = this.roster.length - 1;
            }


            //MINUTES IN ROTATION
            tot = 0;

            let includedInRotation = [...this.firstTeam];
            for (let i = 0; i < this.bench.length; i++) {
                if (includedInRotation.length >= this.rotationSize) {
                    break;
                } else {
                    includedInRotation.push(this.bench[i]);
                }
            }



            for (let i = 0; i < includedInRotation.length; i++) {
                tot += scaleBetween(includedInRotation[i].rating, 300, 1000, 80, 99);
                tot += scaleBetween(includedInRotation[i].role, 0, 600, 0, 4);

            }

            for (let i = 0; i < includedInRotation.length; i++) {
                includedInRotation[i].minutes = Math.round(((scaleBetween(includedInRotation[i].rating, 300, 1000, 80, 99) + scaleBetween(includedInRotation[i].role, 0, 600, 0, 4)) / tot) * 240);
            }


            for (let i = 0; i < includedInRotation.length; i++) {
                if (includedInRotation[i].minutes >= 38) {
                    let rem = includedInRotation[i].minutes - 38;
                    includedInRotation[i].minutes = 38;

                    let index = i + 1;
                    while (rem > 0) {
                        includedInRotation[index].minutes++;
                        rem--;
                        index++;
                        if (index >= includedInRotation.length - 1) {
                            index = i + 1;
                        }
                    }

                }
            }


            this.bench = [];
            for (let i = 0; i < includedInRotation.length; i++) {
                if (!this.firstTeam.includes(includedInRotation[i])) {
                    this.bench.push(includedInRotation[i]);
                }
            }

        }
        catch (err) {
            console.log(this.name + " ERROR"); console.log(err);
        }

        //messes up
        // this.lineup = this.firstTeam;
        // this.lineup=[];
        // this.lineup = this.lineup.concat(this.firstTeam);
        // this.lineup = this.firstTeam;
        this.lineup = this.firstTeam.slice(0);


        this.bench.sort(function (a, b) {
            if (a.minutes > b.minutes) {
                return 1;
            }
            if (a.minutes > b.minutes) {
                return -1;
            }
            else { return 0; }
        });


        this.constantBench = [...this.bench];
    }

    generateBenchWarmers() {
        let benchWarmers = [];

        for (let i = 0; i < this.roster.length; i++) {
            if (!this.firstTeam.includes(this.roster[i]) && !this.secondTeam.includes(this.roster[i])) {
                benchWarmers.push(this.roster[i]);
            }
        }

        return benchWarmers;
    }


}


//INITIAL JSON READING
//PARSING JSON
let teams = [];
let conferences = [];

let easternConference = {
    name: 'Eastern Conference',
    teams: [],
    logoSrc: 'https://i.ibb.co/51fFLv2/GENERIC.png',
    id: 0
};

let westernConference = {
    name: 'Western Conference',
    teams: [],
    logoSrc: 'https://i.ibb.co/51fFLv2/GENERIC.png',
    id: 1
};

conferences.push(easternConference, westernConference);

let availableFreeAgents = {
    name: 'Free Agents',
    roster: [],
    logoSrc: 'https://i.ibb.co/51fFLv2/GENERIC.png',
    reorderLineup: function () {
        availableFreeAgents.roster.sort(function (a, b) {
            if (a.rating > b.rating)
                return -1;
            if (a.rating < b.rating)
                return 1;
            return 0;
        })
    }
};

function loadRosters() {
    teams = [];
    for (let i = 0; i < conferences.length; i++) {
        conferences[i].teams = [];
    }

    for (let i = 0; i < teamsData.length; i++) {
        teams.push(new Team(teamsData[i]));
        for (let j = 0; j < playerData.length; j++) {
            if (playerData[j].team === teams[i].id) {
                ply = new Player(playerData[j]);
                ply.calculateRating();
                teams[i].roster.push(ply);
                ply.teamLogoSrc = teams[i].logoSrc;
                ply.teamName = teams[i].name;
            }
        }
        if (teams[i].roster.length <= 0) {
            generateCustomRoster(teams[i], teamsData[i].rating);
        }
        for (let k = 0; k < conferences.length; k++) {
            if (teams[i].conferenceId === conferences[k].id) {
                conferences[k].teams.push(teams[i]);
            }
        }
        teams[i].reorderLineup();
        teams[i].calculateRating();
        teams[i].manageHockeyLineups();
        sortedRoster(teams[i], 'rating');
    }
    setTeamSalaries();

    //NO NEEED TO PARSE JSON ITS ALREADY IN OBJECT FORMAT
    // for (let i = 0; i < rosterData.length; i++) {
    //     teams.push(new Team(rosterData[i]));
    // }
    availableFreeAgents.roster = [];
    for (let i = 0; i < freeAgents.length; i++) {
        availableFreeAgents.roster.push(new Player(freeAgents[i]));
        availableFreeAgents.roster[i].calculateRating();
        availableFreeAgents.roster[i].teamLogoSrc = availableFreeAgents.logoSrc;
        availableFreeAgents.roster[i].teamName = availableFreeAgents.name;

    }
    availableFreeAgents.reorderLineup();
    setSalaryExpectations(availableFreeAgents);

    generateDraftClass();
}

//DRAFT CLASS GENERATOR
let draftClass = {
    name: 'Draft Class',
    roster: [],
    logoSrc: 'https://i.ibb.co/51fFLv2/GENERIC.png',
    reorderLineup: function () {
        draftClass.roster.sort(function (a, b) {
            if (a.rating > b.rating)
                return -1;
            if (a.rating < b.rating)
                return 1;
            return 0;
        })
    }
};


function generateCustomRoster(team, rating) {
    team.roster = [];
    let pg = 0;
    let sg = 0;
    let sf = 0;
    let pf = 0;
    let c = 0;
    for (let i = 0; i < 24; i++) {
        let name = draftData[Math.floor(Math.random() * draftData.length)].firstname + " " + draftData[Math.floor(Math.random() * draftData.length)].lastname;
        let faceSrc = draftData[0].faceSrc;
        let number = draftData[Math.floor(Math.random() * draftData.length)].number;
        let age = draftData[Math.floor(Math.random() * draftData.length)].age;
        let playerComparison = Math.floor(Math.random() * draftData.length);

        // if(pg < POS_PG_REQUIREMENTS){
        //     while(draftData[playerComparison].position != 0){
        //     playerComparison = Math.floor(Math.random() * draftData.length);
        //     }
        //     pg++;
        // }else if(sg < POS_SG_REQUIREMENTS){
        //     while(draftData[playerComparison].position != 1){
        //         playerComparison = Math.floor(Math.random() * draftData.length);
        //         }
        //     sg++;

        // }else if(sf < POS_SF_REQUIREMENTS){
        //     while(draftData[playerComparison].position != 2){
        //         playerComparison = Math.floor(Math.random() * draftData.length);
        //         }
        //     sf++;

        // }else if(pf < POS_PF_REQUIREMENTS){
        //     while(draftData[playerComparison].position != 3){
        //         playerComparison = Math.floor(Math.random() * draftData.length);
        //         }
        //     pf++;

        // }else if(c < POS_C_REQUIREMENTS){
        //     while(draftData[playerComparison].position != 4){
        //         playerComparison = Math.floor(Math.random() * draftData.length);
        //         }
        //     c++;

        // }

        let position = draftData[playerComparison].position;
        let height = draftData[playerComparison].height;
        let off = (draftData[playerComparison].off - 8) + Math.floor(Math.random() * 5);
        let def = (draftData[playerComparison].def - 8) + Math.floor(Math.random() * 5);
        let save = (draftData[playerComparison].save - 8) + Math.floor(Math.random() * 5);
        let faceOff = (draftData[playerComparison].faceOff - 3) + Math.floor(Math.random() * 5);
        let pass = (draftData[playerComparison].pass - 8) + Math.floor(Math.random() * 5);
        //2 years the plus one is because the contract years go down AFTER the draft not before but contract years should be 2 for rookies
        let years = Math.floor(Math.random() * 3) + 1;
        let salary = 2400000;


        //RATING FORMULA

        let ply = new Player({
            name: name,
            faceSrc: faceSrc,
            number: number,
            age: age,
            position: position,
            height: height,
            off: off,
            def: def,
            save: save,
            pass: pass,
            faceOff: faceOff,
            years: years,
            salary: salary,
            rating: rating
        });
        ply.calculateRating();
        team.roster.push(ply);


    }

    for (let i = 0; i < team.roster.length; i++) {
        team.roster[i].teamName = team.name;
        team.roster[i].teamLogoSrc = team.logoSrc;
    }


    team.reorderLineup();
    // team.calculateRating();

    if (team.rating > rating) {
        while (team.rating != rating) {
            for (let i = 0; i < team.roster.length; i++) {
                team.roster[i].off--;
                team.roster[i].def--;
                team.roster[i].threePoint--;
                team.roster[i].reb--;
                team.roster[i].calculateRating();
                team.calculateRating();
                if (team.rating <= rating) {
                    return;
                }
            }
        }
    }

    if (team.rating < rating) {
        while (team.rating != rating) {
            for (let i = 0; i < team.roster.length; i++) {
                team.roster[i].off++;
                team.roster[i].def++;
                team.roster[i].threePoint++;
                team.roster[i].reb++;
                team.roster[i].calculateRating();
                team.calculateRating();
                if (team.rating >= rating) {
                    return;
                }
            }
        }
    }

}

function generateFreeAgents(amount, ratingSubtraction) {
    availableFreeAgents.roster = [];
    for (let i = 0; i < amount; i++) {
        let name = draftData[Math.floor(Math.random() * draftData.length)].firstname + " " + draftData[Math.floor(Math.random() * draftData.length)].lastname;
        let faceSrc = draftData[0].faceSrc;
        let number = draftData[Math.floor(Math.random() * draftData.length)].number;
        let age = Math.floor(Math.random() * 15) + 20;
        if (collegeMode) {
            age = 18;
        }

        let playerComparison = Math.floor(Math.random() * draftData.length);
        let position = draftData[playerComparison].position;
        let height = draftData[playerComparison].height;
        let off = (draftData[playerComparison].off - ratingSubtraction) + Math.floor(Math.random() * 5);
        let def = (draftData[playerComparison].def - ratingSubtraction) + Math.floor(Math.random() * 5);
        let pass = (draftData[playerComparison].pass - ratingSubtraction) + Math.floor(Math.random() * 5);
        let save = (draftData[playerComparison].save - ratingSubtraction) + Math.floor(Math.random() * 5);
        let faceOff = (draftData[playerComparison].faceOff - ratingSubtraction) + Math.floor(Math.random() * 5);
        //2 years the plus one is because the contract years go down AFTER the draft not before but contract years should be 2 for rookies
        let years = 2 + 1;
        let salary = 1200000;

        if (collegeMode) {
            years = 4;
        }

        //RATING FORMULA


        let ply = new Player({
            name: name,
            faceSrc: faceSrc,
            number: number,
            age: age,
            position: position,
            height: height,
            off: off,
            def: def,
            pass: pass,
            save: save,
            faceOff: faceOff,
            years: years,
            salary: salary,
        })

        ply.calculateRating();
        availableFreeAgents.roster.push(ply);
    }

}



function generateDraftClass() {
    draftClass.roster = [];
    for (let i = 0; i < Math.floor(teams.length * 10); i++) {
        let name = draftData[Math.floor(Math.random() * draftData.length)].firstname + " " + draftData[Math.floor(Math.random() * draftData.length)].lastname;
        let faceSrc = draftData[0].faceSrc;
        let number = draftData[Math.floor(Math.random() * draftData.length)].number;
        let age = draftData[Math.floor(Math.random() * draftData.length)].age;

        let playerComparison = Math.floor(Math.random() * draftData.length);
        let position = draftData[playerComparison].position;
        let height = draftData[playerComparison].height;
        let off = (draftData[playerComparison].off - 15) + Math.floor(Math.random() * 5);
        let def = (draftData[playerComparison].def - 15) + Math.floor(Math.random() * 5);
        let save = (draftData[playerComparison].save - 15) + Math.floor(Math.random() * 5);
        let pass = (draftData[playerComparison].pass - 15) + Math.floor(Math.random() * 5);
        let faceOff = (draftData[playerComparison].faceOff - 15) + Math.floor(Math.random() * 5);
        //2 years the plus one is because the contract years go down AFTER the draft not before but contract years should be 2 for rookies
        let years = 2 + 1;
        let salary = 1200000;

        //RATING FORMULA

        let ply = new Player({
            name: name,
            faceSrc: faceSrc,
            number: number,
            age: age,
            position: position,
            height: height,
            off: off,
            def: def,
            save: save,
            pass: pass,
            faceOff: faceOff,
            years: years,
            salary: salary,
        });

        ply.calculateRating();
        draftClass.roster.push(ply);

    }

}

loadRosters();



//*********************************************************/


//Random Selections For Menu Display
let randomTeamSelections = [];
let generated1;
let generated2;
let generated3;
let generated4;
menuDisplayTeams();

function menuDisplayTeams() {
    randomTeamSelections = [];

    while (randomTeamSelections.length < 8) {
        let selection = Math.floor(Math.random() * teams.length);
        if (randomTeamSelections.indexOf(selection) === -1) randomTeamSelections.push(selection);
    }


    home = teams[randomTeamSelections[0]];
    away = teams[randomTeamSelections[1]];
    selectedTeam = teams[randomTeamSelections[2]];
    generated1 = teams[randomTeamSelections[3]];
    generated2 = teams[randomTeamSelections[4]];
    generated3 = teams[randomTeamSelections[5]];
    generated4 = teams[randomTeamSelections[6]];


}



function setHomeAway(h, a) {
    home = h;
    away = a;
}

function setHome(h) {
    home = h;
}

function setAway(a) {
    away = a;
}

function setSelectedTeam(t) {
    selectedTeam = t;
}



//My favorite function <3
function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
    return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

class Results {
    constructor(userScore, oppScore) {
        this.oppScore = oppScore;
        this.userScore = userScore;
        if (userScore > oppScore) {
            this.won = true;
        } else {
            this.won = false;
        }
    }
}

class Game {
    constructor() {
        this.time = (20 * 3) * 60;
        this.homescore = 0;
        this.awayscore = 0;
        this.shotsAtt = 0;
        this.shotsMade = 0;
        this.threesAtt = 0;
        this.threesMade = 0;
        this.iceTime = 0;
        this.possResult = [];
        this.quarter = 1;
        this.overtime = false;

    }

    manageOnIceUsage(off) {
        //offense
        let total = 0;
        for (let i = 0; i < off.onIce.length; i++) {
            let ply = off.onIce[i];
            total += ply.off;
            if (i > 2) {
                //defensemen
                total -= off.forwardsVsDefensemen * 3;
            } else {
                total += off.forwardsVsDefensemen * 3;
            }
        }
        for (let i = 0; i < off.onIce.length; i++) {
            let ply = off.onIce[i];
            let posFactor = 0;
            if (i > 2) {
                //defensemen
                posFactor -= off.forwardsVsDefensemen * 3;
            } else {
                posFactor += off.forwardsVsDefensemen * 3;
            }

            ply.usage = ((ply.off + posFactor) / total) * 100;
        }

        //TODO assist usage
        let totalAssist = 0;
        for (let i = 0; i < off.onIce.length; i++) {
            let ply = off.onIce[i];
            totalAssist += ply.pass;
        }
        for (let i = 0; i < off.onIce.length; i++) {
            let ply = off.onIce[i];
            ply.assistUsage = (ply.pass / totalAssist) * 100;
        }
    }

    manageShift(team) {
        let newOffShift;
        let newDefShift;

        //
        if (team.offShiftOnIce === 1) {
            newOffShift = team.offLine1;
        }
        else if (team.offShiftOnIce === 2) {
            newOffShift = team.offLine2;
        }
        else if (team.offShiftOnIce === 3) {
            newOffShift = team.offLine3;
        }
        else if (team.offShiftOnIce === 4) {
            newOffShift = team.offLine4;
        }
        if (team.defShiftOnIce === 1) {
            newDefShift = team.defLine1;
        }
        else if (team.defShiftOnIce === 2) {
            newDefShift = team.defLine2;
        }
        else if (team.defShiftOnIce === 3) {
            newDefShift = team.defLine3;
        }



        if (team.offShiftOnIce === 1 && this.iceTime >= 60) {
            newOffShift = team.offLine2;
            team.offShiftOnIce = 2;
            this.iceTime = 0;
        }
        else if (team.offShiftOnIce === 2 && this.iceTime >= 50) {
            newOffShift = team.offLine3;
            team.offShiftOnIce = 3;
            this.iceTime = 0;

        }
        else if (team.offShiftOnIce === 3 && this.iceTime >= 35) {
            newOffShift = team.offLine4;
            team.offShiftOnIce = 4;
            this.iceTime = 0;

        }
        else if (team.offShiftOnIce === 4 && this.iceTime >= 25) {
            newOffShift = team.offLine1;
            team.offShiftOnIce = 1;
            this.iceTime = 0;
        }
        if (team.defShiftOnIce === 1) {
            newDefShift = team.defLine2;
            team.defShiftOnIce = 2;
            this.iceTime = 0;
        }
        else if (team.defShiftOnIce === 2) {
            newDefShift = team.defLine3;
            team.defShiftOnIce = 3;
            this.iceTime = 0;
        }
        else if (team.defShiftOnIce === 3) {
            newDefShift = team.defLine1;
            team.defShiftOnIce = 1;
            this.iceTime = 0;
        }

        team.onIce = newOffShift.concat(newDefShift);
    }

    hockeyPossesion(off, def) {
        try {
            if (this.time <= 0) {
                return;
            }
            //set up first lineups for now

            this.manageShift(off);
            this.manageShift(def);

            this.manageOnIceUsage(off);
            this.manageOnIceUsage(def);


            let shooter;
            let total = 0;
            let selection = Math.random() * 100;
            for (let i = 0; i < off.onIce.length; i++) {
                total += off.onIce[i].usage;
                if (total >= selection) {
                    shooter = off.onIce[i];
                    break;
                }
            }

            // console.log(off.onIce.length);

            // let shooter = off.onIce[Math.floor(Math.random()*off.onIce.length)];
            let assister;
            total = 0;
            selection = Math.random() * 100;
            for (let i = 0; i < off.onIce.length; i++) {
                total += off.onIce[i].assistUsage;
                if (total >= selection) {
                    assister = off.onIce[i];
                    break;
                }
            }



            let goalie = def.goalies[0];

            // console.log(shooter.name);

            //shot
            let defenseOverall = 0;
            let offenseOverall = 0;

            for (let i = 0; i < def.onIce.length; i++) {
                let ply = def.onIce[i];
                defenseOverall += ply.def;
            }

            for (let i = 0; i < off.onIce.length; i++) {
                let ply = off.onIce[i];
                offenseOverall += ply.off;
            }

            // // TURNOVER
            // if(Math.random()*100 < (5  + (2*def.defenseAggresiveVsConservative))){
            //     return;
            // }

            let scaledDef = scaleBetween(defenseOverall, 0, 20, 200, 495);
            let scaledOff = scaleBetween(offenseOverall, 0, 16, 200, 495);
            let assistFactor = scaleBetween(assister.pass, 0, 7, 40, 99);

            let offVsDef = scaledDef - scaledOff;

            // console.log('def' + scaledDef);
            // console.log('off' + scaledOff);

            let offVsDefSliders = (off.offVsDefFocus - def.offVsDefFocus) / 4;
            let aggressiveVsConservativeSliders = (off.defenseAggresiveVsConservative - def.defenseAggresiveVsConservative) / 4;
            let freezeThePuckVsPlayThePuckSliders = (off.freezeThePuckVsPlayThePuck - def.freezeThePuckVsPlayThePuck) / 4;

            let shooterRatingFactor = scaleBetween(shooter.off, -5, 6, 40, 99);

            let goalieSavePercentage = scaleBetween(goalie.save, 76, 96, 40, 99);

            //time off clock
            let timeOff = Math.floor(Math.random() * 60) + 30 - (off.qualityVsQuantity * 8);
            this.time -= timeOff;
            this.iceTime = timeOff;

            let difficultySliderFactor = 0;

            if(off === selectedTeam){
                difficultySliderFactor = difficulty
            }
            if(def === selectedTeam){
                difficultySliderFactor = -difficulty
            }

            let saveFactor = (goalieSavePercentage - shooterRatingFactor + offVsDef - assistFactor + off.qualityVsQuantity - offVsDefSliders - aggressiveVsConservativeSliders - freezeThePuckVsPlayThePuckSliders + difficultySliderFactor);
            // if(def.name === 'Detroit Red Wings'){
            //     console.log('END: ' + saveFactor);
            //     console.log('GOALIE %' + goalieSavePercentage);
            //     console.log('SHOOTERRATINGFAC -' + shooterRatingFactor);
            //     console.log('OFFVSDEF +'+offVsDef);
            //     console.log('ASSIST -' + assistFactor);
            //     console.log('OFFQUALVSQUAN +' + off.qualityVsQuantity);
            //     console.log('offvsdefslider -' + offVsDefSliders);
            //     console.log('defaggvscons -' + def.defenseAggresiveVsConservative);
            //     console.log('defFreeze -' + def.freezeThePuckVsPlayThePuck);
            //     console.log('offFreeze +' + off.freezeThePuckVsPlayThePuck);

            // }
            if (saveFactor > 96) {
                saveFactor = 96;
            }
            // console.log(saveFactor);
            let chance = Math.random() * 100;
            // console.log(chance);
            //shot
            shooter.shots++;
            off.seasonShots++;

            if (saveFactor >= chance) {
                //save
                goalie.saves++;
                def.seasonSaves++;
                let reboundPercentage = Math.random()*10 + (off.qualityVsQuantity*2);
                if(reboundPercentage > Math.random()*100){
                    //rebound
                    this.hockeyPossesion(off,def);

                }


                return;
            } else {
                //goal

                goalie.goalsAllowed++;
                def.seasonGoalsAllowed++;
                shooter.goals++;
                if (shooter != assister) {
                    assister.assists++;
                }
                if (off === home) {
                    this.homescore++;
                } else {
                    this.awayscore++;
                }
                let result = "Scores!"
                if (shooter != assister) {
                    result += " assisted by " + assister.positionString + ' #' + assister.number + ' ' + assister.name;
                }

                this.possResult.unshift({
                    shooter: shooter,
                    result: result,
                    homeScore: this.homescore,
                    awayScore: this.awayscore
                })

            }

        } catch (err) {
            console.log(err);
        }


    }


    manageLineupUsage(team) {
        let rebTotal = 0;
        for (let i = 0; i < team.lineup.length; i++) {
            rebTotal += team.lineup[i].reb + (team.lineup[i].position * 20);
        }

        for (let i = 0; i < team.lineup.length; i++) {
            team.lineup[i].reboundUsage = ((team.lineup[i].reb + (team.lineup[i].position * 20)) / rebTotal) * 100;
        }

        let tot = 0;
        for (let i = 0; i < team.lineup.length; i++) {
            tot += (scaleBetween(team.lineup[i].off, 0, 400, 40, 99) + (scaleBetween(team.lineup[i].threePoint, 0, 400, 40, 99) / 4));
            if (i < 2) {
                //backcourt
                tot += team.frontCourtVsBackCourt * 35;
            } else {
                //frontcourt
                tot -= (team.frontCourtVsBackCourt * 35);
            }


        }

        for (let i = 0; i < team.lineup.length; i++) {
            let usage = (scaleBetween(team.lineup[i].off, 0, 400, 40, 99) + (scaleBetween(team.lineup[i].threePoint, 0, 400, 40, 99) / 4));
            if (i < 2) {
                //backcourt
                usage += team.frontCourtVsBackCourt * 35;
            } else {
                //frontcourt
                usage -= (team.frontCourtVsBackCourt * 35);
            }


            team.lineup[i].usage = (usage / tot) * 100;

        }

        let lineupUsageTot = 0;
        for (let i = 0; i < team.lineup.length; i++) {
            lineupUsageTot += team.lineup[i].usage;
        }
        if (lineupUsageTot < 99) {
            console.log(lineupUsageTot);
            console.log(team.name);
            for (let i = 0; i < team.lineup.length; i++) {
                console.log(team.lineup[i].name);
            }
        }



    }

    endOfQuarter() {
        if (this.quarter != 4 && this.time / 60 <= 12) {
            this.quarter = 4;
            return true;
        }
        if (this.quarter != 3 && this.time / 60 <= 24) {
            this.quarter = 3;
            return true;
        }
        if (this.quarter != 2 && this.time / 60 <= 36) {
            this.quarter = 2;
            return true;
        }
        return false;
    }


    rotation(team) {

        if ((this.time / 60) < 5) {
            team.lineup = [...team.firstTeam];
            this.manageLineupUsage(team);
            // for(let i=0; i<team.lineup.length; i++){
            //     console.log(team.lineup[i].name);
            // }
            team.lineup.sort(function (a, b) {
                if (a.position > b.position) {
                    return 1
                }
                if (a.position < b.position) {
                    return -1;
                }
                else { return 0; }
            })

            return;
        }




        for (let i = 0; i < team.lineup.length; i++) {
            let ply = team.lineup[i];

            if (ply.minutesPlayedThisQuarter >= ply.minutes / 4) {
                team.lineup[i] = team.bench.shift();
                team.bench.push(ply);

                for (let i = 0; i < team.lineup.length; i++) {
                    let obj = team.lineup[i];

                    if (i != team.lineup.indexOf(obj)) {
                        console.log('duplicate lineup error');
                        console.log(team.name);
                        team.lineup = team.firstTeam;
                        team.bench = team.constantBench;
                        // for(let j=0; j< team.lineup.length; j++){
                        //     console.log(team.lineup[j].name);
                        // }
                    }
                }


                team.lineup.sort(function (a, b) {
                    if (a.position > b.position) {
                        return 1
                    }
                    if (a.position < b.position) {
                        return -1;
                    }
                    else { return 0; }
                })

                this.manageLineupUsage(team);
                // console.log(" ");
                // for(let i=0; i<team.lineup.length; i++){
                //     console.log(team.lineup[i].name);
                // }
                // console.log(" ");
                // for(let i=0; i<team.bench.length; i++){
                //     console.log(team.bench[i].name);
                // }


            }
        }
    }

    rebound(off, def) {
        let selection = Math.random() * 100;
        let currentNumber = 0;
        let rebounder;
        let offRebounder;
        for (let i = 0; i < def.lineup.length; i++) {
            currentNumber += def.lineup[i].reboundUsage;
            if (selection <= currentNumber) {
                rebounder = def.lineup[i];
                offRebounder = off.lineup[i];
                break;
            }
        }

        let reboundFormula = scaleBetween(((offRebounder.reb - (off.freezeThePuckVsPlayThePuck * 3)) - (rebounder.reb - (def.freezeThePuckVsPlayThePuck * 3))), 0, reboundSlider, -59, 59);

        if ((Math.random() * 100 <= reboundFormula)) {
            //offensive rebound
            // console.log(offRebounder.name + ": " + reboundFormula);
            offRebounder.rebounds++;
            offRebounder.offRebounds++;

            off.seasonRebounds++;
            off.seasonOffRebounds++;
            return true;
        } else {
            rebounder.rebounds++;

            //TEAM
            def.seasonRebounds++;
            return false;
        }

    }


    possesion(off) {
        const TWO = 0;
        const THREE = 1;
        let shotSelection;
        let defender;
        let shooter;
        let rebounder;
        let shotPercentage;
        let secondsRemoved;
        let offensiveRebound = false;

        let difficultySliderInfluence = 0;
        if (off === selectedTeam) {
            difficultySliderInfluence = difficulty * -1;
        }
        if (def === selectedTeam) {
            difficultySliderInfluence = difficulty;
        }

        let def;
        if (off === home) {
            def = away;
        } else {
            def = home;
        }


        if (this.time <= 0) {
            if (this.homescore === this.awayscore) {
                // console.log('OVERTIME' + def.name + ' ' + off.name);
                this.time = (5 * 60);
            } else {
                return;
            }
        }

        // let timeConversion = (this.time/60);
        // if(timeConversion> 36){
        //     timeConversion = timeConversion-36;
        // }else if(timeConversion> 24){
        //     timeConversion -= 24;
        // }else if(timeConversion>12){
        //     timeConversion -=12;
        // }else{
        // }

        // console.log(timeConversion);
        // if(timeConversion < 2){
        //     console.log('star in for benchwarmer');
        // }else if(timeConversion < 4){
        //     console.log('bench in for starter');
        // }
        // else if(timeConversion <5){
        //     console.log('6th man in for fringe starter');
        // }

        //   if ((this.time / 60) < 38) {
        //     off.lineup = off.secondTeam;
        //     def.lineup = def.secondTeam;

        // }
        // if ((this.time / 60) < 32) {
        //     off.lineup = off.firstTeam;
        //     def.lineup = def.firstTeam;

        // }
        // if ((this.time / 60) < 14) {
        //     off.lineup = off.secondTeam;
        //     def.lineup = def.secondTeam;

        // }
        // if ((this.time / 60) < 8) {
        //     off.lineup = off.firstTeam;
        //     def.lineup = def.firstTeam;

        // }



        this.rotation(off);
        this.rotation(def);


        //off poss
        // Select shooter based on usage;
        let selection = Math.random() * 100;
        let currentNumber = 0;
        for (let i = 0; i < off.lineup.length; i++) {
            currentNumber += off.lineup[i].usage;
            if (selection <= currentNumber) {
                shooter = off.lineup[i];
                defender = def.lineup[i];
                break;
            }
        }

        if (shooter == null) {
            shooter = off.lineup[0];
        }

        if (defender == null) {
            defender = def.lineup[0];
        }



        //SELECT shot two point or three point
        if ((Math.random() * 100) > 9) {
            if ((Math.random() * 100) > (shooter.threePoint / 2) + (off.qualityVsQuantity - def.defenseAggresiveVsConservative)) {
                shotSelection = TWO;
                shooter.twoPointersAtt++;
                this.shotsAtt++;

                //TEAM
                off.seasonFieldGoalsAttempted++;

            } else {
                if (shooter.threePoint < 60) {
                    shotSelection = TWO;
                    shooter.twoPointersAtt++;
                    this.shotsAtt++;

                    off.seasonFieldGoalsAttempted++;
                } else {
                    shotSelection = THREE;
                    shooter.threePointersAtt++;
                    this.threesAtt++;

                    off.seasonFieldGoalsAttempted++;
                    off.seasonThreesAttempted++;
                }
            }
        } else {
            //FREE THROW
            if ((Math.random() * 100) > 90) {
                //THREE 
                shooter.freeThrowsAttempted += 3;
                off.seasonFreeThrowsAttempted += 3;

                if (Math.random() * 100 < shooter.ft) {
                    if (off === home) { this.homescore++; } else { this.awayscore++ };
                    shooter.freeThrowsMade++;
                    shooter.points++;
                    off.seasonFreeThrowsMade++;
                    this.possResult.unshift({
                        shooter: shooter,
                        result: "Makes a free throw",
                        homeScore: this.homescore,
                        awayScore: this.awayscore
                    })
                } else {
                    this.possResult.unshift({
                        shooter: shooter,
                        result: "Misses a free throw",
                        homeScore: this.homescore,
                        awayScore: this.awayscore
                    })
                }
                if (Math.random() * 100 < shooter.ft) {
                    if (off === home) { this.homescore++; } else { this.awayscore++ };
                    shooter.freeThrowsMade++;
                    shooter.points++;
                    off.seasonFreeThrowsMade++;
                    this.possResult.unshift({
                        shooter: shooter,
                        result: "Makes a free throw",
                        homeScore: this.homescore,
                        awayScore: this.awayscore
                    })


                } else {
                    this.possResult.unshift({
                        shooter: shooter,
                        result: "Misses a free throw",
                        homeScore: this.homescore,
                        awayScore: this.awayscore
                    })
                }
                if (Math.random() * 100 < shooter.ft) {
                    if (off === home) { this.homescore++; } else { this.awayscore++ };
                    shooter.freeThrowsMade++;
                    shooter.points++;
                    off.seasonFreeThrowsMade++;
                    this.possResult.unshift({
                        shooter: shooter,
                        result: "Makes a free throw",
                        homeScore: this.homescore,
                        awayScore: this.awayscore
                    })


                } else {
                    this.possResult.unshift({
                        shooter: shooter,
                        result: "Misses a free throw",
                        homeScore: this.homescore,
                        awayScore: this.awayscore
                    })
                    offensiveRebound = this.rebound(off, def);
                }
            } else {
                //SHOOT TWO
                //THREE 
                shooter.freeThrowsAttempted += 2;
                off.seasonFreeThrowsAttempted += 2;

                if (Math.random() * 100 < shooter.ft) {
                    if (off === home) { this.homescore++; } else { this.awayscore++; }
                    this.possResult.unshift({
                        shooter: shooter,
                        result: "Makes a free throw",
                        homeScore: this.homescore,
                        awayScore: this.awayscore
                    })
                    shooter.freeThrowsMade++;
                    shooter.points++;
                    off.seasonFreeThrowsMade++;

                } else {
                    this.possResult.unshift({
                        shooter: shooter,
                        result: "Misses a free throw",
                        homeScore: this.homescore,
                        awayScore: this.awayscore
                    })
                }
                if (Math.random() * 100 < shooter.ft) {
                    if (off === home) { this.homescore++; } else { this.awayscore++; }
                    this.possResult.unshift({
                        shooter: shooter,
                        result: "Makes a free throw",
                        homeScore: this.homescore,
                        awayScore: this.awayscore
                    })
                    shooter.freeThrowsMade++;
                    shooter.points++;
                    off.seasonFreeThrowsMade++;

                } else {
                    this.possResult.unshift({
                        shooter: shooter,
                        result: "Misses a free throw",
                        homeScore: this.homescore,
                        awayScore: this.awayscore
                    })
                    offensiveRebound = this.rebound(off, def);
                }

            }
            secondsRemoved = secondsOffClock + Math.round((Math.random() * secondsOffClockRandomFactor) - secondsOffClockRandomFactor / 2);
            this.time -= secondsRemoved;
            // possesion = def;
            return;
        }
        //GET SHOT RATING
        if (shotSelection === THREE) {
            shotPercentage = scaleBetween(shooter.threePoint, threePointPercentageLow, threePointPercentageHigh, 40, 99);
        } else {
            shotPercentage = scaleBetween(shooter.off, twoPointPercentageLow, twoPointPercentageHigh, 40, 99);
        }

        //DEFENSE VS SHOOTER
        shotPercentage -= scaleBetween(defender.def, defenseLow, defenseHigh, 40, 99);

        //COACHING SCHEME
        shotPercentage += (off.offVsDefFocus + def.offVsDefFocus);

        //fast break
        if (Math.random() * 100 <= 20) {
            shotPercentage += ((off.freezeThePuckVsPlayThePuck * 2) - (def.freezeThePuckVsPlayThePuck * 2));
        }


        //DIFFICULTY SLIDER

        shotPercentage += difficultySliderInfluence;


        if (shotPercentage >= Math.random() * 100) {
            //MADE SHOT

            if (shotSelection === THREE) {
                if (off === home) { this.homescore += 3; }
                else { this.awayscore += 3; }
                shooter.points += 3;
                shooter.threePointersMade++;
                this.threesMade++;

                off.seasonFieldGoalsMade++;
                off.seasonThreesMade++;
                this.possResult.unshift({
                    shooter: shooter,
                    result: "Makes a three pointer",
                    homeScore: this.homescore,
                    awayScore: this.awayscore
                })

            } else {
                if (off === home) { this.homescore += 2; } else { this.awayscore += 2; }
                shooter.points += 2;
                shooter.twoPointersMade++;
                this.shotsMade++;

                off.seasonFieldGoalsMade++;
                this.possResult.unshift({
                    shooter: shooter,
                    result: "Makes a two pointer",
                    homeScore: this.homescore,
                    awayScore: this.awayscore
                })
            }
            // possesion = def;
        } else {
            //MISSED SHOT
            //PICK REBOUNDER
            this.possResult.unshift({
                shooter: shooter,
                result: "Misses a shot",
                homeScore: this.homescore,
                awayScore: this.awayscore
            })
            offensiveRebound = this.rebound(off, def);
            // possesion = def;
        }
        //COACHING forwardsVsDefensemen
        secondsRemoved = secondsOffClock + Math.round((Math.random() * secondsOffClockRandomFactor) - secondsOffClockRandomFactor / 2) - off.forwardsVsDefensemen;
        this.time -= secondsRemoved;
        //This Might Fix The Tie Bug
        if (this.time <= 0 && this.homescore === this.awayscore) {
            this.time = (5 * 60);
        }


        //update player minutes played
        for (let i = 0; i < off.lineup.length; i++) {
            off.lineup[i].minutesPlayedThisQuarter += (secondsRemoved / 60);
            off.lineup[i].minutesPlayed += (secondsRemoved / 60);
        }

        for (let i = 0; i < def.lineup.length; i++) {
            def.lineup[i].minutesPlayedThisQuarter += (secondsRemoved / 60);
            off.lineup[i].minutesPlayed += (secondsRemoved / 60);
        }

        if (this.endOfQuarter()) {
            for (let i = 0; i < off.roster.length; i++) {
                off.roster[i].minutesPlayedThisQuarter = 0;
            }

            for (let i = 0; i < def.roster.length; i++) {
                def.roster[i].minutesPlayedThisQuarter = 0;
            }
        }

        //offensive rebound
        if (offensiveRebound) {
            // console.log('offensive rebound');
            this.possesion(off);
        }

    }


    clearStats() {
        //clearStats
        //lineup bug fix
        // home.lineup=[];
        // home.lineup = home.lineup.concat(home.firstTeam);
        // away.lineup=[];
        // away.lineup = away.lineup.concat(away.firstTeam);
        // this.manageLineupUsage(home);
        // this.manageLineupUsage(away);


        for (let i = 0; i < home.roster.length; i++) {
            //clear in game stats
            home.roster[i].goals = 0;
            home.roster[i].shots = 0;
            home.roster[i].assists = 0;
            home.roster[i].goalsAllowed = 0;
            home.roster[i].saves = 0;

        }

        for (let i = 0; i < away.roster.length; i++) {
            //clear in game stats
            away.roster[i].goals = 0;
            away.roster[i].shots = 0;
            away.roster[i].assists = 0;
            away.roster[i].goalsAllowed = 0;
            away.roster[i].saves = 0;

        }

    }

    jumpBall() {
        if (Math.floor(Math.random() * 2) > 0) {
            return true;
        } else {
            return false;
        }
    }


    playGame() {

        this.clearStats();


        //jumpball
        if (this.jumpBall()) {
            while (this.time > 0) {
                this.hockeyPossesion(home, away);
                this.hockeyPossesion(away, home);
                if (this.time <= 0) {
                    if (this.homescore === this.awayscore) {
                        this.overtime = true;
                        this.time = (5 * 60);

                    }
                }
            }
        } else {
            while (this.time > 0) {
                this.hockeyPossesion(away, home);
                this.hockeyPossesion(home, away);
                if (this.time <= 0) {
                    if (this.homescore === this.awayscore) {
                        this.overtime = true;
                        this.time = (5 * 60);

                    }
                }
            }
        }

        this.saveStats();

        //FIX annoying ass gltich
        home.bench = [...home.constantBench];
        away.bench = [...away.constantBench];






        // this.homescore = homescore;
        // this.awayscore = awayscore;
        // console.log(this.shotsAtt);
        // console.log('made:' + this.shotsMade);
        // console.log(this.threesAtt);
        // console.log(this.threesMade);



    }

    saveStats() {
        //LOOP TO SET STATS IN HISTORY
        home.seasonPoints += this.homescore;
        home.seasonPointsAllowed += this.awayscore;

        //reset starters
        home.onIce = home.offLine1.concat(home.defLine1);
        away.onIce = away.offLine1.concat(away.defLine1);


        away.seasonPoints += this.awayscore;
        away.seasonPointsAllowed += this.homescore;


        for (let i = 0; i < home.roster.length; i++) {
            home.roster[i].statsHistory.push({
                goals: home.roster[i].goals,
                saves: home.roster[i].saves,
                goalsAllowed: home.roster[i].goalsAllowed,
                shots: home.roster[i].shots,
                assists: home.roster[i].assists
            });
            home.roster[i].seasonGoals += home.roster[i].goals;
            home.roster[i].seasonAssists += home.roster[i].assists;
            home.roster[i].seasonSaves += home.roster[i].saves;
            home.roster[i].seasonShots += home.roster[i].shots;
            home.roster[i].seasonGoalsAllowed += home.roster[i].goalsAllowed;
        }
        for (let i = 0; i < away.roster.length; i++) {
            away.roster[i].statsHistory.push({
                goals: away.roster[i].goals,
                saves: away.roster[i].saves,
                goalsAllowed: away.roster[i].goalsAllowed,
                shots: away.roster[i].shots,
                assists: away.roster[i].assists
            });
            away.roster[i].seasonGoals += away.roster[i].goals;
            away.roster[i].seasonAssists += away.roster[i].assists;
            away.roster[i].seasonSaves += away.roster[i].saves;
            away.roster[i].seasonShots += away.roster[i].shots;
            away.roster[i].seasonGoalsAllowed += away.roster[i].goalsAllowed;
        }
    }



}

class Season {
    constructor() {
        this.games = gamesPerSeason;
        this.day = 0;
        this.endOfSeason = false;

        //clear stats
        for (let i = 0; i < teams.length; i++) {
            teams[i].wins = 0;
            teams[i].losses = 0;
            teams[i].otLosses = 0;
            teams[i].schedule = [];
            teams[i].played = [];
            teams[i].seasonPoints = 0;
            teams[i].seasonPointsAllowed = 0;
            teams[i].seasonSaves = 0;
            teams[i].seasonGoalsAllowed = 0;
            teams[i].seasonShots = 0;
            teams[i].seasonAssists = 0;

            for (let j = 0; j < teams[i].roster.length; j++) {

                teams[i].roster[j].statsHistory = [];
                teams[i].roster[j].goals = 0;
                teams[i].roster[j].goalsAllowed = 0;
                teams[i].roster[j].shots = 0;
                teams[i].roster[j].assists = 0;
                teams[i].roster[j].saves = 0;

                teams[i].roster[j].seasonGoals = 0;
                teams[i].roster[j].seasonSaves = 0;
                teams[i].roster[j].seasonGoalsAllowed = 0;
                teams[i].roster[j].seasonShots = 0;
                teams[i].roster[j].seasonAssists = 0;

            }
        }
        //for free agents

        for (let i = 0; i < availableFreeAgents.roster.length; i++) {
            availableFreeAgents.roster[i].statsHistory = [];
            availableFreeAgents.roster[i].goals = 0;
            availableFreeAgents.roster[i].goalsAllowed = 0;
            availableFreeAgents.roster[i].shots = 0;
            availableFreeAgents.roster[i].assists = 0;
            availableFreeAgents.roster[i].saves = 0;

            availableFreeAgents.roster[i].seasonGoals = 0;
            availableFreeAgents.roster[i].seasonSaves = 0;
            availableFreeAgents.roster[i].seasonGoalsAllowed = 0;
            availableFreeAgents.roster[i].seasonShots = 0;
            availableFreeAgents.roster[i].seasonAssists = 0;

        }



        for (let i = 0; i < this.games; i++) {
            shuffle(teams);
            for (let j = 0; j < teams.length; j++) {
                if (teams[j].schedule[i] == null) {
                    try {
                        teams[j].schedule[i] = teams[(j + 1)]
                        teams[(j + 1)].schedule[i] = teams[(j)];
                    } catch{
                        teams[j].schedule[i] = teams[j];
                    }

                }
            }


        }

    }

    manualDay() {
        if (this.games <= this.day) {
            this.endOfSeason = true;
            return;
        }
        home = selectedTeam;
        away = home.schedule[this.day];
        if (home.played[this.day] == null) {
            let game = new Game();
            return game;
        }

    }

    simDay() {
        if (this.games <= this.day) {
            this.endOfSeason = true;
            return;
        }

        for (let i = 0; i < teams.length; i++) {
            home = teams[i];
            away = home.schedule[this.day];
            if (home === away) {
                //bye week
                home.played[this.day] = new Results(1, 0);
                home.wins++;
                for (let i = 0; i < home.roster.length; i++) {
                    home.roster[i].statsHistory.push({
                        goals: 0,
                        saves: 0,
                        goalsAllowed: 0,
                        shots: 0,
                        assists: 0
                    });
                }

            } else {

                if (home.played[this.day] == null) {
                    let game = new Game();
                    game.playGame();
                    home.played[this.day] = new Results(game.homescore, game.awayscore);
                    away.played[this.day] = new Results(game.awayscore, game.homescore);


                    if (game.homescore > game.awayscore) {
                        home.wins++;
                        if (game.overtime) {
                            away.otLosses++;
                        }
                        away.losses++;
                    } else {
                        if (game.overtime) {
                            home.otLosses++;
                        }
                        home.losses++;
                        away.wins++;
                    }


                    //WHY WAS THIS IN HERE????? UHH WHAT

                    // availableFreeAgents.roster[i].statsHistory.push({
                    //     points: 0,
                    //     twoPointersAtt: 0,
                    //     twoPointersMade: 0,
                    //     rebounds: 0,
                    //     threePointersAtt: 0,
                    //     threePointersMade: 0
                    // });



                }
            }
        }

        for (let i = 0; i < availableFreeAgents.roster.length; i++) {
            availableFreeAgents.roster[i].statsHistory.push({
                points: 0,
                twoPointersAtt: 0,
                twoPointersMade: 0,
                rebounds: 0,
                threePointersAtt: 0,
                threePointersMade: 0
            });
        }
        this.day++;

    }
    simToEnd() {
        while (this.day < this.games) {

            if (this.games <= this.day) {
                this.endOfSeason = true;
                return;
            }

            for (let i = 0; i < teams.length; i++) {
                home = teams[i];
                away = home.schedule[this.day];
                if (home === away) {
                    //bye week
                    home.played[this.day] = new Results(1, 0);
                    home.wins++;
                    for (let i = 0; i < home.roster.length; i++) {
                        home.roster[i].statsHistory.push({
                            goals: 0,
                            saves: 0,
                            goalsAllowed: 0,
                            shots: 0,
                            assists: 0
                        });
                    }

                } else {

                    if (home.played[this.day] == null) {
                        let game = new Game();
                        game.playGame();
                        home.played[this.day] = new Results(game.homescore, game.awayscore);
                        away.played[this.day] = new Results(game.awayscore, game.homescore);
                        if (game.homescore > game.awayscore) {
                            home.wins++;
                            if (game.overtime) {
                                away.otLosses++;
                            }
                            away.losses++;
                        } else {
                            if (game.overtime) {
                                home.otLosses++;
                            }
                            home.losses++;
                            away.wins++;
                        }



                    }
                }
            }
            this.day++;

        }
        this.endOfSeason = true;

    }


}


class Franchise {
    constructor() {
        this.season = new Season();
        this.offSeason = false;
        this.advance = false;
        this.stage;
        this.currentDraft;
        this.playoffs;
        this.pastChampions = [];
        this.classLength = 0;

        this.retirements = {
            name: 'Retirements',
            roster: [],
            logoSrc: 'https://i.ibb.co/51fFLv2/GENERIC.png',
            reorderLineup: function () {
                draftClass.roster.sort(function (a, b) {
                    if (a.rating > b.rating)
                        return -1;
                    if (a.rating < b.rating)
                        return 1;
                    return 0;
                })
            }
        };
    }

    startPlayoffs() {
        for (let i = 0; i < conferences.length; i++) {
            conferences[i].teams.sort(function (a, b) {
                if (a.wins > b.wins)
                    return -1;
                if (a.wins < b.wins)
                    return 1;
                return 0;
            })
        }

        //JUST IN CASE OF PLAYOFF SEED NUMBER BEING BIGGER THAN CONF TEAMS
        this.playoffs = new Playoffs();
        if (conferencesOn) {
            if (conferences[0].teams.length < playoffSeeds) {
                playoffSeeds = setCustomPlayoffSeeds();
            }
            if (conferences[1].teams.length < playoffSeeds) {
                playoffSeeds = setCustomPlayoffSeeds();
            }


            for (let i = 0; i < playoffSeeds; i++) {
                this.playoffs.eastTeams.push(easternConference.teams[i]);
                this.playoffs.westTeams.push(westernConference.teams[i]);
            }
        } else {
            if (teams.length < playoffSeeds) {
                playoffSeeds = setCustomPlayoffSeeds();
            }

            for (let i = 0; i < playoffSeeds; i++) {
                if (i % 2 == 0) {
                    teams[i].conferenceId = 0;
                    this.playoffs.eastTeams.push(teams[i]);
                } else {
                    teams[i].conferenceId = 1;
                    this.playoffs.westTeams.push(teams[i]);
                }
            }
        }


        this.playoffs.playoffMatchupGen();

    }

    sim20() {
        for (let i = 0; i <= 20; i++) {
            this.season.simToEnd();
            sortStandings();
            this.offSeason = true;
            this.advance = true;
            this.startPlayoffs();
            this.playoffs.simPlayoffs();
            this.training();

            //retirments
            this.retirementStage();

            if (!collegeMode) {
                this.currentDraft = this.manualDraft();
                this.currentDraft.simDraft();
                this.checkForBustOrStar();
            }

            this.freeAgencySetup();
            this.freeAgency();
            setSalaryExpectations(availableFreeAgents);
            this.signing();
            //roster size limit
            this.releasePlayers();

            //new season
            this.advanceToNextYear();
        }
    }

    simDay() {
        this.season.simDay();
        sortStandings();
        this.checkForOffseason();
    }
    simToEnd() {
        this.season.simToEnd();
        sortStandings();
        if (this.offSeason === true) {
            this.advance = true;
        }
        this.checkForOffseason();

    }

    checkForOffseason() {
        if (this.season.endOfSeason === true) {
            this.stage = 'playoffs';
            this.simStage();

        }
    }

    simStage() {


        //playoffs

        if (this.stage === 'playoffs') {
            this.startPlayoffs();
            this.offSeason = true;


        }





        //training and age ++
        if (this.stage === 'retirements') {

            this.training();

            //retirments
            this.retirementStage();
        }
        if (this.stage === 'draft') {

            //draft
            this.currentDraft = this.manualDraft();

        }
        if (this.stage === 'resigning') {
            //bust or star for drafted
            if (!collegeMode) {
                this.checkForBustOrStar();
            }

            //free agency
            this.freeAgencySetup();


        }

        if (this.stage === 'freeagency') {
            if (collegeMode) {
                this.freeAgencySetup();
            } else {
                this.freeAgency();
            }


            setSalaryExpectations(availableFreeAgents);
        }

        if (this.stage === 'freeagencyend') {
            this.signing();
            //roster size limit
            this.releasePlayers();

            this.trainingPoints();

        }

        if (this.stage === 'advance') {

            //new season
            this.advanceToNextYear();
        }






    }

    trainingPoints() {
        for (let i = 0; i < teams.length; i++) {
            teams[i].trainingPoints = trainingPointsAvailable;
            for (let j = 0; j < teams[i].roster.length; j++) {
                teams[i].roster[j].trained = false;
            }
        }
    }


    training() {
        for (let i = 0; i < teams.length; i++) {
            for (let j = 0; j < teams[i].roster.length; j++) {
                let ply = teams[i].roster[j];
                ply.age++;

                let history = "";
                //SAVE PREVIOUS SEASONS STATS
                history = "GOALS: " + ply.seasonGoals + " SHOTS: " + ply.seasonShots + " ASSISTS: " + ply.seasonAssists + " SAVE%: " + Math.round((ply.seasonSaves / (ply.seasonSaves + ply.seasonGoalsAllowed)) * 1000) / 10;

                ply.previousSeasonsStats.push({
                    team: teams[i].logoSrc,
                    data: history
                })

                //to show growth
                ply.offOld = ply.off;
                ply.defOld = ply.def;
                ply.passOld = ply.pass;
                ply.faceOffOld = ply.faceOff;
                ply.saveOld = ply.save;


                if (ply.position != 4) {
                    //slight boost for really young players
                    if (ply.age <= 23) {
                        ply.off += Math.round(Math.random() * 1);
                        ply.def += Math.round(Math.random() * 1);
                        ply.pass += Math.round(Math.random() * 1);
                        ply.faceOff += Math.round(Math.random() * 1);
                    }

                    if (ply.age <= 26) {
                        ply.off += Math.round(Math.random() * 4) - 1;
                        ply.def += Math.round(Math.random() * 4) - 1;
                        ply.pass += Math.round(Math.random() * 3) - 1;
                        ply.faceOff += Math.round(Math.random() * 3) - 1;
                    }
                    else if (ply.age < 30) {
                        ply.off += Math.floor(Math.random() * 2);
                        ply.def += Math.floor(Math.random() * 2);
                        ply.pass += Math.floor(Math.random() * 2);
                        ply.faceOff += Math.floor(Math.random() * 2);
                    } else if (ply.age < 35) {
                        ply.off += Math.round(Math.random() * 3) - 3;
                        ply.def += Math.round(Math.random() * 3) - 3;
                        ply.pass += Math.round(Math.random() * 1);
                        ply.faceOff += Math.round(Math.random() * 3) - 3;
                    } else {
                        ply.off -= Math.round(Math.random() * 5)
                        ply.def -= Math.round(Math.random() * 5)
                        ply.pass += Math.round(Math.random() * 1);
                        ply.faceOff -= Math.round(Math.random() * 5)
                    }

                    if (Math.random() * 500 >= 499) {
                        //BREAKOUT PLYER
                        // console.log(ply.name);
                        // console.log(ply.rating);
                        // console.log(ply.teamName);
                        ply.off += Math.round(Math.random() * 10)
                        ply.def += Math.round(Math.random() * 10)
                        ply.pass += Math.round(Math.random() * 10);
                        ply.faceOff += Math.round(Math.random() * 10);
                    }

                } else {
                    if (ply.age <= 23) {
                        ply.save += Math.round(Math.random() * 1);
                    }

                    if (ply.age <= 26) {
                        ply.save += Math.round(Math.random() * 4) - 1;

                    }
                    else if (ply.age < 30) {
                        ply.save += Math.floor(Math.random() * 2);

                    } else if (ply.age < 35) {
                        ply.save += Math.round(Math.random() * 3) - 3;

                    } else {
                        ply.save -= Math.round(Math.random() * 5)
                    }

                    if (Math.random() * 500 >= 499) {
                        //BREAKOUT PLYER
                        // console.log(ply.name);
                        // console.log(ply.rating);
                        // console.log(ply.teamName);
                        ply.save += Math.round(Math.random() * 10)
                    }
                }


                ply.calculateRating();


            }
        }

        for (let i = 0; i < availableFreeAgents.roster.length; i++) {
            let ply = availableFreeAgents.roster[i];

            //need to double check free agents never aged?
            ply.age++;

            //fix for free agents having no history
            let history = "";
            //SAVE PREVIOUS SEASONS STATS
            history = "GOALS: " + ply.seasonGoals + " SHOTS: " + ply.seasonShots + " ASSISTS: " + ply.seasonAssists + " SAVE%: " + Math.round((ply.seasonSaves / (ply.seasonSaves + ply.seasonGoalsAllowed)) * 1000) / 10;

            ply.previousSeasonsStats.push({
                team: availableFreeAgents.logoSrc,
                data: history
            })

            ply.off += Math.floor(Math.random() * 6) - 6;
            ply.def += Math.floor(Math.random() * 6) - 6;
            ply.pass += Math.floor(Math.random() * 6) - 6;
            ply.save += Math.floor(Math.random() * 6) - 6;
            ply.faceOff += Math.floor(Math.random() * 6) - 6;


            ply.calculateRating();


        }
    }

    checkForBustOrStar() {
        for (let i = 0; i < this.currentDraft.drafted.roster.length; i++) {
            let rand = Math.floor(Math.random() * 60);
            let ply = this.currentDraft.drafted.roster[i];
            if (rand === 1) {
                //bust
                let diff = Math.round(scaleBetween(ply.rating, 0, 15, 60, 90));
                if (ply.position === 4) {
                    ply.save -= diff;
                } else {
                    ply.off -= diff;
                    ply.def -= diff;
                }
                // console.log(ply.name + ' ' + ply.rating + ' ' + diff + ply.teamName + ' bust');
            }
            if (rand === 2) {
                //breakout star
                let diff = Math.round(scaleBetween(ply.rating, 15, 0, 60, 90));
                if (ply.position === 4) {
                    ply.save += diff;
                } else {
                    ply.off += diff;
                    ply.def += diff;
                }
                // console.log(ply.name + ' ' + ply.rating + ' ' + diff + ply.teamName + ' star');

            }

            //randomize player ratings a little bit
            let randomFactor = Math.floor(Math.random() * 7) - 3;


            if (ply.position === 4) {
                ply.save += randomFactor;
            } else {
                ply.off += randomFactor
                //nba bug found
                ply.def += randomFactor
                ply.faceOff += randomFactor
                ply.pass += randomFactor
            }

            ply.calculateRating();

        }
    }


    signing() {
        for (let i = 0; i < teams.length; i++) {

            teams[i].c = 0;
            teams[i].lw = 0;
            teams[i].rw = 0;
            teams[i].d = 0;
            teams[i].g = 0;

            teams[i].salary = 0;

            for (let j = 0; j < teams[i].roster.length; j++) {
                let player = teams[i].roster[j];
                teams[i].salary += player.salary;

                if (teams[i].roster[j].position === POS_C) {
                    teams[i].c++;
                }
                if (teams[i].roster[j].position === POS_LW) {
                    teams[i].lw++;
                }
                if (teams[i].roster[j].position === POS_RW) {
                    teams[i].rw++;
                }
                if (teams[i].roster[j].position === POS_D) {
                    teams[i].d++;
                }
                if (teams[i].roster[j].position === POS_G) {
                    teams[i].g++;
                }
            }
        }


        teams.sort(function (a, b) {
            if (a.wins < b.wins) {
                return 1;
            }
            if (a.wins > b.wins) {
                return -1;
            }
            return 0;
        })

        availableFreeAgents.roster.sort(function (a, b) {
            if (a.rating < b.rating) {
                return 1;
            }
            if (a.rating > b.rating) {
                return -1
            }
            return 0;
        })

        for (let i = 0; i < teams.length; i++) {
            if (teams[i] === selectedTeam && !autoSign) {
                console.log('autosign off')
            } else {



                for (let j = 0; j < availableFreeAgents.roster.length; j++) {

                    if (teams[i].c < POS_C_REQUIREMENTS && availableFreeAgents.roster[j].position === POS_C) {

                        if (canSign(teams[i], availableFreeAgents.roster[j].salary)) {

                            availableFreeAgents.roster[j].teamName = teams[i].name;
                            availableFreeAgents.roster[j].teamLogoSrc = teams[i].logoSrc;
                            availableFreeAgents.roster[j].years = Math.floor(Math.random() * 4) + 1;

                            teams[i].roster.push(availableFreeAgents.roster[j]);
                            teams[i].salary += availableFreeAgents.roster[j].salary;
                            teams[i].C++;
                            availableFreeAgents.roster.splice(j, 1);
                        }
                    }

                    if (teams[i].lw < POS_LW_REQUIREMENTS && availableFreeAgents.roster[j].position === POS_LW) {

                        if (canSign(teams[i], availableFreeAgents.roster[j].salary)) {

                            availableFreeAgents.roster[j].teamName = teams[i].name;
                            availableFreeAgents.roster[j].teamLogoSrc = teams[i].logoSrc;
                            availableFreeAgents.roster[j].years = Math.floor(Math.random() * 4) + 1;

                            teams[i].roster.push(availableFreeAgents.roster[j]);
                            teams[i].salary += availableFreeAgents.roster[j].salary;
                            teams[i].lw++;
                            availableFreeAgents.roster.splice(j, 1);
                        }
                    }

                    if (teams[i].rw < POS_RW_REQUIREMENTS && availableFreeAgents.roster[j].position === POS_RW) {

                        if (canSign(teams[i], availableFreeAgents.roster[j].salary)) {

                            availableFreeAgents.roster[j].teamName = teams[i].name;
                            availableFreeAgents.roster[j].teamLogoSrc = teams[i].logoSrc;
                            availableFreeAgents.roster[j].years = Math.floor(Math.random() * 4) + 1;

                            teams[i].roster.push(availableFreeAgents.roster[j]);
                            teams[i].salary += availableFreeAgents.roster[j].salary;
                            teams[i].rw++;
                            availableFreeAgents.roster.splice(j, 1);
                        }
                    }

                    if (teams[i].d < POS_D_REQUIREMENTS && availableFreeAgents.roster[j].position === POS_D) {


                        if (canSign(teams[i], availableFreeAgents.roster[j].salary)) {

                            availableFreeAgents.roster[j].teamName = teams[i].name;
                            availableFreeAgents.roster[j].teamLogoSrc = teams[i].logoSrc;
                            availableFreeAgents.roster[j].years = Math.floor(Math.random() * 4) + 1;

                            teams[i].roster.push(availableFreeAgents.roster[j]);
                            teams[i].salary += availableFreeAgents.roster[j].salary;
                            teams[i].d++;
                            availableFreeAgents.roster.splice(j, 1);
                        }
                    }

                    if (teams[i].g < POS_G_REQUIREMENTS && availableFreeAgents.roster[j].position === POS_G) {

                        if (canSign(teams[i], availableFreeAgents.roster[j].salary)) {

                            availableFreeAgents.roster[j].teamName = teams[i].name;
                            availableFreeAgents.roster[j].teamLogoSrc = teams[i].logoSrc;
                            availableFreeAgents.roster[j].years = Math.floor(Math.random() * 4) + 1;
                            teams[i].roster.push(availableFreeAgents.roster[j]);
                            teams[i].salary += availableFreeAgents.roster[j].salary;

                            teams[i].g++;
                            availableFreeAgents.roster.splice(j, 1);
                        }
                    }


                }

                while (teams[i].roster.length < 24) {
                    if (teams[i] != selectedTeam) {
                        let index = Math.floor(Math.random() * 20);
                        if (index >= availableFreeAgents.roster.length) {
                            index = 0;
                        }
                        let signing = availableFreeAgents.roster[index];
                        signing.salary = VETERANSMINIMUM;
                        if (canSign(teams[i], signing.salary)) {
                            signing.teamName = teams[i].name;
                            signing.teamLogoSrc = teams[i].logoSrc;
                            signing.years = 1
                            teams[i].roster.push(signing);
                            teams[i].salary += signing.salary;
                            availableFreeAgents.roster.splice(index, 1);
                        }
                    } else {
                        let index = Math.floor(Math.random() * availableFreeAgents.roster.length);
                        let signing = availableFreeAgents.roster[index];
                        if (canSign(teams[i], signing.salary)) {
                            signing.teamName = teams[i].name;
                            signing.teamLogoSrc = teams[i].logoSrc;
                            signing.years = 1
                            teams[i].roster.push(signing);
                            teams[i].salary += signing.salary;
                            availableFreeAgents.roster.splice(index, 1);
                        }
                    }
                }
            }
        }

    }


    freeAgencySetup() {
        if (collegeMode) {

            generateFreeAgents((this.classLength * 3), 12);

            for (let i = 0; i < teams.length; i++) {
                teams[i].salary = Math.round(scaleBetween((teams[i].seed), 75000000, 105000000, 0, teams.length));
                if (teams[i] === this.playoffs.champs) {
                    teams[i].salary -= 10000000;
                }
            }
        } else {

            for (let i = 0; i < teams.length; i++) {
                teams[i].expiring.roster = [];
                let underContract = [];
                for (let j = 0; j < teams[i].roster.length; j++) {
                    teams[i].roster[j].years -= 1;

                    if (teams[i].roster[j].years <= 0) {
                        teams[i].expiring.roster.push(teams[i].roster[j]);
                    } else {
                        underContract.push(teams[i].roster[j]);
                    }

                }
                teams[i].roster = underContract;
                setSalaryExpectations(teams[i].expiring);
            }
            setTeamSalaries();
        }
    }



    freeAgency() {

        let released = [];
        for (let i = 0; i < teams.length; i++) {

            for (let j = 0; j < teams[i].expiring.roster.length; j++) {

                //CPU RESIGN LOGIC
                if (teams[i].expiring.roster[j].rating > 84) {
                    if ((Math.random() * 10) < 8) {
                        teams[i].expiring.roster[j].years = Math.floor(Math.random() * 4) + 1;
                        teams[i].roster.push(teams[i].expiring.roster[j]);

                    } else {
                        released.push(teams[i].expiring.roster[j]);
                    }
                }
                else if (teams[i].expiring.roster[j].rating > 76) {
                    if ((Math.random() * 10) < 6) {
                        teams[i].expiring.roster[j].years = Math.floor(Math.random() * 4) + 1;
                        teams[i].roster.push(teams[i].expiring.roster[j]);
                    } else {
                        released.push(teams[i].expiring.roster[j]);
                    }
                }
                else if (teams[i].expiring.roster[j].rating > 69) {
                    if ((Math.random() * 10) < 4) {
                        teams[i].expiring.roster[j].years = Math.floor(Math.random() * 4) + 1;
                        teams[i].roster.push(teams[i].expiring.roster[j]);
                    } else {
                        released.push(teams[i].expiring.roster[j]);
                    }
                } else {
                    released.push(teams[i].expiring.roster[j]);
                }

            }

        }
        for (let r = 0; r < released.length; r++) {
            availableFreeAgents.roster.push(released[r]);
        }

        for (let i = 0; i < teams.length; i++) {
            teams[i].expiring.roster = [];
        }

        setTeamSalaries();

    }




    releasePlayers() {
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].roster.length > rosterSize) {
                teams[i].roster.sort(function (a, b) {
                    if (a.rating > b.rating) {
                        return 1;
                    }
                    if (a.rating < b.rating) {
                        return -1;
                    }
                    return 0;
                });
                while (teams[i].roster.length > rosterSize) {
                    

                    availableFreeAgents.roster.push(teams[i].roster[0]);
                    teams[i].roster.splice(0, 1);
                }

            }
        }

        setTeamSalaries();
    }

    advanceToNextYear() {


        for (let i = 0; i < teams.length; i++) {
            teams[i].history.push({
                wins: teams[i].wins,
                losses: teams[i].losses,
                champions: false
            })
            if (teams[i] === this.playoffs.champs) {
                teams[i].history[teams[i].history.length - 1].champions = true;
                this.pastChampions.push({
                    history: teams[i].history[teams[i].history.length - 1],
                    logoSrc: teams[i].logoSrc,
                    name: teams[i].name
                });
            }
            teams[i].reorderLineup();

            teams[i].draftPicks = [{
                round: 1,
                originalTeam: teams[i].name,
                value: null,
                salary: 0,
                isPick: true,
                projectedPick: null,
                currentTeam: null
            },
            {
                round: 2,
                originalTeam: teams[i].name,
                value: null,
                salary: 0,
                isPick: true,
                projectedPick: null,
                currentTeam: null
            },
            {
                round: 3,
                originalTeam: teams[i].name,
                value: null,
                salary: 0,
                isPick: true,
                projectedPick: null,
                currentTeam: null
            },
            {
                round: 4,
                originalTeam: teams[i].name,
                value: null,
                salary: 0,
                isPick: true,
                projectedPick: null,
                currentTeam: null
            },
            {
                round: 5,
                originalTeam: teams[i].name,
                value: null,
                salary: 0,
                isPick: true,
                projectedPick: null,
                currentTeam: null
            },
            {
                round: 6,
                originalTeam: teams[i].name,
                value: null,
                salary: 0,
                isPick: true,
                projectedPick: null,
                currentTeam: null
            },
            {
                round: 7,
                originalTeam: teams[i].name,
                value: null,
                salary: 0,
                isPick: true,
                projectedPick: null,
                currentTeam: null
            }
            ]



        }

        //fix for free agents having old team logos
        for (let i = 0; i < availableFreeAgents.roster.length; i++) {
            availableFreeAgents.roster[i].teamLogoSrc = availableFreeAgents.logoSrc;
            availableFreeAgents.roster[i].teamName = availableFreeAgents.name;
        }

        generateDraftClass();

        while (availableFreeAgents.roster.length > 500) {
            availableFreeAgents.roster.pop();
        }


        //randomize rotation size for teams
        for (let i = 0; i < teams.length; i++) {
            teams[i].rotationSize = Math.round(Math.random() * 2) + 9;
            teams[i].reorderLineup();
        }


        this.offSeason = false;
        this.advance = false;
        this.stage = '';
        this.season = new Season();

        //AUTOSAVE THE FRANCHISE ROSTER

        saveFranchise('Franchise_Autosave');


    }

    retirementStage() {

        this.retirements.roster = [];


        if (collegeMode) {

            for (let i = 0; i < teams.length; i++) {
                for (let j = 0; j < teams[i].roster.length; j++) {
                    let player = teams[i].roster[j];
                    let rand = Math.random() * 100;
                    if ((player.rating >= 88 && (rand > 35)) || player.age >= 22) {
                        this.retirements.roster.push(player);
                        let index = teams[i].roster.indexOf(player);
                        teams[i].roster.splice(index, 1);
                    }

                    //check for leave for draft early
                }
            }

            this.classLength = this.retirements.roster.length;

        } else {

            for (let i = 0; i < teams.length; i++) {
                for (let j = 0; j < teams[i].roster.length; j++) {
                    let player = teams[i].roster[j];
                    if (player.age >= 37 && player.rating < 83) {
                        let rand = Math.random() * 2;
                        if (rand <= 1) {
                            this.retirements.roster.push(player);
                            let index = teams[i].roster.indexOf(player);
                            teams[i].roster.splice(index, 1);
                        }
                    }
                }
            }
        }

        availableFreeAgents.roster.sort(function (a, b) {
            if (a.rating > b.rating) {
                return -1;
            }

            if (a.rating < b.rating) {
                return 1;
            }
            return 0;
        })


        setTeamSalaries();



    }

    manualDraft() {

        setPowerRankings();
        let draftOrder = [];

        for (let i = 0; i < teams.length; i++) {
            for (let j = 0; j < teams[i].draftPicks.length; j++) {
                let pick = teams[i].draftPicks[j];
                pick.currentTeam = teams[i];
                if (teams[i].name === pick.originalTeam) {
                    let pickNum = (teams[i].powerRanking - (teams.length + 1)) * -1;
                    pick.projectedPick = pickNum;
                } else {
                    //  console.log('traded draft pick detected');
                    for (let k = 0; k < teams.length; k++) {
                        if (teams[k].name === pick.originalTeam) {
                            let pickNum = (teams[k].powerRanking - (teams.length + 1)) * -1;
                            pick.projectedPick = pickNum;
                        }
                    }
                }
                //might break
                draftOrder.push(teams[i].draftPicks[j]);
            }
        }
        draftOrder.sort(function (a, b) {
            if (a.projectedPick > b.projectedPick) {
                return 1;
            }
            if (a.projectedPick < b.projectedPick) {
                return -1;
            } else { return 0; }
        });

        draftOrder.sort(function (a, b) {
            if (a.round > b.round) {
                return 1;
            }
            if (a.round < b.round) {
                return -1;
            } else { return 0; }
        });

        draftClass.roster.sort(function (a, b) {
            if (a.rating < b.rating) {
                return 1;
            }
            if (a.rating > b.rating) {
                return -1;
            }
            return 0;
        })

        return draft = {
            drafted: {
                name: 'Drafted',
                roster: [],
                logoSrc: 'https://i.ibb.co/51fFLv2/GENERIC.png',
                reorderLineup: function () {
                    availableFreeAgents.roster.sort(function (a, b) {
                        if (a.rating > b.rating)
                            return -1;
                        if (a.rating < b.rating)
                            return 1;
                        return 0;
                    })
                }
            },
            round: 0,
            pick: 0,
            picks: 0,
            draftOrder: draftOrder,
            completed: false,
            simPick: function () {
                if (this.completed) {
                    return;
                }

                this.pick++;
                this.drafted.roster.unshift(draftClass.roster[0]);
                signPlayer(draftOrder[this.pick - 1].currentTeam, draftClass.roster[0], draftClass.roster[0].years, draftClass.roster[0].salary, draftClass);
                draftOrder[this.pick - 1].currentTeam.draftPicks.shift();
                if (this.pick >= draftOrder.length) {
                    this.completed = true;
                    inDraft = false;
                    return;
                }


            },
            simDraft: function () {
                if (this.completed) {
                    return;
                }
                for (let i = this.pick; i < (draftOrder.length); i++) {
                    this.drafted.roster.unshift(draftClass.roster[0]);
                    signPlayer(draftOrder[i].currentTeam, draftClass.roster[0], draftClass.roster[0].years, draftClass.roster[0].salary, draftClass);
                    draftOrder[i].currentTeam.draftPicks.shift();

                }
                this.completed = true;
                inDraft = false;

            },
            newDraft: function () {
                this.round = 0;
                this.pick = 0;
                this.completed = false;
            },
            userPick: function (player) {
                if (this.completed) {
                    return;
                }
                let index = draftClass.roster.indexOf(player);
                this.pick++;


                this.drafted.roster.unshift(draftClass.roster[index]);
                signPlayer(draftOrder[this.pick - 1].currentTeam, draftClass.roster[index], draftClass.roster[index].years, draftClass.roster[index].salary, draftClass);
                draftOrder[this.pick - 1].currentTeam.draftPicks.shift();
                if (this.pick >= draftOrder.length) {
                    this.completed = true;
                    inDraft = false;
                    return;
                }

            },
            simToNextUserPick: function () {
                try {
                    while (draftOrder[this.pick].currentTeam != selectedTeam) {
                        if (this.completed) {
                            return;
                        }
                        this.simPick();

                    }
                } catch (err) {
                    this.completed = true;
                    this.pick--;
                    //BEING LAZY BUT IT FIXES THE GLITCH WHERE the draft crashes if u dont have another user pick
                    return;
                }
            }
        }

    }

    draft() {
        teams.sort(function (a, b) {
            if (a.wins > b.wins) {
                return 1;
            }
            if (a.wins < b.wins) {
                return -1;
            }
            return 0;
        })

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < (teams.length); i++) {
                signPlayer(teams[i], draftClass.roster[i], draftClass.roster[i].years, draftClass.roster[i].salary, draftClass);
            }
        }

        generateDraftClass();
    }


}





var shuffle = function (array) {

    var currentIndex = array.length;
    var forwardsVsDefensemenraryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        forwardsVsDefensemenraryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = forwardsVsDefensemenraryValue;
    }

    return array;

};

function sortStandings() {
    if (conferencesOn) {
        for (let i = 0; i < conferences.length; i++) {
            conferences[i].teams.sort(function (a, b) {
                if (a.wins > b.wins)
                    return -1;
                if (a.wins < b.wins)
                    return 1;
                return 0;
            })
            for (let j = 0; j < conferences[i].teams.length; j++) {
                conferences[i].teams[j].seed = j + 1;
            }
        }
    }
    else {
        teams.sort(function (a, b) {
            if (a.wins > b.wins)
                return -1;
            if (a.wins < b.wins)
                return 1;
            return 0;
        })

        for (let i = 0; i < teams.length; i++) {
            teams[i].seed = i + 1;
        }
    }

}





function standings(conferenceId) {
    let sorted = [];
    sorted = teams;

    if (conferenceId != 3) {
        for (let i = 0; i < conferences.length; i++) {
            if (conferenceId === conferences[i].id) {
                sorted = conferences[i].teams;
            }
        }

    }

    sorted.sort(function (a, b) {
        if (a.wins > b.wins)
            return -1;
        if (a.wins < b.wins)
            return 1;
        return 0;
    })
    return sorted;
}

function sortedTeams() {
    const sortedTeams = teams;

    sortedTeams.sort(function (a, b) {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    })

    return sortedTeams;
}

function sortedRoster(team, sortAttribute) {
    const sortedRoster = team.roster;
    team.roster.sort(function (a, b) {
        if (sortAttribute === 'position') {
            if (a.position < b.position) {
                return -1
            }
            if (a.position > b.position) {
                return 1;
            }
            return 0;
        }
        if (sortAttribute === 'rating') {
            if (a.rating > b.rating) {
                return -1
            }
            if (a.rating < b.rating) {
                return 1;
            }
            return 0;
        }
        //goals
        if (sortAttribute === 'ppg') {
            if (a.seasonGoals + a.seasonAssists > b.seasonGoals + b.seasonAssists) {
                return -1
            }
            if (a.seasonGoals + a.seasonAssists < b.seasonGoals + b.seasonAssists) {
                return 1;
            }
            return 0;
        }
    })

    return sortedRoster;
}

function leaugeLeaders() {
    const leaugeLeaders = {
        roster: []
    }

    for (let i = 0; i < teams.length; i++) {
        teams[i].roster.sort(function (a, b) {
            if (a.seasonGoals + a.seasonAssists > b.seasonGoals + b.seasonAssists)
                return -1;
            if (a.seasonGoals + a.seasonAssists < b.seasonGoals + b.seasonAssists)
                return 1;
            return 0;
        })
        for (let j = 0; j < 5; j++) {
            leaugeLeaders.roster.push(teams[i].roster[j]);
        }
    }

    leaugeLeaders.roster.sort(function (a, b) {
        if (a.seasonGoals + a.seasonAssists > b.seasonGoals + b.seasonAssists)
            return -1;
        if (a.seasonGoals + a.seasonAssists < b.seasonGoals + b.seasonAssists)
            return 1;
        return 0;
    })

    return leaugeLeaders;
}

let selectedTeam2 = teams[5];
function setSelectedTeam2(team) {
    selectedTeam2 = team;
}


function trade(team1, team2, t1Offers, t2Offers, isForced) {

    if (interest(t1Offers, t2Offers, isForced)) {

        for (let i = 0; i < t1Offers.length; i++) {
            let ply = t1Offers[i];
            if (ply.isPick === true) {
                if (inDraft) {
                    ply.currentTeam = team2;
                }
                console.log("pick");
                team1.draftPicks.splice(team1.draftPicks.indexOf(ply), 1);
                team2.draftPicks.push(ply);

            } else {
                team1.roster.splice(team1.roster.indexOf(ply), 1);
                team2.roster.push(ply);
                ply.teamName = team2.name;
                ply.teamLogoSrc = team2.logoSrc;
            }

        }

        for (let i = 0; i < t2Offers.length; i++) {
            let ply = t2Offers[i];
            if (ply.isPick === true) {
                if (inDraft) {
                    ply.currentTeam = team1;
                }
                team2.draftPicks.splice(team2.draftPicks.indexOf(ply), 1);
                team1.draftPicks.push(ply);

            } else {
                team2.roster.splice(team2.roster.indexOf(ply), 1);
                team1.roster.push(ply);
                ply.teamName = team1.name;
                ply.teamLogoSrc = team1.logoSrc;
            }
        }
        team1.reorderLineup();
        team2.reorderLineup();
        setTeamSalaries();


        team1.draftPicks.sort(function (a, b) {
            if (a.projectedPick > b.projectedPick) {
                return 1;
            }
            if (a.projectedPick < b.projectedPick) {
                return -1;
            } else { return 0; }
        });

        team1.draftPicks.sort(function (a, b) {
            if (a.round > b.round) {
                return 1;
            }
            if (a.round < b.round) {
                return -1;
            } else { return 0; }
        });

        team2.draftPicks.sort(function (a, b) {
            if (a.projectedPick > b.projectedPick) {
                return 1;
            }
            if (a.projectedPick < b.projectedPick) {
                return -1;
            } else { return 0; }
        });

        team2.draftPicks.sort(function (a, b) {
            if (a.round > b.round) {
                return 1;
            }
            if (a.round < b.round) {
                return -1;
            } else { return 0; }
        });

        return true;
    }
    else {
        return false;
    }
}


function signPlayer(team, player, years, salary, playerpool) {
    let index = playerpool.roster.indexOf(player);

    team.roster.push(player);
    playerpool.roster.splice(index, 1);
    player.salary = salary;
    player.years = years;
    player.teamLogoSrc = team.logoSrc;
    player.teamName = team.name;
    team.salary += player.salary;
    try {
        team.reorderLineup();
    }
    catch (err) {
        console.log('Error Reordering Lineup, Most likely during offseason when teams are not at full rosters');
    }

}

function setSalaryExpectations(rosterpool) {
    for (let i = 0; i < rosterpool.roster.length; i++) {

        if (collegeMode) {
            if (rosterpool.roster[i].rating >= 65) {
                rosterpool.roster[i].salary = Math.round(scaleBetween(rosterpool.roster[i].rating, VETERANSMINIMUM, 15000000, 65, 99));
                //VARIATION
                rosterpool.roster[i].salary -= Math.round(Math.random() * 100000);
            }
            else {
                rosterpool.roster[i].salary = Math.round(scaleBetween(rosterpool.roster[i].rating, 300000, VETERANSMINIMUM, 40, 64));
                rosterpool.roster[i].salary -= Math.round(Math.random() * 100000);

            }
        } else {

            if (rosterpool.roster[i].rating >= 74) {
                rosterpool.roster[i].salary = Math.round(scaleBetween(rosterpool.roster[i].rating, VETERANSMINIMUM, 15000000, 74, 99));
                rosterpool.roster[i].salary -= Math.round(Math.random() * 100000);

            }
            else {
                rosterpool.roster[i].salary = Math.round(scaleBetween(rosterpool.roster[i].rating, 300000, VETERANSMINIMUM, 40, 74));
                rosterpool.roster[i].salary -= Math.round(Math.random() * 100000);
            }
        }

    }
}

function canSign(team, salary) {
    if (calculateCapRoom(team) < salary && salary > VETERANSMINIMUM) {
        return false;
    } else {
        return true;
    }
}

function setTeamSalaries() {
    for (let i = 0; i < teams.length; i++) {
        teams[i].salary = 0;
        for (let j = 0; j < teams[i].roster.length; j++) {
            teams[i].salary += teams[i].roster[j].salary
        }
    }
}

function calculateCapRoom(team) {
    return CAPROOM - team.salary;
}

function displaySalary(salary) {
    let sal = Math.round(salary);
    return sal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function tradeValueCalculation(ply) {

    let isPick = false;
    if (ply.isPick === true) {
        isPick = true;
        // console.log(ply.projectedPick);
        if (ply.round > 1) {
            ply = draftClass.roster[ply.projectedPick + teams.length - 2];
        } else {
            ply = draftClass.roster[ply.projectedPick - 1];

        }
    }



    let ageVal = scaleBetween(ply.age, -50, 0, 19, 40);

    let salVal = scaleBetween(ply.salary, 0, 50, 800000, 50000000);
    let skillVal = 0;
    if (ply.rating >= 88) {
        skillVal = scaleBetween(ply.rating, 300, 500, 88, 99);
    } else if (ply.rating >= 83) {
        skillVal = scaleBetween(ply.rating, 120, 300, 83, 88);
    } else if (ply.rating >= 78) {
        skillVal = scaleBetween(ply.rating, 40, 120, 75, 83);
    } else {
        skillVal = scaleBetween(ply.rating, -50, 40, 40, 75);
    }
    let totalVal = skillVal - ageVal - salVal;





    if (isPick) {
        let certainty = ((teams[0].wins + teams[0].losses) / gamesPerSeason);
        // console.log(certainty);
        totalVal += ((totalVal * certainty) * 0.7);
    }
    console.log(ply.name + " Skil: " + skillVal + " Age: " + ageVal + " Sal: " + salVal + " " + totalVal);
    return totalVal;
}

function interest(t1Offers, t2Offers, forced) {
    if (forced) {
        return true;
    }
    let t1Value = 0;
    let t2Value = 0;
    for (let i = 0; i < t1Offers.length; i++) {
        let ply = t1Offers[i];

        t1Value += tradeValueCalculation(ply);
    }

    // console.log("TOTAL PACKAGE VAL: " + t1Value);
    // console.log("");

    for (let i = 0; i < t2Offers.length; i++) {
        let ply = t2Offers[i];
        t2Value += tradeValueCalculation(ply);
    }

    // console.log("TOTAL PACKAGE VAL: " + t2Value);
    // console.log("");


    //TRADE DIFFICULTY SLIDER 
    //Trade Threshold at 20
    // console.log(t1Value);
    // console.log(t2Value + (t2Value* tradeThreshold));
    if (t1Value > (t2Value + (t2Value * tradeThreshold))) {
        return true;
    } else {
        return false;
    }


    // let ageDiff = ply2.age - ply1.age;
    // let ratDiff = ply1.rating - ply2.rating;
    // let salaryDiff = ply2.salary - ply1.salary;
    // salaryDiff = scaleBetween(salaryDiff, 0, 10, 800000, 500000000);

    // let interest = ageDiff + ratDiff + salaryDiff;

    // if (interest >= 0) {
    //     return true;
    // } else {
    //     return false;
    // }


}





class Series {

    constructor() {
        this.game = 1;
        this.team1 = '';
        this.team2 = '';
        this.team1Wins = 0;
        this.team2Wins = 0;
        this.winner = null;
        this.results = [];
        this.manual = false;
    }

    simGame() {
        if (this.manual) {
            this.manual = false;
            return;
        }

        if (this.winner == null) {
            home = this.team1;
            away = this.team2;
            let game = new Game();
            game.playGame();
            this.game++;
            this.results.push({ team1Score: game.homescore, team2Score: game.awayscore });
            if (game.homescore > game.awayscore) {
                this.team1Wins++;
            } else {
                if (game.homescore === game.awayscore) {
                }
                this.team2Wins++;
            }
            if (this.team1Wins >= seriesWinCount) {

                this.winner = this.team1;
                return;
            }
            if (this.team2Wins >= seriesWinCount) {
                this.winner = this.team2;
                return;
            }
        }

    }

    manualGame() {
        if (this.winner == null) {
            home = this.team1;
            away = this.team2;
            let game = new Game();
            return game;

        }
    }

    simSeries() {
        while (this.winner == null) {
            this.simGame();
        }
    }
}

class Playoffs {
    constructor() {
        this.round = 1;
        this.eastTeams = [];
        this.westTeams = [];
        this.matchups = [];
        this.completed = false;
        this.champs = '';
        this.advance = false;
    }

    playoffMatchupGen() {
        for (let i = 0; i < (this.eastTeams.length) / 2; i++) {
            let series = new Series();
            series.team1 = this.eastTeams[i];
            series.team2 = this.eastTeams[this.eastTeams.length - (i + 1)];
            this.matchups.push(series);
        }

        for (let i = 0; i < (this.westTeams.length) / 2; i++) {
            let series = new Series();
            series.team1 = this.westTeams[i];
            series.team2 = this.westTeams[this.westTeams.length - (i + 1)];
            this.matchups.push(series);
        }

        this.eastTeams = [];
        this.westTeams = [];


    }

    determineRoundNumber() {
        let num = playoffSeeds;
        let count = 1;
        while (num != 1) {
            num /= 2;
            count++;
        }
        if (conferencesOn) {
            return count;
        } else {
            return count - 1;
        }
    }

    simDay() {
        if (!this.completed) {
            for (let i = 0; i < this.matchups.length; i++) {
                this.matchups[i].simGame();
            }

            let completed = 0;
            for (let i = 0; i < this.matchups.length; i++) {
                if (this.matchups[i].winner != null) {
                    completed++;
                    if (this.round >= this.determineRoundNumber()) {
                        this.champs = this.matchups[i].winner;
                        this.completed = true;
                        this.advance = true;
                        return;
                    }
                }
            }

            if (!this.advance) {
                if (completed === this.matchups.length) {
                    this.advance = true;
                    return;
                }
            }
            if (this.advance) {
                this.advance = false;
                this.round++;
                for (let i = 0; i < this.matchups.length; i++) {
                    let team = this.matchups[i].winner;
                    if (team.conferenceId === 0) {
                        this.eastTeams.push(team);
                    } else {
                        this.westTeams.push(team);
                    }
                }
                this.matchups = [];
                if (this.round >= this.determineRoundNumber()) {
                    this.matchups.push(new Series());
                    this.matchups[0].team1 = this.eastTeams[0];
                    this.matchups[0].team2 = this.westTeams[0];
                    return;
                }
                this.playoffMatchupGen();
                return;
            }
        }
    }





    simRound() {
        let currRound = this.round;
        while (!this.advance) {
            if (this.completed) {
                return;
            }
            this.simDay();
        }
    }


    simPlayoffs() {
        while (!this.completed) {
            this.simDay();
        }
    }




}

function resetFranchise() {
    franchise = new Franchise();
}

franchise = new Franchise();


function saveData(slot) {
    let data = {
        teams: [],
        freeAgents: '',
        draftClass: '',
        sliders: ''
    }

    for (let i = 0; i < teams.length; i++) {
        let teamDat = {
            name: teams[i].name,
            id: teams[i].id,
            conferenceId: teams[i].conferenceId,
            logoSrc: teams[i].logoSrc,
            roster: teams[i].roster
        };
        data.teams.push(teamDat);
    }

    data.freeAgents = availableFreeAgents;
    data.draftClass = draftClass;
    data.sliders = {
        twoPointPercentageLow: twoPointPercentageLow,
        twoPointPercentageHigh: twoPointPercentageHigh,
        threePointPercentageLow: threePointPercentageLow,
        threePointPercentageHigh: threePointPercentageHigh,
        defenseLow: defenseLow,
        defenseHigh: defenseHigh,
        secondsOffClock: secondsOffClock,
        gamesPerSeason: gamesPerSeason,
        playoffSeeds: playoffSeeds,
        seriesWinCount: seriesWinCount,
        conferencesOn: conferencesOn,
        collegeMode: collegeMode,
        difficulty: difficulty,
        tradeThreshold: tradeThreshold
    }

    let write = JSON.stringify(data);
    // checkForFile(write, slot);


    fileName = slot;
    if (!slot.includes('.roster')) {
        fileName += '.roster';
    }





    saveToFileSystem(write, fileName, 'roster');


}


saveToFileSystem = async (data, saveName, type) => {
    let name = "saves/" + saveName + '.' + type;
    if (saveName.includes('.')) {
        name = "saves/" + saveName;
    }
    console.log(name);
    const path = `${FileSystem.documentDirectory}${name}`;
    console.log('downloading to save');
    const saving = await FileSystem.writeAsStringAsync(path, data).then(() => {
        console.log('saved');
    }).catch((err) => {
        console.log(err);
    });
};


const loadFromFileSystem = async (fileName) => {
    const file = fileName;
    if (file.includes('.draftclass')) {
        const load = FileSystem.readAsStringAsync(FileSystem.documentDirectory + "saves/" + file).then((value) => {
            let data = JSON.parse(value);
            importDraftClassJson(data);
        }).catch((err) => {
            console.log(err);
        });
    } else if (file.includes('.franchise')) {
        const load = FileSystem.readAsStringAsync(FileSystem.documentDirectory + "saves/" + file).then((value) => {
            loadFranchise(value);
        }).catch((err) => {
            console.log(err);
        });
    } else {
        const load = FileSystem.readAsStringAsync(FileSystem.documentDirectory + "saves/" + file).then((value) => {
            loadData(value);
        }).catch((err) => {
            console.log(err);
        });
    }
};


const loadData = (data) => {
    try {
        let loadedData = JSON.parse(data);


        teams = [];
        for (let i = 0; i < conferences.length; i++) {
            conferences[i].teams = [];
        }
        for (let i = 0; i < loadedData.teams.length; i++) {
            teams.push(new Team(loadedData.teams[i]));
            teams[i].roster = [];
            for (let j = 0; j < loadedData.teams[i].roster.length; j++) {
                ply = new Player(loadedData.teams[i].roster[j]);
                ply.calculateRating();
                teams[i].roster.push(ply);
                ply.teamLogoSrc = teams[i].logoSrc;
                ply.teamName = teams[i].name;
            }



            for (let k = 0; k < conferences.length; k++) {
                if (teams[i].conferenceId === conferences[k].id) {
                    conferences[k].teams.push(teams[i]);
                }
            }

            teams[i].reorderLineup();
            teams[i].calculateRating();
        }

        if (teams.length > 7) {
            menuDisplayTeams();
        }

        setTeamSalaries();

        //NO NEEED TO PARSE JSON ITS ALREADY IN OBJECT FORMAT
        // for (let i = 0; i < rosterData.length; i++) {
        //     teams.push(new Team(rosterData[i]));
        // }
        availableFreeAgents.roster = [];
        for (let i = 0; i < loadedData.freeAgents.roster.length; i++) {
            availableFreeAgents.roster.push(new Player(loadedData.freeAgents.roster[i]));
            availableFreeAgents.roster[i].calculateRating();
            availableFreeAgents.roster[i].teamLogoSrc = availableFreeAgents.logoSrc;
            availableFreeAgents.roster[i].teamName = availableFreeAgents.name;

        }
        availableFreeAgents.reorderLineup();
        setSalaryExpectations(availableFreeAgents);

        if (loadedData.sliders != null) {

            if (loadedData.sliders.tradeThreshold == null) {
                resetSliders();
            } else {
                setSliders(loadedData.sliders.twoPointPercentageLow, loadedData.sliders.twoPointPercentageHigh, loadedData.sliders.threePointPercentageLow, loadedData.sliders.threePointPercentageHigh, loadedData.sliders.defenseLow, loadedData.sliders.defenseHigh, loadedData.sliders.secondsOffClock, loadedData.sliders.difficulty, loadedData.sliders.tradeThreshold);
                setFranchiseSliders(loadedData.sliders.gamesPerSeason, loadedData.sliders.playoffSeeds, loadedData.sliders.seriesWinCount, loadedData.sliders.conferencesOn, loadedData.sliders.collegeMode);
            }


        }

        generateDraftClass();

        resetFranchise();

        // if(loadData.draftClass.roster.length > 0){
        //     draftClass.roster = [];
        //     for (let i = 0; i < loadedData.draftClass.roster.length; i++) {
        //         availableFreeAgents.roster.push(new Player(draftClassData[i]));
        //         availableFreeAgents.roster[i].calculateRating();
        //         availableFreeAgents.roster[i].teamLogoSrc = availableFreeAgents.logoSrc;
        //         availableFreeAgents.roster[i].teamName = availableFreeAgents.name;

        //     }
        // }





    }
    catch (err) {
        console.log(err);
    }
}


function createTeam(name, rating, logoSrc, conferenceId) {
    let id = teams.length;
    let team = new Team({
        name: name,
        rating: rating,
        logoSrc, logoSrc,
        id: id,
        wins: 0,
        losses: 0,
        conferenceId: conferenceId
    })
    teams.push(team);

    generateCustomRoster(team, rating);
    for (let k = 0; k < conferences.length; k++) {
        if (team.conferenceId === conferences[k].id) {
            conferences[k].teams.push(team);
        }
    }
    sortedRoster(team, 'rating');
    setSalaryExpectations(team);
    setTeamSalaries();
    if (teams.length % 2 === 0) {
        franchise = new Franchise();
    }



    return team;

}

function createPlayer(name, number, position, age, salary, faceSrc, height, team) {
    let player = new Player({
        name: name,
        number: number,
        position, position,
        age: age,
        height: height,
        salary: salary,
        off: 75,
        def: 75,
        pass: 75,
        faceOff: 75,
        save: 75,
        rating: 75,
        faceSrc: faceSrc
    })
    if (team == null) {
        player.years = 0;
        availableFreeAgents.roster.push(player);
        player.teamName = availableFreeAgents.name;
        player.teamLogoSrc = availableFreeAgents.logoSrc;
        return player;
    } else {
        player.years = 1;
        team.roster.push(player);
        player.teamName = team.name;
        player.teamLogoSrc = team.logoSrc;
        team.reorderLineup();
    }
    return player;

}

function removeTeams() {
    franchise = null;
    teams = [];
    for (let i = 0; i < conferences.length; i++) {
        conferences[i].teams = [];
    }
}

function setCustomPlayoffSeeds() {
    if (conferencesOn) {
        if (conferences[0].teams.length >= conferences[1].teams.length) {
            if (conferences[0].teams.length >= 32) {
                return 32;
            } else if (conferences[0].teams.length >= 16) {
                return 16;
            } else if (conferences[0].teams.length >= 8) {
                return 8;
            }
            else if (conferences[0].teams.length >= 4) {
                return 4;
            }
            else if (conferences[0].teams.length >= 2) {
                return 2;
            }
            else if (conferences[0].teams.length >= 1) {
                return 1;
            }
        }
        else if (conferences[0].teams.length <= conferences[1].teams.length) {
            if (conferences[1].teams.length >= 32) {
                return 32;
            } else if (conferences[1].teams.length >= 16) {
                return 16;
            } else if (conferences[1].teams.length >= 8) {
                return 8;
            }
            else if (conferences[1].teams.length >= 4) {
                return 4;
            }
            else if (conferences[1].teams.length >= 2) {
                return 2;
            }
            else if (conferences[1].teams.length >= 1) {
                return 1;
            }
        }
    } else {
        if (teams.length >= 32) {
            return 32;
        } else if (teams.length >= 16) {
            return 16;
        } else if (teams.length >= 8) {
            return 8;
        }
        else if (teams.length >= 4) {
            return 4;
        }
        else if (teams.length >= 2) {
            return 2;
        }
        else if (teams.length >= 1) {
            return 1;
        }
    }
}

function exportRosterJson() {
    let data = {
        teams: [],
        freeAgents: '',
    }

    for (let i = 0; i < teams.length; i++) {

        let ros = []
        for (let j = 0; j < teams[i].roster.length; j++) {
            ros.push({
                name: teams[i].roster[j].name,
                position: teams[i].roster[j].position,
                faceSrc: teams[i].roster[j].faceSrc,
                number: teams[i].roster[j].number,
                height: teams[i].roster[j].height,
                off: teams[i].roster[j].off,
                def: teams[i].roster[j].def,
                pass: teams[i].roster[j].pass,
                faceOff: teams[i].roster[j].faceOff,
                save: teams[i].roster[j].save,
                years: teams[i].roster[j].years,
                salary: teams[i].roster[j].salary,
                age: teams[i].roster[j].age
            });
        }

        let teamDat = {
            name: teams[i].name,
            id: teams[i].id,
            conferenceId: teams[i].conferenceId,
            logoSrc: teams[i].logoSrc,
            roster: ros
        };


        data.teams.push(teamDat);
    }

    ros = [];
    for (let i = 0; i < availableFreeAgents.roster.length; i++) {
        ros.push({
            name: availableFreeAgents.roster[i].name,
            position: availableFreeAgents.roster[i].position,
            faceSrc: availableFreeAgents.roster[i].faceSrc,
            number: availableFreeAgents.roster[i].number,
            height: availableFreeAgents.roster[i].height,
            off: availableFreeAgents.roster[i].off,
            def: availableFreeAgents.roster[i].def,
            pass: availableFreeAgents.roster[i].pass,
            faceOff: availableFreeAgents.roster[i].faceOff,
            save: availableFreeAgents.roster[i].save,
            years: availableFreeAgents.roster[i].years,
            salary: availableFreeAgents.roster[i].salary,
            age: availableFreeAgents.roster[i].age
        });
    }
    data.freeAgents = {
        name: availableFreeAgents.name,
        logoSrc: availableFreeAgents.logoSrc,
        roster: ros
    };

    let write = JSON.stringify(data);
    return write;
}

async function getDataFromLink(link, type, sliderType) {
    type = type.toLowerCase();
    try {
        let response = await fetch(
            link,
        );
        let responseJson = await response.json();
        if (type === 'roster') {
            loadRosterJson(responseJson);
            if (sliderType === 'college') {
                collegeSliderPreset();
                resetFranchise();
            }
        }
        else if (type === 'team') {
            importTeamJson(responseJson);
        }
        else if (type === 'draftclass') {
            importDraftClassJson(responseJson);
        } else if (type === 'communityroster') {
            communityRosters = responseJson;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}


let communityRosters = [];
// communityRosters = getDataFromLink('https://raw.githubusercontent.com/cbanfiel/On-Paper-Sports-Basketball-2020-Rosters/master/AndroidRosters.json', 'communityroster');


function loadRosterJson(loadedDataIn) {

    try {

        let loadedData = (loadedDataIn);

        teams = [];
        for (let i = 0; i < conferences.length; i++) {
            conferences[i].teams = [];
        }
        for (let i = 0; i < loadedData.teams.length; i++) {
            teams.push(new Team(loadedData.teams[i]));
            teams[i].roster = [];
            for (let j = 0; j < loadedData.teams[i].roster.length; j++) {
                ply = new Player(loadedData.teams[i].roster[j]);
                ply.calculateRating();
                teams[i].roster.push(ply);
                ply.teamLogoSrc = teams[i].logoSrc;
                ply.teamName = teams[i].name;
            }

            for (let k = 0; k < conferences.length; k++) {
                if (teams[i].conferenceId === conferences[k].id) {
                    conferences[k].teams.push(teams[i]);
                }
            }
            teams[i].reorderLineup();
            teams[i].calculateRating();
        }
        setTeamSalaries();

        //NO NEEED TO PARSE JSON ITS ALREADY IN OBJECT FORMAT
        // for (let i = 0; i < rosterData.length; i++) {
        //     teams.push(new Team(rosterData[i]));
        // }
        availableFreeAgents.roster = [];
        for (let i = 0; i < loadedData.freeAgents.roster.length; i++) {
            availableFreeAgents.roster.push(new Player(loadedData.freeAgents.roster[i]));
            availableFreeAgents.roster[i].calculateRating();
            availableFreeAgents.roster[i].teamLogoSrc = availableFreeAgents.logoSrc;
            availableFreeAgents.roster[i].teamName = availableFreeAgents.name;

        }
        availableFreeAgents.reorderLineup();
        setSalaryExpectations(availableFreeAgents);

        generateDraftClass();


        if (teams.length > 7) {
            menuDisplayTeams();
        }

        resetSliders();

        resetFranchise();


        // if(loadData.draftClass.roster.length > 0){
        //     draftClass.roster = [];
        //     for (let i = 0; i < loadedData.draftClass.roster.length; i++) {
        //         availableFreeAgents.roster.push(new Player(draftClassData[i]));
        //         availableFreeAgents.roster[i].calculateRating();
        //         availableFreeAgents.roster[i].teamLogoSrc = availableFreeAgents.logoSrc;
        //         availableFreeAgents.roster[i].teamName = availableFreeAgents.name;

        //     }
        // }
    }
    catch (err) {
        console.log(err);
        console.log("Error Loading JSON");
    }



}


function teamStats() {
    let statsArr = teams;

    statsArr.sort(function (a, b) {
        if (a.seasonPoints > b.seasonPoints) {
            return -1;
        }
        if (a.seasonPoints < b.seasonPoints) {
            return 1;
        }
        return 0;
    });

    return statsArr;
}

function deleteTeam(team) {


    for (let k = 0; k < conferences.length; k++) {
        if (team.conferenceId === conferences[k].id) {
            conferences[k].teams.splice(conferences[k].teams.indexOf(team), 1);
        }
    }
    teams.splice(teams.indexOf(team), 1);

    if (teams.length % 2 === 0) {
        franchise = new Franchise();
    }

}

function reloadConferences() {
    for (let i = 0; i < conferences.length; i++) {
        conferences[i].teams = [];

    }

    for (let i = 0; i < teams.length; i++) {
        for (let k = 0; k < conferences.length; k++) {
            if (teams[i].conferenceId === conferences[k].id) {
                conferences[k].teams.push(teams[i]);
            }
        }

    }
}

function exportTeamJSON(team) {
    let ros = [];
    for (let i = 0; i < team.roster.length; i++) {
        ros.push({
            name: team.roster[i].name,
            position: team.roster[i].position,
            faceSrc: team.roster[i].faceSrc,
            number: team.roster[i].number,
            height: team.roster[i].height,
            off: team.roster[i].off,
            def: team.roster[i].def,
            threePoint: team.roster[i].threePoint,
            reb: team.roster[i].reb,
            ft: team.roster[i].ft,
            years: team.roster[i].years,
            salary: team.roster[i].salary,
            age: team.roster[i].age
        });
    }

    let teamDat = {
        name: team.name,
        conferenceId: team.conferenceId,
        logoSrc: team.logoSrc,
        roster: ros
    };

    let write = JSON.stringify(teamDat);
    return write;
}

function importTeamJson(data) {
    let ply;
    let read = data;

    let team = createTeam(read.name, 75, read.logoSrc, read.conferenceId);

    team.roster = [];

    for (let i = 0; i < read.roster.length; i++) {
        ply = new Player(read.roster[i]);
        ply.calculateRating();
        team.roster.push(ply);
        ply.teamLogoSrc = teams[i].logoSrc;
        ply.teamName = teams[i].name;
    }

    team.reorderLineup();
    team.calculateRating();

    sortedRoster(team, 'rating');
    setTeamSalaries();
}

function exportDraftClassJson() {
    let ros = [];
    for (let i = 0; i < draftClass.roster.length; i++) {
        ros.push({
            name: draftClass.roster[i].name,
            position: draftClass.roster[i].position,
            faceSrc: draftClass.roster[i].faceSrc,
            number: draftClass.roster[i].number,
            height: draftClass.roster[i].height,
            off: draftClass.roster[i].off,
            def: draftClass.roster[i].def,
            pass: draftClass.roster[i].pass,
            faceOff: draftClass.roster[i].faceOff,
            save: draftClass.roster[i].save,
            years: draftClass.roster[i].years,
            salary: draftClass.roster[i].salary,
            age: draftClass.roster[i].age
        });
    }

    let teamDat = {
        roster: ros
    };

    let write = JSON.stringify(teamDat);
    return write;
}

function importDraftClassJson(data) {
    let ply;
    let read = data;
    console.log(read.roster.length);

    draftClass.roster = [];
    for (let i = 0; i < read.roster.length; i++) {
        ply = new Player(read.roster[i]);
        ply.calculateRating();
        draftClass.roster.push(ply);
        ply.teamLogoSrc = draftClass.logoSrc;
        ply.teamName = draftClass.name;
    }

    draftClass.reorderLineup();
}

function releasePlayer(player) {

    //TODO please for the love of god just change this to pass in a team instead of looping through all the teams
    for (let i = 0; i < teams.length; i++) {
        for (let j = 0; j < teams[i].roster.length; j++) {
            if (teams[i].roster[j] === player) {
                teams[i].roster.splice(teams[i].roster.indexOf(player), 1);
                availableFreeAgents.roster.push(player);
                player.teamLogoSrc = availableFreeAgents.logoSrc;
                player.teamName = availableFreeAgents.name;
                try {
                    teams[i].reorderLineup();
                }
                catch (err) {
                    console.log('Error Reordering Lineup, Most likely during offseason when teams are not at full rosters');
                }
                setTeamSalaries();
                break;
            }

        }
    }

}

function sortTeamsByRating() {
    teams.sort(function (a, b) {
        if (a.rating > b.rating)
            return -1;
        if (a.rating < b.rating)
            return 1;
        return 0;
    })

    for (let i = 0; i < teams.length; i++) {
        teams[i].ratingRank = i + 1;
    }
}

function offerContract(team, ply, years, salary, playerpool, isForced) {

    if (isForced) {
        signPlayer(team, ply, years, salary, playerpool);
        return true;
    }

    if (ply.salary <= VETERANSMINIMUM) {
        signPlayer(team, ply, years, salary, playerpool);
        return true;
    }

    if (ply.rating < 78) {
        signPlayer(team, ply, years, salary, playerpool);
        return true;
    }

    sortTeamsByRating();

    let salaryAddition = scaleBetween(team.ratingRank, (-(ply.salary * 0.1)), ply.salary * 0.3, 1, teams.length);
    salaryAddition = salaryAddition - ((salaryAddition * .32) * years);
    // console.log(salaryAddition);

    if (ply.salary + salaryAddition < salary) {
        signPlayer(team, ply, years, salary, playerpool);
        return true;
    } else {
        return false;
    }

}

function setPowerRankings() {



    let powerranks = [...teams];

    if (powerranks[0].wins + powerranks[0].losses < (gamesPerSeason * 0.25)) {
        powerranks.sort(function (a, b) {
            if (a.rating < b.rating) {
                return 1;
            }
            if (a.rating > b.rating) {
                return -1
            } else {
                return 0;
            }
        })

        for (let i = 0; i < powerranks.length; i++) {
            powerranks[i].powerRanking = i + 1;
        }

        return;

    }

    powerranks.sort(function (a, b) {
        if (a.wins < b.wins) {
            return 1;
        }
        if (a.wins > b.wins) {
            return -1
        } else {
            return 0;
        }
    })

    for (let i = 0; i < powerranks.length; i++) {
        powerranks[i].powerRanking = i + 1;
    }
}




function getDraftPickProjectedPick(pick) {

    //NEEDS OPTIMIZATION
    setPowerRankings();
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].name === pick.originalTeam) {
            let pickNum = (teams[i].powerRanking - (teams.length + 1)) * -1;
            pick.projectedPick = pickNum;
            return pickNum;
        }
    }
}

function saveAsDraftClass(ros, name) {
    draftClass.roster = [];

    if (ros.length < 80) {
        generateDraftClass();
        while (ros.length + draftClass.roster.length > 80) {
            draftClass.roster.unshift[0];
        }
    }


    for (let i = 0; i < ros.length; i++) {

        let ply = ros[i];
        let subtraction = Math.round(scaleBetween(ply.rating, 24, 7, 70, 99));
        ply.off -= subtraction;
        ply.def -= subtraction;
        ply.threePoint -= 7;
        ply.reb -= 7;
        ply.years = 2 + 1;
        ply.salary = 1200000;
        ply.calculateRating();
        draftClass.roster.push(ply);
    }



    let data = exportDraftClassJson();

    saveToFileSystem(data, name, 'draftclass');

}

function saveDraftClass(name) {
    let data = exportDraftClassJson();
    saveToFileSystem(data, name, 'draftclass');
}

function manageSaveName(value) {
    let str = value.replace(/\s+/g, '');

    let index = str.indexOf('.');
    if (index > 0) {
        str = str.substring(0, index);
    }

    return str;
}


function returnStatsView(player) {
    let str;
    str = "GOALS: " + player.goals + "\nSHOTS: " + player.seasonShots + "\nASSISTS: " + player.seasonAssists + "\nSAVE%: " + Math.round((player.seasonSaves / (player.seasonSaves + player.seasonGoalsAllowed)) * 1000) / 10;
    return str;
}

function returnStatsListView(player) {
    let str;
    str = "GOALS: " + player.goals + " SHOTS: " + player.shots + " ASSISTS: " + player.assists + " SAVE%: " + Math.round((player.saves / (player.saves + player.goalsAllowed)) * 1000) / 10;
    return str;
}


function saveFranchise(slot) {
    let data = {
        teams: [],
        freeAgents: '',
        draftClass: '',
        sliders: '',
        day: franchise.season.day,
        pastChampions: franchise.pastChampions
    }

    for (let i = 0; i < teams.length; i++) {
        scheduleString = [];
        for (let j = 0; j < teams[i].schedule.length; j++) {
            scheduleString.push(teams[i].schedule[j].name);
        }

        let teamDat = {
            name: teams[i].name,
            id: teams[i].id,
            conferenceId: teams[i].conferenceId,
            logoSrc: teams[i].logoSrc,
            roster: teams[i].roster,
            history: teams[i].history,
            offVsDefFocus: teams[i].offVsDefFocus,
            qualityVsQuantity: teams[i].qualityVsQuantity,
            defenseAggresiveVsConservative: teams[i].defenseAggresiveVsConservative,
            forwardsVsDefensemen: teams[i].forwardsVsDefensemen,
            rotationSize: teams[i].rotationSize,
            frontCourtVsBackCourt: teams[i].frontCourtVsBackCourt,
            freezeThePuckVsPlayThePuck: teams[i].freezeThePuckVsPlayThePuck,
            scheduleString: scheduleString,
            wins: teams[i].wins,
            losses: teams[i].losses,
            played: teams[i].played,
            seasonPoints: teams[i].seasonPoints,
            seasonPointsAllowed: teams[i].seasonPointsAllowed,
            seasonRebounds: teams[i].seasonRebounds,
            seasonOffRebounds: teams[i].seasonOffRebounds,
            seasonFieldGoalsAttempted: teams[i].seasonFieldGoalsAttempted,
            seasonFieldGoalsMade: teams[i].seasonFieldGoalsMade,
            seasonThreesAttempted: teams[i].seasonThreesAttempted,
            seasonThreesMade: teams[i].seasonThreesMade,
            seasonFreeThrowsMade: teams[i].seasonFreeThrowsMade,
            seasonFreeThrowsAttempted: teams[i].seasonFreeThrowsAttempted,

        };



        data.teams.push(teamDat);
    }


    data.freeAgents = availableFreeAgents;
    data.sliders = {
        twoPointPercentageLow: twoPointPercentageLow,
        twoPointPercentageHigh: twoPointPercentageHigh,
        threePointPercentageLow: threePointPercentageLow,
        threePointPercentageHigh: threePointPercentageHigh,
        defenseLow: defenseLow,
        defenseHigh: defenseHigh,
        secondsOffClock: secondsOffClock,
        gamesPerSeason: gamesPerSeason,
        playoffSeeds: playoffSeeds,
        seriesWinCount: seriesWinCount,
        conferencesOn: conferencesOn,
        collegeMode: collegeMode,
        difficulty: difficulty,
        tradeThreshold: tradeThreshold
    }

    let dc = [];
    for (let i = 0; i < draftClass.roster.length; i++) {
        dc.push({
            name: draftClass.roster[i].name,
            position: draftClass.roster[i].position,
            faceSrc: draftClass.roster[i].faceSrc,
            number: draftClass.roster[i].number,
            height: draftClass.roster[i].height,
            off: draftClass.roster[i].off,
            def: draftClass.roster[i].def,
            pass: draftClass.roster[i].pass,
            faceOff: draftClass.roster[i].faceOff,
            save: draftClass.roster[i].save,
            years: draftClass.roster[i].years,
            salary: draftClass.roster[i].salary,
            age: draftClass.roster[i].age
        });
    }

    data.draftClass = dc;



    let write = JSON.stringify(data);
    // checkForFile(write, slot);


    fileName = slot;
    if (!slot.includes('.franchise')) {
        fileName += '.franchise';
    }
    saveToFileSystem(write, fileName, 'franchise');
}

const loadFranchise = (data) => {
    try {
        let loadedData = JSON.parse(data);


        teams = [];
        for (let i = 0; i < conferences.length; i++) {
            conferences[i].teams = [];
        }
        for (let i = 0; i < loadedData.teams.length; i++) {
            teams.push(new Team(loadedData.teams[i]));
            teams[i].history = loadedData.teams[i].history;
            teams[i].roster = [];
            //coach sliders
            teams[i].offVsDefFocus = loadedData.teams[i].offVsDefFocus;
            teams[i].qualityVsQuantity = loadedData.teams[i].qualityVsQuantity;
            teams[i].defenseAggresiveVsConservative = loadedData.teams[i].defenseAggresiveVsConservative;
            teams[i].forwardsVsDefensemen = loadedData.teams[i].forwardsVsDefensemen;
            teams[i].rotationSize = loadedData.teams[i].rotationSize;
            teams[i].frontCourtVsBackCourt = loadedData.teams[i].frontCourtVsBackCourt;
            teams[i].freezeThePuckVsPlayThePuck = loadedData.teams[i].freezeThePuckVsPlayThePuck;
            //stats
            teams[i].seasonPoints = loadedData.teams[i].seasonPoints;
            teams[i].seasonPointsAllowed = loadedData.teams[i].seasonPointsAllowed;
            teams[i].seasonRebounds = loadedData.teams[i].seasonRebounds;
            teams[i].seasonOffRebounds = loadedData.teams[i].seasonOffRebounds;
            teams[i].seasonFieldGoalsAttempted = loadedData.teams[i].seasonFieldGoalsAttempted;
            teams[i].seasonFieldGoalsMade = loadedData.teams[i].seasonFieldGoalsMade;
            teams[i].seasonThreesAttempted = loadedData.teams[i].seasonThreesAttempted;
            teams[i].seasonThreesMade = loadedData.teams[i].seasonThreesMade;
            teams[i].seasonFreeThrowsMade = loadedData.teams[i].seasonFreeThrowsMade;
            teams[i].seasonFreeThrowsAttempted = loadedData.teams[i].seasonFreeThrowsAttempted;

            for (let j = 0; j < loadedData.teams[i].roster.length; j++) {
                ply = new Player(loadedData.teams[i].roster[j]);
                ply.calculateRating();
                teams[i].roster.push(ply);
                ply.teamLogoSrc = teams[i].logoSrc;
                ply.teamName = teams[i].name;
                ply.previousSeasonsStats = loadedData.teams[i].roster[j].previousSeasonsStats;
                ply.statsHistory = loadedData.teams[i].roster[j].statsHistory;
                ply.seasonPoints = loadedData.teams[i].roster[j].seasonPoints;
                ply.seasonRebounds = loadedData.teams[i].roster[j].seasonRebounds;
                ply.seasonOffRebounds = loadedData.teams[i].roster[j].seasonOffRebounds;
                ply.seasonTwoPointersAtt = loadedData.teams[i].roster[j].seasonThreePointersAtt;
                ply.seasonTwoPointersMade = loadedData.teams[i].roster[j].seasonTwoPointersMade;
                ply.seasonThreePointersAtt = loadedData.teams[i].roster[j].seasonThreePointersAtt;
                ply.seasonThreePointersMade = loadedData.teams[i].roster[j].seasonThreePointersMade;
                ply.seasonFreeThrowsMade = loadedData.teams[i].roster[j].seasonFreeThrowsMade;
                ply.seasonFreeThrowsAttempted = loadedData.teams[i].roster[j].seasonFreeThrowsAttempted;
                ply.minutesPlayed = loadedData.teams[i].roster[j].minutesPlayed;

            }



            for (let k = 0; k < conferences.length; k++) {
                if (teams[i].conferenceId === conferences[k].id) {
                    conferences[k].teams.push(teams[i]);
                }
            }

            teams[i].reorderLineup();
            teams[i].calculateRating();
        }


        if (teams.length > 7) {
            menuDisplayTeams();
        }



        setTeamSalaries();

        //NO NEEED TO PARSE JSON ITS ALREADY IN OBJECT FORMAT
        // for (let i = 0; i < rosterData.length; i++) {
        //     teams.push(new Team(rosterData[i]));
        // }
        availableFreeAgents.roster = [];
        for (let i = 0; i < loadedData.freeAgents.roster.length; i++) {
            availableFreeAgents.roster.push(new Player(loadedData.freeAgents.roster[i]));
            availableFreeAgents.roster[i].calculateRating();
            availableFreeAgents.roster[i].teamLogoSrc = availableFreeAgents.logoSrc;
            availableFreeAgents.roster[i].teamName = availableFreeAgents.name;
            for (let j = 0; j < loadedData.day; j++)
                availableFreeAgents.roster[i].statsHistory.push({
                    points: 0,
                    twoPointersAtt: 0,
                    twoPointersMade: 0,
                    rebounds: 0,
                    threePointersAtt: 0,
                    threePointersMade: 0
                });

        }


        availableFreeAgents.reorderLineup();
        setSalaryExpectations(availableFreeAgents);

        //this resets franchise
        if (loadedData.sliders != null) {

            if (loadedData.sliders.tradeThreshold == null) {
                resetSliders();
            } else {
                setSliders(loadedData.sliders.twoPointPercentageLow, loadedData.sliders.twoPointPercentageHigh, loadedData.sliders.threePointPercentageLow, loadedData.sliders.threePointPercentageHigh, loadedData.sliders.defenseLow, loadedData.sliders.defenseHigh, loadedData.sliders.secondsOffClock, loadedData.sliders.difficulty, loadedData.sliders.tradeThreshold);
                setFranchiseSliders(loadedData.sliders.gamesPerSeason, loadedData.sliders.playoffSeeds, loadedData.sliders.seriesWinCount, loadedData.sliders.conferencesOn, loadedData.sliders.collegeMode, true);
            }


        }

        // generateDraftClass();


        // resetFranchise();

        //loadschedules
        for (let i = 0; i < teams.length; i++) {
            teams[i].schedule = [];
            let schedule;
            let played;
            for (let n = 0; n < loadedData.teams.length; n++) {
                if (loadedData.teams[n].name === teams[i].name) {
                    schedule = loadedData.teams[n].scheduleString;
                    played = loadedData.teams[n].played;
                    teams[i].wins = loadedData.teams[n].wins;
                    teams[i].losses = loadedData.teams[n].losses;
                }
            }

            for (let j = 0; j < schedule.length; j++) {
                for (let k = 0; k < teams.length; k++) {
                    if (schedule[j] === teams[k].name) {
                        teams[i].schedule.push(teams[k]);
                    }
                }
            }

            teams[i].played = played;
        }


        //franchhise filec
        franchise.season.day = loadedData.day;
        franchise.pastChampions = loadedData.pastChampions;
        franchise.season.endOfSeason = false;
        franchise.offSeason = false;
        franchise.advance = false;
        franchise.stage = '';
        franchise.currentDraft = '';
        franchise.playoffs = '';

        //draft class
        draftClass.roster = [];
        for (let i = 0; i < loadedData.draftClass.length; i++) {
            ply = new Player(loadedData.draftClass[i]);
            ply.calculateRating();
            draftClass.roster.push(ply);
            ply.teamLogoSrc = draftClass.logoSrc;
            ply.teamName = draftClass.name;
        }

        draftClass.reorderLineup();



        // if(loadData.draftClass.roster.length > 0){
        //     draftClass.roster = [];
        //     for (let i = 0; i < loadedData.draftClass.roster.length; i++) {
        //         availableFreeAgents.roster.push(new Player(draftClassData[i]));
        //         availableFreeAgents.roster[i].calculateRating();
        //         availableFreeAgents.roster[i].teamLogoSrc = availableFreeAgents.logoSrc;
        //         availableFreeAgents.roster[i].teamName = availableFreeAgents.name;

        //     }
        // }





    }
    catch (err) {
        console.log(err);
    }
}

// let fantasyDraft = () => {
//     let fantasyDraftArray = [];
//     for (let i = 0; i < teams.length; i++) {
//         for (let j = 0; j < teams[i].roster.length; j++) {
//             fantasyDraftArray.push(teams[i].roster[j]);
//         }
//     }

//     for (let i = 0; i < availableFreeAgents.roster.length; i++) {
//         fantasyDraftArray.push(availableFreeAgents.roster[i]);
//     }

//     return fantasyDraftArray;
// }



function makeRosterFilePC(){

    var fs = require('fs');
    fs.writeFile("ros.json", exportRosterJson(), function(err, result) {
        if(err) console.log('error', err);
    });
}
makeRosterFilePC();