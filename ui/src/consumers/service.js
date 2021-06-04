import { apiPost } from './instance';

// TODO: REMOVE
const isProduction = () => process.env.NODE_ENV === 'production';

const getTiling = isProduction()
  ? async (basisOrJson) => apiPost('/tiling/init', basisOrJson)
  : async () => ({
      status: 200,
      data: {
        key: 'OgABAAABAQAAAgEAAAMBAAAFAQABAAEAAQEBAAECAQABAwEAAQQBAAIAAQACAQEAAgIBAAIDAQACBQEAAwABAAMCAQADAwEAAwQBAAMFAQAEAAEABAEBAAQCAQAEBAEABAUBAAUAAQAFAQEABQMBAAUEAQAFBQIAAQEFAQUCAAEDAQMBAgABBAMEAwIBAAEFAQUCAQADAQMBAgEABAMEAwQAAQIDAAAAAAAAAAAFAAECAwQAAAAAAAAABAAEBQABAgMEAAAAAAAABQIFAgUAAQIDBAAAAAAABAAEAAQFAAECAwQAAAAABQIFAgUCBQABAgMEAAAABAAEAAQABAUAAQIDBAAABQIFAgUCBQIFAAECAwQABAAEAAQABAAEBQABAgMEBQIFAgUCBQIFAgYAAQIDBAUAAAAAAAAABAIEAgQGAAECAwQFAAAAAAAAAgQCBAIEBgABAgMEBQAAAAAABAAEAgQCBAYAAQIDBAUAAAAAAAQCBAIEAgQGAAECAwQFAAAAAAIEAgQCBAIEBgABAgMEBQAAAAQABAAEAgQCBAYAAQIDBAUAAAAEAAQCBAIEAgQGAAECAwQFAAAABAIEAgQCBAIEBgABAgMEBQAAAgQCBAIEAgQCBAYAAQIDBAUABAAEAAQABAIEAgQGAAECAwQFAAQABAAEAgQCBAIEBgABAgMEBQAEAAQCBAIEAgQCBAYAAQIDBAUABAIEAgQCBAIEAgQGAAECAwQFAgQCBAIEAgQCBAIEAwABAAEAAQUBAAEAAwEBAAEABAM=',
        plot: {
          assumptions: [],
          crossing: [
            '01234: (0, 0), (0, 0), (0, 0), (0, 4), (0, 4)',
            '01234: (0, 0), (0, 0), (0, 0), (5, 2), (5, 2)',
            '01234: (0, 0), (0, 0), (0, 4), (0, 4), (0, 4)',
            '01234: (0, 0), (0, 0), (5, 2), (5, 2), (5, 2)',
            '01234: (0, 0), (0, 4), (0, 4), (0, 4), (0, 4)',
            '01234: (0, 0), (5, 2), (5, 2), (5, 2), (5, 2)',
            '012345: (0, 0), (0, 0), (0, 0), (0, 4), (2, 4), (2, 4)',
            '012345: (0, 0), (0, 0), (0, 0), (2, 4), (2, 4), (2, 4)',
            '012345: (0, 0), (0, 0), (0, 4), (0, 4), (2, 4), (2, 4)',
            '012345: (0, 0), (0, 0), (0, 4), (2, 4), (2, 4), (2, 4)',
            '012345: (0, 0), (0, 0), (2, 4), (2, 4), (2, 4), (2, 4)',
            '012345: (0, 0), (0, 4), (0, 4), (0, 4), (2, 4), (2, 4)',
            '012345: (0, 0), (0, 4), (0, 4), (2, 4), (2, 4), (2, 4)',
            '012345: (0, 0), (0, 4), (2, 4), (2, 4), (2, 4), (2, 4)',
            '012345: (0, 0), (2, 4), (2, 4), (2, 4), (2, 4), (2, 4)',
            '012345: (0, 4), (0, 4), (0, 4), (0, 4), (2, 4), (2, 4)',
            '012345: (0, 4), (0, 4), (0, 4), (2, 4), (2, 4), (2, 4)',
            '012345: (0, 4), (0, 4), (2, 4), (2, 4), (2, 4), (2, 4)',
            '012345: (0, 4), (2, 4), (2, 4), (2, 4), (2, 4), (2, 4)',
          ],
          label_map: { 1: 'Av(0123)', 2: 'Av(01234)', 3: 'Av(012345)' },
          matrix: [
            [' ', '●', ' ', ' ', ' ', ' '],
            ['2', ' ', '3', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', '●', ' '],
            [' ', ' ', ' ', ' ', ' ', '2'],
            [' ', ' ', ' ', '●', ' ', ' '],
            ['1', ' ', ' ', ' ', ' ', ' '],
          ],
          requirements: ['0: (1, 5)', '0: (3, 1)', '0: (4, 3)'],
        },
        tiling: {
          assumptions: [],
          class_module: 'tilings.tiling',
          comb_class: 'Tiling',
          obstructions: [
            { patt: [0], pos: [[0, 1]] },
            { patt: [0], pos: [[0, 2]] },
            { patt: [0], pos: [[0, 3]] },
            { patt: [0], pos: [[0, 5]] },
            { patt: [0], pos: [[1, 0]] },
            { patt: [0], pos: [[1, 1]] },
            { patt: [0], pos: [[1, 2]] },
            { patt: [0], pos: [[1, 3]] },
            { patt: [0], pos: [[1, 4]] },
            { patt: [0], pos: [[2, 0]] },
            { patt: [0], pos: [[2, 1]] },
            { patt: [0], pos: [[2, 2]] },
            { patt: [0], pos: [[2, 3]] },
            { patt: [0], pos: [[2, 5]] },
            { patt: [0], pos: [[3, 0]] },
            { patt: [0], pos: [[3, 2]] },
            { patt: [0], pos: [[3, 3]] },
            { patt: [0], pos: [[3, 4]] },
            { patt: [0], pos: [[3, 5]] },
            { patt: [0], pos: [[4, 0]] },
            { patt: [0], pos: [[4, 1]] },
            { patt: [0], pos: [[4, 2]] },
            { patt: [0], pos: [[4, 4]] },
            { patt: [0], pos: [[4, 5]] },
            { patt: [0], pos: [[5, 0]] },
            { patt: [0], pos: [[5, 1]] },
            { patt: [0], pos: [[5, 3]] },
            { patt: [0], pos: [[5, 4]] },
            { patt: [0], pos: [[5, 5]] },
            {
              patt: [0, 1],
              pos: [
                [1, 5],
                [1, 5],
              ],
            },
            {
              patt: [0, 1],
              pos: [
                [3, 1],
                [3, 1],
              ],
            },
            {
              patt: [0, 1],
              pos: [
                [4, 3],
                [4, 3],
              ],
            },
            {
              patt: [1, 0],
              pos: [
                [1, 5],
                [1, 5],
              ],
            },
            {
              patt: [1, 0],
              pos: [
                [3, 1],
                [3, 1],
              ],
            },
            {
              patt: [1, 0],
              pos: [
                [4, 3],
                [4, 3],
              ],
            },
            {
              patt: [0, 1, 2, 3],
              pos: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4],
              pos: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 4],
                [0, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4],
              pos: [
                [0, 0],
                [0, 0],
                [0, 0],
                [5, 2],
                [5, 2],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4],
              pos: [
                [0, 0],
                [0, 0],
                [0, 4],
                [0, 4],
                [0, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4],
              pos: [
                [0, 0],
                [0, 0],
                [5, 2],
                [5, 2],
                [5, 2],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4],
              pos: [
                [0, 0],
                [0, 4],
                [0, 4],
                [0, 4],
                [0, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4],
              pos: [
                [0, 0],
                [5, 2],
                [5, 2],
                [5, 2],
                [5, 2],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4],
              pos: [
                [0, 4],
                [0, 4],
                [0, 4],
                [0, 4],
                [0, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4],
              pos: [
                [5, 2],
                [5, 2],
                [5, 2],
                [5, 2],
                [5, 2],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 0],
                [0, 0],
                [0, 0],
                [2, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 0],
                [0, 0],
                [0, 4],
                [0, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 0],
                [0, 0],
                [0, 4],
                [2, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 0],
                [0, 0],
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 0],
                [0, 4],
                [0, 4],
                [0, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 0],
                [0, 4],
                [0, 4],
                [2, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 0],
                [0, 4],
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 0],
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 4],
                [0, 4],
                [0, 4],
                [0, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 4],
                [0, 4],
                [0, 4],
                [2, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 4],
                [0, 4],
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [0, 4],
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 4],
              ],
            },
            {
              patt: [0, 1, 2, 3, 4, 5],
              pos: [
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 4],
                [2, 4],
              ],
            },
          ],
          requirements: [
            [{ patt: [0], pos: [[1, 5]] }],
            [{ patt: [0], pos: [[3, 1]] }],
            [{ patt: [0], pos: [[4, 3]] }],
          ],
        },
        verified: null,
      },
    });

const randomRule = async (tilingJson) => apiPost('/tiling/randomrule', tilingJson);

export { getTiling, randomRule };
