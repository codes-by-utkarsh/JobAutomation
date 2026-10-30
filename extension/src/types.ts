export interface Job {
    id: string
    url: string
    title: string
    company: string
    platform: "linkedin" | "indeed" | "glassdoor" | "other"
}

export interface ApplicationStatus {
    jobId: string
    status: "applied" | "failed" | "skipped"
    timestamp: string
}

export type MessageType =
    | { type: "GET_NEXT_JOB" }
    | { type: "REPORT_STATUS", payload: ApplicationStatus }
    | { type: "ACTIVATE_GHOST" }
    | { type: "DEACTIVATE_GHOST" }
