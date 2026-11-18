import type { DayContent } from '../../types';

export const DAYS_1_TO_10: DayContent[] = [
  /* ==========================================================================
   * DAY 1 — First Light
   * ======================================================================== */
  {
    day: 1,
    chapter: 1,
    slug: "first-light",
    title: "First Light",
    tagline: "Eye contact, a smile, and five good mornings.",
    estReadMinutes: 3,
    isMilestone: false,
    briefing: [
      {
        id: "d1-hook",
        kind: "hook",
        icon: "Sunrise",
        title: "Welcome to the field",
        body: "You can't finish this course just by reading it. Each day has a short briefing, one real-world mission, and a logbook entry. Today's mission is the smallest step possible: **be seen, and say hello.**",
      },
      {
        id: "d1-alarm",
        kind: "concept",
        icon: "Brain",
        title: "Your alarm is set too sensitive",
        body: "Social anxiety works like an overprotective smoke alarm that goes off for burnt toast. The alarm doesn't prove you're in danger. It proves you care. The only thing that recalibrates it is **evidence**, and evidence comes from reps.",
      },
      {
        id: "d1-spotlight",
        kind: "science",
        icon: "Eye",
        title: "The spotlight effect",
        finding: "Students sent into a room wearing an embarrassing T-shirt guessed that about **half** the people there noticed it. In reality, only about **a quarter** did. We consistently overestimate how much others notice and judge us.",
        source: "Gilovich, Medvec & Savitsky (2000), Journal of Personality and Social Psychology",
      },
      {
        id: "d1-myth-weird",
        kind: "mythBuster",
        myth: "If I say hi to a stranger, they'll think I'm weird.",
        reality: "Most people read a brief, warm greeting as exactly what it is: friendliness. A hello that asks for **nothing** (no time, no favor, no follow-up) is one of the lowest-pressure things one person can offer another.",
      },
      {
        id: "d1-three-part",
        kind: "concept",
        icon: "Smile",
        title: "The three-part greeting",
        body: "**Eyes:** hold their gaze for about as long as it takes to say hello. **Smile:** small and real, not a performance. **Voice:** 'Good morning' or 'Hey, how's it going?', loud enough to be heard the first time. Then keep walking.",
      },
      {
        id: "d1-beliefs",
        kind: "concept",
        icon: "Unlock",
        title: "Limiting beliefs have a weak spot",
        body: "Any belief that starts with 'I can't…' or 'I'm just not…' cracks under one question: **'Was there ever a time when…?'** If you think 'I'm awkward with strangers', ask whether you ever chatted easily with someone you'd just met. One example is enough to show the belief isn't a law.",
      },
      {
        id: "d1-quiz-nod",
        kind: "quiz",
        question: "You say 'Good morning' and the person just nods without smiling. How did your rep go?",
        options: [
          { id: "a", text: "Failed. They didn't respond warmly.", correct: false },
          { id: "b", text: "Success. You did your part, and their reaction is out of your hands.", correct: true },
          { id: "c", text: "Incomplete. You should repeat it louder.", correct: false },
        ],
        explanation: "The mission is the action, not the outcome. People are tired, distracted, wearing earbuds, or having a rough day. A nod is a response, and so is silence. You win the rep the moment you speak.",
      },
      {
        id: "d1-scenario-hallway",
        kind: "scenario",
        situation: "You're walking toward a neighbor you've never spoken to. Your eyes meet when you're about five meters apart.",
        prompt: "What do you do?",
        options: [
          {
            id: "a",
            text: "Look down at your phone until they pass.",
            rating: "avoid",
            feedback: "It feels safe, but it teaches your brain that eye contact is a threat. That's the exact loop we're breaking.",
          },
          {
            id: "b",
            text: "Hold eye contact, smile, and say 'Morning!' as you pass.",
            rating: "great",
            feedback: "Exactly. It's brief, warm, and asks for nothing. That's a perfect rep.",
          },
          {
            id: "c",
            text: "Wait until they're right next to you, then mumble 'hi'.",
            rating: "okay",
            feedback: "It counts, and it's a start. Next time, speak a beat earlier and a notch louder so it lands.",
          },
        ],
      },
      {
        id: "d1-takeaway",
        kind: "takeaway",
        title: "Today in four lines",
        points: [
          "Anxiety is a miscalibrated alarm, and reps recalibrate it.",
          "People notice and judge you far less than you think.",
          "Eyes, smile, voice. Then keep walking.",
          "The rep counts the moment you speak. Their reaction is a bonus.",
        ],
      },
    ],
    mission: {
      codename: "Operation Good Morning",
      objective: "Make brief, warm contact with 5 strangers.",
      contexts: ["neighborhood", "transit", "coffeeShop", "campus", "workplace"],
      standard: {
        title: "Five Good Mornings",
        brief: "Greet 5 strangers with eye contact, a genuine smile, and a spoken greeting.",
        steps: [
          "Pick everyday places: your street, the bus, a café line, a hallway.",
          "Catch their eye, smile, and say 'Good morning' (or 'Hi' / 'Hey, how's it going?').",
          "Keep walking. No conversation required.",
          "Tap Approach after each greeting.",
        ],
        targets: [{ counter: "approaches", target: 5, label: "Strangers greeted" }],
      },
      hardcore: {
        title: "Ten and a Follow-Up",
        brief: "Greet 10 strangers, and add a short follow-up line to at least 2 of them.",
        steps: [
          "Greet 10 people with eyes, smile, voice.",
          "For 2 of them, add one extra line: 'Enjoy the sunshine!' or 'Hope the coffee's strong today.'",
          "Make sure at least one person isn't in a service role, i.e. isn't paid to be friendly back.",
        ],
        targets: [{ counter: "approaches", target: 10, label: "Strangers greeted" }],
        checklist: ["Added a follow-up line to at least 2 greetings"],
      },
      tips: [
        "Earbuds out, phone in your pocket. You can't catch someone's eye while you're looking at a screen.",
        "If you freeze, count down 3-2-1 and speak before you hit zero. Hesitation is where the fear grows.",
        "No reply? Still a rep. Tap the counter.",
        "Felt awkward? Tap Courage too. Awkward moments earn the most XP.",
      ],
      guardrail: "Keep it brief and in passing. If someone looks busy, upset, or clearly wants space, a smile is enough.",
    },
    logbook: [
      {
        id: "d1-what-happened",
        question: "What actually happened? Describe one greeting that went better than you expected, and one that felt awkward.",
        placeholder: "The barista smiled back right away. The guy at the bus stop didn't look up…",
      },
      {
        id: "d1-baseline",
        question: "Baseline check: in one or two sentences, how do you think people see you right now? How would you like to be seen 30 days from now?",
        placeholder: "Right now I think people see me as quiet and a bit closed off. By Day 30 I'd like…",
      },
      {
        id: "d1-belief",
        question: "Name one limiting belief that showed up today. Then answer: 'Was there ever a time when…' the opposite was true?",
        placeholder: "'People find me boring.' But there was a time when…",
      },
    ],
    rewards: {
      xp: 50,
      hardcoreXp: 30,
      attributes: { initiative: 4, presence: 3, resilience: 4 },
      hardcoreAttributes: { initiative: 2, resilience: 1 },
    },
  },

  /* ==========================================================================
   * DAY 2 — Say Something Real
   * ======================================================================== */
  {
    day: 2,
    chapter: 1,
    slug: "say-something-real",
    title: "Say Something Real",
    tagline: "Turn a hello into a two-line exchange.",
    estReadMinutes: 3,
    isMilestone: false,
    briefing: [
      {
        id: "d2-hook",
        kind: "hook",
        icon: "MessageCircle",
        title: "Yesterday you were seen. Today you're heard.",
        body: "A greeting asks for nothing. A comment **invites a reply**. Today you'll make small comments about the situation you're both in, giving the other person an easy door to walk through (or to politely ignore).",
      },
      {
        id: "d2-liking-gap",
        kind: "science",
        icon: "Sparkles",
        title: "The liking gap",
        finding: "After talking with strangers, people consistently **underestimate** how much their conversation partner liked them and enjoyed the chat. You judge your own performance more harshly than the other person does.",
        source: "Boothby, Cooney, Sandstrom & Clark (2018), Psychological Science",
      },
      {
        id: "d2-triangle",
        kind: "concept",
        icon: "Triangle",
        title: "The triangle",
        body: "Small talk feels forced when it's about you or them. It flows when it's about a **third thing you're both experiencing**: the long line, the rain, the music, the broken coffee machine. You, them, and the shared moment make the easiest opener there is.",
      },
      {
        id: "d2-scripts",
        kind: "script",
        title: "Openers that point at the moment",
        lines: [
          "(Long line) 'Is it always this busy, or did we pick the worst time?'",
          "(Late bus) 'I'm starting to think this bus is a myth.'",
          "(Café) 'Have you tried anything here that's actually worth it?'",
          "(Rain) 'I fully trusted the forecast this morning. Big mistake.'",
        ],
        note: "Same pattern each time: an observation, often with a little lightness, that leaves an easy hook to answer.",
      },
      {
        id: "d2-delivery",
        kind: "concept",
        icon: "Wind",
        title: "Low-pressure delivery",
        body: "Say it like you'd say it to a friend, then go back to what you were doing. That tells them there's **no pressure to respond**, and that's exactly what makes people want to.",
      },
      {
        id: "d2-myth-small-talk",
        kind: "mythBuster",
        myth: "Small talk is fake and pointless.",
        reality: "Small talk is a **handshake for the mind**: a quick, low-stakes way for two people to check 'Are you friendly? Are you safe?' Nobody gets to deep conversation without it.",
      },
      {
        id: "d2-quiz-opener",
        kind: "quiz",
        question: "You're waiting at a crowded café counter. Which opener is most likely to get a relaxed response?",
        options: [
          {
            id: "a",
            text: "'Hi, what's your name?'",
            correct: false,
            feedback: "Too personal, too fast. A name feels like a big ask before any rapport.",
          },
          { id: "b", text: "'This place is packed. Is it always like this at lunch?'", correct: true },
          {
            id: "c",
            text: "'You look like someone with interesting opinions.'",
            correct: false,
            feedback: "It puts them on the spot and makes them the topic. Point at the situation instead.",
          },
        ],
        explanation: "A comment about the shared moment works because it's about something you're both experiencing. It's easy to answer, and just as easy to leave.",
      },
      {
        id: "d2-scenario-short",
        kind: "scenario",
        situation: "You comment on the long line. The person replies 'Yeah, ugh,' and looks back at their phone.",
        prompt: "What's your move?",
        options: [
          {
            id: "a",
            text: "Keep going with more questions until they engage.",
            rating: "avoid",
            feedback: "They've signalled they want to keep to themselves. Pushing past that turns a nice moment into an uncomfortable one.",
          },
          {
            id: "b",
            text: "Smile, add 'Hopefully the coffee's worth it,' and let it go.",
            rating: "great",
            feedback: "A short reply still completes the exchange. You closed it lightly, which is a successful rep and good social skill.",
          },
          {
            id: "c",
            text: "Decide they hate you and leave the line.",
            rating: "avoid",
            feedback: "That's the liking gap talking. A short answer usually means 'I'm tired', not 'I dislike you'.",
          },
        ],
      },
      {
        id: "d2-takeaway",
        kind: "takeaway",
        title: "Today in four lines",
        points: [
          "Comment on the shared moment: you, them, and the situation.",
          "Say it lightly, with no pressure for them to respond.",
          "Strangers like you more than you think they do.",
          "A one-word reply is still a complete, successful rep.",
        ],
      },
    ],
    mission: {
      codename: "Operation Small Talk",
      objective: "Make 5 situational comments that invite a reply.",
      contexts: ["coffeeShop", "transit", "store", "campus", "workplace"],
      standard: {
        title: "Five Comments",
        brief: "Make a light, situational comment to 5 different strangers. One reply each is enough.",
        steps: [
          "Spot a shared moment: a queue, the weather, a delay, the music, the menu.",
          "Make one comment about it, ideally ending with an easy hook ('…or is that just me?').",
          "Accept whatever comes back: a laugh, a grunt, or a full story.",
          "Tap Approach after each comment.",
        ],
        targets: [{ counter: "approaches", target: 5, label: "Comments made" }],
      },
      hardcore: {
        title: "Keep the Ball in the Air",
        brief: "Make 8 comments, and turn at least 1 into a real back-and-forth with 3+ turns each.",
        steps: [
          "Make 8 situational comments across the day.",
          "When someone replies with more than a word, pick up on what they said and respond.",
          "Keep one exchange going for at least three turns each, then exit warmly.",
          "Tap Conversation when it happens.",
        ],
        targets: [
          { counter: "approaches", target: 8, label: "Comments made" },
          { counter: "conversations", target: 1, label: "Real back-and-forths" },
        ],
      },
      tips: [
        "It doesn't need to be clever. 'Wow, it's cold' works. How you say it matters more than the words.",
        "Speak at the volume you'd use with a friend across a table. If they say 'Sorry?', just repeat it. That's normal.",
        "If they answer briefly, smile and let it go. Short and warm beats long and forced.",
      ],
      guardrail: "Comment on the situation, never on someone's body or appearance. Leave people alone if they're wearing headphones or clearly in a hurry.",
    },
    logbook: [
      {
        id: "d2-best-opener",
        question: "Write down your best opener of the day, word for word. Why do you think it worked?",
        placeholder: "'Is it always this busy?' They laughed and said…",
      },
      {
        id: "d2-anxiety-curve",
        question: "How anxious did you feel before your first comment compared with your fifth? What changed in between?",
        placeholder: "The first one took me ten minutes to work up to. By the fifth…",
      },
      {
        id: "d2-surprise",
        question: "Did anyone surprise you by being friendlier, funnier, or chattier than you expected?",
        placeholder: "An older man at the bus stop ended up telling me about…",
      },
    ],
    rewards: {
      xp: 50,
      hardcoreXp: 30,
      attributes: { initiative: 4, presence: 2, storytelling: 2, resilience: 3 },
      hardcoreAttributes: { initiative: 1, storytelling: 1, resilience: 1 },
    },
  },

  /* ==========================================================================
   * DAY 3 — The Kindness Ripple
   * ======================================================================== */
  {
    day: 3,
    chapter: 1,
    slug: "kindness-ripple",
    title: "The Kindness Ripple",
    tagline: "Three specific, sincere compliments.",
    estReadMinutes: 3,
    isMilestone: false,
    briefing: [
      {
        id: "d3-hook",
        kind: "hook",
        icon: "Heart",
        title: "Warmth is a skill, not a personality type",
        body: "Charismatic people aren't just confident. They **make other people feel good about themselves**. The fastest way to practice that is to notice something good about someone and say it out loud.",
      },
      {
        id: "d3-science",
        kind: "science",
        icon: "Gift",
        title: "We underestimate our own kindness",
        finding: "People who complimented strangers consistently **underestimated** how good it made the recipient feel, and **overestimated** how awkward it would be. That miscalibration is exactly what stops most compliments from ever being said.",
        source: "Boothby & Bohns (2021), Personality and Social Psychology Bulletin",
      },
      {
        id: "d3-choices",
        kind: "concept",
        icon: "Sparkles",
        title: "Compliment choices, not bodies",
        body: "The best compliments target something a person **chose or did**: their playlist, their jacket, how calmly they handled a rude customer, a sharp point in a meeting. Choices reflect who someone is. Bodies are off-limits, because even a well-meant comment about someone's body can feel invasive coming from a stranger.",
      },
      {
        id: "d3-specific",
        kind: "concept",
        icon: "Target",
        title: "Specific beats generic",
        body: "'Nice shirt' is pleasant. 'That green is a great color on a grey day' is memorable. Being specific proves you actually noticed, and **noticing is the real gift**. Formula: **what you noticed + why it stood out.**",
      },
      {
        id: "d3-scripts",
        kind: "script",
        title: "Compliments that land",
        lines: [
          "(Stranger) 'That's a great bag. The color made me happy just looking at it.'",
          "(Barista) 'You're handling this rush like a pro. Seriously impressive.'",
          "(Classmate or coworker) 'The way you explained that earlier finally made it click for me.'",
          "(Bus driver) 'Thanks for waiting for that guy who was running. That was kind.'",
        ],
      },
      {
        id: "d3-give-and-go",
        kind: "concept",
        icon: "Hand",
        title: "Give it and go",
        body: "A compliment with strings attached isn't a compliment. Say it, smile, and leave them room to just say thanks. **Don't fish for a conversation.** If they want to keep talking, they will.",
      },
      {
        id: "d3-quiz",
        kind: "quiz",
        question: "Which compliment works best for a stranger browsing in a bookstore?",
        options: [
          {
            id: "a",
            text: "'You have beautiful eyes.'",
            correct: false,
            feedback: "It's about their body, which can feel invasive from a stranger, however kindly it's meant.",
          },
          { id: "b", text: "'Great pick. That author's last book wrecked me in the best way.'", correct: true },
          {
            id: "c",
            text: "'You seem really smart.'",
            correct: false,
            feedback: "Vague and a little presumptuous. Point to something specific they chose.",
          },
        ],
        explanation: "Complimenting their book choice is specific, it's about a decision they made, and it gives them something easy to respond to if they want to.",
      },
      {
        id: "d3-scenario",
        kind: "scenario",
        situation: "You compliment a stranger's jacket. They look surprised, say 'Oh, uh, thanks,' and seem a bit flustered.",
        prompt: "What now?",
        options: [
          {
            id: "a",
            text: "Explain at length why you said it.",
            rating: "avoid",
            feedback: "Over-explaining turns a light gift into a heavy moment. Let the compliment stand on its own.",
          },
          {
            id: "b",
            text: "Smile, say 'Have a good one!', and move on.",
            rating: "great",
            feedback: "Perfect. Surprise is a normal reaction to unexpected kindness, and you gave them space to enjoy it.",
          },
          {
            id: "c",
            text: "Apologize for bothering them.",
            rating: "okay",
            feedback: "No need. You did nothing wrong, and apologizing makes a kind act feel like a mistake.",
          },
        ],
      },
      {
        id: "d3-takeaway",
        kind: "takeaway",
        title: "Today in four lines",
        points: [
          "Your compliments land better than you expect.",
          "Compliment choices and actions, never bodies.",
          "Be specific: what you noticed, and why it stood out.",
          "Give it and go. No strings attached.",
        ],
      },
    ],
    mission: {
      codename: "Operation Kindness Ripple",
      objective: "Give 3 sincere, specific compliments.",
      contexts: ["coffeeShop", "store", "transit", "campus", "workplace"],
      standard: {
        title: "Three Ripples",
        brief: "Give 3 specific, sincere compliments, at least 2 of them to strangers.",
        steps: [
          "Look for choices, skills, or actions: style, taste, effort, kindness.",
          "Use the formula: what you noticed + why it stood out.",
          "Say it, smile, and give them an easy exit.",
          "Tap Kindness after each one.",
        ],
        targets: [{ counter: "kindnesses", target: 3, label: "Compliments given" }],
      },
      hardcore: {
        title: "The Overlooked",
        brief: "Give 6 compliments, including one to someone you see regularly but have never really talked to (a security guard, cleaner, or cashier), and learn their name.",
        steps: [
          "Give 6 specific compliments across the day.",
          "Choose one 'regular' you usually walk past without a word.",
          "Compliment something about their work, then introduce yourself: 'I'm Sam, by the way.'",
          "Tap Approach when you learn their name.",
        ],
        targets: [
          { counter: "kindnesses", target: 6, label: "Compliments given" },
          { counter: "approaches", target: 1, label: "Regulars introduced" },
        ],
      },
      tips: [
        "If you notice it, say it. The moment passes quickly, and hesitating is how a compliment becomes a 'should have'.",
        "Service workers hear complaints all day. A sincere word about their work can be the best moment of their shift.",
        "Compliments to people you know count too, but push for at least two strangers.",
      ],
      guardrail: "No comments on bodies, faces, or attractiveness. If a compliment would feel strange coming from a stranger, skip it.",
    },
    logbook: [
      {
        id: "d3-compliments",
        question: "Write down the compliments you gave. Which one got the best reaction, and why do you think that was?",
        placeholder: "I told the cashier her nail art was amazing, and she lit up and said…",
      },
      {
        id: "d3-no-strings",
        question: "How did it feel to give something without expecting anything back?",
        placeholder: "Weirdly freeing. I wasn't worried about what to say next because…",
      },
      {
        id: "d3-receiving",
        question: "Did anyone compliment you or show you kindness today? How did you receive it?",
        placeholder: "A coworker said my presentation was clear, and I immediately brushed it off…",
      },
    ],
    rewards: {
      xp: 50,
      hardcoreXp: 30,
      attributes: { empathy: 5, initiative: 3, presence: 2, resilience: 1 },
      hardcoreAttributes: { empathy: 2, initiative: 1 },
    },
  },

  /* ==========================================================================
   * DAY 4 — Ask the Room
   * ======================================================================== */
  {
    day: 4,
    chapter: 1,
    slug: "ask-the-room",
    title: "Ask the Room",
    tagline: "Five genuine questions for five strangers.",
    estReadMinutes: 3,
    isMilestone: false,
    briefing: [
      {
        id: "d4-hook",
        kind: "hook",
        icon: "Compass",
        title: "From comments to questions",
        body: "A comment can be answered with a nod. A genuine question asks someone to **share a bit of what they know**. Most people enjoy being asked for their opinion, because it tells them you value it.",
      },
      {
        id: "d4-science",
        kind: "science",
        icon: "Users",
        title: "Strangers are better company than we predict",
        finding: "Commuters predicted that talking to a stranger on their train would be unpleasant. Those who were asked to do it reported a **more pleasant** journey than those who sat in silence.",
        source: "Epley & Schroeder (2014), Journal of Experimental Psychology: General",
      },
      {
        id: "d4-recommendation",
        kind: "concept",
        icon: "Lightbulb",
        title: "The recommendation question",
        body: "Ask about something they clearly know about, right where you are. 'What's good here?' to someone eating. 'Is this worth reading?' to someone at the same shelf. 'Which bus is fastest downtown?' at the stop. It's **honest, useful, and easy to answer**.",
      },
      {
        id: "d4-presence",
        kind: "concept",
        icon: "Wind",
        title: "Presence: slow everything down 20%",
        body: "Nervous energy speeds you up: fast talking, quick glances, shifting weight. Before you ask, **plant your feet, drop your shoulders, and breathe out once, slowly**. Then speak a little slower than feels natural. Calm is contagious, and so is tension.",
      },
      {
        id: "d4-scripts",
        kind: "script",
        title: "Questions people enjoy answering",
        lines: [
          "(Café) 'Sorry, quick question. What did you order? It looks amazing.'",
          "(Bookstore) 'Have you read anything by her? I'm trying to decide where to start.'",
          "(Gym) 'Is that machine any good for shoulders? I've never figured it out.'",
          "(Office kitchen) 'Okay, settle this for me: best lunch spot within five minutes of here?'",
        ],
      },
      {
        id: "d4-listen",
        kind: "concept",
        icon: "Ear",
        title: "Actually listen to the answer",
        body: "The question opens the door. The answer is where the conversation happens. Look at them while they talk, react honestly ('Oh, nice'), and if you can, **follow up once**: 'Why that one?' Then thank them. Bonus points for actually trying what they recommended.",
      },
      {
        id: "d4-quiz",
        kind: "quiz",
        question: "Someone recommends a dish at a café. What's the strongest follow-up?",
        options: [
          {
            id: "a",
            text: "'Cool, thanks.' Then walk away.",
            correct: false,
            feedback: "Polite and perfectly fine, but it ends the moment. One follow-up would have turned it into a mini-conversation.",
          },
          { id: "b", text: "'Oh nice, what makes it better than the others?'", correct: true },
          {
            id: "c",
            text: "'I'll probably just get my usual.'",
            correct: false,
            feedback: "This brushes off the advice you just asked for. People notice.",
          },
        ],
        explanation: "One follow-up question shows you were really listening, and it turns a transaction into a tiny conversation.",
      },
      {
        id: "d4-myth",
        kind: "mythBuster",
        myth: "Asking strangers questions is an imposition.",
        reality: "Quick requests for information are among the most socially accepted interactions there are. Most people **like being helpful**, because it makes them feel competent and kind. You're giving them a chance to feel that.",
      },
      {
        id: "d4-takeaway",
        kind: "takeaway",
        title: "Today in four lines",
        points: [
          "Ask about what they clearly know, right where you are.",
          "Plant your feet, drop your shoulders, breathe out, slow down.",
          "Listen to the answer and follow up once.",
          "Helping you feels good to them. You're not a burden.",
        ],
      },
    ],
    mission: {
      codename: "Operation Ask the Room",
      objective: "Ask 5 strangers for a genuine opinion or recommendation.",
      contexts: ["coffeeShop", "store", "gym", "transit", "workplace"],
      standard: {
        title: "Five Questions",
        brief: "Ask 5 different strangers for a recommendation, opinion, or bit of local knowledge, and really listen to the answer.",
        steps: [
          "Choose questions you actually want answered.",
          "Before each one: feet planted, shoulders down, one slow breath out.",
          "Ask at a calm pace and keep eye contact while they answer.",
          "Thank them, then tap Approach.",
        ],
        targets: [{ counter: "approaches", target: 5, label: "Questions asked" }],
      },
      hardcore: {
        title: "Follow the Answer",
        brief: "Ask 8 strangers, turn at least one answer into a real back-and-forth, and actually try one recommendation today.",
        steps: [
          "Ask 8 genuine questions across the day.",
          "Follow up on answers with 'Why that one?' or 'How did you find it?'",
          "Keep one exchange going for three or more turns each. Tap Conversation.",
          "Act on one recommendation you received: order it, read it, go there.",
        ],
        targets: [
          { counter: "approaches", target: 8, label: "Questions asked" },
          { counter: "conversations", target: 1, label: "Answers turned into conversations" },
        ],
        checklist: ["Tried one recommendation I was given"],
      },
      tips: [
        "Stuck for a question? Ask about whatever is in front of you both: the menu, a product, the route, an event poster.",
        "'Sorry, quick question…' is a great opener. It tells them you'll be brief.",
        "If someone doesn't know, that still counts. 'No worries, thanks anyway!'",
      ],
      guardrail: "Keep questions quick and easy to decline. Don't follow anyone or interrupt a focused conversation to ask.",
    },
    logbook: [
      {
        id: "d4-best-answer",
        question: "What was the most interesting or useful answer you got today?",
        placeholder: "A woman at the bookstore recommended a novel and told me it got her through…",
      },
      {
        id: "d4-presence",
        question: "Did slowing your body and voice down change how you felt, or how people reacted? Describe one moment.",
        placeholder: "When I took a breath before asking, my voice didn't shake as much and…",
      },
      {
        id: "d4-reuse",
        question: "Which kind of question felt most natural to you, and where could you use it again this week?",
        placeholder: "Asking for food recommendations felt easy. I could try it at the canteen on…",
      },
    ],
    rewards: {
      xp: 50,
      hardcoreXp: 30,
      attributes: { initiative: 3, empathy: 2, presence: 3, storytelling: 1, resilience: 2 },
      hardcoreAttributes: { empathy: 1, presence: 1, initiative: 1 },
    },
  },

  /* ==========================================================================
   * DAY 5 — Courage Reps
   * ======================================================================== */
  {
    day: 5,
    chapter: 1,
    slug: "courage-reps",
    title: "Courage Reps",
    tagline: "Today, you go looking for a 'no'.",
    estReadMinutes: 3,
    isMilestone: false,
    briefing: [
      {
        id: "d5-hook",
        kind: "hook",
        icon: "Flame",
        title: "Today, 'no' is the goal",
        body: "For most people, fear of rejection is the biggest thing between them and the social life they want. So today we flip the scoreboard: **every request that could get a 'no' is a win**, whatever the answer.",
      },
      {
        id: "d5-data",
        kind: "concept",
        icon: "Shield",
        title: "Rejection is data, not a verdict",
        body: "When someone says no, it's almost always about **their** situation: their time, mood, rules, or plans. It isn't a judgement of your worth. Turning down a request is not the same as turning down you.",
      },
      {
        id: "d5-science",
        kind: "science",
        icon: "TrendingDown",
        title: "Fear shrinks with exposure",
        finding: "Facing feared situations deliberately and repeatedly, in manageable steps, is a core part of the most recommended psychological treatment for social anxiety. Each rep **teaches your nervous system that the feared outcome is survivable**.",
        source: "Exposure-based CBT, recommended in NICE clinical guideline CG159: Social anxiety disorder (2013)",
      },
      {
        id: "d5-courage-reps",
        kind: "concept",
        icon: "Zap",
        title: "Meet Courage Reps",
        body: "In this app, every awkward moment, polite brush-off, or outright 'no' is logged as a **Courage Rep**, and it earns more XP than a smooth interaction. Smooth reps build skill. Courage reps build the nerve that skill depends on.",
      },
      {
        id: "d5-scripts",
        kind: "script",
        title: "Low-stakes requests with a real chance of 'no'",
        lines: [
          "(Café) 'Any chance I could try a small sample of that before I order?'",
          "(Shop) 'Do you ever discount display items?'",
          "(Stranger) 'Would you mind taking a quick photo of me here?'",
          "(Restaurant) 'Could I swap the side for the one from the other dish?'",
          "(Coworker or classmate) 'Want to grab a coffee with me at 3?'",
        ],
        note: "Aim for roughly a 50/50 chance of 'no'. Too easy takes no courage, and too outrageous is just a stunt.",
      },
      {
        id: "d5-graceful-no",
        kind: "concept",
        icon: "Smile",
        title: "The graceful no",
        body: "When you hear 'no': smile, say **'No problem, thanks anyway!'**, and leave on a high note. People remember how you handle a no. Pressure, sulking, or asking again turns a fine moment into a bad one.",
      },
      {
        id: "d5-quiz",
        kind: "quiz",
        question: "You ask a café for a free extra shot and they say, 'Sorry, we can't do that.' How did your rep go?",
        options: [
          { id: "a", text: "Failed. I didn't get it.", correct: false },
          { id: "b", text: "Succeeded. I asked, heard no, and handled it gracefully.", correct: true },
          { id: "c", text: "It doesn't count, because they said no.", correct: false },
        ],
        explanation: "The parts you control are the ask and how you respond. That's the whole rep. Log it as a Courage Rep and collect your XP.",
      },
      {
        id: "d5-myth",
        kind: "mythBuster",
        myth: "Confident people don't get rejected.",
        reality: "Confident people get rejected **more**, because they ask for more. They've just had enough reps that a 'no' stings for seconds instead of days.",
      },
      {
        id: "d5-takeaway",
        kind: "takeaway",
        title: "Today in four lines",
        points: [
          "A 'no' is about their situation, not your worth.",
          "Exposure in small steps is how fear shrinks.",
          "Every ask is a Courage Rep, whatever the answer.",
          "Take a no gracefully: smile, thank them, move on.",
        ],
      },
    ],
    mission: {
      codename: "Operation Hear a No",
      objective: "Make 3 small, polite requests that could be declined.",
      contexts: ["coffeeShop", "store", "workplace", "campus", "neighborhood"],
      standard: {
        title: "Three Asks",
        brief: "Make 3 small, reasonable requests where 'no' is a real possibility. The answer doesn't matter. Only the ask does.",
        steps: [
          "Pick requests that are polite, legal, and easy to decline.",
          "Ask clearly, once, with a smile.",
          "Whatever the answer: 'Thanks anyway!' or 'Amazing, thank you!'",
          "Tap Courage after every ask.",
        ],
        targets: [{ counter: "courageReps", target: 3, label: "Requests made" }],
      },
      hardcore: {
        title: "Collect a No",
        brief: "Make 6 requests, including at least one you're fairly sure will be turned down, and keep going after your first 'no'.",
        steps: [
          "Make 6 requests across the day.",
          "Include at least one with low odds, e.g. asking a shop if they'd play a song you like.",
          "After your first clear 'no', make your next request within ten minutes.",
        ],
        targets: [{ counter: "courageReps", target: 6, label: "Requests made" }],
        checklist: ["Heard at least one clear 'no' and kept going"],
      },
      tips: [
        "Your voice may shake. Ask anyway. Remember the spotlight effect: nobody notices as much as you think.",
        "Got a yes? Great. Enjoy the free sample. It still counts as a Courage Rep.",
        "Do the scariest ask first. Everything after it will feel easier.",
      ],
      guardrail: "Never pressure, argue, or ask again after a no. Avoid anything that could get a worker in trouble or break a rule, and never ask for money or personal information.",
    },
    logbook: [
      {
        id: "d5-asks",
        question: "List your requests and the answers you got. Which one took the most courage?",
        placeholder: "1. Asked for a sample (yes!). 2. Asked about a discount (no). 3. …",
      },
      {
        id: "d5-prediction",
        question: "Before asking, what did you predict would happen? What actually happened?",
        placeholder: "I expected an eye-roll. Instead she laughed and said…",
      },
      {
        id: "d5-inner-voice",
        question: "When you heard 'no' (or pictured hearing it), what did your inner voice say? Rewrite that thought the way a supportive friend would.",
        placeholder: "My inner voice said 'that was so stupid'. A friend would say…",
      },
    ],
    rewards: {
      xp: 50,
      hardcoreXp: 30,
      attributes: { resilience: 6, initiative: 4, presence: 1 },
      hardcoreAttributes: { resilience: 3 },
    },
  },

  /* ==========================================================================
   * DAY 6 — Names & Warm Exits
   * ======================================================================== */
  {
    day: 6,
    chapter: 1,
    slug: "names-and-warm-exits",
    title: "Names & Warm Exits",
    tagline: "Learn three names, and leave people smiling.",
    estReadMinutes: 3,
    isMilestone: false,
    briefing: [
      {
        id: "d6-hook",
        kind: "hook",
        icon: "Tag",
        title: "The moments people remember",
        body: "Psychologists call it the **peak-end rule**: we judge an experience largely by its most intense moment and by how it ended. You've practiced opening. Today you practice the two things that make an interaction feel personal and complete: **learning a name and leaving well**.",
      },
      {
        id: "d6-introduce-first",
        kind: "concept",
        icon: "Hand",
        title: "Introduce yourself first",
        body: "The easiest way to learn someone's name is to offer yours. After a bit of small talk: **'I'm Sam, by the way.'** Then pause. Nearly everyone answers with their own name. It feels natural because it's an even exchange.",
      },
      {
        id: "d6-remember",
        kind: "concept",
        icon: "Repeat",
        title: "Make it stick: Repeat, Link, Use",
        body: "**Repeat** it straight away: 'Nice to meet you, Priya.' **Link** it to something: Priya, the one with the prize-winning dog. **Use** it once more as you leave: 'Good chatting, Priya.' Once or twice feels warm. Five times sounds like a sales pitch.",
      },
      {
        id: "d6-myth",
        kind: "mythBuster",
        myth: "I'm just bad with names.",
        reality: "Most of the time, 'bad with names' really means 'wasn't listening when they said it' because you were busy planning what to say next. Names stick when you **make them your only priority for three seconds**.",
      },
      {
        id: "d6-exit",
        kind: "concept",
        icon: "DoorOpen",
        title: "The warm exit",
        body: "Most people never practice leaving, so they either drag conversations out or vanish awkwardly. A good exit has three parts. **Signal:** 'Well, I should get going.' **Appreciate:** 'Really nice to meet you.' **Callback:** 'Good luck with the move!' Leave while the energy is still high, and people will be glad they talked to you.",
      },
      {
        id: "d6-scripts",
        kind: "script",
        title: "Names and exits, out loud",
        lines: [
          "'I'm Alex, by the way.' 'Jordan.' 'Nice to meet you, Jordan.'",
          "'I'll let you get back to your coffee. Great chatting, Jordan.'",
          "'I've got to run, but good luck with the interview tomorrow!'",
          "'We've passed each other for months. Nice to finally meet you properly.'",
        ],
      },
      {
        id: "d6-quiz",
        kind: "quiz",
        question: "You've been chatting for two minutes and the conversation is starting to slow down. What's the best move?",
        options: [
          {
            id: "a",
            text: "Fill the silence with any question you can think of.",
            correct: false,
            feedback: "Forcing it past its natural end makes the whole thing feel effortful in hindsight.",
          },
          { id: "b", text: "Wrap up warmly while it's still pleasant: 'Great chatting, enjoy your day, Jordan!'", correct: true },
          {
            id: "c",
            text: "Wait for them to end it.",
            correct: false,
            feedback: "Leaving it to them creates an awkward limbo. Owning the exit is a confident, generous move.",
          },
        ],
        explanation: "Ending on a high note is the peak-end rule at work. They'll remember a warm, easy conversation instead of a fizzle.",
      },
      {
        id: "d6-scenario",
        kind: "scenario",
        situation: "Someone tells you their name. Ten seconds later, you realize you've already forgotten it.",
        prompt: "What do you do?",
        options: [
          {
            id: "a",
            text: "Avoid using their name for the rest of the conversation.",
            rating: "okay",
            feedback: "It works, but you miss the chance to make them feel remembered.",
          },
          {
            id: "b",
            text: "'Sorry, tell me your name again? I want to get it right.'",
            rating: "great",
            feedback: "Honest, and it shows you care. Almost everyone finds this flattering, not rude.",
          },
          {
            id: "c",
            text: "Guess and hope for the best.",
            rating: "avoid",
            feedback: "A wrong name is far more awkward than simply asking again.",
          },
        ],
      },
      {
        id: "d6-takeaway",
        kind: "takeaway",
        title: "Today in four lines",
        points: [
          "Offer your name first, and theirs will usually follow.",
          "Repeat it, link it, use it once more when you leave.",
          "Exit with signal, appreciate, callback.",
          "Leave while it's still good. That's what people remember.",
        ],
      },
    ],
    mission: {
      codename: "Operation Name Tag",
      objective: "Learn 3 names and practice the warm exit.",
      contexts: ["coffeeShop", "neighborhood", "campus", "workplace", "gym"],
      standard: {
        title: "Three Names",
        brief: "Have a short exchange with 3 people where you swap names, use their name once more, and finish with a warm exit.",
        steps: [
          "Good people to try: a regular barista, a classmate or coworker you've never properly met, a neighbor, someone at the gym.",
          "Small talk first, then 'I'm ___, by the way.'",
          "Repeat their name back, and use it once more as you leave.",
          "Exit with signal + appreciate + callback, then tap Approach.",
        ],
        targets: [{ counter: "approaches", target: 3, label: "Names learned" }],
      },
      hardcore: {
        title: "Name Keeper",
        brief: "Learn 5 names. At the end of the day, write them all in your logbook from memory, with one detail about each person.",
        steps: [
          "Learn 5 names, each with a warm exit.",
          "Link each name to a detail as you hear it.",
          "Tonight, list all 5 from memory in your logbook. No checking your phone.",
        ],
        targets: [{ counter: "approaches", target: 5, label: "Names learned" }],
        checklist: ["Wrote all 5 names and a detail about each from memory"],
      },
      tips: [
        "People you see daily but never talk to are perfect today: 'We see each other every morning and I've never introduced myself. I'm Sam.'",
        "Even a short exchange can include names: 'Thanks for the help. I'm Sam, by the way.'",
        "End before it fizzles. The exit is part of the skill, not a retreat.",
      ],
      guardrail: "Offer your first name only, and never push for contact details or personal information. If someone doesn't give their name back, let it go.",
    },
    logbook: [
      {
        id: "d6-names",
        question: "Write down the names you learned and one detail you remember about each person.",
        placeholder: "Marta: barista, just moved from Porto. Daniel: neighbor with the old bike…",
      },
      {
        id: "d6-exit-words",
        question: "Which exit felt most natural? Write down the exact words you used.",
        placeholder: "'I'll let you get back to it. Good luck with the exam, Daniel!'",
      },
      {
        id: "d6-being-named",
        question: "How did it feel to be called by your name, or to call someone by theirs?",
        placeholder: "When Marta said 'See you tomorrow, Sam', it felt like…",
      },
    ],
    rewards: {
      xp: 50,
      hardcoreXp: 30,
      attributes: { empathy: 3, presence: 4, initiative: 3, storytelling: 1 },
      hardcoreAttributes: { presence: 2, empathy: 1 },
    },
  },

  /* ==========================================================================
   * DAY 7 — The Social Circuit (Chapter 1 milestone)
   * ======================================================================== */
  {
    day: 7,
    chapter: 1,
    slug: "social-circuit",
    title: "The Social Circuit",
    tagline: "Chapter 1 finale: ten interactions, mixed and matched.",
    estReadMinutes: 3,
    isMilestone: true,
    briefing: [
      {
        id: "d7-hook",
        kind: "hook",
        icon: "Trophy",
        title: "One week in. Look at what you've done.",
        body: "Six days ago, saying 'good morning' to a stranger may have felt huge. Since then you've greeted, commented, complimented, asked, heard a 'no', and learned names. **Today you put it all together.**",
      },
      {
        id: "d7-mixing",
        kind: "concept",
        icon: "Layers",
        title: "Why mixing matters",
        body: "Practicing one skill at a time builds technique. Switching between skills builds **flexibility**, the ability to read a moment and pick the right move. That flexibility is what natural social ease actually looks like.",
      },
      {
        id: "d7-toolkit",
        kind: "concept",
        icon: "Compass",
        title: "Your toolkit so far",
        body: "**Greet:** eyes, smile, voice. **Comment:** the shared moment. **Compliment:** choices, not bodies. **Ask:** a genuine recommendation. **Request:** a courage rep. **Name:** introduce yourself first. **Exit:** signal, appreciate, callback.",
      },
      {
        id: "d7-curve",
        kind: "concept",
        icon: "TrendingDown",
        title: "Watch the curve",
        body: "Notice your anxiety before each interaction today. For most people it **peaks before the first one and drops with every rep after**. That falling curve is your nervous system learning. You'll rate it in your logbook tonight.",
      },
      {
        id: "d7-science",
        kind: "science",
        icon: "Coffee",
        title: "Small interactions, real belonging",
        finding: "Coffee-shop customers who had a brief, friendly exchange with the barista (a smile, eye contact, a short chat) reported more positive feelings and a **greater sense of belonging** than those who kept it purely transactional.",
        source: "Sandstrom & Dunn (2014), Social Psychological and Personality Science",
      },
      {
        id: "d7-scenario",
        kind: "scenario",
        situation: "You're in a café. The person beside you is reading a book you've heard about, the line is long, and the barista looks swamped. You have three minutes.",
        prompt: "What's the best use of your time?",
        options: [
          {
            id: "a",
            text: "Pick one move that fits and do it well: ask the reader if the book is worth it.",
            rating: "great",
            feedback: "Exactly. Read the moment, choose one tool, and stay present with it.",
          },
          {
            id: "b",
            text: "Run through every move on the same person in three minutes.",
            rating: "avoid",
            feedback: "Stacking techniques on one person feels like a script. Choose what fits the moment.",
          },
          {
            id: "c",
            text: "Wait for a better moment later in the day.",
            rating: "okay",
            feedback: "Better moments rarely turn up by themselves. This one is good enough. Take it.",
          },
        ],
      },
      {
        id: "d7-takeaway",
        kind: "takeaway",
        title: "Today in four lines",
        points: [
          "You have seven tools now. Use whichever fits the moment.",
          "Anxiety peaks before the first rep and falls after each one.",
          "Brief, warm exchanges really do make people (and you) feel better.",
          "Finish today to open your first chest.",
        ],
      },
    ],
    mission: {
      codename: "Operation Social Circuit",
      objective: "Complete 10 interactions using at least 4 different tools from this week.",
      contexts: ["coffeeShop", "transit", "store", "campus", "workplace", "neighborhood"],
      standard: {
        title: "The Circuit",
        brief: "Complete 10 interactions today, mixing greetings, comments, questions, name swaps, compliments, and requests.",
        steps: [
          "Plan a route with natural stops: commute, café, shop, campus or office.",
          "Use at least 4 different tools across the day.",
          "Log each interaction under the counter that fits best: Approach, Kindness, or Courage.",
          "End at least 2 interactions with a warm exit.",
        ],
        targets: [
          { counter: "approaches", target: 6, label: "Greetings, comments, questions, names" },
          { counter: "kindnesses", target: 2, label: "Compliments" },
          { counter: "courageReps", target: 2, label: "Requests or awkward moments" },
        ],
      },
      hardcore: {
        title: "Go First in a Group",
        brief: "Complete 15 interactions, and be the first person to speak up in a group: a class, meeting, club, or gathering.",
        steps: [
          "Complete the full circuit with 15 interactions.",
          "In one group setting, be the first to ask a question or make a comment.",
          "Log the group moment as a Courage Rep.",
        ],
        targets: [
          { counter: "approaches", target: 9, label: "Greetings, comments, questions, names" },
          { counter: "kindnesses", target: 3, label: "Compliments" },
          { counter: "courageReps", target: 3, label: "Requests or awkward moments" },
        ],
        checklist: ["Spoke first in a group setting"],
      },
      tips: [
        "Do your hardest interactions early, while your willpower is highest. Momentum will carry the rest.",
        "Speaking up in a group is easier than it looks. One sentence like 'Can I ask a quick question?' counts.",
        "Lost count? Your best estimate is fine. Honesty matters more than precision.",
      ],
      guardrail: "Respect people's space. Don't make a second attempt with someone who has disengaged, and don't interrupt focused conversations.",
    },
    logbook: [
      {
        id: "d7-week-review",
        question: "Week 1 review: what can you do now that felt hard or impossible seven days ago?",
        placeholder: "A week ago I wouldn't even look the barista in the eye. Today I…",
      },
      {
        id: "d7-curve",
        question: "Rate your anxiety (1–10) before your first interaction today and before your last. What do you notice?",
        placeholder: "First: 7. Last: 3. The drop happened around the fourth one, when…",
      },
      {
        id: "d7-toolkit",
        question: "Which tool felt most like 'you'? Which one do you want to get better at?",
        placeholder: "Asking for recommendations feels natural. Compliments still feel clunky because…",
      },
    ],
    rewards: {
      xp: 70,
      hardcoreXp: 40,
      attributes: { initiative: 4, presence: 3, resilience: 3, empathy: 2 },
      hardcoreAttributes: { initiative: 1, resilience: 1, presence: 1 },
    },
  },

  /* ==========================================================================
   * DAY 8 — The Curious Listener (Chapter 2 opens)
   * ======================================================================== */
  {
    day: 8,
    chapter: 2,
    slug: "curious-listener",
    title: "The Curious Listener",
    tagline: "Ask the second question.",
    estReadMinutes: 3,
    isMilestone: false,
    briefing: [
      {
        id: "d8-hook",
        kind: "hook",
        icon: "Ear",
        title: "Chapter 2: Active Listening & Conversational Flow",
        body: "Chapter 1 got you talking. Chapter 2 is about what happens next. The secret most charming people know: **being interested is far more powerful than being interesting.**",
      },
      {
        id: "d8-science",
        kind: "science",
        icon: "MessagesSquare",
        title: "Follow-up questions make you more likable",
        finding: "In studies of real conversations, including speed dating, people who asked more questions (especially **follow-up questions**) were liked more by their partners. Follow-ups signal that you're listening and want to know more.",
        source: "Huang, Yeomans, Brooks, Minson & Gino (2017), Journal of Personality and Social Psychology",
      },
      {
        id: "d8-second",
        kind: "concept",
        icon: "Repeat",
        title: "The first question vs. the second",
        body: "The first question is often a social reflex: 'How was your weekend?' The **second** question is where connection starts: 'Wait, you went climbing? Indoors or outdoors?' The second question proves you actually heard the answer.",
      },
      {
        id: "d8-shapes",
        kind: "concept",
        icon: "GitBranch",
        title: "Three kinds of follow-up",
        body: "**Go deeper:** 'What got you into that?' **Get specific:** 'What was the best part?' **Acknowledge the feeling:** 'That sounds stressful. How are you handling it?' Rotate between them so it feels like curiosity, not an interview.",
      },
      {
        id: "d8-listen",
        kind: "concept",
        icon: "Brain",
        title: "Listen to understand, not to reply",
        body: "Most of us spend the other person's turn planning our own. Today, try this: while they talk, your only job is to **find the most interesting thing they said**. Your next question will come to you.",
      },
      {
        id: "d8-myth",
        kind: "mythBuster",
        myth: "I need interesting stories to be good at conversation.",
        reality: "You need **curiosity**. People remember how a conversation made them feel, and few things feel better than talking to someone who's genuinely interested in what you have to say.",
      },
      {
        id: "d8-quiz",
        kind: "quiz",
        question: "A coworker says: 'Ugh, my weekend was chaos. My sister moved in with us.' What's the best follow-up?",
        options: [
          {
            id: "a",
            text: "'My weekend was chaotic too, I…'",
            correct: false,
            feedback: "This takes the conversation away from them. Your story can wait two questions.",
          },
          { id: "b", text: "'Oh wow, chaos how? Is it temporary or for the long haul?'", correct: true },
          {
            id: "c",
            text: "'Ha. Did you watch the game?'",
            correct: false,
            feedback: "Switching topics tells them you weren't really listening.",
          },
        ],
        explanation: "Follow the thread they gave you. Jumping to your own story or a new topic makes them feel unheard.",
      },
      {
        id: "d8-scenario",
        kind: "scenario",
        situation: "You ask someone what they do. They reply flatly: 'I'm in accounting.'",
        prompt: "What's your next line?",
        options: [
          {
            id: "a",
            text: "'Oh, cool.' Then change the subject.",
            rating: "okay",
            feedback: "Polite, but you've skipped a chance to show real interest.",
          },
          {
            id: "b",
            text: "'What's a part of it most people wouldn't guess?'",
            rating: "great",
            feedback: "It's open and specific, and it lets them say something interesting about an answer that sounded dull.",
          },
          {
            id: "c",
            text: "'That sounds boring.'",
            rating: "avoid",
            feedback: "Even as a joke, this shuts the door. Curiosity opens doors, and judgment closes them.",
          },
        ],
      },
      {
        id: "d8-takeaway",
        kind: "takeaway",
        title: "Today in four lines",
        points: [
          "Being interested beats being interesting.",
          "Connection starts at the second question.",
          "Rotate: go deeper, get specific, acknowledge the feeling.",
          "While they talk, look for the most interesting thing they said.",
        ],
      },
    ],
    mission: {
      codename: "Operation Second Question",
      objective: "In 3 conversations, ask at least 2 follow-up questions before talking about yourself.",
      contexts: ["workplace", "campus", "coffeeShop", "socialEvent"],
      standard: {
        title: "Three Deep Dives",
        brief: "Have 3 conversations, with friends, coworkers, classmates, or strangers, where you ask at least 2 follow-up questions before sharing anything about yourself.",
        steps: [
          "Start with any opener, or a simple 'How's your week going?'",
          "Listen for the most interesting detail in their answer.",
          "Ask about it. Then ask about their answer to that.",
          "Only then share something of your own. Tap Conversation after each one.",
        ],
        targets: [{ counter: "conversations", target: 3, label: "Conversations with 2+ follow-ups" }],
      },
      hardcore: {
        title: "Stranger Deep Dive",
        brief: "Have 5 of these conversations, at least 1 with a stranger, and in one of them ask 4 or more follow-ups in a row.",
        steps: [
          "Hold 5 follow-up-driven conversations.",
          "Start at least one with a stranger, using any Chapter 1 opener. Tap Approach as well.",
          "In one conversation, ask 4+ follow-ups in a row, rotating the three kinds.",
        ],
        targets: [
          { counter: "conversations", target: 5, label: "Conversations with 2+ follow-ups" },
          { counter: "approaches", target: 1, label: "Strangers" },
        ],
        checklist: ["Asked 4+ follow-up questions in a row in one conversation"],
      },
      tips: [
        "People you already know count today. The skill is listening, not approaching.",
        "If you catch yourself waiting for your turn to talk, refocus: what's the most interesting thing they just said?",
        "A second of silence after they finish is fine. People often add the best part when you leave a little space.",
      ],
      guardrail: "Curious, not nosy: if someone gives short answers on a topic, they may not want to go there. Move to something lighter.",
    },
    logbook: [
      {
        id: "d8-surprise",
        question: "What's the most surprising thing you learned about someone today because you asked a second question?",
        placeholder: "I've worked next to Ana for a year and had no idea she…",
      },
      {
        id: "d8-hold-back",
        question: "When was it hardest to hold back your own story? What did you want to say?",
        placeholder: "When he mentioned his trip to Japan, I really wanted to jump in with…",
      },
      {
        id: "d8-best-question",
        question: "Write down your best follow-up question of the day, and where it led.",
        placeholder: "'What made you pick that over the safer option?' She ended up telling me…",
      },
    ],
    rewards: {
      xp: 60,
      hardcoreXp: 40,
      attributes: { empathy: 6, presence: 3, storytelling: 2 },
      hardcoreAttributes: { empathy: 2, initiative: 1 },
    },
  },

  /* ==========================================================================
   * DAY 9 — Threads & Free Information
   * ======================================================================== */
  {
    day: 9,
    chapter: 2,
    slug: "threads",
    title: "Threads & Free Information",
    tagline: "Pick up what people hand you.",
    estReadMinutes: 3,
    isMilestone: false,
    briefing: [
      {
        id: "d9-hook",
        kind: "hook",
        icon: "GitBranch",
        title: "Conversations rarely run out. We just miss the threads.",
        body: "Almost every answer contains more than you asked for. **Spot the extras**, and you'll rarely be stuck for something to say.",
      },
      {
        id: "d9-free-info",
        kind: "concept",
        icon: "Lightbulb",
        title: "Free information",
        body: "'How was your weekend?' 'Good, I finally finished painting the spare room.' You asked about the weekend. You got **painting, a spare room, and a project that took a while**. Each one is a thread you can pull.",
      },
      {
        id: "d9-threading",
        kind: "concept",
        icon: "Route",
        title: "Threading: keep a few in your pocket",
        body: "When someone talks, note two or three threads. Follow one now. When it winds down, **go back** to another: 'Wait, you said it took a while. What finally got you going?' Coming back to an earlier detail shows real attention.",
      },
      {
        id: "d9-balance",
        kind: "concept",
        icon: "MessagesSquare",
        title: "All questions, no sharing, is an interview",
        body: "Yesterday you held back your stories. Today, bring them back, in balance. After a follow-up or two, share something related: 'I tried painting my room once. It looked like a crime scene.' **When you open up a little, the other person tends to open up too.** That's how trust builds in both directions.",
      },
      {
        id: "d9-science",
        kind: "science",
        icon: "HeartHandshake",
        title: "Disclosure builds closeness",
        finding: "Pairs of strangers who took turns asking and answering gradually more personal questions felt significantly **closer after 45 minutes** than pairs who only made small talk. Mutual, gradual openness is a key ingredient of closeness.",
        source: "Aron, Melinat, Aron, Vallone & Bator (1997), Personality and Social Psychology Bulletin",
      },
      {
        id: "d9-scripts",
        kind: "script",
        title: "Threading in action",
        lines: [
          "Them: 'Busy week. We're launching a new app at work, and my dog's sick.'",
          "You (thread 1): 'Oh no, what's wrong with your dog?'",
          "You (share): 'Mine once ate a sock. Most expensive sock I've ever owned.'",
          "You (back to thread 2): 'So what's the app? Now I'm curious.'",
        ],
        note: "Follow one thread, share something small, then reach back for another.",
      },
      {
        id: "d9-quiz",
        kind: "quiz",
        question: "Someone says: 'I just got back from Lisbon. First trip since I started my new job.' Which threads are available?",
        options: [
          { id: "a", text: "Only Lisbon.", correct: false },
          { id: "b", text: "Lisbon, travel in general, why they picked it, and the new job.", correct: true },
          { id: "c", text: "None. They just answered the question.", correct: false },
        ],
        explanation: "Free information is everywhere: the trip, the city, why they chose it, the new job, and the fact that it's been a while since they travelled. Pick whichever you're genuinely most curious about.",
      },
      {
        id: "d9-scenario",
        kind: "scenario",
        situation: "A topic winds down and there's a pause.",
        prompt: "How do you keep things going?",
        options: [
          {
            id: "a",
            text: "'So… yeah.' Then look at your phone.",
            rating: "avoid",
            feedback: "The phone signals that you've checked out. The pause is fine. Leaving the conversation like that isn't.",
          },
          {
            id: "b",
            text: "Go back to an earlier thread: 'You mentioned the new job. How's it going so far?'",
            rating: "great",
            feedback: "Smooth recovery, and it proves you were listening the whole time.",
          },
          {
            id: "c",
            text: "Ask something new and generic: 'Any plans for the weekend?'",
            rating: "okay",
            feedback: "It works, but an earlier thread feels more personal.",
          },
        ],
      },
      {
        id: "d9-takeaway",
        kind: "takeaway",
        title: "Today in four lines",
        points: [
          "Every answer contains free information. Notice it.",
          "Follow one thread now, and keep others for later.",
          "Share something small and related, then hand the conversation back.",
          "When it goes quiet, go back to an earlier thread.",
        ],
      },
    ],
    mission: {
      codename: "Operation Thread Puller",
      objective: "Have 3 conversations where you follow free information and share something of your own.",
      contexts: ["workplace", "campus", "coffeeShop", "socialEvent", "gym"],
      standard: {
        title: "Three Threads",
        brief: "In 3 conversations, follow at least one thread from free information and share one related personal detail.",
        steps: [
          "Start with any open question.",
          "Mentally note two or three threads in their answer.",
          "Pull one, and share something related from your own life.",
          "When it winds down, go back to an earlier thread. Tap Conversation after each one.",
        ],
        targets: [{ counter: "conversations", target: 3, label: "Threaded conversations" }],
      },
      hardcore: {
        title: "Thread Weaver",
        brief: "Have 4 threaded conversations, including one with a stranger or new acquaintance, and in one of them come back to an earlier thread at least twice.",
        steps: [
          "Hold 4 threaded conversations.",
          "Start at least one with someone new. Tap Approach as well.",
          "In one conversation, return to earlier threads twice.",
        ],
        targets: [
          { counter: "conversations", target: 4, label: "Threaded conversations" },
          { counter: "approaches", target: 1, label: "New people" },
        ],
        checklist: ["Returned to an earlier thread twice in one conversation"],
      },
      tips: [
        "What you share doesn't need to be impressive. Small, relatable, and a bit self-deprecating works best.",
        "Keep your story shorter than theirs, then hand it back: 'Anyway, how did yours turn out?'",
        "Awkward silence? Log it as a Courage Rep. It's also the perfect moment to reach back for an earlier thread.",
      ],
      guardrail: "Share at the same depth they do. Matching their openness feels safe. Going much deeper than they have can feel like too much, too soon.",
    },
    logbook: [
      {
        id: "d9-threads",
        question: "Pick one conversation: what free information did they offer, and which threads did you follow?",
        placeholder: "He mentioned his band, his commute, and his sister's wedding. I followed…",
      },
      {
        id: "d9-shared",
        question: "What did you share about yourself today? How did the other person respond?",
        placeholder: "I told her about my disastrous first attempt at baking bread, and she…",
      },
      {
        id: "d9-balance",
        question: "On a scale from 'interview' to 'ping-pong', how balanced did your conversations feel? What would you adjust?",
        placeholder: "Still a bit interview-ish. Next time I'll share earlier, after…",
      },
    ],
    rewards: {
      xp: 60,
      hardcoreXp: 40,
      attributes: { empathy: 3, storytelling: 5, presence: 3 },
      hardcoreAttributes: { storytelling: 2, presence: 1 },
    },
  },

  /* ==========================================================================
   * DAY 10 — The Three-Minute Conversation
   * ======================================================================== */
  {
    day: 10,
    chapter: 2,
    slug: "three-minute-conversation",
    title: "The Three-Minute Conversation",
    tagline: "Your first full arc: open, explore, share, exit.",
    estReadMinutes: 3,
    isMilestone: false,
    briefing: [
      {
        id: "d10-hook",
        kind: "hook",
        icon: "Timer",
        title: "Day 10: your first real test",
        body: "You've practiced every piece separately. Today you'll put them together into one complete, curiosity-driven conversation of **at least three minutes**. That's long enough to genuinely learn something about someone, and short enough to feel doable.",
      },
      {
        id: "d10-arc",
        kind: "concept",
        icon: "Route",
        title: "The conversation arc",
        body: "**Open:** a comment on the shared moment, or a genuine question. **Explore:** follow-ups on the most interesting thing they say. **Share:** something related from your life. **Thread:** go back to an earlier detail. **Exit:** signal, appreciate, callback.",
      },
      {
        id: "d10-science",
        kind: "science",
        icon: "Sparkles",
        title: "We expect shallow, but we enjoy deep",
        finding: "People consistently expect deeper conversations with strangers to be more awkward and less enjoyable than they really are. In experiments, both people enjoyed meaningful conversations more, and felt **more connected**, than they had predicted.",
        source: "Kardas, Kumar & Epley (2022), Journal of Personality and Social Psychology",
      },
      {
        id: "d10-story-questions",
        kind: "concept",
        icon: "BookOpen",
        title: "Story questions, not fact questions",
        body: "Fact questions get one-line answers. Story questions give people room to be interesting. Instead of 'What do you do?', try **'What's keeping you busy these days?'** Instead of 'Where are you from?', try **'What do you miss about where you grew up?'**",
      },
      {
        id: "d10-reflect",
        kind: "concept",
        icon: "Repeat",
        title: "Reflect before you respond",
        body: "Before your next question, briefly say back what you heard: **'So you basically taught yourself? That's impressive.'** It shows you understood, it gives them a moment of feeling seen, and it stops you from firing off question after question.",
      },
      {
        id: "d10-scripts",
        kind: "script",
        title: "A three-minute arc at a café",
        lines: [
          "Open: 'Is this the line for ordering or for pickup? I can never tell here.'",
          "Explore: 'You seem like a regular. What's actually good?' … 'Oh, you work nearby? What do you do?'",
          "Reflect + share: 'You design museum exhibits? What a cool job. I was the kid who touched everything.'",
          "Thread: 'Wait, you said the new exhibit opens soon. What's it about?'",
          "Exit: 'I should grab my coffee. Really fun chatting. Good luck with the opening!'",
        ],
      },
      {
        id: "d10-quiz",
        kind: "quiz",
        question: "Ninety seconds in, your mind goes blank. What's your best move?",
        options: [
          {
            id: "a",
            text: "Apologize and leave.",
            correct: false,
            feedback: "There's nothing to apologize for. A blank moment is normal and easy to recover from.",
          },
          {
            id: "b",
            text: "Reflect what they just said and ask about it: 'So you've done that for years. What keeps it interesting?'",
            correct: true,
          },
          {
            id: "c",
            text: "Go back to talking about the weather.",
            correct: false,
            feedback: "It fills the gap, but it resets the conversation to zero. Use what they've already told you.",
          },
        ],
        explanation: "When you go blank, the answer is almost always in what they just said. Reflect it back and get curious about it.",
      },
      {
        id: "d10-myth",
        kind: "mythBuster",
        myth: "If there's a pause, the conversation is dying.",
        reality: "Pauses are breathing room, not failure. A relaxed half-second of silence, a smile, and a return to an earlier thread is a **perfectly smooth recovery**.",
      },
      {
        id: "d10-takeaway",
        kind: "takeaway",
        title: "Today in four lines",
        points: [
          "Open, explore, share, thread, exit.",
          "Ask story questions, not fact questions.",
          "Reflect what you heard before your next question.",
          "Deep conversations are more enjoyable than either of you expects.",
        ],
      },
    ],
    mission: {
      codename: "Operation Three Minutes",
      objective: "Hold one curiosity-driven conversation for at least 3 minutes.",
      contexts: ["coffeeShop", "campus", "workplace", "socialEvent", "gym"],
      timer: { seconds: 180, label: "Conversation timer" },
      standard: {
        title: "The Full Arc",
        brief: "Have at least one conversation lasting 3+ minutes with a stranger or acquaintance, using the full arc: open, explore, share, thread, exit.",
        steps: [
          "Pick a setting with natural waiting time: a café, a queue, a break room, before class starts, an event.",
          "Open with the shared moment or a genuine question.",
          "Explore with follow-ups, reflect what you hear, and share something of your own.",
          "Glance at the timer if you like, but focus on them, not the clock.",
          "Exit warmly, then tap Conversation.",
        ],
        targets: [{ counter: "conversations", target: 1, label: "3-minute conversations" }],
      },
      hardcore: {
        title: "Double Arc",
        brief: "Hold 2 conversations of 3+ minutes, at least one with a complete stranger, and stretch one of them to 5 minutes.",
        steps: [
          "Complete two full arcs.",
          "Start at least one with a complete stranger. Tap Approach as well.",
          "Let one run past five minutes naturally, without forcing it.",
        ],
        targets: [
          { counter: "conversations", target: 2, label: "3-minute conversations" },
          { counter: "approaches", target: 1, label: "Complete strangers" },
        ],
        checklist: ["One conversation lasted 5+ minutes"],
      },
      tips: [
        "Acquaintances you've only ever said hi to are ideal: the classmate, the neighbor, the coworker from another team.",
        "Don't time it on your phone in front of them. Start the timer beforehand, or estimate afterwards.",
        "If it ends at two minutes, it's still a great rep. Log it, then try again with someone else.",
      ],
      guardrail: "Watch for signs they want to leave: short answers, turning away, checking the time. Wrapping up when they're ready is part of the skill.",
    },
    logbook: [
      {
        id: "d10-retell",
        question: "Retell your longest conversation. What did you learn about the other person?",
        placeholder: "It started with the coffee machine breaking. Turns out she's training for…",
      },
      {
        id: "d10-arc",
        question: "Which part of the arc felt most natural, and which was hardest?",
        placeholder: "Opening is easy now. Sharing about myself still feels awkward because…",
      },
      {
        id: "d10-day-one",
        question: "Compare today with Day 1. What would the Day 1 version of you think if they'd watched this conversation?",
        placeholder: "Day 1 me would not believe I just talked to a stranger for four minutes about…",
      },
    ],
    rewards: {
      xp: 60,
      hardcoreXp: 40,
      attributes: { empathy: 3, presence: 3, storytelling: 3, initiative: 2, resilience: 2 },
      hardcoreAttributes: { initiative: 1, resilience: 1, storytelling: 1 },
    },
  },
];
