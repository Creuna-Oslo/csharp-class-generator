const fs = require('fs');
const { parse } = require('@babel/parser');
const path = require('path');
const traverse = require('@babel/traverse').default;

const getNodeOfType = require('../../utils/get-node-of-type');

const fileContent = fs.readFileSync(path.join(__dirname, 'test.tsx'), 'utf8');

const syntaxTree = parse(fileContent, {
  plugins: ['jsx', 'classProperties', 'typescript'],
  sourceType: 'module'
});

const componentName = 'Test';
const typeDeclarations = {};
let propTypeNodes;

traverse(syntaxTree, {
  TSInterfaceDeclaration: path => {
    typeDeclarations[path.node.id.name] = path.node.body.body;
  },
  TSTypeAliasDeclaration: path => {
    typeDeclarations[path.node.id.name] = path.node.typeAnnotation.members;
  },
  ClassDeclaration: path => {
    if (path.node.id.name !== componentName) return;

    const { superTypeParameters } = path.node;

    if (superTypeParameters && superTypeParameters.params) {
      const [propsType] = superTypeParameters.params;

      propTypeNodes = getNodeOfType(propsType, {
        TSTypeReference: node => typeDeclarations[node.typeName.name],
        TSTypeLiteral: node => node.members
      });
    }
  },
  ArrowFunctionExpression: path => {
    if (!path.parentPath.isVariableDeclarator()) return;
    if (path.parent.id.name !== componentName) return;

    const [argument] = path.node.params;

    if (argument && argument.typeAnnotation) {
      propTypeNodes = getNodeOfType(argument.typeAnnotation.typeAnnotation, {
        TSTypeReference: node => typeDeclarations[node.typeName.name],
        TSTypeLiteral: node => node.members
      });
    }
  }
});

if (!propTypeNodes) {
  throw new Error("Couldn't find component types");
}

const propTypes = propTypeNodes.reduce(
  (accum, typeNode) =>
    Object.assign(accum, {
      [typeNode.key.name]: typeNode.typeAnnotation.typeAnnotation
    }),
  {}
);