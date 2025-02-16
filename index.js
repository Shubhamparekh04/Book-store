const express = require("express");
const db = require("./configs/database");
const port = 8090;
const app = express();
const bodyParser = require("body-parser");
const bookModel = require("./models/bookStoreSchema");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//  "/" will default open Client home page
app.get("/", (req, res) => {
  // Fetch books from database
  bookModel.find({})
    .then((books) => {
      // Filter books based on bestseller status
      const bestsellerBooks = books.filter(book => book.bestseller === true);
      const popularBooks = books.filter(book => book.bestseller === false);

      // Extract images for slider (only bestsellers)
      const sliderBooks = bestsellerBooks.map(book => book.image);

      res.render("index", { bestsellerBooks, popularBooks, sliderBooks });
    })
    .catch((err) => res.status(500).send("Error fetching books"));
});

//   /login will open Admin login page
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

//  Check "login credential" and redirect to "book form"
app.post("/admin/login", (req, res) => {
  let { username, password } = req.body;

  if (username === "admin" && password === "123") {
    res.redirect("/form");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

// on submit button of "book form " it will send data to database and redirect page to "book form " again
app.post("/create", (req, res) => {
  // Convert checkbox value to Boolean
  req.body.bestseller = req.body.bestseller === "on";

  bookModel
    .create(req.body)
    .then((data) => {
      console.log("Book record Added");
      res.render("form");
    })
    .catch((err) => {
      res.render("form");
      console.log(err.message);
    });
});

// Shows all book in table from database in list page

app.get("/admin/books", (req, res) => {
  bookModel
    .find({})
    .then((books) => {
      return res.render("list", { books });
    })
    .catch((err) => {
      console.log(err.message);
      return res.render("list", { books: [] });
    });
});

// Redirect to Login page after logout

app.get("/logout", (req, res) => {
  res.render("login", { error: null });
});

//Delete book and redirect to list

app.get("/admin/delete/:id", (req, res) => {
  let { id } = req.params;
  bookModel
    .findByIdAndDelete(id)
    .then((data) => {
      res.redirect("/admin/books");
    })
    .catch((err) => {
      console.log(err.message);
      res.redirect("/admin/books");
    });
});

//Fetch edit Book data and fill the data for being edit in EDIT PAGE FORM
app.get("/admin/edit/:id", (req, res) => {
  let { id } = req.params;
  bookModel
    .findById(id)
    .then((book) => {
      return res.render("edit", { book });
    })
    .catch((err) => {
      console.log(err.message);
      return res.render("edit", { book: [] });
    });
});

// replace edited book data with actual one in database

app.post("/update", (req, res) => {
  const { id } = req.body;

  // Convert checkbox value to boolean
  req.body.bestseller = req.body.bestseller === "on";

  bookModel
    .findByIdAndUpdate(id, req.body)
    .then((updatedBook) => {
      console.log("Book Updated");
      res.redirect("/admin/books");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.get("/form", (req, res) => {
  res.render("form");
});

app.get("/allbooks", (req, res) => {
  bookModel
    .find({})
    .then((data) => {
      console.log(data);
      res.render("allbooks", { data });
    })
    .catch((err) => {
      console.log(err.message);
      res.render("allbooks", { data: [] });
    });
});

app.get("/index", (req, res) => {
  
  res.redirect("/");
});

app.listen(port, (err) => {
  if (!err) {
    console.log("server on http://localhost:" + port);
  }
});
