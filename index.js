const fs = require("fs");
const path = "/data/transactions.txt"; // Assuming transactions.txt file contains the provided input
const resultsPath = "/data/results.txt";
const requiredDeposits = [100, 500, 1000];
const requiredBets = [50, 250, 500];

class Casino {
  constructor() {
    this.users = {};
    this.scenarios = [];
    this.betCountParity = 0; // Every second bet will have a different outcome.
  }

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
        scenario: -1,
        scenarioInd: 0,
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
    if (!this.validate(user_id, amount, "ar shegidzlia shemoitano uaryopiti raodenobis tanxa")) {
      return;
    }
    const currUser = this.users[user_id];
    currUser.balance += amount;
    currUser.maxDeposit = Math.max(currUser.maxDeposit, amount);
  }

  withdraw(user_id, amount) {
    amount = parseInt(amount);
    if (!this.validate(user_id, amount, "ar shegidzlia amoigo uaryopiti tanxa")) {
      return;
    }
    const currUser = this.users[user_id];
    if (currUser.balance < amount) {
      console.log("ar gaqvs sakmarisi tanxa gamosatani");
      return;
    }
    currUser.balance -= amount;
    console.log(`${amount} lari gamoitana!`);
  }

  bet(user_id, game, amount) {
    game = game.toLowerCase();
    amount = parseInt(amount);
    if (!this.validate(user_id, amount, "ar shegidzlia chamoxvide uaryopiti raodenobis tanxas")) {
      return;
    }
    const currUser = this.users[user_id];
    if (currUser.balance < amount) {
      console.log("ar gaqvs sakmarisi tanxa");
      return;
    }
    currUser.totalBet += amount;
    if (this.betCountParity == 0) {
      currUser.balance += amount; // winning scenario
    } else {
      currUser.balance -= amount; // losing scenario
    }
    if (game === "slot" || game === "slots") {
      this.checkCampaign(user_id);
    }
    this.betCountParity = 1 - this.betCountParity; // Toggle bet outcome
  }

  balance(user_id) {
    if (!this.validate(user_id)) {
      return;
    }
    return this.users[user_id].balance;
  }

  checkCampaign(user_id) {
    let hasPrize = false;
    const currUser = this.users[user_id];
    if (currUser.scenarioInd >= requiredDeposits.length) {
      return;
    }
    if (currUser.maxDeposit >= requiredDeposits[currUser.scenarioInd] &&
        currUser.totalBet >= requiredBets[currUser.scenarioInd]) {
      hasPrize = true;
    }
    if (currUser.scenario == -1 && hasPrize) {
      if (this.scenarios.length === 0) {
        return;
      }
      currUser.scenario = this.scenarios.shift();
    }
    if (hasPrize) {
      currUser.balance += currUser.scenario[currUser.scenarioInd];
      currUser.scenarioInd++;
    }
  }

  viewUserDetails(user_id) {
    if (!this.validate(user_id)) {
      return;
    }
    console.log(this.users[user_id]);
  }

  listUsers() {
    console.log("Registered Users:");
    Object.keys(this.users).forEach((user_id) => {
      console.log(user_id);
    });
  }

  deleteUser(user_id) {
    if (!this.users[user_id]) {
      console.log("aseti momxmarebeli ar arsebobs");
      return;
    }
    delete this.users[user_id];
    console.log(`${user_id} gamoishala sistemaidan`);
  }

  resetCampaign(user_id) {
    if (!this.validate(user_id)) {
      return;
    }
    this.users[user_id].scenario = -1;
    this.users[user_id].scenarioInd = 0;
    console.log(`${user_id}-s kampania ganaukhda`);
  }

  saveUserData(filePath = "/data/user_data.json") {
    fs.writeFileSync(filePath, JSON.stringify(this.users, null, 2));
    console.log("User data was saved to file.");
  }

  loadUserData(filePath = "/data/user_data.json") {
    if (!fs.existsSync(filePath)) {
      console.log("File not found.");
      return;
    }
    const data = fs.readFileSync(filePath, "utf-8");
    this.users = JSON.parse(data);
    console.log("User data loaded from file.");
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
        case "withdraw":
          this.withdraw(...args);
          break;
        case "bet":
          this.bet(...args);
          break;
        case "balance":
          const balance = this.balance(...args);
          results.push(balance);
          break;
        case "viewdetails":
          this.viewUserDetails(...args);
          break;
        case "listusers":
          this.listUsers();
          break;
        case "deleteuser":
          this.deleteUser(...args);
          break;
        case "resetcampaign":
          this.resetCampaign(...args);
          break;
        case "saveuserdata":
          this.saveUserData(...args);
          break;
        case "loaduserdata":
          this.loadUserData(...args);
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
