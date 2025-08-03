import ReactGA from "react-ga4";

/**
 * Initializes Google Analytics
 */
const initializeGA = (): void => {
  // Replace with your Measurement ID
  // It ideally comes from an environment variable
  ReactGA.initialize("G-PCJPF2JDXB");
  // Don't forget to remove the console.log() statements
  // when you are done
  console.log("GA INITIALIZED");
};

/**
 * Tracks a Google Analytics event
 * @param category - Event category
 * @param action - Event action
 * @param label - Event label
 */
const trackGAEvent = (
  category: string,
  action: string,
  label: string
): void => {
  // Send GA4 Event
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

export default initializeGA;
export { initializeGA, trackGAEvent };
