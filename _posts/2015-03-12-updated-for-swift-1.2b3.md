---
layout: post
date:   2015-03-12 22:11
tags:   release-notes
title:  Updated for Swift 1.2b3
class:  release
description: ""
---

Swift 1.2 beta 3 brings some more changes to the standard library.

<ul>
    <li><p markdown="1">`Slice` has been rechristened as `ArraySlice`, likely to signify its relationship with `Array` and `ContiguousArray`.</p></li>

    <li><p markdown="1">A global `flatMap` function has been added for both optionals and sequences, and `flatMap` methods have been added to the optional and array types, much to the joy of functional-leaning Swifters everywhere. For sequences and arrays, this provides a way to map each element to an array, with the resulting array of arrays flattened back to an array of their joined elements:</p>

<pre><code class="language-swift">
let numbers = [1, 2, 3, 4]     
 
let expanded = numbers.flatMap { Array(count: $0, repeatedValue: $0) }
// flatMap flattens the result:
// [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]

let nested = numbers.map { Array(count: 0, repeatedValue: $0) }
// with map, you end up with a nested array:        
// [[1], [2, 2], [3, 3, 3], [4, 4, 4, 4]]
</code></pre>
    
<p markdown="1">For optionals, `flatMap` lets you safely call functions that don't take an optional value without going through an optional binding:</p>
    
<pre><code class="language-swift"> 
let squareRootOfLast = expanded.last.flatMap { sqrt(Double($0)) }
// Optional(2.0)
</code></pre>
</li>

    <li><p markdown="1">Swift 1.2 beta 2 saw the addition of a new `unsafeUnwrap` function, the disappearance of the `&/` and `&*` operators, and the arrival of `UnicodeScalar.UTF16View`. (I forgot to post the release notes last time. But they were short.)</p></li>
</ul>
