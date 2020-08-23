import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import {  ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();
    
    private recipes: Recipe[] = [
        new Recipe('Meat Tandoor', 
                    'This is the description area 1', 
                    "https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg",
                    [
                        new Ingredient('Meat', 1),
                        new Ingredient('Leamon', 1)
                    ]
        ),
        new Recipe('This is the 2nd Recipe',
                    'This is the description area 2', 
                    "https://p0.pikist.com/photos/108/898/recipe-dish-lunch-nutrition-food-home-vegetarian-italian-kitchen.jpg",
                    [
                        new Ingredient('Leamon', 2),
                        new Ingredient('Vegies', 4),
                        new Ingredient('Fruit', 1)
                    ]
        )
      ];

      constructor(private slService: ShoppingListService) {}

      getRecipes() {
          return this.recipes.slice();
      }

      getRecipe(index: number) {
          return this.recipes[index];
      }

      addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
      }

      addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      }

      deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
      }
}