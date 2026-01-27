import { SlideCap, TideCap } from "./models"

export const farmers_data = [
    {
        'text': 'In spring of 2019, historic flooding in major river systems ravaged the Midwest…',
        'image': 'img/flood.png',
        'template': 'a'
    },
    {
        'text': 'Dr. Mike Rosmann, serving as a therapist for farmers in Harlan, Iowa, found his work had started to become unbearable.',
        'image': 'img/therapist.png',
        'template': 'b'
    },
    {
        'text': `"I only take on the most difficult and unresolvable problems that you could ever see among farm people, where depression has not been successfully treated by any kind of medication or psychiatric help."`,
        'template': 'c'
    },
    {
        'text': `“I try to figure out what to do about them, because—well, I don’t know how else to say this, except that I have a lot of experience doing this.

"But the two calls I got today—those just wore me out emotionally.”`,
        'template': 'd'
    },
    {
        'text': `“The first came from a lady whose lover … is a large farmer. And he’s been told by creditors that he has to negotiate the sale or disposal of some of his farm assets, or they’ll shut him down.”`,
        'image': 'img/no_money.png',
        'template': 'e'
    },
    {
        'texts': [
            `“He said…`,
            'I will not go to mediation or court, I’ll kill myself before I have to do that. I will lose. I can’t do this.',
            `So she called me in desperation…”`
        ],
        'image': 'img/bubble.png',
        'template': 'f'
    },
    {
        'text': `“The second call came from another farmer. She told me she was desperate, because she didn’t know how to deal with uncertainty in her farming operation. Her email said—”`,
        'image': 'img/phone_call.png',
        'template': 'g'
    },
    {
        'text': "Thank you Dr. Rosmann for getting back to me. I am desperate. The financial strains of the farm are hard to take. Everything is compounded by my emotions... I experienced a trauma two and a half years ago and I can’t get past it. My brother, with whom I worked on our family farm, committed suicide in front of me. My husband says I’m changing, and I know I am.",
        'image': 'img/speaker.png',
        'template': 'h'
    },
    {
        'text': `“So this woman is looking to me about how to continue, and maybe even gauging whether she needs to join her brother.”`,
        'template': 'i'
    },
    {
        'text': `“Farmers have been calling me more and more recently. The number of calls has really increased since the beginning of March, when the flooding began.”`,
        'image': 'img/flood_bubble.png',
        'template': 'j'
    },
    {
        'text': 'If you were one of these two farmers who called Dr. Rosmann, how would you like him to help?',
        'multiple_choice': {
            options: [
              "Help me apply for crop insurance",
              "Tell me how to contact FEMA for emergency financial assistance",
              "Connect me with other farmers who are in similar straits, so I don’t feel so alone",
              "Help organize a protest against government inaction to protect us from such devastation"
            ],
            horizontal: false,
            multiple_selection: true,
            question: undefined,
            answer: undefined
          },
        'template': 'k'
    },
    {
        'text': `Can you think of any other means of addressing this issue? Why do you think it is important?

        Let’s pause for a moment and think about these questions.`,
        'template': 'l'
    },
    {
        'text': 'I think this real story is deeply connected with many things going on in the world.',
        'template': 'm'
    }

];

export const hose_data: SlideCap[] = [
    {
        text: "Here’s a hose coiled on the floor. If we turn on the water, which path will the water follow shooting out the hose?",
        template: 'a',
        stage: 1
    },
    {
        text: "Take a moment to consider why you chose this trajectory...",
        template: 'a',
        stage: 3
    },
    {
        text: `Water will shoot straight out.

        According to Newton’s First Law of Motion, things continue their motion (i.e., straight, in the same direction with the same speed) unless an external force acts on it. Thus, without the confinement of the hose, the water shoots out in a straight line.`,
        template: 'b',
        stage: 4
    },
    {
        text: "Now let’s see how we can connect garden hose to ocean tides.",
        template: 'c',
        stage: 4
    }
]

export const tides_data = [
    {
        'text': 'Gravitational force from the moon causes ocean tides. How many high tides and low tides does a coast experience a day?',
        'input_box': {
            options: [
                'Number of high tides per day:',
                'Number of low tides per day:'
            ]
        },
        'template': 'a'
    },
    {
        'text': 'Before I reveal the answer, can you explain your answer verbally to yourself?',
        'image': 'assets/slide_images/tides/lighthouse.png',
        'template': 'b'
    },
    {
        'text': `There are 2 high tides and 2 low tides a day.

Guess what? This time, Newton’s universal law of gravitation explains why! Let’s think through this together with open-mindedness!`,
        'template': 'c'
    }
];

export const tides_text: TideCap[] = [{
        texts: ['Imagine you are looking up at the rotating Earth from below the South Pole.'],
        template: 'd',
        stage: 0
    },
    {
        texts: ['The moon orbits Earth about once a month.', 'As Earth spins on its axis once each day, it is daytime for the side facing the Sun, and nighttime for the side turned away.'],
        template: 'd',
        stage: 0
    },
    {
        texts: ['As Earth rotates a full circle each day, a different part of our planet in turn comes closest to the moon.'],
        template: 'd',
        stage: 0
    },
    {
        texts: ['By Newton’s law, the closer two bodies are, the stronger the gravitational pull between them.'],
        template: 'd',
        stage: 0
    },
    {
        texts: ['So the part of the ocean nearest to the moon is pulled the most, resulting in a bulge.'],
        template: 'd',
        stage: 1
    },
    {
        texts: ['A common intuition is that water drained into the bulge causes a low tide on other side of the earth.'],
        template: 'd',
        stage: 1
    },
    {
        texts: ['But that’s a mistake—caused by our intuitive perception that Earth’s rigid body is stationary.'],
        template: 'd',
        stage: 1
    },
    {
        texts: ['In fact, the entire earth is floating in space!'],
        template: 'd',
        stage: 1
    },
    {
        texts: ['The core is pulled toward the moon too.', 'The ocean on the far side is pulled the least, so it’s left behind the most, creating another bulge'],
        template: 'd',
        stage: 2
    },
    {
        texts: ['So, as your part of the coast rotates into these two bulges of water — once each day — you experience a high tide.'],
        template: 'd',
        stage: 2
    },
    {
        texts: ['Conversely, as your part rotates into an area between the two bulges, because water is drained away from you, you experience a low tide.'],
        template: 'd',
        stage: 2
    },

];

