const { parse } = require('@babel/parser');
const test = require('ava');

const ASTToCsharp = require('../source/utils/ast-to-csharp');

const basicTree = parse(`
  Component = {
    text: string.isRequired,
    texts: arrayOf(string),
    singleObject: SingleObject,
    objects: arrayOf(ObjectsItem).isRequired
  };
  SingleObject = {
    propertyA: string.isRequired
  };
  ObjectsItem = {
    propertyB: string
  };
`);

test('Basic tree', t => {
  t.snapshot(
    ASTToCsharp({
      syntaxTree: basicTree
    })
  );
});

test('With namespace', t => {
  t.snapshot(
    ASTToCsharp({
      namespace: 'Something.SomethingElse',
      syntaxTree: basicTree
    })
  );
});

test('With different indentation', t => {
  t.snapshot(
    ASTToCsharp({
      syntaxTree: basicTree,
      indent: 6
    })
  );
});

test('Optional enum', t => {
  t.snapshot(
    ASTToCsharp({
      syntaxTree: parse(`
      Component = {
        enum: Enum
      };
      Enum = ['value-1', 'value-2'];
    `)
    })
  );
});

test('Required enum', t => {
  t.snapshot(
    ASTToCsharp({
      syntaxTree: parse(`
        Component = {
          enum: Enum.isRequired
        };
        Enum = ['value-1', 'value-2'];
      `)
    })
  );
});

test('Enum with name starting with non-letter', t => {
  t.snapshot(
    ASTToCsharp({
      syntaxTree: parse(`
        Component = {
          enum: Enum
        };
        Enum = ['-value-1', '.value-2', '#value-3'];
      `)
    })
  );
});

test('With empty definition', t => {
  t.snapshot(
    ASTToCsharp({
      syntaxTree: parse(`
        Component = {
          property: Property
        };
        Property = {};
      `)
    })
  );
});

// Only valid function call when generating string is 'arrayOf'
test('Throws on invalid function call', t => {
  t.throws(() => {
    ASTToCsharp({
      syntaxTree: parse(`
        Component = {
          prop: shape(string)
        }
      `)
    });
  });
});

test('Throws on bad component reference in arrayOf', t => {
  t.throws(() => {
    ASTToCsharp({
      syntaxTree: parse(`
        Component = {
          prop: arrayOf(AnotherComponent.propTypes)
        }
      `)
    });
  });
});
