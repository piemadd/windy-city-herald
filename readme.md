# Windy City Herald

This is the source code for the Windy City Herald, a satirical newspaper based
out of Chicago. It uses ejs to render the pages from an express server during development and generates a static site for production. I could have used something like Next, Gatsby, or Vite to pull this off, but for this project I wanted to return to my roots of Node + ejs.

## Development

To develop, run `npm run dev` and navigate to `localhost:3000`.

## Production

To generate the static site, run `npm run build`. The static site will be generated in the `dist` folder.

## Grey Matter

At the top of every article is "grey matter," metadata relating to an article. Here are the different values and what they mean:

- `title`: The title of the article
- `created`: The date the article was created
- `author`: The author of the article (this is the username, author information is stored in `meta/authors/[author].json`)
- `section`: The section of the article. Possible values:
  - `business`
  - `entertainment`
  - `politics`
  - `sports`
  - `opinion`
  - `suburbs`
  - `weather`
  - `updates`
- `tags`: An array of tags for the article. There are no restrictions on what these can be, they just have to be relavent to the article as they are used for SEO and site search functionality.
- `image`: The image for the article. This is the path to the image, relative to the `public/images/articles` folder. If no image is provided, the default image will be used.
- `imageAlt`: The alt text for the image. This is used for SEO and accessibility.
- `imageCredit`: The credit for the image.

## Writing

This site uses markdown for its articles with the parser being `marked`. If there are any issues rendering, open an issue and I'll look into it. You can get started by copying `example.md` into the `articles` folder.