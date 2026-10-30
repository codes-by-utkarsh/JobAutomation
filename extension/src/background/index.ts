import type { Job, MessageType } from "../types"

const API_URL = process.env.PLASMO_PUBLIC_API_URL || "http://localhost:8000"

// State
let isGhostActive = false
let currentJob: Job | null = null

chrome.runtime.onMessage.addListener((message: MessageType, sender, sendResponse) => {
    handleMessage(message).then(sendResponse)
    return true // Async response
})

async function handleMessage(message: MessageType) {
    console.log("[Ghost Background] Received:", message)

    switch (message.type) {
        case "ACTIVATE_GHOST":
            isGhostActive = true
            return { success: true, state: "active" }

        case "DEACTIVATE_GHOST":
            isGhostActive = false
            return { success: true, state: "inactive" }

        case "GET_NEXT_JOB":
            if (!isGhostActive) return { job: null }
            return await fetchNextJob()

        case "REPORT_STATUS":
            return await reportStatus(message.payload)
    }
}

async function fetchNextJob() {
    try {
        const res = await fetch(`${API_URL}/jobs/next`)
        if (!res.ok) throw new Error("Failed to fetch job")
        const job = await res.json()
        currentJob = job
        return { job }
    } catch (err) {
        console.error(err)
        return { job: null } // No job or error
    }
}

async function reportStatus(payload: any) {
    try {
        await fetch(`${API_URL}/jobs/status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        return { success: true }
    } catch (err) {
        return { success: false }
    }
}
