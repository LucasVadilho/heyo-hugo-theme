---
author: Lucas David Vadilho
title: Sketches!
date: 2023-08-07
badges:
    p5:
        subject: p5js
        status: p5js
        color: ed225d
        label: ""
        label_color: grey
        url: https://p5js.org/
        icon: https://upload.wikimedia.org/wikipedia/commons/c/c6/P5.js_icon.svg
tags: 
    - theme
    - p5js
    - javascript
    - creative coding
categories:
    - heyo
---

Sketches are the pretty visualizations in {{< theme >}}'s sidebar. The default ones were built using [p5.js](https://p5js.org/) -- a javascript library for creative coding.

<!--more-->

# Visualizations

For now, we have the following visualizations:

| Sketch | Description |
| ------ | ----------- |
| Graph | Cozy dots moving around to Perlin Noise |
| Digital Rain | Falling symbols, Matrix style |
| Circles | Drawing circles with a weird brush |


Feel free to suggest or contribute new ones in {{< theme >}}!

# Setting up

## Global Configurations

The sketch can be globally enabled by setting the param `sketch` in `config.toml`.

| Param                   | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `sketch.enable`         | controls if the sketch will appear on every page[^1]   |
| `sketch.displayOptions` | controls if sketch settings will be displayed on hover |
| `sketch.use`            | selects which sketch will be displayed                 |

[^1]: The Table of Contents will override the sketch

## Per Page Basis

Even with `sketch.enable = false` in `config.toml` you can still enable sketches on specific pages, all you need to do is set it up in page's front-matter. That enables you to show different sketches on different pages.

# Implement your own sketch

Using `customJs` you can import your own javascript code, so all you have to do to implement your own sketch is:

1. Wrap up you sketch in a class
1. Make sure that it implements the `setup` and `draw` methods (it can also implement `mouseWheel`, `mouseClicked`, and `getSettings`)
1. Add your class to the `SKETCHES` object (`SKETCHES['yourName'] = yourClass`)
1. Set `sketch.use` to `yourName`
1. Consider sending a pull request in {{< theme >}} to share your sketch :heart: