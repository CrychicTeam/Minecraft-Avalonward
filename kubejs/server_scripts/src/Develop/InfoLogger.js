// priority: 100
/**
 * @author M1hono
 * @description This script prints various information from your modpack to the console.
 */
ServerEvents.commandRegistry(event => {     
    const { commands: Commands, arguments: Arguments } = event
    const availableActions = [
        'getRecipe',
        'getDamage',
        'getAttribute',
        'getEnchantment',
        'getTier',
        'getStructure',
        'getBiome',
        'getFluid',
        'getEffect',
        'getAllRegistryTypes',
        'getBlock',
        'getItem',
        'getEntityType',
        'getPotion',
        'getCustomStat',
        'getBlockEntityType',
        'getBannerPattern',
        'getRecipeSerializer',
        'getPaintingVariant',
        'getWorldPreset',
        'getConfiguredFeature',
        'getSensorType',
        'getTrimMaterial',
        'getTrimPattern',
        'getWorldgenStructureType',
        'getSoundEvent',
        'getBiomeModifier',
        'getBlockStateProviderType',
        'getMaterialRule',
        'getCommandArgumentType',
        'getStructurePiece',
        'getLootScoreProviderType',
        'getPlacedFeature',
        'getStatType',
        'getPlacementModifierType',
        'getWorldgenFeature',
        'getGlobalLootModifierSerializers',
        'getTreeDecoratorType',
        'getIntProviderType',
        'getRuleTest',
        'getNoiseSettings',
        'getBiomeSource',
        'getDensityFunctionType',
        'getChatType',
        'getProcessorList',
        'getPosRuleTest',
        'getVillagerProfession',
        'getNoise',
        'getChunkStatus',
        'getStructureModifier',
        'getStructureProcessor',
        'getFrogVariant',
        'getPointOfInterestType',
        'getLootConditionType',
        'getLootFunctionType',
        'getRootPlacerType',
        'getSchedule',
        'getLootPoolEntryType',
        'getLootNumberProviderType',
        'getMultiNoiseBiomeSourceParameterList',
        'getTemplatePool',
        'getDimension',
        'getVillagerType',
        'getDecoratedPotPatterns',
        'getFoliagePlacerType',
        'getGameEvent',
        'getFeatureSizeType',
        'getCarver',
        'getHeightProviderType',
        'getDimensionType',
        'getPositionSourceType',
        'getStructurePlacement',
        'getMemoryModuleType',
        'getLootNbtProviderType',
        'getFlatLevelGeneratorPreset',
        'getTrunkPlacerType',
        'getMenu',
        'getCreativeModeTab',
        'getCatVariant',
        'getSoftFluids',
        'getStructureSet',
        'getFluidType',
        'getParticleType',
        'getInstrument',
        'getEntityDataSerializers',
        'getActivity',
        'getMapMarkers',
        'getChunkGenerator',
        'getStructurePoolElement',
        'getBlockPredicateType',
        'getRuleBlockEntityModifier',
        'getWorldgenStructureType'
    ]
    event.register(
        Commands.literal("info")
            .then(
                Commands.argument('action', Arguments.STRING.create(event))
                // Suggest actions based on user input
                    .suggests((context, builder) => {
                        const input = context.getInput().toLowerCase().replace("/info ", "")
                        if (!input) {
                            availableActions.forEach(action => builder.suggest(action))
                        } else {
                            availableActions.forEach(action => {
                                if (action.toLowerCase().includes(input)) {
                                    builder.suggest(action)
                                }
                            })
                        }
                        return builder.buildFuture()
                    })
                    .requires(src => src.hasPermission(4))
                    .executes(ctx => {
                        const action = Arguments.STRING.getResult(ctx, "action")
                        const source = ctx.source
                        const server = source.getServer()
                        const level = source.getLevel()
    
                        if (commandActions[action]) {
                            let result = commandActions[action](level)
                            if (typeof result === 'object' && result !== null) {
                                // Reload server scripts to clear previous output.
                                server.runCommandSilent("kubejs reload server_scripts")
                                if (action === 'getTier') {
                                    console.info(action + ":\n" + result.join('\n'))
                                } else {
                                    console.info(action + ":\n" + Array.from(result).join('\n'))
                                }
                            }
                            source.sendSuccess("Output printed to console for " + action, false)
                            return 1
                        } else {
                            source.sendSuccess("Invalid command action.", false)
                            return 0
                        }
                    })
            )
        )
    })

