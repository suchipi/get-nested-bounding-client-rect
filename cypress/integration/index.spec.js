/// <reference types="Cypress" />
/* global describe, it, beforeEach, cy, expect */
const getNestedBoundingClientRect = require("../..");

describe("get-nested-bounding-client-rect", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/");

    cy.get(".red").then(($red) => {
      cy.get("iframe")
        .then(($blueFrame) => {
          const red = $red[0];
          const blueFrame = $blueFrame[0];
          const blue = blueFrame.contentDocument.querySelector(".blue");
          const greenFrame = blueFrame.contentDocument.querySelector("iframe");
          const green = greenFrame.contentDocument.querySelector(".green");

          const getStyles = (el) =>
            el.ownerDocument.defaultView.getComputedStyle(el);

          const nestedRedRect = getNestedBoundingClientRect(red);
          const nestedBlueRect = getNestedBoundingClientRect(blue);
          const nestedGreenRect = getNestedBoundingClientRect(green);

          const redRect = red.getBoundingClientRect();
          const blueRect = blue.getBoundingClientRect();
          const greenRect = green.getBoundingClientRect();

          const blueFrameRect = blueFrame.getBoundingClientRect();
          const blueFrameStyles = getStyles(blueFrame);

          const greenFrameRect = greenFrame.getBoundingClientRect();
          const greenFrameStyles = getStyles(greenFrame);

          return {
            nestedRedRect,
            nestedBlueRect,
            nestedGreenRect,
            redRect,
            blueRect,
            greenRect,
            blueFrameRect,
            blueFrameStyles,
            greenFrameRect,
            greenFrameStyles,
          };
        })
        .as("data");
    });
  });

  describe("element not in iframe (red)", () => {
    it("width", () => {
      cy.get("@data").then(({ redRect, nestedRedRect }) => {
        expect(nestedRedRect.width).to.equal(redRect.width);
      });
    });

    it("height", () => {
      cy.get("@data").then(({ redRect, nestedRedRect }) => {
        expect(nestedRedRect.height).to.equal(redRect.height);
      });
    });

    it("top", () => {
      cy.get("@data").then(({ redRect, nestedRedRect }) => {
        expect(nestedRedRect.top).to.equal(redRect.top);
      });
    });

    it("left", () => {
      cy.get("@data").then(({ redRect, nestedRedRect }) => {
        expect(nestedRedRect.left).to.equal(redRect.left);
      });
    });

    it("right", () => {
      cy.get("@data").then(({ redRect, nestedRedRect }) => {
        expect(nestedRedRect.right).to.equal(redRect.right);
      });
    });

    it("bottom", () => {
      cy.get("@data").then(({ redRect, nestedRedRect }) => {
        expect(nestedRedRect.bottom).to.equal(redRect.bottom);
      });
    });
  });

  describe("element nested one iframe deep (blue)", () => {
    it("width", () => {
      cy.get("@data").then(({ blueRect, nestedBlueRect }) => {
        expect(nestedBlueRect.width).to.equal(blueRect.width);
      });
    });

    it("height", () => {
      cy.get("@data").then(({ blueRect, nestedBlueRect }) => {
        expect(nestedBlueRect.height).to.equal(blueRect.height);
      });
    });

    it("top", () => {
      cy.get("@data").then(
        ({ blueRect, nestedBlueRect, blueFrameRect, blueFrameStyles }) => {
          expect(nestedBlueRect.top).to.equal(
            blueFrameRect.top +
              parseInt(blueFrameStyles.borderTop) +
              blueRect.top
          );
        }
      );
    });

    it("left", () => {
      cy.get("@data").then(
        ({ blueRect, nestedBlueRect, blueFrameRect, blueFrameStyles }) => {
          expect(nestedBlueRect.left).to.equal(
            blueFrameRect.left +
              parseInt(blueFrameStyles.borderLeft) +
              blueRect.left
          );
        }
      );
    });

    it("right", () => {
      cy.get("@data").then(
        ({ blueRect, nestedBlueRect, blueFrameRect, blueFrameStyles }) => {
          expect(nestedBlueRect.right).to.equal(
            blueFrameRect.left +
              parseInt(blueFrameStyles.borderLeft) +
              blueRect.left +
              blueRect.width
          );
        }
      );
    });

    it("bottom", () => {
      cy.get("@data").then(
        ({ blueRect, nestedBlueRect, blueFrameRect, blueFrameStyles }) => {
          expect(nestedBlueRect.bottom).to.equal(
            blueFrameRect.top +
              parseInt(blueFrameStyles.borderTop) +
              blueRect.top +
              blueRect.height
          );
        }
      );
    });
  });

  describe("element nested two iframes deep (green)", () => {
    it("width", () => {
      cy.get("@data").then(({ greenRect, nestedGreenRect }) => {
        expect(nestedGreenRect.width).to.equal(greenRect.width);
      });
    });

    it("height", () => {
      cy.get("@data").then(({ greenRect, nestedGreenRect }) => {
        expect(nestedGreenRect.height).to.equal(greenRect.height);
      });
    });

    it("top", () => {
      cy.get("@data").then(
        ({
          greenRect,
          nestedGreenRect,
          greenFrameRect,
          greenFrameStyles,
          blueFrameRect,
          blueFrameStyles,
        }) => {
          expect(nestedGreenRect.top).to.equal(
            blueFrameRect.top +
              parseInt(blueFrameStyles.borderTop) +
              greenFrameRect.top +
              parseInt(greenFrameStyles.borderTop) +
              greenRect.top
          );
        }
      );
    });

    it("left", () => {
      cy.get("@data").then(
        ({
          greenRect,
          nestedGreenRect,
          greenFrameRect,
          greenFrameStyles,
          blueFrameRect,
          blueFrameStyles,
        }) => {
          expect(nestedGreenRect.left).to.equal(
            blueFrameRect.left +
              parseInt(blueFrameStyles.borderLeft) +
              greenFrameRect.left +
              parseInt(greenFrameStyles.borderLeft) +
              greenRect.left
          );
        }
      );
    });

    it("right", () => {
      cy.get("@data").then(
        ({
          greenRect,
          nestedGreenRect,
          greenFrameRect,
          greenFrameStyles,
          blueFrameRect,
          blueFrameStyles,
        }) => {
          expect(nestedGreenRect.right).to.equal(
            blueFrameRect.left +
              parseInt(blueFrameStyles.borderLeft) +
              greenFrameRect.left +
              parseInt(greenFrameStyles.borderLeft) +
              greenRect.left +
              greenRect.width
          );
        }
      );
    });

    it("bottom", () => {
      cy.get("@data").then(
        ({
          greenRect,
          nestedGreenRect,
          greenFrameRect,
          greenFrameStyles,
          blueFrameRect,
          blueFrameStyles,
        }) => {
          expect(nestedGreenRect.bottom).to.equal(
            blueFrameRect.top +
              parseInt(blueFrameStyles.borderTop) +
              greenFrameRect.top +
              parseInt(greenFrameStyles.borderTop) +
              greenRect.top +
              greenRect.height
          );
        }
      );
    });
  });
});
