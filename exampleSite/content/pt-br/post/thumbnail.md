---
author: Lucas David Vadilho
title: Thumbnail no post
date: 2023-08-06
thumbnail:
    src: 'images/thumbnail.jpg'
    alt: 'Imi em meio as flores'
    object_position: '50% 100%'
    height: 250px
categories: ["heyo"]
tags: ["theme", "shortcodes"]
images: ['images/thumbnail.jpg']
---

Agora você pode adicionar thumbnails no seu post!

<!--more-->

Para adicionar você só precisa colocar a variável `thumbnail` no _front-matter_, ela pode ter os seguintes parâmetros:

| Parâmetro | Descrição | Default |
| --- | --- | --- |
| `src` | Source da imagem, pode ser qualquer URL ou _path_ relativo | |
| `alt` | O alt da imagem, pode ser qualquer string | `thumbnail` |
| `object_postion` | Valores que são passados para a propriedade [object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) da imagem | `50% 50%` |
| `height` | A altura do container da imagem [^1] | `250px` |

[^1]: A altura padrão é `250px`. Ela está definida na variável `--thumbnail-size` de CSS, você pode facilmente sobrescrever globalmente com seu CSS customizado.

# Examplo

O thumbnail desse post foi gerado por esse trecho no _front-matter_:

```yaml
thumbnail:
    src: 'images/thumbnail.jpg'
    alt: 'Post thumbnail'
    object_position: '50% 100%'
    height: 250px
```

# Créditos

Imi -- o [personagem](https://www.tdvadilho.com/portfolio/?id=imiFlores) desse thumbnail -- foi fornecido graciosamente por TD Vadilho, você pode checar o trabalho dele no [site](https://www.tdvadilho.com?utm_source=heyo) e [YouTube](https://www.youtube.com/@TDVadilho)!