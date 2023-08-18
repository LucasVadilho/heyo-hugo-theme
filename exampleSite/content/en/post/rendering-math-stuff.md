---
author: Lucas David Vadilho
title: Rendering Math Stuff
date: 2023-08-03
description: How to configure Math Typesetting in heyo
math: true
tags: 
    - theme
categories:
    - heyo
---

This article shows how to configure your site with {{< theme >}} theme to display $\LaTeX$.
<!--more-->

Math typesetting is achieved through JavaScript libraries. In {{< theme >}} you have the option of using either [MathJax 3](https://www.mathjax.org/) or [KaTeX](https://katex.org/).

The libraries are in the `math.html` partial (`/layouts/partials/math.html`).

## Global Configurations

Math typesetting can be globally enabled setting the param `math` in `config.toml`.

- The param `math.enable = true` enables math typesetting for all pages.
- The default library is MathJax, but it can be changed to KaTeX with `math.use = "katex"`. 

## Per Page Basis

Even with `math.enable = false` in the `config.toml` you can typeset math on specific pages, all you need to do is put `math = true` in page front-matter.

## Examples

In this examples we're using MathJax.

### Inline Math

MathJax is setup to use `$...$` or `\\(...\\)` as the delimiters for inline math.

```latex
Suddenly we need to define $\varphi = \dfrac{1+\sqrt5}{2} = 1.6180\dots$
```

Will be rendered as:

Suddenly we need to define $\varphi = \dfrac{1+\sqrt5}{2}= 1.6180\dots$

### Block Math

For block math the MathJax delimiters are `$$...$$` or `\\[...\\]`.

```latex
$$
    \varphi = 1+\frac{1}{1+\frac{1} {1+\frac{1} {1+\cdots}}}
$$
```

Will be rendered as:

$$
    \varphi = 1+\frac{1}{1+\frac{1} {1+\frac{1} {1+\cdots}}}
$$

### Escaping \\$

If you need to show the literal \\$ in text you can escape it with `\`. If you're using `.md` you need to escape the `\`.

So if you have `A random amount between \\$5 and \\$10` in your `.md` file, after Hugo and MathJax process it the end result will be:

A random amount between \\$5 and \\$10