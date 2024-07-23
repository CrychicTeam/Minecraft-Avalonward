// priority: 0
console.info("Hello, World! (Loaded server scripts)");
ItemEvents.crafted((event) => {
  const { item, inventory } = event;
  console.log(inventory.asContainer().getAllItems());
});