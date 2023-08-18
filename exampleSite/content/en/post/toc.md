---
author: Lucas David Vadilho
title: Table of Contents
date: 2023-08-04
tags: 
    - theme
categories:
    - heyo
showToc: true
---

In {{< theme >}} we can use the sidebar to display a Table of Contents!

<!--more-->

# Introduction

This post is a guide on how to display a Table of Contents in the sidebar.

It probably goes without saying, but the TOC is navigable.

# Methods

1. Add `showToc: true` to your front-matter
2. That's it

## Example

This post has the following front-matter:

```yaml
---
author: Lucas David Vadilho
title: Table of Contents
date: 2023-08-01
showToc: true
---
```

# Heading levels

In `config.toml` we have the configuration for the levels, so it's very easy to customize. By default we start at 1, and end at 6.

```toml
[markup]
    [markup.tableOfContents]
        startLevel = 1
        endLevel = 6
```

# Level 1

## Level 2

### Level 3

#### Level 4

##### Level 5

###### Level 6

If you get this deep you should probably restructure your document (jk).