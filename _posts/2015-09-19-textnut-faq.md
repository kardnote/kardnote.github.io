---
layout: post
title:  "TextNut FAQ"
date:   2015-09-19 20:00:00
categories: Blogs
tags: [faq]
---


### What is CommonMark

CommonMark is a strongly specified, highly compatible implementation of Markdown. Check out more details from their website <a href="http://commonmark.org" target="_blank">http://commonmark.org</a>. TextNut Markdown render engine passes 100% test cases in CommonMark v0.18 specification. Note, rich editing mode is only a sub-set of CommonMark. For example, it doesn't support `_` to render to emphasis or strong. The major reason is because rich mode is a kind of render-on-the-fly conversion. It is impossible 100% compatible with CommonMark.

  
### Why some behaviours are different between rich and Markdown editing mode

The basic design philosophy is `most control` in Markdown editing mode, `maximum automation` in rich editing mode. For example, Footnote or Ordered list index are automatically revised in rich mode but not in Markdown mode. 


### Why the content is changed while switching between rich and Markdown editing mode

Firstly, it is impossible to accurately map rich formatting back to Markdown markers. For example, both `_` and `*<` represents strong or emphasis in Markdown. But only `*` is used at rich content to Markdown conversion. Secondly, during conversion, some line indents may be adjusted accordingly. At current version, setext heading is not supported in rich mode, so it may be confused between setext heading or horizontal bar if there is no valid paragraph separator, e.g., blank lines. Markdown editing mode mostly is a plain text editor with proper highlights and styles.


### How to publish to Wordpress blog


Open Preferences dialog from menu `extNut` -> `Preferences`. On Wordpress tab, input the website address of your blog, user name and password, then click “check connection” button. If connection is success, there will be a list of blogs. Select one of blogs then close Preferences dialog   After this, Export popup menu in toolbar will include that blog publishing option.

