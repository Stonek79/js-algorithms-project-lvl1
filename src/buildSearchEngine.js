const buildSearchEngine = (docs) => {
  const index = docs.reduce((acc, item) => {
    const words = item.text.split(' ');
    const wordsLength = words.length;
    words
      .map((i) => i.match(/\w+/g)[0])
      .forEach((w) => {
        if (acc[w]) {
          if (acc[w][item.id]) {
            acc[w][item.id].count += 1;
            acc[w][item.id].tf = acc[w][item.id].count / wordsLength;
            return acc[w][item.id];
          }
          acc[w][item.id] = { count: 1, tf: 1 / wordsLength };
          return acc[w][item.id];
        }
        acc[w] = { [item.id]: { count: 1, tf: 1 / wordsLength } };
        return acc[w];
      });
    return acc;
  }, {});

  console.log(index);
  const search = (words) => docs
    .map(({ id, text }) => {
      const totalMatch = words
        .split(' ')
        .map((word) => [text.match(new RegExp(`(\\b${word}\\b)`, 'g'))][0])
        .filter((i) => !!i);
      const allMatch = totalMatch.flat().filter((i) => !!i);
      return {
        id, text, totalMatch: totalMatch.length, allMatch: allMatch.length,
      };
    })
    .filter(({ allMatch }) => !!allMatch)
    .sort((a, b) => (a.allMatch < b.allMatch ? 1 : -1))
    .sort((a, b) => (a.totalMatch < b.totalMatch ? 1 : -1))
    .map(({ id }) => id);
  return { search };
};

export default buildSearchEngine;
