# atom markdown-cell-highlight package

A simple :atom: package to highlight code cells in markdown files;
this can be useful, for example,
when editing [Weave](https://github.com/JunoLab/Weave.jl) files in [Juno](https://junolab.org/) or
using [Hydrogen](https://github.com/nteract/hydrogen)'s [rich (multi) language document feature](https://nteract.gitbooks.io/hydrogen/docs/Usage/GettingStarted.html#multiple-kernels-inside-one-rich-document), etc.

To install:
```bash
λ apm install markdown-cell-highlight
```

## example look

| [ariake-dark-syntax](https://github.com/pathtrk/ariake-dark-syntax)                                                          | [one-light syntax](https://github.com/atom/atom/tree/master/packages/one-light-syntax)                                     |
|------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| ![ariake-dark-example](https://user-images.githubusercontent.com/40514306/77017592-38733b00-69be-11ea-843a-c12524b5e008.png) | ![one-light-example](https://user-images.githubusercontent.com/40514306/77017718-85571180-69be-11ea-9be7-9b7c9320fc19.png) |

## config

- `markdown-cell-highlight.targetScopes`: If specified, this package will highlight code cells with the specified languages scopes. By default (i.e. `["source.embedded", "text.embedded"]`), it will highlight _every_ code cell even without language scope. E.g.: if you only want to highlight Julia code cells, you can modify this config into `["source.embedded.julia"]`.
- `markdown-cell-highlight.markdownScopes`: Specifies grammar scopes that this package will consider as markdown files and try to highlight code cells. Set to `["text.md", "source.gfm", "source.weave.md", "source.pweave.md"]` by default.


## custom styling

You can have custom styles (i.e. custom colors, mostly) via [your stylesheet](https://flight-manual.atom.io/using-atom/sections/basic-customization/#style-tweaks):

> .atom/styles.less

```less
// style for cell body
.line.markdown-cell-highlight {
  background: @whatever-color-you-want-for-cell-body;
}
// style for cell gutter
.line-number.markdown-cell-highlight {
  background: @whatever-color-you-want-for-cell-gutter;
}
```


## license

This package is under [MIT License](LICENSE.md).


## author

- **Shuhei Kadowaki** - *undergraduate @ kyoto univ.* - [aviatesk](https://github.com/aviatesk)
