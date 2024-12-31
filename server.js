const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Post = require("./models/PostModel");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(process.env.uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/add", async (req, res) => {
  const { title, date, description, category } = req.body;

  if (!title || !date || !description || !category) {
    return res.status(400).json({ message: "All fields are required."});
  }

  try {
    const newPost = new Post({ title, date, description, category });
    await newPost.save();
    res.status(201).json({ message: "Post created successfully!",data:newPost});
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/get", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.put("/update/:category", async (req, res) => {
  try {
    const { category } = req.params; 
    const updatedData = req.body; 
    const update = await Post.findOneAndUpdate({ category }, updatedData, { new: true });

    if (!update) {
      return res.status(404).json({ message: "No post found with the given category" });
    }

    res.status(200).json({ message: "Post updated successfully", data: update });
  } catch (err) {
    console.error("Error Updating Data", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.delete("/delete/:category",async (req,res) =>{
  try {
    const {category} =req.params;
    const del=await Post.findOneAndDelete({category});
  
    if(!del){
      res.status(404).json({message:"No post found with given category"});
    }
    res.status(200).json({message:"Post deleted successfully"});
  } catch (error) {
    console.error("Error Deleting the data",err);
    res.status(500).json({message:"Internal server error."});  
  }
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
