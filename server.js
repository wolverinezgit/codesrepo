const express = require("express")
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

const Document = require("./models/Document")
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://tester1:11111@cluster0.vwwze.mongodb.net/?retryWrites=true&w=majority",
  {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})

app.get("/", (req, res) => {
  const code = `Welcome to CodesRepo!

INSTRUCTIONS

1)For creating new code:Click on New button on top right corner


2)For searching previous saved code:
Just use https://codesrepo.herokuapp.com/<yourphonenumber><yourcodeTitle>

`

  res.render("code-display", { code, language: "plaintext" })
})

app.get("/new", (req, res) => {
  res.render("new")
})

app.post("/save", async (req, res) => {
  const value = req.body.value;
  const codeTitles=req.body.codeTitle;
  const phoneNumbers=req.body.phoneNumber;
  const phoneTitles=codeTitles+phoneNumbers;
  
  try { 
    const document = await Document.create({ value:value,codeTitle:codeTitles,phoneTitle:phoneTitles })
    
    res.redirect(`/${document.phoneTitle}`)
  } catch (e) {
    res.render("new", { value })
  }
})

app.get("/:id/duplicate", async (req, res) => {
  const id = req.params.id
  try {
    const document = await Document.findById(id)
    res.render("new", { value: document.value })
  } catch (e) {
    res.redirect(`/${id}`)
  }
})

app.get("/:phoneTitle", async (req, res) => {
  
  const phoneTitles = req.params.phoneTitle;
  
  try {
    const document = await Document.find({phoneTitle:phoneTitles})

    res.render("code-display", { code: document[0].value,id:document[0]._id,})
  } catch (e) {
    res.redirect("/")
  }
})

app.listen(process.env.PORT||3000)
