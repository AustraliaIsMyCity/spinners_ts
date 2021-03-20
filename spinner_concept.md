
# Spinners
- **Name to be decided...**
- **C1, C2,...** -  core mechanic
- **F1, F2,...** - feature that could be added
- **A1, A2,..** - important decision

## Introduction

This gamemode can be classified as an **Arena Survival** game mode, where your primary goal is to survive waves of enemies as long as possible.
Your tool for self-defense is a spinning ring of weapon slots around your hero, that automatically fires projectiles, according to the equipped weapons. Even though the attacks are automatic, the player needs to activly dodge enemies and their attacks, while repositioning himself to get advantageous attack positions.

## Core Gemapley

**C1**
You start the game in your own arena, where you stay most of time though the game.
The arena is square and the player can move freely, but can't leave it on own will.
Enemies will only be present during a wave. A wave is counted as complete, if all enemies are defeated. Waves get stronger as the game progresses.
**C2**
There is time between waves, that the players can use for various actions. A new wave starts if the player confirms he is ready, or when a timer expired. Waves always start at the same time for all players. After defeating a wave, rewards may be given to the player.
**C3**
The player takes damage if he gets in contact with enemy units. This will kill the unit and deal damage to the player, equal to their health remaining. Damaged enemies do less damage on contact.
**C4**
 If the player takes fatal damage, the wave ends instantly and the player is resurrected. This can happen up to X times (preferable **3**).  If this would happen once more, the player drops out of the game, can leave or continue as spectator. Once he failed to complete a wave and is resurrected, he can either repeat the same wave again or go directly to the next one (like everyone else).
 **C5**
 The game progresses endlessly, so it will always finsish with the last player dying X times.
 **C6**
 Heroes also have abilities that have minor gameplay impact. but can be great tool for various serious situations. E.g. a short range blink, temporary slot spin stop, etc...

## Weapons

