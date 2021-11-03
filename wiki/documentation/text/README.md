---
pageClass: documentation-class
---

# Two.Text


<div class="extends">

__Extends__: [Two.Shape](/documentation/shape/)

</div>


This is a primitive class for creating drawable text that can be added to the scenegraph.


<div class="meta">
  <custom-button text="Source" type="source" href="https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js" />
</div>



### Constructor


| Argument | Description |
| ---- | ----------- |
|  message  | The String to be rendered to the scene. |
|  x  | The position in the x direction for the object. |
|  y  | The position in the y direction for the object. |
|  styles  | An object where styles are applied. Attribute must exist in Two.Text.Properties. |



<div class="static member ">

## Ratio

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">Ratio</span></h2>










<div class="properties">

Approximate aspect ratio of a typeface's character width to height.

</div>








<div class="meta">

  [`text.js:73`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L73)

</div>






</div>



<div class="static member ">

## Properties

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">Properties</span></h2>










<div class="properties">

A list of properties that are on every [Two.Text](/documentation/text).

</div>








<div class="meta">

  [`text.js:79`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L79)

</div>






</div>



<div class="static function ">

## FlagFill

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">FlagFill</span></h2>















<div class="description">

Cached method to let renderers know the fill property have been updated on a [Two.Text](/documentation/text).

</div>



<div class="meta">

  [`text.js:89`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L89)

</div>






</div>



<div class="static function ">

## FlagStroke

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">FlagStroke</span></h2>















<div class="description">

Cached method to let renderers know the stroke property have been updated on a [Two.Text](/documentation/text).

</div>



<div class="meta">

  [`text.js:98`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L98)

</div>






</div>



<div class="instance member ">

## dashes

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">dashes</span></h2>










<div class="properties">

Array of numbers. Odd indices represent dash length. Even indices represent dash space.

</div>






<div class="description">

A list of numbers that represent the repeated dash length and dash space applied to the stroke of the text.

</div>



<div class="meta">

  [`text.js:43`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L43)

</div>





<div class="see">

[https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray) for more information on the SVG stroke-dasharray attribute.

</div>


</div>



<div class="instance member ">

## dashes.offset

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">dashes.offset</span></h2>










<div class="properties">

