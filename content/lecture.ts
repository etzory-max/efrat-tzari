/**
 * What opens from the lecture card on the home page.
 *
 * The wording follows Efrat's corrected copy of the demo's lecture page (a
 * Google Doc, "תיקונים ל efrat-horut.vercel.app/lecture"): the story it
 * starts from, the lines a parent recognises herself in, what she leaves
 * with, what happens in the room, who gives it, what an evening like this
 * gives her, and the terms. The schedule and the questions stayed behind -
 * there are no dates yet, and the questions belong with the site's own. Added
 * here: a photo of her on stage and two minutes of her voice from a podcast.
 *
 * Efrat edits this in the Studio; this file is the fallback if Sanity is
 * unreachable or a field is left empty.
 */
export type LectureCopy = {
  /** The link on the card that opens it. */
  openLabel: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  audience: string;
  storyTitle: string;
  story: string[];
  /** The line the story ends on, set apart. */
  storyLine: string;
  recogniseTitle: string;
  recogniseLines: string[];
  recogniseCloser: string;
  takeawaysTitle: string;
  takeawaysLead: string;
  takeaways: { title: string; body: string }[];
  roomTitle: string;
  roomLead: string;
  room: { title: string; body: string }[];
  roomCloser: string;
  bioEyebrow: string;
  bioTitle: string;
  /** The opening paragraph, set in ink as the one that introduces her. */
  bioLead: string;
  bio: string[];
  gainsTitle: string;
  gainsLines: string[];
  facts: { label: string; value: string }[];
  /** Efrat on stage, beside the opening. */
  photo: { src: string; alt: string };
  /**
   * A short cut from the podcast, so a reader hears how Efrat talks before
   * she books an evening of it. Played from YouTube between two timestamps.
   */
  clipEyebrow: string;
  clipTitle: string;
  clipNote: string;
  clipYoutubeId: string;
  /** Seconds into the episode. */
  clipStart: number;
  clipEnd: number;
  /**
   * One call to action. An open evening and a lecture brought to them both
   * start with the same form, so two buttons only asked her to choose twice.
   */
  ctaLabel: string;
  ctaNote: string;
  ctaHref: string;
};

