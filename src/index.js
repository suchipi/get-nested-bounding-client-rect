// @flow
export type DOMRect = {
  top: number,
  left: number,
  width: number,
  height: number,
  bottom: number,
  right: number,
  x: number,
  y: number,
};

function getElementDimensions(element: HTMLElement) {
  const calculatedStyle = element.ownerDocument.defaultView.getComputedStyle(
    element
  );

  return {
    borderLeft: parseFloat(calculatedStyle.borderLeftWidth),
    borderRight: parseFloat(calculatedStyle.borderRightWidth),
    borderTop: parseFloat(calculatedStyle.borderTopWidth),
    borderBottom: parseFloat(calculatedStyle.borderBottomWidth),
    marginLeft: parseFloat(calculatedStyle.marginLeft),
    marginRight: parseFloat(calculatedStyle.marginRight),
    marginTop: parseFloat(calculatedStyle.marginTop),
    marginBottom: parseFloat(calculatedStyle.marginBottom),
    paddingLeft: parseFloat(calculatedStyle.paddingLeft),
    paddingRight: parseFloat(calculatedStyle.paddingRight),
    paddingTop: parseFloat(calculatedStyle.paddingTop),
    paddingBottom: parseFloat(calculatedStyle.paddingBottom),
  };
}

// Get the window object for the document that a node belongs to,
// or return null if it cannot be found (node not attached to DOM,
// etc).
function getOwnerWindow(node: DOMNode): Window | null {
  if (!node.ownerDocument) {
    return null;
  }
  return node.ownerDocument.defaultView;
}

// Get the iframe containing a node, or return null if it cannot
// be found (node not within iframe, etc).
function getOwnerIframe(node: DOMNode): DOMNode | null {
  const nodeWindow = getOwnerWindow(node);
  if (nodeWindow) {
    return nodeWindow.frameElement;
  }
  return null;
}

// Get a bounding client rect for a node, with an
// offset added to compensate for its border.
function getBoundingClientRectWithBorderOffset(node: DOMNode) {
  const dimensions = getElementDimensions(node);
  return mergeRectOffsets([
    node.getBoundingClientRect(),
    {
      top: dimensions.borderTop,
      left: dimensions.borderLeft,
      bottom: dimensions.borderBottom,
      right: dimensions.borderRight,
      // This width and height won't get used by mergeRectOffsets (since this
      // is not the first rect in the array), but we set them so that this
      // object typechecks as a DOMRect.
      width: 0,
      height: 0,
      x: dimensions.borderLeft,
      y: dimensions.borderTop,
    },
  ]);
}

// Add together the top, left, bottom, and right properties of
// each DOMRect, but keep the width and height of the first one.
function mergeRectOffsets(rects: Array<DOMRect>): DOMRect {
  return rects.reduce((previousRect, rect) => {
    if (previousRect == null) {
      return rect;
    }
    const nextTop = previousRect.top + rect.top;
    const nextLeft = previousRect.left + rect.left;

    return {
      top: nextTop,
      left: nextLeft,
      width: previousRect.width,
      height: previousRect.height,
      bottom: nextTop + previousRect.height,
      right: nextLeft + previousRect.width,
      x: nextLeft,
      y: nextTop,
    };
  });
}

// Calculate a boundingClientRect for a node relative to boundaryWindow,
// taking into account any offsets caused by intermediate iframes.
module.exports = function getNestedBoundingClientRect(
  node: DOMNode,
  boundaryWindow: Window = window
): DOMRect {
  const ownerIframe = getOwnerIframe(node);
  if (ownerIframe == null || getOwnerWindow(ownerIframe) === boundaryWindow) {
    return node.getBoundingClientRect();
  }

  const rects = [node.getBoundingClientRect()];

  let currentIframe = ownerIframe;
  while (currentIframe) {
    const rect = getBoundingClientRectWithBorderOffset(currentIframe);
    rects.push(rect);

    currentIframe = getOwnerIframe(currentIframe);
    if (currentIframe && getOwnerWindow(currentIframe) === boundaryWindow) {
      // We don't want to calculate iframe offsets upwards beyond
      // the iframe containing the boundaryWindow, but we
      // need to calculate the offset relative to the boundaryWindow.
      const rect = getBoundingClientRectWithBorderOffset(currentIframe);
      rects.push(rect);
      break;
    }
  }

  return mergeRectOffsets(rects);
};
