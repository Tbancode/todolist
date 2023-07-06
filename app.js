// const fs = require('fs');
// fs.copyFileSync("date.js","copy.js")

var express = require("express")
var bodyParser = require("body-parser")
const mongoose = require("mongoose")
const _ = require("lodash")
var date = require(__dirname + "/date.js")
var app = express()

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));


mongoose.set('strictQuery', true);

mongoose.connect('mongodb+srv://admin_tee:'+ encodeURIComponent("Olayinka0#") + '@cluster0.scztndw.mongodb.net/todolistDB'
, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const itemsSchema = {
  name: String
};

const Item = new mongoose.model("Item", itemsSchema);

const item1 = Item({
  name: "Office"
});

const item2 = Item({
  name: "Cofferrence"
});

const item3 = Item({
  name: "Cafeteria"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = new mongoose.model("List", listSchema);
const day = date.tod();
app.get("/", function(req, res){


Item.find({})
    .then(function(results){
      if(results.length === 0){
        Item.insertMany(defaultItems)
              .then(function () {
                console.log("Successfully saved defult items to DB");
              })
              .catch(function (err) {
                console.log(err);
              });
        res.redirect("/")
      }else{
        res.render("list", {TodayOf:day,
        next:results }); }
});

});

app.post("/", function(req, res){
  const itemName = req.body.newItems
  const listbutton = req.body.button;

  const item = Item ({
    name: itemName
  });
  if(listbutton === day){
    item.save()
    res.redirect("/")
  }else{
    List.findOne({name: listbutton})
          .then(function(lists){
        lists.items.push(item);
        lists.save();
        res.redirect("/" + listbutton);
        })
  };
});

app.post("/delete", function(req, res){
  const findId = req.body.checkbox;
  const hiddenInput = req.body.hiddenInput;
  if(hiddenInput === day){
    Item.findByIdAndRemove(findId)
         .then(function(err){
          if(!err){
           console.log("Succesfully Deleted")}
         });res.redirect("/")
  }else {
    List.findOneAndUpdate({name: hiddenInput}, {$pull: {items: {_id: findId}}})
        .then(function(err){
          if(!err){
            console.log("Succesfully Deleted");
          }
          res.redirect("/" + hiddenInput)
        });
  };
  });



app.get("/:listName", function(req, res){
  const param = _.capitalize(req.params.listName);
  List.findOne({name: param})
      .then(function(foundList){
         if (!foundList){
           const list = List ({
             name: param,
             items: defaultItems
           });
            list.save();
            res.redirect("/" + param)
         }else{
           res.render("list", {TodayOf: foundList.name,
           next: foundList.items });
         }
       });
     });





app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000")
});
