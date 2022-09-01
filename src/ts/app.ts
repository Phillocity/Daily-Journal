import express, { Request, Response } from "express";
import { fileURLToPath } from "url";
import { dirname, join as pathJoin } from "path";
import bodyParser from "body-parser";
import lodash from "lodash";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);
const database: string = "journalDB";

await mongoose
  .connect(
    `mongodb+srv://shushyy:${process.env.MONGO}@cluster0.szrpyuj.mongodb.net/${database}`
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const app: express.Application = express();
const port: any = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.listen(port);
app.locals.lodash = lodash;

const articleSchema = new mongoose.Schema({
  title: {
    require: true,
    type: String,
  },
  body: String,
});

const Article = mongoose.model("Article", articleSchema);

const homeStartingContent: String =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent: String =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent: String =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/", (req: Request, res: Response) => {
  Article.find({}, (err: any, foundArticles: any) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        homeContent: homeStartingContent,
        posts: foundArticles,
      });
    }
  });
});

app.get("/about", (req: Request, res: Response) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req: Request, res: Response) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req: Request, res: Response) => {
  res.render("compose");
});

app.post("/compose", (req: Request, res: Response) => {
  const post = new Article({
    title: lodash.kebabCase(req.body.postTitle),
    body: req.body.postBody,
  });
  post.save().then(() => res.redirect("/"));
});

app.get("/posts/:postID", (req: Request, res: Response) => {
  const requestedPost = req.params.postID;

  Article.findOne({ title: requestedPost }).then((post: any) => {
    res.render("post", { postData: { title: post.title, body: post.body } });
  });
});
