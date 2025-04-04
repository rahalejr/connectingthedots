export interface Slide {
    id: number
    type: string
    title: string
    frames: Frame[]
}

export interface Frame {
    id: number
    type: string
    title: string
    formatting: string
    duration?: number // in milliseconds
    paragraphs?: string[]
    image?: string
    animation?: boolean
    choices?: MultipleChoice
}

export interface MultipleChoice {
    options: string[] | undefined
    horizontal: boolean
    answer?: number
    question?: string
}