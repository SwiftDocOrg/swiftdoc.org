---
layout: post
date:   2015-01-03 12:00
tags:   swifter swiftdoc.org release-notes
title:  Swifter is now SwiftDoc.org
description: "I'm excited to announce some big changes to Swifter today. The first, as you can see from your address bar, is that the site is now SwiftDoc.org. The change in name is meant to mark the beginning of a process to give the Swift community both a more useful site and one we can all be involved with."
---

I'm excited to announce some big changes to Swifter today. The first, as you can see from your address bar, is that the site is now SwiftDoc.org. The change in name is meant to mark the beginning of a process: to give the Swift community a site that is both more useful and one we can all be involved with.

To that end, I've put the code for the [parser/builder that converts the Swift header file](http://github.com/SwiftDocOrg/swiftdoc-parser) into this site, and [the code to the site itself](http://github.com/SwiftDocOrg/swiftdoc.org), in repositories on GitHub. Moreover, the site itself is now hosted via GitHub Pages. Plans are in the making for the coming weeks that will involve, you, Gentle Reader, so watch this space.

In addition, this release comprises the following changes:

- Nested types are hoisted to the top-level, e.g. [`String.Index`](/type/String.Index/).

- Now includes [`ContiguousArray`](/type/ContiguousArray/)'s `join` method, due to its one-of-a-kind nested generic term. Bet you're glad to see that one.

- Two new protocols are visible: [`ArrayType`](/protocol/ArrayType/) and [`_ArrayType`](/protocol/_ArrayType/). These are from the internal Swift header file and neither visible nor accessible to us while programming in Swift. They're included here to connect [`Array`](/type/Array/) and [`Slice`](/type/Slice/) to other protocols like [`RangeReplaceableCollectionType`](/protocol/RangeReplaceableCollectionType/).

- The [`String`](/type/String) initializers that `import Foundation` adds are now listed, since Foundation is nearly always imported anyway. These initializers are marked with "*[Foundation]*", like so:

<div class="declaration" style="margin-left: 40px;">
    <code class="language-swift">init(format: String, locale: NSLocale?, _ args: CVarArgType...)</code>
    <div class="comment">
        <p><em>[Foundation]</em> Returns a <code>String</code> object initialized by using a given format string as a template into which the remaining argument values are substituted according to given locale information.</p>
    </div>
</div>

