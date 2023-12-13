const fs = require('fs');
const { finished } = require('stream/promises');
const { parse } = require('csv-parse');

/* const getResultObjects = (resultsFile) => {
  const results = parse(resultsFile, {
    comment: '#',
    delimiter: ',',
    columns: true,
    skip_empty_lines: true,
  });

  return results;
}; */

const parseWithOptions = parse({
  comment: '#',
  delimiter: ',',
  columns: true,
  skip_empty_lines: true,
});

const getResultObjects = async (resultsFile) => {
  const results = [];

  const parser = fs.createReadStream(resultsFile).pipe(parseWithOptions);

  parser.on('readable', () => {
    let record;

    while ((record = parser.read()) !== null) {
      results.push(record);
    }
  });
  await finished(parser);

  return results;
};

module.exports = { getResultObjects };
