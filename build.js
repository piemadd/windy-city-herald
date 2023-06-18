const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');
const { mangle } = require('marked-mangle')
const DOMPurify = require('isomorphic-dompurify');
const ejs = require('ejs');

marked.use(mangle());

const titleCase = (str) => {
  return str.toLowerCase().split(' ').map(function (word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
};

const getAuthor = (username) => {
  const author = JSON.parse(fs.readFileSync(path.join(__dirname, 'meta', 'authors', `${username}.json`), 'utf-8'));
  return author;
};

const getSingleArticle = (file) => {
  console.log("Reading file:", file)
  const filePath = path.join(__dirname, 'articles', file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const fileMatter = matter(fileContent);
  const fileHtml = marked.parse(fileMatter.content, {
    headerIds: false,
  });
  //const cleanedHtml = DOMPurify.sanitize(fileHtml);
  //i'll just manually review shit ig
  const cleanedHtml = fileHtml;

  fileMatter.data.title = titleCase(fileMatter.data.title);
  fileMatter.data.section = titleCase(fileMatter.data.section);
  fileMatter.data.tags = fileMatter.data.tags.map(tag => titleCase(tag));

  if (fileMatter.data.image == '' || fileMatter.data.image == null) {
    fileMatter.data.image = "/images/articles/default/cover.jpg";
    fileMatter.data.imageAlt = "The Sears tower during a sunset";
    fileMatter.data.imageCredit = "Photo by Piero Maddaleni"
  }

  if (fileMatter.data.author == '' || fileMatter.data.author == null) {
    fileMatter.data.author = "default";
  };

  return {
    meta: fileMatter.data,
    html: cleanedHtml,
    slug: file.replace('.md', ''),
    author: getAuthor(fileMatter.data.author),
  }
}

//remove old dist if it exists
if (fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.rmSync(path.join(__dirname, 'dist'), { recursive: true });
}

//create new dist
fs.mkdirSync(path.join(__dirname, 'dist'));

const getAllArticles = () => {
  const articleFiles = fs.readdirSync(path.join(__dirname, 'articles'));
  const articles = articleFiles.map(file => {
    return getSingleArticle(file);
  }).filter(article => {
    if (article.meta.created !== null && article.meta.created !== '') {
      return true;
    }

    return false;
  }).sort((a, b) => {
    return new Date(b.meta.created) - new Date(a.meta.created);
  });

  return articles;
}

// site index
ejs.renderFile(path.join(__dirname, 'src', 'pages', 'index.ejs'), { articles: getAllArticles() }, { root: path.join(__dirname, 'src', 'pages') })
  .then((html) => {
    fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), html);
  });

// site search
ejs.renderFile(path.join(__dirname, 'src', 'pages', 'search.ejs'), { articles: getAllArticles() }, { root: path.join(__dirname, 'src', 'pages') })
  .then((html) => {
    fs.mkdirSync(path.join(__dirname, 'dist', 'search'), { recursive: true });
    fs.writeFileSync(path.join(__dirname, 'dist', 'search', 'index.html'), html);
  });

// categories
const categories = ['business', 'entertainment', 'politics', 'sports', 'opinion', 'suburbs', 'weather', 'updates'];
categories.forEach(category => {
  ejs.renderFile(path.join(__dirname, 'src', 'pages', 'index.ejs'), { //trying out replacing categroy with index
    articles: getAllArticles().filter((article) => {
      return article.meta.section.toLowerCase() === category.toLowerCase();
    }), category
  }, { root: path.join(__dirname, 'src', 'pages') })
    .then((html) => {
      fs.mkdirSync(path.join(__dirname, 'dist', 'categories', category), { recursive: true });
      fs.writeFileSync(path.join(__dirname, 'dist', 'categories', category, 'index.html'), html);
    });
});

// articles
getAllArticles().forEach(article => {
  //console.log(article)
  ejs.renderFile(path.join(__dirname, 'src', 'pages', 'article.ejs'), { article }, { root: path.join(__dirname, 'src', 'pages') })
    .then((html) => {
      fs.mkdirSync(path.join(__dirname, 'dist', 'articles', article.slug), { recursive: true });
      fs.writeFileSync(path.join(__dirname, 'dist', 'articles', article.slug, 'index.html'), html);
    });
});

// copying static files
fs.cpSync(path.join(__dirname, 'public'), path.join(__dirname, 'dist'), { recursive: true });