---
author: Lucas David Vadilho
title: CJK Glyphs
date: 2023-12-12
description: 
tags: 
    - theme
    - CJK
categories:
    - heyo
---

Test post for CJK Glyphs.

<!--more-->

In a [GitHub issue](https://github.com/LucasVadilho/heyo-hugo-theme/issues/2), _@luobo202254_ raised that the browser's default font for Chinese characters didn't play well with `Computer Modern`. We tried some variations and chose `FandolKai-Regular` to be the default[^1] for {{< theme >}}, the font was obtained from [CTAN](https://ctan.org/tex-archive/fonts/fandol), and is under the GNU GPL license.

# Samples[^2]

{{< callout 
    kind="note"
    title="🇨🇳 Chinese"
    content="学聞示市玉玲況代説景映僧。会問供独北読近借織町球通謙打作。平意軍寄自止注主報者極養航強。替長権示新月設済新子転同恋日村興語靖仕張。採収安師主訃崎告戦都書訃。属勲石寄祉夏抵最第名算護友権更。追強済流分量森非街政涯個侵。的沖就秋織年確混蓮楽融当降全。武国常景報後所阪特産格身労漁景情吹約賄初。恨国会手艦標名介前記日開阪希塚。"
    icon="fas fa-language"
    color="#717788"
>}}

{{< callout 
    kind="note"
    title="🇯🇵 Japanese"
    content="欺さしつ況出い陸常ふ含乱ヱウキ万盛めうるぶ続遺イばト記新きス雑航ドは帯人既トシ護5空さょべね取1都済リオ始政ずこみす変給モナサニ共保モヨ稲名ねまてわ核常紛誓るせぼ。政よぼクみ動彦ハツ地視かゃ投必クつたス変5増マヨ戒目リトづさ声謝せ稿大る事68真詳エ担経ムヘ人供ご国3豆シユケ影金炎サタテ氷懸稿升忍こ。"
    icon="fas fa-language"
    color="#717788"
>}}

{{< callout 
    kind="note"
    title="🇰🇷 Korean"
    content="대한민국의 주권은 국민에게 있고. 정당은 헌법재판소의 심판에 의하여 해산된다. 국가는 대외무역을 육성하며. 국회는 상호원조 또는 안전보장에 관한 조약."
    icon="fas fa-language"
    color="#717788"
>}}

# Choose your own fonts

In `config.toml`, under `[params]`, there's `customCss`, on that param you can point to a CSS file that will override the defaults.

For example, let's say you have `customCSS = ['customCss/my-font-family.css']` in `config.toml` and you create a file at `exampleSite/static/customCss/my-font-family.css` with the following:

```css
* {
    font-family: 'sans serif';
}
```

Your site should look something like this now:

![exampleSite with a sans serif font](/images/my-font-family.png)

[^1]: Note that it's pretty easy to change the defaults, just follow [these](#choose-your-own-fonts) instructions.
[^2]: All the samples text were generated at https://generator.lorem-ipsum.info.