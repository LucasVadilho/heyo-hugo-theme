---
author: Lucas David Vadilho
title: Custom JavaScript and CSS
date: 2023-12-11
description: 
tags: 
    - theme
    - customization
    - JS
    - CSS
categories:
    - heyo
---

With custom CSS and JavaScript you can change pretty much anything in {{< theme >}} appearance or functionality, and it's pretty simple, too!

<!--more-->

In `config.toml`, under `[params]`, there are two fields: `customCss` and `customJs`, on those you can point to a file that will be imported when you build the site. This allows you to override the defaults and add your own functionality!

{{< callout 
    kind="info"
    title="You can use remote files"
    content="If you want to use a remote file (from a CDN, for example), you can just put the URL there.<br/><br/>For example, if you set <code>customJs = ['https://cdnjs.cloudflare.com/ajax/libs/hi-sven/1.29.0/index.js']</code>, you should see `Hi Sven?` in the DevTools' (<kbd><kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>I</kbd></kbd>) console."
>}}

{{< callout 
    kind="info"
    title="You're not limited to a single file"
    content="You can have more than one custom file, just use a `,` to separate them, for example `customCss = ['customCss/my-styles-1.css', 'customCss/my-styles-2.css']`"
>}}

# CSS Example

Let's say you want to change the default font, all you need to do is set `customCss = ['customCss/my-font-family.css']` in `config.toml` and create a file at `exampleSite/static/customCss/my-font-family.css` with the following:

```css
* {
    font-family: 'sans serif';
}
```

Your site should look something like this now:

![exampleSite with a sans serif font](/images/my-font-family.png)

# JavaSript Example

Let's say you have the following in `config.toml`:

```toml
customJs = ['customJs/my-js.js', 'https://cdnjs.cloudflare.com/ajax/libs/hi-sven/1.29.0/index.js']
```

And you create a file at `exampleSite/static/customJs/my-js.js` with the following:

```js
console.info("Hello from my-js.js");
```

You should see `Hello from my-js.js` and `Hi Sven?` in the DevTools' (<kbd><kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>I</kbd></kbd>) console.
