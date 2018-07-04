<p align="center">
  <img height="256px" width="256px" style="text-align: center;" src="https://cdn.rawgit.com/pfbrowning/ng-file-drop/master/demo/src/assets/logo.svg">
</p>

# ng-file-drop - Configurable Angular file input component with cross-browser drag &amp; drop functionality

[![npm version](https://badge.fury.io/js/ng-file-drop.svg)](https://badge.fury.io/js/ng-file-drop),
[![Build Status](https://travis-ci.org/pfbrowning/ng-file-drop.svg?branch=master)](https://travis-ci.org/pfbrowning/ng-file-drop)
[![Coverage Status](https://coveralls.io/repos/github/pfbrowning/ng-file-drop/badge.svg?branch=master)](https://coveralls.io/github/pfbrowning/ng-file-drop?branch=master)
[![dependency Status](https://david-dm.org/pfbrowning/ng-file-drop/status.svg)](https://david-dm.org/pfbrowning/ng-file-drop)
[![devDependency Status](https://david-dm.org/pfbrowning/ng-file-drop/dev-status.svg?branch=master)](https://david-dm.org/pfbrowning/ng-file-drop#info=devDependencies)
[![Greenkeeper Badge](https://badges.greenkeeper.io/pfbrowning/ng-file-drop.svg)](https://greenkeeper.io/)

## Demo

View all the directives in action at https://pfbrowning.github.io/ng-file-drop

## Dependencies
* [Angular](https://angular.io) (*requires* Angular 2 or higher, tested with 2.0.0)

## Installation
Install above dependencies via *npm*. 

Now install `@browninglogic/ng-file-drop` via:
```shell
npm install --save @browninglogic/ng-file-drop
```

---
##### SystemJS
>**Note**:If you are using `SystemJS`, you should adjust your configuration to point to the UMD bundle.
In your systemjs config file, `map` needs to tell the System loader where to look for `@browninglogic/ng-file-drop`:
```js
map: {
  '@browninglogic/ng-file-drop': 'node_modules/@browninglogic/ng-file-drop/bundles/ng-file-drop.umd.js',
}
```
---

Once installed you need to import the main module:
```js
import { FileDropModule } from '@browninglogic/ng-file-drop';
```
The only remaining part is to list the imported module in your application module. The exact method will be slightly
different for the root (top-level) module for which you should end up with the code similar to (notice ` FileDropModule .forRoot()`):
```js
import { FileDropModule } from '@browninglogic/ng-file-drop';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [FileDropModule, ...],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

Other modules in your application can simply import ` FileDropModule `:

```js
import { FileDropModule } from '@browninglogic/ng-file-drop';

@NgModule({
  declarations: [OtherComponent, ...],
  imports: [FileDropModule, ...], 
})
export class OtherModule {
}
```

## Usage



## License

Copyright (c) 2018 Patrick Browning. Licensed under the MIT License (MIT)

