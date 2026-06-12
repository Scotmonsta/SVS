// ============================================================================
// SILICON VALLEY SIMULATOR — node graph (105 nodes + endings).
//
// Real nodes (1-5, 26, 27, 51, 53, 76, 100-105) transcribe the script faithfully.
// The ~89 former placeholder nodes are rewritten as distinct scenes.
//
// Choice schema (all fields optional except text + routing):
//   text   : button label
//   next   : destination node key  (omit when `roll` is present)
//   req    : gate -> { skill:'clout', min:3 } | { item:'X' } | { money:N }
//   cost   : money delta (negative = spend)
//   time   : minutes elapsed
//   health : health delta (capped at 100)
//   grant  : skill grants -> { smarts:1, clout:1 }
//   add    : inventory item(s) to add (string | string[])
//   remove : inventory item(s) to remove
//   roll   : dice -> { pct, success:{...effects, next}, failure:{...effects, next} }
//            (effects inside success/failure: cost, health, grant, add, remove)
//
// Scene: { title, text, tags:[...], choices:[...] }
// Ending: { title, text, tags, ending:{ type:'win'|'loss', label } }
// ============================================================================

export const NODES = {
  // ---------------------------------------------------------------- TIER A
  node_1: {
    title: 'Salesforce Transit Center Arrival',
    text: "The Greyhound's brakes hiss diesel into the damp fog. Everything you own is in one backpack: three changes of clothes, a cracked iPhone, and a MacBook Pro loaded with a half-finished data framework. $10,000 in the bank, 100 health, and San Francisco's cost of living already ticking against you.",
    tags: ['transit', 'skyline'],
    choices: [
      { text: 'Claim a rented couch at a packed SOMA hacker house and anchor your terminal.', cost: -50, time: 240, next: 'node_2' },
      { text: 'Buy a premium shirt and a ticket to an elite Web3 angel mixer in North Beach.', req: { skill: 'clout', min: 3 }, cost: -100, time: 180, next: 'node_3' },
      { text: "[Strategy] Open your MacBook on a bench and scan your main competitor's server vulnerabilities.", req: { skill: 'smarts', min: 3 }, time: 120, next: 'node_4' },
      { text: 'Board the southbound Caltrain to Palo Alto to scout the engineering labs.', cost: -15, time: 120, next: 'node_5' },
      { text: 'Open Hinge under the terminal lights to find a local creative design partner.', req: { skill: 'leverage', min: 2 }, time: 60, next: 'node_6' },
    ],
  },

  node_2: {
    title: 'SOMA Hacker House Couch',
    text: 'Stale pizza, damp laundry, and the metallic tang of overclocked rigs. You get a sagging sofa under three wall monitors glowing green. In the kitchen, devs argue about compute tokens while chewing espresso beans. Your laptop fan screams under the compile.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Push your unoptimized prototype to a public GitHub repo and blast it on X.', time: 60, roll: { pct: 45, success: { next: 'node_19' }, failure: { next: 'node_11' } } },
      { text: 'Headphones on, twelve hours cleaning out systemic performance loops.', req: { skill: 'smarts', min: 4 }, time: 720, next: 'node_12' },
      { text: 'Slam an energy drink and force a brutal 48-hour continuous sprint.', req: { skill: 'endurance', min: 3 }, cost: -5, time: 2880, health: -35, next: 'node_8' },
      { text: 'Hire a contract junior engineer from Craigslist to assemble REST endpoints.', cost: -2000, time: 360, next: 'node_18' },
      { text: 'Step out to invest in yourself — the library, a seminar, the gym.', time: 20, next: 'node_dev1' },
      { text: 'Shut the screen, backpack as a pillow, sleep eight hours to recover.', cost: -50, time: 480, health: 40, next: 'node_10' },
    ],
  },

  node_3: {
    title: 'North Beach Tech Mixer',
    text: 'Subwoofer bass through the brick floor. Neon-purple light over a crowd in fleece vests trading VC jargon. You step in at the back, looking down at your travel-worn clothes.',
    tags: ['mixer'],
    choices: [
      { text: 'Buy a pre-seed angel a drink and pitch your prototype as a finished platform.', req: { skill: 'clout', min: 4 }, cost: -30, time: 120, next: 'node_25' },
      { text: 'Sink half your savings into a sweaty founder’s unverified crypto token.', cost: -5000, time: 60, roll: { pct: 30, success: { cost: 40000, next: 'node_22' }, failure: { next: 'node_2' } } },
      { text: 'Pay the bar tab of exhausted Stanford CS grads to recruit them.', req: { skill: 'leverage', min: 3 }, cost: -150, time: 180, next: 'node_14' },
      { text: 'Recognize a Stripe UI/UX designer you matched with; talk hiking, not work.', cost: -25, time: 180, add: 'Partner (Stripe Designer)', next: 'node_6' },
      { text: 'Slip to the back room and enter bar pub trivia to clear your head.', cost: -20, time: 180, roll: { pct: 50, success: { cost: 500, next: 'node_15' }, failure: { health: 10, next: 'node_3' } } },
    ],
  },

  node_4: {
    title: 'Transit Wi-Fi Scan',
    text: "Diagnostic traces on public trial logs reveal your relational-database rival, BaseGrid, shipped a buggy update yesterday. Their forums are full of furious complaints about latency under load. A window has opened.",
    tags: ['transit'],
    choices: [
      { text: "[Exploitation Hack] Write a framework wrapper that explicitly targets BaseGrid's loopholes.", req: { skill: 'smarts', min: 4 }, time: 600, next: 'node_12' },
      { text: 'Scrape the emails of BaseGrid’s angriest enterprise users into a sales file.', time: 180, next: 'node_20' },
      { text: 'Post a data-backed teardown thread on why BaseGrid fails under concurrency.', req: { skill: 'clout', min: 3 }, time: 240, next: 'node_19' },
      { text: 'Pack up and ride to Palo Alto to find hardware researchers near Stanford.', cost: -15, time: 120, next: 'node_5' },
      { text: 'Fold the laptop, backpack pillow, sleep on the terminal bench to recover.', time: 360, health: 20, next: 'node_1' },
    ],
  },

  node_5: {
    title: 'Palo Alto Caltrain Platform',
    text: 'Leafy suburban arches, eucalyptus, and expensive venture capital in the air. Stanford researchers and angels talk shop outside coffee shops. This is the ecosystem’s capital layer.',
    tags: ['park_campus'],
    choices: [
      { text: 'Walk into the Stanford CS library and write high-frequency endpoints.', time: 360, next: 'node_9' },
      { text: 'Pitch passing CS grads on the Stanford Oval lawn.', cost: -100, time: 240, roll: { pct: 50, success: {  next: 'node_14' }, failure: { next: 'node_5' } } },
      { text: 'Buy an espresso and post up beside local seed investors.', req: { skill: 'clout', min: 4 }, cost: -12, time: 120, next: 'node_11' },
      { text: 'Pre-order a $10,000 liquid-cooled home server rig on your phone.', cost: -10000, time: 60, next: 'node_5' },
      { text: 'Sprint the brutal Stanford Dish ridge to train your lungs.', time: 120, health: -30, grant: { endurance: 1 }, next: 'node_7' },
    ],
  },
  node_6: {
    title: 'The Hinge Date — Dolores Park',
    text: 'You meet the Stripe product designer on a picnic blanket above the city. The conversation skips the usual founder posturing and lands somewhere real — design, trail maps, the way fog spills over Twin Peaks.',
    tags: ['hinge_phone'],
    choices: [
      { text: 'Pitch a genuine co-founder partnership over tacos.', cost: -40, time: 120, add: 'Partner (Stripe Designer)', next: 'node_16' },
      { text: 'Keep it casual and head back to the grind at the hacker house.', time: 60, next: 'node_2' },
      { text: 'Talk your way into an intro to their angel-investor mentor.', req: { skill: 'clout', min: 3 }, time: 90, next: 'node_25' },
      { text: 'Adopt a rescue Golden Retriever puppy from the SPCA nearby (-).', cost: -500, time: 120, health: 10, add: 'Loyal Dog', next: 'node_10' },
      { text: 'Rest on the grass and recover before the next sprint.', time: 180, health: 20, next: 'node_5' },
    ],
  },

  node_7: {
    title: 'Dish Trail Summit',
    text: 'Lungs burning, you crest the Dish ridge as the radio telescope hums below. The whole peninsula spreads out — Sand Hill Road to the west, your future somewhere in that haze. Pain, but clarity.',
    tags: ['trail'],
    choices: [
      { text: 'Sprint the descent too — push your conditioning to the edge.', time: 90, health: -20, grant: { endurance: 1 }, next: 'node_9' },
      { text: 'Cool down and code trailhead notes into your product backlog.', time: 120, next: 'node_12' },
      { text: 'Call the Stripe designer to debrief your plan.', req: { item: 'Partner (Stripe Designer)' }, time: 60, next: 'node_16' },
      { text: 'Caltrain back to SOMA to keep building.', cost: -15, time: 120, next: 'node_2' },
      { text: 'Rest in the shade and recover.', time: 120, health: 30, next: 'node_5' },
    ],
  },

  node_8: {
    title: '48-Hour Crunch Aftermath',
    text: 'Two days gone in a blur of energy drinks and green text. The backend integrations actually compile — but your hands shake and the room tilts when you stand. The product works. Your body is the bug now.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Ship the working build to a private beta cohort and gather telemetry.', time: 180, next: 'node_19' },
      { text: 'Push straight into a second sprint on the analytics layer.', req: { skill: 'endurance', min: 4 }, time: 720, health: -35, next: 'node_12' },
      { text: 'Collapse onto the couch and sleep it off — hard.', time: 600, health: 50, next: 'node_10' },
      { text: 'Take the build to a North Beach mixer to find a first customer.', cost: -50, time: 180, next: 'node_3' },
      { text: 'Hire your Craigslist contractor to harden it while you recover.', cost: -2000, time: 240, health: 10, next: 'node_18' },
    ],
  },

  node_9: {
    title: 'Stanford CS Library',
    text: 'Hushed carrels, the smell of old paper and new silicon. Surrounded by thesis printouts on distributed systems, you write the cleanest endpoints of your life. A grad student peers over your shoulder, intrigued.',
    tags: ['library'],
    choices: [
      { text: 'Pair-program with the curious grad student and pitch joining you.', time: 240, roll: { pct: 55, success: { add: 'Lead CS Researcher', next: 'node_14' }, failure: { next: 'node_9' } } },
      { text: 'Architect a benchmark that humiliates BaseGrid on paper.', req: { skill: 'smarts', min: 4 }, time: 300, next: 'node_12' },
      { text: 'Walk to University Ave to post up near seed investors.', cost: -12, time: 90, next: 'node_11' },
      { text: 'Submit a YC application from the library Wi-Fi.', time: 120, next: 'node_23' },
      { text: 'Run the Dish trail to clear your head.', time: 120, health: -30, next: 'node_7' },
    ],
  },

  node_10: {
    title: 'Recovered & Restless',
    text: 'You wake clear-eyed for the first time in days. Light through grimy windows, a fresh terminal cursor blinking. The runway is shorter but your head is sharp. Time to convert rest into progress.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Invest a day in yourself — the library, a seminar, the gym.', time: 30, next: 'node_dev1' },
      { text: 'Open the analytics on your beta — find the one feature people actually use.', time: 180, next: 'node_17' },
      { text: 'Draft a cold outbound campaign to BaseGrid’s angry users.', time: 120, next: 'node_20' },
      { text: 'Record a punchy product demo and post it to X.', req: { skill: 'clout', min: 3 }, time: 120, next: 'node_19' },
      { text: 'Take the Caltrain to scout Palo Alto talent.', cost: -15, time: 120, next: 'node_5' },
      { text: 'Text your partner to plan the next phase together.', req: { item: 'Partner (Stripe Designer)' }, time: 60, next: 'node_16' },
    ],
  },

  node_11: {
    title: 'The Quiet Failure',
    text: 'The launch landed with a thud — three stars, one upvote, a single comment asking if the project is abandoned. University Ave hums on, indifferent. Failure is just data you have not parsed yet.',
    tags: ['cafe'],
    choices: [
      { text: 'Interview the one user who churned and rebuild around the answer.', time: 180, next: 'node_17' },
      { text: 'Tear your own architecture apart and find the real bottleneck.', req: { skill: 'smarts', min: 4 }, time: 300, next: 'node_12' },
      { text: 'Drown it in espresso and try a fresh angle at the mixer tonight.', cost: -12, time: 120, next: 'node_3' },
      { text: 'Pre-seed pitch attempt — you have enough to show. Head to Sand Hill.', req: { skill: 'clout', min: 4 }, time: 180, next: 'node_26' },
      { text: 'Rest. Walk the long way back to SOMA on foot.', time: 240, health: 20, next: 'node_2' },
    ],
  },

  node_12: {
    title: 'The Deep Refactor',
    text: 'Hours dissolve into clean diffs. You strip three layers of accidental complexity and the benchmark graph bends the right way — concurrency holds where BaseGrid buckles. This is a real product now.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Publish the benchmark teardown — let the numbers do the marketing.', req: { skill: 'clout', min: 3 }, time: 180, next: 'node_19' },
      { text: 'Onboard a design partner to make it usable, not just fast.', req: { item: 'Partner (Stripe Designer)' }, time: 240, next: 'node_16' },
      { text: 'Add the killer feature: live schema migration with zero downtime.', req: { skill: 'smarts', min: 5 }, time: 600, next: 'node_24' },
      { text: 'You have the metrics. Book the Sand Hill Road pitch.', req: { money: 200 }, time: 120, next: 'node_26' },
      { text: 'Sleep — your eyes are sandpaper.', time: 480, health: 40, next: 'node_10' },
    ],
  },

  node_13: {
    title: 'Indie Hackers Podcast Invite',
    text: 'A scrappy founder podcast wants you on this week — your BaseGrid teardown made the rounds. Forty minutes of audience, if you can be charming and not just correct.',
    tags: ['cafe'],
    choices: [
      { text: 'Tell the founding story with swagger and drop your landing page.', req: { skill: 'clout', min: 3 }, time: 120, roll: { pct: 72, success: { cost: 1500, next: 'node_19' }, failure: { next: 'node_11' } } },
      { text: 'Stay technical and win over the engineers in the audience.', time: 120, next: 'node_17' },
      { text: 'Pitch for a co-founder live on air.', time: 90, next: 'node_6' },
      { text: 'Decline — protect your build time.', time: 30, next: 'node_12' },
      { text: 'Rest your voice and recover.', time: 120, health: 20, next: 'node_10' },
    ],
  },

  node_14: {
    title: 'Onboarding the Stanford Grads',
    text: 'Two exhausted, brilliant CS grads sit across from you in a cramped cafe, weighing your unbacked dream against FAANG offers. Equity, mission, and your nerve are the only currencies you have.',
    tags: ['cafe'],
    choices: [
      { text: 'Hardball the equity split in your favor and still close them.', req: { skill: 'leverage', min: 3 }, time: 180, add: 'Lead CS Researcher', next: 'node_24' },
      { text: 'Offer generous equity and a real mission — earn loyalty.', cost: -200, time: 120, add: 'Lead CS Researcher', next: 'node_17' },
      { text: 'Take them to the mixer to feel the momentum.', cost: -50, time: 180, next: 'node_3' },
      { text: 'You have a team and a product. Book Sand Hill Road.', req: { skill: 'clout', min: 4 }, time: 120, next: 'node_26' },
      { text: 'Celebrate, then crash hard.', cost: -60, time: 300, health: 30, next: 'node_10' },
    ],
  },

  node_15: {
    title: 'Trivia Night Winnings',
    text: 'You crushed the lightning round on obscure protocol history and walked out $500 richer with a buzzing table of new contacts. Small money, but the confidence is worth more.',
    tags: ['mixer'],
    choices: [
      { text: 'Parlay the new contacts into a warm angel intro.', req: { skill: 'clout', min: 3 }, time: 120, next: 'node_25' },
      { text: 'Buy the table a round and recruit the sharpest player.', cost: -80, time: 120, next: 'node_14' },
      { text: 'Pocket the cash and get back to building.', time: 60, next: 'node_12' },
      { text: 'Swipe Hinge while the social high lasts.', req: { skill: 'leverage', min: 2 }, time: 60, next: 'node_6' },
      { text: 'Call it a win and rest.', time: 180, health: 20, next: 'node_10' },
    ],
  },

  node_16: {
    title: 'Co-Founder Sync',
    text: 'Your Stripe designer partner sketches a UI that finally makes your raw speed feel human. Two laptops, one whiteboard, the first time the company feels like more than one tired person.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Ship a polished beta together and chase product-market fit.', time: 240, next: 'node_17' },
      { text: 'Co-present at a demo night to build a waitlist.', req: { skill: 'clout', min: 3 }, time: 180, next: 'node_19' },
      { text: 'Adopt a rescue Golden Retriever puppy to anchor the chaos (-$500).', cost: -500, time: 120, health: 10, add: 'Loyal Dog', next: 'node_10' },
      { text: 'With a real team, go raise. Sand Hill Road.', req: { skill: 'clout', min: 4 }, time: 120, next: 'node_26' },
      { text: 'Cook dinner together and actually rest.', cost: -40, time: 180, health: 30, next: 'node_10' },
    ],
  },

  node_17: {
    title: 'First Whiff of Product-Market Fit',
    text: 'A handful of indie developers start tweeting your tool without being asked. Daily actives tick up. The retention curve, for the first time, flattens instead of falling off a cliff.',
    tags: ['cafe'],
    choices: [
      { text: 'Turn the love into a referral loop and ride it.', req: { skill: 'adaptability', min: 3 }, time: 180, next: 'node_20' },
      { text: 'Write the deep technical post your fans keep asking for.', req: { skill: 'smarts', min: 4 }, time: 240, next: 'node_19' },
      { text: 'Use the traction as proof. Pitch Sand Hill Road.', req: { money: 100 }, time: 120, next: 'node_26' },
      { text: 'Stay lean and bootstrap toward profitability instead.', time: 180, next: 'node_24' },
      { text: 'Take a day to invest in your skills — study, workshops, training.', time: 20, next: 'node_dev1' },
      { text: 'Step away for a hike before you burn out.', time: 180, health: 30, next: 'node_7' },
    ],
  },

  node_18: {
    title: 'Contractor Hands Off Buggy REST',
    text: 'Your Craigslist contractor delivers endpoints that technically respond — and leak memory under any real load. Cheap work, expensive cleanup. A lesson in the true cost of "cheap."',
    tags: ['hacker_house'],
    choices: [
      { text: 'Rip it out and rewrite it properly yourself overnight.', req: { skill: 'smarts', min: 4 }, time: 480, health: -20, next: 'node_12' },
      { text: 'Pay a second, vetted contractor to fix the first one (-$3,000).', cost: -3000, time: 240, next: 'node_17' },
      { text: 'Ship it anyway and watch the support fire.', time: 120, roll: { pct: 35, success: { next: 'node_19' }, failure: { health: -10, next: 'node_11' } } },
      { text: 'Document the failure publicly — engineers respect honesty.', req: { skill: 'clout', min: 3 }, time: 120, next: 'node_13' },
      { text: 'Walk away from the keyboard and reset.', time: 180, health: 30, next: 'node_10' },
    ],
  },

  node_19: {
    title: 'The Viral Launch',
    text: 'The post detonates. Your repo trends, the landing page buckles under traffic, and a thousand developers want in by lunch. Attention is oxygen — and it is also a clock.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Convert the surge into paying signups before it fades.', req: { skill: 'adaptability', min: 3 }, time: 180, cost: 2000, next: 'node_17' },
      { text: 'Frantically scale the backend so it survives the spike.', req: { skill: 'smarts', min: 4 }, time: 240, health: -20, next: 'node_24' },
      { text: 'Ride the moment straight into an investor pitch.', req: { skill: 'clout', min: 4 }, time: 120, next: 'node_26' },
      { text: 'A competitor, watching the surge, DMs you an acqui-hire offer.', time: 60, next: 'node_21' },
      { text: 'Servers are holding. Sleep before the next push.', time: 360, health: 40, next: 'node_10' },
    ],
  },

  node_20: {
    title: 'Outbound Sales File',
    text: "A spreadsheet of BaseGrid's most furious enterprise users glows on your screen — names, pain points, renewal dates. This is a pipeline if you have the nerve to work it.",
    tags: ['cafe'],
    choices: [
      { text: 'Run a tight cold-email sequence and book three demos.', req: { skill: 'adaptability', min: 3 }, time: 180, roll: { pct: 72, success: { cost: 5000, next: 'node_17' }, failure: { next: 'node_11' } } },
      { text: 'Cold-call the biggest fish directly and charm the buyer.', req: { skill: 'clout', min: 4 }, time: 120, next: 'node_25' },
      { text: 'Hand the file to a partner to systematize.', req: { item: 'Partner (Stripe Designer)' }, time: 90, next: 'node_16' },
      { text: 'Use the demand signal as proof and raise.', req: { money: 100 }, time: 120, next: 'node_26' },
      { text: 'Pace yourself — rest before the calls.', time: 120, health: 20, next: 'node_10' },
    ],
  },

  node_21: {
    title: 'Acqui-hire Bait',
    text: 'A mid-size competitor slides into your DMs: come run a team here, bring your repo, forget the stress. A soft landing — or a quiet surrender of everything you are building toward.',
    tags: ['office'],
    choices: [
      { text: 'Use their interest to manufacture leverage for a real raise.', req: { skill: 'leverage', min: 3 }, time: 120, next: 'node_26' },
      { text: 'Politely decline and double down on independence.', time: 60, next: 'node_24' },
      { text: 'Take the meeting to learn their roadmap, commit to nothing.', time: 120, next: 'node_20' },
      { text: 'Counter: offer to acquire THEM someday. Walk out grinning.', req: { skill: 'clout', min: 4 }, time: 60, next: 'node_3' },
      { text: 'Sleep on it.', time: 360, health: 30, next: 'node_10' },
    ],
  },

  node_22: {
    title: 'The Token Gamble Paid Off',
    text: 'Against every reasonable odd, the unverified token mooned and your allocation cleared at +$40,000. Found money. The kind that funds a runway — or burns a hole in your judgment.',
    tags: ['mixer'],
    choices: [
      { text: 'Bank it as runway and get disciplined about the product.', time: 60, next: 'node_12' },
      { text: 'Reinvest a slice into paid acquisition experiments.', req: { skill: 'adaptability', min: 3 }, cost: -8000, time: 120, next: 'node_20' },
      { text: 'Hire the Stanford grads now that you can afford them.', cost: -200, time: 120, add: 'Lead CS Researcher', next: 'node_14' },
      { text: 'Flex the win at the mixer to attract a real angel.', req: { skill: 'clout', min: 3 }, cost: -30, time: 120, next: 'node_25' },
      { text: 'Treat yourself to a real meal and rest.', cost: -100, time: 180, health: 40, next: 'node_10' },
    ],
  },

  node_23: {
    title: 'YC Application Limbo',
    text: 'The application is submitted, the dream interview pending. Validation from the most famous accelerator on earth would change everything — but you cannot eat a maybe. The runway keeps shrinking.',
    tags: ['cafe'],
    choices: [
      { text: 'Record a standout one-minute founder video to boost your odds.', req: { skill: 'clout', min: 3 }, time: 120, roll: { pct: 68, success: { cost: 5000, next: 'node_26' }, failure: { next: 'node_11' } } },
      { text: 'Stop waiting — go raise on your own terms at Sand Hill.', req: { skill: 'clout', min: 4 }, time: 120, next: 'node_26' },
      { text: 'Build relentlessly while you wait.', time: 240, next: 'node_24' },
      { text: 'Network your way to a YC alum for a referral.', time: 120, next: 'node_3' },
      { text: 'Rest — the email will come or it will not.', time: 180, health: 20, next: 'node_10' },
    ],
  },

  node_24: {
    title: 'The Self-Funded Edge',
    text: 'Zero-downtime schema migration ships. No competitor has it. Your churn drops to near zero and a few customers quietly upgrade. You could raise — or you could prove you never needed to.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Take the strong hand into the Sand Hill boardroom.', time: 120, next: 'node_26' },
      { text: 'Refuse VC entirely and scale on revenue alone.', req: { skill: 'leverage', min: 4 }, time: 180, next: 'node_32' },
      { text: 'Hire your researchers and formalize the team.', cost: -200, time: 120, add: 'Lead CS Researcher', next: 'node_14' },
      { text: 'Bring on the design partner to productize hard.', req: { item: 'Partner (Stripe Designer)' }, time: 180, next: 'node_16' },
      { text: 'Invest a day in your own development.', time: 20, next: 'node_dev1' },
      { text: 'Bank the momentum and rest.', time: 240, health: 40, next: 'node_10' },
    ],
  },

  node_25: {
    title: 'The Angel Pitch',
    text: 'A prominent pre-seed angel leans against the bar, half-listening, fully judging. You have ninety seconds and one drink to turn a stranger into your first believer.',
    tags: ['mixer'],
    choices: [
      { text: 'Sell the vision so hard he asks where to wire the check.', req: { skill: 'clout', min: 4 }, time: 90, roll: { pct: 78, success: { cost: 25000, next: 'node_26' }, failure: { next: 'node_3' } } },
      { text: 'Show the live benchmark and let the product close him.', req: { skill: 'smarts', min: 4 }, time: 120, next: 'node_26' },
      { text: 'Ask for an intro to his VC fund instead of a check.', time: 60, next: 'node_26' },
      { text: 'Overplay it and watch him drift away.', time: 60, next: 'node_3' },
      { text: 'Pocket his card and regroup.', time: 60, health: 10, next: 'node_10' },
    ],
  },

  node_26: {
    title: 'Sand Hill Road Boardroom (The Institutional Pitch)',
    text: 'Sun through glass over a massive redwood table. Three tier-one partners study your metrics in silence, then slide a $150,000 pre-seed sheet across — at a predatory dilution.',
    tags: ['office'],
    choices: [
      { text: 'Sign now to secure runway, handing over substantial control.', cost: 150000, time: 60, next: 'node_28' },
      { text: 'Push it back and demand a $250,000 package.', req: { skill: 'clout', min: 4 }, time: 120, roll: { pct: 68, success: { cost: 250000, next: 'node_29' }, failure: { next: 'node_32' } } },
      { text: 'Run a live high-volume concurrency sim on their projector.', req: { skill: 'smarts', min: 5 }, time: 60, cost: 250000, next: 'node_29' },
      { text: 'Step out and DM a corporate dev scout at Oracle on LinkedIn.', time: 60, next: 'node_31' },
      { text: 'Reject their check. Your equity is worth more. Walk out.', time: 60, next: 'node_32' },
    ],
  },

  node_27: {
    title: 'SOMA Studio Loft Office Hub',
    text: 'You spend $40,000 of secured capital on a concrete-aesthetic SOMA studio loft. Floor-to-ceiling windows over the downtown highway. Your brand finally has a base of operations.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Code an optimized microservice compression layer.', time: 480, next: 'node_28' },
      { text: 'Host a $100 micro-dinner for local engineers.', cost: -100, time: 240, next: 'node_38' },
      { text: 'Cancel dead SaaS trials and reclaim cash.', time: 120, cost: 500, next: 'node_30' },
      { text: 'Invite your Stripe partner to move into the loft.', req: { item: 'Partner (Stripe Designer)' }, time: 120, add: 'Loft Cohabitant', next: 'node_43' },
      { text: 'Buy a ring and propose right here in the loft (-$8,000).', req: { item: 'Partner (Stripe Designer)' }, cost: -8000, time: 60, roll: { pct: 60, success: { add: ['Spouse (Stripe Designer)', 'Wedding Ring'], remove: 'Partner (Stripe Designer)', next: 'node_47' }, failure: { next: 'node_48' } } },
    ],
  },

  // ---------------------------------------------------------------- TIER B (post-seed)
  node_28: {
    title: 'Venture-Backed: Day One',
    text: 'The wire clears. Suddenly you have a runway, a cap table, and investors who expect a graph that goes up and to the right. Pressure transmutes into possibility — and a quarterly board meeting.',
    tags: ['office'],
    choices: [
      { text: 'Buy a SOMA Studio Loft as a real HQ (-$40,000).', req: { money: 40000 }, cost: -40000, time: 240, add: 'SOMA Loft Key', next: 'node_27' },
      { text: 'Stand up SOC2 compliance before chasing enterprise.', time: 240, next: 'node_34' },
      { text: 'Launch a pricing experiment across cohorts.', req: { skill: 'adaptability', min: 3 }, time: 180, next: 'node_37' },
      { text: 'Run a first paid enterprise pilot.', time: 240, roll: { pct: 60, success: { cost: 50000, next: 'node_40' }, failure: { next: 'node_41' } } },
      { text: 'Hire and rest the team after the raise.', cost: -5000, time: 360, health: 30, next: 'node_30' },
    ],
  },
  node_29: {
    title: 'The Upsized Round',
    text: 'You squeezed a $250,000 sheet out of partners who expected to lowball you. More fuel, more expectations, and a board that now believes you can negotiate. Use the credibility.',
    tags: ['office'],
    choices: [
      { text: 'Buy the SOMA loft HQ and hire aggressively (-$40,000).', req: { money: 40000 }, cost: -40000, time: 240, add: 'SOMA Loft Key', next: 'node_27' },
      { text: 'Negotiate a flagship design-partner enterprise contract.', req: { skill: 'leverage', min: 3 }, time: 240, cost: 80000, next: 'node_40' },
      { text: 'Invest in a security hardening sprint.', time: 240, next: 'node_34' },
      { text: 'Push toward the Series A milestone.', req: { money: 100000 }, time: 180, next: 'node_51' },
      { text: 'Stabilize the team and recover.', cost: -5000, time: 360, health: 30, next: 'node_30' },
    ],
  },
  node_30: {
    title: 'Operations & Runway',
    text: 'Spreadsheets, burn rate, and the unglamorous machinery of a real company. The fires are small today. That is exactly when you build the systems that prevent the big ones.',
    tags: ['office'],
    choices: [
      { text: 'Invest in professional development — courses, coaching, training.', time: 30, next: 'node_dev2' },
      { text: 'Instrument everything — dashboards for burn, churn, and uptime.', time: 180, next: 'node_37' },
      { text: 'Open a scrappy second acquisition channel.', req: { skill: 'adaptability', min: 3 }, time: 180, next: 'node_42' },
      { text: 'Court a flagship enterprise pilot.', time: 240, roll: { pct: 60, success: { cost: 60000, next: 'node_40' }, failure: { next: 'node_41' } } },
      { text: 'You have the metrics for Series A.', req: { money: 120000 }, time: 180, next: 'node_51' },
      { text: 'Force a real day off.', time: 480, health: 40, next: 'node_38' },
    ],
  },
  node_31: {
    title: 'Oracle Corporate Development',
    text: 'A polished M&A scout emails back within the hour. Big-company interest is intoxicating — and a fork in the road. This path trades the moonshot for certainty and a very large check.',
    tags: ['office'],
    choices: [
      { text: 'Run a tight process to drive the acquisition price up.', req: { skill: 'leverage', min: 4 }, time: 240, next: 'node_35' },
      { text: 'Build leverage first — get the product undeniable, then sell.', time: 240, next: 'node_34' },
      { text: 'Take the early lowball meeting to learn their appetite.', time: 120, next: 'node_35' },
      { text: 'Reconsider — maybe you should raise instead.', time: 60, next: 'node_28' },
      { text: 'Rest and weigh the decision.', time: 240, health: 30, next: 'node_30' },
    ],
  },
  node_32: {
    title: 'Bootstrap Defiance',
    text: 'You walked out of Sand Hill with your equity intact and your pride inflamed. No board, no dilution — just you, the revenue, and the terrifying freedom of owning the whole thing.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Convert power users into annual prepaid contracts.', req: { skill: 'leverage', min: 3 }, time: 240, cost: 30000, next: 'node_39' },
      { text: 'Grow purely on word-of-mouth and ruthless margins.', time: 240, cost: 15000, next: 'node_39' },
      { text: 'Build the feature moat deeper.', req: { skill: 'smarts', min: 4 }, time: 360, next: 'node_24' },
      { text: 'Buy the loft outright from revenue (-$40,000).', req: { money: 40000 }, cost: -40000, time: 240, add: 'SOMA Loft Key', next: 'node_27' },
      { text: 'Protect your health on the solo grind.', time: 360, health: 40, next: 'node_30' },
    ],
  },
  node_33: {
    title: 'The Puppy Recruiting Hack',
    text: 'Your Golden Retriever does what no pitch deck could — a circle of Stanford grads melts, and suddenly you are not a desperate founder but the cool one with the dog. Two of them ask about equity.',
    tags: ['park_campus'],
    choices: [
      { text: 'Close the best engineer on the spot.', time: 120, add: 'Lead CS Researcher', next: 'node_28' },
      { text: 'Throw a lawn recruiting event and sign three.', req: { skill: 'clout', min: 3 }, cost: -300, time: 180, add: 'Lead CS Researcher', next: 'node_40' },
      { text: 'Walk the dog and the partner — the good life beckons.', req: { item: 'Partner (Stripe Designer)' }, time: 120, health: 20, next: 'node_43' },
      { text: 'Caltrain back to ship product.', cost: -15, time: 120, next: 'node_28' },
      { text: 'Rest on the Oval in the sun.', time: 120, health: 30, next: 'node_30' },
    ],
  },
  node_34: {
    title: 'SOC2 & Security Hardening',
    text: 'Auditors, pen-testers, and a checklist that never ends. Boring, expensive, and the single thing standing between you and contracts with companies that have legal departments.',
    tags: ['office'],
    choices: [
      { text: 'Architect security so airtight it becomes a sales feature.', req: { skill: 'smarts', min: 4 }, time: 360, next: 'node_40' },
      { text: 'Pass the audit and chase a regulated-industry pilot.', cost: -8000, time: 240, roll: { pct: 65, success: { cost: 90000, next: 'node_40' }, failure: { next: 'node_41' } } },
      { text: 'Leverage compliance into the Series A story.', req: { money: 120000 }, time: 180, next: 'node_51' },
      { text: 'Sell the hardened product to Oracle’s interest.', time: 120, next: 'node_35' },
      { text: 'Recover after the audit grind.', time: 300, health: 30, next: 'node_30' },
    ],
  },
  node_35: {
    title: 'The Acquisition Table',
    text: 'Oracle’s directors lay out an asset-purchase sheet. The number has a lot of zeros. Signing means freedom and comfort; it also means your name becomes a footnote in someone else’s stack.',
    tags: ['office'],
    choices: [
      { text: 'Hold firm for a premium — they want this more than you need it.', req: { skill: 'leverage', min: 4 }, time: 180, next: 'node_101' },
      { text: 'Accept the clean $15M buyout and walk into the sunset.', req: { skill: 'leverage', min: 2 }, time: 120, next: 'node_101' },
      { text: 'Get cold feet — pull the deal and raise instead.', time: 120, next: 'node_28' },
      { text: 'Counter so hard they walk; keep building independently.', time: 120, next: 'node_32' },
      { text: 'Sleep on the life-changing decision.', time: 360, health: 30, next: 'node_30' },
    ],
  },
  node_36: {
    title: 'Indie Growth Engine',
    text: 'No investors, no permission, just a product developers love and a bank balance that quietly climbs each month. Unsexy, durable, yours. The compounding is doing the work now.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Reinvest profits into the one feature everyone begs for.', req: { skill: 'smarts', min: 4 }, time: 240, cost: 40000, next: 'node_39' },
      { text: 'Add a self-serve tier that prints money while you sleep.', req: { skill: 'adaptability', min: 4 }, time: 180, cost: 60000, next: 'node_39' },
      { text: 'Keep margins ruthless and ride the lifestyle path.', time: 180, cost: 25000, next: 'node_39' },
      { text: 'Marry the life you are building.', req: { item: 'Partner (Stripe Designer)' }, time: 120, next: 'node_27' },
      { text: 'Take a real vacation — you earned it.', cost: -3000, time: 600, health: 50, next: 'node_30' },
    ],
  },
  node_37: {
    title: 'Pricing Experiment Results',
    text: 'The cohort data is in. Usage-based pricing converts better but scares finance teams; flat enterprise tiers close slower but bigger. The right answer is hiding in the numbers.',
    tags: ['office'],
    choices: [
      { text: 'Model the optimal hybrid and roll it out.', req: { skill: 'smarts', min: 4 }, time: 180, cost: 40000, next: 'node_40' },
      { text: 'Bet on enterprise tiers and chase a flagship logo.', time: 240, roll: { pct: 60, success: { cost: 120000, next: 'node_40' }, failure: { next: 'node_41' } } },
      { text: 'Bootstrap-friendly: lean into self-serve revenue.', time: 180, next: 'node_36' },
      { text: 'Strong unit economics — push to Series A.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Rest after the analysis marathon.', time: 240, health: 30, next: 'node_30' },
    ],
  },
  node_38: {
    title: 'The Builder Dinner',
    text: 'Twelve engineers around your concrete loft, cheap wine in good glasses, the kind of conversation that turns into hires and partnerships at 1am. This is how scenes — and companies — get built.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Recruit the standout engineer who would not stop asking great questions.', time: 120, add: 'Lead CS Researcher', next: 'node_40' },
      { text: 'Turn the dinner into a recurring salon that builds your brand.', req: { skill: 'clout', min: 4 }, cost: -200, time: 180, next: 'node_42' },
      { text: 'Pitch a guest who happens to run corporate dev at a giant.', time: 90, next: 'node_31' },
      { text: 'Toast the partner who made the loft a home.', req: { item: 'Partner (Stripe Designer)' }, time: 120, health: 20, next: 'node_43' },
      { text: 'Clean up and crash.', time: 240, health: 30, next: 'node_30' },
    ],
  },
  node_39: {
    title: 'Profitable & Free',
    text: 'The dashboards tell a quiet, beautiful story: revenue exceeds burn, every month, with no one to answer to. You could grow forever like this. The lifestyle empire is within reach.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Lock in the bootstrapped lifestyle outcome.', req: { money: 2000000 }, time: 120, next: 'node_102' },
      { text: 'Scale revenue toward a nine-figure indie business.', req: { skill: 'leverage', min: 4 }, time: 240, cost: 500000, next: 'node_39' },
      { text: 'Reinvest into a bigger growth engine.', req: { skill: 'adaptability', min: 4 }, time: 180, cost: 200000, next: 'node_39' },
      { text: 'Buy a Palo Alto home from profit (-$1,800,000).', req: { money: 180000 }, cost: -180000, time: 240, add: 'Suburban Home Key', next: 'node_45' },
      { text: 'Live well and recover.', cost: -5000, time: 600, health: 50, next: 'node_36' },
    ],
  },
  node_40: {
    title: 'First Enterprise Logo',
    text: 'A real company with a real logo signs a real contract. The revenue is meaningful, the validation enormous, and the implied obligation — uptime, support, trust — suddenly very heavy.',
    tags: ['office'],
    choices: [
      { text: 'Use the logo to unlock the Series A round.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Build the reliability to never lose this customer.', req: { skill: 'smarts', min: 4 }, time: 300, next: 'node_44' },
      { text: 'Stack more logos before raising.', time: 240, roll: { pct: 65, success: { cost: 150000, next: 'node_44' }, failure: { next: 'node_41' } } },
      { text: 'Bootstrap on the strength of enterprise revenue.', time: 180, cost: 100000, next: 'node_39' },
      { text: 'Invest in professional development — courses, coaching, training.', time: 20, next: 'node_dev2' },
      { text: 'Celebrate with the team, then rest.', cost: -3000, time: 300, health: 30, next: 'node_30' },
    ],
  },
  node_41: {
    title: 'The Pilot That Stalled',
    text: 'The deal evaporated in procurement hell — security questionnaires, a champion who quit, a competitor with a golf relationship. Painful, instructive. Enterprise sales is a contact sport.',
    tags: ['office'],
    choices: [
      { text: 'Salvage it by solving the exact objection that killed it.', req: { skill: 'adaptability', min: 3 }, time: 180, roll: { pct: 72, success: { cost: 80000, next: 'node_40' }, failure: { next: 'node_42' } } },
      { text: 'Refocus on the customers who already love you.', time: 180, next: 'node_44' },
      { text: 'Pivot energy to self-serve revenue instead.', time: 180, next: 'node_36' },
      { text: 'Harden security so this never happens again.', time: 240, next: 'node_34' },
      { text: 'Absorb the loss and rest.', time: 300, health: 30, next: 'node_30' },
    ],
  },
  node_42: {
    title: 'Growth Channel Experiments',
    text: 'You throw spaghetti: content, partnerships, a developer conference booth, a referral program. Most of it slides off the wall. One channel, unexpectedly, sticks hard.',
    tags: ['cafe'],
    choices: [
      { text: 'Double down on the channel that is working and scale it.', req: { skill: 'adaptability', min: 4 }, time: 180, cost: 60000, next: 'node_44' },
      { text: 'Convert the pipeline into the Series A narrative.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Speak at a conference to compound the winning channel.', req: { skill: 'clout', min: 4 }, cost: -2000, time: 240, next: 'node_44' },
      { text: 'Keep it lean and feed the bootstrap engine.', time: 180, cost: 30000, next: 'node_36' },
      { text: 'Pace yourself and recover.', time: 300, health: 30, next: 'node_30' },
    ],
  },
  node_43: {
    title: 'Domestic Cohabitation',
    text: 'Your partner’s books share a shelf with your server manuals; their plants soften the concrete. The loft stops being an office that has a couch and becomes a home that has a company.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Propose marriage right here where you built everything (-$8,000).', cost: -8000, time: 60, roll: { pct: 70, success: { add: ['Spouse (Stripe Designer)', 'Wedding Ring'], remove: 'Partner (Stripe Designer)', next: 'node_47' }, failure: { next: 'node_48' } } },
      { text: 'Adopt a Golden Retriever puppy to complete the home (-$500).', cost: -500, time: 120, health: 20, add: 'Loyal Dog', next: 'node_44' },
      { text: 'Back to business — push toward Series A.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Co-build the product with renewed energy.', time: 240, next: 'node_40' },
      { text: 'A quiet weekend in. Recover fully.', cost: -2000, time: 600, health: 50, next: 'node_30' },
    ],
  },
  node_44: {
    title: 'Scaling Pains',
    text: 'Growth breaks things. The on-call rotation is thin, the database creaks at 2am, and a feature request backlog mocks you. Good problems — the kind that only exist if you are winning.',
    tags: ['office'],
    choices: [
      { text: 'Re-architect for the next order of magnitude.', req: { skill: 'smarts', min: 5 }, time: 480, next: 'node_51' },
      { text: 'Hire ahead of the curve and delegate.', cost: -50000, time: 240, next: 'node_51' },
      { text: 'You are ready. Convene the Series A board review.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Buy a Palo Alto home to base your servers and family (-$1,800,000).', req: { money: 180000 }, cost: -180000, time: 240, add: 'Suburban Home Key', next: 'node_45' },
      { text: 'Invest in professional development — courses, coaching, training.', time: 20, next: 'node_dev2' },
      { text: 'Protect your health before you snap.', time: 360, health: 40, next: 'node_30' },
    ],
  },
  node_45: {
    title: 'Palo Alto Suburban Home',
    text: 'Escrow closes on a quiet Palo Alto home with a double garage now humming with server racks. A backyard, real walls, and the first time success has felt like a place you can stand inside.',
    tags: ['estate'],
    choices: [
      { text: 'Walk the dog around the block to recruit a neighbor engineer.', req: { item: 'Loyal Dog' }, time: 120, health: 20, next: 'node_33' },
      { text: 'Host the team for a backyard planning offsite.', cost: -2000, time: 240, next: 'node_51' },
      { text: 'Convene the Series A board review from your new HQ.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Upgrade later to an Atherton estate (-$900,000).', req: { money: 900000 }, cost: -900000, time: 240, add: 'Atherton Key', next: 'node_46' },
      { text: 'Sleep in a real bed for once.', time: 480, health: 50, next: 'node_44' },
    ],
  },
  node_46: {
    title: 'Atherton Gated Estate',
    text: 'Behind tall privacy hedges: a brick mansion, a heated pool, a garden. The address alone changes how investors take your calls. You have crossed into a different tax bracket of problem.',
    tags: ['estate'],
    choices: [
      { text: 'Host an Atherton VC pool gala to court late-stage capital (-$20,000).', req: { skill: 'clout', min: 5 }, cost: -20000, time: 300, next: 'node_51' },
      { text: 'Adopt an elegant Bengal cat to prowl the grounds (-,000).', cost: -5000, time: 120, health: 10, add: 'Bengal Cat', next: 'node_49' },
      { text: 'Run the Series A review from the estate study.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Consider walking away to the family-legacy life.', req: { item: 'Spouse (Stripe Designer)' }, time: 120, next: 'node_49' },
      { text: 'A long swim and a longer rest.', time: 360, health: 50, next: 'node_44' },
    ],
  },
  node_47: {
    title: 'The Sausalito Wedding',
    text: 'A cliffside ceremony over the bay, the fog parting like it was paid to. Your Stripe designer — now your spouse — laughs as the founders and the family you have cobbled together cheer.',
    tags: ['estate'],
    choices: [
      { text: 'Set up a family trust for the long game.', req: { money: 250000 }, cost: -250000, time: 120, add: 'Family Trust', next: 'node_53' },
      { text: 'Adopt a Bengal cat for the home (-$5,000).', cost: -5000, time: 120, health: 10, add: 'Bengal Cat', next: 'node_49' },
      { text: 'Back to the mission with a full heart — Series A.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Honeymoon hike in the Marin Headlands.', cost: -3000, time: 600, health: 50, next: 'node_44' },
      { text: 'Consider the quiet family-legacy ending.', time: 120, next: 'node_49' },
    ],
  },
  node_48: {
    title: 'The Proposal That Missed',
    text: 'You picked the wrong moment. Not a no, exactly — a "not like this." The ring goes back in the drawer beside the unfinished feature specs. Some bugs are not in the code.',
    tags: ['hacker_house'],
    choices: [
      { text: 'Give it room and rebuild the relationship slowly.', req: { item: 'Partner (Stripe Designer)' }, time: 240, health: 10, next: 'node_43' },
      { text: 'Pour the hurt into the product.', time: 300, next: 'node_44' },
      { text: 'Throw yourself into the Series A push.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Talk it through honestly over dinner.', cost: -100, time: 180, health: 20, next: 'node_43' },
      { text: 'Take a long walk alone to reset.', time: 240, health: 30, next: 'node_30' },
    ],
  },
  node_49: {
    title: 'The Fork: Empire or Family',
    text: 'From the estate terrace you can see two futures. One ends in a Nasdaq bell and eleven figures. The other ends right here, on this lawn, with the people and animals you love. Both are wins.',
    tags: ['estate'],
    choices: [
      { text: 'Choose the family legacy and walk away — if you have it all.', req: { item: 'Spouse (Stripe Designer)' }, time: 120, next: 'node_105' },
      { text: 'Not yet. The empire calls. Push to Series A.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Adopt a Bengal cat and lean into the home.', cost: -5000, time: 120, health: 10, add: 'Bengal Cat', next: 'node_49' },
      { text: 'Buy a yacht because you can (-$4,500,000).', req: { money: 4500000 }, cost: -4500000, time: 240, add: 'Yacht Key', next: 'node_50' },
      { text: 'Sit with your spouse and just breathe.', time: 300, health: 50, next: 'node_47' },
    ],
  },
  node_50: {
    title: 'Sausalito Megayacht',
    text: 'Helicopter pad, glass-bottom pool, a crew that knows your coffee order. The yacht is a floating closing tool — nothing softens an enterprise CTO like champagne under the Golden Gate.',
    tags: ['yacht'],
    choices: [
      { text: 'Host a closing cruise for a whale enterprise account.', req: { skill: 'clout', min: 5 }, cost: -10000, time: 300, next: 'node_53' },
      { text: 'Sail to international waters to court sovereign-wealth capital.', time: 240, next: 'node_51' },
      { text: 'Bring the family aboard for the legacy life.', req: { item: 'Spouse (Stripe Designer)' }, time: 240, health: 30, next: 'node_49' },
      { text: 'Convene the Series A board on deck.', req: { money: 150000 }, time: 180, next: 'node_51' },
      { text: 'Anchor in a cove and finally rest.', time: 480, health: 50, next: 'node_53' },
    ],
  },

  // ---------------------------------------------------------------- TIER C (enterprise scaling)
  node_51: {
    title: 'Series A Board Strategy Review',
    text: 'Your pre-seed runway is deployed and user metrics are scaling exponentially. Server load hits critical thresholds; lead investors demand an itemized roadmap to clear the next valuation milestone. Build an outbound enterprise pipeline or lose your edge.',
    tags: ['office'],
    choices: [
      { text: 'Spend $100,000 to hire Sarah, a legendary sales director from Salesforce.', req: { money: 100000 }, cost: -100000, time: 240, add: 'VP of Sales (Sarah)', next: 'node_53' },
      { text: 'Intrusion alerts! Defend your clusters against a coordinated hack.', time: 60, roll: { pct: 70, success: {  next: 'node_55' }, failure: { cost: -40000, next: 'node_56' } } },
      { text: 'Engineer v2 with optimized compression loops.', req: { skill: 'smarts', min: 5 }, time: 720, next: 'node_54' },
      { text: 'Buy a Palo Alto home for a private server garage (-$180,000).', req: { money: 180000 }, cost: -180000, time: 240, add: 'Suburban Home Key', next: 'node_45' },
      { text: 'Buy an Atherton Gated Estate for late-game stature (-$900,000).', req: { money: 900000 }, cost: -900000, time: 240, add: 'Atherton Key', next: 'node_46' },
    ],
  },
  node_53: {
    title: "Sarah's Outbound Sales Operations",
    text: 'Sarah sets up her enterprise CRM, tracks your server-load benchmarks, and isolates two major corporate pipeline opportunities to scale your recurring revenue engine. The machine has a driver now.',
    tags: ['office'],
    choices: [
      { text: 'Brief Walmart’s global supply-chain CTO on a technical pilot.', req: { skill: 'leverage', min: 5 }, time: 180, cost: 5000000, next: 'node_58' },
      { text: 'Sic Sarah on Wall Street HFT firms with low-latency pilots.', time: 120, next: 'node_62' },
      { text: 'Audit Sarah’s data to sharpen the next pitch into an $8M deal.', time: 120, next: 'node_57' },
      { text: 'Buy a moored Sausalito Megayacht to impress accounts (-$4,500,000).', req: { money: 4500000 }, cost: -4500000, time: 240, add: 'Yacht Key', next: 'node_50' },
      { text: 'Set up a long-term family trust allocation (-$250,000).', req: { item: 'Spouse (Stripe Designer)' }, cost: -250000, time: 120, add: 'Family Trust', next: 'node_55' },
    ],
  },
  node_54: {
    title: 'V2 Ships at Scale',
    text: 'Version 2 lands: compression loops cut cloud costs by 40% and latency by half. Existing customers double their usage overnight. Margins fatten; the graph that investors love bends skyward.',
    tags: ['office'],
    choices: [
      { text: 'Sell the efficiency story into a flagship megadeal.', time: 240, roll: { pct: 65, success: { cost: 8000000, next: 'node_58' }, failure: { cost: -3000000, next: 'node_56' } } },
      { text: 'Patent the compression method as a moat.', req: { skill: 'smarts', min: 5 }, time: 240, next: 'node_60' },
      { text: 'Hire Sarah to monetize the surge.', req: { money: 100000 }, cost: -100000, time: 180, add: 'VP of Sales (Sarah)', next: 'node_53' },
      { text: 'Drive toward the pre-IPO track.', req: { money: 50000000 }, time: 180, next: 'node_76' },
      { text: 'Recover after the v2 marathon.', time: 360, health: 40, next: 'node_55' },
    ],
  },
  node_55: {
    title: 'Mid-Game Execution Vectors',
    text: 'The scale tier shifts. You must protect cluster configs against zero-day queries, trace regional latency, and balance cap-table voting blocks — all before Friday. Welcome to running a real company.',
    tags: ['office'],
    choices: [
      { text: 'Invest in elite coaching and masterminds.', time: 30, next: 'node_dev3' },
      { text: 'Lock down the infrastructure end to end.', req: { skill: 'smarts', min: 5 }, time: 300, next: 'node_60' },
      { text: 'Push Sarah’s pipeline toward a megadeal.', req: { item: 'VP of Sales (Sarah)' }, time: 180, roll: { pct: 60, success: { cost: 12000000, next: 'node_58' }, failure: { cost: -5000000, next: 'node_56' } } },
      { text: 'Consolidate cap-table control in your favor.', req: { skill: 'leverage', min: 5 }, time: 180, next: 'node_64' },
      { text: 'Advance to the pre-IPO underwriting track.', req: { money: 50000000 }, time: 180, next: 'node_76' },
      { text: 'Protect your health under the pressure.', time: 360, health: 40, next: 'node_57' },
    ],
  },
  node_56: {
    title: 'The Breach Postmortem',
    text: 'Something slipped — a deal lost, a cluster probed, a number that went the wrong way. The board wants answers and a plan. How you handle the setback matters more than the setback.',
    tags: ['office'],
    choices: [
      { text: 'Ship a forensic fix and turn the incident into a trust story.', req: { skill: 'smarts', min: 5 }, time: 300, next: 'node_60' },
      { text: 'Rebuild the pipeline with Sarah, harder.', req: { item: 'VP of Sales (Sarah)' }, time: 240, roll: { pct: 60, success: { cost: 6000000, next: 'node_58' }, failure: { cost: -3000000, next: 'node_62' } } },
      { text: 'Pull an all-hands crunch to recover lost ground.', req: { skill: 'endurance', min: 5 }, time: 480, health: -35, next: 'node_54' },
      { text: 'Reassure investors and steady the ship.', req: { skill: 'clout', min: 5 }, time: 180, next: 'node_64' },
      { text: 'Step back before you break.', time: 360, health: 40, next: 'node_57' },
    ],
  },
  node_57: {
    title: 'Sharpened Pipeline',
    text: 'The CRM audit pays off — Sarah walks into the next pitch knowing the buyer’s pain better than the buyer does. The Walmart opportunity quietly upgrades from a $5M to an $8M shape.',
    tags: ['office'],
    choices: [
      { text: 'Close the upgraded $8M enterprise deal.', req: { skill: 'leverage', min: 4 }, time: 180, cost: 8000000, next: 'node_58' },
      { text: 'Run parallel pilots with Sarah for compounding revenue.', req: { item: 'VP of Sales (Sarah)' }, time: 240, roll: { pct: 65, success: { cost: 10000000, next: 'node_58' }, failure: { cost: -4000000, next: 'node_56' } } },
      { text: 'Build the data platform the megadeals will demand.', req: { skill: 'smarts', min: 5 }, time: 300, next: 'node_60' },
      { text: 'Advance toward the pre-IPO track.', req: { money: 50000000 }, time: 180, next: 'node_76' },
      { text: 'Recover before the close.', time: 300, health: 40, next: 'node_55' },
    ],
  },
  node_58: {
    title: 'The Megadeal Closes',
    text: 'Signatures, a press release, and an ARR figure with a comma you have never typed before. The whole company exhales and then immediately panics about delivering. This is the big leagues now.',
    tags: ['office'],
    choices: [
      { text: 'Reinvest into infrastructure to honor the SLA.', req: { skill: 'smarts', min: 5 }, time: 300, next: 'node_60' },
      { text: 'Let Sarah chain it into the next logo.', req: { item: 'VP of Sales (Sarah)' }, time: 240, roll: { pct: 70, success: { cost: 20000000, next: 'node_66' }, failure: { cost: -8000000, next: 'node_62' } } },
      { text: 'Buy an Atherton estate to match your new stature (-$900,000).', req: { money: 900000 }, cost: -900000, time: 240, add: 'Atherton Key', next: 'node_46' },
      { text: 'With this revenue, begin the pre-IPO track.', req: { money: 50000000 }, time: 180, next: 'node_76' },
      { text: 'Invest in elite coaching and masterminds.', time: 20, next: 'node_dev3' },
      { text: 'Throw a real celebration, then rest.', cost: -20000, time: 360, health: 40, next: 'node_55' },
    ],
  },
  node_60: {
    title: 'Infrastructure That Does Not Blink',
    text: 'Multi-region failover, five-nines uptime, a status page that stays green through chaos. Reliability becomes your reputation, and reputation closes deals while you sleep.',
    tags: ['office'],
    choices: [
      { text: 'Win a regulated-industry whale on the strength of reliability.', time: 240, roll: { pct: 70, success: { cost: 25000000, next: 'node_66' }, failure: { cost: -10000000, next: 'node_62' } } },
      { text: 'Raise a massive growth round at a soaring valuation.', req: { skill: 'leverage', min: 5 }, time: 180, cost: 30000000, next: 'node_64' },
      { text: 'Drive toward the pre-IPO underwriting sprints.', req: { money: 50000000 }, time: 180, next: 'node_76' },
      { text: 'Deploy Sarah on the international pipeline.', req: { item: 'VP of Sales (Sarah)' }, time: 240, next: 'node_66' },
      { text: 'Invest in elite coaching and masterminds.', time: 20, next: 'node_dev3' },
      { text: 'Bank the stability and recover.', time: 300, health: 40, next: 'node_55' },
    ],
  },
  node_62: {
    title: 'High-Frequency Trading Pilots',
    text: 'Wall Street’s HFT desks demand microsecond latency and forgive nothing. Land one and the logos open every door; miss the SLA and the lawyers arrive before the apology.',
    tags: ['office'],
    choices: [
      { text: 'Hit the impossible latency target and lock the contract.', req: { skill: 'smarts', min: 6 }, time: 360, cost: 18000000, next: 'node_66' },
      { text: 'Let Sarah negotiate a high-risk, high-reward pilot.', req: { item: 'VP of Sales (Sarah)' }, time: 240, roll: { pct: 55, success: { cost: 22000000, next: 'node_66' }, failure: { cost: -8000000, next: 'node_56' } } },
      { text: 'De-risk: focus on enterprise SaaS instead.', time: 180, next: 'node_60' },
      { text: 'Push to pre-IPO if the revenue is there.', req: { money: 50000000 }, time: 180, next: 'node_76' },
      { text: 'Step back from the pressure cooker.', time: 360, health: 40, next: 'node_55' },
    ],
  },
  node_64: {
    title: 'The Growth Round',
    text: 'A late-stage fund wires a war chest and takes a board seat. You are now playing with other people’s billions and your own reputation. Spend it like it is the last money you will ever raise.',
    tags: ['office'],
    choices: [
      { text: 'Blitz-scale sales and engineering simultaneously.', req: { skill: 'leverage', min: 5 }, time: 300, roll: { pct: 82, success: { cost: 30000000, next: 'node_66' }, failure: { cost: -5000000, next: 'node_62' } } },
      { text: 'Build the platform that defines the category.', req: { skill: 'smarts', min: 6 }, time: 360, next: 'node_66' },
      { text: 'Acquire a smaller competitor for their team.', cost: -15000000, time: 240, next: 'node_66' },
      { text: 'You have the scale — start the pre-IPO track.', req: { money: 50000000 }, time: 180, next: 'node_76' },
      { text: 'Recover before the sprint.', time: 360, health: 40, next: 'node_66' },
    ],
  },
  node_66: {
    title: 'Category Leader',
    text: 'Analysts put you in the top-right quadrant. Competitors benchmark against you. Recruiters cite your logo as a selling point. The only directions left are public markets — or a graceful exit.',
    tags: ['office'],
    choices: [
      { text: 'Begin the pre-IPO SEC underwriting sprints.', req: { money: 50000000 }, time: 240, next: 'node_76' },
      { text: 'Field an enormous acquisition offer from a giant.', req: { skill: 'leverage', min: 5 }, time: 180, next: 'node_35' },
      { text: 'Stack one more nation-scale megadeal.', req: { item: 'VP of Sales (Sarah)' }, time: 240, roll: { pct: 70, success: { cost: 40000000, next: 'node_66' }, failure: { cost: -15000000, next: 'node_62' } } },
      { text: 'Host the family on the yacht and consider the legacy life.', req: { item: 'Yacht Key' }, time: 240, health: 30, next: 'node_49' },
      { text: 'Invest in elite coaching and masterminds.', time: 20, next: 'node_dev3' },
      { text: 'Take a few days to fully recover before the public-market gauntlet.', time: 360, health: 50, next: 'node_66' },
    ],
  },

  // ---------------------------------------------------------------- TIER D (pre-IPO) + endings
  node_76: {
    title: 'The Pre-IPO SEC Underwriting Sprints',
    text: 'Your licenses scaled flawlessly across international data grids. You deploy a $1,500,000 lump sum for banking retainers, SEC S-1 audits, and underwriting insurance to prep the roadshow. The pre-market orderbooks go green.',
    tags: ['ipo'],
    choices: [
      { text: 'Fly to Times Square and ring the Nasdaq opening bell.', req: { money: 100000000 }, time: 120, next: 'node_100' },
      { text: 'Delay the listing for a better market window; keep scaling.', time: 180, next: 'node_66' },
      { text: 'Monitor institutional subscription interest on the roadshow bus.', req: { skill: 'adaptability', min: 6 }, time: 60, next: 'node_77' },
      { text: 'Gamble remaining funds on an unverified asset token (-$10,000).', cost: -10000, time: 60, roll: { pct: 20, success: { cost: 50000000, next: 'node_77' }, failure: { next: 'node_77' } } },
      { text: 'Host a celebratory pre-IPO gala at your estate (-$20,000).', req: { item: 'Atherton Key' }, cost: -20000, time: 300, next: 'node_77' },
    ],
  },
  node_77: {
    title: 'Roadshow Final Mile',
    text: 'City after city, the same deck, the same standing ovation from fund managers who smell a winner. The order book is oversubscribed. One last push and the bell is yours — if the wallet clears the line.',
    tags: ['ipo'],
    choices: [
      { text: 'Ring the Nasdaq bell and complete the IPO.', req: { money: 100000000 }, time: 120, next: 'node_100' },
      { text: 'Stack one final nation-scale megadeal to clear the bar.', req: { item: 'VP of Sales (Sarah)' }, time: 240, roll: { pct: 75, success: { cost: 40000000, next: 'node_77' }, failure: { cost: -15000000, next: 'node_66' } } },
      { text: 'Field a last-minute mega-acquisition instead of going public.', req: { skill: 'leverage', min: 5 }, time: 180, next: 'node_35' },
      { text: 'Walk away to the family legacy if you have it all.', req: { item: 'Spouse (Stripe Designer)' }, time: 120, next: 'node_49' },
      { text: 'Rest before the biggest day of your life.', time: 360, health: 40, next: 'node_77' },
    ],
  },

  node_100: {
    title: 'Ending A — The Parabolic NASDAQ IPO',
    text: 'Your hand descends and the Nasdaq bell chimes across Times Square. The ticker climbs vertically, volume parabolic as hedge funds scramble for your float. The listing jumps 400%, your valuation crosses eleven figures, and your founder shares liquidate into a permanent, cleared +$100,000,000. You have conquered the absolute peak of the Silicon Valley venture ecosystem as a billionaire titan.',
    tags: ['ipo'],
    ending: { type: 'win', label: 'VICTORY — The Parabolic IPO' },
  },
  node_101: {
    title: 'Ending B — The Corporate M&A Cash Buyout',
    text: 'The ink dries on the asset purchase. You shake hands with Oracle’s directors and walk out of their tower for the last time, your board dissolved, your core absorbed into their global stack. Your ledger clears a flat $15,000,000. You buy an Atherton estate, program low-stress indie games on your deck, and live in absolute financial freedom.',
    tags: ['estate'],
    ending: { type: 'win', label: 'VICTORY — The M&A Buyout' },
  },
  node_102: {
    title: 'Ending C — The Bootstrapped Indie SaaS Lifestyle',
    text: 'Sun setting over your SOMA loft, the dashboards tell a story of organic success. You refused Sand Hill’s checks and kept 100% equity. Your tool hit total product-market fit among open-source developers worldwide; recurring revenue sweeps into your private account. No yacht, no billboard — but you own your life, your time, your company, and 100% of your code in stress-free freedom.',
    tags: ['hacker_house'],
    ending: { type: 'win', label: 'VICTORY — The Bootstrapped Empire' },
  },
  node_103: {
    title: 'Ending D — SOMA Operational Runway Bankruptcy',
    text: 'The red lines on your monitor are no longer syntax errors — they are bank notices. Your balance hits $0 and the runway is gone. Cloud hosting deactivates your servers; the landlord terminates your desk; users flee as the platform goes dark. You pack your MacBook and clothes, walk to the Transit Center, and buy a one-way bus ticket home. Your journey ends in bankruptcy.',
    tags: ['transit'],
    ending: { type: 'loss', label: 'GAME OVER — Bankruptcy' },
  },
  node_104: {
    title: 'Ending E — Critical Healthcare Cognitive Burnout',
    text: 'The code blurs into white noise. Your chest tightens under an unchecked 80-hour sprint; your vision darkens and you collapse across the workspace. You wake days later under hospital fluorescents, surrounded by monitors and billing invoices that wipe out your reserves. Your doctors enforce a permanent stop. Your startup velocity flatlines, and your journey ends in systemic collapse.',
    tags: ['hospital'],
    ending: { type: 'loss', label: 'GAME OVER — Burnout' },
  },
  node_105: {
    title: 'Ending F — The Rich Family Legacy',
    text: 'You slide the roadshow folders off your walnut desk and close your laptop. You hand Sarah your resignation, step through the French doors of your Atherton mansion, and walk into the sun. Your Golden Retriever sprints for a frisbee, your Bengal cat prowls the roses, your spouse meets you on the terrace. You walked away from the billionaire game forever — a generational fortune banked, your family anchored, your days finally your own.',
    tags: ['estate'],
    ending: { type: 'win', label: 'VICTORY — The Family Legacy' },
  },
  // ---------------------------------------------------------------- SELF-DEVELOPMENT HUBS
  // Skills are earned here, deliberately — not as a side effect of decisions.
  // Every option costs time, money, and health, so training forces rest cycles.
  node_dev1: {
    title: 'Self-Investment: Library, Seminars & the Gym',
    text: 'Between sprints you carve out time to actually get better at this. The clock and your body both pay for it — but a sharper founder unlocks doors a desperate one cannot.',
    tags: ['library'],
    choices: [
      { text: 'Read the distributed-systems canon cover to cover.', time: 480, health: -10, grant: { smarts: 1 }, next: 'node_10' },
      { text: 'Attend a founder storytelling and pitch workshop.', cost: -60, time: 240, health: -8, grant: { clout: 1 }, next: 'node_10' },
      { text: 'Do a lean-startup bootcamp weekend.', cost: -90, time: 600, health: -12, grant: { adaptability: 1 }, next: 'node_10' },
      { text: 'Study term sheets line by line with a startup lawyer.', cost: -150, time: 180, health: -8, grant: { leverage: 1 }, next: 'node_10' },
      { text: 'Grind brutal interval training at the gym.', time: 120, health: -22, grant: { endurance: 1 }, next: 'node_10' },
    ],
  },
  node_dev2: {
    title: 'Executive Coaching & Professional Development',
    text: 'You can afford real teachers now. The best in the world charge accordingly — in money, in hours, and in the toll the work takes — but the compounding is worth it.',
    tags: ['office'],
    choices: [
      { text: 'Enroll in an advanced systems-architecture program.', cost: -2000, time: 480, health: -10, grant: { smarts: 1 }, next: 'node_30' },
      { text: 'Hire an executive communication coach.', cost: -5000, time: 240, health: -8, grant: { clout: 1 }, next: 'node_30' },
      { text: 'Run a cross-functional operations rotation.', cost: -3000, time: 480, health: -12, grant: { adaptability: 1 }, next: 'node_30' },
      { text: 'Take a high-stakes negotiation masterclass.', cost: -6000, time: 240, health: -8, grant: { leverage: 1 }, next: 'node_30' },
      { text: 'Work daily with a performance trainer.', cost: -2000, time: 180, health: -24, grant: { endurance: 1 }, next: 'node_30' },
    ],
  },
  node_dev3: {
    title: 'Elite Masterminds & Performance Coaching',
    text: 'At this altitude, growth is a line item with a lot of zeros — research fellowships, media handlers, recovery scientists. You buy the very best, and it still hurts to push past your ceiling.',
    tags: ['estate'],
    choices: [
      { text: 'Sponsor a research fellowship you personally study under.', cost: -200000, time: 480, health: -10, grant: { smarts: 1 }, next: 'node_55' },
      { text: 'Do intensive media training with a top PR firm.', cost: -150000, time: 240, health: -8, grant: { clout: 1 }, next: 'node_55' },
      { text: 'Embed with a turnaround consultancy for a quarter.', cost: -250000, time: 480, health: -12, grant: { adaptability: 1 }, next: 'node_55' },
      { text: 'Take a private dealcraft masterclass from a PE legend.', cost: -300000, time: 240, health: -8, grant: { leverage: 1 }, next: 'node_55' },
      { text: 'Enter an elite athletic and recovery program.', cost: -100000, time: 180, health: -24, grant: { endurance: 1 }, next: 'node_55' },
    ],
  },
};
