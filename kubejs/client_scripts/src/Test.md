# Getting Started

Before we start, make sure [KubeJS] and [Create] are installed.<br>
All PonderJS scripts will be located inside the `client_scripts` folder. If you don't know where to find it, please take a look at the [KubeJS wiki].

# Type Syntax

In PonderJS some functions will need a selection, block position or a vector. The selection is an area between two positions or vectors.

KubeJS and PonderJS provide a simple syntax to pass a position or vector to a function.

Passing an array with three values `[x, y, z]` to a function that requires a selection, block position or vector will automatically wrap the array to the corresponding type.

If you want to shorthand a selection area you can pass in the following types:
- `[x1, y1, z1, x2, y2, z2]`
- `[vector1, vector2]`
- `[blockPos1, blockPos2]`
- `[[x, y, z], [x, y, z]]`

If you dislike the shorthand syntax, you can always use the functions provided in the `util` object in your Ponder scenes. You can read more about it [here](./5.-Utils).

# Ponder Tags

Ponder tags are used to group elements inside the ponder index.

## Creating a Tag

Create a new `*.js` file in `client_scripts` and add the following block:
```js
// for 1.18 pls use: onEvent("ponder.tag", event => { ... })
Ponder.tags((event) => {
    /**
     * "kubejs:getting_started" -> the tag name
     * "minecraft:paper"        -> the icon
     * "Getting Started"        -> the title
     * "This is a description"  -> the description
     * [...items]               -> default items
     */
    event.createTag("kubejs:getting_started", "minecraft:paper", "Getting started.", "We ponder now!", [
        // some default items
        "minecraft:paper",
        "minecraft:apple",
        "minecraft:emerald_block",
    ]);
});
```

Preview of the result:<br>
![](previews/ponder_index.gif)

# Ponder Scenes

## Event

Use the `ponder.registry` event to create your scenes.
```js
// for 1.18 pls use: onEvent("ponder.registry", event => { ... })
Ponder.registry((event) => {
    /**
     * Create a new ponder entry with one scene for "minecraft:paper".
     */
    event.create("minecraft:paper").scene("our_first_scene", "First example scene for paper", (scene, util) => {
        // your scene code here
    });
});
```

PonderJS will automatically use a basic 5x5 structure.<br>
You can also use custom structures by storing them as `.nbt` inside the `kubejs/assets/kubejs/ponder` folder and passing them as an additional argument to `.scene(...)`.
```js
// for 1.18 pls use: onEvent("ponder.registry", event => { ... })
Ponder.registry((event) => {
    /**
     * scene with custom structure
     */
    event
        .create("minecraft:paper")
        .scene(
            "our_first_scene",
            "Example scene for paper with structure",
            "kubejs:your_structure_id",
            (scene, util) => {
                // your scene code here
            }
        );
});
```

## Creating a Scene

This example shows how to create a simple scene with a structure, animation time and controls:
```js
// for 1.18 pls use: onEvent("ponder.registry", event => { ... })
Ponder.registry((event) => {
    event.create("minecraft:paper").scene("our_first_scene", "First example scene", (scene, util) => {
        /**
         * Shows the whole structure.
         * Alternatively, `scene.showBasePlate()` can be used to show the base plate.
         * Useful for animating different parts of the structure.
         */
        scene.showStructure();
        
        /**
         * Encapsulate the structure bounds to given positions. This is useful if the custom structure has no proper bounds.
         * scene.showStructure() automatically encapsulates the bounds.
         */
        // scene.encapsulateBounds(blockPos)

        /**
         * idle(ticks) or idleSeconds(seconds) is used to wait for a certain amount of time.
         * 20 ticks = 1 second
         */
        scene.idle(10);

        /**
         * `.createEntity()` returns an entity link from Create which will be used
         * as reference in the future
         * [x, y, z] is the position but any KubeJS way to represent a position can be used.
         *
         * Don't modify the entity directly!
         */
        const creeperLink = scene.world.createEntity("creeper", [2.5, 1, 2.5]);

        /**
         * 50 -> the tick length of the instruction
         * [x, y, z] -> the position that the text should point at
         */
        scene
            .text(60, "Example text", [2.0, 2.5, 2.5])
            /**
             * Optional | Sets the color of the text.
             * Possible values:
             * - PonderPalette.WHITE, PonderPalette.BLACK
             * - PonderPalette.RED, PonderPalette.GREEN, PonderPalette.BLUE
             * - PonderPalette.SLOW, PonderPalette.MEDIUM, PonderPalette.FAST
             * - PonderPalette.INPUT, PonderPalette.OUTPUT
             */
            .colored(PonderPalette.RED)
            /**
             * Optional | Places the text closer to the target position.
             */
            .placeNearTarget()
            /**
             * Optional | Adds a keyframe to the scene.
             */
            .attachKeyFrame();

        /**
         * 120 -> the tick length of the instruction
         * [x, y, z] -> the position that the controls should point at
         * "down" -> the direction that is used by the controls for pointing
         */
        scene
            .showControls(60, [2.5, 3, 2.5], "down")
            /**
             * Uses mouse right click as icon.
             * Alternatively, `.leftClick()` can be used
             * or `.showing(icon)` for a custom icon.
             */
            .rightClick()
            /**
             * Defines the item that should be shown with the icon.
             */
            .withItem("shears")
            /**
             * Optional | Defines that controls are only shown when sneaking.
             * `.whileSneaking()` and `withCTRL()` can not be used simultaneously.
             */
            .whileSneaking()
            /**
             * Optional | Defines that controls are only shown when holding CTRL.
             * `.whileSneaking()` and `withCTRL()` can not be used simultaneously.
             */
            .whileCTRL();
    });
});
```

Preview of the result:<br>
![](previews/first_scene.gif)

[kubejs]: https://www.curseforge.com/minecraft/mc-mods/kubejs
[create]: https://www.curseforge.com/minecraft/mc-mods/create
[kubejs wiki]: https://kubejs.com/</br>