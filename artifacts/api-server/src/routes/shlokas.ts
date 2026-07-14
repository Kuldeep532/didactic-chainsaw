import { Router, type IRouter, type Request, type Response } from "express";

// ─── Curated Bhagavad Gita Shloka Collection ───────────────────────────────────
// Preloaded, verified local collection. No external API calls. Rotates daily
// based on the server date so all clients see the same shloka for a given day.

const SHLOKAS = [
  {
    verse: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत |\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ||",
    transliteration: "Yadā yadā hi dharmasya glānir bhavati bhārata,\nAbhyutthānam adharmasya tadātmānam sṛjāmy aham ||",
    meaning: "Whenever righteousness declines and unrighteousness rises, O descendant of Bharata, I manifest Myself personally.",
    chapter: "Bhagavad Gita 4.7",
  },
  {
    verse: "परित्राणाय साधूनां विनाशाय च दुष्कृताम् |\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे ||",
    transliteration: "Paritrāṇāya sādhūnāṁ vināśāya ca duṣkṛtām,\nDharma-saṁsthāpanārthāya sambhavāmi yuge yuge ||",
    meaning: "To protect the virtuous, to destroy the wicked, and to re-establish the principles of dharma, I appear millennium after millennium.",
    chapter: "Bhagavad Gita 4.8",
  },
  {
    verse: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||",
    transliteration: "Karmaṇy-evādhikāras te mā phaleṣu kadācana,\nMā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi ||",
    meaning: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, nor be attached to inaction.",
    chapter: "Bhagavad Gita 2.47",
  },
  {
    verse: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय |\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ||",
    transliteration: "Yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya,\nSiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate ||",
    meaning: "Perform your duty equipoised, O Arjuna, abandoning attachment to success and failure. Such equanimity is called yoga.",
    chapter: "Bhagavad Gita 2.48",
  },
  {
    verse: "तस्मादसक्तः सततं कार्यं कर्म समाचर |\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः ||",
    transliteration: "Tasmād asaktaḥ satataṁ kāryaṁ karma samācara,\nAsakto hy ācaran karma param āpnoti pūruṣaḥ ||",
    meaning: "Therefore, always perform your prescribed duty without attachment. By working without attachment, one attains the Supreme.",
    chapter: "Bhagavad Gita 3.19",
  },
  {
    verse: "बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते |\nतस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम् ||",
    transliteration: "Buddhi-yukto jahātīha ubhe sukṛta-duṣkṛte,\nTasmād yogāya yujyasva yogaḥ karmasu kauśalam ||",
    meaning: "One who is steadfast in yoga renounces both good and bad reactions in this world. Therefore, engage in yoga, for yoga is the art of all work.",
    chapter: "Bhagavad Gita 2.50",
  },
  {
    verse: "यो न हृष्यति न द्वेष्टि न शोचति न काङ्क्षति |\nशुभाशुभपरित्यागी भक्तिमान्यः स मे प्रियः ||",
    transliteration: "Yo na hṛṣyati na dveṣṭi na śocati na kāṅkṣati,\nŚubhāśubha-parityāgī bhaktimān yaḥ sa me priyaḥ ||",
    meaning: "One who neither rejoices nor grieves, neither laments nor desires, and who has renounced both good and bad actions — such a devotee is dear to Me.",
    chapter: "Bhagavad Gita 12.17",
  },
];

function getDailyIndex(): number {
  // Use UTC date so all clients get the same shloka regardless of timezone
  const now = new Date();
  const daySeed = now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
  return daySeed % SHLOKAS.length;
}

function getGreeting(): string {
  const hour = new Date().getUTCHours();
  if (hour < 12) return "हरे कृष्ण 🙏";
  if (hour < 18) return "जय श्री कृष्णा 🙏";
  return "हरे कृष्ण 🙏";
}

const router: IRouter = Router();

router.get("/shloka/daily", (_req: Request, res: Response) => {
  const index = getDailyIndex();
  const shloka = SHLOKAS[index]!;
  res.json({
    greeting: getGreeting(),
    date: new Date().toISOString().slice(0, 10),
    ...shloka,
  });
});

export default router;