const $TierSortingRegistry = Java.loadClass("net.minecraftforge.common.TierSortingRegistry")
const $ItemBuilder = Java.loadClass("dev.latvian.mods.kubejs.item.ItemBuilder")
// Utility function to create registry keys
const createRegistryKey = (name) => $ResourceKey.createRegistryKey(name)

/**
 * Gets all entries from a given registry key.
 * @param {$ResourceKey_} registryKey - The registry key to get entries from.
 * @param {$Level_} level - The level object.
 * @returns {Set} - A set of entries.
 */
const getRegistryEntries = (registryKey, level) => {
    const registry = level.registryAccess().registryOrThrow(registryKey)
    const entries = registry.entrySet()
    let entrySet = new Set()
    entries.forEach(entry => {
        entrySet.add(entry.getKey().location().toString())
    })

    return entrySet
}
/**
 * Gets all tiers, including custom KubeJS tiers.
 * @returns {Set} - A set of tier names.
 */
const getTiers = () => {
    const tiers = $TierSortingRegistry.getSortedTiers()
    let tierNames = tiers.map(tier => $TierSortingRegistry.getName(tier).toString())
    const customToolTiers = $ItemBuilder.TOOL_TIERS.keySet().toArray()
    const customArmorTiers = $ItemBuilder.ARMOR_TIERS.keySet().toArray()
    customToolTiers.forEach(tier => tierNames.push(tier.toString()))
    customArmorTiers.forEach(tier => tierNames.push(tier.toString()))
    return tierNames
}
/**
 * Additional function to fetch all registry types
 * @param {Object} level - The level object.
 * @returns {Set} - A set of registry types.
 */
const getAllRegistryTypes = (level) => {
    const registries = level.registryAccess().registries()
    let types = new Set()

    registries.forEach(entry => {
        types.add(entry.key().location().toString())
    })

    return types
}

