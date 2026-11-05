require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

console.log("Starting server...");

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

server.on("close", () => {
  console.log("Server has been closed.");
});

server.on("error", (error) => {
  console.error("Server error:", error);
});