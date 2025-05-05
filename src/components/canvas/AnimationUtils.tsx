// This file contains utility functions for animations using custom CSS transitions and transforms
// to replicate animation.js functionality without the dependency issues

export interface AnimationProps {
  target: HTMLElement;
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: "normal" | "reverse" | "alternate";
  loop?: boolean | number;
}

// Predefined easing functions
export const easings = {
  easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
  easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  easeInOutExpo: "cubic-bezier(0.87, 0, 0.13, 1)",
  // Add more easings as needed
};

// Base animation function
export const animate = ({
  target,
  duration = 500,
  delay = 0,
  easing = easings.easeInOutQuad,
}: AnimationProps) => {
  // Set base transition property
  target.style.transition = `all ${duration}ms ${easing} ${delay}ms`;
  return {
    // Fade in animation
    fadeIn: () => {
      target.style.opacity = "0";
      // Force reflow to ensure the initial state is applied
      target.offsetHeight;
      target.style.opacity = "1";
    },

    // Fade out animation
    fadeOut: () => {
      target.style.opacity = "1";
      // Force reflow
      target.offsetHeight;
      target.style.opacity = "0";
    },

    // Slide in from direction
    slideIn: (direction: "top" | "right" | "bottom" | "left" = "top", distance = 20) => {
      const translateMap = {
        top: `translateY(-${distance}px)`,
        right: `translateX(${distance}px)`,
        bottom: `translateY(${distance}px)`,
        left: `translateX(-${distance}px)`,
      };

      target.style.transform = translateMap[direction];
      target.style.opacity = "0";
      // Force reflow
      target.offsetHeight;
      target.style.transform = "translate(0, 0)";
      target.style.opacity = "1";
    },

    // Scale animation
    scale: (from = 0.8, to = 1) => {
      target.style.transform = `scale(${from})`;
      // Force reflow
      target.offsetHeight;
      target.style.transform = `scale(${to})`;
    },

    // Rotate animation
    rotate: (from = 0, to = 360) => {
      target.style.transform = `rotate(${from}deg)`;
      // Force reflow
      target.offsetHeight;
      target.style.transform = `rotate(${to}deg)`;
    },

    // Custom transform animation
    transform: (fromTransform: string, toTransform: string) => {
      target.style.transform = fromTransform;
      // Force reflow
      target.offsetHeight;
      target.style.transform = toTransform;
    },

    // Custom property animation for any CSS property
    property: (property: string, fromValue: string, toValue: string) => {
      target.style[property as any] = fromValue;
      // Force reflow
      target.offsetHeight;
      target.style[property as any] = toValue;
    },
  };
};

// Add element with animation
export const addElementWithAnimation = (
  element: HTMLElement,
  container: HTMLElement,
  animationType: "fadeIn" | "slideIn" | "scale" = "fadeIn"
) => {
  element.style.opacity = "0";
  container.appendChild(element);

  setTimeout(() => {
    const animation = animate({ target: element });
    switch (animationType) {
      case "fadeIn":
        animation.fadeIn();
        break;
      case "slideIn":
        animation.slideIn("bottom");
        break;
      case "scale":
        animation.scale();
        break;
      default:
        animation.fadeIn();
    }
  }, 10);
};

// Remove element with animation
export const removeElementWithAnimation = (
  element: HTMLElement,
  animationType: "fadeOut" | "slideOut" | "scale" = "fadeOut"
) => {
  return new Promise<void>((resolve) => {
    const animation = animate({ target: element });

    element.addEventListener("transitionend", () => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      resolve();
    }, { once: true });

    switch (animationType) {
      case "fadeOut":
        animation.fadeOut();
        break;
      case "slideOut":
        animation.property("transform", "translateY(0)", "translateY(20px)");
        animation.fadeOut();
        break;
      case "scale":
        animation.scale(1, 0.8);
        animation.fadeOut();
        break;
      default:
        animation.fadeOut();
    }
  });
};
