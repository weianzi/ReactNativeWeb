# haste-resolver
> Haste Resolver

## Usage
```js
var HasteResolver = require('haste-resolver')
var resolver = new HasteResolver({
  roots: ['path/to/roots']
})
resolver.getHasteMap().then(function(hasteMap){
  // ...
})
```

## Options
* roots
* blacklistRE
* providesModuleNodeModules
* platform
* preferNativePlatform
