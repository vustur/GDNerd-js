# GDNerd-js

JS program for spamming geometry dash recent levels using AI (js rewrite)

### How does it works

* Get a random recent level
* Parse levels name, description, author and song
* Ask AI model to generate comment using levels data and prompt
* Comment something strange

### Install

* copy repo
* `npm install`
* configure .env.local like this:
  ```
  HF_TOKEN=(hugging face token)
  GD_USER=(gd account username)
  GD_PASS=(gd account password)
  ```
* `npm run start`
* have fun
