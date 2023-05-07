import express, { Request, Response, response } from "express";
import { RecipeModel } from "../models/Recipes";
import { UserModel } from "../models/Users";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const getAllRecipes = await RecipeModel.find({});
    return res.status(200).json(getAllRecipes);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

router.post("/", verifyToken, async (req: Request, res: Response) => {
  const { name, ingredients, instructions, cookingTime, userOwner } = req.body;
  const recipe = new RecipeModel({
    name,
    ingredients,
    instructions,
    cookingTime,
    userOwner,
  });
  try {
    const createdRecipe = await recipe.save();
    return res.status(200).json(createdRecipe);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

router.put("/", verifyToken, async (req: Request, res: Response) => {
  const { userID, recipeID } = req.body;
  try {
    const recipe = await RecipeModel.findById(recipeID);
    const user = await UserModel.findById(userID);
    user.savedRecipes.push(recipe);
    await user.save();
    return res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    console.error(error);
    res.json(error);
  }
});

router.get("/savedRecipes/ids", async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const user = await UserModel.findById(userId);
    return res.status(200).json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    res.json(error);
  }
});

router.get(
  "/savedRecipes/ids/:userID",
  verifyToken,
  async (req: Request, res: Response) => {
    const { userID } = req.params;

    try {
      const user = await UserModel.findById(userID);
      const savedRecipes = await RecipeModel.find({
        _id: { $in: user.savedRecipes },
      });
      return res.status(200).json({ savedRecipes });
    } catch (error) {
      res.json(error);
    }
  }
);

export { router as recipeRouter };
