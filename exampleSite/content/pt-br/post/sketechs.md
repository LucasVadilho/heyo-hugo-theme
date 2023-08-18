---
author: Lucas David Vadilho
title: Sketches!
date: 2023-08-07
badges:
    p5:
        subject: p5js
        status: p5js
        color: ed225d
        label: ""
        label_color: grey
        url: https://p5js.org/
        icon: https://upload.wikimedia.org/wikipedia/commons/c/c6/P5.js_icon.svg
tags: 
    - theme
    - p5js
    - javascript
    - creative coding
categories:
    - heyo
---

Sketches são as visualizações na barra lateral do {{< theme >}}. As disponíveis no momento foram construídas usando [p5.js](https://p5js.org/) -- uma biblioteca de javascript para programação criativa.

<!--more-->

# Visualizações

Por enquanto oferecemos as seguintes visualizações:

| Sketch | Descrição |
| ------ | ----------- |
| Graph | Pontinhos se movendo tranquilamente de acordo com Perlin Noise |
| Digital Rain | Símbolos caindo, Matrix style |
| Circles | Desenhando círculos com um pincel estranho |


Sinta-se livre para sugerir ou contribuir novas visualizações em {{< theme >}}!

# Configuração

## Global

A sketch pode ser habilitada globalmente pelo param `sketch` no `config.toml`.

| Param | Descrição |
| --- | --- |
| `sketch.enable`         | Controla se a sketch vai aparecer em todas as páginas [^1]   |
| `sketch.displayOptions` | Controla se as opções da sketch serão mostradas no _hover_ |
| `sketch.use`            | Seleciona a sketch padrão |

[^1]: O índice, quando habilitado, vai sobrepor a sketch

## Por página

Mesmo com `sketch.enable = false` no `config.toml`, você ainda pode habilitar a sketch em páginas específicas. Tudo que precisa fazer é a congiguração no _front-matter_ da página. Isso permite que você mostre sketches diferentes em páginas específicas.

## Implementando sua própria sketch

Via `customJs` você pode importar seu próprio javascript, então tudo que precisa fazer é:

1. Envelopar sua sketch em uma classe
1. Sua classe deve implementar as funções de `setup` e `draw` (ela também pode implementar `mouseWheel`, `mouseClicked` e `getSettings`)
1. Adicionar sua classe ao objeto `SKETCHES` (`SKETCHES['yourName'] = yourClass`)
1. Colocar `sketch.use = yourName`
1. Considere enviar pull request em {{< theme >}} para compartilhar sua criação :heart: