# RPG Maker - DBS Diagonal Move (8 direções)

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/diogo-borges/rpg-maker-plugins/blob/master/DBS_DiagonalMove/README.md)

Este plugin permite a movimentação dos personagens em 8 direções.

## Compatível com
 - RPG Maker MV
 - RPG Maker MZ

## Instruções

### Para baixar o plugin
 - Abra o arquivo [DBS_DiagonalMove.js](https://github.com/diogo-borges/rpg-maker-plugins/blob/master/DBS_DiagonalMove/DBS_DiagonalMove.js)
 - Copie o código fonte
 - Crie um novo arquivo na pasta `js/plugins` do seu projeto com o nome DBS_DiagonalMove.js
 - Cole o código fonte no novo arquivo criado no projeto e salve

---

### Como ativar o plugin?
O plugin é ativado automaticamente após a inclusão do mesmo na pasta `js/plugins` do projeto e sua adição no **Gerenciador de Plugin** do RPG Maker.

---

### Como utilizar animações diagonais?
O plugin reconhece um sprite com animação diagonal nos arquivos de personagens com o prefixo `&` no nome.

**Exemplo**: `&Actor1.png`

 A animação diagonal deve ser inserida na mesma imagem com a animação em linha reta do personagem. 
 
 Além disso, a animação em linha reta deve estar sempre em um index par enquanto sua animação diagonal deve estar no primeiro index ímpar subsequente.

**Exemplo:**
Se a animação em linha reta está no index 0, a animação diagonal deve estar no index 1.

```
                                                   _______
       Indexes animação linha reta: 0,2,4,6       |0|1|2|3|
       Indexes  animação  diagonal: 1,3,5,7       |4|5|6|7|
                                                   ‾‾‾‾‾‾‾    
```  

**A animação diagonal deve seguir a seguinte ordem**:
- Inferior Esquerda
- Superior Esquerda
- Inferior Direita
- Superior Direita
  
---

Sprites sem animação diagonal e sem o prefixo `&` no nome podem ser usados normalmente com a movimentação em 8 direções.
  
Este plugin não fornece comandos de plugin.

---
##### Por @diogo-borges (iAmDigs)
