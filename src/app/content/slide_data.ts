import { Slide } from "./models";

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
            multiple_selection: false,
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

]

