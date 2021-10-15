//=============================================================================
// RPG Maker MV, MZ - DBS Diagonal Move (8 directions)
//=============================================================================

/*:
 * @target MV, MZ
 * @plugindesc Move the character in 8 directions.
 * @author Diogo Borges (iAmDigs)
 *
 * @help Version 1.1 Add mouse Diagonal Move
 * 
 * This plugin allows characters to move in 8 directions in the versions of
 * RPG Maker MV and MZ.
 * 
 *   1. How to activate the plugin?
 *      The plugin is activated automatically after including it in the folder
 *      'js/plugins' from the project and its addition in the RPG Maker
 *      Plugin Manager.
 * 
 *   2. How to use diagonal animations?
 *      The plugin recognizes a sprite with diagonal animation in character
 *      files prefixed with '&' in the name. Example: '&Actor1.png'
 * 
 *      The diagonal animation must be inserted in the same image with the
 *      straight animation of the character.
 *      Also, the straight animation must always be at an even index while
 *      its diagonal animation must be at the first subsequent odd index.
 * 
 *      Example:
 *         If the straight animation is at index 0, the diagonal animation
 *         must be at index 1.
 *                                                  _______
 *      Straight animation indexes: 0,2,4,6        |0|1|2|3|
 *      Diagonal animation indexes: 1,3,5,7        |4|5|6|7|
 *                                                  ‾‾‾‾‾‾‾
 *     The diagonal animation must follow the following order: 
 *      - Bottom Left
 *      - Top Left
 *      - Bottom Right
 *      - Top Right
 * 
 * Sprites without diagonal animation and without the prefix '&' in the name
 * can be used normally with movement in 8 directions.
 * 
 * This plugin does not provide plugin commands.
 */

/*:pt-br
 * @target MV, MZ
 * @plugindesc Move o personagem em 8 direções.
 * @author Diogo Borges (iAmDigs)
 *
 * @help Versão 1.1 Diagonal Move com mouse adicionado
 * 
 * Este plugin permite a movimentação dos personagens em 8 direções nas
 * versões do RPG Maker MV e MZ.
 * 
 *   1. Como ativar o plugin?
 *      O plugin é ativado automaticamente após a inclusão do mesmo na pasta
 *      'js/plugins' do projeto e sua adição no Gerenciador de Plugin do
 *      RPG Maker.
 * 
 *   2. Como utilizar animações diagonais?
 *      O plugin reconhece um sprite com animação diagonal nos arquivos de
 *      personagens com o prefixo '&' no nome. Exemplo: '&Actor1.png'
 * 
 *      A animação diagonal deve ser inserida na mesma imagem com a animação
 *      em linha reta do personagem.
 *      Além disso, a animação em linha reta deve estar sempre em um index
 *      par enquanto sua animação diagonal deve estar no primeiro index
 *      ímpar subsequente.
 * 
 *      Exemplo:
 *         Se a animação em linha reta está no index 0, a animação diagonal
 *         deve estar no index 1.
 *                                                  _______
 *      Indexes animação linha reta: 0,2,4,6       |0|1|2|3|
 *      Indexes  animação  diagonal: 1,3,5,7       |4|5|6|7|
 *                                                  ‾‾‾‾‾‾‾
 *      A animação diagonal deve seguir a seguinte ordem: 
 *      - Inferior Esquerda
 *      - Superior Esquerda
 *      - Inferior Direita
 *      - Superior Direita
 * 
 * Sprites sem animação diagonal e sem o prefixo '&' no nome podem ser usados
 * normalmente com a movimentação em 8 direções.
 * 
 * Este plugin não fornece comandos de plugin.
 */

