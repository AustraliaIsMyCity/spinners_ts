<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>spinner_concept</title>
  <link rel="stylesheet" href="https://stackedit.io/style.css" />
</head>

<body class="stackedit">
  <div class="stackedit__html"><h1 id="spinners">Spinners</h1>
<ul>
<li><strong>Name to be decided…</strong></li>
<li><strong>C1, C2,…</strong> -  core mechanic</li>
<li><strong>F1, F2,…</strong> - feature that could be added</li>
<li><strong>A1, A2,…</strong> - important decision</li>
</ul>
<h2 id="introduction">Introduction</h2>
<p>This gamemode can be classified as an <strong>Arena Survival</strong> game mode, where your primary goal is to survive waves of enemies as long as possible.<br>
Your tool for self-defense is a spinning ring of weapon slots around your hero, that automatically fires projectiles, according to the equipped weapons. Even though the attacks are automatic, the player needs to activly dodge enemies and their attacks, while repositioning himself to get advantageous attack positions.</p>
<h2 id="core-gemapley">Core Gemapley</h2>
<p><strong>C1</strong><br>
You start the game in your own arena, where you stay most of time though the game.<br>
The arena is square and the player can move freely, but can’t leave it on own will.<br>
Enemies will only be present during a wave. A wave is counted as complete, if all enemies are defeated. Waves get stronger as the game progresses.<br>
<strong>C2</strong><br>
There is time between waves, that the players can use for various actions. A new wave starts if the player confirms he is ready, or when a timer expired. Waves always start at the same time for all players. After defeating a wave, rewards may be given to the player.<br>
<strong>C3</strong><br>
The player takes damage if he gets in contact with enemy units. This will kill the unit and deal damage to the player, equal to their health remaining. Damaged enemies do less damage on contact.<br>
<strong>C4</strong><br>
If the player takes fatal damage, the wave ends instantly and the player is resurrected. This can happen up to X times (preferable <strong>3</strong>).  If this would happen once more, the player drops out of the game, can leave or continue as spectator. Once he failed to complete a wave and is resurrected, he can either repeat the same wave again or go directly to the next one (like everyone else).<br>
<strong>C5</strong><br>
The game progresses endlessly, so it will always finsish with the last player dying X times.<br>
<strong>C6</strong><br>
Heroes also have abilities that have minor gameplay impact. but can be great tool for various serious situations. E.g. a short range blink, temporary slot spin stop, etc…</p>
<h2 id="weapons">Weapons</h2>
<p><strong>C10</strong><br>
Weapons are the deciding factor of the game. A weapon is an item that the player can equip in one of his <strong>8</strong> weapon slots around the hero (in a special interface). Weapons are non-physical items and are stored in an infinite seperate inventory.<br>
<strong>C11</strong><br>
The slots around the hero are continously spinning with a constant speed in the same direction (if not influenced by abilities, etc) though the whole game. In each slot, only one weapon can be equipped. Weapons can be rearranged and unequipped at any time.<br>
<strong>C12</strong><br>
Each weapon has an internal cooldown, which defines the interval for its activation. While the activation effect may be very different from weapon to weapon, it will fire a projectile of some sort in the most cases. Weapons with the same interval get synchronized to be equally activated along the ring.<br>
<strong>C13</strong><br>
Weapons can be classified under certain categories: <strong>Element</strong> and <strong>Rarity</strong>.<br>
Each weapon has a rarity, starting with <em>Basic</em> as the weakest. Further more there are <em>Advanced</em>, <em>Expert</em> and <em>Master</em> weapons. Rarity generally tells how strong a weapon is or how much potential it can have.<br>
<strong>C14</strong><br>
Weapons also have an element, but some may have none and others multiple. There are 8 elements in total: <em>Fire, Water, Earth, Wind, Ice, Electricity, Chaos</em> and <em>Order</em>. Weapons with the same element share distinctive properties and have similiar effects in general.<br>
<strong>C15</strong><br>
There is one <em>Basic</em> weapon for each element. The player will start its game with a selection of multiples of these weapons. They are typically pretty weak, but can manage to deal with early waves.<br>
<strong>C16</strong><br>
Each weapon can also be <em>upgraded</em>. An upgrade costs gold and empowers the weapon by increasing (or decreasing) the values of the weapon (like damage, etc). Each weapon can be upgraded <strong>10</strong> times, before it reaches its maximum level. The upgrade cost is increasing with higher levels.<br>
<strong>C17</strong><br>
If a weapon has reached its maximum level, it can be <em>enchanted</em>. This will raise the maximum level by 10 and can unlock different traits or effects of the weapon (weapon-dependent). This can be made multiple times. <em>Enchanting</em> a weapon costs gold based on a multiple of the last upgrade cost.<br>
<strong>C18</strong><br>
Weapons can be destroyed to get a <strong>Weapon Core</strong>. A weapon core is a material that is used to create new weapons. Weapon cores always have a single element and can either be <em>Basic</em>, <em>Advanced</em> or <em>Expert</em>. The element of the weapon core depends on the weapon destroyed. For weapons with multiple elements, a random element will be chosen. Weapons without an element can’t be destroyed. The rarity of the cores also reflects the rarity of the destroyed weapon.<br>
<strong>F1</strong><br>
Weapon cores are physical items, that are placed in the players inventory (no stash, so max of 9 cores).<br>
<strong>C19</strong><br>
Most weapons can also <em>evolve</em> into higher rarity weapons (<em>Master</em> weapons can’t evolve as well as some exceptions). They can evolve once they reached either their maximum level or are already enchanted. <em>Evolving</em> a weapon may cost other materials (cores) besides gold. If the weapon was upgraded further and/or enchanted mutiple times, a part of its levels will be transferred.<br>
<strong>C20</strong><br>
Weapons can be obtained from different sources. The first weapons will be granted for free at the start of the game. After each successfully complety wave, the player can choose between a selection of possible weapon rewards as well.<br>
<strong>A1</strong><br>
Weapons can also be bought at the market. Possibilities:</p>
<ul>
<li>Weapons are quite limited in the market and its only refreshed from time to time (potentially also a shared marked for versus mode)</li>
<li>Weapons are unlimited in the market and can be bought freely. They are expensive and the player might only be able to buy very few throught the whole game</li>
<li>The market is only available after several waves (like a traveling merchant). It can only be used during a short time</li>
</ul>
<p><strong>C21</strong><br>
To craft a new weapon, the player first needs to select the according recipe (in the shop; similar to dota item upgrades). The ingredients for a weapon are typically <strong>3</strong> weapons cores of the same element and lower rarity. Special weapons may require cores from different elements. The crafting process also costs gold.<br>
<strong>F2</strong><br>
Higher rarity weapon cores can be used instead if the correct one as well. <em>Example: If a recipe requires a Basic water weapon core, but you only have an Advanced water weapon core, it can be used as well</em>.<br>
<strong>C22</strong><br>
Some higher rarity weapons can also be <em>shattered</em>. This will transform the weapons to a support-like weapon. It can be equipped in a weapon slot like normal, but it won’t have any effect on its own. However it can strengthen the weapons placed in adjacent slots. All upgrades and enchantments will be kept. This process costs no gold, but it can’t be reversed.</p>
<h2 id="gamemodes">Gamemodes</h2>
<h3 id="coop">Coop</h3>
<p><strong>A2</strong></p>
<ul>
<li>Coop player count? =&gt; X</li>
<li><strong>8</strong> could be a good count.</li>
</ul>
<p><strong>C30</strong><br>
The coop gamemode is for 1-X players and requires the players coordination. It will adjust to the starting player count (boss strength, etc) and can be played solo.<br>
<strong>C31</strong><br>
A new wave will only start if all players are ready. There is no forced timer for the next wave start. After a timer of xx seconds, other players have the option to start a countdown for the new wave (can be cancelled by the causing player).<br>
<strong>C32</strong><br>
If a player dies and has no lifes left in a coop game, a part of his weapons and gold is distributed to the other players. The boss strength stays unchanged and will still be adjusted to the start player count.<br>
<strong>C33</strong><br>
After Y rounds a boss wave is incoming. For this wave, all players get teleported to a different, larger arena. They will fight through a much bigger wave until a boss spawns at a certain threshold of slayn enemies. Enemies will continue to spawn until the boss is defeated. If a player dies during this boss battle, he will be teleported back to his arena immidiatly, but doesn’t loose any life. If all players are defeated, the battle will end and every player looses <strong>2</strong> lifes. A boss round can’t be repeated.<br>
<strong>C34</strong><br>
The rewards for a boss battle are shared among all players. Each player can choose a reward from a list of possible options. Each option can only be selected once and the sequence of picks is determined by the total player damage to the boss. Defeated players get a random reward after all other player have picked theirs.<br>
<strong>F3</strong><br>
Single player tutorial, that is the same as single player coop mode, but with tips and the ability to pause the game (only enemies and your hero) at any time.</p>
<h3 id="versus">Versus</h3>
<p><strong>A3</strong></p>
<ul>
<li>Versusplayer count? =&gt; X</li>
<li>same as coop? maybe even less</li>
</ul>
<p><strong>C40</strong><br>
The versus gamemode is for 2-X players and focuses on a single player experience with competetive features.<br>
<strong>C41</strong><br>
Unlike the other modes, a game of versus will end, if only one player is remaining. This player is chosen as the winner. He may continue to play, like it was a single player game afterwards (no bosses, no battle gound).<br>
<strong>C42</strong><br>
After the first player finsished a wave a timer starts. After it expired, all still remaining enemies get stronger every second passed.<br>
<strong>C43</strong><br>
If a player dies and has no lifes left in a coop game, he will be dropped out of the game or can continue as a spectator. All of his items and gold is lost.<br>
<strong>C44</strong><br>
After Y rounds all players will be teleported to the <strong>battle grounds</strong>. This is a bigger arena where different kind of enemies will spawn constantly. These enemies get quickly stronger over time. Also players can fight each other and all weapons can also affect the enemy players. This special wave ends, if there is only one player remaining.<br>
<strong>C45</strong><br>
If a player dies during the battle grounds, he will be teleported back to his own arena, but doesn’t loose a life. If a player gets a direct kill during this time, he will be awarded with gold instantly. The dying player doesn’t loose any gold through this.<br>
<strong>C46</strong><br>
Once the battle grounds are over, rewards and penalties are given. Like in the coop boss rounds, the rewards are shared among all players. The first player can choose his reward first and this continues for all placings. Based on their standings, penalties will be given to the players who died first. Penalties may affect the enemy strength or have other negative effects for the players. Top X players don’t get penalties.</p>
<h2 id="other-ideas">Other Ideas</h2>
<h3 id="leaderboards">Leaderboards</h3>
<p><strong>F4</strong><br>
Different Leaderboards for coop, single player, and versus. Will be based on maximum wave and the total time spend to get there.</p>
<h3 id="progression">Progression</h3>
<p><strong>C50</strong><br>
There should also be some kind of progressions, that allows the players to maintain some progress from previous attempts. This progress is linked to the players profile and is saved through all games.<br>
<strong>C51</strong><br>
<em>Difficulty levels</em> can be unlocked, if the player reaches a certain wave count in single player or coop mode. At the start of the game a difficulty level can be selected. Higher difficulties increase the enemies strength and can activate hidden abilities, etc.<br>
<strong>C52</strong><br>
<em>Player levels</em> can be obtained though playing any gamemode. Each game finsished rewards the player with some experience based on performance and difficulty settings. Levels are required to unlock a wider variety of weapons that are locked for new players (more complex, not neccessarily more powerful). Other cosmetic rewards may also be given.<br>
<strong>C53</strong><br>
Different heroes are available, that often a slightly different playstyle through changes in active abilities. May be unlocked through progress (time investment) or money.<br>
<strong>F5</strong><br>
A player can also obtain a <strong>Rank</strong> while playing versus games. It may rise on good permormances and get lowered with poor placings. Ranks are also visible to the leaderboards.</p>
<h2 id="monetization">Monetization</h2>
<p><strong>F6</strong><br>
<em>Supporter Pack</em> with minor ingame bonuses like: more reward options after each wave, etc. In general it helps the player to get to a specific build faster. Also cosmetic bonuses.<br>
<strong>F7</strong><br>
<em>Consumables</em> for various effects, like rerolls, bonus life (revive), etc<br>
<strong>F8</strong><br>
Various <em>Cosmetics</em>, like hero cosmetics, particle effects, alternative weapon effects, teleport effects, etc…</p>
<p><strong>Important note!</strong></p>
<ul>
<li>No active game changing options like rerolls, etc allowed in versus. They are all coop/single player only. Cosmetic changes are the only valid upgrades for versus mode.</li>
</ul>
</div>
</body>

</html>