A number in pixels to offset [Two.Text.dashes](/documentation/text/#two-text-dashes) display.

</div>








<div class="meta">

  [`text.js:51`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L51)

</div>






</div>



<div class="instance member ">

## value

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">value</span></h2>










<div class="properties">

The characters to be rendered to the the screen. Referred to in the documentation sometimes as the `message`.

</div>








<div class="meta">

  [`text.js:341`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L341)

</div>






</div>



<div class="instance member ">

## family

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">family</span></h2>










<div class="properties">

The font family Two.js should attempt to regsiter for rendering. The default value is `'sans-serif'`. Comma separated font names can be supplied as a "stack", similar to the CSS implementation of `font-family`.

</div>








<div class="meta">

  [`text.js:347`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L347)

</div>






</div>



<div class="instance member ">

## size

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">size</span></h2>










<div class="properties">

The font size in Two.js point space. Defaults to `13`.

</div>








<div class="meta">

  [`text.js:353`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L353)

</div>






</div>



<div class="instance member ">

## leading

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">leading</span></h2>










<div class="properties">

The height between lines measured from base to base in Two.js point space. Defaults to `17`.

</div>








<div class="meta">

  [`text.js:359`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L359)

</div>






</div>



<div class="instance member ">

## alignment

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">alignment</span></h2>










<div class="properties">

Alignment of text in relation to [Two.Text.translation](/documentation/text/#two-text-translation)'s coordinates. Possible values include `'left'`, `'center'`, `'right'`. Defaults to `'center'`.

</div>








<div class="meta">

  [`text.js:365`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L365)

</div>






</div>



<div class="instance member ">

## baseline

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">baseline</span></h2>










<div class="properties">

The vertical aligment of the text in relation to [Two.Text.translation](/documentation/text/#two-text-translation)'s coordinates. Possible values include `'top'`, `'middle'`, `'bottom'`, and `'baseline'`. Defaults to `'baseline'`.

</div>








<div class="meta">

  [`text.js:371`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L371)

</div>






</div>



<div class="instance member ">

## style

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">style</span></h2>










<div class="properties">

The font's style. Possible values include '`normal`', `'italic'`. Defaults to `'normal'`.

</div>








<div class="meta">

  [`text.js:377`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L377)

</div>






</div>



<div class="instance member ">

## weight

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">weight</span></h2>










<div class="properties">

A number at intervals of 100 to describe the font's weight. This compatibility varies with the typeface's variant weights. Larger values are bolder. Smaller values are thinner. Defaults to `'500'`.

</div>








<div class="meta">

  [`text.js:383`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L383)

</div>






</div>



<div class="instance member ">

## decoration

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">decoration</span></h2>










<div class="properties">

String to delineate whether text should be decorated with for instance an `'underline'`. Defaults to `'none'`.

</div>








<div class="meta">

  [`text.js:389`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L389)

</div>






</div>



<div class="instance member ">

## fill

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">fill</span></h2>










<div class="properties">

The value of what the text object should be filled in with.

</div>








<div class="meta">

  [`text.js:395`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L395)

</div>





<div class="see">

[https://developer.mozilla.org/en-US/docs/Web/CSS/color_value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) for more information on CSS's colors as `String`.

</div>


</div>



<div class="instance member ">

## stroke

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">stroke</span></h2>










<div class="properties">

The value of what the text object should be filled in with.

</div>








<div class="meta">

  [`text.js:402`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L402)

</div>





<div class="see">

[https://developer.mozilla.org/en-US/docs/Web/CSS/color_value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) for more information on CSS's colors as `String`.

</div>


</div>



<div class="instance member ">

## linewidth

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">linewidth</span></h2>










<div class="properties">

The thickness in pixels of the stroke.

</div>








<div class="meta">

  [`text.js:409`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L409)

</div>






</div>



<div class="instance member ">

## opacity

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">opacity</span></h2>










<div class="properties">

The opaqueness of the text object.

</div>








<div class="meta">

  [`text.js:415`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L415)

</div>



<div class="tags">


::: tip nota-bene
Can be used in conjunction with CSS Colors that have an alpha value.
:::


</div>




</div>



<div class="instance member ">

## className

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">className</span></h2>










<div class="properties">

A class to be applied to the element to be compatible with CSS styling. Only available for the [Two.SvgRenderer](/documentation/svgrenderer).

</div>








<div class="meta">

  [`text.js:422`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L422)

</div>






</div>



<div class="instance member ">

## visible

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">visible</span></h2>










<div class="properties">

Display the text object or not.

</div>








<div class="meta">

  [`text.js:428`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L428)

</div>



<div class="tags">


::: tip nota-bene
For [Two.CanvasRenderer](/documentation/canvasrenderer) and [Two.WebGLRenderer](/documentation/webglrenderer) when set to false all updating is disabled improving performance dramatically with many objects in the scene.
:::


</div>




</div>



<div class="instance member ">

## mask

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">mask</span></h2>










<div class="properties">

The shape whose alpha property becomes a clipping area for the text.

</div>








<div class="meta">

  [`text.js:435`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L435)

</div>



<div class="tags">


::: tip nota-bene
This property is currently not working becuase of SVG spec issues found here {@link https://code.google.com/p/chromium/issues/detail?id=370951}.
:::


</div>




</div>



<div class="instance member ">

## clip

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">clip</span></h2>










<div class="properties">

Object to define clipping area.

</div>








<div class="meta">

  [`text.js:442`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L442)

</div>



<div class="tags">


::: tip nota-bene
This property is currently not working becuase of SVG spec issues found here {@link https://code.google.com/p/chromium/issues/detail?id=370951}.
:::


</div>




</div>



<div class="instance function ">

## remove

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">remove</span></h2>















<div class="description">

Remove self from the scene / parent.

</div>



<div class="meta">

  [`text.js:456`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L456)

</div>






</div>



<div class="instance function ">

## clone

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">clone</span></h2>




<div class="returns">

__Returns__: Two.Text



</div>









<div class="params">

| Argument | Description |
| ---- | ----------- |
|  parent  | The parent group or scene to add the clone to. |
</div>




<div class="description">

Create a new instance of [Two.Text](/documentation/text) with the same properties of the current text object.

</div>



<div class="meta">

  [`text.js:473`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L473)

</div>






</div>



<div class="instance function ">

## toObject

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">toObject</span></h2>




<div class="returns">

__Returns__: Object



</div>












<div class="description">

Return a JSON compatible plain object that represents the text object.

</div>



<div class="meta">

  [`text.js:503`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L503)

</div>






</div>



<div class="instance function ">

## noFill

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">noFill</span></h2>















<div class="description">

Short hand method to set fill to `transparent`.

</div>



<div class="meta">

  [`text.js:529`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L529)

</div>






</div>



<div class="instance function ">

## noStroke

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">noStroke</span></h2>















<div class="description">

Short hand method to set stroke to `transparent`.

</div>



<div class="meta">

  [`text.js:539`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L539)

</div>






</div>



<div class="instance function ">

## getBoundingClientRect

<h2 class="longname" aria-hidden="true"><span class="prefix">Two.Text.</span><span class="shortname">getBoundingClientRect</span></h2>




<div class="returns">

__Returns__: Object


- Returns object with top, left, right, bottom, width, height attributes.


</div>









<div class="params">

| Argument | Description |
| ---- | ----------- |
|  shallow  | Describes whether to calculate off local matrix or world matrix. |
</div>




<div class="description">

Return an object with top, left, right, bottom, width, and height parameters of the text object.

</div>



<div class="meta">

  [`text.js:554`](https://github.com/jonobr1/two.js/blob/dev/C:\Users\pures\Jono\two-js\src/text.js#L554)

</div>






</div>


