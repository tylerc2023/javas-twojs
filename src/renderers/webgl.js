import Commands from '../utils/path-commands.js';

import root from '../utils/root.js';
import {mod, NumArray} from '../utils/math.js';
import Events from '../events.js';
import TwoError from '../utils/error.js';
import getRatio from '../utils/get-ratio.js';
import _ from '../utils/underscore.js';

import Group from '../group.js';
import Vector from '../vector.js';
import Matrix from '../matrix.js';
import Registry from '../registry.js';

import LinearGradient from '../effects/linear-gradient.js';
import RadialGradient from '../effects/radial-gradient.js';
import Texture from '../effects/texture.js';

import CanvasRenderer from './canvas.js';

// Constants

var multiplyMatrix = Matrix.Multiply,
  identity = [1, 0, 0, 0, 1, 0, 0, 0, 1],
  transformation = new NumArray(9),
  CanvasUtils = CanvasRenderer.Utils;

var webgl = {

  isHidden: /(undefined|none|transparent)/i,

  canvas: (root.document ? root.document.createElement('canvas') : { getContext: function() {} }),

  alignments: {
    left: 'start',
    middle: 'center',
    right: 'end'
  },

  matrix: new Matrix(),

  group: {

    removeChild: function(child, gl) {
      if (child.children) {
        for (var i = 0; i < child.children.length; i++) {
          webgl.group.removeChild(child.children[i], gl);
        }
        return;
      }
      // Deallocate texture to free up gl memory.
      gl.deleteTexture(child._renderer.texture);
      delete child._renderer.texture;
    },

    render: function(gl, program) {

      if (!this._visible) {
        return;
      }

      this._update();

      var parent = this.parent;
      var flagParentMatrix = (parent._matrix && parent._matrix.manual) || parent._flagMatrix;
      var flagMatrix = this._matrix.manual || this._flagMatrix;

      if (flagParentMatrix || flagMatrix) {

        if (!this._renderer.matrix) {
          this._renderer.matrix = new NumArray(9);
        }

        // Reduce amount of object / array creation / deletion
        this._matrix.toTransformArray(true, transformation);

        multiplyMatrix(transformation, parent._renderer.matrix, this._renderer.matrix);

        if (!(this._renderer.scale instanceof Vector)) {
          this._renderer.scale = new Vector();
        }

        if (this._scale instanceof Vector) {
          this._renderer.scale.x = this._scale.x;
          this._renderer.scale.y = this._scale.y;
        } else {
          this._renderer.scale.x = this._scale;
          this._renderer.scale.y = this._scale;
        }

        if (!(/renderer/i.test(parent._renderer.type))) {
          this._renderer.scale.x *= parent._renderer.scale.x;
          this._renderer.scale.y *= parent._renderer.scale.y;
        }

        if (flagParentMatrix) {
          this._flagMatrix = true;
        }

      }

      if (this._mask) {

        // Stencil away everything that isn't rendered by the mask
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.enable(gl.STENCIL_TEST);

        gl.stencilFunc(gl.ALWAYS, 1, 0);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        // Don't draw the element onto the canvas, only onto the stencil buffer
        gl.colorMask(false, false, false, false);

        webgl[this._mask._renderer.type].render.call(this._mask, gl, program, this);

        gl.stencilFunc(gl.EQUAL, 1, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.colorMask(true, true, true, true);

      }

      this._flagOpacity = parent._flagOpacity || this._flagOpacity;

      this._renderer.opacity = this._opacity
        * (parent && parent._renderer ? parent._renderer.opacity : 1);

      var i;
      if (this._flagSubtractions) {
        for (i = 0; i < this.subtractions.length; i++) {
          webgl.group.removeChild(this.subtractions[i], gl);
        }
      }

      for (i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        webgl[child._renderer.type].render.call(child, gl, program);
      }

      if (this._mask) {
        gl.disable(gl.STENCIL_TEST);
      }

      return this.flagReset();

    }

  },

  path: {

    updateCanvas: function(elem) {

      var next, prev, a, c, ux, uy, vx, vy, ar, bl, br, cl, x, y;
      var isOffset;

      var commands = elem._renderer.vertices;
      var canvas = this.canvas;
      var ctx = this.ctx;

      // Styles
      var scale = elem._renderer.scale;
      var stroke = elem._stroke;
      var linewidth = elem._linewidth;
      var fill = elem._fill;
      var opacity = elem._renderer.opacity || elem._opacity;
      var cap = elem._cap;
      var join = elem._join;
      var miter = elem._miter;
      var closed = elem._closed;
      var dashes = elem.dashes;
      var length = commands.length;
      var last = length - 1;

      canvas.width = Math.max(Math.ceil(elem._renderer.rect.width * scale.x), 1);
      canvas.height = Math.max(Math.ceil(elem._renderer.rect.height * scale.y), 1);

      var centroid = elem._renderer.rect.centroid;
      var cx = centroid.x;
      var cy = centroid.y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (fill) {
        if (typeof fill === 'string') {
          ctx.fillStyle = fill;
        } else {
          webgl[fill._renderer.type].render.call(fill, ctx, elem);
          ctx.fillStyle = fill._renderer.effect;
        }
      }
      if (stroke) {
        if (typeof stroke === 'string') {
          ctx.strokeStyle = stroke;
        } else {
          webgl[stroke._renderer.type].render.call(stroke, ctx, elem);
          ctx.strokeStyle = stroke._renderer.effect;
        }
        if (linewidth) {
          ctx.lineWidth = linewidth;
        }
        if (miter) {
          ctx.miterLimit = miter;
        }
        if (join) {
          ctx.lineJoin = join;
        }
        if (!closed && cap) {
          ctx.lineCap = cap;
        }
      }
      if (typeof opacity === 'number') {
        ctx.globalAlpha = opacity;
      }

      if (dashes && dashes.length > 0) {
        ctx.lineDashOffset = dashes.offset || 0;
        ctx.setLineDash(dashes);
      }

      var d;
      ctx.save();
      ctx.scale(scale.x, scale.y);

      ctx.translate(cx, cy);

      ctx.beginPath();
      for (var i = 0; i < commands.length; i++) {

        var b = commands[i];

        x = b.x;
        y = b.y;

        switch (b.command) {

          case Commands.close:
            ctx.closePath();
            break;

          case Commands.arc:

            var rx = b.rx;
            var ry = b.ry;
            var xAxisRotation = b.xAxisRotation;
            var largeArcFlag = b.largeArcFlag;
            var sweepFlag = b.sweepFlag;

            prev = closed ? mod(i - 1, length) : Math.max(i - 1, 0);
            a = commands[prev];

            var ax = a.x;
            var ay = a.y;

            CanvasUtils.renderSvgArcCommand(ctx, ax, ay, rx, ry, largeArcFlag, sweepFlag, xAxisRotation, x, y);
            break;

          case Commands.curve:

            prev = closed ? mod(i - 1, length) : Math.max(i - 1, 0);
            next = closed ? mod(i + 1, length) : Math.min(i + 1, last);

            a = commands[prev];
            c = commands[next];
            ar = (a.controls && a.controls.right) || Vector.zero;
            bl = (b.controls && b.controls.left) || Vector.zero;

            if (a._relative) {
              vx = ar.x + a.x;
              vy = ar.y + a.y;
            } else {
              vx = ar.x;
              vy = ar.y;
            }

            if (b._relative) {
              ux = bl.x + b.x;
              uy = bl.y + b.y;
            } else {
              ux = bl.x;
              uy = bl.y;
            }

            ctx.bezierCurveTo(vx, vy, ux, uy, x, y);

            if (i >= last && closed) {

              c = d;

              br = (b.controls && b.controls.right) || Vector.zero;
              cl = (c.controls && c.controls.left) || Vector.zero;

              if (b._relative) {
                vx = br.x + b.x;
                vy = br.y + b.y;
              } else {
                vx = br.x;
                vy = br.y;
              }

              if (c._relative) {
                ux = cl.x + c.x;
                uy = cl.y + c.y;
              } else {
                ux = cl.x;
                uy = cl.y;
              }

              x = c.x;
              y = c.y;

              ctx.bezierCurveTo(vx, vy, ux, uy, x, y);

            }

            break;

          case Commands.line:
            ctx.lineTo(x, y);
            break;

          case Commands.move:
            d = b;
            ctx.moveTo(x, y);
            break;

        }

      }

      // Loose ends

      if (closed) {
        ctx.closePath();
      }

      if (!webgl.isHidden.test(fill)) {
        isOffset = fill._renderer && fill._renderer.offset;
        if (isOffset) {
          ctx.save();
          ctx.translate(
            - fill._renderer.offset.x, - fill._renderer.offset.y);
          ctx.scale(fill._renderer.scale.x, fill._renderer.scale.y);
        }
        ctx.fill();
        if (isOffset) {
          ctx.restore();
        }
      }

      if (!webgl.isHidden.test(stroke)) {
        isOffset = stroke._renderer && stroke._renderer.offset;
        if (isOffset) {
          ctx.save();
          ctx.translate(
            - stroke._renderer.offset.x, - stroke._renderer.offset.y);
          ctx.scale(stroke._renderer.scale.x, stroke._renderer.scale.y);
          ctx.lineWidth = linewidth / stroke._renderer.scale.x;
        }
        ctx.stroke();
        if (isOffset) {
          ctx.restore();
        }
      }

      ctx.restore();

    },

    // Returns the rect of a set of verts. Typically takes vertices that are
    // "centered" around 0 and returns them to be anchored upper-left.
    getBoundingClientRect: function(vertices, border, rect) {

      var left = Infinity, right = -Infinity,
          top = Infinity, bottom = -Infinity,
          width, height;

      vertices.forEach(function(v) {

        var x = v.x, y = v.y, controls = v.controls;
        var a, b, c, d, cl, cr;

        top = Math.min(y, top);
        left = Math.min(x, left);
        right = Math.max(x, right);
        bottom = Math.max(y, bottom);

        if (!v.controls) {
          return;
        }

        cl = controls.left;
        cr = controls.right;

        if (!cl || !cr) {
          return;
        }

        a = v._relative ? cl.x + x : cl.x;
        b = v._relative ? cl.y + y : cl.y;
        c = v._relative ? cr.x + x : cr.x;
        d = v._relative ? cr.y + y : cr.y;

        if (!a || !b || !c || !d) {
          return;
        }

        top = Math.min(b, d, top);
        left = Math.min(a, c, left);
        right = Math.max(a, c, right);
        bottom = Math.max(b, d, bottom);

      });

      // Expand borders

      if (typeof border === 'number') {
        top -= border;
        left -= border;
        right += border;
        bottom += border;
      }

      width = right - left;
      height = bottom - top;

      rect.top = top;
      rect.left = left;
      rect.right = right;
      rect.bottom = bottom;
      rect.width = width;
      rect.height = height;

      if (!rect.centroid) {
        rect.centroid = {};
      }

      rect.centroid.x = - left;
      rect.centroid.y = - top;

    },

    render: function(gl, program, forcedParent) {

      if (!this._visible || !this._opacity) {
        return this;
      }

      this._update();

      // Calculate what changed

      var parent = forcedParent || this.parent;
      var flagParentMatrix = parent._matrix.manual || parent._flagMatrix;
      var flagMatrix = this._matrix.manual || this._flagMatrix;
      var parentChanged = this._renderer.parent !== parent;
      var flagTexture = this._flagVertices || this._flagFill
        || (this._fill instanceof LinearGradient && (this._fill._flagSpread || this._fill._flagStops || this._fill._flagEndPoints))
        || (this._fill instanceof RadialGradient && (this._fill._flagSpread || this._fill._flagStops || this._fill._flagRadius || this._fill._flagCenter || this._fill._flagFocal))
        || (this._fill instanceof Texture && (this._fill._flagLoaded && this._fill.loaded || this._fill._flagImage || this._fill._flagVideo || this._fill._flagRepeat || this._fill._flagOffset || this._fill._flagScale))
        || (this._stroke instanceof LinearGradient && (this._stroke._flagSpread || this._stroke._flagStops || this._stroke._flagEndPoints))
        || (this._stroke instanceof RadialGradient && (this._stroke._flagSpread || this._stroke._flagStops || this._stroke._flagRadius || this._stroke._flagCenter || this._stroke._flagFocal))
        || (this._stroke instanceof Texture && (this._stroke._flagLoaded && this._stroke.loaded || this._stroke._flagImage || this._stroke._flagVideo || this._stroke._flagRepeat || this._stroke._flagOffset || this._fill._flagScale))
        || this._flagStroke || this._flagLinewidth || this._flagOpacity
        || parent._flagOpacity || this._flagVisible || this._flagCap
        || this._flagJoin || this._flagMiter || this._flagScale
        || (this.dashes && this.dashes.length > 0)
        || !this._renderer.texture;

      if (flagParentMatrix || flagMatrix || parentChanged) {

        if (!this._renderer.matrix) {
          this._renderer.matrix = new NumArray(9);
        }

        // Reduce amount of object / array creation / deletion

        this._matrix.toTransformArray(true, transformation);

        multiplyMatrix(transformation, parent._renderer.matrix, this._renderer.matrix);

        if (!(this._renderer.scale instanceof Vector)) {
          this._renderer.scale = new Vector();
        }
        if (this._scale instanceof Vector) {
          this._renderer.scale.x = this._scale.x * parent._renderer.scale.x;
          this._renderer.scale.y = this._scale.y * parent._renderer.scale.y;
        } else {
          this._renderer.scale.x = this._scale * parent._renderer.scale.x;
          this._renderer.scale.y = this._scale * parent._renderer.scale.y;
        }

        if (parentChanged) {
          this._renderer.parent = parent;
        }
      }

      if (this._mask) {

        // Stencil away everything that isn't rendered by the mask
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.enable(gl.STENCIL_TEST);

        gl.stencilFunc(gl.ALWAYS, 1, 0);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        // Don't draw the element onto the canvas, only onto the stencil buffer
        gl.colorMask(false, false, false, false);

        webgl[this._mask._renderer.type].render.call(this._mask, gl, program, this);

        gl.stencilFunc(gl.EQUAL, 1, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.colorMask(true, true, true, true);

      }

      if (flagTexture) {

        if (!this._renderer.rect) {
          this._renderer.rect = {};
        }

        this._renderer.opacity = this._opacity * parent._renderer.opacity;

        webgl.path.getBoundingClientRect(this._renderer.vertices, this._linewidth, this._renderer.rect);

        webgl.updateTexture.call(webgl, gl, this);

      } else {

        // We still need to update child Two elements on the fill and
        // stroke properties.
        if (this._fill && this._fill._update) {
          this._fill._update();
        }
        if (this._stroke && this._stroke._update) {
          this._stroke._update();
        }

      }

      if (this._clip && !forcedParent) {
        return;
      }

      // Draw Texture
      gl.bindTexture(gl.TEXTURE_2D, this._renderer.texture);

      // Draw Rect
      var rect = this._renderer.rect;
      gl.uniformMatrix3fv(program.matrix, false, this._renderer.matrix);
      gl.uniform4f(program.rect, rect.left, rect.top, rect.right, rect.bottom);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (this._mask) {
        gl.disable(gl.STENCIL_TEST);
      }

      return this.flagReset();

    }

  },

  points: {
    updateCanvas: function() {
      console.warn('Two.Points.updateCanvas not yet implemented in WebGLRenderer.');
    },
    render: function() {
      console.warn('Two.Points.render not yet implemented in WebGLRenderer.');
    },
    getBoundingClientRect: function() {
      console.warn('Two.Points.getBoundingClientRect not yet implemented in WebGLRenderer.');
    }
  },

  text: {

    updateCanvas: function(elem) {

      var canvas = this.canvas;
      var ctx = this.ctx;

      // Styles
      var scale = elem._renderer.scale;
      var stroke = elem._stroke;
      var linewidth = elem._linewidth * scale;
      var fill = elem._fill;
      var opacity = elem._renderer.opacity || elem._opacity;
      var dashes = elem.dashes;
      var decoration = elem._decoration;

      canvas.width = Math.max(Math.ceil(elem._renderer.rect.width * scale.x), 1);
      canvas.height = Math.max(Math.ceil(elem._renderer.rect.height * scale.y), 1);

      var centroid = elem._renderer.rect.centroid;
      var cx = centroid.x;
      var cy = centroid.y;

      var a, b, c, d, e, sx, sy, x1, y1, x2, y2;
      var isOffset = fill._renderer && fill._renderer.offset
        && stroke._renderer && stroke._renderer.offset;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isOffset) {
        ctx.font = [elem._style, elem._weight, elem._size + 'px/' +
          elem._leading + 'px', elem._family].join(' ');
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Styles
      if (fill) {
        if (typeof fill === 'string') {
          ctx.fillStyle = fill;
        } else {
          webgl[fill._renderer.type].render.call(fill, ctx, elem);
          ctx.fillStyle = fill._renderer.effect;
        }
      }
      if (stroke) {
        if (typeof stroke === 'string') {
          ctx.strokeStyle = stroke;
        } else {
          webgl[stroke._renderer.type].render.call(stroke, ctx, elem);
          ctx.strokeStyle = stroke._renderer.effect;
        }
        if (linewidth) {
          ctx.lineWidth = linewidth;
        }
      }
      if (typeof opacity === 'number') {
        ctx.globalAlpha = opacity;
      }
      if (dashes && dashes.length > 0) {
        ctx.lineDashOffset = dashes.offset || 0;
        ctx.setLineDash(dashes);
      }

      ctx.save();
      ctx.scale(scale.x, scale.y);
      ctx.translate(cx, cy);

      if (!webgl.isHidden.test(fill)) {

        if (fill._renderer && fill._renderer.offset) {

          sx = fill._renderer.scale.x;
          sy = fill._renderer.scale.y;

          ctx.save();
          ctx.translate( - fill._renderer.offset.x,
            - fill._renderer.offset.y);
          ctx.scale(sx, sy);

          a = elem._size / fill._renderer.scale.y;
          b = elem._leading / fill._renderer.scale.y;
          ctx.font = [elem._style, elem._weight, a + 'px/',
            b + 'px', elem._family].join(' ');

          c = fill._renderer.offset.x / fill._renderer.scale.x;
          d = fill._renderer.offset.y / fill._renderer.scale.y;

          ctx.fillText(elem.value, c, d);
          ctx.restore();

        } else {
          ctx.fillText(elem.value, 0, 0);
        }

      }

      if (!webgl.isHidden.test(stroke)) {

        if (stroke._renderer && stroke._renderer.offset) {

          sx = stroke._renderer.scale.x;
          sy = stroke._renderer.scale.y;

          ctx.save();
          ctx.translate(- stroke._renderer.offset.x,
            - stroke._renderer.offset.y);
          ctx.scale(sx, sy);

          a = elem._size / stroke._renderer.scale.y;
          b = elem._leading / stroke._renderer.scale.y;
          ctx.font = [elem._style, elem._weight, a + 'px/',
            b + 'px', elem._family].join(' ');

          c = stroke._renderer.offset.x / stroke._renderer.scale.x;
          d = stroke._renderer.offset.y / stroke._renderer.scale.y;
          e = linewidth / stroke._renderer.scale.x;

          ctx.lineWidth = e;
          ctx.strokeText(elem.value, c, d);
          ctx.restore();

        } else {
          ctx.strokeText(elem.value, 0, 0);
        }

      }

      // Handle text-decoration
      if (/(underline|strikethrough)/i.test(decoration)) {

        var metrics = ctx.measureText(elem.value);

        switch (decoration) {
          case 'underline':
            y1 = metrics.actualBoundingBoxAscent;
            y2 = metrics.actualBoundingBoxAscent;
            break;
          case 'strikethrough':
            y1 = 0;
            y2 = 0;
            break;
        }

        x1 = - metrics.width / 2;
        x2 = metrics.width / 2;

        ctx.lineWidth = Math.max(Math.floor(elem._size / 15), 1);
        ctx.strokeStyle = ctx.fillStyle;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

      }

      ctx.restore();

    },

    getBoundingClientRect: function(elem, rect) {

      var ctx = webgl.ctx;

      ctx.font = [elem._style, elem._weight, elem._size + 'px/' +
        elem._leading + 'px', elem._family].join(' ');

      ctx.textAlign = 'center';
      ctx.textBaseline = elem._baseline;

      // TODO: Estimate this better
      var width = ctx.measureText(elem._value).width * 1.25;
      var height = Math.max(elem._size, elem._leading) * 1.25;

      if (this._linewidth && !webgl.isHidden.test(this._stroke)) {
        width += this._linewidth * 2;
        height += this._linewidth * 2;
      }

      var w = width / 2;
      var h = height / 2;

      switch (webgl.alignments[elem._alignment] || elem._alignment) {

        case webgl.alignments.left:
          rect.left = 0;
          rect.right = width;
          break;
        case webgl.alignments.right:
          rect.left = - width;
          rect.right = 0;
          break;
        default:
          rect.left = - w;
          rect.right = w;
      }

      // TODO: Gradients aren't inherited...
      switch (elem._baseline) {
        case 'bottom':
          rect.top = - height;
          rect.bottom = 0;
          break;
        case 'top':
          rect.top = 0;
          rect.bottom = height;
          break;
        default:
          rect.top = - h;
          rect.bottom = h;
      }

      rect.width = width;
      rect.height = height;

      if (!rect.centroid) {
        rect.centroid = {};
      }

      // TODO:
      rect.centroid.x = w;
      rect.centroid.y = h;

    },

    render: function(gl, program, forcedParent) {

      if (!this._visible || !this._opacity) {
        return this;
      }

      this._update();

      // Calculate what changed

      var parent = forcedParent || this.parent;
      var flagParentMatrix = parent._matrix.manual || parent._flagMatrix;
      var flagMatrix = this._matrix.manual || this._flagMatrix;
      var parentChanged = this._renderer.parent !== parent;
      var flagTexture = this._flagVertices || this._flagFill
        || (this._fill instanceof LinearGradient && (this._fill._flagSpread || this._fill._flagStops || this._fill._flagEndPoints))
        || (this._fill instanceof RadialGradient && (this._fill._flagSpread || this._fill._flagStops || this._fill._flagRadius || this._fill._flagCenter || this._fill._flagFocal))
        || (this._fill instanceof Texture && (this._fill._flagLoaded && this._fill.loaded || this._fill._flagImage || this._fill._flagVideo || this._fill._flagRepeat || this._fill._flagOffset || this._fill._flagScale))
        || (this._stroke instanceof LinearGradient && (this._stroke._flagSpread || this._stroke._flagStops || this._stroke._flagEndPoints))
        || (this._stroke instanceof RadialGradient && (this._stroke._flagSpread || this._stroke._flagStops || this._stroke._flagRadius || this._stroke._flagCenter || this._stroke._flagFocal))
        || (this._stroke instanceof Texture && (this._stroke._flagLoaded && this._stroke.loaded || this._stroke._flagImage || this._stroke._flagVideo || this._stroke._flagRepeat || this._stroke._flagOffset || this._fill._flagScale))
        || this._flagStroke || this._flagLinewidth || this._flagOpacity
        || parent._flagOpacity || this._flagVisible || this._flagScale
        || this._flagValue || this._flagFamily || this._flagSize
        || this._flagLeading || this._flagAlignment || this._flagBaseline
        || this._flagStyle || this._flagWeight || this._flagDecoration
        || (this.dashes && this.dashes.length > 0)
        || !this._renderer.texture;

      if (flagParentMatrix || flagMatrix || parentChanged) {

        if (!this._renderer.matrix) {
          this._renderer.matrix = new NumArray(9);
        }

        // Reduce amount of object / array creation / deletion

        this._matrix.toTransformArray(true, transformation);

        multiplyMatrix(transformation, parent._renderer.matrix, this._renderer.matrix);

        if (!(this._renderer.scale instanceof Vector)) {
          this._renderer.scale = new Vector();
        }
        if (this._scale instanceof Vector) {
          this._renderer.scale.x = this._scale.x * parent._renderer.scale.x;
          this._renderer.scale.y = this._scale.y * parent._renderer.scale.y;
        } else {
          this._renderer.scale.x = this._scale * parent._renderer.scale.x;
          this._renderer.scale.y = this._scale * parent._renderer.scale.y;
        }

        if (parentChanged) {
          this._renderer.parent = parent;
        }
      }

      if (this._mask) {

        // Stencil away everything that isn't rendered by the mask
        gl.clear(gl.STENCIL_BUFFER_BIT);
        gl.enable(gl.STENCIL_TEST);

        gl.stencilFunc(gl.ALWAYS, 1, 0);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        // Don't draw the element onto the canvas, only onto the stencil buffer
        gl.colorMask(false, false, false, false);

        webgl[this._mask._renderer.type].render.call(this._mask, gl, program, this);

        gl.stencilFunc(gl.EQUAL, 1, 0xff);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        gl.colorMask(true, true, true, true);

      }

      if (flagTexture) {

        if (!this._renderer.rect) {
          this._renderer.rect = {};
        }

        this._renderer.opacity = this._opacity * parent._renderer.opacity;

        webgl.text.getBoundingClientRect(this, this._renderer.rect);

        webgl.updateTexture.call(webgl, gl, this);

      } else {

        // We still need to update child Two elements on the fill and
        // stroke properties.
        if (this._fill && this._fill._update) {
          this._fill._update();
        }
        if (this._stroke && this._stroke._update) {
          this._stroke._update();
        }

      }

      if (this._clip && !forcedParent) {
        return;
      }

      // Draw Texture
      gl.bindTexture(gl.TEXTURE_2D, this._renderer.texture);

      // Draw Rect
      var rect = this._renderer.rect;
      gl.uniformMatrix3fv(program.matrix, false, this._renderer.matrix);
      gl.uniform4f(program.rect, rect.left, rect.top, rect.right, rect.bottom);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (this._mask) {
        gl.disable(gl.STENCIL_TEST);
      }

      return this.flagReset();

    }

  },

  'linear-gradient': {

    render: function(ctx, elem) {

      if (!ctx.canvas.getContext('2d')) {
        return;
      }

      this._update();

      if (!this._renderer.effect || this._flagEndPoints || this._flagStops) {

        this._renderer.effect = ctx.createLinearGradient(
          this.left._x, this.left._y,
          this.right._x, this.right._y
        );

        for (var i = 0; i < this.stops.length; i++) {
          var stop = this.stops[i];
          this._renderer.effect.addColorStop(stop._offset, stop._color);
        }

      }

      return this.flagReset();

    }

  },

  'radial-gradient': {

    render: function(ctx, elem) {

      if (!ctx.canvas.getContext('2d')) {
        return;
      }

      this._update();

      if (!this._renderer.effect || this._flagCenter || this._flagFocal
          || this._flagRadius || this._flagStops) {

        this._renderer.effect = ctx.createRadialGradient(
          this.center._x, this.center._y, 0,
          this.focal._x, this.focal._y, this._radius
        );

        for (var i = 0; i < this.stops.length; i++) {
          var stop = this.stops[i];
          this._renderer.effect.addColorStop(stop._offset, stop._color);
        }

      }

      return this.flagReset();

    }

  },

  texture: {

    render: function(ctx, elem) {

      if (!ctx.canvas.getContext('2d')) {
        return;
      }

      this._update();

      var image = this.image;

      if (((this._flagLoaded || this._flagImage || this._flagVideo || this._flagRepeat) && this.loaded)) {
        this._renderer.effect = ctx.createPattern(image, this._repeat);
      } else if (!this._renderer.effect) {
        return this.flagReset();
      }

      if (this._flagOffset || this._flagLoaded || this._flagScale) {

        if (!(this._renderer.offset instanceof Vector)) {
          this._renderer.offset = new Vector();
        }

        this._renderer.offset.x = - this._offset.x;
        this._renderer.offset.y = - this._offset.y;

        if (image) {

          this._renderer.offset.x += image.width / 2;
          this._renderer.offset.y += image.height / 2;

          if (this._scale instanceof Vector) {
            this._renderer.offset.x *= this._scale.x;
            this._renderer.offset.y *= this._scale.y;
          } else {
            this._renderer.offset.x *= this._scale;
            this._renderer.offset.y *= this._scale;
          }
        }

      }

      if (this._flagScale || this._flagLoaded) {

        if (!(this._renderer.scale instanceof Vector)) {
          this._renderer.scale = new Vector();
        }

        if (this._scale instanceof Vector) {
          this._renderer.scale.copy(this._scale);
        } else {
          this._renderer.scale.set(this._scale, this._scale);
        }

      }

      return this.flagReset();

    }

  },

  updateTexture: function(gl, elem) {

    this[elem._renderer.type].updateCanvas.call(webgl, elem);

    if (!elem._renderer.texture) {
      elem._renderer.texture = gl.createTexture();
    }

    gl.bindTexture(gl.TEXTURE_2D, elem._renderer.texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    if (this.canvas.width <= 0 || this.canvas.height <= 0) {
      return;
    }

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas);

  },

  program: {

    create: function(gl, shaders) {
      var program, linked, error;
      program = gl.createProgram();
      _.each(shaders, function(s) {
        gl.attachShader(program, s);
      });

      gl.linkProgram(program);
      linked = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (!linked) {
        error = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new TwoError('unable to link program: ' + error);
      }

      return program;

    }

  },

  shaders: {

    create: function(gl, source, type) {
      var shader, compiled, error;
      shader = gl.createShader(gl[type]);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!compiled) {
        error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new TwoError('unable to compile shader ' + shader + ': ' + error);
      }

      return shader;

    },

    types: {
      vertex: 'VERTEX_SHADER',
      fragment: 'FRAGMENT_SHADER'
    },

    vertex: [
      'precision mediump float;',
      'attribute vec2 a_position;',
      '',
      'uniform mat3 u_matrix;',
      'uniform vec2 u_resolution;',
      'uniform vec4 u_rect;',
      '',
      'varying vec2 v_textureCoords;',
      '',
      'void main() {',
      '   vec2 rectCoords = (a_position * (u_rect.zw - u_rect.xy)) + u_rect.xy;',
      '   vec2 projected = (u_matrix * vec3(rectCoords, 1.0)).xy;',
      '   vec2 normal = projected / u_resolution;',
      '   vec2 clipspace = (normal * 2.0) - 1.0;',
      '',
      '   gl_Position = vec4(clipspace * vec2(1.0, -1.0), 0.0, 1.0);',
      '   v_textureCoords = a_position;',
      '}'
    ].join('\n'),

    fragment: [
      'precision mediump float;',
      '',
      'uniform sampler2D u_image;',
      'varying vec2 v_textureCoords;',
      '',
      'void main() {',
      '  vec4 texel = texture2D(u_image, v_textureCoords);',
      '  if (texel.a == 0.0) {',
      '    discard;',
      '  }',
      '  gl_FragColor = texel;',
      '}'
    ].join('\n')

  },

  TextureRegistry: new Registry()

};

webgl.ctx = webgl.canvas.getContext('2d');

/**
 * @name Two.WebGLRenderer
 * @class
 * @extends Two.Events
 * @param {Object} [parameters] - This object is inherited when constructing a new instance of {@link Two}.
 * @param {Element} [parameters.domElement] - The `<canvas />` to draw to. If none given a new one will be constructed.
 * @param {HTMLCanvasElement} [parameters.offscreenElement] - The offscreen two dimensional `<canvas />` to render each element on WebGL texture updates.
 * @param {Boolean} [parameters.antialias] - Determines whether the canvas should clear render with antialias on.
 * @description This class is used by {@link Two} when constructing with `type` of `Two.Types.webgl`. It takes Two.js' scenegraph and renders it to a `<canvas />` through the WebGL api.
 * @see {@link https://www.khronos.org/registry/webgl/specs/latest/1.0/}
 */
function Renderer(params) {

  var gl, vs, fs;

  /**
   * @name Two.WebGLRenderer#domElement
   * @property {Element} - The `<canvas />` associated with the Two.js scene.
   */
  this.domElement = params.domElement || document.createElement('canvas');

  if (typeof params.offscreenElement !== 'undefined') {
    webgl.canvas = params.offscreenElement;
    webgl.ctx = webgl.canvas.getContext('2d');
  }

  /**
   * @name Two.WebGLRenderer#scene
   * @property {Two.Group} - The root group of the scenegraph.
   */
  this.scene = new Group();
  this.scene.parent = this;

  this._renderer = {
    type: 'renderer',
    matrix: new NumArray(identity),
    scale: 1,
    opacity: 1
  };
  this._flagMatrix = true;

  // http://games.greggman.com/game/webgl-and-alpha/
  // http://www.khronos.org/registry/webgl/specs/latest/#5.2
  params = _.defaults(params || {}, {
    antialias: false,
    alpha: true,
    premultipliedAlpha: true,
    stencil: true,
    preserveDrawingBuffer: true,
    overdraw: false
  });

  /**
   * @name Two.WebGLRenderer#overdraw
   * @property {Boolean} - Determines whether the canvas clears the background each draw call.
   * @default true
   */
  this.overdraw = params.overdraw;

  /**
   * @name Two.WebGLRenderer#ctx
   * @property {WebGLContext} - Associated two dimensional context to render on the `<canvas />`.
   */
  gl = this.ctx = this.domElement.getContext('webgl', params) ||
    this.domElement.getContext('experimental-webgl', params);

  if (!this.ctx) {
    throw new TwoError(
      'unable to create a webgl context. Try using another renderer.');
  }

  // Compile Base Shaders to draw in pixel space.
  vs = webgl.shaders.create(
    gl, webgl.shaders.vertex, webgl.shaders.types.vertex);
  fs = webgl.shaders.create(
    gl, webgl.shaders.fragment, webgl.shaders.types.fragment);

  /**
   * @name Two.WebGLRenderer#program
   * @property {WebGLProgram} - Associated WebGL program to render all elements from the scenegraph.
   */
  this.program = webgl.program.create(gl, [vs, fs]);
  gl.useProgram(this.program);

  // Create and bind the drawing buffer

  // look up where the vertex data needs to go.
  this.program.position = gl.getAttribLocation(this.program, 'a_position');
  this.program.matrix = gl.getUniformLocation(this.program, 'u_matrix');
  this.program.rect = gl.getUniformLocation(this.program, 'u_rect');

  // Bind the vertex buffer
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(this.program.position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(this.program.position);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new NumArray([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1
    ]),
    gl.STATIC_DRAW);

  // Setup some initial statements of the gl context
  gl.enable(gl.BLEND);

  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  gl.blendEquation(gl.FUNC_ADD);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}

_.extend(Renderer, {

  /**
   * @name Two.WebGLRenderer.Utils
   * @property {Object} - A massive object filled with utility functions and properties to render Two.js objects to a `<canvas />` through the WebGL API.
   */
  Utils: webgl

});

_.extend(Renderer.prototype, Events, {

  constructor: Renderer,

  /**
   * @name Two.WebGLRenderer#setSize
   * @function
   * @fires resize
   * @param {Number} width - The new width of the renderer.
   * @param {Number} height - The new height of the renderer.
   * @param {Number} [ratio] - The new pixel ratio (pixel density) of the renderer. Defaults to calculate the pixel density of the user's screen.
   * @description Change the size of the renderer.
   */
  setSize: function(width, height, ratio) {

    this.width = width;
    this.height = height;

    this.ratio = typeof ratio === 'undefined' ? getRatio(this.ctx) : ratio;

    this.domElement.width = width * this.ratio;
    this.domElement.height = height * this.ratio;

    if (_.isObject(this.domElement.style)) {
      _.extend(this.domElement.style, {
        width: width + 'px',
        height: height + 'px'
      });
    }

    // Set for this.stage parent scaling to account for HDPI
    this._renderer.matrix[0] = this._renderer.matrix[4] = this._renderer.scale = this.ratio;

    this._flagMatrix = true;

    this.ctx.viewport(0, 0, width * this.ratio, height * this.ratio);

    var resolutionLocation = this.ctx.getUniformLocation(
      this.program, 'u_resolution');
    this.ctx.uniform2f(resolutionLocation, width * this.ratio, height * this.ratio);

    return this.trigger(Events.Types.resize, width, height, ratio);

  },

  /**
   * @name Two.WebGLRenderer#render
   * @function
   * @description Render the current scene to the `<canvas />`.
   */
  render: function() {

    var gl = this.ctx;

    if (!this.overdraw) {
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    webgl.group.render.call(this.scene, gl, this.program);
    this._flagMatrix = false;

    return this;

  }

});

export default Renderer;
