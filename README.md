# tab2015-js
Workshop "Como eu queria ter aprendido JavaScript" apresentado no Talk a Bit 2015

Nesse guia, vamos fazer um efeito de Parallax simples, em que faremos o conteúdo subir numa velocidade maior do que o fundo quando o usuário der scroll.

## Passo 1: Identificando os elementos

No HTML, temos cada parte da página em uma tag `section`. Cada parte da página ocupa a altura da tela, no mínimo. Isso é feito com CSS, e pode ser visto no arquivo de estilo.

Vamos selecionar todas as `section`s que tem a classe `main` (essa classe foi adicionada para garantir que estamos aplicando o efeito só nos elementos corretos).

```js
var sections = document.querySelectorAll('section.main');
```

O `querySelectorAll` é uma função que retorna uma lista de nós do DOM (ao invés de um só elemento). Essa lista de nós é *parecida* com um array, mas não é exatamente igual. Vamos entender já, já.

## Passo 2: Identificando rolagem na página

Como vimos no workshop, nós podemos fazer a página responder a eventos, chamando uma função quando ele ocorrer. No caso, vamos selecionar o evento `'scroll'`. Esse evento é lançado no DOM (representado por `document`).

```js
document.addEventListener('scroll', function() {
    // Fazer algo aqui quando o usuário rolar a página
});
```

## Passo 3: Fazendo algo quando rolar

A seguir, precisamos agir ao receber esse evento. Vamos executar uma função que recebe uma `section` e, caso ela seja a seção que está sendo rolada para fora da tela, move o conteúdo um pouco para cima.

Aqui temos uma oportunidade de usar funções ao invés de estruturas de controle. As implementações de JavaScript possuem algumas funções em arrays justamente para isso. Essas funções incluem `map`, `reduce` e `forEach`. `map` e `reduce` são bem conhecidas do mundo da programação funcional (recomendo ler sobre, se não conhecer!). O `forEach` é uma função dos arrays que recebe uma função e executa essa função com cada elemento do array como argumento.

Se nossa lista de nós fosse um array, poderíamos fazer isso:

```js
// EXEMPLO APENAS
sections.forEach(someFunctionWeWillWrite);
```

O problema é que a lista é uma `NodeList`, que infelizmente não implementa essa função. Nós poderíamos fazer um simples `for`, como em outras linguagens, mas podemos também nos aproveitar da maneira (mais comum) que se implementa classes em JavaScript: protótipos. Classes em JavaScript tem um atributo `prototype`, onde seus métodos ficam definidos. Ou seja, temos como pegar a função `forEach` dos arrays com `Array.prototype.forEach`.

Ok, mas e aí? Temos uma função que vai chamar uma função em cada elemento de… de onde? Isso é uma oportunidade para falar outra coisa interessante: em JavaScript, funções também são objetos. E elas tem um método `call`, que recebe como primeiro parâmetro algo para chamar a função **em**, e depois os parâmetros para passar para a função de fato. Confuso? Vamos ver um exemplo.

```js
// EXEMPLO APENAS
someFunction.call(element, param1, param2);

element.someFunction(param1, param2);
```

No exemplo acima, as duas linhas fazem a mesma coisa dado que `element` tenha o método `someFunction`. Usamos o call para chamar o método `someFunction` num objeto que não tenha esse método.

**Finalmente**: vamos então chamar uma função que vamos criar chamada `apllyParallax` em cada elemento de `sections`.

```js
Array.prototype.forEach.call(sections, applyParallax);
```

## Passo 4: Identificando se a seção é a que está sendo rolada para fora da página

(Desculpem o título longo para o passo 4).

Vamos implementar a função `applyParallax` para receber uma seção e verificar se é nela que queremos mover o conteúdo.

Primeiramente, precisamos encontrar as coordenadas da seção em relação à tela. Para isso, vamos usar o método `getBoundingClientRect`, que retorna informações sobre a posição do elemento na janela.

```js
function applyParallax(section) {
    var rect = section.getBoundingClientRect();

    if (rect.bottom < window.innerHeight && rect.bottom > 0) {
        // Mover o conteúdo
    }
}
```

Estamos comparando se a posição do ponto inferior do elemento com a altura da janela. Se esse valor for menor que a altura, quer dizer que o elemento está saindo da janela. Mas temos também que ver se o valor é maior que 0. Caso contrário (o valor é negativo), essa seção já saiu totalmente da janela, então não faz sentido mexer mais nela.

## Passo 5: movendo o conteúdo para cima

Agora vamos mover o conteúdo para cima. Em JavaScript, podemos manipular atributos CSS dos elementos do DOM, via o atributo `style`. A ideia aqui é selecionarmos um elemento dentro da seção que contém todo o conteúdo e modificar o atributo `top` dele. O elemento a selecionar, como pode ser visto no HTML, é um `div` com classe `container`, que está dentro de todas as seções.

O atributo `top` define a posição do topo do elemento. Se este valor for negativo, ele vai ser desenhado mais acima de onde seria originalmente. Temos também de setar o valor para 0 caso não estejamos mais manipulando esta seção, para resetar a página.

```js
function applyParallax(section) {
    var rect = section.getBoundingClientRect();

    var container = section.querySelector('.container');

    if (rect.bottom < window.innerHeight && rect.bottom > 0) {
        var offset = Math.floor(rect.top + rect.height - window.innerHeight);

        container.style.top = offset + 'px';
    } else {
        container.style.top = '0px';
    }
}
```

## Passo 6: melhorando o efeito

A versão final disponível nesse guia tem 3 otimizações. Duas de efeito e uma de eficiência.

As de efeito são: começar o efeito apenas após um certo pedaço do próximo elemento começar a aparecer e diminuir a velocidade da subida (não subir 1 pixel a mais a cada 1 pixel que o usuário der scroll).

A de eficiência é o uso da `window.requestAnimationFrame` em cada chamada da função que pode mudar a posição de algum elemento. Como o evento scroll é disparado **muitas** vezes (a cada pedacinho do scroll), estamos modificando o DOM muito rápido e fazendo redesenhos frequentes. O uso de `window.requestAnimationFrame` faz com que as mudanças aconteçam menos frequentemente, apenas quando o navegador estiver pronto para redesenhar a tela.

Examine o código final de `script.js` e tente identificar como essas otimizações funcionam.

# Referências recomendadas

Colocarei aqui, como disse no workshop, referências boas sobre JavaScript, ajudando você a separar as boas práticas das más práticas difundidas pela Internet. Em breve atualizarei este arquivo com essas referências!
