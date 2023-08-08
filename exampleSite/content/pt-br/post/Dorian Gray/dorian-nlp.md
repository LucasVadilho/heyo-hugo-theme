---
author: Lucas David Vadilho
title: The Picture of Dorian Gray
date: 2019-09-26
description: Q
math: true
showToc: true
thumbnail:
  src: 'https://placeimg.com/640/480/nature'
  alt: 'eeee'
badges:
  - template:
    flat: true
    show_subject: true
    subject: subject
    status: status
    color: pink
    icon: github
    icon_bg_color: ff0000
    url: https://colab.research.google.com/github/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/model_monitoring/model_monitoring.ipynb
  - github:
    flat: false
    show_subject: false
    subject: github
    status: passing
    color: pink
    
    icon: github
    icon_bg_color: ff0000
    text_bg_color: 00ff00
  - colab:
    subject: colab
    status: Open in Colab
    color: pink
    icon: https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Colaboratory_SVG_Logo.svg

---

[![GitHub](https://badgen.net/badge/icon/github?icon=github&label)](https://github.com)

O objetivo desse projeto é fazer uma análise exploratória e descritiva da história _The Picture of Dorian Gray_, de Oscar Wilde, focando nos aspectos emocionais dos personagens.

Para isso vamos olhar tanto para o livro quanto para uma adaptação do livro para uma peça de teatro.

As técnicas de PLN que vamos demonstrar são __sumarização__ e __extração de emoções__ (afeto, na realidade, mas explicamos melhor depois).

<!--more-->

## Bibliotecas


```python
!pip install --upgrade wordcloud

import nltk
from wordcloud import WordCloud

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import string
import collections
from PIL import Image

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')
```

## Funções e Utilidades


```
tokenize = nltk.word_tokenize

lemmatize = nltk.stem.WordNetLemmatizer().lemmatize

stopwords = nltk.corpus.stopwords.words('english')
stopwords.remove('no')
stopwords.remove('not')

punctuation = string.punctuation

artefacts = ["``", "''", "--", "'s", "’", "n't"]

def preprocess(txt):
    txt = txt.lower()

    return [lemmatize(token) for token
             in tokenize(txt)
             if token not in stopwords and
                token not in punctuation and
                token not in artefacts]

def createFreqDict(words):
    count = collections.Counter(token for token in words)
    return dict(count)

def drawWordCloud(tokens, title, maskPath = None):
    mask = np.array(Image.open(maskPath)) if maskPath else None

    wc = WordCloud(width = 400, height = 800, mask = mask, colormap = None) 
    # colormap por sentimento?
    # https://martinvonlupin.de/emosaic/
    
    wc.generate_from_frequencies(createFreqDict(tokens))
    
    wc.to_file(f'{title}.png')

def plotVAD(rolling, original):
    f, (v, a, d) = plt.subplots(3, 1, sharex = True, sharey = False, figsize = (15, 15))

    v.set_title("Valence")
    v.plot(original.valence, color = 'dodgerblue', alpha = 0.25)
    v.plot(rolling.valence, color = 'dodgerblue')

    a.set_title("Arousal")
    a.plot(original.arousal, color = 'violet', alpha = 0.25)
    a.plot(rolling.arousal, color = 'violet')

    d.set_title("Dominance")
    d.plot(original.dominance, color = 'crimson', alpha = 0.25)
    d.plot(rolling.dominance, color = 'crimson')

def plotPlayVAD(rolling, original, title):
    f, (v, a, d) = plt.subplots(3, 1, sharex = True, sharey = False, figsize = (15, 15))

    idxLimit = original.groupby(['act', 'scene']).index.agg(max).values
    actLimits = original[original['index'].isin(idxLimit)].index

    f.suptitle(f"{title}'s VAD", fontsize = 16)

    v.set_title("Valence")
    v.plot(original.valence, color = 'dodgerblue', alpha = 0.25)
    v.plot(rolling.valence, color = 'dodgerblue')
    v.vlines(actLimits, 0, 1, linestyles = 'dashed', transform = v.get_xaxis_transform(), alpha = 0.5, label = "act change")
    v.legend()

    a.set_title("Arousal")
    a.plot(original.arousal, color = 'violet', alpha = 0.25)
    a.plot(rolling.arousal, color = 'violet')
    a.vlines(actLimits, 0, 1, linestyles = 'dashed', transform = a.get_xaxis_transform(), alpha = 0.5)

    d.set_title("Dominance")
    d.plot(original.dominance, color = 'crimson', alpha = 0.25)
    d.plot(rolling.dominance, color = 'crimson')
    d.vlines(actLimits, 0, 1, linestyles = 'dashed', transform = d.get_xaxis_transform(), alpha = 0.5)
```

## Dados e Pré-processamento

### VAD e ANEW

#### Afeto e Emoção

Antes de entrar em detalhes do modelo VAD, vamos tentar diferenciar afeto de emoção.

De maneira simplificada, afeto está atrelado ao ao reconhecimento de como você está se sentindo, dado o que você esta experienciando no momento. Ele cobre e envolve tanto emoções quanto sentimentos. Por exemplo, o quão calmo ou agitado você está.

Já emoção é a classificação que damos a um estado afetivo, ela  é uma reação dirigida a alguma coisa ou alguém.

#### VAD

O modelo VAD (_Valence-Arousal-Dominance_) tenta capturar o estado afetivo em três dimensões independentes. O eixo _Valence_ representa a variação entre desagradável-agradável, o _Arousal_ o quão intenso é a sensação e _Dominance_ representa o quão submisso-dominante a pessoa se sente.

A imagem a seguir coloca as seis emoções de Ekman no espaço VAD.

![](https://www.researchgate.net/profile/Sven_Buechel/publication/307512566/figure/fig2/AS:727675475873793@1550502761529/Positions-of-Ekmans-basic-emotions-within-the-emotional-space-spanned-by-the-Valence.png)

Imagem retirada de [2]

#### ANEW

Em 1999, Bradley et al., publicaram o ANEW (_Affective Norms for English Words_), um conjunto de 1034 palavras e seus valores de VAD. Em 2013, Warriner et al, expandiram esse conjunto para quase 14000 palavras.

O dataset gerado nessa pesquisa pode ser encontrado nos materiais suplementares de [1], dele nós vamos extrair as colunas de média geral de _valence_, _arousal_ e _dominance_ e construir três dicionários, um para cada dimensão, para facilitar a manipulação.

É importante notar que as palavras estão na sua forma de _lemma_ no ANEW.


```
anew = pd\
    .read_csv('BRM-emot-submit.csv', usecols = ['Word', 'V.Mean.Sum', 'A.Mean.Sum', 'D.Mean.Sum'])\
    .rename(columns = {'Word': 'word',
             'V.Mean.Sum': 'valence',
             'A.Mean.Sum': 'arousal',
             'D.Mean.Sum': 'dominance'})

valence = {w: v for w, v in zip(anew.word, anew.valence)}
arousal = {w: v for w, v in zip(anew.word, anew.arousal)}
dominance = {w: v for w, v in zip(anew.word, anew.dominance)}
```

A função `getAnewScore` é responsável por calcular o valor de uma das dimensões do VAD normalizado pelo número de lemmas. Note que estamos ignorando lemas que não aparecem no dataset ANEW.


```
def getAnewScore(lemmas, dict):
    sum = 0
    nWords = 0

    for l in lemmas:
        try:
            sum += dict[l]
            nWords += 1
        except:
            continue

    return sum / nWords if nWords > 0 else np.nan
```

### Livro

O livro, publicado em 1880, já está em dominio público e pode ser encontrado no [projeto gutenberg](http://www.gutenberg.org/cache/epub/174/pg174.txt).

No livro vamos observar aspectos mais gerais, fazendo uma __análise exploratória__, __extração de emoções__ e __sumarização__.

O livro será processado da seguinte maneira:
- Remover informações de licença e prefácio
- Separar em parágrafos
- Guardar os parágrafos originais em `originalParagraphs`
- Pré-processar os parágrafos em `preprocessedParagraphs`
- Avaliar VAD em cada parágrafo
- Jutar tudo em `dfBook`
- Criar uma lista com todos os lemas do livro em `bookLemmas`


```
rawBook = open('dorianGray.txt').read().split('\n')

lines = rawBook[93:8535] # Removendo informações de licença e prefácio

# Livro em parágrafos
book = []

for line in lines:
    if line == '':
        book.append('<paragrafo>')
    else:
        book.append(line)

book = ' '.join(book)

bookParagraphs = book.split('<paragrafo>')

originalParagraphs = [p for p in bookParagraphs if not(not preprocess(p))]

preprocessedParagraphs = [preprocess(p) for p in bookParagraphs]
preprocessedParagraphs = [p for p in preprocessedParagraphs if not(not p)]

valenceParagraps = [getAnewScore(p, valence) for p in preprocessedParagraphs]
arousalParagraps = [getAnewScore(p, arousal) for p in preprocessedParagraphs]
dominanceParagraps = [getAnewScore(p, dominance) for p in preprocessedParagraphs]

bookLemmas = [lemma for paragraph in preprocessedParagraphs for lemma in paragraph]
```


```
data = list(zip(originalParagraphs, preprocessedParagraphs, valenceParagraps, arousalParagraps, dominanceParagraps))
dfBook = pd.DataFrame(data, columns = ['originalParagraph', 'preprocessedParagraph', 'valence', 'arousal', 'dominance'])

dfBook.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>originalParagraph</th>
      <th>preprocessedParagraph</th>
      <th>valence</th>
      <th>arousal</th>
      <th>dominance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>CHAPTER 1</td>
      <td>[chapter, 1]</td>
      <td>5.70000</td>
      <td>3.860000</td>
      <td>6.210000</td>
    </tr>
    <tr>
      <th>1</th>
      <td>The studio was filled with the rich odour of ...</td>
      <td>[studio, filled, rich, odour, rose, light, sum...</td>
      <td>6.32000</td>
      <td>4.063125</td>
      <td>5.603125</td>
    </tr>
    <tr>
      <th>2</th>
      <td>From the corner of the divan of Persian saddl...</td>
      <td>[corner, divan, persian, saddle-bags, lying, s...</td>
      <td>5.41240</td>
      <td>3.956800</td>
      <td>5.346200</td>
    </tr>
    <tr>
      <th>3</th>
      <td>In the centre of the room, clamped to an upri...</td>
      <td>[centre, room, clamped, upright, easel, stood,...</td>
      <td>5.78800</td>
      <td>4.017000</td>
      <td>5.561500</td>
    </tr>
    <tr>
      <th>4</th>
      <td>As the painter looked at the gracious and com...</td>
      <td>[painter, looked, gracious, comely, form, skil...</td>
      <td>6.21125</td>
      <td>4.348750</td>
      <td>6.095625</td>
    </tr>
  </tbody>
</table>
</div>



### A adaptação

A adaptação para teatro, desenvolvida pelo grupo de produções teatrais Palkettostage, está disponível no [site da instituição](https://www.manzoni.edu.it/2017/files/dorian_gb.pdf) e é de uso educacional livre.

Como na adaptação temos uma estrutura em atos e cenas, além das falas dos personagens serem identificadas, vamos fazer a __extração de emoções__ e analisar como os personagens variam durante o livro.

Um arquivo `.csv` foi construído manualmente a partir do arquivo original da peça. Nesse arquivo cada linha contém uma fala de um personagem, no formato: `act`, `scene`, `character`, `text`.

Vamos enriquecer esse dataset preprocessando as falas e avaliando o VAD de cada fala.


```
dfPlay = pd.read_csv('play.csv')

dfPlay['lemmas'] = [preprocess(line) for line in dfPlay.text]
dfPlay['valence'] = [getAnewScore(lemmas, valence) for lemmas in dfPlay.lemmas]
dfPlay['arousal'] = [getAnewScore(lemmas, arousal) for lemmas in dfPlay.lemmas]
dfPlay['dominance'] = [getAnewScore(lemmas, dominance) for lemmas in dfPlay.lemmas]

dfPlay.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>act</th>
      <th>scene</th>
      <th>character</th>
      <th>text</th>
      <th>lemmas</th>
      <th>valence</th>
      <th>arousal</th>
      <th>dominance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>1</td>
      <td>Lord Henry</td>
      <td>It’s your best work yet, Basil, the best thing...</td>
      <td>[best, work, yet, basil, best, thing, ever, do...</td>
      <td>5.735000</td>
      <td>3.740000</td>
      <td>5.616667</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>1</td>
      <td>Basil</td>
      <td>I don’t think I shall send it anywhere.</td>
      <td>[think, shall, send, anywhere]</td>
      <td>6.240000</td>
      <td>3.566667</td>
      <td>6.110000</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1</td>
      <td>1</td>
      <td>Lord Henry</td>
      <td>Not send it anywhere? What strange types you a...</td>
      <td>[not, send, anywhere, strange, type, artist, a...</td>
      <td>6.025714</td>
      <td>3.935714</td>
      <td>5.647857</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>1</td>
      <td>Basil</td>
      <td>I know you’ll laugh at me but I really can’t e...</td>
      <td>[know, laugh, really, exhibit, put, much, pain...</td>
      <td>6.428000</td>
      <td>4.490000</td>
      <td>6.528000</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1</td>
      <td>1</td>
      <td>Lord Henry</td>
      <td>Too much of yourself! My dear man, I really ca...</td>
      <td>[much, dear, man, really, see, resemblance, yo...</td>
      <td>6.188182</td>
      <td>3.700000</td>
      <td>5.667273</td>
    </tr>
  </tbody>
</table>
</div>



## Analisando o Livro

### Frequência de n-gramas

Construímos _word clouds_ para o livro usando unigramas, bigramas e trigramas.


```
for i in range(1, 4):
    nGram = list(' '.join(ngram) for ngram in nltk.ngrams(bookLemmas, i))
    drawWordCloud(nGram, f'{i}gramBook')
```

- Unigramas

![](https://i.imgur.com/WBmpnJT.png)

- Bigramas

![](https://i.imgur.com/5HU0tvX.png)

- Trigramas

![](https://i.imgur.com/BWaS6re.png)

### Emoções nos Parágrafos



Abaixo estamos demonstrando os máximos e mínimos de cada dimensão como uma maneira de explorar os extremos de VAD encontrados no livro.


```
#@title Controle
from tabulate import tabulate
from IPython import display

dimension = 'dominance' #@param ['valence', 'arousal', 'dominance']
nParagraphs = 5 #@param {type: "slider", min: 1, max: 10, step: 1}

sorted = dfBook.sort_values(dimension, ascending = False).dropna()

table = tabulate(list(zip(sorted.originalParagraph.head(nParagraphs), sorted.originalParagraph.tail(nParagraphs))), headers=['Max', 'Min'], tablefmt = 'html')
display.display(display.HTML(f'<h3>{dimension}</h3>'))
display.display(display.HTML(table))
```


<h3>dominance</h3>



<table>
<thead>
<tr><th>Max                                                                 </th><th>Min                                      </th></tr>
</thead>
<tbody>
<tr><td>&quot;Alan!  This is kind of you.  I thank you for coming.&quot;              </td><td>&quot;I was wrong.  It has destroyed me.&quot;     </td></tr>
<tr><td>&quot;I am glad of that.  But who drove him to it?  You, I should fancy.&quot;</td><td>&quot;We have carried their burden.&quot;          </td></tr>
<tr><td>&quot;I congratulate you.&quot;                                               </td><td>&quot;Yes, there is a gas-fire with asbestos.&quot;</td></tr>
<tr><td>&quot;I am very glad you didn&#x27;t, Harry.&quot;                                 </td><td>&quot;Decay fascinates me more.&quot;              </td></tr>
<tr><td>&quot;I trust you.&quot;                                                      </td><td>&quot;They were defeated.&quot;                    </td></tr>
</tbody>
</table>


Na célula abaixo estamos plotando os dados brutos e uma média móvel das dimensões emocionais. O tamanho da janela da média móvel pode ser definido pelo _slider_ abaixo, basta rodar a célula novamente para atualizar.


```
#@title Controle
windowSize = 16 #@param {type: "slider", min: 0, max: 100, step: 1}

rollingBook = dfBook\
    .dropna()\
    .rolling(windowSize, center = True)\
    .mean()

plotVAD(rollingBook, dfBook.dropna())
```


    
![png](Dorian_Gray_24_0.png)
    


### Sumarização

Para realizar a sumarização vamos nos utilizar de cadeias de Markov e do conceito de similaridade de cosenos.

A cadeia de Markov é um modelo que descreve a probabilidade de transição entre dois estados. Vamos modelar nosso livro como uma cadeia de Markov da seguinte maneira: cada parágrafo é um nó e a probabilidade de transição entre os parágrafos é proporcional à similaridade de cosenos dos dois parágrafos.

<!--![](https://miro.medium.com/max/875/1*j2V9mzy8EWEYsY-1clAM_w.png)-->

Após a criação da matriz de transição, nós fazemos o processo de obter a matriz estacionária, que basicamente é a aplicação da matriz de transição nela mesma até a convergência dos valores.

Com isso extraímos a probabilidade de convergir para aquele determinado estado (parágrafo, no nosso caso). A sumarização do livro é então definida como os $n$ parágrafos com maior probabilidade na convergência.


```
def cosineSimilarity(p1, p2):
    # Os exemplos que encontrei criam os vetores no nível dos parágrafos que vamos comparar
    # faz sentido, pois usar todo o conjunto só diminuiria a similaridade geral
    v1 = []
    v2 = []
    for lemma in sorted(set(p1 + p2)):
        v1.append(1) if lemma in p1 else v1.append(0)
        v2.append(1) if lemma in p2 else v2.append(0)

    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

def transMatrix(paragraphs):
    n = len(paragraphs)
    matrix = np.zeros((n, n))

    for i in range(n):
        for j in range(i, n): # A matrix é simétrica
            matrix[i][j] = cosineSimilarity(paragraphs[i], paragraphs[j])

    # Passos desnecessários para o resultado
    # mas para ser uma matriz de transição, e poder falar de probabilidade, precisamos disso
    matrix = matrix / matrix.sum(axis = 0)
    matrix = (matrix + matrix.T) / 2

    return matrix

def getStationaryProbabilities(transMatrix):
    # Source
    # http://people.duke.edu/~ccc14/sta-663-2016/homework/Homework02_Solutions.html#Part-3:-Option-2:-Using-numpy.linalg-with-transpose-to-get-the-left-eigenvectors

    P = transMatrix/np.sum(transMatrix, 1)[:, np.newaxis]
    P5000 = np.linalg.matrix_power(P, 5000)
    P5001 = np.dot(P5000, P)

    # check that P500 is stationary
    np.testing.assert_allclose(P5000, P5001)

    return P5001

def printSummary(stationaryMatrix, nParagraphs = 5, verbose = False):
    from IPython import display
    
    pIdx = (-stationaryMatrix[0]).argsort()[:nParagraphs]

    summary = '<h3>Summary of The Picture of Dorian Gray</h3>'
    for idx in pIdx:
        summary += f'<p>{originalParagraphs[idx]}</p>'

        if verbose:
            print(f'Paragraph tokens: {bookParagraphs[idx]}')
            print(f'Original paragraph: {originalParagraphs[idx]}')

    display.display(display.HTML(summary))
```


```
# Não está otimizado, então demora um pouco
# trans = transMatrix(preprocessedParagraphs)
# stationary = getStationaryProbabilities(trans)

# np.savetxt("transMatrix.csv", trans, delimiter = ",")
# np.savetxt("stationary.csv", stationary, delimiter = ",")
```


```
stationary = np.loadtxt('stationary.csv', delimiter = ',')

printSummary(stationary)
```


<h3>Summary of The Picture of Dorian Gray</h3><p> "It is your best work, Basil, the best thing you have ever done," said Lord Henry languidly.  "You must certainly send it next year to the Grosvenor.  The Academy is too large and too vulgar.  Whenever I have gone there, there have been either so many people that I have not been able to see the pictures, which was dreadful, or so many pictures that I have not been able to see the people, which was worse.  The Grosvenor is really the only place." </p><p> "Dorian Gray?  Is that his name?" asked Lord Henry, walking across the studio towards Basil Hallward. </p><p> "Not at all," answered Lord Henry, "not at all, my dear Basil.  You seem to forget that I am married, and the one charm of marriage is that it makes a life of deception absolutely necessary for both parties.  I never know where my wife is, and my wife never knows what I am doing. When we meet--we do meet occasionally, when we dine out together, or go down to the Duke's--we tell each other the most absurd stories with the most serious faces.  My wife is very good at it--much better, in fact, than I am.  She never gets confused over her dates, and I always do. But when she does find me out, she makes no row at all.  I sometimes wish she would; but she merely laughs at me." </p><p> "Too much of yourself in it! Upon my word, Basil, I didn't know you were so vain; and I really can't see any resemblance between you, with your rugged strong face and your coal-black hair, and this young Adonis, who looks as if he was made out of ivory and rose-leaves. Why, my dear Basil, he is a Narcissus, and you--well, of course you have an intellectual expression and all that.  But beauty, real beauty, ends where an intellectual expression begins.  Intellect is in itself a mode of exaggeration, and destroys the harmony of any face.  The moment one sits down to think, one becomes all nose, or all forehead, or something horrid.  Look at the successful men in any of the learned professions. How perfectly hideous they are!  Except, of course, in the Church.  But then in the Church they don't think.  A bishop keeps on saying at the age of eighty what he was told to say when he was a boy of eighteen, and as a natural consequence he always looks absolutely delightful. Your mysterious young friend, whose name you have never told me, but whose picture really fascinates me, never thinks.  I feel quite sure of that.  He is some brainless beautiful creature who should be always here in winter when we have no flowers to look at, and always here in summer when we want something to chill our intelligence.  Don't flatter yourself, Basil:  you are not in the least like him." </p><p> Lord Henry elevated his eyebrows and looked at him in amazement through the thin blue wreaths of smoke that curled up in such fanciful whorls from his heavy, opium-tainted cigarette.  "Not send it anywhere?  My dear fellow, why?  Have you any reason?  What odd chaps you painters are!  You do anything in the world to gain a reputation.  As soon as you have one, you seem to want to throw it away.  It is silly of you, for there is only one thing in the world worse than being talked about, and that is not being talked about.  A portrait like this would set you far above all the young men in England, and make the old men quite jealous, if old men are ever capable of any emotion." </p>


## Analisando a Adaptação

#### Ilustrando o VAD

Agora que vamos analisar em nível de frases de personagens, podemos ilustrar melhor os conceitos do modelo VAD nas falas dos personagens. Faremos isso pegando as frases extremas em cada dimensão.


```
#@title Controle
from tabulate import tabulate
from IPython import display

character = 'Dorian' #@param ['Alan', 'Basil', 'Butler', 'Dorian', 'Duchess', 'Geoffrey', 'Head Keeper', 'Hetty', 'James', 'Lord Henry', 'Mr. Isaacs', 'Opium Seller', 'Sybil']
dimension = 'dominance' #@param ['valence', 'arousal', 'dominance']
nParagraphs = 5 #@param {type: "slider", min: 1, max: 10, step: 1}

sorted = dfPlay[dfPlay.character == character].sort_values(dimension, ascending = False).dropna()

table = tabulate(list(zip(sorted.text.head(nParagraphs), sorted.text.tail(nParagraphs))), headers=['Max', 'Min'], tablefmt = 'html')
display.display(display.HTML(f'<h3>{character}\'s {dimension}</h3>'))
display.display(display.HTML(table))
```


<h3>Dorian's dominance</h3>



<table>
<thead>
<tr><th>Max                                                     </th><th>Min                                                                                           </th></tr>
</thead>
<tbody>
<tr><td>Am I safe here, Harry?                                  </td><td>What time is it, Victor?                                                                      </td></tr>
<tr><td>That will be all, thank you Victor.                     </td><td>Harry, you are horrible! Of course, she cried, and all that. But there is no disgrace for her.</td></tr>
<tr><td>I have an appointment somewhere else.                   </td><td>It’s too late. Too late! Too late! Far too late!                                              </td></tr>
<tr><td>Hetty, will you give me the pleasure of walking with me?</td><td>It’s a bad omen, Harry. A very bad omen.                                                      </td></tr>
<tr><td>I wonder, have you seen…                                </td><td>I beg you, Alan.                                                                              </td></tr>
</tbody>
</table>


Dos valores extremos podemos notar que eles representam bem o conceito. Com excessão de alguns que não parecem muito representativo do conceito. Acredito que isso se deva a dois fatores extremamante importantes:

- Pontuação como "?" e "!"
- Negações

Para trabalhos futuros devemos analisar mais profundamente as frases, levando em conta pontuações, por exemplo amplificar o valor caso uma exclamação seja encontrada.

Além disso, não estamos levando em conta negações nas frases, uma correção possível seria "inverter" o valor da dimensão caso uma negação esteja na sua vizinhança. Em [3], temos a sugestão de atualizar _valence_ para $5 – (V – 5)$ caso uma negação esteja próxima.

### VAD do Personagem ao Longo da Adaptação

Escolher o tamanho da janela* e personagem.

\* As janelas são menores aqui devido a quantidade de falas de cada personagem.


```
#@title Controle
windowSize = 2 #@param {type: "slider", min: 0, max: 10, step: 1}
character = 'Dorian' #@param ['Alan', 'Basil', 'Butler', 'Dorian', 'Duchess', 'Geoffrey', 'Head Keeper', 'Hetty', 'James', 'Lord Henry', 'Mr. Isaacs', 'Opium Seller', 'Sybil']

characterLines = dfPlay[dfPlay.character == character]\
    .dropna()\
    .reset_index()

rollingPlay = characterLines\
    .dropna()\
    .rolling(windowSize, center = True)\
    .mean()

plotPlayVAD(rollingPlay, characterLines, character)
```


    
![png](Dorian_Gray_34_0.png)
    


## Referências

[1] Warriner, A.B., Kuperman, V. & Brysbaert, M. Norms of valence, arousal, and dominance for 13,915 English lemmas. Behav Res 45, 1191–1207 (2013). https://doi.org/10.3758/s13428-012-0314-x

[2] Buechel, Sven & Hahn, Udo. (2016). Emotion Analysis as a Regression Problem — Dimensional Models and Their Implications on Emotion Representation and Metrical Evaluation. 10.3233/978-1-61499-672-9-1114. 

[3] Atmaja B. T., Text Emotion Recognition using Affective
Dictionary/Lexicon https://github.com/bagustris/text-vad/blob/master/report_minor3.pdf