export const lecture: LectureCopy = {
  openLabel: "לכל הפרטים על ההרצאה",
  eyebrow: "הרצאה משנה חיים",
  title: "״בואי, זה הזמן שלנו להופיע״",
  subtitle: "איך לעבור מסערה רגשית להורות מותאמת, בטוחה ושאינה מתנצלת",
  audience: "הרצאה להורים לילדים על הרצף, לצוותים ולכל מי שמגדל ילד עם צרכים מיוחדים.",

  storyTitle: "איך זה מתחיל",
  story: [
    "מאי 2024, מרפסת מול הים בנתניה, בעיצומה של מלחמה. חתן וכלה שקיבלו חופשה מיוחדת מהלחימה כדי להתחתן, הוא מעזה והיא מגבול הצפון.",
    "בכניסה לחופה עומדת שושבינה אחת בשמלה לבנה, אוחזת בסלסלת עלי כותרת, ולידה אמא שלה. השיר מתחיל. הקהל עומד משני צידי השביל. וברגע שבו כולם מחכים, הכול נעצר.",
    "מה שקרה בשנייה הבאה, מול קהל שלם, הוא הרגע שממנו נולדה ההרצאה הזאת. את הסיפור המלא אני מספרת שם.",
    "אבל את המשפט שאומר הכל אני יכולה לתת לך כבר עכשיו.",
  ],
  storyLine: "״בואי, זה הזמן שלנו להופיע״.",

  recogniseTitle: "מי שיושבת בחדר הזה מזהה את עצמה בשורות האלה",
  recogniseLines: [
    "יצאת מהבית עם תוכנית, וחזרת אחרי עשרים דקות.",
    "את סורקת כל מקום מראש. מי יסתכל, מי יעיר, איפה הדלת.",
    "הפסקת להגיע לאירועים משפחתיים, למפגשים עם חברים, ואמרת לעצמך שזה בגלל הלוח זמנים.",
    "את מתנצלת. בפני הגננת, בפני השכנה, ובעיקר בפני עצמך.",
    "ואת עייפה מלהיות דרוכה כל הזמן.",
  ],
  recogniseCloser:
    "אף אחד מהדברים שציינתי לא הופך אותך להורה גרוע, מתבייש או מסתתר, זה סימן שאת מנהלת מערכת בלי רגע של רזרבה.",

  takeawaysTitle: "מה את לוקחת מהערב",
  takeawaysLead: "שלושה דברים, וכולם עובדים כבר למחרת בבוקר",
  takeaways: [
    {
      title: "הפנטזיה שהתנפצה היא לא סוף הסיפור",
      body: "מה קורה כשמפסיקים להילחם באבחנה ומתחילים להתאים את החלומות במקום לוותר עליהם. עם נתונים על מה שהורים אחרים באמת מרגישים ברגע הזה, כדי שתדעי שאת לא חריגה ולא לבד.",
    },
    {
      title: "הילד שלך הוא לא כרטיס הביקור שלך",
      body: "הוא לא מייצג אותך, הוא מייצג את עצמו. את תרגישי פיזית מה נופל מהכתפיים ברגע שזה נכנס פנימה, וכמה מקום מתפנה לבושה ולהלקאה עצמית ללכת.",
    },
    {
      title: "מודל נמר״ה, לניהול משבר בזמן אמת",
      body: "ארבעה צעדים לרגע שבו הכול מתפוצץ באמצע הסופרמרקט. ניתוק, מיקוד, ריפריימינג, הפרדה. את יוצאת מהערב עם המודל ביד ועם תרגול אחד שעשינו יחד בחדר.",
    },
  ],

  roomTitle: "מה קורה בחדר",
  roomLead:
    "שעה ורבע של מעברים מתחושות של אשמה לתחושת מסוגלות, מתובלים בהרבה רגעי צחוק ודמעות של התרגשות.",
  room: [
    {
      title: "מתחילים בסיפור",
      body: "סיפור אמיתי אחד, שממנו נגזר כל השאר. אני מספרת, ואת תזהי בו את עצמך מהמשפט השני.",
    },
    {
      title: "מנתחים יחד מקרה אמיתי",
      body: "לוקחים סיטואציה שקרתה, מפרקים אותה צעד צעד, ורואים בדיוק איפה אפשר היה לעשות אחרת. זה החלק שבו הכלים נכנסים לידיים.",
    },
    {
      title: "יוצאים עם צעד אחד",
      body: "צעד אחד, שאת בוחרת בעצמך ומיישמת כבר מחר.",
    },
  ],
  roomCloser: "וצחוק. הרבה. חלק ממה שקורה לנו הוא באמת מצחיק, ומותר לצחוק עליו.",

  bioEyebrow: "מי מעבירה",
  bioTitle: "אפרת צרי",
  bioLead:
    "נעים להכיר, אפרת צרי. מדריכת הורים מוסמכת ומחברת הספר \"שברים עדינים\", אבל לפני הכל – אמא לתאומות על הרצף, שחיה ומנהלת את המציאות הזו בבית יום-יום, בשבע בבוקר ובשבע בערב.",
  bio: [
    "החיבור שנוצר על הבמה מגיע מתוך שילוב ייחודי: הכלים האנליטיים והאסטרטגיים מהעבר כמנהלת שיווק בכירה בהייטק, שנבחנו בפועל בסלון הפרטי והפכו לגישה הורית פרקטית ועובדת.",
    "המפגש איתה הוא חוויה רגשית מעצימה, הנעה על מנעד רחב של רגשות – מהרגעים החשופים והנוגעים ביותר ועד לצחוק גדול ומשחרר, שהוא חלק בלתי נפרד מהאישיות ומהסטוריטלינג בחדר. זהו ערב שמעניק לך גישה חדשה, ביטחון פנימי וכלים מעשיים כמו מודל נמר\"ה, כדי להחזיר לבית שלך את האוויר והנחת כבר למחרת בבוקר. כי בסופו של דבר, מאחורי כל אבחון ומילה מקצועית – יש משפחה, יש ילד, ויש אותך.",
  ],

  gainsTitle: "מה יוצא לך מערב כזה?",
  gainsLines: [
    "גישה חדשה שתאפשר לך מה שלא ראית שמתאפשר עד כה.",
    "אני נותנת כלים שיהיו בסיס לביטחון ביכולת שלך, וזה משהו אחר לגמרי מנסיון למכור לך שיטה או שליטה.",
    "וזו הרצאה שתגרום לך להבין כמה את אמא משמעותית",
  ],

  facts: [
    { label: "כמה זמן", value: "כשעה ורבע" },
    { label: "מפגש פתוח", value: "129 ₪ למשתתף" },
    { label: "הזמנה אליכם", value: "לפי הצעה, פרונטלי או אונליין" },
  ],

  photo: {
    // The slide behind her is blurred; her arm and hand in front of it are not.
    src: "/images/efrat-lecture.59e561d1.jpg",
    alt: "אפרת צרי מרצה על במה, עם מיקרופון ומסך מצגת מאחוריה",
  },

  clipEyebrow: "שתי דקות מתוך פודקאסט",
  clipTitle: "ככה זה נשמע: הילד, ההורה והקהל",
  clipNote: "מתוך ״פרוטוקול פתוח״, פרק 8. אפרת מדברת על הרגע שבו הכול יוצא משליטה מול עיניים זרות, ומה ההורה צריך לעשות בו.",
  clipYoutubeId: "1Jyky8kOxuU",
  clipStart: 1672,
  clipEnd: 1805,

  ctaLabel: "לשמור לי מקום",
  ctaNote: "מפגש פתוח או הרצאה אליכם, הכול מתחיל באותו טופס.",
  ctaHref: "/#contact",
};
