# 🔍 lyrics-search
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/penfoldium/lyrics-search.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/penfoldium/lyrics-search/context:javascript)

## 🤔 How does it work?
We use the [Genius API](https://genius.com/developers) for the actual search and then we scrape the lyrics from the Genius page of the song, because their API does not return the lyrics.

## 📝 Requirements
- [Node.js](https://nodejs.org/en/)
- NPM (comes with Node.js)

## 💿 Installation
`npm install @penfoldium/lyrics-search`

## 🖊 Usage example
```js
const lyrics_search = require('@penfoldium/lyrics-search');

const Lyrics = new lyrics_search('Genius Access Token');

const sickoMode = `She's in love with who I am
Back in high school, I used to bus it to the dance (Yeah)`; // Because we used backticks we can have new lines between the strings!

Lyrics.search(sickoMode)
    .then(console.log) // Short for .then(result => console.log(result))
    .catch(console.error) // Short for .catch(error => console.error(error))
```