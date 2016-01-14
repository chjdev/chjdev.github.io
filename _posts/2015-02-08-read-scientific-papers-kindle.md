---
title: Read Scientific Papers on Your Kindle
layout: post
description: In this post I show you a simple way to get these papers on your eBook reader for comfortable reading.
redirect_from: /read-scientific-papers-kindle/
---

Reading scientific on your Kindle (or other eBook
reader) usually sucks. The text is usually only available as PDF or PS files
and formatted in a way that is meant for printing in A4, or US Letter. A
two-column layout is also very common, which further complicates things. In
this post I show you a simple way to get these papers on your eBook reader for
comfortable reading.

<!--
<div style="text-align: center;"><a
href="http://chjdev.com/wp-content/uploads/2015/02/original.png"><img
src="http://chjdev.com/wp-content/uploads/2015/02/original-232x300.png"
alt="original" width="232" height="300" class="alignnone size-medium
wp-image-153" /></a></div>

<div style="text-align: center;"><iframe style="width: 120px; height: 240px;"
src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&amp;OneJS=1&amp;Operation=GetAdHtml&amp;MarketPlace=US&amp;source=ss&amp;ref=ss_til&amp;ad_type=product_link&amp;tracking_id=chjdev-20&amp;marketplace=amazon&amp;region=US&amp;placement=B00I15SB16&amp;asins=B00I15SB16&amp;linkId=SPXKVXHNXUMSCTRA&amp;show_border=true&amp;link_opens_in_new_window=true"
width="300" height="150" frameborder="0" marginwidth="0" marginheight="0"
scrolling="no"> </iframe> <iframe style="width: 120px; height: 240px;"
src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&amp;OneJS=1&amp;Operation=GetAdHtml&amp;MarketPlace=US&amp;source=ss&amp;ref=ss_til&amp;ad_type=product_link&amp;tracking_id=chjdev-20&amp;marketplace=amazon&amp;region=US&amp;placement=B00JG8GOWU&amp;asins=B00JG8GOWU&amp;linkId=2KX4UWXTFMHOSJ5J&amp;show_border=true&amp;link_opens_in_new_window=true"
width="300" height="150" frameborder="0" marginwidth="0" marginheight="0"
scrolling="no"> </iframe> <iframe style="width: 120px; height: 240px;"
src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&amp;OneJS=1&amp;Operation=GetAdHtml&amp;MarketPlace=US&amp;source=ss&amp;ref=ss_til&amp;ad_type=product_link&amp;tracking_id=chjdev-20&amp;marketplace=amazon&amp;region=US&amp;placement=B00IOY8XWQ&amp;asins=B00IOY8XWQ&amp;linkId=QFDRMH3SYROOYXL5&amp;show_border=true&amp;link_opens_in_new_window=true"
width="300" height="150" frameborder="0" marginwidth="0" marginheight="0"
scrolling="no"> </iframe></div>
-->

## Step 1: Preprocessing with ``BRISS`` 

First we will preprocess the file a bit to make the next step easier / more
successful. Using the cool little [``BRISS``](http://briss.sourceforge.net/)
tool we will crop out unnecessary parts and only leave the main text area. The
idea is to get rid of line numbers, notes in the margin (e.g. the arXiv line in
our test document), etc.

``BRISS`` is a graphical tool. You can use the menu to load the PDF or
just start it from the terminal: ``briss Text\ Understanding\ from\
Scratch.pdf`` You will be prompted to enter the range of pages that will
be analyzed to find the main text body. Usually it's fine to just leave it at
the default. ``BRISS`` now tries to find the main text area.

<!--
<div style="text-align: center;"><a
href="http://chjdev.com/wp-content/uploads/2015/02/briss.png"><img
src="http://chjdev.com/wp-content/uploads/2015/02/briss-300x216.png"
alt="briss" width="300" height="216" class="alignnone size-medium wp-image-150"
/></a></div>
-->

Tweak the boxes until they only cover the relevant text and crop the PDF by
clicking ``Action > Crop PDF``. We now have a PDF document with all
possibly misleading fluff cut out and can move on to the next step.

<!--
<div style="text-align: center;"><a
href="http://chjdev.com/wp-content/uploads/2015/02/cropped.png"><img
src="http://chjdev.com/wp-content/uploads/2015/02/cropped-225x300.png"
alt="cropped" width="225" height="300" class="alignnone size-medium
wp-image-151" /></a></div>
-->

## Step 2: Optimizing with ``k2pdfopt`` 

To optimize the cropped PDF for our Kindle we'll use the
[``k2pdfopt``](http://www.willus.com/k2pdfopt/) tool. It has a
plethora of [options](http://www.willus.com/k2pdfopt/help/options.shtml)
suiting many needs, but the default modes usually work fine.  

``./k2pdfopt -ppgs -dev kpw -mode 2col Text\ Understanding\ from\ Scratch_cropped.pdf``

And that's it, now you have a Kindle optimized PDF!

<!--
<div style="text-align: center;"><a
href="http://chjdev.com/wp-content/uploads/2015/02/optimized.png"><img
src="http://chjdev.com/wp-content/uploads/2015/02/optimized-209x300.png"
alt="optimized" width="209" height="300" class="alignnone size-medium
wp-image-152" /></a></div>
-->

**Warning** the default modes include the ``-n`` flag, which will
enable native PDF output. This is the preferable mode since it leads to
smaller, better files because it uses native PDF instructions instead of
rendering the pages to bitmaps. However, (at least the 1st gen Paperwhite) may
crash opening files generated with this option, because it runs out of memory.
This forced me to factory reset my device a couple of times during first
experiments.

**Solution** either disable native output by specifying ``-n-``
leading to bigger, uglier files, or install Ghostscript (if you haven't
already) and include the [``-ppgs``](http://www.willus.com/k2pdfopt/help/faq.shtml")
option. This will post process the file using Ghostscript and fix the issue.

