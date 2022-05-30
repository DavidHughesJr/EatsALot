import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON } from './helpers.js';
import { RESULTS_PER_PAGE } from './config.js';
import { PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: PAGE,
  },
};

export const loadRecipe = async id => {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    // error message
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - PAGE) * RESULTS_PER_PAGE;
  const end = page * RESULTS_PER_PAGE;
  return state.search.results.slice(start, end);
};
export const updateServings = function(newServings){
    state.recipe.ingredients.forEach(ings => {
        ings.quantity = (ings.quantity * newServings) / state.recipe.servings 
        // newQT = oldQT * newSerings / oldServings 2 * 8 / 4

    });
    state.recipe.servings = newServings; 
}