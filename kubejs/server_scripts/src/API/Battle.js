// priority: 150
import { $TooltipFlag } from "packages/net/minecraft/world/item/$TooltipFlag";
/**
 * @author M1hono
 * ! This function is not recommended to use because it is cursed and might have performant issue.
 * @description get the attack damage from item's tooltip.
 * @param {$Player} player 
 * @param {$ItemStack} itemStack 
 * @returns {float} attack damage
 */
function getItemAttackDamageFromTooltip(player, itemStack) {
    const tooltips = itemStack.getTooltipLines(player, $TooltipFlag.NORMAL)
    for (let i = 0; i < tooltips.size(); i++) {
        let component = tooltips.get(i)
        let siblings = component.getSiblings()
        for (let j = 0; j < siblings.size(); j++) {
            let sibling = siblings.get(j)
            if (sibling.toString().contains("attack_damage")) {
                let attackDamage = parseFloat(tooltips.get(i).toFlatList().get(1).getString())
                return attackDamage
            }
        }
    }
    return 1.0
}
import { $ServerPlayer } from "packages/net/minecraft/server/level/$ServerPlayer";
import { $EquipmentSlot } from "packages/net/minecraft/world/entity/$EquipmentSlot";
import { $MobType } from "packages/net/minecraft/world/entity/$MobType";
import { $Player } from "packages/net/minecraft/world/entity/player/$Player";
import { $Item } from "packages/net/minecraft/world/item/$Item";
import { $ItemStack } from "packages/net/minecraft/world/item/$ItemStack";
import { $EnchantmentHelper } from "packages/net/minecraft/world/item/enchantment/$EnchantmentHelper";
/**
 * @author M1hono
 * @description get the attack damage from the item.
 * @param {$Player} player 
 * @param {$ItemStack} itemStack 
 * @returns 
 */
function getItemAttackDamage(player , itemStack){
    const {
        server,
        level,
    } = player
    let fakeplayer = new $ServerPlayer(server , level , player.getGameProfile())
    fakeplayer.mainHandItem = itemStack
    let fakeItem = fakeplayer.mainHandItem
    if (fakeItem.getAttributeModifiers($EquipmentSlot.MAINHAND).entries().isEmpty()) {
        return 1.0
    }
    let attibutes = fakeItem.getAttributeModifiers($EquipmentSlot.MAINHAND).entries().iterator().next().getValue()
    let attackDamage = attibutes.getAmount()
    if (attibutes.getId() == $Item.BASE_ATTACK_DAMAGE_UUID) {
        attackDamage += player.getAttributeBaseValue("generic.attack_damage")
        attackDamage += $EnchantmentHelper.getDamageBonus(itemStack, $MobType.UNDEFINED)
    }
    return attackDamage
}