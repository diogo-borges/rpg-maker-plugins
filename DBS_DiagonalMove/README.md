# RPG Maker MV, MZ - DBS Diagonal Move (8 directions)

[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](https://github.com/diogo-borges/rpg-maker-plugins/blob/master/DBS_DiagonalMove/README.pt-br.md)

This plugin allows characters to move in 8 directions.

## Compatible with
 - RPG Maker MV
 - RPG Maker MZ

## Instructions

### To download the plugin
 - Open the file [DBS_DiagonalMove.js](https://github.com/diogo-borges/rpg-maker-plugins/blob/master/DBS_DiagonalMove/DBS_DiagonalMove.js)
 - Copy the source code
 - Create a new file in your project's `js/plugins` folder named DBS_DiagonalMove.js
 - Paste the source code into the new file created in the project and save


If you have GIT on your computer, use the command
```
git clone https://github.com/diogo-borges/rpg-maker-plugins/blob/master/DBS_DiagonalMove/DBS_DiagonalMove.js
```

---

### How to activate the plugin?
The plugin is activated automatically after including it in the folder `js/plugins` from the project and its addition in the RPG Maker **Plugin Manager**.

---

### How to use diagonal animations?
The plugin recognizes a sprite with diagonal animation in character files prefixed with `&` in the name.

**Example:** `&Actor1.png`

The diagonal animation must be inserted in the same image with the straight animation of the character. 

Also, the straight animation must always be at an even index while its diagonal animation must be at the first subsequent odd index.

**Example:**
If the straight animation is at index 0, the diagonal animation must be at index 1.

```
                                                   _______
       Straight animation indexes: 0,2,4,6        |0|1|2|3|
       Diagonal animation indexes: 1,3,5,7        |4|5|6|7|
                                                   ‾‾‾‾‾‾‾    
```   
       
**The diagonal animation must follow the following order:**
- Bottom Left
- Top Left
- Bottom Right
- Top Right
  
---

Sprites without diagonal animation and without the prefix `&` in the name can be used normally with movement in 8 directions.

This plugin does not provide plugin commands.

---
##### By @diogo-borges (iAmDigs)