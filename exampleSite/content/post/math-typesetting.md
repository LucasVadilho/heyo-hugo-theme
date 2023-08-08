---
author: Lucas David Vadilho
title: Math Stuff
date: 2019-09-26
description: How to configure Math Typesetting in {{theme}}
math:
    enable: true
---

How to configure your site with the {{theme}} to display pretty math.
<!--more-->

Math typesetting is achieved through `javascript` libraries. In {{theme}} we give you the option of using either [MathJax 3](https://www.mathjax.org/) or [KaTeX](https://katex.org/).

The libraries are in the `math.html` partial (`/layouts/partials/math.html`).

- Math typesetting can be globally enabled setting the param `math.enable` to `true` in the configuration.
- It can also be enabled on each page with `math.enable = true` in the front-matter.

The default library is MathJax, but it can be changed to KaTeX with `math.use = "katex"`.

## Examples
In this examples we're using MathJax.

### Inline Math
MathJax is setup to use `$...$` or `\\(...\\)` as the delimiters for inline math.

Suddenly we need to define $\varphi = \dfrac{1+\sqrt5}{2}= 1.6180\dots$.

### Block Math
For block math the MathJax delimiters are `$$...$$` or `\\[...\\]`. For example:
$$
    \varphi = 1+\frac{1} {1+\frac{1} {1+\frac{1} {1+\cdots} } } 
$$
