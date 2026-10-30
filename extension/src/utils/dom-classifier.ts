export type FieldType =
    | "first_name"
    | "last_name"
    | "email"
    | "phone"
    | "linkedin"
    | "portfolio"
    | "resume"
    | "cover_letter"
    | "submit"
    | "unknown"

export function classifyElement(element: HTMLElement): FieldType {
    const tagName = element.tagName.toLowerCase()
    const type_ = (element as HTMLInputElement).type?.toLowerCase() || ""
    const name = (element.getAttribute("name") || "").toLowerCase()
    const id = (element.getAttribute("id") || "").toLowerCase()
    const placeholder = (element.getAttribute("placeholder") || "").toLowerCase()
    const label = getLabelText(element).toLowerCase()

    const text = `${name} ${id} ${placeholder} ${label}`

    // 1. Resume Upload
    if (type_ === "file" || text.includes("resume") || text.includes("cv")) {
        return "resume"
    }

    // 2. Submit Button
    if (
        (tagName === "button" || type_ === "submit") &&
        (text.includes("apply") || text.includes("submit") || text.includes("continue"))
    ) {
        return "submit"
    }

    // 3. Contact Info
    if (text.includes("first name") || text.includes("firstname")) return "first_name"
    if (text.includes("last name") || text.includes("lastname")) return "last_name"
    if (type_ === "email" || text.includes("email")) return "email"
    if (type_ === "tel" || text.includes("phone") || text.includes("mobile")) return "phone"

    // 4. Links
    if (text.includes("linkedin")) return "linkedin"
    if (text.includes("portfolio") || text.includes("website")) return "portfolio"

    // 5. Cover Letter
    if (tagName === "textarea" && (text.includes("cover") || text.includes("letter"))) {
        return "cover_letter"
    }

    return "unknown"
}

function getLabelText(element: HTMLElement): string {
    let labelText = ""

    // Implicit label (wrapping)
    if (element.parentElement?.tagName === "LABEL") {
        labelText += element.parentElement.innerText
    }

    // Explicit label (for attribute)
    if (element.id) {
        const label = document.querySelector(`label[for="${element.id}"]`)
        if (label && label instanceof HTMLElement) {
            labelText += label.innerText
        }
    }

    // Aria label
    const ariaLabel = element.getAttribute("aria-label")
    if (ariaLabel) labelText += ariaLabel

    return labelText
}
