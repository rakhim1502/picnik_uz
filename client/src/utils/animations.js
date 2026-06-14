// Page transitions
export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
};

// Fade in up
export const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

// Stagger container
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

// Scale in
export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
};

// Slide in right
export const slideInRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
};

// Hover scale
export const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.2 }
};

// Pulse
export const pulse = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
};