import { Slide } from "./models";


export const all_slides: Slide[] = [

    {
        id: 1,
        type: 'mixed',
        title: 'Farmers in Need',
        frames: [
                {
                    id: 1,
                    type: 'text',
                    title: '',
                    formatting: 'default',
                    paragraphs: [
                        "In spring of 2019, historic flooding in major river systems ravaged the Midwest.",
                        "Dr. Mike Rosmann, serving as a therapist for farmers in Harlan, Iowa, found his work had started to become unbearable."
                    ]
                },
                {
                    id: 2,
                    type: 'text',
                    title: '',
                    formatting: 'default',
                    paragraphs: [
                        '“I only take on the most difficult and unresolvable problems that you could ever see among farm people, where depression has not been successfully treated by any kind of medication or psychiatric help. I try to figure out what to do about them, because—well, I don’t know how else to say this, except that I have a lot of experience doing this. But the two calls I got today—those just wore me out emotionally.”'
                    ]
                },
                {
                    id: 3,
                    type: 'text',
                    title: '',
                    formatting: 'default',
                    paragraphs: [
                        '“The first came from a lady whose lover ... is a large farmer. And he’s been told by creditors that he has to negotiate the sale or disposal of some of his farm assets, or they’ll shut him down. He said, I will not go to mediation or court, I’ll kill myself before I have to do that. I will lose. I can’t do this. So she called me in desperation...."'
                    ]
                },
                {
                    id: 4,
                    type: 'text',
                    title: '',
                    formatting: 'default',
                    paragraphs: [
                        '“The second call came from another farmer. She told me she was desperate, because she didn’t know how to deal with uncertainty in her farming operation. Her email said ... :"'
                    ]
                },
                {
                    id: 5,
                    type: 'text',
                    title: '',
                    formatting: 'default',
                    paragraphs: [
                        "Thank you Dr. Rosmann for getting back to me. I am desperate. The financial strains of the farm are hard to take. Everything is compounded by my emotions... I experienced a trauma two and a half years ago and I can’t get past it. My brother, with whom I worked on our family farm, committed suicide in front of me. My husband says I’m changing, and I know I am.",
                        "So this woman is looking to me about how to continue, and maybe even gauging whether she needs to join her brother."
                    ]
                },
                {
                    id: 6,
                    type: 'text',
                    title: '',
                    formatting: 'default',
                    paragraphs: [
                        '"...farmers have been calling me more and more recently... The number of calls has really increased since the beginning of March, when the flooding began.”'
                    ]
                },
                {
                    id: 7,
                    type: 'mc',
                    title: '',
                    formatting: 'default',
                    paragraphs: [
                        "If you were one of these two farmers who called Dr. Rosmann, how would you like him to help?"
                    ],
                    choices: {
                        horizontal: false,
                        options: [
                            "Help me apply for crop insurance",
                            "Give me information on how to contact FEMA for emergency financial assistance",
                            "Direct me to another farmer who has been hit by a similar catastrophe, so I don’t feel so alone.",
                            "Connect me with other farmers in similar straits to organize a protest against government inaction to protect us from such devastating damage to our means of livelihood."
                        ],
                        answer: undefined,
                        multiple_selection: false
                    }
                },
                {
                    id: 8,
                    type: 'text',
                    title: '',
                    formatting: 'default',
                    paragraphs: [
                        "Can you think of any other means of addressing this issue? Why do you think it is important? Let’s pause for a moment and think about these questions.",
                    ]
                },
                {
                    id: 9,
                    type: 'text',
                    title: '',
                    formatting: 'default',
                    paragraphs: [
                        "I think this real story is deeply connected with many things going on in the world [...Let’s play a game to connect the dots. →]"
                    ]
                },
            ],
    },

    {
        id: 2,
        type: 'mixed',
        title: 'Water Pouring',
        frames: [
            {
                id: 1,
                type: 'mc_image',
                title: '',
                formatting: 'default',
                paragraphs: [
                    "Look at these two glasses. The water was filled to the same distances from the top of these glasses. If someone gradually tilts both glasses at the same rate, from which glass would water start to pour out first?"
                ],
                image: "assets/slide_images/beakers.png",
                choices: {
                    horizontal: false,
                    options: [
                        "Narrower glass first",
                        "Wider glass first",
                        "Both at the same time"
                    ],
                    answer: 1, // typesciript is zero-indexed, so this is the second mc option
                    multiple_selection: false
                }
            },
            {
                id: 2,
                type: 'text',
                title: '',
                formatting: 'default',
                paragraphs: [
                    "Before I reveal the answer, can you explain it verbally to yourself?"
                ]
            }
            
        ]
    },

    {
        id: 3,
        type: 'end',
        title: '',
        frames:[
            {
                id: 1,
                type: 'end',
                title: '',
                formatting: 'default',
                paragraphs: ['END OF CONTENT']
            }
        ]
    }
]

