//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// connect to data base
mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://Nayan40:NyNmandal%402002@cluster0.3eixsdh.mongodb.net/todolistDB", { useNewUrlParser: true }, function (err) {
  if (err) {
    console.log("Error is occuring");
    console.log(err);
  } else {
    console.log("DataBase is created successfully");
  }
});

// Item schema
const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = new mongoose.model("List", listSchema);

const studyListSchema = new mongoose.Schema({
  name: String
});

const Study = mongoose.model("studyList", studyListSchema);


const item1 = new Item({
  name: "Welcome to your todoList!"
});

const item2 = new Item({
  name: "Hit the '+' button to add a new item!"
});

const item3 = new Item({
  name: "<-- Hit this button to delete item!"
});

const defaultItems = [item1, item2, item3];

// inserting many data at time


app.set('view engine', 'ejs');

// print the data

app.get("/", function (req, res) {
  const title = "Today Shedule";
  Item.find({}, function (err, foundItems) {


    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Default data is inserted successfully");
        }
      });

      res.redirect("/");
    } else {
      res.render("list", { listTitle: title, newListItems: foundItems });
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundItems) {
    if (!err) {
      if (!foundItems) {
        console.log("Create a new list!");

        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        console.log("Already exist");

        if (foundItems.items.length === 0) {
          // .insertMany(defaultItems, function (err) {
          // const list = new List({
          //   name: customListName,
          //   items: defaultItems 
          // });
          foundItems.items = defaultItems;
          foundItems.save();
        }
        res.render("list", { listTitle: foundItems.name, newListItems: foundItems.items });
      }
    }
  });

});


app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const itemTitile = req.body.list;

  const newItem = new Item({
    name: itemName
  });

  if (itemTitile == "Today Shedule") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: itemTitile }, function (err, foundList) {
      if (!err) {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/" + itemTitile);
      }
    });
  }
});

app.post("/delete", function (req, res) {
  // console.log(req.body.checkbox);
  const deleteItemId = req.body.checkbox;
  const listTitle = req.body.listTitle;
  console.log(listTitle);

  if (listTitle == "Today Shedule") {
    Item.findByIdAndRemove(deleteItemId, function (err, foundItems) {
      if (!err) {
        console.log("Checked item is deleted from default!");
        res.redirect("/");
      }
    });
  } else {
    // List.findOneUpdate({}, {}, callback)
    List.findOneAndUpdate({ name: listTitle }, { $pull: { items: { _id: deleteItemId } } }, function (err, foundItems) {
      if (!err) {
        console.log("Checked item is deleted!");
        res.redirect("/" + listTitle);
      }
    });
  }

  //   if(Item.findById(deleteItemId) != 0){


  // } else if(Study.findById(deleteItemId) != 0) {
  //   Study.findByIdAndRemove(deleteItemId, function(err){
  //     if(err) {
  //       console.log(err);
  //     } else {
  //       console.log("Checked item is deleted");
  //       res.redirect("/study");
  //     }
  //   })
  // }
});

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

app.get("/about", function (req, res) {
  res.render("about");
});


let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}


app.listen(port, function () {
  console.log("Server has created successfully");
});
