import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();

        this.http.put('https://vinu-angular-recipe-book.firebaseio.com/recipes.json', recipes)
        .subscribe(responseData => {
            console.log(responseData);
        });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>('https://vinu-angular-recipe-book.firebaseio.com/recipes.json')
        .pipe(
            map(
                recipes => {
                    return recipes.map( recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }
            ),
            tap(
                recipes => {
                    this.recipeService.setRecipes(recipes);
                }
            )
        );
    }
}