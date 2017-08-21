const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const mustacheExpress = require("mustache-express");
const dal = require("./dal");
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookies!
app.use(
	session({
		secret: "this is cool",
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: null }
	})
);

// Middleware to apply authentication to the cookies
app.use(function(req, res, next) {
	if (req.session.user) {
		req.isAuth = true;
	} else {
		req.isAuth = false;
	}
	console.log(req.isAuth);
	next();
});

app.get("/", (req, res) => {
	if (req.isAuth) {
		console.log(req.session.user);
		res.render("home", { name: req.session.user });
	} else {
		res.redirect("/login");
	}
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", (req, res) => {
	const sesh = req.session;
	console.log(req.body.user_name);
	const foundUser = dal.getByName(req.body.user_name);
	console.log(foundUser);
	if (!foundUser) {
		console.log("iffing");
		res.send("Please enter a valid username");
	} else if (req.body.password === foundUser.password) {
		console.log("If statement");
		req.session.user = { name: foundUser.first_name };
		res.redirect("/");
	} else {
		res.send("Please enter a valid password.");
	}
});

app.get("/logout", (req, res) => {
	req.session.destroy();
	res.redirect("/login");
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
