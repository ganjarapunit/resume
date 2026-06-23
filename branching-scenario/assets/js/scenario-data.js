const SCENARIOS = [
  {
    id: 'intro',
    type: 'intro',
    title: 'Error Correction Dilemmas',
    subtitle: 'A branching scenario for new EFL teachers',
    description: 'You\'re about to step into your first real EFL classroom. Every choice you make shapes your students\' confidence, progress, and willingness to speak. This simulation puts you in 27 authentic teaching moments — each decision reveals your emerging correction style.',
    objectives: [
      'Balance fluency vs accuracy',
      'Match technique to learner',
      'Manage learner affect',
      'Prevent fossilization',
      'Build reflective practice'
    ]
  },
  {
    id: 'start-scene',
    title: 'Your First Day: The Classroom Door Opens',
    character: 'Maria (Italy, A2)',
    description: `Maria raises her hand confidently and says:\n\n<b>"Yesterday I go to the supermarket and buy many things."</b>\n\nShe's using present tense for past events — a systematic error among several students. The class is watching you. How do you respond?`,
    context: 'Class of 18 students from 6 countries. A2 pre-intermediate level. You have rapport but they are testing your correction style.',
    choices: [
      {
        label: 'Interrupt and correct',
        desc: '"Maria, remember — yesterday I WENT to the supermarket."',
        scores: { accuracy: 3, affect: 1, technique: 1 },
        target: 'over-correction',
        feedback: 'You prioritized grammatical accuracy over communicative flow. Research shows this can reduce willingness to communicate.'
      },
      {
        label: 'Recast naturally',
        desc: '"Oh, you went to the supermarket yesterday? What did you buy?"',
        scores: { accuracy: 2, affect: 3, technique: 3 },
        target: 'recast-fallout',
        feedback: 'Recasts preserve affect but learners often don\'t notice them. Let\'s see how this plays out.'
      },
      {
        label: 'Note and return later',
        desc: 'Smile, nod, jot down "go→went" on your notepad for a delayed correction slot.',
        scores: { accuracy: 3, affect: 3, technique: 4 },
        target: 'fluency-path',
        feedback: 'Delayed correction is evidence-based best practice — you maintain flow while planning intervention.'
      },
      {
        label: 'Let it pass',
        desc: 'The class is lively and engaged. You decide fluency matters more right now.',
        scores: { accuracy: 1, affect: 4, technique: 2 },
        target: 'fluency-path',
        feedback: 'Sometimes fluency IS the goal. But unaddressed errors can fossilize — plan to circle back.'
      }
    ]
  },
  {
    id: 'over-correction',
    title: 'The Over-Correction Effect',
    character: 'Ahmed (Egypt, B1)',
    description: `After your interruption, Ahmed — usually talkative and confident — has gone silent. He stares at his notebook. You overhear him whisper:\n\n<b>"I went... I went... I went to the..."</b>\n\nHe's drilling himself. Elena watched you correct Maria and now looks nervous too. Your one correction rippled through the class.`,
    context: 'Ahmed is a perfectionist. Public correction triggered his anxiety. Several students witnessed the moment and adjusted their behaviour.',
    choices: [
      {
        label: 'Directly re-engage Ahmed',
        desc: '"Ahmed, can you tell me what you bought? Use WENT!"',
        scores: { accuracy: 2, affect: 1, technique: 1 },
        target: 'withdrawal-cycle',
        feedback: 'Calling him out again compounds the pressure. He needs confidence-building, not more attention on his error.'
      },
      {
        label: 'Switch to pair work',
        desc: '"Share your weekend stories with a partner — I want everyone to speak for 2 minutes."',
        scores: { accuracy: 2, affect: 4, technique: 4 },
        target: 'pronunciation-minefield',
        feedback: 'Excellent! Pair work lowers the affective filter and gives Ahmed safe space to rebuild confidence.'
      },
      {
        label: 'Model sharing yourself first',
        desc: 'Share your own weekend story with deliberate errors. "Can you help me correct MY sentences?"',
        scores: { accuracy: 2, affect: 4, technique: 3 },
        target: 'beginner-struggle',
        feedback: 'Using yourself as a model normalizes errors. Students learn mistakes are part of the process.'
      },
      {
        label: 'Board-based self-correction',
        desc: 'Write Maria\'s sentence on the board. "Which word should change if it\'s about YESTERDAY?"',
        scores: { accuracy: 3, affect: 2, technique: 3 },
        target: 'cultural-face',
        feedback: 'Group correction depersonalizes the error, but can still trigger face concerns in collectivist cultures.'
      }
    ]
  },
  {
    id: 'recast-fallout',
    title: 'The Hidden Recast',
    character: 'Toshi (Japan, B1)',
    description: `You\'ve been recasting for 20 minutes. Toshi just said:\n\n<b>"Yesterday I make a mistake. I think wrong answer."</b>\n\nYou recast: "Made a mistake? We all do that, Toshi." He nodded politely. But in the next written activity, Toshi writes: "Yesterday I MAKE a terrible mistake."\n\nYour recasts aren't landing.`,
    context: 'Japanese learners often nod to show listening (aizuchi), not understanding. Your recasts may be processing noise, not input.',
    choices: [
      {
        label: 'Enhance recast with stress',
        desc: '"MAKE or MADE? Yes, MADE — and what does MADE mean in this sentence?"',
        scores: { accuracy: 3, affect: 2, technique: 2 },
        target: 'fossilization-path',
        feedback: 'Salient recasts help, but Toshi may still process this as confirmation of his original sentence, not correction.'
      },
      {
        label: 'Switch to explicit correction',
        desc: '"Everyone, I notice many of you say \'yesterday I MAKE\'. Let\'s drill irregular past tense."',
        scores: { accuracy: 4, affect: 1, technique: 2 },
        target: 'advanced-student',
        feedback: 'Explicit correction is effective for accuracy but kills communicative momentum. Reserve for systematic patterns.'
      },
      {
        label: 'Use elicitation',
        desc: 'When Toshi says "yesterday I make", pause: "Yesterday you...?" with an expectant look.',
        scores: { accuracy: 3, affect: 3, technique: 4 },
        target: 'student-uptake-fail',
        feedback: 'Elicitation prompts self-correction — stronger for acquisition than recasts. Good technique.'
      },
      {
        label: 'Quick choral drill',
        desc: '"Repeat after me: Yesterday I MADE. Yesterday I WENT. Yesterday I BOUGHT." 60 seconds. Move on.',
        scores: { accuracy: 4, affect: 2, technique: 3 },
        target: 'beginner-struggle',
        feedback: 'Brief drills are effective for habit formation. Keep them short and contextualized.'
      }
    ]
  },
  {
    id: 'fluency-path',
    title: 'Fluency is Flowing — But Errors Are Piling Up',
    character: 'Entire Class',
    description: `It\'s 25 minutes in. Students are speaking passionately. But the error density is rising:\n\n<b>Elena:</b> "My brother have a car. He drive very fast."<br><b>Pablo:</b> "I no like the movie. The actor no good."<br><b>Yuki:</b> "She very pretty."\n\nConfidence is HIGH. Accuracy is LOW. The lesson objective was "holiday vocabulary." Do you protect the fluency or intervene?`,
    context: 'The classic accuracy-fluency dilemma. Every minute of intervention reduces speaking time. But unchecked errors form habits.',
    choices: [
      {
        label: 'Continue prioritizing fluency',
        desc: 'Keep the discussion going. You\'ll address patterns in the next lesson.',
        scores: { accuracy: 1, affect: 4, technique: 3 },
        target: 'pronunciation-minefield',
        feedback: 'Setting a fluency stage is valid — just ensure you circle back. Delaying too long risks losing the teachable moment.'
      },
      {
        label: 'Mini whiteboard slot',
        desc: '"Everyone, grab whiteboards. Write one thing someone said — with PERFECT grammar." 2 minutes.',
        scores: { accuracy: 4, affect: 3, technique: 4 },
        target: 'accuracy-intervention',
        feedback: 'Whiteboard correction maintains engagement while forcing accuracy. A creative middle ground.'
      },
      {
        label: 'Noticing activity',
        desc: '"I heard 5 errors. In pairs, can you find them? First pair to correct all wins."',
        scores: { accuracy: 4, affect: 3, technique: 5 },
        target: 'advanced-student',
        feedback: 'Noticing builds metalinguistic awareness — high-impact for long-term accuracy improvement.'
      },
      {
        label: 'Elicit peer correction',
        desc: '"Can anyone help Elena make that sentence stronger?"',
        scores: { accuracy: 3, affect: 2, technique: 3 },
        target: 'cultural-face',
        feedback: 'Peer correction fosters collaboration but can create face issues. Know your students\' cultural backgrounds.'
      }
    ]
  },
  {
    id: 'advanced-student',
    title: 'The Advanced Learner Pushes Back',
    character: 'Elena (Spain, B1→B2)',
    description: `During pair work, Elena approaches you:\n\n<b>"Teacher, I want you to correct ALL my mistakes. My previous teacher never corrected me and I feel I make same errors. Please tell me every time I am wrong."</b>\n\nShe's motivated, self-aware, and explicitly asking for correction. But "every mistake" is neither practical nor pedagogically sound.`,
    context: 'Elena represents the learner who believes explicit correction equals faster progress. Research shows advanced learners DO benefit from more feedback — but selective, targeted correction works better than blanket correction.',
    choices: [
      {
        label: 'Agree to correct every mistake',
        desc: '"Absolutely, Elena. I\'ll correct you every time for the rest of the lesson."',
        scores: { accuracy: 4, affect: 1, technique: 1 },
        target: 'correction-overload',
        feedback: 'Correction overload overwhelms working memory. Selective targeting of 2-3 error patterns is more effective.'
      },
      {
        label: 'Negotiate selective correction',
        desc: '"Let me track your TOP 3 error types this month. We\'ll focus on those and track your progress together."',
        scores: { accuracy: 3, affect: 4, technique: 5 },
        target: 'beginner-struggle',
        feedback: 'Personalized error profiling with learner buy-in is gold-standard practice.'
      },
      {
        label: 'Record and review',
        desc: '"Let me record you speaking for 5 minutes. Next lesson we\'ll listen together — you can correct yourself."',
        scores: { accuracy: 3, affect: 4, technique: 5 },
        target: 'mid-lesson-crisis',
        feedback: 'Self-correction from recorded output is highly effective for advanced learners — builds autonomous monitoring.'
      },
      {
        label: 'Explain your philosophy',
        desc: '"Research shows too much correction interrupts communication. I\'ll give you focused feedback on key areas."',
        scores: { accuracy: 3, affect: 3, technique: 3 },
        target: 'cultural-face',
        feedback: 'Transparency builds trust, but she may perceive this as refusing her request. Follow through on promises.'
      }
    ]
  },
  {
    id: 'pronunciation-minefield',
    title: 'The Pronunciation Minefield',
    character: 'Yuki (Japan, A2)',
    description: `Yuki is describing her friend:\n\n<b>"My friend is very... she... ep."</b> She hesitates. "Sheep?"\n\nShe means SHIP /ʃɪp/ but produced SHEEP /ʃiːp/. Maria calls out: "Your friend is a SHIP?" The class giggles. Yuki\'s face turns red. A classic minimal pair breakdown threatening to derail the lesson and damage Yuki\'s confidence.`,
    context: 'Minimal pair confusion (/iː/ vs /ɪ/) is common for Japanese, Korean, and Spanish speakers. Public laughter triggers language anxiety.',
    choices: [
      {
        label: 'Minimal pair drill for class',
        desc: '"Class, let\'s practice: SHIP /ʃɪp/ and SHEEP /ʃiːp/. Everyone repeat." Then return to Yuki.',
        scores: { accuracy: 4, affect: 2, technique: 3 },
        target: 'remedial-drill-pitfall',
        feedback: 'Drills work but can feel remedial. Normalizing for everyone depersonalizes the correction for Yuki.'
      },
      {
        label: 'Humor to defuse',
        desc: '"Well, I hope your friend isn\'t a farm animal! Actually, these two words trip everyone up. Let\'s practice."',
        scores: { accuracy: 3, affect: 3, technique: 2 },
        target: 'mid-lesson-crisis',
        feedback: 'Humor defuses tension but ensure Yuki is laughing WITH, not AT. Watch her reaction carefully.'
      },
      {
        label: 'Private coaching moment',
        desc: 'Walk to Yuki\'s desk, crouch down. Quietly: "Look at my mouth — SH-EE-P. Now you try." Then move on calmly.',
        scores: { accuracy: 4, affect: 5, technique: 4 },
        target: 'fossilization-path',
        feedback: 'Private, low-pressure correction builds trust. The crouching posture signals safety. Excellent for learner affect.'
      },
      {
        label: 'Gloss over',
        desc: 'Smile, nod, and move to the next student without addressing the error or the laughter.',
        scores: { accuracy: 1, affect: 1, technique: 1 },
        target: 'cultural-face',
        feedback: 'Ignoring the error leaves Yuki humiliated AND the error uncorrected. This is the worst of both worlds.'
      }
    ]
  },
  {
    id: 'beginner-struggle',
    title: 'The Beginner\'s Broken English',
    character: 'Pablo (Colombia, A1)',
    description: `Pablo — only 3 weeks into English — raises his hand eagerly:\n\n<b>"Me no like coffee. Me no like class yesterday."</b>\n\nDouble negatives and "me" as subject — classic Spanish L1 transfer ("A mí no me gusta"). But he IS trying. That\'s a win for engagement. Your response determines whether he speaks again.`,
    context: 'A1 true beginner. He needs encouragement more than correction right now. Errors are developmental — typical of early Spanish speakers.',
    choices: [
      {
        label: 'Gentle recast + praise',
        desc: '"You don\'t like coffee? Great sentence! And you DIDN\'T like the class? Try: I didn\'t like the class."',
        scores: { accuracy: 3, affect: 4, technique: 3 },
        target: 'scaffolding-success',
        feedback: 'Positive sandwich (praise → correction → praise) maintains confidence. Good for low-level learners.'
      },
      {
        label: 'Build a visual scaffold',
        desc: 'Write on the board with two cards: DON\'T (today) and DIDN\'T (yesterday). "Which for your sentence, Pablo?"',
        scores: { accuracy: 5, affect: 4, technique: 5 },
        target: 'fossilization-path',
        feedback: 'Visual scaffolding with manipulable cues is exceptional for A1. Clear, concrete, empowering.'
      },
      {
        label: 'Praise and move on',
        desc: '"Excellent try, Pablo! Great job participating!" Say nothing about the error.',
        scores: { accuracy: 1, affect: 5, technique: 2 },
        target: 'mid-lesson-crisis',
        feedback: 'For early A1, encouraging participation IS the goal. But after 3 weeks, some basic correction is appropriate.'
      },
      {
        label: 'Pattern drill',
        desc: '"Class repeat: I LIKE coffee. I DON\'T LIKE tea. Pablo, your turn: I DIDN\'T like class."',
        scores: { accuracy: 5, affect: 1, technique: 2 },
        target: 'cultural-face',
        feedback: 'Effective structurally but humiliating when done publicly. Choral drilling depersonalizes better.'
      }
    ]
  },
  {
    id: 'fossilization-path',
    title: 'The Fossilization Wake-Up Call',
    character: 'Entire Class',
    description: `It\'s near the end of your first week. The same errors keep appearing — despite your corrections. Maria still says "yesterday I go." Ahmed still says "he go to school." Elena still drops articles.\n\n<b>You feel like Sisyphus.</b>\n\nThis is the fossilization trap. Once errors become habits, they require 3x more intervention to correct. Your choice here is critical.`,
    context: 'Fossilization is the #1 challenge for new teachers. Early strategic intervention is the difference between lifelong errors and lasting accuracy.',
    choices: [
      {
        label: 'Class error audit',
        desc: '"Class, I noticed patterns. Let\'s look at these 5 sentences. Which are correct? Why?"',
        scores: { accuracy: 5, affect: 3, technique: 5 },
        target: 'mid-lesson-crisis',
        feedback: 'Meta-cognitive error analysis is high-impact. When students understand WHY, retention improves 3x.'
      },
      {
        label: 'Dedicate a review lesson',
        desc: 'Tomorrow: 50 minutes on the top 5 fossilized errors. Drills, worksheets, controlled practice.',
        scores: { accuracy: 4, affect: 2, technique: 2 },
        target: 'review-lesson-blowback',
        feedback: 'Intensive review is useful but don\'t neglect communicative practice entirely. Balance is key.'
      },
      {
        label: 'Self-monitoring cards',
        desc: 'Give each student an "error card." When you hear their target error, tap their desk silently. They self-correct.',
        scores: { accuracy: 4, affect: 4, technique: 5 },
        target: 'mid-lesson-crisis',
        feedback: 'Silent cues preserve affect while building monitoring. Transfers responsibility to the learner. Excellent.'
      },
      {
        label: 'Dictogloss noticing',
        desc: 'Read a paragraph containing their error patterns. Students reconstruct it in pairs, then compare with the original.',
        scores: { accuracy: 5, affect: 3, technique: 5 },
        target: 'the-wrap-up',
        feedback: 'Dictogloss combines noticing, peer collaboration, and form focus. Advanced pedagogical technique.'
      }
    ]
  },
  {
    id: 'cultural-face',
    title: 'The Silence of the Learner',
    character: 'Wei (China, A2)',
    description: `Wei has not spoken voluntarily for 20 minutes — ever since your public pronunciation correction in the first activity.\n\nShe participates quietly in writing tasks but avoids speaking. When you call on her directly, she whispers. Her written work is ACCURATE — she knows the material but won\'t produce it orally.\n\nYou suspect "face" (miànzi) concerns.`,
    context: 'In Chinese collectivist culture, public correction causes loss of face that extends beyond the individual to their social group. Wei needs face-repair before she re-engages.',
    choices: [
      {
        label: 'Private one-on-one chat',
        desc: 'Approach her quietly during pair work. "Your writing is excellent. Can we practice together for 2 minutes?"',
        scores: { accuracy: 3, affect: 5, technique: 5 },
        target: 'advanced-student',
        feedback: 'Face-repair through private validation is culturally intelligent. She needs to trust you before speaking again.'
      },
      {
        label: 'Strategic grouping',
        desc: 'Move Wei into a trio with supportive classmates. Give her the "writer" role — plays to her strength.',
        scores: { accuracy: 3, affect: 4, technique: 4 },
        target: 'mid-lesson-crisis',
        feedback: 'Strategic grouping with a low-pressure role rebuilds confidence without demanding public speech.'
      },
      {
        label: 'Class-level face repair',
        desc: '"I want to apologize — I interrupted Wei earlier. Wei, would you show us your written answer? It\'s excellent."',
        scores: { accuracy: 2, affect: 3, technique: 3 },
        target: 'face-repair-attempt',
        feedback: 'Sensitive intention, but may draw MORE attention. Wei may not want any public spotlight right now.'
      },
      {
        label: 'Give space and time',
        desc: 'Stop calling on Wei today. Tomorrow, start fresh with a low-pressure greeting activity.',
        scores: { accuracy: 2, affect: 5, technique: 3 },
        target: 'the-wrap-up',
        feedback: 'Respecting her need for psychological safety is wise. Follow up with predictable, structured speaking tasks.'
      }
    ]
  },
  {
    id: 'withdrawal-cycle',
    title: 'The Withdrawal Cycle',
    character: 'Ahmed (Egypt, B1)',
    description: `You call on Ahmed again, hoping to pull him back in:\n\n<b>"Ahmed, tell me — what did you do this weekend? Use WENT correctly this time."</b>\n\nHe stares at his desk. The room is silent. Ahmed whispers: <b>"I... I can't. I forget."</b>\n\nHe's now in a full withdrawal spiral. The public attention you intended as re-engagement has pushed him deeper into silence. His confidence is fractured — and the class feels it.`,
    context: 'Ahmed has gone from talkative to completely withdrawn. You need a face-saving strategy before he disengages entirely for the rest of the lesson.',
    choices: [
      {
        label: 'Normalize the struggle',
        desc: '"That\'s OK — this is hard for everyone. Ahmed, just nod yes or no: Did you go somewhere?"',
        scores: { accuracy: 2, affect: 5, technique: 4 },
        target: 'student-resilience',
        feedback: 'Lowering demand to yes/no preserves dignity. You\'re meeting him where he is.'
      },
      {
        label: 'Pass to another student',
        desc: '"Maria, can you help us out? What did YOU do this weekend?"',
        scores: { accuracy: 2, affect: 4, technique: 3 },
        target: 'advanced-student',
        feedback: 'Taking pressure off Ahmed is good, but he may interpret this as teacher giving up on him. Circle back privately.'
      },
      {
        label: 'Private writing task',
        desc: '"Class, quickly write 3 things you did this weekend. Ahmed, I\'ll come check yours in a moment."',
        scores: { accuracy: 3, affect: 5, technique: 4 },
        target: 'beginner-struggle',
        feedback: 'Lower-stakes modality shift (speaking → writing) with promised private check-in. Excellent differentiated response.'
      },
      {
        label: 'Model an imperfect answer',
        desc: '"OK my turn — I GO to the cinema. I EAT popcorn. Ahmed, can you make MY sentence better?"',
        scores: { accuracy: 3, affect: 4, technique: 4 },
        target: 'pronunciation-minefield',
        feedback: 'Shifting from performer to corrector gives Ahmed a cognitive role without public-speaking pressure.'
      }
    ]
  },
  {
    id: 'student-uptake-fail',
    title: 'The Hidden Recast Continues',
    character: 'Toshi (Japan, B1)',
    description: `Despite your elicitation technique — pausing expectantly when Toshi says "yesterday I make" — Toshi still can't self-correct. He looks confused and says:\n\n<b>"...Yesterday I make? No... yesterday I... um..."</b>\n\nHe trails off. The elicitation, which worked well with Maria, isn't enough for Toshi. He needs more scaffolding. The class is watching him struggle.`,
    context: 'Different learners respond differently to the same technique. Toshi\'s processing style (field-dependent) needs explicit input before elicitation works.',
    choices: [
      {
        label: 'Give the correct form directly',
        desc: '"Yesterday I MADE. Toshi, repeat: I made a mistake."',
        scores: { accuracy: 4, affect: 3, technique: 2 },
        target: 'fossilization-path',
        feedback: 'Direct correction after failed elicitation is honest pedagogy. Not every technique works for every learner.'
      },
      {
        label: 'Use a visual timeline',
        desc: 'Draw a timeline on the board: NOW = make. YESTERDAY = ??? "Toshi, what goes here?"',
        scores: { accuracy: 5, affect: 5, technique: 5 },
        target: 'code-switching-balance',
        feedback: 'Visual scaffolding bridges the gap between implicit and explicit knowledge. Excellent universal design.'
      },
      {
        label: 'Choral repetition for everyone',
        desc: '"Class, let\'s say it together three times: I MADE a mistake. I WENT to school. I BOUGHT food."',
        scores: { accuracy: 4, affect: 2, technique: 3 },
        target: 'pronunciation-minefield',
        feedback: 'Group drilling depersonalizes the correction and builds muscle memory. Toshi benefits without being singled out.'
      },
      {
        label: 'Simplified question',
        desc: '"Toshi, was it yesterday or today?" (He answers.) "So which word? Make... or MADE?"',
        scores: { accuracy: 4, affect: 4, technique: 4 },
        target: 'beginner-struggle',
        feedback: 'Chunking the question into binary choices reduces cognitive load. Gets Toshi to the answer step by step.'
      }
    ]
  },
  {
    id: 'accuracy-intervention',
    title: 'Accuracy vs. Fluency: The Intervention',
    character: 'Entire Class',
    description: `The whiteboard activity was revealing. Students can write correct sentences — but when speaking, the same errors appear. Elena wrote perfect sentences but when she spoke:\n\n<b>"Yesterday I GO to park. I SEE my friend. We DRINK coffee."</b>\n\nThere\'s a gap between declarative knowledge (knowing rules) and procedural knowledge (using them). Your whiteboard moment bought you data — now you need a strategy.`,
    context: 'The knowing-doing gap is common in L2 learners. Written accuracy doesn\'t guarantee oral accuracy. Different mode = different processing demands.',
    choices: [
      {
        label: 'Controlled speaking drill',
        desc: '"Elena, let\'s practice: I went... You went... He went... Now make a sentence about YESTERDAY."',
        scores: { accuracy: 5, affect: 3, technique: 3 },
        target: 'fossilization-path',
        feedback: 'Controlled practice bridges the declarative-procedural gap. Add context to avoid mechanical repetition.'
      },
      {
        label: 'Record and playback',
        desc: '"In pairs, record a 1-minute story. Then listen and correct your own past tense errors."',
        scores: { accuracy: 4, affect: 4, technique: 5 },
        target: 'advanced-student',
        feedback: 'Self-monitoring through recording builds autonomous error detection — high-impact long-term strategy.'
      },
      {
        label: 'Move on — revisit tomorrow',
        desc: '"Good work everyone. We\'ll review past tense again in the warm-up tomorrow."',
        scores: { accuracy: 2, affect: 4, technique: 2 },
        target: 'the-wrap-up',
        feedback: 'Spaced repetition is research-backed. Students need multiple encounters across sessions to proceduralize rules.'
      },
      {
        label: 'Error hunt game',
        desc: '"I\'ll read 5 sentences — 3 have errors. In teams, find and fix them. Points for correct corrections!"',
        scores: { accuracy: 4, affect: 4, technique: 4 },
        target: 'pronunciation-minefield',
        feedback: 'Gamified noticing builds metalinguistic awareness. Team format lowers individual pressure.'
      }
    ]
  },
  {
    id: 'correction-overload',
    title: 'Correction Overload',
    character: 'Elena (Spain, B1→B2)',
    description: `You agreed to correct every Elena mistake. It\'s been 10 minutes. Elena has been interrupted 14 times.\n\nShe just said: <b>"Yesterday I went to the... yesterday I GO to..."</b> then stopped herself mid-sentence, frustrated.\n\n<b>"I can't speak anymore,"</b> she says quietly. <b>"Every time I open my mouth, I\'m wrong."</b>\n\nYour well-intentioned commitment has backfired. She\'s gone from motivated to demoralized.`,
    context: 'Research confirms: too much correction overwhelms the learner\'s affective filter and working memory. 14 interruptions in 10 minutes is counterproductive.',
    choices: [
      {
        label: 'Apologize and reset the agreement',
        desc: '"Elena, I was wrong. Let me correct only 2 patterns this week. Write them down together."',
        scores: { accuracy: 4, affect: 5, technique: 5 },
        target: 'confidence-restoration',
        feedback: 'Admitting over-correction and resetting expectations models healthy teacher-learner collaboration.'
      },
      {
        label: 'Switch to delayed written feedback',
        desc: '"Let\'s pause oral correction. After you speak, I\'ll write key errors on paper for you."',
        scores: { accuracy: 3, affect: 4, technique: 4 },
        target: 'fossilization-path',
        feedback: 'Delayed written feedback preserves speaking flow while still providing the correction she wants.'
      },
      {
        label: 'Explain the overload effect',
        desc: '"You\'re learning so much that your brain is full. Let\'s focus on just IRREGULAR PAST today. The rest comes later."',
        scores: { accuracy: 4, affect: 4, technique: 4 },
        target: 'cultural-face',
        feedback: 'Cognitive load theory in plain language. Narrowing focus prevents overwhelm while maintaining progress.'
      },
      {
        label: 'Give her a break',
        desc: '"Let\'s pause correction for 15 minutes. Just speak. I\'ll listen."',
        scores: { accuracy: 2, affect: 5, technique: 3 },
        target: 'mid-lesson-crisis',
        feedback: 'Pure fluency time is a reset button for the affective filter. Smart recovery move.'
      }
    ]
  },
  {
    id: 'remedial-drill-pitfall',
    title: 'The Drill That Drained Energy',
    character: 'Yuki (Japan, A2)',
    description: `Your minimal pair drill — planned for 3 minutes — has stretched to 10. The class is restless.\n\nYuki got the pronunciation right after 5 repetitions. But Pablo is now staring out the window. Toshi is tapping his pencil. Maria let out a loud sigh.\n\nYou made progress on accuracy but lost the room. The energy that existed before the drill has evaporated. Getting them back will be hard.`,
    context: 'The saturation point for isolated pronunciation work is about 3-5 minutes. Beyond that, learner engagement drops sharply and returns diminish.',
    choices: [
      {
        label: 'Abandon the drill immediately',
        desc: '"Great work! Now — in pairs, share something you SHIPPED or a story about a SHEEP. Ready? Go!"',
        scores: { accuracy: 3, affect: 5, technique: 4 },
        target: 'group-dynamics',
        feedback: 'Pivoting to contextualized practice saves the lesson. Good instinct to read the room and adapt.'
      },
      {
        label: 'Acknowledge the boredom',
        desc: '"I know — drills aren\'t exciting. Two more rounds then we move to stories. Stay with me!"',
        scores: { accuracy: 4, affect: 2, technique: 2 },
        target: 'mid-lesson-crisis',
        feedback: 'Honest acknowledgement helps, but pushing through fatigue is rarely optimal. Consider faster closure.'
      },
      {
        label: 'Turn it into a game',
        desc: '"Stand up if you have a SHIP story. Sit down. Stand up if you have a SHEEP story. Tell your partner!"',
        scores: { accuracy: 4, affect: 4, technique: 3 },
        target: 'fossilization-path',
        feedback: 'Kinesthetic element re-engages after drill fatigue. Good quick save but the game also needs novelty.'
      },
      {
        label: 'Stealth correction in dialogue',
        desc: '"OK everyone, let\'s write a short dialogue using SHIP and SHEEP — two minutes, in pairs, GO!"',
        scores: { accuracy: 3, affect: 4, technique: 4 },
        target: 'cultural-face',
        feedback: 'Contextualized production after isolated drilling moves students from accuracy to fluency. Balanced approach.'
      }
    ]
  },
  {
    id: 'scaffolding-success',
    title: 'Building on Success',
    character: 'Pablo (Colombia, A1)',
    description: `Your gentle correction worked. Pablo tries again:\n\n<b>"I... I no like... I DON\'T like coffee."</b>\n\nHe beams as the class nods approvingly. Your positive sandwich built his confidence. But now he\'s on a roll — raising his hand for every question, sometimes shouting out answers. He\'s excited. But other students can\'t get a word in.`,
    context: 'Success unleashed Pablo\'s participation, but now he\'s dominating. Managing this enthusiasm without crushing it is your next challenge.',
    choices: [
      {
        label: 'Channel his energy',
        desc: '"Pablo, you\'re doing so well! Now quiz your partner — ask them what they DON\'T like."',
        scores: { accuracy: 2, affect: 5, technique: 4 },
        target: 'teaching-persona',
        feedback: 'Redirecting dominant enthusiasm into peer teaching maintains his momentum while including others. Elegant classroom management.'
      },
      {
        label: 'Use hand signals',
        desc: 'Teach a simple gesture when Pablo shouts out — catch his eye, tap your nose. He waits. Then call on him.',
        scores: { accuracy: 2, affect: 3, technique: 4 },
        target: 'fossilization-path',
        feedback: 'Non-verbal signals manage dominant behaviour without public reprimand. Pablo learns turn-taking without shame.'
      },
      {
        label: 'Set a three-answer limit',
        desc: '"I love your energy! Let\'s hear 3 answers from Pablo, then give others turns."',
        scores: { accuracy: 2, affect: 3, technique: 3 },
        target: 'advanced-student',
        feedback: 'Explicit limits are fair and transparent. Pablo learns classroom expectations while feeling valued for his contributions.'
      },
      {
        label: 'Balance with quiet students',
        desc: '"Excellent Pablo — now Yuki, what\'s something YOU don\'t like?"',
        scores: { accuracy: 2, affect: 4, technique: 3 },
        target: 'pronunciation-minefield',
        feedback: 'Directing attention to less vocal students distributes participation. Works best paired with positive reinforcement.'
      }
    ]
  },
  {
    id: 'review-lesson-blowback',
    title: 'The Review Lesson Rebellion',
    character: 'Entire Class',
    description: `You announce a dedicated error review lesson. Groans echo across the room.\n\n<b>Pablo:</b> "Again the same?"<br><b>Elena:</b> "Can\'t we practice speaking?"<br><b>Ahmed:</> "I already know these rules."\n\nStudents are pushing back. They\'ve tasted communicative freedom and don\'t want to return to controlled practice. But their written work shows the errors are still there. You\'re caught between what they WANT and what they NEED.`,
    context: 'Learner resistance to form-focused instruction is common after fluency-oriented lessons. The challenge: make accuracy work feel relevant.',
    choices: [
      {
        label: 'Integrate review into a game',
        desc: '"OK — yesterday\'s error Olympics. Teams earn points for finding and fixing mistakes in real sentences."',
        scores: { accuracy: 4, affect: 4, technique: 4 },
        target: 'transition-moment',
        feedback: 'Gamification lowers resistance while hitting the same learning objectives. Competitive format re-engages the class.'
      },
      {
        label: 'Compromise: half review, half free practice',
        desc: '"25 minutes focused review, then 25 minutes free conversation. Deal?"',
        scores: { accuracy: 3, affect: 4, technique: 3 },
        target: 'mid-lesson-crisis',
        feedback: 'Negotiated curriculum respects learner voice. Students buy in when they see their preferences matter.'
      },
      {
        label: 'Explain the WHY',
        desc: '"I hear you. But these patterns keep appearing in your writing. 15 minutes to fix fluency-long term."',
        scores: { accuracy: 4, affect: 2, technique: 3 },
        target: 'cultural-face',
        feedback: 'Transparency about purpose builds respect, but may not overcome the emotional resistance to drill work.'
      },
      {
        label: 'Student-led error analysis',
        desc: '"Each of you gets your last writing. Find YOUR top 3 errors. We\'ll fix them individually."',
        scores: { accuracy: 5, affect: 4, technique: 5 },
        target: 'beginner-struggle',
        feedback: 'Personalized error analysis makes review relevant to each learner. They see their OWN gaps, not generic drills.'
      }
    ]
  },
  {
    id: 'face-repair-attempt',
    title: 'The Face Repair Fallout',
    character: 'Wei (China, A2)',
    description: `Your public apology drew everyone\'s attention to Wei. She went rigid.\n\nWhen you said <b>"Wei, would you show us your written answer? It\'s excellent"</b> — she stared at her paper, unmoving. Two students turned to look at her. The spotlight you wanted to reduce became a laser.\n\nWei didn\'t speak again. She wrote "I don\'t know" on the pairwork sheet and wouldn\'t make eye contact.`,
    context: 'Face repair in collectivist cultures requires subtlety. A public apology assumes the learner wants attention — when they actually want invisibility to recover.',
    choices: [
      {
        label: 'Completely disengage',
        desc: 'Stop looking at or calling on Wei for the rest of the lesson. Let her observe and recover.',
        scores: { accuracy: 2, affect: 5, technique: 3 },
        target: 'confidence-restoration',
        feedback: 'Giving her full autonomy to re-engage when ready respects her face needs. Patience is culturally intelligent.'
      },
      {
        label: 'Written private note',
        desc: 'During pair work, place a note on her desk: "Your writing is excellent. When you\'re ready, I\'d love to hear your voice. No pressure."',
        scores: { accuracy: 4, affect: 5, technique: 5 },
        target: 'mid-lesson-crisis',
        feedback: 'Written private validation repairs face without public cost. Gives her control over re-engagement timing.'
      },
      {
        label: 'Use anonymous positive feedback',
        desc: '"I read someone\'s summary and it was brilliant — they caught all 3 errors in the passage. Great eye for detail."',
        scores: { accuracy: 3, affect: 4, technique: 4 },
        target: 'fossilization-path',
        feedback: 'Anonymous praise benefits the whole class while indirectly repairing Wei\'s standing. She knows it\'s her.'
      },
      {
        label: 'Group her with strong friends',
        desc: 'Quietly move her to a trio with Maria and Elena — both supportive and communicative. Assign "secretary" role.',
        scores: { accuracy: 3, affect: 4, technique: 4 },
        target: 'transition-moment',
        feedback: 'Strategic grouping with trusted peers gives Wei a low-risk role. Leverages existing social bonds for safety.'
      }
    ]
  },
  {
    id: 'mentor-intervention',
    title: 'The Mentor\'s Honest Feedback',
    character: 'Your Mentor',
    description: `Your mentor pulls you aside during a quiet moment:\n\n<b>"I need to be direct with you. I\'ve noticed you\'re correcting almost everything. Your students are producing less language than when you started. The quiet ones are getting quieter. I want you to think about WHY you\'re correcting — not just WHAT you\'re correcting."</b>\n\nIt stings. But your mentor is right. You\'ve been correcting from anxiety — not pedagogy. Every error felt like a test you had to pass.`,
    context: 'New teachers often over-correct due to performance anxiety and the belief that all errors must be addressed immediately. Mentor feedback challenges this assumption.',
    choices: [
      {
        label: '"I was insecure. I\'ll ease up."',
        desc: '"I thought every error needed fixing. I see now that I was teaching for myself, not my students."',
        scores: { accuracy: 5, affect: 5, technique: 5 },
        target: 'the-wrap-up',
        feedback: 'Honest self-assessment shows emotional intelligence. This reflective posture accelerates professional growth.'
      },
      {
        label: '"Which errors should I prioritize?"',
        desc: '"Help me create a hierarchy — global vs local errors, developmental vs interference patterns."',
        scores: { accuracy: 5, affect: 4, technique: 5 },
        target: 'advanced-student',
        feedback: 'Seeking a systematic framework for error prioritization demonstrates deep professional commitment.'
      },
      {
        label: '"How do I find the balance?"',
        desc: '"Give me a rule of thumb — how many corrections per activity? When do I let things go?"',
        scores: { accuracy: 4, affect: 4, technique: 3 },
        target: 'beginner-struggle',
        feedback: 'Seeking practical heuristics is sensible for a new teacher. Rules of thumb scaffold decision-making.'
      },
      {
        label: '"Let me reflect and come back to you."',
        desc: '"I need time to think about this. Can we discuss after I\'ve watched my own recording?"',
        scores: { accuracy: 4, affect: 5, technique: 4 },
        target: 'the-wrap-up',
        feedback: 'Self-reflection before discussion is a mark of professional maturity — you\'re owning your growth.'
      }
    ]
  },
  {
    id: 'student-resilience',
    title: 'Building Resilience in a Struggling Learner',
    character: 'Ahmed (Egypt, B1)',
    description: `After you scaled back demands, Ahmed tried again:\n\n<b>"Yesterday I... go... no... I GO?"</b>\n\nHe looks at you desperately: <b>"I just can\'t get it right. I\'ve been studying English for 3 years. Everyone speaks better than me."</b>\n\nThis is deeper than grammar. Ahmed is experiencing learner identity crisis — his self-concept as a "good student" is threatened by persistent errors.`,
    context: 'Learner identity and self-efficacy directly impact motivation and language acquisition. Ahmed needs emotional scaffolding before further cognitive scaffolding.',
    choices: [
      {
        label: 'Share your own learning struggle',
        desc: '"I studied Spanish for 4 years. In my first real conversation, I asked for a BATHROOM when I meant a MARRIAGE proposal. We all struggle."',
        scores: { accuracy: 2, affect: 5, technique: 4 },
        target: 'pronunciation-minefield',
        feedback: 'Vulnerability modeling normalizes struggle. When teachers share failures, students take more risks.'
      },
      {
        label: 'Reframe his progress',
        desc: '"Three years? Let me show you your first week writing vs today. You\'ve improved 10x. The past tense will come."',
        scores: { accuracy: 3, affect: 5, technique: 4 },
        target: 'fossilization-path',
        feedback: 'Concrete progress evidence counters negative self-perception. Tangible records of growth rebuild motivation.'
      },
      {
        label: 'Set a micro-goal',
        desc: '"One goal for today: use WENT correctly 3 times. That\'s it. I\'ll track. You focus on that."',
        scores: { accuracy: 4, affect: 5, technique: 5 },
        target: 'cultural-face',
        feedback: 'Micro-goals make success achievable. Single error focus reduces overwhelm and builds momentum through small wins.'
      },
      {
        label: 'Group encouragement',
        desc: '"Ahmed is being brave by sharing his difficulty. In fact — raise your hand if past tense still trips you up."',
        scores: { accuracy: 2, affect: 4, technique: 3 },
        target: 'mid-lesson-crisis',
        feedback: 'Peer normalization reduces isolation. Seeing others struggle too can be liberating for a discouraged learner.'
      }
    ]
  },
  {
    id: 'code-switching-balance',
    title: 'The Code-Switching Question',
    character: 'Entire Class',
    description: `After using the visual timeline, Toshi murmurs something about "did" in Japanese to Maria. She nods enthusiastically and starts correcting her own sentences.\n\nThen Pablo does the same in Spanish with the student next to him. Soon, groups are using their native language to explain grammar.\n\nThe classroom hums with productive energy — but it\'s not in English. Half your class is using L1 to understand L2. Is this learning or avoidance?`,
    context: 'L1 use in the EFL classroom is debated. Strategic code-switching aids metalinguistic understanding; over-reliance prevents automatization. The question is intent.',
    choices: [
      {
        label: 'Allow strategic L1 use',
        desc: '"OK — 2 minutes for L1 grammar discussion. Then we practice in English only."',
        scores: { accuracy: 3, affect: 5, technique: 4 },
        target: 'fluency-path',
        feedback: 'Time-bound L1 use respects cognitive needs while maintaining English primacy. Clear boundaries prevent dependency.'
      },
      {
        label: 'Insist on English only',
        desc: '"English only please! If you don\'t know, ask me in English."',
        scores: { accuracy: 4, affect: 1, technique: 1 },
        target: 'beginner-struggle',
        feedback: 'Strict English-only policies can shut down the cognitive processing that was happening. Consider when L1 aids acquisition.'
      },
      {
        label: 'L1 to L2 bridge',
        desc: '"You explained in Spanish? Great. Now say the SAME explanation to me in English."',
        scores: { accuracy: 4, affect: 4, technique: 4 },
        target: 'cultural-face',
        feedback: 'Using L1 as a scaffold then bridging to L2 honours both languages. Productive translanguaging approach.'
      },
      {
        label: 'Ignore it — focus on output',
        desc: 'Let the code-switching continue. The English output quality has improved since they started discussing.',
        scores: { accuracy: 2, affect: 4, technique: 3 },
        target: 'advanced-student',
        feedback: 'If output quality demonstrably improves, the L1 is serving acquisition. But monitor that it doesn\'t become a crutch.'
      }
    ]
  },
  {
    id: 'confidence-restoration',
    title: 'Restoring Confidence After Over-Correction',
    character: 'Elena (Spain, B1→B2)',
    description: `After you apologized and reset your correction approach, Elena tried to speak:\n\n<b>"Yesterday... I... um... went... to... the..."</b>\n\nShe stops. Looks at you. Waits for correction that doesn\'t come. She seems unsure how to proceed without feedback.\n\n<b>"I forgot what I was saying,"</b> she admits. <b>"I\'m used to you stopping me."</b>\n\nShe\'s become dependent on your corrections as conversational cues. You need to rebuild her autonomous speaking confidence.`,
    context: 'Over-corrected learners can develop learned dependence — they pause after every clause waiting for teacher input. Restoring fluent output requires structured rebuilding.',
    choices: [
      {
        label: 'Extended wait time + encouraging nod',
        desc: 'Stay silent. Nod. Maintain eye contact and an expectant smile. Let her find the words.',
        scores: { accuracy: 3, affect: 5, technique: 5 },
        target: 'cultural-face',
        feedback: 'Silence is pedagogically powerful. Extended wait time (5-7 seconds) significantly improves quality of output.'
      },
      {
        label: 'Restart with a fresh topic',
        desc: '"Forget yesterday. Tell me about your FAVOURITE movie. One sentence — just speak."',
        scores: { accuracy: 2, affect: 5, technique: 4 },
        target: 'fossilization-path',
        feedback: 'Topic reset removes the anxiety of "getting it right." Low-stakes content = more fluent processing.'
      },
      {
        label: 'Pair her with an encouraging partner',
        desc: 'Pair Elena with Pablo. His enthusiasm is contagious and he\'s not judge-y. "Share holiday stories — 2 minutes each."',
        scores: { accuracy: 2, affect: 5, technique: 4 },
        target: 'transition-moment',
        feedback: 'Strategic pairing builds confidence through low-stakes interaction. Pablo\'s beginner enthusiasm is disarming.'
      },
      {
        label: 'Self-evaluation checklist',
        desc: '"Before you speak, check: Did I use past tense? Did I use the right word? Then just speak."',
        scores: { accuracy: 4, affect: 3, technique: 4 },
        target: 'mid-lesson-crisis',
        feedback: 'Self-monitoring tools transfer responsibility from teacher to learner. Builds autonomous correction habits.'
      }
    ]
  },
  {
    id: 'group-dynamics',
    title: 'Classroom Dynamics: The Participation Gap',
    character: 'Entire Class',
    description: `The drill is over, but the energy imbalance is clear:\n\n<b>Dominant group:</b> Maria, Ahmed (recovered), Pablo — competing for airtime.<br><b>Silent group:</b> Wei, Yuki, Toshi — watching, writing, not speaking.<br><b>Middle group:</b> Elena — trying but hesitating.\n\nYour classroom has split into tiers. The vocal students are improving faster. The quiet ones are falling behind. Your error correction approach unintentionally favored the confident.`,
    context: 'The participation paradox: students who need the most practice often get the least airtime. Active students improve; passive students stagnate. This gap widens daily.',
    choices: [
      {
        label: 'Structured turn-taking system',
        desc: '"New rule: I\'ll call on numbered sticks. Everyone speaks at least twice today."',
        scores: { accuracy: 3, affect: 3, technique: 5 },
        target: 'beginner-struggle',
        feedback: 'Equitable participation structures ensure all voices are heard. Some students resist, but it forces growth.'
      },
      {
        label: 'Small group simultaneous speaking',
        desc: '"In groups of 3, everyone shares for 60 seconds. I\'ll time. Ready — GO."',
        scores: { accuracy: 2, affect: 5, technique: 4 },
        target: 'advanced-student',
        feedback: 'Simultaneous group speaking multiplies practice time by 6x. Low-anxiety format benefits silent students.'
      },
      {
        label: 'Written → oral scaffold',
        desc: '"Write your answer first. Then read it to your partner. Then say it without reading."',
        scores: { accuracy: 4, affect: 4, technique: 5 },
        target: 'mid-lesson-crisis',
        feedback: 'Written preparation before oral production is a low-floor, high-ceiling strategy. Builds confidence systematically.'
      },
      {
        label: 'Acknowledge the imbalance openly',
        desc: '"I notice some of you speak a lot and some speak less. Let\'s set a goal: everyone speaks 3 times this lesson."',
        scores: { accuracy: 3, affect: 4, technique: 3 },
        target: 'the-wrap-up',
        feedback: 'Transparent goal-setting involves students in their own learning. Class-level targets foster collective responsibility.'
      }
    ]
  },
  {
    id: 'teaching-persona',
    title: 'Finding Your Teaching Persona',
    character: 'Your Mentor',
    description: `Your mentor joins you during a quiet moment:\n\n<b>"I\'ve watched you teach 3 lessons now. You\'re technically solid — your drills, your recasts, your scaffolding. But I keep wondering: where is the real you in this classroom? You\'re performing techniques. When will you start teaching as YOURSELF?"</b>\n\nShe\'s asking about your teaching persona — the authentic self that connects with students beyond methodology. Every great teacher has one. Yours is still forming.`,
    context: 'Technique without authenticity creates competent but uninspiring teaching. The transition from "doing teaching" to "being a teacher" is a critical professional milestone.',
    choices: [
      {
        label: '"I\'m not sure who I am as a teacher yet."',
        desc: '"I\'ve been so focused on getting it right that I haven\'t asked myself who I want to BE in the classroom."',
        scores: { accuracy: 4, affect: 5, technique: 4 },
        target: 'mid-lesson-crisis',
        feedback: 'Honest uncertainty is the beginning of authentic identity formation. Reflection now will shape your long-term practice.'
      },
      {
        label: '"I think I\'m the warm-but-structured type."',
        desc: '"I want students to feel safe, but I also want clear expectations. Is that a contradiction?"',
        scores: { accuracy: 3, affect: 5, technique: 4 },
        target: 'the-wrap-up',
        feedback: 'Warm structure is exactly what research recommends. High expectations + high support = optimal learning environment.'
      },
      {
        label: '"How did YOU find your persona?"',
        desc: '"Tell me about your first year. When did you stop performing and start teaching?"',
        scores: { accuracy: 2, affect: 5, technique: 3 },
        target: 'fossilization-path',
        feedback: 'Learning from experienced teachers\' journeys is invaluable. Mentor modeling accelerates identity formation.'
      },
      {
        label: '"I want to be the teacher who asks questions."',
        desc: '"Not the one with all the answers. I want students to discover, not just receive."',
        scores: { accuracy: 3, affect: 4, technique: 5 },
        target: 'transition-moment',
        feedback: 'A Socratic stance shows sophisticated pedagogical understanding. Your students will become autonomous learners.'
      }
    ]
  },
  {
    id: 'transition-moment',
    title: 'The Unexpected Human Moment',
    character: 'Wei (China, A2)',
    description: `During the transition between activities, as students shuffle papers, Wei approaches your desk. She speaks so quietly you almost miss it:\n\n<b>"Teacher... I want to speak. But in my country, students who make mistakes are... not smart. In my head, I am telling myself: don\'t make mistake. But then I cannot speak."</b>\n\nShe\'s offered you a window into her inner world. This is a pivotal human moment — not just a teaching moment. How you respond determines whether she trusts you with her voice.`,
    context: 'Learners from high-stakes educational cultures carry deep-seated beliefs about error = failure. These beliefs must be addressed before any correction technique can work.',
    choices: [
      {
        label: 'Validate and share your philosophy',
        desc: '"Wei — mistakes are how we learn. In this class, mistakes mean you\'re BRAVE. Can we practice together?"',
        scores: { accuracy: 2, affect: 5, technique: 4 },
        target: 'the-wrap-up',
        feedback: 'Explicitly reframing errors as bravery counters her cultural conditioning. Follow up with predictable low-stakes speaking.'
      },
      {
        label: 'Normalize errors physically',
        desc: '"Let me show you something." Write 5 sentences with deliberate errors. "These are from my notes. Can you fix them for me?"',
        scores: { accuracy: 3, affect: 5, technique: 4 },
        target: 'cultural-face',
        feedback: 'Teacher vulnerability modeling — showing your OWN errors — transforms the classroom into a safe space for risk-taking.'
      },
      {
        label: 'Give cultural permission',
        desc: '"In this classroom, mistakes earn you points. Every time you try and make a mistake, you get a sticker. 10 stickers = prize."',
        scores: { accuracy: 2, affect: 5, technique: 3 },
        target: 'mid-lesson-crisis',
        feedback: 'External motivation can bridge the gap while intrinsic beliefs shift. Gamification of risk-taking rewards courage.'
      },
      {
        label: 'Promise predictability',
        desc: '"How about this: I\'ll tell you EXACTLY when I will call on you. You\'ll have 2 minutes to prepare. Deal?"',
        scores: { accuracy: 3, affect: 5, technique: 4 },
        target: 'the-wrap-up',
        feedback: 'Predictable turn-taking reduces anxiety for high-anxiety learners. Knowing WHEN reduces the terror of the unexpected.'
      }
    ]
  },
  {
    id: 'mid-lesson-crisis',
    title: 'Mid-Lesson Reflection',
    character: 'Your Mentor',
    description: `The students have left for a 10-minute break. Your mentor teacher sits beside you.\n\n<b>"Interesting lesson so far. I noticed your correction approach — and students are responding in different ways. Some have gone quiet. Others seem energized. What\'s your instinct telling you right now?"</b>`,
    context: 'This meta-cognitive pause is where real professional growth happens. Your response reveals your emerging teaching philosophy.',
    choices: [
      {
        label: '"I need to correct MORE consistently."',
        desc: '"Students need to know the rules. I\'ll be firmer in the second half."',
        scores: { accuracy: 3, affect: 1, technique: 1 },
        target: 'mentor-intervention',
        feedback: 'Consistency matters, but more correction ≠ better learning. Consider the affective impact you observed.'
      },
      {
        label: '"I need balance — technique mixing."',
        desc: '"Direct correction works for Elena but not for Wei. I need different approaches for different students."',
        scores: { accuracy: 4, affect: 4, technique: 5 },
        target: 'the-wrap-up',
        feedback: 'Differentiation is the hallmark of a reflective practitioner. This shows sophisticated pedagogical thinking.'
      },
      {
        label: '"I should scaffold before expecting accuracy."',
        desc: '"I\'m correcting errors they may not know ARE errors. I should teach the form first."',
        scores: { accuracy: 4, affect: 4, technique: 4 },
        target: 'the-wrap-up',
        feedback: 'You\'re identifying the readiness gap. Presentation-Practice-Production sequencing would help.'
      },
      {
        label: '"I should ask students what they want."',
        desc: '"Elena wants full correction, Yuki wants private, Pablo wants encouragement. I should just ask them."',
        scores: { accuracy: 4, affect: 5, technique: 5 },
        target: 'the-wrap-up',
        feedback: 'Student voice in error correction is underutilized. Asking learners about preferences is advanced practice.'
      }
    ]
  },
  {
    id: 'the-wrap-up',
    title: 'Closing the Lesson',
    character: 'Your Mentor',
    description: `Students are packing up. Your mentor smiles:\n\n<b>"You made mistakes today — but that\'s exactly right. Teaching is learning. One last question: What\'s ONE thing you\'ll do differently tomorrow regarding error correction?"</b>`,
    context: 'Your final reflection consolidates everything you experienced. This determines your emerging Error Correction Teacher Profile.',
    choices: [
      {
        label: '"Plan my strategy before each lesson."',
        desc: '"I\'ll decide in advance: what to correct, what to let go, and for which students."',
        scores: { accuracy: 5, affect: 4, technique: 5 },
        target: 'end-profile',
        feedback: 'Pre-planned correction strategy is the mark of an intentional professional. Well thought out.'
      },
      {
        label: '"Ask students about their preferences."',
        desc: '"I\'ll survey students: How do you like to be corrected? Public? Private? Written?"',
        scores: { accuracy: 4, affect: 5, technique: 5 },
        target: 'end-profile',
        feedback: 'Learner needs analysis is gold-standard differentiation. Your students will thank you.'
      },
      {
        label: '"Record and analyze myself."',
        desc: '"I want to see how often I correct vs. let things pass. I need data on my own teaching."',
        scores: { accuracy: 4, affect: 3, technique: 5 },
        target: 'end-profile',
        feedback: 'Self-reflection through recording is the fastest path to improvement. Treating teaching as a craft.'
      },
      {
        label: '"Ask you to observe me again."',
        desc: '"Can you watch me next week and give specific feedback on my error correction techniques?"',
        scores: { accuracy: 3, affect: 4, technique: 4 },
        target: 'end-profile',
        feedback: 'Seeking ongoing mentorship shows humility and growth mindset. The best teachers never stop learning.'
      }
    ]
  }
];

const END_PROFILE = {
  id: 'end-profile',
  type: 'terminal',
  title: 'Your Error Correction Teacher Profile',
  description: 'Based on your choices across 27 teaching dilemmas, here is your emerging correction style.',
};
