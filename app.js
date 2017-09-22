var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
var bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/vendors");
app.listen("3000", function() {
    console.log("I'm listening on port 3000.")
});

var vendorSchema = new mongoose.Schema({
    name: String,
    description: String,
    long_description: String,
    image: String,
});
var Vendor = mongoose.model("Vendor", vendorSchema);
app.get("/", function(req, res) {
    Vendor.find({}, function(err, vendors) {
        if(err) {
            console.log("Error: " + err);
        } else {
            res.render("vendors/index", {
                vendors: vendors
            });
        }
    });
});
app.get("/", function(req, res) {
    res.redirect("/vendors");
});
app.get("/vendors", function(req, res) {
    Vendor.find({}, function(err, vendors) {
        if(err) {
            console.log(err);
        } else {
            res.render("vendors/index", {
                vendors: vendors
            });
        }
    })
});
app.get("/vendors/new", function(req, res) {
    res.render("vendors/new.ejs");
});
app.post("/vendors", function(req, res) {
    var new_name = req.body.vendor_name;
    var new_description = req.body.vendor_description;
    var new_long_description = req.body.long_description;
    var new_image = req.body.vendor_image;
    var new_vendors = {
        name: new_name,
        description: new_description,
        long_description: new_long_description,
        image: new_image
    };
    const v = new Vendor(new_vendors);
    v.save();
    res.redirect("/");
});