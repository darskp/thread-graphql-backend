import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 8000

app.get('/', (req, res) => {
    res.json({ messsage: "Fetched Successfully" })
})

app.listen(PORT, 'localhost', () => {
    console.log(`listening at the server - http://localhost:${PORT}`);
})