const commandActions = {
    'getRecipe': (level) => getRegistryEntries(createRegistryKey("recipe_type"), level),
    'getDamage': (level) => getRegistryEntries(createRegistryKey("damage_type"), level),
    'getAttribute': (level) => getRegistryEntries(createRegistryKey("attribute"), level),
    'getEnchantment': (level) => getRegistryEntries(createRegistryKey("enchantment"), level),
    'getBiome': (level) => getRegistryEntries(createRegistryKey("worldgen/biome"), level),
    'getStructure': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/structure_type"), level),
    'getFluid': (level) => getRegistryEntries(createRegistryKey("fluid"), level),
    'getEffect': (level) => getRegistryEntries(createRegistryKey("mob_effect"), level),
    'getTier': getTiers,
    'getAllRegistryTypes': getAllRegistryTypes,
    'getBlock': (level) => getRegistryEntries(createRegistryKey("block"), level),
    'getItem': (level) => getRegistryEntries(createRegistryKey("item"), level),
    'getEntityType': (level) => getRegistryEntries(createRegistryKey("entity_type"), level),
    'getPotion': (level) => getRegistryEntries(createRegistryKey("potion"), level),
    'getCustomStat': (level) => getRegistryEntries(createRegistryKey("custom_stat"), level),
    'getBlockEntityType': (level) => getRegistryEntries(createRegistryKey("block_entity_type"), level),
    'getBannerPattern': (level) => getRegistryEntries(createRegistryKey("banner_pattern"), level),
    'getRecipeSerializer': (level) => getRegistryEntries(createRegistryKey("recipe_serializer"), level),
    'getPaintingVariant': (level) => getRegistryEntries(createRegistryKey("painting_variant"), level),
    'getWorldPreset': (level) => getRegistryEntries(createRegistryKey("worldgen/world_preset"), level),
    'getConfiguredFeature': (level) => getRegistryEntries(createRegistryKey("worldgen/configured_feature"), level),
    'getSensorType': (level) => getRegistryEntries(createRegistryKey("sensor_type"), level),
    'getTrimMaterial': (level) => getRegistryEntries(createRegistryKey("trim_material"), level),
    'getTrimPattern': (level) => getRegistryEntries(createRegistryKey("trim_pattern"), level),
    'getWorldgenStructureType': (level) => getRegistryEntries(createRegistryKey("worldgen/structure_type"), level),
    'getSoundEvent': (level) => getRegistryEntries(createRegistryKey("sound_event"), level),
    'getBiomeModifier': (level) => getRegistryEntries(createRegistryKey("forge:biome_modifier"), level),
    'getBlockStateProviderType': (level) => getRegistryEntries(createRegistryKey("worldgen/block_state_provider_type"), level),
    'getMaterialRule': (level) => getRegistryEntries(createRegistryKey("worldgen/material_rule"), level),
    'getCommandArgumentType': (level) => getRegistryEntries(createRegistryKey("command_argument_type"), level),
    'getStructurePiece': (level) => getRegistryEntries(createRegistryKey("worldgen/structure_piece"), level),
    'getLootScoreProviderType': (level) => getRegistryEntries(createRegistryKey("loot_score_provider_type"), level),
    'getPlacedFeature': (level) => getRegistryEntries(createRegistryKey("worldgen/placed_feature"), level),
    'getStatType': (level) => getRegistryEntries(createRegistryKey("stat_type"), level),
    'getPlacementModifierType': (level) => getRegistryEntries(createRegistryKey("worldgen/placement_modifier_type"), level),
    'getWorldgenFeature': (level) => getRegistryEntries(createRegistryKey("worldgen/feature"), level),
    'getGlobalLootModifierSerializers': (level) => getRegistryEntries(createRegistryKey("forge:global_loot_modifier_serializers"), level),
    'getTreeDecoratorType': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/tree_decorator_type"), level),
    'getIntProviderType': (level) => getRegistryEntries(createRegistryKey("minecraft:int_provider_type"), level),
    'getRuleTest': (level) => getRegistryEntries(createRegistryKey("minecraft:rule_test"), level),
    'getNoiseSettings': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/noise_settings"), level),
    'getBiomeSource': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/biome_source"), level),
    'getDensityFunctionType': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/density_function_type"), level),
    'getChatType': (level) => getRegistryEntries(createRegistryKey("minecraft:chat_type"), level),
    'getProcessorList': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/processor_list"), level),
    'getPosRuleTest': (level) => getRegistryEntries(createRegistryKey("minecraft:pos_rule_test"), level),
    'getVillagerProfession': (level) => getRegistryEntries(createRegistryKey("minecraft:villager_profession"), level),
    'getNoise': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/noise"), level),
    'getChunkStatus': (level) => getRegistryEntries(createRegistryKey("minecraft:chunk_status"), level),
    'getStructureModifier': (level) => getRegistryEntries(createRegistryKey("forge:structure_modifier"), level),
    'getStructureProcessor': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/structure_processor"), level),
    'getFrogVariant': (level) => getRegistryEntries(createRegistryKey("minecraft:frog_variant"), level),
    'getPointOfInterestType': (level) => getRegistryEntries(createRegistryKey("minecraft:point_of_interest_type"), level),
    'getLootConditionType': (level) => getRegistryEntries(createRegistryKey("minecraft:loot_condition_type"), level),
    'getLootFunctionType': (level) => getRegistryEntries(createRegistryKey("minecraft:loot_function_type"), level),
    'getRootPlacerType': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/root_placer_type"), level),
    'getSchedule': (level) => getRegistryEntries(createRegistryKey("minecraft:schedule"), level),
    'getLootPoolEntryType': (level) => getRegistryEntries(createRegistryKey("minecraft:loot_pool_entry_type"), level),
    'getLootNumberProviderType': (level) => getRegistryEntries(createRegistryKey("minecraft:loot_number_provider_type"), level),
    'getMultiNoiseBiomeSourceParameterList': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/multi_noise_biome_source_parameter_list"), level),
    'getTemplatePool': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/template_pool"), level),
    'getDimension': (level) => getRegistryEntries(createRegistryKey("minecraft:dimension"), level),
    'getVillagerType': (level) => getRegistryEntries(createRegistryKey("minecraft:villager_type"), level),
    'getDecoratedPotPatterns': (level) => getRegistryEntries(createRegistryKey("minecraft:decorated_pot_patterns"), level),
    'getFoliagePlacerType': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/foliage_placer_type"), level),
    'getGameEvent': (level) => getRegistryEntries(createRegistryKey("minecraft:game_event"), level),
    'getFeatureSizeType': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/feature_size_type"), level),
    'getCarver': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/carver"), level),
    'getHeightProviderType': (level) => getRegistryEntries(createRegistryKey("minecraft:height_provider_type"), level),
    'getDimensionType': (level) => getRegistryEntries(createRegistryKey("minecraft:dimension_type"), level),
    'getPositionSourceType': (level) => getRegistryEntries(createRegistryKey("minecraft:position_source_type"), level),
    'getStructurePlacement': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/structure_placement"), level),
    'getMemoryModuleType': (level) => getRegistryEntries(createRegistryKey("minecraft:memory_module_type"), level),
    'getLootNbtProviderType': (level) => getRegistryEntries(createRegistryKey("minecraft:loot_nbt_provider_type"), level),
    'getFlatLevelGeneratorPreset': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/flat_level_generator_preset"), level),
    'getTrunkPlacerType': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/trunk_placer_type"), level),
    'getMenu': (level) => getRegistryEntries(createRegistryKey("minecraft:menu"), level),
    'getCreativeModeTab': (level) => getRegistryEntries(createRegistryKey("minecraft:creative_mode_tab"), level),
    'getCatVariant': (level) => getRegistryEntries(createRegistryKey("minecraft:cat_variant"), level),
    'getSoftFluids': (level) => getRegistryEntries(createRegistryKey("moonlight:soft_fluids"), level),
    'getStructureSet': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/structure_set"), level),
    'getFluidType': (level) => getRegistryEntries(createRegistryKey("forge:fluid_type"), level),
    'getParticleType': (level) => getRegistryEntries(createRegistryKey("minecraft:particle_type"), level),
    'getInstrument': (level) => getRegistryEntries(createRegistryKey("minecraft:instrument"), level),
    'getEntityDataSerializers': (level) => getRegistryEntries(createRegistryKey("forge:entity_data_serializers"), level),
    'getActivity': (level) => getRegistryEntries(createRegistryKey("minecraft:activity"), level),
    'getMapMarkers': (level) => getRegistryEntries(createRegistryKey("moonlight:map_markers"), level),
    'getChunkGenerator': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/chunk_generator"), level),
    'getStructurePoolElement': (level) => getRegistryEntries(createRegistryKey("minecraft:worldgen/structure_pool_element"), level),
    'getBlockPredicateType': (level) => getRegistryEntries(createRegistryKey("minecraft:block_predicate_type"), level),
    'getRuleBlockEntityModifier': (level) => getRegistryEntries(createRegistryKey("minecraft:rule_block_entity_modifier"), level)
}
