redditp
=======

A full screen reddit presentation or slide show, as a **browser extension**.

Like [the original redditp](https://github.com/ubershmekel/redditp), redditp is
now a browser extension: Reddit blocks its API for third-party websites (even
with OAuth), so a hosted redditp page can no longer load anything. The
extension reads `www.reddit.com/*.json` with your own reddit.com session
instead, so **you must be logged in on reddit.com** in the same browser.

This fork keeps the features of [utopiabound's redditp](https://github.com/utopiabound/redditp)
(albums, galleries, videos, swipe navigation, duplicates, many supported sites)
and packages them as a Manifest V3 extension for Chromium browsers (Chrome,
Brave, Edge, ...) and Firefox.

Install
-------

Downloads are in the
[latest release](https://github.com/kenny665/redditp/releases/latest).

### Chrome, Brave, Edge

1. Download `redditp-chromium-*.zip` and unzip it.
2. Open `chrome://extensions` (or `brave://extensions`, `edge://extensions`),
   enable **Developer mode**, click **Load unpacked** and pick the unzipped
   folder.

The extension stays installed across browser restarts, as long as:

* the unzipped folder stays where it is (the browser runs it from there, so
  don't leave it in Downloads);
* Developer mode stays on. If the browser suggests disabling developer mode
  extensions at startup, dismiss it.

To update: replace the folder's contents with the new zip, then click the
reload icon of redditp in `chrome://extensions`. Settings are kept.

### Firefox

* Signed `redditp-firefox-*.xpi` (when the release has one): open it with
  Firefox, or `about:addons` → gear → **Install Add-on From File**. It stays
  installed; install a newer `.xpi` the same way to update.
* Otherwise download `redditp-firefox-*.zip`, open `about:debugging#/runtime/this-firefox`,
  click **Load Temporary Add-on** and pick the zip. Firefox removes temporary
  add-ons when it restarts: release Firefox only installs signed add-ons
  permanently.

### Usage

On any Reddit page, click the redditp toolbar button or press
**Alt+Shift+P**: the same subreddit opens in redditp in a new tab.

The extension asks for access to all sites: JSONP is impossible under
Manifest V3, so the other supported sites (imgur, tumblr, flickr, ...) are
fetched as plain JSON, which needs host permissions to bypass CORS.

Redgifs embeds remember your last sound on/off choice and volume.

Build from source
-----------------

1. `npm run ext:build` writes `build/extension/` (Chromium) and
   `build/firefox-extension/` (Firefox: same files, manifest adapted).
2. Load the folder as an unpacked or temporary extension (see above).
3. After changing the sources, rebuild and click the reload icon of the
   extension.
4. `npm install` then `npm run ext:lint:firefox` checks the Firefox build
   with Mozilla's add-on linter (`web-ext lint`). The 3 jQuery `innerHTML`
   warnings are expected.
5. Firefox signing (unlisted, nothing is published on addons.mozilla.org):
   create an API key at <https://addons.mozilla.org/developers/addon/api/key/>,
   set `WEB_EXT_API_KEY` and `WEB_EXT_API_SECRET`, bump `version` in
   `browser-extension/manifest.json` (a version can only be signed once), then
   `npm run ext:sign:firefox`. The signed `.xpi` lands in `build/`.

The extension page is the web app itself (`index.html`, `js/`, `css/`,
`images/`); `browser-extension/` holds the manifest, the background script
and the build script.

Hotkeys
-------

* space - toggles auto-next (play/pause)
* t - collapse/uncollapse title
* c - collapse/uncollapse controls
* i - open image in a new tab
* o - open comments in a new tab
* d - open duplicates in a new tab
* u - hide/show duplicates box
* f - toggle full screen mode
* m - unmute/mute videos
* n - toggle nsfw
* s - load images from comments
* Arrow keys, pgup/pgdown change slides
    * Up/Down, page-up / page-down - switch Albums
    * left/right - switch pictures within albums (and also to next/previous album)
* Swipe gestures on touch interfaces (same as arrow keys)
* ? - Help popups
* v - Information popup
* enter - play embedded

Features
--------

* All /r/ subreddits, including different sortings.
* Support for /r/random, /r/randnsfw, /r/popular virtual subreddits
* /user/ , /domain/ , /me/ url's work.
* Url's ending with ['.jpg', '.jpeg', '.gif', '.bmp', '.png'], or URLs from parsable domains
* Video support (either direct or embedded)
* Auto-next waits for the end of a video (does not work for gif, but does work for gifv)
* Parsing for a collection of domains including: (see createDiv() and processPhoto() for complete list)
* Special browsing in addition to reddit.com: (See Help (?) popup)
	* Imgur		(User/Tag/Trending support)  /imgur/[u/*USER*|t/*TAG*]
	* Tumblr	(Album support) /tumblr/*HOSTNAME*[t/*TAG*]
	* WordPress	(Album support) /wp/*HOSTNAME*[t/*TAG*] (both self, and wp hosted)
	* Blogger	(Album support) /blogger/*HOSTNAME*
	* Flickr	(User/Tag/Search/Trending support) /flickr/[u/*USER*[/*ALBUM*]|t/*TAG*[,*tag2*...]|s/*SEARCH*]
* Deduplication support when browsing multiple subreddits (e.g. a multireddit /user/NAME/m/MULTIREDDIT or /r/funny+pics)
* Albums will display inline for subreddits
* Albums/Video/More in comments will be detected in title and automatically found
* For subreddits that have "requests", responses will be shown as albums, also 'PsBattles:' is similarly special cased

Privacy
-------

* No analytics, no server: everything runs in the extension page.
* History and preferences are stored locally in the browser.
* Browsing reddit sends requests to reddit with your reddit.com session, and
  similarly for other sites. The minimum information is sent necessary to
  complete data retrieval.

Supported Browsers
------------------
* Chromium based browsers: Chrome, Brave, Edge, Opera, ...
* Firefox 140+ (142+ on Android)

URLs
----

Type these in the location box (bottom left), or open
`index.html?/r/SUBREDDIT` in the extension.

## Reddit Specific:
* /r/*SUBREDDIT*
* /r/*SUB1*+*SUB2...*
* /r/randnsfw
* /r/random
* /r/all
* /r/popular
* /  - will be /r/popular, or homepage if logged in
* /domain/DOMAIN

### Reddit URL Suffixes:
These are available from the popup menu
* /.../new
* /.../top
* /.../rising
* /.../controversial

### Reddit Users
* /user/USER/submitted (also /u/USER/submitted)
* /user/USER/m/MULTIREDDIT

## Supported Sites (imgur, flickr, ...)
* /SITE
* /SITE/u/USER
* /SITE/t/TAG[+TAG...]
* /SITE/s/SEARCH

## Supported Blogs (wp, wp2, blogger, tumblr)
* /TYPE/HOSTNAME
* /TYPE/HOSTNAME/t/TAG
* /TYPE/HOSTNAME/u/USER
* /TYPE/HOSTNAME/c/CATEGORY

## Other Services:
See Help (?) popup
* /imgur			Popular Imgur Items
* /imgur/u/USER		Images from that USER
* /imgur/t/TAG		Items with that TAG
* /wp/HOSTNAME		(with or without .wordpress.com)
* /wp2/HOSTNAME		(fqdn of Self-hosted wordpress site aka API version 2)
* /tumblr/HOSTNAME	(with or without .tumblr.com)
* /blogger/HOSTNAME	(fqdn of blogger hosted site)
* /flickr			Popular Flickr Items
* /flickr/USER[/ALBUM] (username of flickr user)

### Blog Order (Tumblr, WordPress, WordPress (v2)):
These are available from the popup menu
* /.../new
* /.../old

Credits
----------

* Ubershmekel http://yuvalg.com/ (original redditp)
* utopiabound https://github.com/utopiabound/redditp (the version this extension packages)
* [js-cookie](https://github.com/js-cookie/js-cookie) for managing cookies
* Favicon by Double-J designs http://www.iconfinder.com/icons/68600/ (CC BY 3.0)
* Slideshow based on http://demo.marcofolio.net/fullscreen_image_slider/
* Author of slideshow base: Marco Kuiper (http://www.marcofolio.net/)
* Touch screen swipe code: Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
* Loglevel v1.5.1: Tim Perry https://github.com/pimterry/loglevel
* [jquery.unevent.js](https://github.com/yckart/jquery.unevent.js) by [Yannick Albert](http://yckart.com/) for handling multiple resize events (MIT)
