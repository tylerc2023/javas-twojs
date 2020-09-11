---
pageClass: documentation-class
---

# Two.CanvasRenderer


<div class="extends">

__Extends__: `Two.Events`

</div>


This class is used by [Two](/documentation/) when constructing with `type` of `Two.Types.canvas`. It takes Two.js' scenegraph and renders it to a `<canvas />`.


<div class="meta">

  [Source Code](https://github.com/jonobr1/two.js/blob/dev/src/renderers/canvas.js#L752)

</div>



### Constructor


| Argument | Description |
| ---- | ----------- |
|  `parameters`  | This object is inherited when constructing a new instance of [Two](/documentation/). |
|  `parameters.domElement`  | The `<canvas />` to draw to. If none given a new one will be constructed. |
|  `parameters.overdraw`  | Determines whether the canvas should clear the background or not. Defaults to `true`. |
|  `parameters.smoothing`  | Determines whether the canvas should antialias drawing. Set it to `false` when working with pixel art. `false` can lead to better performance, since it would use a cheaper interpolation algorithm. |



---

<div class="static member ">

## Two.CanvasRenderer.Utils








<div class="properties">

A massive object filled with utility functions and properties to render Two.js objects to a `<canvas />`.

</div>








<div class="meta">

  [Source Code](https://github.com/jonobr1/two.js/blob/dev/src/renderers/canvas.js#L801)

</div>






</div>



---

<div class="instance member ">

## Two.CanvasRenderer.domElement








<div class="properties">

The `<canvas />` associated with the Two.js scene.

</div>








<div class="meta">

  [Source Code](https://github.com/jonobr1/two.js/blob/dev/src/renderers/canvas.js#L767)

</div>






</div>



---

<div class="instance member ">

## Two.CanvasRenderer.ctx








<div class="properties">

Associated two dimensional context to render on the `<canvas />`.

</div>








<div class="meta">

  [Source Code](https://github.com/jonobr1/two.js/blob/dev/src/renderers/canvas.js#L773)

</div>






</div>



---

<div class="instance member ">

## Two.CanvasRenderer.overdraw








<div class="properties">

Determines whether the canvas clears the background each draw call.

</div>








<div class="meta">

  [Source Code](https://github.com/jonobr1/two.js/blob/dev/src/renderers/canvas.js#L779)

</div>






</div>



---

<div class="instance member ">

## Two.CanvasRenderer.scene








<div class="properties">

The root group of the scenegraph.

</div>








<div class="meta">

  [Source Code](https://github.com/jonobr1/two.js/blob/dev/src/renderers/canvas.js#L790)

</div>






</div>



---

<div class="instance function ">

## Two.CanvasRenderer.setSize






<div class="fires">

__Triggers__:

+ `event:resize`

</div>





<div class="params">

| Argument | Description |
| ---- | ----------- |
|  `width`  | The new width of the renderer. |
|  `height`  | The new height of the renderer. |
|  `ratio`  | The new pixel ratio (pixel density) of the renderer. Defaults to calculate the pixel density of the user's screen. |
</div>




<div class="description">

Change the size of the renderer.

</div>



<div class="meta">

  [Source Code](https://github.com/jonobr1/two.js/blob/dev/src/renderers/canvas.js#L813)

</div>






</div>



---

<div class="instance function ">

## Two.CanvasRenderer.render













<div class="description">

Render the current scene to the `<canvas />`.

</div>



<div class="meta">

  [Source Code](https://github.com/jonobr1/two.js/blob/dev/src/renderers/canvas.js#L843)

</div>






</div>


