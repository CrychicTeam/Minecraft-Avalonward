// priority: 0
console.info("Hello, World! (Loaded server scripts)");
ItemEvents.crafted((event) => {
  const { item, inventory , player } = event;
  console.log(inventory.asContainer().getAllItems());
  player.isInWater()
});
// Just a normal test.
PlayerEvents.inventoryChanged((event) => {
  const {player} = event
  player.craete
  // server.title
})
PlayerEvents.chat((event) => {
  const {player, message} = event
  if (message === "test") {
    // FTBQuests.getQuestObjectTypes().forEach((type) => {
    //   console.log(type)
    // })
    console.log(FTBQuests.getObject(event.level,"271F91BAAB425B8B").getQuestChapter())
    // console.log(FTBQuests.getObject(event.level, "test").getPath())
  }
})

function Person (name){
  this.name = name;
}

Person.prototype.getName = function(){
  return this.name;
}

/**
 * @param {Function} Constructor
 * @param  {...any} arguments
 * @returns
 */
var obejectFactory = function(Constructor, ...arguments){
  var obj = new Object();
  Constructor = Array.prototype.shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);
  return typeof ret === 'object' ? ret : obj;
}

var a = obejectFactory(Person,'')

console.log(a.name);
console.log(a.getName());
console.log(a.__proto__);