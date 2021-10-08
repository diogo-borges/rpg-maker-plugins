//=============================================================================
// RPG Maker MV, MZ - DBS Diagonal Move (8 directions)
//=============================================================================

/*:
 * @target MV, MZ
 * @plugindesc Move the character in 8 directions.
 * @author Diogo Borges (iAmDigs)
 *
 * @help 
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
 * @help 
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
    const sign = filename.split("/").pop().match(/^[&]+/);
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
    }
  };

  Game_CharacterBase.prototype.isCharacterIndexEven = function () {
    return this.characterIndex() % 2 === 0;
  }

  const _Game_CharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
  const _Game_CharacterBase_moveDiagonally = Game_CharacterBase.prototype.moveDiagonally;

  Game_CharacterBase.prototype.moveStraight = function () {
    const isAnimated = ImageManager.isDiagonalAnimatedCharacter(this.characterName());

    if (isAnimated && !this.isCharacterIndexEven()) this.setImage(this.characterName(), this.characterIndex() - 1);

    _Game_CharacterBase_moveStraight.apply(this, arguments);
  };

  Game_CharacterBase.prototype.moveDiagonally = function (horz, vert) {
    _Game_CharacterBase_moveDiagonally.apply(this, arguments);
    
    const isAnimated = ImageManager.isDiagonalAnimatedCharacter(this.characterName());

    if (isAnimated) {
      if (this.isCharacterIndexEven()) this.setImage(this.characterName(), this.characterIndex() + 1);
      switch (horz) {
        case 4: this.setDirection(vert === 2 ? 2 : 4); break;
        case 6: this.setDirection(vert === 2 ? 6 : 8); break;
      }
    }
  };
})();