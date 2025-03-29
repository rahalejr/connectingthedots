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
    paragraphs?: string[]
    image?: string
    animation?: boolean
    choices?: MultipleChoice
}

export interface MultipleChoice {
    options: string[] | undefined
    answer?: number
    question?: string
}