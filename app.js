const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));
//connection of database
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//Route method
//get,post and delete methods
app
  .route("/articles")
  .get(async function (req, res) {
    try {
      const articles = await Article.find({});
      console.log(articles);
      res.send(articles);
    } catch (err) {
      console.log(err);
    }
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save();
  })
  .delete(async function (req, res) {
    try {
      const deleteArticles = await Article.deleteMany({});
      res.send(deleteArticles);
    } catch (err) {
      res.send(err);
    }
  });
//Get A specific article

app
  .route("/articles/:articleTitle")
  .get(async function (req, res) {
    const specificArticles = await Article.findOne({
      title: req.params.articleTitle,
    });
    res.send(specificArticles);
  })
  .put(async function (req, res) {
    const articleUpdate = await Article.findOneAndUpdate(
      {
        title: req.params.articleTitle,
      },
      { title: req.body.title, content: req.body.content }
    );
    if (articleUpdate) {
      res.send("Update successfull");
    }
  })
  .patch(async function (req, res) {
    const pathRequest = await Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body }
    );
    console.log(pathRequest);
    res.send(pathRequest);
  })
  .delete(async function (req, res) {
    const deleteArticle = await Article.deleteOne({
      title: req.params.articleTitle,
    });
    if (deleteArticle.err) {
      console.log("Error");
    } else {
      res.send("Delete the article");
    }
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
