import { $CuriosApi } from "packages/top/theillusivec4/curios/api/$CuriosApi";
import { $Player } from "packages/net/minecraft/world/entity/player/$Player";
import { $Item } from "packages/net/minecraft/world/item/$Item";
import { $ItemStack } from "packages/net/minecraft/world/item/$ItemStack";
import { $List } from "packages/java/util/$List";
/**
 * @author Eikidona | M1hono
 */
export const PlayerCurios = {
    CuriosApi: $CuriosApi,

    /**
     * 获取玩家所有装备饰品的列表
     * @param {$Player} player 
     * @returns {$List<$ItemStack>}
     */
    getAllItems: function (player) {
        return this.CuriosApi.getCuriosInventory(player).resolve().get().getEquippedCurios().getAllItems();
    },

    /**
     * 获取饰品所在饰品栏槽位
     * @param {$Player} player 
     * @param {$Item} item 
     * @returns {number}
     */
    getSlot: function (player, item) {
        return this.CuriosApi.getCuriosInventory(player).resolve().get().getEquippedCurios().find(item);
    },

    /**
     * 获取饰品是否存在
     * @param {$Player} player 
     * @param {$Item} item 
     * @returns {boolean}
     */
    isPresent: function (player, item) {
        return this.getSlot(player, item) !== -1;
    },

    /**
     * 获取指定一类的饰品所在饰品栏槽位
     * @param {$Player} player 
     * @param {$Item} item 
     * @param {string} identifier 饰品槽名称
     * @returns {number}
     */
    getSlotByIdentifier: function (player, item, identifier) {
        return this.CuriosApi.getCuriosInventory(player).resolve().get().getCurios().get(identifier).getStacks().find(item);
    },

    /**
     * 获取指定一类的饰品(距离0槽位)最近的空饰品栏槽位 如果没有则返回-1
     * @param {$Player} player 
     * @param {string} identifier 饰品槽名称
     * @returns {number}
     */
    getEmptySlotByIdentifier: function (player, identifier) {
        return this.getSlotByIdentifier(player, $Item.of('minecraft:air').getItem(), identifier);
    },

    /**
     * 获取玩家某一类饰品槽的总数量
     * @param {$Player} player 
     * @param {string} identifier 饰品槽名称
     * @returns {number}
     */
    getTotalSlotsByIdentifier: function (player, identifier) {
        return this.CuriosApi.getCuriosInventory(player).resolve().get().getCurios().get(identifier).getStacks().getSlots();
    },

    /**
     * 获取玩家某类饰品槽的已装备饰品数
     * @param {$Player} player 
     * @param {string} identifier 饰品槽名称
     * @returns {number}
     */
    getEquippedCountByIdentifier: function (player, identifier) {
        return this.CuriosApi.getCuriosInventory(player).resolve().get().getCurios().get(identifier).getStacks().count();
    },

    /**
     * 获取玩家某一类饰品槽位置的物品堆栈
     * @param {$Player} player 
     * @param {string} identifier 饰品槽名称
     * @param {number} slot
     * @returns {$ItemStack}
     */
    getStackInSlotByIdentifier: function (player, identifier, slot) {
        return this.CuriosApi.getCuriosInventory(player).resolve().get().getCurios().get(identifier).getStacks().getStackInSlot(slot);
    },

    /**
     * 获取玩家某一类所有装备饰品的列表
     * @param {$Player} player 
     * @param {string} identifier 饰品槽名称
     * @returns {$List<$ItemStack>}
     */
    getAllItemsByIdentifier: function (player, identifier) {
        return this.CuriosApi.getCuriosInventory(player).resolve().get().getCurios().get(identifier).getStacks().getAllItems();
    },

    /**
     * 设置玩家某一类饰品的指定槽的物品堆栈
     * @param {$Player} player 
     * @param {string} identifier 饰品槽名称
     * @param {number} slot 饰品槽
     * @param {$ItemStack} itemStack 
     */
    setStackInSlotByIdentifier: function (player, identifier, slot, itemStack) {
        this.CuriosApi.getCuriosInventory(player).resolve().get().setEquippedCurio(identifier, slot, itemStack);
    },

    /**
     * 获取指定饰品的信息
     * @param {$Player} player
     * @param {string} id 饰品ID
     * @returns {{hasItem: boolean, count: number, slots: number[]}}
     */
    getCurioInfo: function (player, id) {
        const curiosItems = this.getAllItems(player);
        let result = {
            hasItem: false,
            count: 0,
            slots: [],
        };

        curiosItems.forEach((stack, index) => {
            if (!stack.isEmpty() && stack.getId() === id) {
                result.hasItem = true;
                result.count += stack.getCount();
                result.slots.push(index);
            }
        });

        return result;
    },

    /**
     * 获取所有唯一的饰品项
     * @param {$Player} player
     * @returns {Array<{id: string, count: number, name: string}>}
     */
    getUniqueCuriosItems: function (player) {
        const curiosItems = this.getAllItems(player);
        const uniqueItems = {};

        curiosItems.forEach((stack) => {
            if (!stack.isEmpty()) {
                const id = stack.getId();
                if (uniqueItems[id]) {
                    uniqueItems[id].count += stack.getCount();
                } else {
                    uniqueItems[id] = {
                        id: id,
                        count: stack.getCount(),
                        name: stack.getItem().toString(),
                    };
                }
            }
        });

        return Object.values(uniqueItems);
    },

    /**
     * 检查玩家是否佩戴特定物品（支持Item对象或物品ID）
     * @param {$Player} player
     * @param {$Item | string} item
     * @returns {boolean}
     */
    isWearing: function (player, item) {
        if (typeof item === 'string') {
            return this.getCurioInfo(player, item).hasItem;
        }
        return this.isPresent(player, item);
    },

    /**
     * 获取特定饰品的总数量
     * @param {$Player} player
     * @param {string} itemId
     * @returns {number}
     */
    getCurioItemCount: function (player, itemId) {
        return this.getCurioInfo(player, itemId).count;
    },

    /**
     * 获取指定identifier的饰品槽信息
     * @param {$Player} player 
     * @param {string} identifier 饰品槽名称
     * @returns {{totalSlots: number, equippedCount: number, emptySlot: number}}
     */
    getIdentifierInfo: function (player, identifier) {
        return {
            totalSlots: this.getTotalSlotsByIdentifier(player, identifier),
            equippedCount: this.getEquippedCountByIdentifier(player, identifier),
            emptySlot: this.getEmptySlotByIdentifier(player, identifier)
        };
    },

    /**
     * 批量检查多个饰品是否存在
     * @param {$Player} player
     * @param {string[]} itemIds
     * @returns {Object<string, boolean>}
     */
    areItemsPresent: function (player, itemIds) {
        const result = {};
        itemIds.forEach(id => {
            result[id] = this.isWearing(player, id);
        });
        return result;
    },

    /**
     * 安全地获取饰品栏物品，如果不存在则返回空ItemStack
     * @param {$Player} player 
     * @param {string} identifier 
     * @param {number} slot 
     * @returns {$ItemStack}
     */
    safeGetCurioStack: function (player, identifier, slot) {
        try {
            return this.getStackInSlotByIdentifier(player, identifier, slot);
        } catch (error) {
            console.warn(`Failed to get curio stack: ${error.message}`);
            return $ItemStack.EMPTY;
        }
    },

    /**
     * 饰品槽操作方法
     * @param {"shrink"|"grow"|"getfor"|"setfor"|"unlock"|"lock"} method 
     * @param {string} slot 
     * @param {$Player} player 
     * @param {number} [amount] 
     * @returns {number|void}
     */
    slotOperation: function(method, slot, player, amount) {
        const slotHelper = this.CuriosApi.getSlotHelper();
        switch(method) {
            case "shrink":
                slotHelper.shrinkSlotType(slot, amount, player);
                break;
            case "grow":
                slotHelper.growSlotType(slot, amount, player);
                break;
            case "getfor":
                return slotHelper.getSlotsForType(player, slot);
            case "setfor":
                slotHelper.setSlotsForType(slot, player, amount);
                break;
            case "unlock":
                slotHelper.unlockSlotType(slot, player);
                break;
            case "lock":
                slotHelper.lockSlotType(slot, player);
                break;
            default:
                throw new Error(`Invalid method: ${method}`);
        }
    }
};