**C10**
Weapons are the deciding factor of the game. A weapon is an item that the player can equip in one of his **8** weapon slots around the hero (in a special interface). Weapons are non-physical items and are stored in an infinite seperate inventory.
**C11**
The slots around the hero are constantyl spinning with a constant speed in the same direction (if not influenced by abilities, etc) though the whole game. In each slot, only one weapon can be equipped. Weapons can be rearranged and unequipped at any time.
**C12**
Each weapon has an internal cooldown, which defines the interval for its activation. While the activation effect may be very different from weapon to weapon, it will fire a projectile of some sort in the most cases. Weapons with the same interval get synchronized to be equally activated along the ring.
**C13**
Weapons can be classified under certain categories: **Element** and **Rarity**.
Each weapon has a rarity, starting with *Basic* as the weakest. Further more there are *Advanced*, *Expert* and *Msster* weapons. Rarity generally tells how strong a weapon is or how much potential it can have.
**C14**
Weapons also have an element, but some may have none and others multiple. There are 8 elements in total: *Fire, Water, Earth, Wind, Ice, Electricity, Chaos* and *Order*. Weapons with the same element share distinctive properties and have similiar effects in general.
**C15**
There is one *Basic* weapon for each element. The player will start its game with a selection of multiples of these weapons. They are typically pretty weak, but can manage to deal with early waves.
**C16**
Each weapon can also be *upgraded*. An upgrade costs gold and empowers the weapon by increasing (or decreasing) the values of the weapon (like damage, etc). Each weapon can be upgraded **10** times, before it reaches its maximum level. The upgrade cost is increasing with higher levels.
**C17**
If a weapon has reached its maximum level, it can be *enchanted*. This will raise the maximum level by 10 and can unlock different traits or effects of the weapon (weapon-dependent). This can be made multiple times. *Enchanting* a weapon costs gold based on a multiple of the last upgrade cost.
**C18**
Weapons can be destroyed to get a **Weapon Core**. A weapon core is a material that is used to create new weapons. Weapon cores always have a single element and can either be *Basic*, *Advanced* or *Expert*. The element of the weapon core depends on the weapon destroyed; for weapons with multiple elements, a random element will be choses; weapons without an element can't be destroyed. The rarity of the cores also reflects the rarity of the destroyed weapon.
**F1**
Weapon cores are physical items, that are placed in the players inventory (no stash, so max of 9 cores).
**C19**
Most weapons can also *evolve* into higher rarity weapons (*Master* weapons can't evolve as well as some exceptions). They can evolve once they reached either their maximum level or are already enchanted. *Evolving* a weapon may cost other materials (cores) besides gold. If the weapon was upgraded further and/or enchanted mutiple times, a part of its levels will be transferred.
**C20**
Weapons can be obtained from different sources. The first weapons will be granted for free at the start of the game. After each successfully complety wave, the player can choose between a selection of possible weapon rewards as well.
**A1**
Weapons can also be bought at the market. Possibilities:

- Weapons are quite limited in the market and its only refreshed from time to time (potentially also a shared marked for versus mode)
- Weapons are unlimited in the market and can be bought freely. They are expensive and the player might only be able to buy very few thought the whole game
- The market is only available after several waves (like a traveling merchant). It can only be used during a short time

**C21**
To create of craft a new weapon, the player first needs to select the according recipe (in the shop; similar to dota item upgrades). The ingredients for a weapon are typically **3** weapons cores of the same element and lower rarity. Special weapons may require cores from different elements. The crafting process also costs gold.
**F2**
Higher rarity weapon cores can be used instead if the correct one as well. *Example: If a recipe requires an Basic water waepon core, but you only have an Advanced water weapon core, it can be used as well*.
**C22**
Some higher rarity weapons can also be *shattered*. This will transform the weapons a support-like weapon. It can be equipped in a weapon slot like normal, but it won't have any effect on its own. However it can strengthen the weapons placed in adjacent slots. All upgrades and enchantments will be kept. This process costs no gold, but it can't be reversed.

## Gamemodes

### Coop
**A2**
- Coop player count? => X
- **8** could be a good count.

**C30**
The coop gamemode is for 1-X players and requires the players coordination. It will adjust to the starting player count (boss strength, etc) and can be played solo.
**C31**
A new wave will only start if all players are ready. There is forced timer for the next wave start. After a timer of xx seconds, other players have the option to start a countdown for the new wave (can be cancelled by the causing player).
**C32**
If a player dies and has no lifes left in a coop game, a part of his weapons and gold is distributed to the other players. The boss strength stays unchanged and will still be adjusted to the start player count.
**C33**
After Y rounds a boss wave is incoming. For this wave, all players get teleported to a different, larger arena. They will fight through a much bigger wave until a boss spawns at a certain threshold of slayn enemies. Enemies will continue to spawn until the boss is defeated. If a player dies during this boss battle, he will be teleported back to hi arena immidiatly, but doesn't loose any life. If all players are defeated, the battle will end and every player looses **2** lifes. A boss round can't be repeated.
**C34**
The rewards for a boss battle are shared among all players. Each player can choose a reward from a list of possible options. Each option can only be selected once and the sequence of picks is determined by the total player damage to the boss. Defeated players get a random reward after all other player have picked theirs.
**F3**
Single player tutorial, that is the same as single player coop mode, but with tips and the ability to pause the game (only enemies and your hero) at any time.

### Versus

**A3**
- Versusplayer count? => X
- same as coop? maybe even less

**C40**
The versus gamemode is for 2-X players and focuses on a single player experience with competetive features.
**C41**
Unlike the other modes, a game of versus will end, if only one player is remaining. This player is chosen as the winner. He may continue to play, like it was a single player game afterwards (no bosses, no battle gound).
**C43** 
If a player dies and has no lifes left in a coop game, he will be dropped out of the game or can continue as a spectator. All of his items and gold is lost.
**C44**
After Y rounds all players will be teleported to the **battle grounds**. This is a bigger arena where different kind of enemies will spawn constantly. These enemies get quickly stronger over time. Also players can fight each other and all weapons can also affect the enemy players. This special wave ends, if there is only one player remaining.
**C45**
If a player dies during the battle grounds, he will be teleported back to his own arena, but doesn't loose a life. If a player gets a direct kill during this time, he will be awarded with gold instantly. The dying player doesn't loose any gold through this.
**C46**
Once the battle grounds are over, rewards and penalties are given. Like in the coop boss rounds, the rewards are shared among all players. The first player can choose his reward first and this continues for all placings. Based on their standings, penalties will be given to the players who died first. Penalties may affect the enemy strength or have other negative effects for the players. Top X players don't get penalties.

## Other Ideas

### Leaderboards
**F4**
Different Leaderboards for coop, single player, and versus. Will be based on maximum wave and the total time spend to get there.

### Progression
**C50**
There should also be some kind of progressions, that allows the players to maintain some progress from previous attempts. This progress is linked to the players profile and is saved through all games.
**C51**
*Difficulty levels* can be unlocked, if the player reaches a certain wave count in single player or coop mode. At the start of the game a difficulty level can be selected. Higher difficulties increase the enemies strength and can activate hidden abilities, etc.
**C52**
*Player levels* can be obtained though playing any gamemode. Each game finsished rewards the player with some experience based on performance and difficulty settings. Levels are required to unlock a wider variety of weapons that are locked for new players (more complex, not neccessarily more powerful). Other cosmetic rewards may also be given.
**C53**
Different heroes are available, that often a slightly different playstyle through changes in active abilities. May be unlocked through progress (time investment) or money.
**F5**
A player can also obtain a **Rank** while playing versus games. It may rise on good permormances and get lowered with poor placings. Ranks are also visible to the leaderboards.

## Monetization

**F6**
*Supporter Pack* with minor ingame bonuses like: more reward options after each wave, etc. In general it helps the player to get to a specific build faster. Also cosmetic bonuses.
**F7**
*Consumables* for various effects, like rerolls, bonus life (revive), etc
**F8**
Various *Cosmetics*, like hero cosmetics, particle effects, alternative weapon effects, teleport effects, etc...

**Important note!**
- No active game changing options like rerolls, etc allowed in versus. They are all coop/single player only. Cosmetic changes are the only valid upgrades for versus mode.
