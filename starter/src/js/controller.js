import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import { updateServings } from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  // 1 Loading Recipe
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // update results viewView to mark selected result
    resultsView.update(model.getSearchResultsPage())

    // 1 Loading Recipe
    await model.loadRecipe(id);

    // 2 Rendering Recipe
    recipeView.render(model.state.recipe);
    
  } catch (err) {
    recipeView.renderError();
    
    
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);


    resultsView.render(model.getSearchResultsPage());
    // render initial pagination buttons
    paginationView.render(model.state.search);
    
  } catch (err) {}
};

const controlPagination = function(goToPage){
  // render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // render new pagination buttons
  paginationView.render(model.state.search);
  console.log(goToPage);
 
}
const controlServings = function(newServings){
  // Update the recipe servings (in the state)

    model.updateServings(newServings)

  // update recipe view 
  // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);

}
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
 
};
init();
