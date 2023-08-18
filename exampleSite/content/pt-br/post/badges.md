---
author: Lucas David Vadilho
title: Insígnias
date: 2023-08-01
description: Como adicionar insígnias ao seu post
tags: 
    - theme
    - shortcodes
categories:
    - heyo
badges:
    github:
        subject: GitHub
        status: Check it on GitHub
        icon: github
        url: https://github.com/LucasVadilho/heyo-hugo-theme
        color: grey
        label: ""
    colab:
        subject: Colab
        status: Run it on Google Colab
        label: ""
        color: orange
        icon: https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Colaboratory_SVG_Logo.svg
        url: https://colab.research.google.com/github/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/model_monitoring/model_monitoring.ipynb
    kofi:
        subject: kofi
        status: Buy me a coffee ❤️
        icon: kofi
        label: ""
        url: https://ko-fi.com/oioipio
    template:
        flat: false
        subject: subject
        status: status
        label: label
        color: 000
        label_color: pink
        icon: awesome
        url: https://badgen.net/
---

Esse artigo mostra como adicionar e customizar insígnias (_badges_) em seus posts.

<!--more-->

No {{< theme >}} insígnias são geradas usando [badgen.net](https://badgen.net/). Elas podem ser construídas pelo shortcode `badge`, mas também tem uma maneira de adicionar várias ao [resumo do post](#resumo-do-post) via _front-matter_.

# Shortcode

O shortcode é `{{</* badge */>}}`. Você pode checar todas as configurações [aqui](#configuração).

## Examplo

Esse shortcode:

```go-html-template
{{</* 
badge 
    status="Checkout the Wiki"
    icon=wiki
    label=""
    color=grey
    url=https://www.wikipedia.org
*/>}}
```

Gera a seguinte insígnia:

{{< 
badge 
    status="Checkout the Wiki"
    icon=wiki
    label=""
    color=grey
    url=https://www.wikipedia.org
>}}


# Resumo do post

Você também pode mostrar várias insígnias no resumo do post, via a variável `badges` no _front-matter_.

## Exemplo

As insígnias desse post foram geradas pela seguinte _front-matter_:

```yaml
---
author: Lucas David Vadilho
title: Insignías
⋮
badges:
    github:
        subject: GitHub
        status: Check it on GitHub
        icon: github
        url: https://github.com/LucasVadilho/heyo-hugo-theme
        color: grey
        label: ""
    colab:
        subject: Colab
        status: Run it on Google Colab
        label: ""
        color: orange
        icon: https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Colaboratory_SVG_Logo.svg
        url: https://colab.research.google.com/github/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/model_monitoring/model_monitoring.ipynb
    kofi:
        subject: kofi
        status: Buy me a coffee ❤️
        icon: kofi
        label: ""
        url: https://ko-fi.com/oioipio
    template:
        flat: false
        subject: subject
        status: status
        label: label
        color: pink
        label_color: 000
        icon: awesome
        url: https://badgen.net/
```

# Configuração

A tabela abaixo mostra todos os parâmetros para configurar a insígnia.

| Parameter | Description | Possible values | Default |
|---|---|---|---|
| `status` | Especificação para o `generator` <br /> Ou texto na direita | Qualquer string | `status`  |
| `subject` | Especificação para o `generator` <br /> Ou texto na esquerda[^1] | Qualquer string | `subject` |
| `generator` | Gerador da insígnia | Ver a [documentação](https://badgen.net/help#generators) do badgen | `static` |
| `flat` | Define o estilo da insígnia | `true \| false` | `true` |
| `scale` | Escala da insígnia | Qualquer número | `1` |
| `label` | Texto na esquerda[^2] | Qualquer string | None |
| `url` | Transforma a badge em um link | Qualquer URL | None |
| `icon` | Ícone no lado esquerdo | [Ícones](https://badgen.net/help#icons) do badgen ou qualquer URL de SVG | Padrão do badgen |
| `color` | Cor do status | [Cores](https://badgen.net/help#colors) do badgen ou Hexadecimal | Padrão do badgen |
| `label_color` | Cor do label | [Cores](https://badgen.net/help#colors) do badgen ou Hexadecimal | Padrão do badgen |

[^1]: Será sobrescrita por `label`
[^2]: Pode ser vazio (`""`), se você quiser mostrar só o ícone