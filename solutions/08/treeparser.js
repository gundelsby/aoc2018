let position = 0;

// The tree is made up of nodes; a single, outermost node forms the tree's root,
// and it contains all other nodes in the tree (or contains nodes that contain nodes, and so on).

// Specifically, a node consists of:
// A header, which is always exactly two numbers:
// The quantity of child nodes.
// The quantity of metadata entries.
// Zero or more child nodes (as specified in the header).
// One or more metadata entries (as specified in the header).
// Each child node is itself a node that has its own header, child nodes, and metadata.

function parse(data) {
  const childCount = Number(data[position++]);
  const metaCount = Number(data[position++]);
  const children = [];
  const metadata = [];

  for (let i = 0; i < childCount; i++) {
    children.push(parse(data));
  }

  for (let i = 0; i < metaCount; i++) {
    metadata.push(Number(data[position++]));
  }

  return { children, metadata };
}

module.exports = parse;
