const fs = require("fs");
const path = "/data/transactions.txt";
const resultsPath = "/data/results.txt";
const requiredDeposits = [100, 500, 1000];
const requiredBets = [50, 250, 500];

class Casino {
  constructor() {
    this.users = {};
    this.scenarios = [];
    this.betCountParity = 0; // yoveli meore bet-is dros iqneba 1, sxva dros 0.
  }

  // amowmebs momxmarebeli da tanxa tu aris sworad shemotanili
  validate(user_id, amount = 0, msg = "") {
    if (!this.users[user_id]) {
      console.log("aseti momxmarebeli ar arsebobs");
      return false;
    }
    if (amount < 0) {
      console.log(msg);
      return false;
    }
    return true;
  }

  register(user_id) {
    if (!this.users[user_id]) {
      this.users[user_id] = {
        balance: 0,
        scenario: -1, // scenario masivi romelic am momxmarebels ekutvnis
        scenarioInd: 0, // romeli prizis jeria scenarioshi
        maxDeposit: 0,
        totalBet: 0,
      };
    } else {
      console.log(`${user_id} ukve daregistrirebulia`);
    }
  }

  addScenario(prize1, prize2, prize3) {
    if (prize1 < 0 || prize2 < 0 || prize3 < 0) {
      console.log("ar sheidzleba prizi iyos uaryopiti");
      return;
    }
    prize1 = parseInt(prize1);
    prize2 = parseInt(prize2);
    prize3 = parseInt(prize3);
    this.scenarios.push([prize1, prize2, prize3]);
  }

  deposit(user_id, amount) {
    amount = parseInt(amount);
    if (
      !this.validate(
        user_id,
        amount,
        "ar shegidzlia shemoitano uaryopiti raodenobis tanxa"
      )
    ) {
      return;
    }
    const currUser = this.users[user_id];
    currUser.balance += amount;
    currUser.maxDeposit = Math.max(currUser.maxDeposit, amount); // itvlis maqsimalur depozits rom vnaxot minimum 100 (an 500 an 1000) lari tu aris shemotanili
  }

  bet(user_id, game, amount) {
    game = game.toLowerCase();
    amount = parseInt(amount);
    if (
      !this.validate(
        user_id,
        amount,
        "ar shegidzlia chamoxvide uaryopiti raodenobis tanxas"
      )
    ) {
      return;
    }
    const currUser = this.users[user_id];
    if (currUser.balance < amount) {
      console.log("ar gaqvs sakmarisi tanxa");
      return;
    }
    currUser.totalBet += amount;
    if (this.betCountParity == 0) {
      // ese igi es beti iyo momgebiani
      currUser.balance += amount;
    } else {
      currUser.balance -= amount;
    }
    if (game === "slot" || game === "slots") {
      this.checkCampaign(user_id);
    }
    this.betCountParity = 1 - this.betCountParity;
  }

  balance(user_id) {
    if (!this.validate(user_id)) {
      return;
    }
    return this.users[user_id].balance;
  }

  // amowmebs kampaniis pirobas
  checkCampaign(user_id) {
    let hasPrize = false;
    const currUser = this.users[user_id];
    if (currUser.scenarioInd >= requiredDeposits.length) {
      // yvela prizi miigo ukve, mets vegar miigebs
      return;
    }
    if (
      currUser.maxDeposit >= requiredDeposits[currUser.scenarioInd] &&
      currUser.totalBet >= requiredBets[currUser.scenarioInd]
    ) {
      // tu akmayopilebs kampaniis pirobebs (minimalur depozits da jamur bets) ese igi prizi moigo
      hasPrize = true;
    }
    if (currUser.scenario == -1 && hasPrize) {
      // tu momxmarebels aqamde scenario ar hqonda da moigo scenario unda mivcet
      if (this.scenarios.length === 0) {
        // tu meti scenario agar aris mashin ver moigo
        return;
      }
      currUser.scenario = this.scenarios.shift();
    }
    if (hasPrize) {
      currUser.balance += currUser.scenario[currUser.scenarioInd];
      currUser.scenarioInd++;
    }
  }

  executeCommands() {
    const transactions = fs
      .readFileSync(path, "utf-8")
      .split("\n")
      .map((transaction) => transaction.trim());
    const results = [];

    transactions.forEach((transaction) => {
      const [command, ...args] = transaction.split(" ");

      switch (command) {
        case "register":
          this.register(...args);
          break;
        case "addscenario":
          this.addScenario(...args);
          break;
        case "deposit":
          this.deposit(...args);
          break;
        case "bet":
          this.bet(...args);
          break;
        case "balance":
          const balance = this.balance(...args);
          results.push(balance);
          break;
        default:
          console.log("aseti command ar arsebobs");
      }
    });

    fs.writeFileSync(resultsPath, results.join("\n"));
  }
}

const casino = new Casino();
casino.executeCommands();
