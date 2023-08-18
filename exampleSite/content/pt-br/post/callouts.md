---
author: Lucas David Vadilho
title: Shortcode para callouts
date: 2023-08-05
description: Como configurar callouts no heyo
categories: ["heyo"]
tags: ["theme", "shortcodes"]
---

Olha só, {{< theme >}} tem _callouts_ agora!

<!--more-->

# Como usar

Bem simples:

```go-html-template
{{</* 
callout 
    kind="info"
    title="Here's something you should probably know"
    content="Even light has a speed"
*/>}}
```

Nós temos alguns valores pré-configurados para `kind`. Mas também é possível [customizar](#customizados) seu callout!

# Kinds

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

Você pode sugerir novos em {{< theme >}}!

# Customizados

Você pode escolher seu próprio ícone do [Font Awesome](https://fontawesome.com/search) e cor. Tudo que precisa fazer é adicionar `icon` e `color` no shortcode.

## Examplo

```
{{</* callout 
    title="Research"
    content="The speed of lights is _exactly equal_ to 299,792,458 m/s"
    icon="fas fa-atom"
    color="linear-gradient(95deg, #9198e5, #e66465)"
*/>}}
```

Será renderizado assim:

{{< callout 
    title="Research"
    content="The speed of lights is _exactly equal_ to 299,792,458 m/s"
    icon="fas fa-atom"
    color="linear-gradient(95deg, #9198e5, #e66465)"
>}}