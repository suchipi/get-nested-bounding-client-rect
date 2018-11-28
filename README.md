# `get-nested-bounding-client-rect`

This package provides a function that gives you a bounding DOMRect for an HTMLElement, taking into account offsets caused by any iframe(s) containing that element.

Imagine you have this in your DOM:

```html
<div id="iframe-wrapper">
  <iframe src="http://some-video-website.example.com/videoId=1234"> </iframe>
</div>
```

And the page inside the iframe renders this:

```html
<html>
  <body>
    <div id="header">...</div>
    <video src="..."></video>
  </body>
</html>
```

And you want to draw an overlay tooltip on top of that `<video>` there, when the user hovers over it.

If you call [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) on that `<video>` element, the numbers in the [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) returned are relative to the `iframe`'s document, not your document (its parent). So you couldn't use them to position a tooltip in your document.

If you use the `getNestedBoundingClientRect` function provided by this package instead, then you'll get a `DOMRect` whose numbers are relative to _your_ document.

## Installation

```
npm install --save get-nested-bounding-client-rect
```

## Usage

```js
const getNestedBoundingClientRect = require("get-nested-bounding-client-rect");

// el can be any HTMLElement, within an iframe or not (or nested within multiple iframes)
const el = document
  .querySelector("iframe")
  .contentDocument.querySelector("#target");

const rect = getNestedBoundingClientRect(el);

// Resulting rect has offsets added to compensate for any iframes el is nested within
console.log(rect);
// {
//   top: 45,
//   left: 45,
//   bottom: 245,
//   right: 245,
//   width: 200,
//   height: 200,
// }
```

If you have an element nested within multiple iframes and you need to calculate the offset relative to one of the iframes in the root document rather than the root document itself,

1. God help you
2. You can pass in an iframe's `window` object as the second argument to `getNestedBoundingClientRect`.

```js
const getNestedBoundingClientRect = require("get-nested-bounding-client-rect");

// Some iframe that you want to calculate a rect relative to
const iframe = document.querySelector("iframe");
// The window object (global) inside that iframe
const iframeWindow = iframe.contentDocument.defaultView;

// el is some deep descendant of that iframe; in this case, it's nested in another inner iframe (iframe2)
const iframe2 = iframe.contentDocument.querySelector("iframe");
const el = iframe2.contentDocument.querySelector("#target");

const rect = getNestedBoundingClientRect(el, iframeWindow);

// Resulting rect has offsets added for iframe2 but not iframe
console.log(rect);
// {
//   top: 45,
//   left: 45,
//   bottom: 245,
//   right: 245,
//   width: 200,
//   height: 200,
// }
```

Note that this will only work if the element you pass into `getNestedBoundingClientRect` is within the iframe window you pass in; otherwise, it will behave as if you didn't pass an iframe window in.

## License

MIT
