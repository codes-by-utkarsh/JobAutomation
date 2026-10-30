import type { PlasmoCSConfig } from "plasmo"
import { classifyElement, type FieldType } from "../utils/dom-classifier"

export const config: PlasmoCSConfig = {
    matches: ["https://*/*"],
    all_frames: true
}

// State
let formFields: Map<HTMLElement, FieldType> = new Map()

// Observer
const observer = new MutationObserver((mutations) => {
    let shouldScan = false
    for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            shouldScan = true
            break
        }
    }

    if (shouldScan) {
        scanPage()
    }
})

function scanPage() {
    const inputs = document.querySelectorAll("input, textarea, select, button")

    inputs.forEach((input) => {
        if (input instanceof HTMLElement && !formFields.has(input)) {
            // Ignore hidden fields (basic check)
            if (input.offsetParent === null) return

            const type = classifyElement(input)
            if (type !== "unknown") {
                console.log(`[Ghost] Detected ${type}:`, input)
                formFields.set(input, type)
                highlightElement(input, type)
            }
        }
    })
}

function highlightElement(element: HTMLElement, type: FieldType) {
    element.style.border = "2px solid red"
    element.setAttribute("data-ghost-type", type)
}

// Init
window.addEventListener("load", () => {
    console.log("[Ghost] 👻 Initialized")
    scanPage()
    observer.observe(document.body, { childList: true, subtree: true })
})
