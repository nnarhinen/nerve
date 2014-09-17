Introduction
============

TODO: Write introduction :)


Installation
============

 * clone this repository
 * `cd nerve`
 * `npm install`

Running
=======

 * `node app.js`

Working with translations
=========================

Nerve uses gettext for translations. In [nunjucks](http://mozilla.github.io/nunjucks/) templates the only thing you need
to do is to wrap english words in `gettext()`.

Updating .pot files
-------------------

Run `npm run pot`

Updating .po files from .pot files
----------------------------------

Run `npm run syncpo`

Converting .po files to .json files
-----------------------------------

This is needed to make [i18n-abide](http://github.com/mozilla/i18n-abide) be able to read translations.

Run `npm run po2json`

Authors
=======

Niklas Närhinen <niklas@narhinen.net>

License
=======

GPLv3, see the [LICENSE](/LICENSE) file
