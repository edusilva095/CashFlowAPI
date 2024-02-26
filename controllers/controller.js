const fs = require("fs");

const dataFilePath = './data.json';

exports.reset = (req, res) => {
    const emptyData = { accounts: [{ "id": "300", "balance": 0 }] };

    fs.writeFile(dataFilePath, JSON.stringify(emptyData), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error resetting the file");
            return;
        }
        res.status(200).send("OK");
    });
}

exports.balance = (req, res) => {
    const { account_id } = req.params;

    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading the data");
            return;
        }

        const { accounts } = JSON.parse(data);

        const account = accounts.find(acc => acc.id === account_id);

        if (!account) {
            res.status(404).send("0");
            return;
        }

        res.status(200).json(account.balance);
    });
}

exports.event = (req, res) => {
    const eventData = req.body;
    const { type, origin, amount, destination } = eventData;
    
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading the data");
            return;
        }

        let { accounts } = JSON.parse(data);

        let originAccount = accounts.find(acc => acc.id === origin);

        let destAccount = accounts.find(acc => acc.id === destination);

        switch (type) {
            case 'deposit':
                if (!destAccount) {
                    destAccount = { id: destination, balance: 0 };
                    accounts.push(destAccount);
                }
                destAccount.balance += amount;
                writeFile(accounts);
                res.status(201).json({ "destination": { "id": destAccount.id, "balance": destAccount.balance } });
                break;
            case 'withdraw':
                if (!originAccount || originAccount.balance < amount) {
                    res.status(404).send("0");
                    return;
                }
                originAccount.balance -= amount;
                writeFile(accounts);
                res.status(201).json({ "origin": { "id": originAccount.id, "balance": originAccount.balance } });
                break;
            case 'transfer':
                if (!originAccount || !destAccount || originAccount.balance < amount) {
                    res.status(404).send("0");
                    return;
                }
                originAccount.balance -= amount;
                destAccount.balance += amount;
                writeFile(accounts);
                res.status(201).json({"origin": {"id": originAccount.id, "balance": originAccount.balance}, "destination": {"id": destAccount.id, "balance": destAccount.balance}});
                break;
            default:
                res.status(400).send("Invalid transaction type.");
                return;
        }
    });
}

function writeFile(account) {
    fs.writeFile(dataFilePath, JSON.stringify({ accounts: account }), (err) => {
        if (err) {
            console.error('Erro ao escrever os dados:', err);
            res.status(500).send('Erro ao escrever os dados');
            return;
        }
    });
}