# PropTypes to class generator

[![npm version](https://img.shields.io/npm/v/@creuna/prop-types-csharp.svg)](https://npmjs.com/package/@creuna/prop-types-csharp)
[![Travis status](https://travis-ci.org/Creuna-Oslo/prop-types-csharp.svg?branch=master)](https://travis-ci.org/Creuna-Oslo/prop-types-csharp)
[![Coverage Status](https://coveralls.io/repos/github/Creuna-Oslo/prop-types-csharp/badge.svg?branch=master)](https://coveralls.io/github/Creuna-Oslo/prop-types-csharp?branch=master)

This package has tools for generating classes from React components using propTypes. Curently supports javascript or typescript source and C#, Kotlin or Typescript output.

## Table of contents

- [TLDR config](#tldr)
- [General concepts](#general)
- [Typescript](#typescript)
- [About generated classes](#classes)
- [Node.js API](#node)
- [Webpack plugin](#webpack)
- [Babel plugin](#babel)
- [eslint plugin](#eslint)

## Install

```
npm install --save-dev @creuna/prop-types-csharp
```

## <a id="tldr"></a> TLDR config

### Webpack plugin

Config example. See complete list of options [below](#webpack)

```js
const PropTypesCSharpPlugin = require('@creuna/prop-types-csharp/webpack-plugin');
const { generators, parsers } = require('@creuna/prop-types-csharp');

module.exports = {
  entry: { ... },
  output: { ... },
  plugins: [
    new PropTypesCSharpPlugin({
      exclude: ['node_modules', 'some/path/to/exclude'],
      compilerOptions: {
        parser: parsers.typescript, // Optional
        generator: generators.kotlin // Optional
      }
    })
  ]
};
```

### Babel plugin

Read more [below](#babel)

```json
{
  "plugins": ["@creuna/prop-types-csharp/babel-plugin"]
}
```

### Eslint plugin

Read more [below](#eslint)

`npm install --save-dev @creuna/eslint-plugin-prop-types-csharp`

```json
{
  "plugins": ["@creuna/eslint-plugin-prop-types-csharp"],
  "rules": {
    "@creuna/prop-types-csharp/all": 2
  }
}
```

## <a id="general"></a> General concepts

### Ignored props

Props of type `func`, `element`, `node` and `instanceOf` are ignored when creating classes because they make no sense in server-land.

### Unsupported propTypes

Some propTypes are ambiguous and cannot be used for class generation.

**PropTypes.object**

`object` should be replaced with `shape` or a `propTypesMeta` definition. Using the propTypes of another component is usually the best choice when passing props to child components:

```jsx
const Component = ({ link }) => <Link {...link} />;

Compontent.propTypes = {
  link: PropTypes.shape(Link.propTypes) // Reference to Link component
};
```

The above example will result in a class that has a reference to the class for `Link`, which means the definition of `Link` is now re-used which is nice:

```cs
public class Component {
  public Link Link { get; set; }
}
```

**PropTypes.array**

`array` should be replaced by an `arrayOf` or have a `propTypesMeta` definition.

**PropTypes.any**

Use a different type or a `propTypesMeta` definition.

**PropTypes.symbol**

Use a different type or a `propTypesMeta` definition.

### propTypesMeta (`String | Object`)

#### `String`

The only supported string value for `propTypesmeta` is `'exclude'`. When `Component.propTypesMeta = 'exclude';`, no class will be generated for the component.

#### `Object`

In general, it's recommended to define as much as possible in `propTypes`. In some cases however, that might be difficult, and in those cases `propTypesMeta` can be helpful.

`propTypesMeta` can be used to exclude some props from classes or to provide type hints for ambiguous types.

Supported values for props in `propTypesMeta` are

- `"int"`
- `"int?"`
- `"float"`
- `"float?"`
- `"double"`
- `"double?"`
- `"exclude"`
- React component
- `(< React component > | Object)[]`

`"int"`, `"float"`, `"double"` and their nullable counterparts replace `PropTypes.number` if supplied. By default, `PropTypes.number` will result in `int` in classes.

Functional component:

```jsx
const Component = () => <div />;

Component.propTypes = {
  someProp: PropTypes.number,
  anotherProp: PropTypes.string,
  someComponent: PropTypes.object,
  items: PropTypes.array,
  numbers: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number
    })
  )
};

Component.propTypesMeta = {
  someProp: "float",
  anotherProp: "exclude",
  someComponent: SomeComponent,
  items: [AnotherComponent],
  numbers: [{ number: "float" }]
};
```

Class component:

```jsx
class Component extends React.Component {
  static propTypes = {
    someProp: PropTypes.number,
    anotherProp: PropTypes.string,
    someComponent: PropTypes.object,
    items: PropTypes.array,
    numbers: PropTypes.arrayOf(
      PropTypes.shape({
        number: PropTypes.number
      })
    )
  };

  static propTypesMeta = {
    someProp: "float",
    anotherProp: "exclude",
    someComponent: SomeComponent,
    items: [AnotherComponent],
    numbers: [{ number "float" }]
  };
}
```

### Inheritance

Inheritance of propTypes from other components is supported for C#. This will result in C# classes with corresponding inheritance. The `baseClass` option will be overridden when inheriting.

Simple:

```js
MyComponent.propTypes = OtherComponent.propTypes;
```

With properties:

```js
// Remember to not mutate other components' propTypes!
MyComponent.propTypes = Object.assign({}, OtherComponent.propTypes, {
  foo: PropTypes.string,
  bar: PropTypes.number
});
```

Referencing a single property:

```js
MyComponent.propTypes: {
  items: OtherComponent.propTypes.items
};
```

## <a id="typescript"></a> Typescript as input language

The class generator will determine the name of the generated class based on how prop types are defined:

- the component name if a type literal is used
- the name of the interface/type alias if used

If type parameters are used the generator will attempt to use the first parameter as the type definition for the component. Keep in mind that using something other than the prop types as the first argument, class generation might succeed but the generated class will not have the right properties.

### Illegal types

As with the javascript parser, some types are not allowed because they are too ambiguous, like `object`, `any`, intersection and union types.

```tsx
const A = (props: { b: string }) => null; // Class name: A
const A: React.FunctionComponent<{ b: string }> = props => null; // Class name: A

type BProps = { c: string };
const B = (props: BProps) => null; // Class name: BProps
const B: React.FunctionComponent<BProps> = props => null; // Class name: BProps

const CProps = { d: string };
const C: SomeType<any, CProps> = props => null; // Error.
```

### PropTypesMeta

`propTypesMeta` works in mostly the same way as for javascript components, the only notable expection being the lack of support for referencing other components.

Two type aliases are exported that can be used to validate `propTypesMeta`:

```tsx
import {
  PropTypesMeta,
  WithPropTypesMeta
} from "@prop-types-csharp/prop-types-meta";

type AProps = { a: string; b: number };
class A extends React.Component<AProps> {
  static propTypesMeta: PropTypesMeta<AProps> = {
    a: "exclude",
    b: "int?"
  };
}

type BProps = { a: string; b: number };
const B: WithPropTypesMeta<BProps> = props => null;
B.propTypesMeta = { a: "exclude", b: "int?" };
```

`WithPropTypesMeta` accepts a second type parameter that can be used if stuff like `React.FunctionComponent` is needed. Usage is quite verbose so adding your own type alias might be useful.

```tsx
type BProps = { a: string; b: number };
const B: WithPropTypesMeta<BProps, React.FunctionComponent<BProps>> = props =>
  null;
```

## <a id="classes"></a> About generated classes (C#)

### Enums

Generated enums look like this:

```cs
public enum Theme
{
  [EnumMember(Value = "theme-blue")]
  ThemeBlue = 0
}
```

This allows for the passing of magic strings from C# to React. To get this working with serialization, set the following in the Application_Start:

```cs
using Newtonsoft.Json.Converters;

ReactSiteConfiguration.Configuration
  .SetJsonSerializerSettings(new JsonSerializerSettings
  {
      Converters = new List<JsonConverter> { new StringEnumConverter() }
  });
```

## About generated classes (Kotlin)

Since Kotlin doesn't have a `namespace` keyword, the `namespace` compiler option is used to prefix package names (both for imports and package definitions).

With the Kotlin generator, components can only extend other components if they have no required props. This also applies to the `baseClass` option. This is due to the fact that this compiler does static analysis of one react component at a time and therefore doesn't know what arguments to pass the constructors of other classes.

Inheriting the entire `propTypes` of another component will result in a `typealias` being created.

## <a id="node"></a>Node.js API

The Node API exports an object:

```js
{
  compile: function(sourceCode, options){} // Creates a class string,
  generators: {
    csharp: function(){},
    kotlin: function(){},
    typescript: function(){}
  },
  parsers: {
    javascript: function(){},
    typescript: function(){}
  }
}
```

### compile(_sourceCode, options_)

#### Returns

Returns an `object` containing:

**className**: `String`
Name of React component (derived from export declaration).

**code**: `String`
Source code to generate class from.

#### sourceCode: _String_

Source code of a React component as string.

#### <a id="compiler-options"></a>options: _Object_

**baseClass**: `String`

Base class that generated classes will extend

**generator**: `Function` = `generators.csharp`

Set output language. Curently, `C#`, `Kotlin` and `Typescripts` are supported out of the box but new ones can be added. A generator is a function that takes `propTypes` (an object describing the classes to create), `className` (the name of the react component) and an options object. It is expected to return a `string`. The easiest way of adding a new language is probably to clone `lib/stringify/csharp` and work from there. If you do make a generator for another language, please consider submitting a PR!

**header**: `String`

A string that is inserted at the top of all generated files. Good for adding generic comments or imports

**indent**: `Number` = `2`

Number of spaces of indentation in generated class

**namespace**: `String`

Namespace to wrap around generated class

**parser**: `Function` = javascript parser

What input language to parse. Javascript and typescript parsers are exported from the main library.

### Example

```js
const { compile } = require("@creuna/prop-types-csharp");

const { className, code } = compile(sourceCode, {
  indent: 4,
  namespace: "Some.Awesome.Namespace"
});
```

### Typescript example

```js
const { compile, generators, parsers } = require("@creuna/prop-types-csharp");

const { className, code } = compile(sourceCode, {
  parser: parsers.typescript,
  generator: generators.kotlin
});
```

## <a id="webpack"></a>Webpack plugin

The plugin will extract PropType definitions from `.jsx` files (configurable) and convert them into `.cs` class files (also configurable). If the build already has errors when this plugin runs, it aborts immediately.

### Options: `Object`

**compilerOptions**: `Object`

Options passed to the compiler, such as input language and formatting choices. Supported options are listed in the [Node.js API options](#compiler-options)

**exclude**: `Array` of `String | RegExp` = `['node-modules']`

A file is excluded if its path matches any of the exclude patterns. Default is replaced when setting this.

**fileExtension**: `String`

Set the file extension of generated classes. If you use the default `csharp` generator or one of the other bundled generators you can ignore this option.

**log**: `Boolean` = `false`

If set to true, will output some meta information from the plugin.

**match**: `Array` of `String | RegExp` = `[/\.jsx$/]`

A file is included if its path matches any of the matching patterns (unless it matches an exclude pattern). Default is replaced when setting this.

**path**: `String`

Path relative to `output.path` to put `.cs` files.

### Webpack dev server

When working with `webpack-dev-server`, the class files will be written to memory instead of disk by default. If you have generated classes included in source control, it could be a good idea to use Webpack dev server's `writeToDisk` option.

## <a id="babel"></a>Babel plugin

Having a bunch of `propTypesMeta` scattered all around your production code might not be what you want. To solve this issue, a Babel plugin is included which, if enabled, will strip all instances of `ComponentName.propTypesMeta` or `static propTypesMeta` when building with Webpack.

**IMPORTANT**

`@creuna/prop-types-csharp/babel-plugin` needs to be the first plugin to run on your code. If other plugins have transformed the code first, we can't guarantee that it will work like expected.

**.babelrc**:

```json
{
  "plugins": ["@creuna/prop-types-csharp/babel-plugin"]
}
```

## <a id="eslint"></a>Eslint plugin

This package includes an `eslint` plugin. Because `eslint` requires all plugins to be published separately to `npm` with a name startig with `eslint-plugin-`, we've published the proxy package [@creuna/eslint-plugin-prop-types-csharp](https://www.npmjs.com/package/@creuna/eslint-plugin-prop-types-csharp). The proxy package imports the actual plugin code from this package so that it can be used with `eslint`.

```
yarn add @creuna/eslint-plugin-prop-types-csharp
```

Even though the plugin checks many different things in your source code, the plugin only has one rule: `all`. The reason for this is that it wouldn't really make sense to have control over individual rules, because breaking any of them would also make the class generation fail, so you'll want to have all checks enabled.

.eslintrc.json:

```json
{
  "plugins": ["@creuna/eslint-plugin-prop-types-csharp"],
  "rules": {
    "@creuna/prop-types-csharp/all": 2
  }
}
```
