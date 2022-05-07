import express from "express";

const PORT = 4000;

const app = express();

const handleHome = (req, res) => {
		return res.send("<h1>I love middleware..!</h1>");
}

app.get("/", handleHome);

const handleListening = () => console.log(`Server Listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);