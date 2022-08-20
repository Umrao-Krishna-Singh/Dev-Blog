// rememeber to remove cors issues.
// requiring various npm modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

// tinymce api key from env file
const tiny = process.env.TINY;

// using express for ejs, bodyParser and for static portions of site. You set view engine so that the ejs files can be displayed and partials can be used.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// connecting a mongodb database. For local mongodb database use mongoose.connect("mongodb://localhost/blogDB")
mongoose.connect(`mongodb+srv://admin-Umrao:hjMHmQVfT7YJHc44@cluster0.6sp92.mongodb.net/blogDB`);





// Creating database to hold home page and all custom pages. First create a schema and declare the key value pairs for the document.
const blogPostsSchema = new mongoose.Schema({
  blogPostTitle: String,
  blogPostBody: String,
  // added the bottom 2 lines after creating schema and making a few documents.
  blogTag: {type: String/*, required: true, default: "other"*/},
  blogDescription: {type: String/*, required: true, default: "Description unavailable, please click the link to read the full article."*/}
},
{timestamps: true}
  // So far the Schema that I have written has had this structure -> mongoose.Schema({key:value}) but now I'm updating this one to be 
  // something like this -> mongoose.Schema({key:value}, {timestamp: true}). Timestamp is called an option in the schema
  // I hope it works. Basically this timestamp thing is available in mongoose so that you can add createdAt and upatedAt fields 
  // with respective date and time as values. All you have to do is just set timestamp to true and mongoose will do the rest. 
  // You can also rename the createdAt and updatedAt fields as you like. I'm going to use createdAt key and value to populate the date
  // at which article was written and then modified.
);
  
// Second create a model using the schema that was just declared. blogPost is the collection name.
const BlogPost = new mongoose.model("blogPost", blogPostsSchema)
// Below is declaring a document for the database.
const homeStartingContent = new BlogPost({
  blogPostTitle: "Home",
  blogPostBody: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});
// The code below was commented out after first use so that the above document doesn't keep adding on to the database again and again.
// BlogPost.create(homeStartingContent);

const newStartingContent = new BlogPost({
  blogPostTitle: "New",
  blogPostBody: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});
// BlogPost.create(newStartingContent);



// I changed the schema after creating a lot of documents and then used the code below to update the documents made previously.
// async function updat(){
//   await BlogPost.updateMany({blogTag: null}, {$set: {blogTag: "other"}});
//   await BlogPost.updateMany({blogDescription: null}, {$set: {blogDescription: "Description unavailable, please click the link to read the full article."}});
// }
// updat();
// Also added timestamps just like this.




