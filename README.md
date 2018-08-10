# SwiftDoc.org

Documentation and resources for the Swift community  
_[https://swiftdoc.org/](https://swiftdoc.org/)_

## Installation

SwiftDoc.org is created via a two-step process.

1. The `swiftdoc-parser` utilities parse a set of Swift header files and output a set of HTML files with YAML preambles.
2. Jekyll converts that set of files, plus the remaining files in this repository, into the SwiftDoc.org site.

If you have Jekyll installed, you can run SwiftDoc.org locally by using these commands:

```
$ git clone https://github.com/SwiftDocOrg/swiftdoc.org.git
$ cd swiftdoc.org
$ bundle install
$ foreman start
```

## Contributions

Issues and pull requests should be filed in this repository relating to:

- errors or bugs in SwiftDoc.org
- feature requests

For errors in the actual documentation on SwiftDoc.org, see [the swiftdoc-parser repository](https://github.com/SwiftDocOrg/swiftdoc-parser) instead.

## Contact

Follow [@SwiftDocOrg](https://twitter.com/SwiftDocOrg) on Twitter.

## License

The parsing and HTML generating utilities are available under the MIT license. See the LICENSE file for more info.
