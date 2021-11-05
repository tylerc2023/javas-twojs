---
pageClass: docs
---

# Two.LinearGradient


<div class="extends">

__Extends__: [Two.Gradient](/docs/effects/gradient/)

</div>





<div class="meta">
  <custom-button text="Source" type="source" href="https://github.com/jonobr1/two.js/blob/dev/src/effects/linear-gradient.js" />
</div>



### Constructor


| Argument | Description |
| ---- | ----------- |
|  x1  | The x position of the first end point of the linear gradient. |
|  y1  | The y position of the first end point of the linear gradient. |
|  x2  | The x position of the second end point of the linear gradient. |
|  y2  | The y position of the second end point of the linear gradient. |
|  stops  | A list of [Two.Stop](/docs/stop)s that contain the gradient fill pattern for the gradient. |



<div class="static member ">

## Stop

<h2 class="longname" aria-hidden="true"><a href="#Stop"><span class="prefix">Two.LinearGradient.</span><span class="shortname">Stop</span></a></h2>

















<div class="meta">

  [`linear-gradient.js:55`](https://github.com/jonobr1/two.js/blob/dev/src/effects/linear-gradient.js#L55)

</div>





<div class="see">

[Two.Stop](/docs/stop)

</div>


</div>



<div class="static function ">

## MakeObservable

<h2 class="longname" aria-hidden="true"><a href="#MakeObservable"><span class="prefix">Two.LinearGradient.</span><span class="shortname">MakeObservable</span></a></h2>












<div class="params">

| Argument | Description |
| ---- | ----------- |
|  object  | The object to make observable. |
</div>




<div class="description">

Convenience function to apply observable qualities of a [Two.LinearGradient](/docs/lineargradient) to any object. Handy if you'd like to extend the [Two.LinearGradient](/docs/lineargradient) class on a custom class.

</div>



<div class="meta">

  [`linear-gradient.js:61`](https://github.com/jonobr1/two.js/blob/dev/src/effects/linear-gradient.js#L61)

</div>






</div>



<div class="static function ">

## FlagEndPoints

<h2 class="longname" aria-hidden="true"><a href="#FlagEndPoints"><span class="prefix">Two.LinearGradient.</span><span class="shortname">FlagEndPoints</span></a></h2>















<div class="description">

Cached method to let renderers know end points have been updated on a [Two.LinearGradient](/docs/lineargradient).

</div>



<div class="meta">

  [`linear-gradient.js:71`](https://github.com/jonobr1/two.js/blob/dev/src/effects/linear-gradient.js#L71)

</div>






</div>



<div class="instance member ">

## left

<h2 class="longname" aria-hidden="true"><a href="#left"><span class="prefix">Two.LinearGradient.</span><span class="shortname">left</span></a></h2>










<div class="properties">

The x and y value for where the first end point is placed on the canvas.

</div>








<div class="meta">

  [`linear-gradient.js:27`](https://github.com/jonobr1/two.js/blob/dev/src/effects/linear-gradient.js#L27)

</div>






</div>



<div class="instance member ">

## right

<h2 class="longname" aria-hidden="true"><a href="#right"><span class="prefix">Two.LinearGradient.</span><span class="shortname">right</span></a></h2>










<div class="properties">

The x and y value for where the second end point is placed on the canvas.

</div>








<div class="meta">

  [`linear-gradient.js:32`](https://github.com/jonobr1/two.js/blob/dev/src/effects/linear-gradient.js#L32)

</div>






</div>



<div class="instance function ">

## clone

<h2 class="longname" aria-hidden="true"><a href="#clone"><span class="prefix">Two.LinearGradient.</span><span class="shortname">clone</span></a></h2>




<div class="returns">

__Returns__: Two.Gradient



</div>









<div class="params">

| Argument | Description |
| ---- | ----------- |
|  parent  | The parent group or scene to add the clone to. |
</div>




<div class="description">

Create a new instance of [Two.LinearGradient](/docs/lineargradient) with the same properties of the current path.

</div>



<div class="meta">

  [`linear-gradient.js:93`](https://github.com/jonobr1/two.js/blob/dev/src/effects/linear-gradient.js#L93)

</div>






</div>



<div class="instance function ">

## toObject

<h2 class="longname" aria-hidden="true"><a href="#toObject"><span class="prefix">Two.LinearGradient.</span><span class="shortname">toObject</span></a></h2>




<div class="returns">

__Returns__: Object



</div>












<div class="description">

Return a JSON compatible plain object that represents the path.

</div>



<div class="meta">

  [`linear-gradient.js:121`](https://github.com/jonobr1/two.js/blob/dev/src/effects/linear-gradient.js#L121)

</div>






</div>


