import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import addRecipeView from './views/addRecipeView.js';

async function controlRecipe() {
  try {
    // get id from URL
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Render Spinner
    recipeView.renderSpinner();
    // Get The Recipe in Model
    await model.loadRecipe(id);
    // Render The Recipe
    recipeView.render(model.state.recipe);
    // update Results View to mark currnt recipe as active
    resultsView.update(model.getSearchResultsPage());
    // Update Bookmarks View
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results in Model
    await model.loadSearchResults(query);

    // Render Search Results
    resultsView.render(model.getSearchResultsPage());
    // Render Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
function controlPagination(goto) {
  // Render Search Results
  resultsView.render(model.getSearchResultsPage(goto));
  // Render Pagination
  paginationView.render(model.state.search);
}
function controlUpdateServings(newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Render Bookmarks List
  bookmarksView.render(model.state.bookmarks);

  // Update recipe view
  recipeView.update(model.state.recipe);
};
// To Render Bookmarks When Page loads
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Update Bookmarks View to show active Recipe
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

function init() {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlUpdateServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
