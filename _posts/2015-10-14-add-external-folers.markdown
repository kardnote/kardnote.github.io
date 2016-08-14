---
layout: post
title:  "Add external folders to TextNut"
date:   2015-10-14 21:43:39
categories: Blogs
tags: [feature]
---

After many feature requests, TextNut 2.2 allows to manage external folders directly in document tree.  Clicking the right bottom "plus" icon, choose "Link External folder" in popup menu then select targeting folder from File dialog. Once the folder is added successfully, it automatically synchronises any changes outside TextNut. Note, in page tree list, it only displays the markdown/text format files. 

![](<{{site_url}}/img/Screen Shot 2015-10-14 at 4.08.37 PM.png>)

Some tips helps you manage external folder more efficiently Firstly, by setting the Folder Properties, you can manage images within TextNut. Just like below screenshot, in properties popup, first selecting the images saving folder (by Apple security restriction, only sub-folders under the root folder is allowed). In example, the markdown is `![](</img/Screen Shot 2015-09-02 at 4.36.55 pm.png>)`, the image saving folder is /TextNutWebsite/img/. If you want to add prefix before the image, declare it in "Image URL prefix" field. That is very useful for some Jekyll style folder, the markdown could be `![My helpful screenshot]({{ site.url }}/assets/screenshot.jpg)`, at this case, the prefix could be `{{site.url}}/asset`. Once setup correctly, it will display as the images in rich mode.  For new inserted images, they will automatically saved into /TextNutWebsite/img/ folder either.
![](<{{site_url}}/img/Screen Shot 2015-10-14 at 3.17.07 PM.png>)

By default, the folder which doesn't have valid markdown files will be hidden from file list view. It can be turn on from application Preference.

![](<{{site_url}}/img/Screen Shot 2015-10-14 at 3.37.55 PM.png>)

TextNut has default soft line wrap(80 characters line width), for some existed markdown files that use hard line wrap, it may not display nicely. It easy turn of soft wrap line from Menu -> View -> Soft line wrap, or extending the maximum line character from application Preference. 

As "Link External Folder" is quite new feature since version 2.2,  if you have any suggestion, feel free [send feedback](https://textnutwriter.uservoice.com/forums/266515-general) to me. It could be much helpful if you can include your use case scenario. 
