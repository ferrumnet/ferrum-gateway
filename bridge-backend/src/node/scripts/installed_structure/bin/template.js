
// Read all the config files. Replace all the keys in the template file.
// Handle special case for network:
// ___network_keys, and ___network_providers
// and also ___liquidity-levels

const OPTIONAL = ['encrypted_private_key', ]

const templateFile = process.argv[2];
const configs = process.argv[3].split(',');
let outFile = process.argv[4];

if (outFile.startsWith('--out=')) {
  outFile = outFile.replace('--out=', '');
} else {
  console.error('Outfile not found. Inlude --out=')
  process.exit(-12);
}

const fs = require('fs');

let tFile = fs.readFileSync(templateFile, 'utf8');

// Load configs
const missing = [];
configs.forEach(c => {
  const conf = fs.readFileSync(c, 'utf-8').split('\n');
  const lines = conf.filter(l => !!l && !l.startsWith('#') && l.indexOf('=') > 0);
  const vals = {};
  const misses = [];
  lines.forEach(l => {
    let [k, v] = l.split('=');
    k = k.trim();
    v = v.trim().replace('\"','');
    if (v) {
      vals[k] = v;
    }
    if (OPTIONAL.indexOf(k) < 0 && !v) {
      misses.push(`${c} ==> ${k}`);
    }});

  // Now replace the values in the template
  if (c.endsWith('providers')) {
    // All keys are providers:
    tFile = tFile.replace(/___network_providers/g, Object.keys(vals).map(k => `"${k}": "${vals[k]}"`).join(','));
    tFile = tFile.replace('___network_keys', Object.keys(vals).join(','));
  } else if (c.endsWith('liquiditylevels')) {
    tFile = tFile.replace('"___liquidity-levels":""', Object.keys(vals).map(k => `"${k}": "${vals[k]}"`).join(','));
  } else {
    Object.keys(vals).forEach(k => {
      tFile = tFile.replace(new RegExp('___' + k, 'g'), vals[k]);
    });

    misses.forEach(m => missing.push(m));
  }
});
if (!!missing.length) {
  console.error(`The following config options are required!:\n`, missing.join('\n'));
  process.exit(-1);
}
fs.writeFileSync(outFile, tFile, 'utf-8');