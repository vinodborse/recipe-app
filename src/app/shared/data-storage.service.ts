import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();

        this.http.put('https://vinu-angular-recipe-book.firebaseio.com/recipes.json', recipes)
        .subscribe(responseData => {
            console.log(responseData);
        });
    }

    fetchRecipes() {
        this.http.get<Recipe[]>('https://vinu-angular-recipe-book.firebaseio.com/recipes.json')
        .subscribe(
            recivedData => {
                this.recipeService.setRecipes(recivedData);
            }
        );
    }
}