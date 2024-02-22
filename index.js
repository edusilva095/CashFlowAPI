const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const data = fs.readFileSync("data.json", "utf8");
const dataJSON = JSON.parse(data);

app.get("/", (req, res) => {
    res.json({ message: "API is running!" });
})

app.post("/reset", (req, res) => {
    const resetData = [];
    writeData(resetData);
    res.status(200).json({ "message": "OK" });
})

app.get("/balance/:account_id", (req, res) => {
    
    const accountExists = dataJSON.find(account => account.id === req.params.account_id);

    if(accountExists){
        res.status(200).json({ "balance": accountExists.balance });
    } else {
        res.status(404).json({ "message": "0" });
    }
})

app.post("/account/create", (req, res) => {

    const dataAccountBalance = {
        "id": req.body.destination, 
        "balance": req.body.amount
    }

    const accountExists = dataJSON.some(account => account.id === dataAccountBalance.id);

    if(!accountExists){
        dataJSON.push(dataAccountBalance)
        writeData(dataJSON);
        res.status(201).json({"destination": {"id": req.body.destination, "balance": req.body.amount}});
    
    } else {
        res.status(409).json({ "message": "Account already exists." });
    }
})

app.post("/account/transactions", (req, res) => {

    const accountExistsOrigin = dataJSON.find(account => account.id === req.body.origin);

    const accountExistsDestination = dataJSON.find(account => account.id === req.body.destination);

    if(accountExistsDestination){
        if (req.body.type !== "deposit" && req.body.type !== "withdraw" && req.body.type !== "transfer") {
            res.status(400).json({ "message": "Invalid transaction type." });
        }

        if (req.body.type === "deposit") {
            deposit(accountExistsDestination, req.body.amount);
            writeData(dataJSON);
            res.status(201).json({ "destination": { "id": accountExistsDestination.id, "balance": accountExistsDestination.balance }});
        } else if(req.body.type === "withdraw") {
            withdraw(accountExistsDestination, req.body.amount, res);
            writeData(dataJSON);
            res.status(201).json({ "origin": { "id": accountExistsDestination.id, "balance": accountExistsDestination.balance }});
        } else {
            transfer(accountExistsOrigin, accountExistsDestination, req.body.amount, res);
            writeData(dataJSON);
            res.status(201).json({"origin": {"id": accountExistsOrigin.id, "balance": accountExistsOrigin.balance }, "destination": {"id": accountExistsDestination.id, "balance": accountExistsDestination.balance}});
        }

    } else {
        res.status(404).json({ "message": "0" });
    }
})

function deposit(accountExistsDestination, amount) {
   accountExistsDestination.balance += amount;
}

function withdraw(accountExistsDestination, amount, res) {
    if (accountExistsDestination.balance < amount) {
        res.status(400).json({ "message": "Insufficient funds." });
    }
    accountExistsDestination.balance -= amount;
}

function transfer(accountExistsOrigin, accountExists, amount, res) {
    if(accountExistsOrigin){
        if (accountExistsOrigin.balance < amount) {
            res.status(400).json({ "message": "Insufficient funds." });
        }
        accountExistsOrigin.balance -= amount;
        accountExists.balance += amount;
    } else {
        res.status(404).json({ "message": "0" });
    }
}

function writeData(data) {
    const dataAccountBalanceJSON = JSON.stringify(data);
    fs.writeFile("data.json", dataAccountBalanceJSON, (err) => err && console.error(err));
}


app.listen(port, () => {
    console.log("API is running!");
})