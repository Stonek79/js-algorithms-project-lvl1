import compact from 'lodash/compact';

const buildSearchEngine = (docs) => {
  const totalDocs = docs.length;
  const tfidf = (docValue, length) => docValue.tf() * Math.log1p(totalDocs / length);

  const index = docs.reduce((acc, doc) => {
    const words = compact(doc.text.toLowerCase().split(new RegExp(/\W/, 'g')));
    const wordsLength = words.length;
    words
      .forEach((word) => {
        if (acc[word]) {
          if (acc[word][doc.id]) {
            acc[word][doc.id].count += 1;
            return acc[word][doc.id];
          }
          acc[word][doc.id] = { count: 1, tf() { return this.count / wordsLength; } };
          return acc[word][doc.id];
        }
        acc[word] = {
          [doc.id]: { count: 1, tf() { return this.count / wordsLength; } },
        };

        return acc[word];
      });
    return acc;
  }, {});

  const search = (words) => {
    const docsTfidf = words
      .toString()
      .split(' ')
      .map((i) => i && i.match(/\w+/g)[0])
      .reduce((acc, word) => {
        if (!index[word]) return acc;

        const wordsDocs = Object.entries(index[word]);
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
