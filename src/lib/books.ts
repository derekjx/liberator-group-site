export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface QuizProfile {
  id: string;
  title: string;
  /** The named pattern — specific, not generic */
  pattern: string;
  /** What this means about where they are */
  description: string;
  /** Where in the book this is addressed */
  bookSection: string;
  /** The natural next step */
  cta: string;
  ctaHref: string;
  ctaSecondary?: string;
  ctaSecondaryHref?: string;
  /** Which answer values map to this profile (majority wins) */
  triggers: string[];
}

export interface BookQuiz {
  intro: string;
  questions: QuizQuestion[];
  profiles: QuizProfile[];
}

export interface BookData {
  slug: string;
  status: "available" | "coming-soon" | "future";
  statusLabel: string;
  title: string;
  subtitle: string;
  price?: string;
  tagline: string;
  description: string;
  forYouIf: string[];
  themes: string[];
  quiz: BookQuiz;
}

export const books: BookData[] = [
  {
    slug: "unleash-your-super-power",
    status: "available",
    statusLabel: "Available now",
    title: "Unleash Your Super Power",
    subtitle: "Find Your Purpose. Break the Golden Handcuffs. Live the Life You Already Know Is Yours.",
    price: "$24.99",
    tagline:
      "Most books on purpose tell you to find your passion. This one tells you why you haven't — and names the internal pattern precisely enough that you can finally move.",
    description:
      "You are not stuck because you lack ambition, intelligence, or courage. You are stuck because the life you are living was built for a version of success that no longer fits — and the internal structure keeping you in it is invisible until it is named. Unleash Your Super Power is about finding your purpose, breaking the golden handcuffs, silencing the noise that masquerades as practicality, and choosing — deliberately — the life you don't want to retire from.",
    forYouIf: [
      "You know what matters to you and cannot seem to choose it",
      "External success has arrived and meaning hasn't followed",
      "You suspect there's a version of your life you keep not living",
      "The golden handcuffs are real — and so is the cost of keeping them on",
      "You feel the noise of obligations, opinions, and 'shoulds' louder than your own clarity",
    ],
    themes: [
      "Purpose discovery — what it actually is, beneath the noise",
      "Breaking the golden handcuffs — the internal cost of staying safe",
      "Silencing the distraction that masquerades as practicality",
      "Living intentionally, on your own terms, without apology",
      "The difference between a life built for others and one built for yourself",
    ],
    quiz: {
      intro:
        "Answer honestly. There are no right answers — only true ones. This takes about two minutes and will show you exactly where in the book your journey begins.",
      questions: [
        {
          id: "q1",
          question:
            "When you imagine the life you actually want, what happens internally?",
          options: [
            { label: "I feel clear about it but something stops me from choosing it", value: "handcuffs" },
            { label: "The image is blurry — I'm not sure what I actually want anymore", value: "purpose" },
            { label: "I can see it, but the noise of other people's expectations drowns it out", value: "noise" },
            { label: "I've stopped imagining — it feels too far from where I am", value: "identity" },
          ],
        },
        {
          id: "q2",
          question:
            "What feels most true about why you haven't made the change you know you need to make?",
          options: [
            { label: "The financial and status cost of leaving feels too high", value: "handcuffs" },
            { label: "I don't have enough clarity on what I'd be moving toward", value: "purpose" },
            { label: "Other people's needs, opinions, or expectations keep overriding mine", value: "noise" },
            { label: "I'm not sure who I am outside of what I've built so far", value: "identity" },
          ],
        },
        {
          id: "q3",
          question: "When you think about your current work or life, which describes it best?",
          options: [
            { label: "Successful by most measures, but quietly unfulfilling", value: "handcuffs" },
            { label: "Fine — but I have a persistent feeling I'm supposed to be doing something else", value: "purpose" },
            { label: "Busy and reactive — I rarely get space to think about what I actually want", value: "noise" },
            { label: "It reflects who I used to be, not who I am now", value: "identity" },
          ],
        },
        {
          id: "q4",
          question: "What does freedom mean to you right now?",
          options: [
            { label: "Leaving behind the salary and status without feeling like I've thrown it all away", value: "handcuffs" },
            { label: "Knowing — with certainty — what I'm supposed to be doing with my life", value: "purpose" },
            { label: "Being able to hear my own voice above everything else competing for my attention", value: "noise" },
            { label: "Becoming the person I know I'm capable of being, not the one I've always been", value: "identity" },
          ],
        },
        {
          id: "q5",
          question: "What do you most need to be true by the end of reading this book?",
          options: [
            { label: "That I can let go of what I've built without losing who I am", value: "handcuffs" },
            { label: "That I know what I'm here for — with enough clarity to act on it", value: "purpose" },
            { label: "That I can finally prioritise my own life without guilt", value: "noise" },
            { label: "That I understand what's been keeping me from the version of myself I know exists", value: "identity" },
          ],
        },
      ],
      profiles: [
        {
          id: "handcuffs",
          title: "The Golden Handcuff",
          pattern:
            "You know exactly what you want. The obstacle is not uncertainty — it is the weight of what you would have to release to choose it.",
          description:
            "The salary, the title, the security — they are real. But you already know they are not the true cost. The true cost is the identity that has been built around them. Letting go feels less like a financial decision and more like a disappearance. That is the pattern this book addresses directly.",
          bookSection:
            "Begin with Part Two: Breaking the Golden Handcuffs — specifically the chapter on the identity beneath the income.",
          cta: "Get the book",
          ctaHref: "buy",
          ctaSecondary: "Talk to a coach",
          ctaSecondaryHref: "/coaching",
          triggers: ["handcuffs"],
        },
        {
          id: "purpose",
          title: "The Purpose Seeker",
          pattern:
            "You are not lacking ambition. You are lacking the specific kind of clarity that only comes when the noise is quiet enough to hear what was already there.",
          description:
            "Purpose is not discovered by thinking harder. It has been present all along, beneath the layers of expectation, obligation, and the version of yourself that was built for other people's definitions of success. The work is not to find it — it is to clear enough space to hear it.",
          bookSection:
            "Begin at the beginning — Part One: Unleashing Your Super Power is written for exactly where you are.",
          cta: "Get the book",
          ctaHref: "buy",
          ctaSecondary: "Take the free quiz",
          ctaSecondaryHref: "#quiz",
          triggers: ["purpose"],
        },
        {
          id: "noise",
          title: "The Noise-Overwhelmed",
          pattern:
            "Your clarity is not the problem. The volume of everything competing for your attention has made it impossible to act from what you already know.",
          description:
            "The obligations, the opinions, the 'shoulds' — they are not malicious. But they are loud. And they have become louder than your own knowing. The pattern is not that you lack direction. It is that you have allowed external noise to function as an internal voice.",
          bookSection:
            "Start with Part Three: Silencing the Noise — the chapters on distinguishing your voice from the ones you've borrowed.",
          cta: "Get the book",
          ctaHref: "buy",
          ctaSecondary: "Talk to a coach",
          ctaSecondaryHref: "/coaching",
          triggers: ["noise"],
        },
        {
          id: "identity",
          title: "The Identity Threshold",
          pattern:
            "The life you want requires a version of you that hasn't fully formed yet — and standing at that threshold feels, from the inside, like failure.",
          description:
            "You are not blocked by fear in the ordinary sense. You are blocked by a coherent, functioning identity that does not yet include what comes next. The resistance is not weakness — it is the predictable sensation of an identity at the edge of its own expansion.",
          bookSection:
            "Begin with Part Four: Living the Life You Were Born to Live — and the chapter on identity at the threshold.",
          cta: "Get the book",
          ctaHref: "buy",
          ctaSecondary: "Talk to a coach",
          ctaSecondaryHref: "/coaching",
          triggers: ["identity"],
        },
      ],
    },
  },
  {
    slug: "building-castles-in-the-sky",
    status: "coming-soon",
    statusLabel: "Coming Q3 2026",
    title: "Building Castles in the Sky",
    subtitle: "How to Bring What You Dare to Imagine Into the World.",
    tagline:
      "The title is a reclamation. Building castles in the sky is normally a warning against ungrounded dreaming. This book makes it the most daring act possible — and shows you how to complete it.",
    description:
      "You have a vision. You can see it clearly. The gap between that vision and a finished, real thing — that gap is not about talent, effort, or even time. It is about the specific internal structure that either makes completion possible or quietly ensures it never arrives. This book is about that structure, and about the practice of grounding what you dare to imagine into something others can touch.",
    forYouIf: [
      "You have more visions than completed projects",
      "You can see the end clearly and cannot find the bridge",
      "You have started — and stopped — the same thing more than once",
      "Finishing feels harder than starting, always",
      "You suspect what stops you is not ability, but something internal you haven't named",
    ],
    themes: [
      "The gap between vision and execution — what actually lives there",
      "Why intelligent people finish everything except the thing that matters",
      "The internal structure of completion — not as discipline, but as readiness",
      "How to begin again from the middle of something unfinished",
      "Daring to build what others dismiss as fantasy — and completing it",
    ],
    quiz: {
      intro:
        "This takes two minutes. It will show you where in the vision-to-completion journey you are — and where in this book the work begins for you.",
      questions: [
        {
          id: "q1",
          question: "When you look at the vision you haven't yet completed, what is most true?",
          options: [
            { label: "I start well and lose momentum before the end", value: "momentum" },
            { label: "I never quite start — I'm always preparing, researching, or refining", value: "start" },
            { label: "I finish things but not the one thing that matters most", value: "priority" },
            { label: "I've stopped believing the vision is achievable for me", value: "belief" },
          ],
        },
        {
          id: "q2",
          question: "What does the space between your idea and a finished thing feel like?",
          options: [
            { label: "A long road that gets harder as I go", value: "momentum" },
            { label: "A gap I can't see how to cross yet", value: "start" },
            { label: "Something I keep choosing not to cross, even when I could", value: "priority" },
            { label: "A distance that feels personal — like a verdict on my capability", value: "belief" },
          ],
        },
        {
          id: "q3",
          question: "When you think about the last big thing you didn't finish, what stopped you?",
          options: [
            { label: "It got harder and I lost the energy that started it", value: "momentum" },
            { label: "I wasn't sure it was ready — so I kept working on the beginning", value: "start" },
            { label: "Other priorities took over, and the thing I cared about most got pushed out", value: "priority" },
            { label: "A quiet voice said it wasn't going to work, and I listened", value: "belief" },
          ],
        },
        {
          id: "q4",
          question: "What does completion mean to you?",
          options: [
            { label: "Sustaining the energy and focus all the way to the end", value: "momentum" },
            { label: "Taking the first real step — not the preparation, but the thing itself", value: "start" },
            { label: "Choosing the thing that matters over everything that competes for my attention", value: "priority" },
            { label: "Proving to myself that what I imagine is actually possible", value: "belief" },
          ],
        },
        {
          id: "q5",
          question: "What do you most need this book to give you?",
          options: [
            { label: "A way to keep moving when the initial energy runs out", value: "momentum" },
            { label: "Permission — and a method — to actually begin", value: "start" },
            { label: "Clarity on why I keep finishing everything except the thing I care about most", value: "priority" },
            { label: "Evidence that the vision I carry is not a fantasy but a direction", value: "belief" },
          ],
        },
      ],
      profiles: [
        {
          id: "momentum",
          title: "The Momentum Loser",
          pattern:
            "You begin well. The energy is real. But somewhere in the middle — when the initial clarity fades and the end is not yet visible — the momentum quietly dissolves.",
          description:
            "The middle is where most visions die. Not because the person gives up, but because the internal state that makes the beginning exciting does not automatically carry through to the work of the middle. This is learnable. This book addresses it directly.",
          bookSection:
            "Your section is Part Three: The Middle — the part no one talks about, and the part where everything is decided.",
          cta: "Notify me at launch",
          ctaHref: "#notify",
          ctaSecondary: "Read Book One first",
          ctaSecondaryHref: "/books/unleash-your-super-power",
          triggers: ["momentum"],
        },
        {
          id: "start",
          title: "The Perpetual Preparer",
          pattern:
            "You are not afraid of the work. You are afraid of committing to a version that might not be the right one — so you stay in the preparation, which feels like progress.",
          description:
            "Preparation is real work. But there is a moment when it stops being preparation and starts being protection — protection from the exposure of actually beginning. That moment is what this book is designed to help you cross.",
          bookSection:
            "Begin with Part One: The Act of Beginning — specifically the chapter on the difference between preparation and protection.",
          cta: "Notify me at launch",
          ctaHref: "#notify",
          ctaSecondary: "Read Book One first",
          ctaSecondaryHref: "/books/unleash-your-super-power",
          triggers: ["start"],
        },
        {
          id: "priority",
          title: "The Misaligned Finisher",
          pattern:
            "You are capable of completion. You prove it regularly — with everything except the thing that matters most to you.",
          description:
            "This is one of the most specific and painful forms of stuckness: finishing everything on the periphery while the central thing waits. It is not laziness. It is a very particular internal pattern around priority and permission that this book names and addresses.",
          bookSection:
            "Your entry point is Part Two: Choosing the Thing — the chapter on why we finish what we don't love and avoid what we do.",
          cta: "Notify me at launch",
          ctaHref: "#notify",
          ctaSecondary: "Read Book One first",
          ctaSecondaryHref: "/books/unleash-your-super-power",
          triggers: ["priority"],
        },
        {
          id: "belief",
          title: "The Doubting Visionary",
          pattern:
            "The vision is real and so is your capability. The obstacle is a quiet internal voice that has learned to sound like reason.",
          description:
            "This is not imposter syndrome in the generic sense. It is a specific kind of learned disbelief — one that attaches itself to exactly the visions that matter most and disguises itself as practical thinking. Naming it precisely is the first step through it.",
          bookSection:
            "Start with Part Four: The Castle and the Sky — the chapter on the internal voice that masquerades as realism.",
          cta: "Notify me at launch",
          ctaHref: "#notify",
          ctaSecondary: "Talk to a coach",
          ctaSecondaryHref: "/coaching",
          triggers: ["belief"],
        },
      ],
    },
  },
  {
    slug: "overcoming-adversity",
    status: "future",
    statusLabel: "Coming soon",
    title: "Overcoming Adversity",
    subtitle: "Internal Navigation for the Moments That Don't Resolve Quickly.",
    tagline:
      "Resilience is not endurance. It is the capacity to navigate from within — to move through difficulty rather than simply survive it.",
    description:
      "The third book in the series. When the path meets real resistance — not as a metaphor, but in the specific, embodied way that stops people who were moving — this is the book for that moment. It is not about coping. It is about developing the internal navigation that makes difficulty a teacher rather than a wall.",
    forYouIf: [
      "You are in the middle of something hard and cannot see through it",
      "You have endured but haven't moved — surviving without progressing",
      "You need more than encouragement — you need language for what is happening",
      "The same kind of adversity keeps appearing in different forms",
      "You know resilience is possible but you're not sure what it actually requires",
    ],
    themes: [
      "What resistance actually is, beneath the story we tell about it",
      "Why endurance is not enough — and what replaces it",
      "Internal navigation through moments that don't resolve quickly",
      "The difference between surviving difficulty and moving through it",
      "Adversity as a signal, not a verdict",
    ],
    quiz: {
      intro:
        "This diagnostic will show you what kind of adversity you are navigating — and where in this book the work begins for you.",
      questions: [
        {
          id: "q1",
          question: "What is most true about the difficulty you are currently facing?",
          options: [
            { label: "I'm managing it, but not moving through it — it keeps returning", value: "cycle" },
            { label: "I'm frozen — I can see what needs to happen but cannot act", value: "frozen" },
            { label: "I'm exhausted — I've been enduring for a long time", value: "endurance" },
            { label: "I've lost the sense of why I'm doing this at all", value: "meaning" },
          ],
        },
        {
          id: "q2",
          question: "When adversity arrives, what is your most consistent internal response?",
          options: [
            { label: "I deal with it — then it comes back in a different form", value: "cycle" },
            { label: "I think about it constantly but find it hard to take action", value: "frozen" },
            { label: "I push through — but pushing is getting harder", value: "endurance" },
            { label: "I ask whether any of this is worth it", value: "meaning" },
          ],
        },
        {
          id: "q3",
          question: "What does moving through this difficulty look like to you?",
          options: [
            { label: "Breaking the pattern so it stops returning", value: "cycle" },
            { label: "Finding enough internal ground to take the first real step", value: "frozen" },
            { label: "Recovering the energy to keep going without burning out", value: "endurance" },
            { label: "Reconnecting with a reason that makes the difficulty worth navigating", value: "meaning" },
          ],
        },
        {
          id: "q4",
          question: "What have you tried that hasn't worked?",
          options: [
            { label: "Solving the problem — it comes back because the root isn't the surface", value: "cycle" },
            { label: "Understanding it — I understand it well and am still frozen", value: "frozen" },
            { label: "Rest and recovery — they help briefly, then the exhaustion returns", value: "endurance" },
            { label: "Reminding myself of the goal — the motivation doesn't hold", value: "meaning" },
          ],
        },
        {
          id: "q5",
          question: "What do you most need from this book?",
          options: [
            { label: "A way to address the root of a pattern, not just its latest appearance", value: "cycle" },
            { label: "Something that moves me from paralysis to the next real step", value: "frozen" },
            { label: "A way to keep going that doesn't require more of what I no longer have", value: "endurance" },
            { label: "A language for what I'm experiencing that points toward something true", value: "meaning" },
          ],
        },
      ],
      profiles: [
        {
          id: "cycle",
          title: "The Pattern Repeater",
          pattern:
            "The adversity is not random. It recurs because its root has not been addressed — only its surface.",
          description:
            "You are not failing at resilience. You are applying solutions to the wrong level. Each time the pattern returns it is carrying the same signal — the same internal structure producing the same kind of difficulty. Naming that structure is what makes it possible to stop the cycle.",
          bookSection:
            "Your entry point is Part Two: The Pattern Beneath the Problem.",
          cta: "Notify me at launch",
          ctaHref: "#notify",
          ctaSecondary: "Start with Book One",
          ctaSecondaryHref: "/books/unleash-your-super-power",
          triggers: ["cycle"],
        },
        {
          id: "frozen",
          title: "The Still Point",
          pattern:
            "You understand what needs to happen. The gap is between understanding and the first real movement.",
          description:
            "Being frozen in the face of adversity is not weakness. It is the result of an internal state that does not yet include the action as available. The work is not to force movement — it is to shift the state so that movement becomes the natural next thing.",
          bookSection:
            "Begin with Part One: The Internal Ground — the chapter on moving from stillness to the first step.",
          cta: "Notify me at launch",
          ctaHref: "#notify",
          ctaSecondary: "Talk to a coach",
          ctaSecondaryHref: "/coaching",
          triggers: ["frozen"],
        },
        {
          id: "endurance",
          title: "The Long-Distance Carrier",
          pattern:
            "You have been resilient for a long time. The challenge now is that resilience-as-endurance has a limit — and you may be approaching it.",
          description:
            "Endurance is real strength. But it is not the same as navigation. Navigation means moving through difficulty with internal resource, not depleting what remains. This book is about the transition from surviving to navigating — and why one is sustainable and the other is not.",
          bookSection:
            "Your section is Part Three: Beyond Endurance — the chapter on the difference between surviving and navigating.",
          cta: "Notify me at launch",
          ctaHref: "#notify",
          ctaSecondary: "Talk to a coach",
          ctaSecondaryHref: "/coaching",
          triggers: ["endurance"],
        },
        {
          id: "meaning",
          title: "The Meaning Seeker",
          pattern:
            "The adversity has not broken your capacity. It has called into question the purpose beneath it.",
          description:
            "When difficulty disconnects you from the meaning of what you are doing, it becomes almost impossible to navigate. This is not a motivation problem. It is a connection problem — a loss of contact with why any of this matters. The work here is reconnection, not encouragement.",
          bookSection:
            "Begin with Part Four: The Why Beneath the What — the chapter on reconnecting with meaning under pressure.",
          cta: "Notify me at launch",
          ctaHref: "#notify",
          ctaSecondary: "Start with Book One",
          ctaSecondaryHref: "/books/unleash-your-super-power",
          triggers: ["meaning"],
        },
      ],
    },
  },
];

export function getBook(slug: string): BookData | undefined {
  return books.find((b) => b.slug === slug);
}

export function getAllBookSlugs(): string[] {
  return books.map((b) => b.slug);
}
