---
author: Lucas David Vadilho
title: Callout shortcode
date: 2023-08-10
description: How to add badges to your posts
categories: ["heyo"]
tags: ["theme", "shortcodes"]
---

Check it out, {{< theme >}} has callouts now!

<!--more-->

# How to use it

```go-html-template
{{</* 
callout 
    kind="info"
    title="Here's something you should probably know"
    content="Even light has a speed"
*/>}}
```

We have the following defaults `kind`s:

## Info
{{< callout 
    kind="info"
    title="Here's something you should probably know"
    content="Even light has a speed"
>}}

## Question

{{< callout 
    kind="question"
    title="What is it?"
    content=""
>}}

Note that `content` can be empty.

## Success

{{< callout 
    kind="success"
    title=""
    content="The speed of lights is _exactly equal_ to $c$"
>}}

The `title` can be empty, too.

## Alert

{{< callout 
    kind="alert"
    title="Stop messing with me!"
    content="Just tell me the value"
>}}

## Nope

{{< callout 
    kind="nope"
    title="Nope"
    content="You should do some research"
>}}


## Note

{{< callout 
    kind="note"
    title="Research"
    content="The speed of lights is _exactly equal_ to 299,792,458 m/s"
>}}

Feel free to suggest new ones [here](https://github.com/LucasVadilho/heyo-hugo-theme)!

# Customized callouts

You can also customize the callouts, choosing your own [Font Awesome](https://fontawesome.com/search) icon and color. All you need to do is add `icon` and `color` to the shortcode.

## Example

```
{{</* callout 
    title="Research"
    content="The speed of lights is _exactly equal_ to 299,792,458 m/s"
    icon="fas fa-atom"
    color="linear-gradient(95deg, #9198e5, #e66465)"
*/>}}
```

Will be rendered as:

{{< callout 
    title="Research"
    content="The speed of lights is _exactly equal_ to 299,792,458 m/s"
    icon="fas fa-atom"
    color="linear-gradient(95deg, #9198e5, #e66465)"
>}}

Note that you can also override the defaults individually.