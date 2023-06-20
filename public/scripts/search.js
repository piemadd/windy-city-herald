const searchBox = document.getElementById('search');
const articlesHolder = document.getElementsByClassName('articles')[0];
const existingArticles = Array.from(articlesHolder.children).map((article) => article.cloneNode(true));

let globalDebounceTimout = 2;

const debounce = ((func) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, globalDebounceTimout);
  };
});

const searchOptions = {
  includeScore: true,
  keys: [
    'meta.title',
    'meta.section',
    'meta.tags',
    'meta.exerpt',
    'meta.author.name',
    'meta.author.slug'
  ]
}

const fuse = new Fuse(articles, searchOptions);

function processSearch() {

  const initial = Date.now();
  const searchResults = searchBox.value == '' ? articles.map((article, i) => {
    return {
      item: article,
      refIndex: i
    }
  }) : fuse.search(searchBox.value);
  console.log(searchResults);
  console.log(existingArticles)

  const searchTotalTime = Date.now() - initial;
  globalDebounceTimout = searchTotalTime * 2;

  console.log('Search took', searchTotalTime, 'ms');

  const newArticles = document.createDocumentFragment();

  searchResults.forEach((result) => {
    newArticles.appendChild(existingArticles[result.refIndex].cloneNode(true));
  })

  articlesHolder.innerHTML = null;
  articlesHolder.appendChild(newArticles);

  if (searchResults.length == 0) {
    articlesHolder.innerHTML = '<p style="font-size: 1.6rem; text-align: center; margin-bottom: 12px;">No results found 😔</p>';
  }
}

const processChange = debounce(() => processSearch());

searchBox.addEventListener('keyup', debounce(() => processSearch()));