function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function getRandomDelay(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export async function simulateTyping(element: HTMLInputElement | HTMLTextAreaElement, text: string) {
    element.focus()

    // Simulate clicking into field
    await simulateClick(element)

    for (const char of text) {
        const charCode = char.charCodeAt(0)

        // KeyDown
        element.dispatchEvent(new KeyboardEvent("keydown", { key: char, code: `Key${char.toUpperCase()}`, charCode, bubbles: true }))

        // KeyPress
        element.dispatchEvent(new KeyboardEvent("keypress", { key: char, code: `Key${char.toUpperCase()}`, charCode, bubbles: true }))

        // Input update (Crucial for React/Angular binding)
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(element, element.value + char)
        } else {
            element.value += char
        }

        element.dispatchEvent(new Event("input", { bubbles: true }))

        // KeyUp
        element.dispatchEvent(new KeyboardEvent("keyup", { key: char, code: `Key${char.toUpperCase()}`, charCode, bubbles: true }))

        // Random delay between keystrokes (30ms to 150ms)
        await sleep(getRandomDelay(30, 150))

        // Occasional pause to simulate thinking
        if (Math.random() < 0.05) {
            await sleep(getRandomDelay(200, 600))
        }
    }

    element.dispatchEvent(new Event("change", { bubbles: true }))
    element.blur()
}

export async function simulateClick(element: HTMLElement) {
    const rect = element.getBoundingClientRect()

    // MouseDown
    element.dispatchEvent(new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
    }))

    await sleep(getRandomDelay(50, 150))

    // MouseUp
    element.dispatchEvent(new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
    }))

    // Click
    element.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
    }))
}