(() => {
  ImageManager.isDiagonalAnimatedCharacter = function (filename) {
    const sign = filename.split("/").pop().match(/^[!$&]+/);
    return sign && sign[0].includes("&");
  };

  Game_Player.prototype.isMoveDiagonal = function (direction) {
    return [1, 3, 7, 9].some(dir => dir === direction)
  };

  Game_Player.prototype.getInputDirection = function () {
    return Input.dir8;
  };

  Game_Player.prototype.executeMove = function (direction) {
    if (!this.isMoveDiagonal(direction)) return this.moveStraight(direction);

    this.moveDiagonally(...this.getDiagonalMove(direction));
  };

  Game_Player.prototype.getDiagonalMove = function (direction) {
    switch (direction) {
      case 1: return [4, 2];
      case 3: return [6, 2];
      case 7: return [4, 8];
      case 9: return [6, 8];
      default: return [0, 0];
    }
  };

  Game_CharacterBase.prototype.isCharacterIndexEven = function () {
    return this.characterIndex() % 2 === 0;
  }

  const _Game_CharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
  const _Game_CharacterBase_moveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
  const _Game_CharacterBase_setImage = Game_CharacterBase.prototype.setImage;

  Game_CharacterBase.prototype.setImage = function () {
    _Game_CharacterBase_setImage.call(this, ...arguments);
    this._isDiagonalAnimatedCharacter = ImageManager.isDiagonalAnimatedCharacter(arguments[0]);
  };

  Game_CharacterBase.prototype.moveStraight = function () {
    const isAnimated = this._isDiagonalAnimatedCharacter;

    if (isAnimated && !this.isCharacterIndexEven()) this.setImage(this.characterName(), this.characterIndex() - 1);

    _Game_CharacterBase_moveStraight.apply(this, arguments);
  };

  Game_CharacterBase.prototype.moveDiagonally = function (horz, vert) {
    _Game_CharacterBase_moveDiagonally.apply(this, arguments);

    const isAnimated = this._isDiagonalAnimatedCharacter;

    if (isAnimated) {
      if (this.isCharacterIndexEven()) this.setImage(this.characterName(), this.characterIndex() + 1);
      switch (horz) {
        case 4: this.setDirection(vert === 2 ? 2 : 4); break;
        case 6: this.setDirection(vert === 2 ? 6 : 8); break;
      }
    }
  };

  Game_Character.prototype.findDirectionTo = function (goalX, goalY) {
    const searchLimit = this.searchLimit();
    const mapWidth = $gameMap.width();
    const nodeList = [];
    const openList = [];
    const closedList = [];
    const start = {};
    let best = start;

    if (this.x === goalX && this.y === goalY) return 0;

    start.parent = null;
    start.x = this.x;
    start.y = this.y;
    start.g = 0;
    start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
    nodeList.push(start);
    openList.push(start.y * mapWidth + start.x);

    while (nodeList.length > 0) {
      let bestIndex = 0;
      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].f < nodeList[bestIndex].f) bestIndex = i;
      }

      const current = nodeList[bestIndex];
      const x1 = current.x;
      const y1 = current.y;
      const pos1 = y1 * mapWidth + x1;
      const g1 = current.g;

      nodeList.splice(bestIndex, 1);
      openList.splice(openList.indexOf(pos1), 1);
      closedList.push(pos1);

      if (current.x === goalX && current.y === goalY) {
        best = current;
        break;
      }

      if (g1 >= searchLimit) continue;

      for (let j = 0; j < 9; j++) {
        const direction = 1 + j;

        if (direction === 5) continue;

        let x2 = $gameMap.roundXWithDirection(x1, direction);
        let y2 = $gameMap.roundYWithDirection(y1, direction);

        const [horz, vert] = this.getDiagonalMove(direction);
        const isMoveDiagonal = this.isMoveDiagonal(direction);
        const canPassDiagonally = this.canPassDiagonally(x1, y1, horz, vert) && (this.canPass(x1, y1, horz) || this.canPass(x1, y1, vert));

        if (isMoveDiagonal && canPassDiagonally) {
          x2 = $gameMap.roundXWithDirection(x1, horz);
          y2 = $gameMap.roundYWithDirection(y1, vert);
        }

        if (!isMoveDiagonal && !this.canPass(x1, y1, direction)) continue;

        const pos2 = y2 * mapWidth + x2;

        if (closedList.includes(pos2)) continue;

        const g2 = g1 + 1;
        const index2 = openList.indexOf(pos2);

        if (index2 < 0 || g2 < nodeList[index2].g) {
          let neighbor = {};
          if (index2 >= 0) {
            neighbor = nodeList[index2];
          } else {
            nodeList.push(neighbor);
            openList.push(pos2);
          }
          neighbor.parent = current;
          neighbor.x = x2;
          neighbor.y = y2;
          neighbor.g = g2;
          neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
          if (!best || neighbor.f - neighbor.g < best.f - best.g) {
            best = neighbor;
          }
        }
      }
    }

    let node = best;
    while (node.parent && node.parent !== start) node = node.parent;

    const deltaX1 = $gameMap.deltaX(node.x, start.x);
    const deltaY1 = $gameMap.deltaY(node.y, start.y);

    if (deltaY1 > 0 && deltaX1 > 0) return 3;
    if (deltaY1 > 0 && deltaX1 < 0) return 1;
    if (deltaY1 < 0 && deltaX1 < 0) return 7;
    if (deltaY1 < 0 && deltaX1 > 0) return 9;

    if (deltaY1 > 0) return 2;
    if (deltaX1 < 0) return 4;
    if (deltaX1 > 0) return 6;
    if (deltaY1 < 0) return 8;

    const deltaX2 = this.deltaXFrom(goalX);
    const deltaY2 = this.deltaYFrom(goalY);

    if (Math.abs(deltaX2) > Math.abs(deltaY2)) return deltaX2 > 0 ? 4 : 6;

    if (deltaY2 !== 0) return deltaY2 > 0 ? 8 : 2;

    return 0;
  }
})();