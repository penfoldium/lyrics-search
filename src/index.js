const cheerio = require('cheerio');
const fetch = require('node-fetch');

/**
 * @typedef {Object} Response
 * @property {String} lyrics The lyrics
 * @property {String} title The title of the song
 * 
 * @property {Object} primary_artist The primary artist of the song
 * @property {URL} primary_artist.header_image The Genius header image of the artist 
 * @property {Number} primary_artist.id The Genius ID of the artist
 * @property {URL} primary_artist.profile_image The Genius profile image of the artist
 * @property {URL} primary_artist.header_image The Genius header image of the artist
 * @property {Boolean} primary_artist.verified Whether or not the artist is verified on Genius
 * @property {String} primary_artist.name The name of the artist
 * @property {URL} primary_artist.url The Genius profile URL of the artist
 * @property {Number} primary_artist.iq The Genius IQ of the artist 
 * 
 * @property {URL} url The URL to the song on Genius
 * @property {URL} header_image The URL to the header image of the song on Genius
 * 
 * @property {Object} stats
 * @property {Number} stats.unreviewed_annotations
 * @property {Number} stats.concurrents
 * @property {Boolean} stats.hot
 * @property {Number} stats.pageviews
 */

/**
 * @class
 * @author Penfoldium
 */
module.exports = class lyrics_search {

    /**
     * @param {string} token Genius API Access Token
     */
    constructor(token) {
        if (!token) throw new Error('Please provide a Genius Access token!');
        this.token = token;
    };

    /**
     * Get the lyrics of a song
     * @async
     * @param {String} text Song title or some lyrics from it
     * @returns {Promise<Response>} An object containing the lyrics, the title, information about the primary artist, the URL of the song, the image header and stats (All from Genius)
     */
    async search(text) {
        if (!text) throw 'Please provide a song title or some lyrics to search!'
        const query = await this._search(text);
        if (!query[0]) throw 'Nothing found.';
        const result = query[0].result;
        const lyrics = await this._scrape(result.url);
        return { lyrics, title: result.title, primary_artist: { header_image: result.primary_artist.header_image_url, id: result.primary_artist.id, profile_image: result.primary_artist.image_url, verified: result.primary_artist.is_verified, name: result.primary_artist.name, url: result.primary_artist.url, iq: result.primary_artist.iq }, url: result.url, header: result.header_image_url, stats: result.stats };
    }

    /**
     * @private 
     */
    async _search(query) {
        let res = await fetch(`https://api.genius.com/search?q=${query}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        if (res.status !== 200) return;
        res = await res.json();
        return res.response.hits;
    }

    /**
     * @private 
     */
    async _scrape(url) {
        let res = await fetch(url);
        if (res.status !== 200) throw 'Something went wrong';
        res = await res.text();
        const $ = cheerio.load(res);
        return $('.lyrics').text().trim();
    }
}