const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose
  .connect("mongodb+srv://aryan:aryan@cluster0.gbobx.mongodb.net/todolist", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connection successfull..."))
  .catch((err) => console.log(err));

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Be Happy",
});


const defaultItems = [item1];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully saved");
        }
      });
      res.redirect("/");
    } else {
      let day = date();
      res.render("list", {
        kindOfDay: day,
        newListItem: foundItems,
      });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item ({
    name: itemName,
  })
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
   const checkedItemId = req.body.checkbox;
   Item.findByIdAndRemove(checkedItemId, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("successfully saved");
    }
   })
   res.redirect("/");
});

app.listen(3000, function (req, res) {
  console.log("server started");
});
