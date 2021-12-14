import searchEngine from '../bin/searchengine.js';

const doc1 = {
  id: 'doc1',
  text: "I can't shoot! straight unless I've had a pint!",
};
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const doc4 = { id: 'doc4', text: "I'm true shooter." };
const docs = [doc1, doc2, doc3, doc4];

describe('Search:', () => {
  test('success', () => {
    const searchData = searchEngine(docs);

    expect(searchData.search('shoot')).toStrictEqual(['doc2', 'doc1']);
    expect(searchData.search('shoot!')).toStrictEqual(['doc2', 'doc1']);
    expect(searchData.search('shooter')).toStrictEqual(['doc3', 'doc4']);
    expect(searchData.search('shoot at me')).toStrictEqual(['doc2', 'doc1']);
    expect(searchData.search('shoot shooter')).toStrictEqual(['doc2', 'doc3', 'doc4', 'doc1']);
    expect(searchData.search(true)).toStrictEqual(['doc4']);
  });

  test('empty', () => {
    const searchData = searchEngine([]);

    expect(searchData.search('shoot')).toStrictEqual([]);
    expect(searchData.search('')).toStrictEqual([]);
    expect(searchData.search(42)).toStrictEqual([]);
    expect(searchData.search(false)).toStrictEqual([]);
  });
});