export const orbit_text = [
    {
        template: 'a',
        texts: [
            'By the way, what if the same gravitational pull that causes the tides were to shut off? What path do you think our moon would take?',
            'Click the double-arrow to adjust the path.',
        ],
        stage: 3
    },
    {
        template: 'a',
        texts: [
            "The Moon's path would be completely straight, at an angle tangential to the Moon's usual orbit!",
            "This path seems awfully similar to the water shooting out of a coiled garden hose, doesn’t it?"
        ],
        stage: 5
    },
    {
        template: 'b',
        texts: ["Water shoots straight out at the end of the coiled garden hose, once its path isn't forced to curve inside the hose, following Newton's First Law of Motion: Things continue their motion unless an external force acts on it."],
        stage: 5
    },
    {
        template: 'b',
        texts: ['The Moon and water in the garden hose obey the same laws, laws that hold across the universe.'],
        stage: 5
    },
    {
        template: 'b',
        texts: ["Earth's massive pull on the Moon is what keeps it in orbit. This pull is what keeps the moon close to Earth, as we see it crossing our night sky every night!"],
        stage: 5
    },
    {
        template: 'c',
        texts: ["So the Moon’s orbit is connected to how water behaves in everyone’s garden. Would you like to connect more dots in the next challenge?"],
        stage: 5
    }
];

export const graph_prediction = [
    {
        stage: 0,
        text: "This graph shows how global surface temperature has changed over time.",
        template: 'a'
    },
    {
        stage: 1,
        text: `What is the cause of the change? Click the buttons to see four potential factors.
Which do you think is the most likely cause of the change in temperature?`,
        template: 'a'
    },
    {
        stage: 2,
        text: `It's this one!
So, what are these factors?`,
        template: 'a'
    },
    {
        stage: 3,
        text: `The four potential contributors are...`,
        template: 'a'
    },
    {
        stage: 4,
        text: `Changes in human activity across time best match changes in global surface temperature.`,
        template: 'a'
    },
    {
        stage: 5,
        text: `Atmospheric physicist James Hansen, son of a tenant farmer in Iowa, predicted that the 21st century would see:`,
        template: 'b'
    },
    {
        stage: 5,
        text: `1. more extreme droughts and floods as climate zones shift,
        
        2. the erosion of ice sheets resulting in worldwide rise in sea level, and
        
        3. the opening of the fabled Northwest Passage.`,
        template: 'b'
    },
    {
        stage: 5,
        text: `All of these predicted impacts have since eerily become facts.`,
        template: 'c'
    },
    {
        stage: 5,
        text: `What year do you think Hansen first made these predictions based on his research?`,
        template: 'c'
    },
    {
        stage: 5,
        text: `1981!
        …long before any of those changes and events appeared.`,
        template: 'c'
    },
    {
        stage: 5,
        text: `James Hansen's paper titled 'Climate Impact of Increasing Atmospheric Carbon Dioxide' was published in 1981.`,
        template: 'c'
    },
    {
        stage: 5,
        text: `In 1988, Hansen testified at the hearing hosted by the Senate Energy and Natural Resources Committee, where he stressed the causal influence of human activities on the climate.`,
        template: 'c'
    }
]
    
export const graph_matching = [
    {
        stage: 0,
        text: "Let’s take a look at a graph showing the changing amount of something..."
    },
    {
        stage: 1,
        text: `Let’s call this something “𝑥”`
    },
    {
        stage: 1,
        text: "Here is the actual data for 𝑥 from the year 1880 to 1965."
    },
    {
        stage: 1,
        text: "The vertical axis indicates the quantity of 𝑥."
    },
    {
        stage: 1,
        text: "Without knowing what 𝑥 is, can you extrapolate this graph beyond the year 1965?" 
    },
    {
        stage: 2,
        text: "What do you think would be the most plausible projection based on the past measurement of 𝑥? Use the slider to change the projected line." 
    },
    {
        stage: 3,
        text: "It may be reasonable to think that 𝑥 should remain similar before and after 1965 if one assume no change in circumstances"
    },
    {
        stage: 4,
        text: "However, 𝑥 has actually risen sharply after 1965."
    },
    {
        stage: 4,
        text: "Do you have a guess what 𝑥 may be?"
    },
    {
        stage: 5,
        text: "𝑥 is the change of global temperature in °C (Celsius)."
    },
    {
        stage: 5,
        text: "The unusually rapid rise since 1965 suggests that some external cause led global temperature to deviate from past trends"
    },
    {
        stage: 5,
        text: "What do you think caused the rapid rise in global temperature since 1965? Let’s try to learn the answer in the next challenge!"

    }
]
