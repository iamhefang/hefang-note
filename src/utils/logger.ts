export const logger = {
  log(...args: unknown[]) {
    console.log(...arguments)
  },
  info(...args: unknown[]) {
    console.info(...arguments)
  },
  warn(...args: unknown[]) {
    console.info(...arguments)
  },
  error(...args: unknown[]) {
    console.info(...arguments)
  },
}
