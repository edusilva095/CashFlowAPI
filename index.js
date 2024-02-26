const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const fs = require("fs");
const routes = require("./routes/routes");

app.use(express.json());

app.use((req, res, next) => {
    next();
});

routes(app);

app.get("/", (req, res) => {
    res.json({ message: "API is running!" });
})

app.listen(port, () => {
    console.log("API is running!");
})