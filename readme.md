# Windy City Herald

This is the source code for the Windy City Herald, a satirical newspaper based
out of Chicago. It uses ejs to render the pages from an express server during development and generates a static site for production. I could have used something like Next, Gatsby, or Vite to pull this off, but for this project I wanted to return to my roots of Node + ejs.

## Production

To generate the static site, run `npm run build`. The static site will be generated in the `dist` folder.

## Development

I scrapped the proper dev server. Just like rerun `npm run build` after every change to check ur work ig. `npm run serve` will serve the exported site at port `3000`

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
- `image`: The image for the article. This is the path to the image, relative to the `public` folder. If no image is provided, the default image will be used.
- `imageAlt`: The alt text for the image. This is used for SEO and accessibility.
- `imageCredit`: The credit for the image.

## Writing

Ok so this is complicated, and I absolutely don't blame you if you get lost. As long as you get an article markdown file submitted, I can help out in the pr with the other requirements. Basically, what you need is 4 things:
 - a markdown file with the article content (in the `articles` folder)
 - a cover image (in the `public/images/articles/[article]` folder)
 - an author file (in the `meta/authors` folder)
 - an author image (in the `public/images/authors` folder)
To figure out how each file functions, you *should* be able to look at the existing files and figure it out. If you can't, I'm sorry, but I cannot be assed to make anything in this repository make sense. The best we can do is kinda sorta know how to do things and pray to any higher being that everything works. If you have any questions, feel free to open an issue, email me (piero@piemadd.com), or DM me on discord (piemadd).