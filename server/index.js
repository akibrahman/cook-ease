const express = require("express");
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(
  cors({
    origin: true,
    // ["",""]
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());

//! Creating MongoDB Environment
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@generalcluster.3vac2.mongodb.net/?retryWrites=true&w=majority&appName=GeneralCluster`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//! Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req?.cookies?.MealMaster_Token;
  if (!token) {
    return res.status(401).send({ success: false, message: "Unauthorized" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }
    req.data = decoded;
    next();
  });
};

//!First Responce
app.get("/", (req, res) => {
  res.send("CookEase is Running");
});

//! All Methodes of Cook Ease
async function run() {
  try {
    //! Collections
    const usersCollection = client.db("meal-akib").collection("AllUsers");
    const allMealsCollection = client.db("meal-akib").collection("AllMeals");

    //! Token Generator
    app.post("/create-jwt", async (req, res) => {
      const user = await req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res
        .cookie("MealMaster_Token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .send({ success: true });
    });

    //!Token Remove
    app.post("/remove-jwt", async (req, res) => {
      res
        .clearCookie("MealMaster_Token", { maxAge: 0 })
        .send({ success: true });
    });

    //! Get User
    app.get("/get-user", verifyToken, async (req, res) => {
      const email = req.query.email;
      const user = await usersCollection.findOne({ email });
      res.send(user);
    });

    //! Get Meal
    app.get("/get-meal", verifyToken, async (req, res) => {
      const userId = req.query.userId;
      const day = req.query.day;
      const meal = req.query.meal;
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user)
        return res.json({
          success: false,
          msg: "Wrong UserId",
        });
      const dbMeal = await allMealsCollection.findOne({
        day,
        meal,
        userId: new ObjectId(userId),
      });
      if (!dbMeal)
        return res.json({
          success: false,
          msg: "No Meal Found",
        });

      const response = await fetch(
        `https://api.spoonacular.com/food/menuItems/${dbMeal.mealId}?apiKey=${process.env.SPOONACULAR_API_KEY}`
      );
      const data = await response.json();
      console.log("___>", data);
      console.log("___>", dbMeal.mealId);
      return res.json({
        success: true,
        name: data?.title,
        image: data?.image,
        mealId: dbMeal.mealId,
      });
    });

    //! Add Meal
    app.post("/add-meal", verifyToken, async (req, res) => {
      try {
        const { userId, day, meal, mealId } = req.body;
        if (!userId || !day || !meal || !mealId) {
          return res.json({
            success: false,
            msg: "Missing required parameters",
          });
        }
        const user = await usersCollection.findOne({
          _id: new ObjectId(userId),
        });
        if (!user) {
          return res.json({
            success: false,
            msg: "Invalid User ID",
          });
        }
        const newMeal = {
          userId: new ObjectId(userId),
          day,
          meal,
          mealId,
          createdAt: new Date(),
        };

        const result = await allMealsCollection.insertOne(newMeal);
        if (result.acknowledged) {
          return res.json({
            success: true,
            msg: "Meal added successfully",
            meal: newMeal,
          });
        } else {
          return res.json({
            success: false,
            msg: "Failed to add meal",
          });
        }
      } catch (error) {
        console.error("Error adding meal:", error);
        res.status(500).json({
          success: false,
          msg: "Internal server error",
        });
      }
    });

    //! Remove Meal
    app.post("/remove-meal", verifyToken, async (req, res) => {
      try {
        const { userId, day, meal, mealId } = req.body;
        if (!userId || !day || !meal || !mealId) {
          return res.json({
            success: false,
            msg: "Missing required parameters",
          });
        }
        const user = await usersCollection.findOne({
          _id: new ObjectId(userId),
        });
        if (!user) {
          return res.json({
            success: false,
            msg: "Invalid User ID",
          });
        }
        const toDeleteMeal = await allMealsCollection.deleteOne({
          userId: new ObjectId(userId),
          day,
          meal,
          mealId: parseInt(mealId),
        });
        if (!toDeleteMeal) {
          return res.json({
            success: false,
            msg: "Invalid Meal ID",
          });
        }
        if (toDeleteMeal.acknowledged) {
          return res.json({
            success: true,
            msg: "Meal Removed successfully",
          });
        } else {
          return res.json({
            success: false,
            msg: "Failed to remove meal",
          });
        }
      } catch (error) {
        console.error("Error Removing meal:", error);
        res.status(500).json({
          success: false,
          msg: "Internal server error",
        });
      }
    });

    //! Get Meal From Selected Meal
    app.post("/get-meal-from-chart", verifyToken, async (req, res) => {
      try {
        const { searchQuery } = req.body;
        const email = req.data.email;
        const user = await usersCollection.findOne({ email });
        if (!user) throw new Error("Unauthorized || E-mail Invalid From Token");
        const addedItems = await allMealsCollection
          .find({ userId: new ObjectId(user._id) })
          .toArray();
        const detailedItems = await Promise.all(
          addedItems.map(async (item) => {
            const apiUrl = `https://api.spoonacular.com/food/menuItems/${item.mealId}?apiKey=${process.env.SPOONACULAR_API_KEY}`;
            try {
              const response = await axios.get(apiUrl);
              const { title, image } = response.data;
              return {
                mealId: item.mealId,
                title,
                image,
              };
            } catch (apiError) {
              console.error(
                `Error fetching details for mealId ${item.mealId}:`,
                apiError.message
              );
              return null;
            }
          })
        );
        const filteredItems = detailedItems.filter((item) => item !== null);
        const escapeRegex = (query) =>
          query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        const regex = searchQuery
          ? new RegExp(escapeRegex(searchQuery), "i")
          : null;
        const finalFilteredItems = regex
          ? filteredItems.filter((item) => regex.test(item.title))
          : filteredItems;
        res.json({
          success: true,
          items: finalFilteredItems,
          msg: "Items Retrieved",
        });
      } catch (error) {
        console.error("Error From '/get-meal-from-chart':", error);
        res.status(500).json({
          success: false,
          msg: error.message || "Internal server error",
        });
      }
    });

    //! Save or modify user email, status in DB
    app.put("/all-users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const isExist = await usersCollection.findOne(query);
      console.log("User found?----->", isExist);
      if (isExist) {
        await usersCollection.updateOne(
          query,
          {
            $set: { name: user.name, photo: user.photo },
          },
          options
        );
        return res.send(isExist);
      }
      const result = await usersCollection.updateOne(
        query,
        {
          $set: { ...user, timestamp: Date.now() },
        },
        options
      );
      res.send(result);
    });

    //! Get one user - User
    app.get("/my-profile", verifyToken, async (req, res) => {
      const email = req.query.email;
      const user = await usersCollection.findOne({ email });
      res.send(user);
    });

    //! Update User's Profile
    app.patch("/update-my-profile/:email", async (req, res) => {
      const email = req.params.email;
      const data = await req.body;
      const result = await usersCollection.updateOne(
        { email },
        { $set: { about: data } }
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

//! App listener
app.listen(port, () => {
  console.log(`CookEase is running on port: ${port}`);
});
