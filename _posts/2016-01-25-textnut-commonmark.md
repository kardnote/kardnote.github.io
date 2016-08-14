---
layout: post
title:  "TextNut and CommonMark"
date:   2016-01-25 00:00:00
categories: Blogs
tags: [faq]
---

TextNut markdown engine is 100% compatible with [CommonMark](http://commonmark.org). More than than, TextNut is a superset of CommonMark. It has a few of extension that are not include in CommonMark.  They are `Task`, `Footnote`, `Tag` and `Strikethrough`.

These extension are follow CommonMark similar delimiters syntax:

* `Task` is similar with `List`. But marker is `- [ ]`, `- [-]` or `- [x]`.

* `Footnote` is same with `link reference`. But the reference label has prefix with `^`, e.g, [^1]. 

* `Tag` and `Strikethrough` are same with emphasis, e.g, tag is `+Tag1, Tag2+`, Strikethrough is `~~strikethrough~~`

Please note, only in Markdown editing mode, it is 100% compatible. In rich editing mode, it is sub-set. For example, `_` is not used for emphasis or strong emphasis.

