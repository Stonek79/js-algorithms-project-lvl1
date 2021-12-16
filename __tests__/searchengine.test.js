/* eslint-disable no-underscore-dangle */
import { beforeAll } from '@jest/globals';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import searchEngine from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const readFile = (fileName) => fs.readFile(`${__dirname}/./__fixtures__/${fileName}`, 'utf8');
let textFiles;

beforeAll(async () => {
  const text1 = async () => ({ id: 'text1', text: await readFile('doc1.txt') });
  const text2 = async () => ({ id: 'text2', text: await readFile('doc2.txt') });
  const text3 = async () => ({ id: 'text3', text: await readFile('doc3.txt') });
  const text4 = async () => ({ id: 'text4', text: await readFile('doc4.txt') });
  textFiles = await Promise.all([text1(), text2(), text3(), text4()]);
});

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

    expect(searchData.search('shoot')).toStrictEqual(['doc1', 'doc2']);
    // expect(searchData.search('shoot!')).toStrictEqual(['doc2', 'doc1']);
    // expect(searchData.search('shooter')).toStrictEqual(['doc3', 'doc4']);
    // expect(searchData.search('shoot at me')).toStrictEqual(['doc2', 'doc1']);
    // expect(searchData.search('shoot shooter')).toStrictEqual(['doc2', 'doc3', 'doc4', 'doc1']);
    expect(searchData.search(true)).toStrictEqual(['doc4']);
  });

  test('empty', () => {
    const searchData = searchEngine([]);

    expect(searchData.search('shoot')).toStrictEqual([]);
    expect(searchData.search('')).toStrictEqual([]);
    expect(searchData.search(42)).toStrictEqual([]);
    expect(searchData.search(false)).toStrictEqual([]);
  });

  test('big texts', () => {
    const searchData = searchEngine(textFiles);

    expect(searchData.search('')).toStrictEqual([]);
    // expect(searchData.search('trash island')).toStrictEqual(['text1', 'text2', 'text4']);
  });
});
