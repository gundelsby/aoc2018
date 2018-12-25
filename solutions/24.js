const fs = require('fs');
const input = fs.readFileSync('data/24-input.txt', 'utf-8').split(/\r?\n/);
const Group = require('./24/group.js');

const armies = buildArmies(input);
const winningArmy = fightToTheDeath(armies[0], armies[1]);

console.log('Wrong answers:', '36586 (too high)', '15444 (too low)');
console.log(
  '[1]:',
  winningArmy.reduce((sum, group) => {
    return sum + group.unitCount;
  }, 0)
);

function fightToTheDeath(armyA, armyB) {
  while (armyA.length > 0 && armyB.length > 0) {
    // armies[0] -> immune system, armies[1] -> infection

    const attacks = {};
    [
      ...decideTargets(armyA.slice(), armyB.slice()),
      ...decideTargets(armyB.slice(), armyA.slice())
    ].forEach((attack) => {
      if (attack.defender) {
        attacks[attack.attacker] = attack;
      }
    });

    console.log(Object.keys(attacks).length, 'attacks in round');

    // During the attacking phase, each group deals damage to the target it
    // selected, if any. Groups attack in decreasing order of initiative,
    // regardless of whether they are part of the infection or the immune system.
    // (If a group contains no units, it cannot attack.)
    const attackOrder = [...armyA, ...armyB].sort((a, b) => b.initiative - a.initiative);

    for (let i = 0; i < attackOrder.length; i++) {
      const attacker = attackOrder[i];
      if (!attacks[attacker.id]) {
        continue;
      }
      const defenderId = attacks[attacker.id].defender;
      if (!defenderId) {
        console.log(`No attack order for ${attacker.id}`);
        continue;
      }
      const defenderArmy = attacker.id.startsWith('armyA') ? armyB : armyA;

      const defender = defenderArmy.find((group) => group.id === defenderId);

      const damageDealt = attacker.attack(defender);
      const unitsLost = Math.floor(damageDealt / defender.hitPoints);
      defender.unitCount -= unitsLost;

      if (defender.unitCount < 1) {
        attackOrder.splice(attackOrder.findIndex((group) => group.id === defender.id), 1);
        defenderArmy.splice(defenderArmy.findIndex((group) => group.id === defender.id), 1);
      }
    }

    // The defending group only loses whole units from damage; damage is always
    // dealt in such a way that it kills the most units possible, and any
    // remaining damage to a unit that does not immediately kill it is ignored.
    // For example, if a defending group contains 10 units with 10 hit points each
    // and receives 75 damage, it loses exactly 7 units and is left with 3 units at full health.
  }

  return armies.filter((army) => army.length > 0)[0];
}

function decideTargets(attackers, defenders) {
  const attacks = [];
  // During the target selection phase, each group attempts to choose one target.
  // In decreasing order of effective power, groups choose their targets; in a tie,
  // the group with the higher initiative chooses first.
  attackers.sort(sortByPowerAndInitiative);
  attackers.forEach((attacker) => {
    const defender = attacker.selectTarget(defenders);
    console.log(`${attacker.id} selected target ${defender}`);
    if (defender) {
      attacks.push({ attacker: attacker.id, defender });
      defenders.splice(defenders.findIndex((group) => group.id === defender), 1);
    }
  });

  return attacks;
}

function sortByPowerAndInitiative(a, b) {
  const effectivePower = b.calcEffectivePower() - a.calcEffectivePower();
  return effectivePower !== 0 ? effectivePower : b.initiative - a.initiative;
}

function buildArmies(input) {
  const splitPoint = input.findIndex((value) => value.trim() === '');
  const armyA = input
    .slice(0, splitPoint)
    .map((line, index) => Group.createGroup(`armyA-${index}`, line))
    .filter((value) => value !== null);
  const armyB = input
    .slice(splitPoint)
    .map((line, index) => Group.createGroup(`armyB-${index}`, line))
    .filter((value) => value !== null);

  return [armyA, armyB];
}
