const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;


connectToMongoDB(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

 // Make BASE_URL available in all EJS templates
app.use((req, res, next) => {
  res.locals.BASE_URL = BASE_URL;
  next();
});

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);


// Redirect short links
app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true } // return updated doc
    );

    if (!entry) {
      // If no matching shortId found
      return res.status(404).render("404", {
        message: "This short link does not exist or has expired.",
      });
    }

    return res.redirect(entry.redirectURL);
  } catch (err) {
    console.error("Redirect Error:", err);
    return res.status(500).send("Internal Server Error");
  }
});
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));





