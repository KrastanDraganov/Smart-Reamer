/**
 * This plugin is no longer needed. Expo SDK 55 requires Xcode 26+ (Swift 6.2).
 * Kept as a no-op so app.json doesn't break if still referenced.
 */
function withSwift5Pods(config) {
  return config;
}

module.exports = withSwift5Pods;
