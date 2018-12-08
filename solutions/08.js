const fs = require('fs');
const treeParser = require('./08/treeparser.js');
const input = fs.readFileSync('data/08-input.txt', 'utf-8').split(/\s/);

console.log(input.length);

const tree = treeParser(input);

console.log('1:', sumMetadata(tree));
console.log('2:', sumNode(tree));

function sumMetadata(node) {
  const localSum = node.metadata.reduce((sum, entry) => {
    return sum + entry;
  }, 0);

  return (
    localSum +
    node.children.reduce((sum, child) => {
      return sum + sumMetadata(child);
    }, 0)
  );
}

function sumNode(node) {
  if (!node.children.length) {
    return node.metadata.reduce((sum, entry) => {
      return sum + entry;
    }, 0);
  }

  return node.metadata.reduce((sum, index) => {
    if (index === 0) {
      return sum;
    }

    if (node.children[index - 1]) {
      const nodeValue = sumNode(node.children[index - 1]);
      if (Number.isNaN(nodeValue)) {
        throw new Error();
      }
      return sum + nodeValue;
    }

    return sum;
  }, 0);
}
