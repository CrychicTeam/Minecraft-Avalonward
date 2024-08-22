// priority: 0
console.info("Hello, World! (Loaded server scripts)");
ItemEvents.crafted((event) => {
  const { item, inventory , player } = event;
  console.log(inventory.asContainer().getAllItems());
  player.isInWater()
});
// Just a normal test.