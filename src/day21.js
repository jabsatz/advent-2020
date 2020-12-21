const _ = require('lodash');
const { all } = require('lodash/fp');

const parse = input =>
  input.split('\n').map(line => {
    const [rawIngredients, rawAllergens] = line.replace(')', '').split(' (contains ');
    return { ingredients: rawIngredients.split(' '), allergens: rawAllergens.split(', ') };
  });

const getPossibleAllergens = list => {
  const possibleAllergens = {};
  list.forEach(({ ingredients, allergens }) => {
    allergens.forEach(allergen => {
      if (possibleAllergens[allergen]) {
        possibleAllergens[allergen] = possibleAllergens[allergen].filter(ingredient =>
          ingredients.includes(ingredient),
        );
      } else {
        possibleAllergens[allergen] = ingredients;
      }
    });
  });
  return possibleAllergens;
};

const part1 = input => {
  const list = parse(input);
  const possibleAllergens = getPossibleAllergens(list);

  return list.reduce((prev, { ingredients }) => {
    const withoutAllergens = ingredients.filter(ingredient => !_.values(possibleAllergens).flat().includes(ingredient));
    return prev + withoutAllergens.length;
  }, 0);
};

const buildDangerousList = possibleAllergens => {
  let list = [];

  while (true) {
    if (_.values(possibleAllergens).every(ingredients => ingredients.length === 0)) return list;

    for (const allergen in possibleAllergens) {
      const ingredients = possibleAllergens[allergen];

      if (ingredients.length === 1) {
        const dangerousIngredient = ingredients[0];
        list.push({ allergen, ingredient: dangerousIngredient });

        _.forEach(possibleAllergens, (ingredients, allergen) => {
          possibleAllergens[allergen] = ingredients.filter(ing => ing !== dangerousIngredient);
        });
      }
    }
  }
};

const part2 = input => {
  const list = parse(input);
  const possibleAllergens = getPossibleAllergens(list);

  const dangerousList = buildDangerousList(possibleAllergens);
  return _.sortBy(dangerousList, 'allergen')
    .map(({ ingredient }) => ingredient)
    .join(',');
};

module.exports = { part1, part2 };
