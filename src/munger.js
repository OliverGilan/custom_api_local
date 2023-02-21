const fs = require('fs');
const data = require('./temp.json')

records = data["query_result"]
header = ['Email', 'Conversion Name', 'Conversion Time']

csv = [
  header.join(','),
  ...records.map((record) => [record['EMAIL'], record['CONVERSION_NAME'], record['CONVERSION_TIMESTAMP']].join(','))
].join('\r\n')

console.log(csv)
fs.writeFileSync('./conversions.csv', csv)
