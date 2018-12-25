const reSpecialLine = /^(\d+)\D+(\d+)[\s\w]+(?:\(([\w\s,;]+)?\))\D+(\d+)\s([a-z]+)\D+\s(\d+)$/;
const reNormalLine = /^(\d+)\D+(\d+)\D+(\d+)\s([a-z]+)\D+\s(\d+)$/;
const reSpecials = /^(immune to (\w+(,\s\w+)*);?\s?)?(weak to (\w+(,\s\w+)*))?/;

class Group {
  constructor(
    id,
    unitCount,
    hitPoints,
    attackPoints,
    attackType,
    initiative,
    immunities,
    weaknesses
  ) {
    this.id = id;
    this.unitCount = unitCount;
    this.hitPoints = hitPoints;
    this.attackPoints = attackPoints;
    this.attackType = attackType;
    this.initiative = initiative;
    this.immunities = immunities || [];
    this.weaknesses = weaknesses || [];
  }

  calcEffectivePower() {
    return this.unitCount * this.hitPoints;
  }

  selectTarget(targets) {
    if (targets.length === 0) {
      return null;
    }

    if (targets.length === 1) {
      return this.attack(targets[0]) > 0 ? targets[0].id : null;
    }

    // The attacking group chooses to target the group in the enemy army to
    // which it would deal the most damage (after accounting for weaknesses
    //  and immunities, but not accounting for whether the defending group
    // has enough units to actually receive all of that damage)
    const sorted = targets.sort((a, b) => {
      const damageDealt = this.attack(b) - this.attack(a);
      if (damageDealt !== 0) {
        return damageDealt;
      }

      // If an attacking group is considering two defending groups to which it
      // would deal equal damage, it chooses to target the defending group with
      // the largest effective power;
      const mostPowerfulTarget = b.calcEffectivePower() - a.calcEffectivePower();
      if (mostPowerfulTarget !== 0) {
        return mostPowerfulTarget;
      }

      // if there is still a tie, it chooses the
      // defending group with the highest initiative.
      return b.initiative - a.initiative;
    });

    if (this.attack(sorted[0]) > 0) {
      return sorted[0].id;
    }
    // If it cannot deal any
    // defending groups damage, it does not choose a target. Defending groups
    // can only be chosen as a target by one attacking group.
    return null;
  }

  attack(target) {
    // The damage an attacking group deals to a defending group depends on the
    // attacking group's attack type and the defending group's immunities and
    // weaknesses. By default, an attacking group would deal damage equal to
    // its effective power to the defending group. However, if the defending
    // group is immune to the attacking group's attack type, the defending
    // group instead takes no damage; if the defending group is weak to the
    // attacking group's attack type, the defending group instead takes double damage.
    if (target.immunities && target.immunities.indexOf(this.attackType) > -1) {
      return 0;
    }

    const power = this.calcEffectivePower();
    return target.weaknesses && target.weaknesses.indexOf(this.attackType) > -1 ? power * 2 : power;
  }

  static createGroup(id, line) {
    if (reSpecialLine.test(line)) {
      return createSpecialGroup(id, ...reSpecialLine.exec(line).slice(1));
    }

    if (reNormalLine.test(line)) {
      return createNormalGroup(id, ...reNormalLine.exec(line).slice(1));
    }

    return null;
  }
}

function createSpecialGroup(
  id,
  unitCount,
  hitPoints,
  specials,
  attackPoints,
  attackType,
  initiative
) {
  const parsedSpecials = parseSpecials(specials);
  return new Group(
    id,
    Number(unitCount),
    Number(hitPoints),
    Number(attackPoints),
    attackType,
    Number(initiative),
    parsedSpecials.immunities,
    parsedSpecials.weaknesses
  );
}

function parseSpecials(input) {
  const matches = reSpecials.exec(input);
  return {
    immunities: matches[2] ? matches[2].split(',').map((value) => value.trim()) : [],
    weaknesses: matches[5] ? matches[5].split(',').map((value) => value.trim()) : []
  };
}

function createNormalGroup(id, unitCount, hitPoints, attackPoints, attackType, initiative) {
  return new Group(
    id,
    Number(unitCount),
    Number(hitPoints),
    Number(attackPoints),
    attackType,
    Number(initiative)
  );
}

module.exports = Group;
