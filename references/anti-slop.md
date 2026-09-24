# Anti-slop

A draft that breaks a hard ban is invalid. Rewrite the line from scratch; swapping words inside the same shape still counts as the same shape.

## 1. Hard bans

### 1.1 Denial then reveal

Any line, or pair of lines, that frames a thing by first denying one description and then giving another.

Banned shapes, in any order or spelling:

- ده مش X. ده Y / دي مش X، دي Y
- X مش Y ... X هو Z (the two-line version, very common in closing blocks)
- مش مجرد X / مش بس X ... ده كمان Y
- هذا ليس X بل Y / ليس فقط X بل Y
- لا نتحدث عن X، نحن نتحدث عن Y
- المشكلة مش في X، المشكلة في Y
- الإجابة مش في X ولا في Y، الإجابة في Z
- not X, but Y / this is not X, this is Y / not just X

**Detector**: if the sentence can be reduced to "not X, but Y", it is banned.

**Allowed**: a plain negative fact with no reveal after it ("محدش رد على الـWhatsApp لحد الصبح"), and the counterweight qualifier "مش معنى الكلام إن..." when it limits the argument instead of setting up a reveal.

#### Rewrite moves

Replace the contrast with the mechanism, the consequence, or the test.

| Slop | Rewrite |
|---|---|
| التوازن مش مهارة وقت / التوازن مهارة اختيار | اللي بيوازن كويس بيقرر كل أسبوع هياخد إيه وهيسيب إيه، والساعات بتيجي بعد القرار |
| الـPortfolio مش معرض لشغلك / الـPortfolio هو أول Proof إنك بتفكر | العميل بيفتح الـPortfolio عشان يعرف إنت بتفكر إزاي، فكل Project محتاج سطرين عن الـBrief والقرار اللي خدته |
| المشكلة مش في المحتوى، المشكلة إن محدش رتب الكلام | لما كل حد في الفريق بيشرح الشركة بجملة مختلفة، المحتوى بيطلع مبعثر مهما كان مكتوب حلو |
| Click على WhatsApp مش Appointment | Click على WhatsApp بتقولك إن فيه حد مهتم، والحجز بيتقاس في الـCRM |
| الساعة مش هي السبب | الساعة Segment بيساعدك تشوف Behavior، والسبب بتدور عليه بعدها |
| ده مش فيلم خيال علمي.. ده السر | (delete the line; open with the actual scene) |

### 1.2 Punctuation

- No em dash (—) or en dash (–) anywhere. Use a new line, a comma, or a colon.
- No period at the end of a line.
- No quotation marks around spoken lines; use a colon and a new line.
- Exclamation marks: at most one per post, and only inside quoted speech.

### 1.3 Banned words

English: unleash, unlock, harness, leverage, optimize, revolutionize, game-changing, cutting-edge, state-of-the-art, next-generation, elevate, innovative, groundbreaking, seamless, effortless, the power of, empower, transform, disrupt, maximize, streamline, synergy, paradigm shift, robust, scalable, best-in-class, world-class, industry-leading, unparalleled, unprecedented.

Arabic equivalents that do the same job: ثوري، نقلة نوعية، لا مثيل له، غير مسبوق، استثنائي، سحري، عصاية سحرية (unless mocked), أطلق العنان، ارتقِ، حلول متكاملة، رائد (about yourself), الأفضل على الإطلاق.

"Optimization" as a technical Google Ads term inside a sentence about bids is acceptable when it is the name of the thing ("أسرع Optimization تعملها ملهاش علاقة بالـBid"). Prefer a plain verb when possible.

### 1.4 Clickbait and guru tone (found in the old archive)

These appeared in older posts and are the clearest signs of the voice going wrong:

- "السر اللي الـ Top 1% بيعملوه ومخبينه عنك"
- "هما مش أذكى منك، ولا بيشتغلوا ساعات أكتر... هما بس اكتشفوا"
- "تخيل لو تقدر تصحى الصبح تلاقي نسخة منك خلصت الشغل"
- "عايز تعرف عملتها إزاي؟.. اعمل Follow"
- "أكبر غلطة بتعملها إنك..." as a cold open
- "النصيحة دي ليك!"
- "حسن النتايج 300% لوحده" (unsourced miracle numbers)
- Hashtag clouds: "#تسويق #بزنس #ريادة_الاعمال"
- Vertical dot ladders (`.` on three lines) used as suspense

### 1.5 Invented proof

No invented numbers, clients, results, research, quotes, testimonials or counts. "+497 Playbook", "+999 حملة ناجحة", "89% من المشترين" all need a source the user gave or a source you verified. If there is none, cut it.

## 2. Soft warnings (fix unless there is a reason)

- Fusha markers outside quotes: سوف، الذي، التي، هذا، هذه، ليس، لكنه، إنّ، لذلك، حيث.
- Guru openers: "خليني أقولك سر", "أهم نصيحة", "صدقني".
- Rhetorical triplets that rhyme ("أسرع، أذكى، أقوى").
- Closing slogan pairs: "اللي بيعمل X بيكسب / واللي بيعمل Y بيخسر". Replace with one plain reflective line.
- "في النهاية" / "في الختام" / "خلاصة القول".
- Lines over 30 words.
- More than one emoji in 12 lines, or an emoji on a serious line.
- Bold, headings, numbered frameworks inside the post.
- Generic "you" advice with no scene ("لازم تهتم بالعميل").

## 3. Critic checklist

Run on every draft after the linter:

1. Read line 1 alone. Would a marketer stop scrolling? Does it name a tension they live with?
2. Is there a scene with real objects (times, metric names, a quoted line)?
3. Is the anchor story verified, with year, place and number? Did we correct the myth where needed?
4. Does the pivot from story to work happen in one explicit line?
5. Are there 2 to 4 work examples from different teams?
6. Is there a counterweight paragraph?
7. Is there a question list or small test the reader can run this week?
8. Does any line reduce to "not X, but Y"? Rewrite it from scratch.
9. Does any line sound written instead of said? Read it aloud in Egyptian; if you would change a word while speaking, change it on the page.
10. Does the close summarise or preach? Cut to one line and the question.
