import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', ev => {
      const btn = ev.target.closest('.btn--inline');
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }
  _generateMarkup() {
    const curPage = this._data.currentPage;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // in first page , there is other page
    if (curPage === 1 && 1 < numPages) {
      return this.nextPageButton(curPage);
    }
    // in last page
    if (curPage === numPages && numPages > 1) {
      return this.previousPageButton(curPage);
    }
    // in page between first and last
    if (curPage > 1 && curPage < numPages) {
      return this.previousPageButton(curPage) + this.nextPageButton(curPage);
    }
    // in first page , there is no other pages
    return '';
  }
  nextPageButton(curPage) {
    return `
    <button class="btn--inline pagination__btn--next" data-goto='${
      curPage + 1
    }'>
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>`;
  }
  previousPageButton(curPage) {
    return `<button class="btn--inline pagination__btn--prev" data-goto='${
      curPage + 1
    }'>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>`;
  }
}

export default new PaginationView();
