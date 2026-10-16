# Personal-Website

Static site for [lansonvandyke.com](https://lansonvandyke.com), served by GitHub Pages. No build step:
edit the HTML and push.

- `assets/css/site.css` – all styles. Colours, fonts and spacing are tokens at the top (light + dark).
- `assets/js/site.js` – theme toggle, mobile menu, click-to-play videos, blog tag filter + search, post prev/next.

## Adding a blog post

1. Copy `blog/template.html` to `blog/your-post-slug.html` and follow the checklist at the top of it.
2. Add a card for the post at the **top** of `#post-list` in `blog/index.html` (copy an existing card).
3. Optionally swap it into the three "Latest writing" cards on `index.html`.

## Tags

Tags are the `<a class="tag">` chips on each card in `blog/index.html`. The tag filter bar, its counts,
search, and the previous/next links on posts are all built from those cards, so there is no separate
tag list to maintain. Link to a tag with `blog/index.html?tag=meal-prep` (lowercase, spaces → dashes),
and use the same tag names on the post page as on its card.
