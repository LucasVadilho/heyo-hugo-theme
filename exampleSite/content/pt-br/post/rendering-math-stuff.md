---
author: Lucas David Vadilho
title: Renderizando Matemática
date: 2023-08-03
description: Como configurar o tema para renderizar matemática
math: true
tags: 
    - theme
categories:
    - heyo
slug: 'renderizando-matematica'
---

Esse artigo mostra como configurar seu site com o {{< theme >}} para mostrar matemática formatada com $\LaTeX$.

<!--more-->

A formatação de matemática é realizada através de bibliotecas em JavaScript. No {{< theme >}} nós temos a opção de utilizar [MathJax 3](https://www.mathjax.org/) ou [KaTeX](https://katex.org/).

As bibliotecas estão na partial `math.html` (`/layouts/partials/math.html`).

# Configuração Global

Controlado no arquivo de configuração, `config.toml`, pelo parâmetro `math`.

- O parâmetro `math.enable = true` na configuração do projeto habilita formatação para todas as páginas.
- A biblioteca padrão é MathJax, mas ela pode ser trocada por KaTeX com `math.use = "katex"`.

# Por Página

Mesmo com `math.enable = false` no `config.toml` é possível habilitar a formatação no escopo do arquivo, basta colocar `math: true` na *front-matter*.

# Exemplos

Nesses exemplos vamos demonstrar como utilizar MathJax.

## Matemática em Linha

O MathJax está configurado para utilizar `$...$` ou `\\(...\\)` como os delimitadores em linha.

Do nada precisamos definir $\varphi = \dfrac{1+\sqrt5}{2}= 1.6180\dots$.

## Matemática em Bloco

Para matemática em bloco o MathJax está configurado para utilizar `$$...$$` ou `\\[...\\]` como os delimitadores.

```latex
$$
    \varphi = 1+\frac{1}{1+\frac{1} {1+\frac{1} {1+\cdots}}}
$$
```

Vai aparecer como:

$$
    \varphi = 1+\frac{1}{1+\frac{1} {1+\frac{1} {1+\cdots}}}
$$

## Escapando \\$

Se você precisar mostrar \\$ no seu texto você pode escapar ele com `\`. Se você está usando arquivos `.md` é necessário escapar a `\`.

Então o texto `Um valor aleatório entre R\\$5 e R\\$10` no arquivo `.md`, depois do processamento do Hugo e do MathJax, vai ser renderizado como:

Um valor aleatório entre R\\$5 e R\\$10