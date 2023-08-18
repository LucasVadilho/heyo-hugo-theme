---
author: Lucas David Vadilho
title: Índice
date: 2023-08-04
tags: 
    - theme
categories:
    - heyo
showToc: true
slug: indice
---

No {{< theme >}} podemos usar a barra da esquerda para mostrar um índice do post!

<!--more-->

# Introdução

Esse post é um guia em como mostrar o índice na barra da esquerda.

Provavelmente você já assumiu isso, mas o índice é navegável
It probably goes without saying, but the TOC is navigable.

# Materiais e Métodos

1. Adicione `showToc: true` no _front-matter_ do post
2. É só isso mesmo

## Exemplo

Esse post tem a seguinte _front-matter_:

```yaml
---
author: Lucas David Vadilho
title: Índice
date: 2023-08-01
tags: 
    - theme
categories:
    - heyo
showToc: true
slug: indice
---
```

# Léveis de cabeçalho

No `config.toml` temos a configuração dos léveis, então é bem simples de customizar. Por padrão começamos em 1 e terminamos no 6.

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

Se chegar nessa profundidade você provavelmente deveria reestruturar seu documento (jk).