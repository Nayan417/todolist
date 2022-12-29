// use express
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

// console.log(date());
const app = express();

// store the Items
var items = [];
var workItems = [];
var classPredius = [];
var studyList = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "public/"));  // tell the express to serve(use) all the file inside the public location 
app.use(express.static("public"));

app.get("/", function (req, res) {

  //  var dateObj = new Date();

  //  var options = {
  //   weekday: "long",
  //   day: "numeric",
  //   month: "long"
  //  };

  //  var day = dateObj.toLocaleDateString("en-US", options);
  var day = date.getDate();
  res.render("list", { listTitle: day, newItems: items });

});

app.post("/", function (req, res) {
  var data = req.body.newItem;
  var requstTitle = req.body.list;

  if (requstTitle === "Work List") {
    workItems.push(data);
    res.redirect("/work");
  } else if (requstTitle === "College Routine") {
  classPredius.push(data);
  res.redirect("/college");
  } else if(requstTitle === "Time Table"){
    studyList.push(data);
    res.redirect("/study");
  } else {
    items.push(data);
    res.redirect("/");
  }

});

app.get("/work", function (req, res) {
  var title = "Work List";

  res.render("list", { listTitle: title, newItems: workItems });
});

// app.post("/work", function (req, res) {
//   var item = req.body.newItem;
//   // console.log(req.body);
// });

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/college", function(req, res){
  var title = "College Routine";

  res.render("list", {listTitle: title, newItems: classPredius});
});

app.get("/study", function(req, res) {
  var title = "Time Table";

  res.render("list", {listTitle: title, newItems: studyList});
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});