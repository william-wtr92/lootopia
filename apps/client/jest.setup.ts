/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import "@testing-library/jest-dom"

window.HTMLElement.prototype.scrollIntoView = () => {}
window.HTMLElement.prototype.hasPointerCapture = () => false
