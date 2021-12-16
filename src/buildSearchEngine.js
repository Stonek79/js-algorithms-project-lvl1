import _ from 'lodash';

const buildSearchEngine = (docs) => {
  const totalDocs = docs.length;
  const tfidf = (docValue, length) => docValue.tf() * Math.log(totalDocs / length);
  const index = docs.reduce((acc, doc) => {
    const words = _.compact(doc.text.split(new RegExp(/\W/, 'g')));
    const wordsLength = words.length;
    words
      .forEach((w) => {
        if (acc[w]) {
          if (acc[w][doc.id]) {
            acc[w][doc.id].count += 1;
            return acc[w][doc.id];
          }
          acc[w][doc.id] = { count: 1, tf() { return this.count / wordsLength; } };
          return acc[w][doc.id];
        }
        acc[w] = {
          [doc.id]: { count: 1, tf() { return this.count / wordsLength; } },
        };
        return acc[w];
      });
    return acc;
  }, {});

  const search = (words) => {
    console.log(words, index);
    const docsTfidf = words
      .toString()
      .split(' ')
      .map((i) => i && i.match(/\w+/g)[0])
      .reduce((acc, w) => {
        if (!index[w]) return acc;
        const wordsDocs = Object.entries(index[w]);
        const wordsLength = wordsDocs.length;
        wordsDocs.forEach(([k, v]) => {
          acc[k] = acc[k] ? (acc[k] += tfidf(v, wordsLength)) : tfidf(v, wordsLength);
        });
        return acc;
      }, {});
    return Object.entries(docsTfidf)
      .sort((a, b) => {
        if (a[1] < b[1]) return 1;
        if (a[1] > b[1]) return -1;
        return 0;
      })
      .map(([doc]) => doc);
  };
  return { search };
};

export default buildSearchEngine;
