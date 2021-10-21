//=============================================================================
// RPG Maker MV, MZ - DBS Fixed Pictures
//=============================================================================

/*:
 * @target MV, MZ
 * @plugindesc Fix Picture.
 * @author Diogo Borges (iAmDigs)
 *
 * 
 * This plugin allows you to fix a picture in the map. 
 * 
 *   1. How to activate the plugin?
 *       Use $ before the name of the image to tell the plugin that the image
 *       should be fixed.
 *       If the image has ! before the name, use $ after exclamation.
 * 
 *      Example:
 *         $FixedImage1.png
 *         !$FixedImage2.png
 *
 * This plugin does not provide plugin commands.
 */

/*:pt-br
 * @target MV, MZ
 * @plugindesc Fix Picture.
 * @author Diogo Borges (iAmDigs)
 *
 * 
 * Este plugin permite que você fixe uma imagem no mapa. 
 * 
 *   1. Como usar o plugin?
 *       Use $ antes do nome da imagem para indicar ao plugin que a imagem
 *       deve ser fixada
 *       Se a imagem tiver ! antes do nome, use $ antes da exclamação.
 * 
 *      Exemplo:
 *         $FixedImage1.png
 *         !$FixedImage2.png
 *
 * Este plugin não fornece comandos de plugin.
 */

(() => {
  ImageManager.isFixedPicture = function (filename) {
    const sign = filename.split("/").pop().match(/^[!$]+/);
    return sign && sign[0].includes("$");
  };

  const _Sprite_Picture_updatePosition = Sprite_Picture.prototype.updatePosition;
  Sprite_Picture.prototype.updatePosition = function () {
    if (ImageManager.isFixedPicture(this.picture().name())) {
      const picture = this.picture();
      this.x = (-$gameMap.displayX() * 48) + picture.x();
      this.y = (-$gameMap.displayY() * 48) + picture.y();
      return;
    }
    _Sprite_Picture_updatePosition.call(this);
  }
})();