/**
 * What opens from the lecture card on the home page.
 *
 * Taken from the lecture page in the demo (efrat-horut.vercel.app/lecture),
 * and only the parts that sell the evening: the story it starts from, the
 * lines a parent recognises herself in, what she leaves with, what happens in
 * the room, what it is not, and the terms. The bio and the schedule stayed
 * behind - the home page already has Efrat's own section, and there are no
 * dates to show yet. In their place: a photo of her on stage and two minutes
 * of her voice from a podcast.
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
  notTitle: string;
  notLines: string[];
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
  eyebrow: "ערב הורים",
  title: "בואי, זה הזמן שלנו להופיע",
  subtitle: "איך לעבור מסערה רגשית להורות מותאמת, בטוחה ושאינה מתנצלת",
  audience: "הרצאה להורים לילדים על הרצף, ולכל מי שמגדל ילד עם צרכים מיוחדים.",

  storyTitle: "איך זה מתחיל",
  story: [
    "מאי 2024, מרפסת מול הים בנתניה, בעיצומה של מלחמה. חתן וכלה שקיבלו חופשה מיוחדת מהלחימה כדי להתחתן, הוא מעזה והיא מגבול הצפון.",
    "בכניסה לחופה עומדת שושבינה אחת בשמלה לבנה, אוחזת בסלסלת עלי כותרת, ולידה אמא שלה. השיר מתחיל. הקהל עומד משני צידי השביל. וברגע שבו כולם מחכים, הכול נעצר.",
    "מה שקרה בשנייה הבאה, מול קהל שלם, הוא הרגע שממנו נולדה ההרצאה הזאת. את הסיפור המלא אני מספרת רק בחדר.",
    "אבל את המשפט שאמרתי שם אני יכולה לתת לך כבר עכשיו.",
  ],
  storyLine: "בואי, זה הזמן שלנו להופיע.",

  recogniseTitle: "רוב מי שיושב בחדר הזה מזהה את עצמו בשורות האלה",
  recogniseLines: [
    "יצאת מהבית עם תוכנית, וחזרת אחרי עשרים דקות.",
    "את סורקת כל מקום מראש. מי יסתכל, מי יעיר, איפה הדלת.",
    "הפסקת להגיע לאירועים משפחתיים, ואמרת לעצמך שזה בגלל הלוח זמנים.",
    "את מתנצלת. בפני הגננת, בפני השכנה, ובעיקר בפני עצמך.",
    "ואת עייפה. לא מהילד. מלהיות דרוכה כל הזמן.",
  ],
  recogniseCloser:
    "אף אחת מהשורות האלה היא לא סימן שאת הורה גרוע. הן סימן שאת מנהלת מערכת בלי רגע של רזרבה.",

  takeawaysTitle: "מה את לוקחת מהערב",
  takeawaysLead: "שלושה דברים, וכולם עובדים כבר למחרת בבוקר.",
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
  roomLead: "שעה וחצי, שלושה חלקים.",
  room: [
    {
      title: "מתחילים בסיפור",
      body: "סיפור אמיתי אחד, שממנו נגזר כל השאר. אני מספרת, ואת תזהי בו את עצמך מהמשפט השני.",
    },
    {
      title: "מנתחים יחד מקרה אמיתי",
      body: "לא תיאוריה. לוקחים סיטואציה שקרתה, מפרקים אותה צעד צעד, ורואים בדיוק איפה אפשר היה לעשות אחרת. זה החלק שבו הכלים נכנסים לידיים.",
    },
    {
      title: "יוצאים עם צעד אחד",
      body: "לא עשרה. אחד, שאת בוחרת בעצמך ומיישמת כבר מחר. ובסוף אני מקריאה קטע קצר מהספר שלי, וזה החלק שאנשים לוקחים איתם הביתה.",
    },
  ],
  roomCloser: "וצוחקים. הרבה. חלק ממה שקורה לנו הוא באמת מצחיק, ומותר לצחוק עליו.",

  notTitle: "וכדי שלא תהיה אי הבנה, מה הערב הזה לא",
  notLines: [
    "זו לא הרצאה שמסבירה מה זה אוטיזם. את מכירה את זה מהבית.",
    "זו לא הבטחה לשנות את הילד. זו גישה חדשה שתאפשר לך מה שלא ראית שמתאפשר עד כה.",
    "זו לא שיטה ולא ניסיון למכור לך שליטה. אני מלמדת ביטחון ביכולת שלך, וזה משהו אחר לגמרי.",
    "וזו בטח לא עוד מישהי שתגיד לך שאת לא מספיק.",
  ],

  facts: [
    { label: "כמה זמן", value: "כשעה וחצי" },
    { label: "מפגש פתוח", value: "199 ₪ למשתתף" },
    { label: "הזמנה אליכם", value: "לפי הצעה, פרונטלי או אונליין" },
  ],

  photo: {
    src: "/images/efrat-lecture.b97b6f61.jpg",
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
