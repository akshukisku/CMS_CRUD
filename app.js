const express = require("express");
const path = require("path");

const categoryApiRoutes = require("./src/routes/api/category.route");
const contentApiRoutes = require("./src/routes/api/content.route");
const categoryWebRoutes = require("./src/routes/web/category.route");
const contentWebRoutes = require("./src/routes/web/content.route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));


// REST API routes for Postman
app.use("/v1/category", categoryApiRoutes);
app.use("/v1/content", contentApiRoutes);

// EJS page routes
app.use("/category", categoryWebRoutes);
app.use("/content", contentWebRoutes);


module.exports = app;
