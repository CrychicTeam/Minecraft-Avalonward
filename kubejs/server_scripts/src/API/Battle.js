// priority: 150
/**
 * @author M1hono
 * @description get the attack damage from the item.
 * @param {$Player_} player 
 * @param {$ItemStack_} itemStack 
 * @returns 
 */
function getItemAttackDamage(player , itemStack){
    const {
        server,
        level,
    } = player
    Item.of(itemStack.id).getAttributeModifiers("mainhand").asMap().forEach((attribute, modifier) => {
        if (attribute == "minecraft:generic.attack_damage") {
            return modifier
        }
    })
    return 1.0
}