// database for about and contact me page
// You can probably have the entire thing work with just one database collection. But to keep the code simple I decided that
// the posts that I'm starting with - which are always going to be there in the blogpost website can just be put into another collection.
const staticPostsSchema = new mongoose.Schema({
  staticPostTitle: String,
  staticPostBody: String
});
const StaticPost = new mongoose.model("staticPost", staticPostsSchema)
const aboutContent = new StaticPost({
  staticPostTitle: "About Us",
  staticPostBody: "Lacus facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});
const contactContent = new StaticPost({
  staticPostTitle: "Contact Us",
  staticPostBody: "Lacus vel volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});
// StaticPost.insertMany([aboutContent, contactContent]);






// get requests to server
app.get("/", function(req, res) {
  BlogPost.find({}, (err, result) => {
    // BLogPost.find is going to find all the elements inside the blogposts collections. But that document is going to be a json object.
    // The callback function here gives back the value of what was found. So the result variable is an array. Basically inside the blogposts collection
    // is a json object which contains all the documents inside an array. These documents themselves are json objects as well.
    if (err) {
      console.log(err)
    } else {
      res.render("home", {
        HC: result[0].blogPostBody,
        homecontent: result,

        // here res.render is being used to render the ejs page with name home.ejs. The second input is a json object. The key that is used
        // in the home.ejs page is given a value here.
        // since initially there were no blog posts composed and the first data entered in the database was the home page content hence it will
        // always be the first item in the array. Hence using the first item in the array to denote as the content for the first blog item.
        // Subsequent blog items will be rendered using a for loop making sure not to use the first result in array again.This for loop will be
        // done in the the home.ejs
      })
    };
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    AC: aboutContent.staticPostBody
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    CC: contactContent.staticPostBody
  });
});


// using the constant tiny to pass into the compose page. This way we don't have to share the api key with the world.
app.get("/compose", function(req, res) {
  res.render("compose",{
    tiny: tiny
  });
});

// update page
app.get("/update", function(req, res) {
  BlogPost.find({}, (err, result) =>{
  if (err) {
    console.log(err)
  } else{
  res.render("update",{
    homecontent: result  
  })
  }});
});



// custom page for every post made on the blog website
app.get("/posts/:post", function(req, res) {
//notice the ":" after /posts/ - that is where a custom filepath starts. Whatever is typed here
// can be collected by the req.params.post to display a custom made web page for any page on the fly. 
// Again if the route was /posts/:blog then to tap into the value of it you would use req.params.blog
  BlogPost.find({}, (err, result) => {
    result.forEach((content) => {
      if (_.lowerCase(req.params.post) === _.lowerCase(content.blogPostTitle)) {
        // using lodash converts whatever is inside the parenthesis into a string with all small letters and no symbols in between (replaced with spaces)
        // Using this if you use your title in any way it won't matter and you will always get a custom page made in right way with right address.
        res.render("post", {
          heading: content.blogPostTitle,
          body: content.blogPostBody,
          date: content.createdAt.toString().substring(4,15),
          tag: content.blogTag
        });
      };
    });
  });
});

// custom page to edit/update posts
app.get("/updates/:edit", function(req,res){
  let locate = req.url; //gives path of the url of the page.
  BlogPost.find({}, (err, result)=>{
    result.forEach((content)=>{
      if(_.lowerCase(req.params.edit)=== _.lowerCase(content.blogPostTitle)){
        res.render("edit",{
          heading: content.blogPostTitle,
          body: content.blogPostBody,
          description: content.blogDescription,
          tag: content.blogTag,
          url: locate.toString()
        })
      }
    })
  })
})











// post requests to server
app.post("/compose", function(req, res) {
  let tagRequest = req.body.postTag;
  let descriptionRequest = req.body.postDescription;
  if (!tagRequest) {
    tagRequest = "other";
  }
  if (!descriptionRequest) {
    descriptionRequest = "Description unavailable, please click the link to read the full article."
  }
  const post = new BlogPost({
    blogPostTitle: req.body.postTitle,
    blogPostBody: req.body.postBody,
    blogTag: tagRequest,
    blogDescription: descriptionRequest
  });
  post.save(function(err) {
    // This is just a different way of creating a document inside the mongodb database. Can be used as an alternative to create method inside mongoose.
    // The error callback is just there to make sure you get redirected to home only if there are no errors.
    if (!err) {
      res.redirect("/");
    }

  });
});

// page to update and edit existing blogposts
app.post("/update", function (req, res) {
  let postUrl = req.body.postPath.substring(9,);
  let urlSpace = "%20";
  let blogSearch = postUrl.replaceAll(urlSpace, ' ' );
  BlogPost.findOneAndUpdate({blogPostTitle: blogSearch}, {
    blogPostTitle: req.body.postTitle,
    blogPostBody: req.body.postBody,
    blogTag: req.body.postTag,
    blogDescription: req.body.postDescription
  },
  (err, result)=>{
    if(err){
      res.redirect("failure", {errorMessage: err})
    } else{
      res.redirect("/")
    }
  }) 
} )

app.post("/delete", function (req,res) {
  let postUrl = req.body.postPath.substring(9,);
  let urlSpace = "%20";
  let blogSearch = postUrl.replaceAll(urlSpace, ' ' );
  BlogPost.deleteOne({blogPostTitle: blogSearch}, (err,result)=>{
    if(err){
      res.redirect("failure", {errorMessage: err})
    } else{
      res.redirect("/update")
    }
  })
})





// setting up the server
app.listen(process.env.PORT || 3000, function() {
  // process.env.PORT is for heroku server
  console.log("Server started");
});

// known bugs - 
// 1. The default values of tag and summary no longer work. The post doesn't submit if I don't enter those fields.
// solved above.
// 2. The publish button does not work if I make the title and body fields as required. But it works if I click the update
// button and come back to the compose page and then again press the publish button. I don't know what's up.