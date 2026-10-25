/* ICE Card — all interface text lives here.
 * To add a language: copy the `en` block, translate the values, add the code
 * to ICE_LANGS. Missing keys fall back to English automatically.
 * `{name}` placeholders are replaced by the second argument of t().
 */
(function (global) {
  'use strict';

  var STRINGS = {
    en: {
      a11y: {
        skip: 'Skip to content',
        menu: 'Menu',
        theme: 'Switch light and dark theme',
        sound: 'Turn interface sounds on or off',
        lang: 'Interface language',
        preview: 'Live card preview',
        canvas: 'Preview of your emergency card'
      },
      nav: { home: 'Home', create: 'Make a card', guide: 'How to use it', privacy: 'Privacy', about: 'About' },
      brand: { tagline: 'Emergency contact card' },
      common: {
        optional: 'Optional',
        remove: 'Remove',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        yes: 'Yes',
        no: 'No',
        copy: 'Copy',
        copied: 'Copied',
        download: 'Download',
        print: 'Print',
        saved: 'Saved',
        language: 'Language',
        step: 'Step {n} of 5'
      },

      home: {
        eyebrow: 'Private · Offline · No account',
        h1a: 'An emergency card that works',
        h1b: 'while your phone is locked.',
        lead: 'Put the few things a stranger or a paramedic should know where they can actually see them — on your lock screen, or folded in your wallet. It takes about three minutes.',
        cta: 'Make my card',
        ctaSecondary: 'See how it works',
        trustTitle: 'Why a card helps',
        trust1t: 'It works without unlocking',
        trust1b: 'Anyone helping you can see who to call and what to know, without guessing your passcode.',
        trust2t: 'Nothing leaves your device',
        trust2b: 'The card is drawn in your browser. No accounts, no uploads, no tracking — and it works offline.',
        trust3t: 'You choose what is shown',
        trust3b: 'Every field is optional. A privacy check flags details that are risky to display in public.',
        howTitle: 'How it works',
        howLead: 'Three steps, then you can put your phone down.',
        how1t: 'Write what matters',
        how1b: 'A name, one or two people to call, blood type and allergies. Skip anything you would not want a stranger to read.',
        how2t: 'Pick a look',
        how2b: 'Four high-contrast themes, sized for a lock screen or a wallet. Everything is drawn at print quality.',
        how3t: 'Save and set it',
        how3b: 'Save the image, then set it as your lock screen. Or print the sheet, cut it out and keep it in your wallet.',
        warnTitle: 'A lock screen is public to anyone holding your phone',
        warnBody: 'Only include what you are comfortable showing a stranger. Never add a home address, full date of birth, ID or card numbers. Keep your official medical records up to date too.',
        builtinTitle: 'It works alongside your phone',
        builtinBody: 'Most phones have a built-in emergency or Medical ID screen. This card is a simple backup you control — use both if you can.',
        finalTitle: 'Ready in three minutes.',
        finalBody: 'Your details stay in your browser. You can change or delete them at any time.',
        finalCta: 'Start my card'
      },

      form: {
        title: 'Make your card',
        lead: 'Fill in what you are comfortable sharing. Every field is optional, and the preview updates as you type.',
        progress: 'Card progress',
        progressHint: 'Progress only counts what you have filled in.',
        step1: 'About me',
        step1d: 'Who this card belongs to.',
        step2: 'Emergency contacts',
        step2d: 'Who to call, in order.',
        step3: 'Medical',
        step3d: 'Only what a helper needs to know.',
        step4: 'Money and accounts',
        step4d: 'Card hotlines you want listed.',
        step5: 'Notes',
        step5d: 'One short line.',
        nameLabel: 'Name',
        namePh: 'e.g. Ayesha Khan',
        nameHint: 'A first name and last initial is often enough.',
        relLabel: 'Relationship',
        phoneLabel: 'Phone',
        avatarLabel: 'Avatar',
        avatarEmoji: 'Emoji',
        avatarPhoto: 'Photo',
        avatarRemove: 'No avatar',
        avatarHint: 'A photo is resized in your browser and never uploaded.',
        avatarTooBig: 'That image is larger than 8 MB. Please choose a smaller one.',
        avatarFailed: 'That file could not be read as an image.',
        spokenLabel: 'Preferred language',
        spokenPh: 'e.g. English, اردو, العربية',
        spokenHint: 'Helps a helper find someone who speaks it.',
        contactN: 'Contact {n}',
        contactNamePh: 'e.g. Bilal Khan',
        contactRelPh: 'Relationship (e.g. husband)',
        contactPhonePh: 'Phone (e.g. +92 300 1234567)',
        contactFirst: 'Call first',
        contactFirstHint: 'This contact is shown larger, with a phone icon.',
        addContact: 'Add another contact',
        bloodLabel: 'Blood type',
        bloodPh: 'Choose if you know it',
        allergiesLabel: 'Allergies',
        allergiesPh: 'e.g. Penicillin, peanuts',
        medsLabel: 'Medications',
        medsPh: 'e.g. Insulin, 10 units at night',
        conditionsLabel: 'Conditions',
        conditionsPh: 'e.g. Type 1 diabetes, asthma',
        donorLabel: 'Organ donor',
        donorPh: 'Prefer not to say',
        doctorLabel: 'Doctor or hospital',
        doctorPh: 'e.g. City Hospital, Dr Ali',
        bankLabel: 'Bank and card hotlines',
        bankEntry: 'Hotline {n}',
        bankNamePh: 'Bank or card name',
        bankPhonePh: 'Hotline number',
        bankPin: 'My bank will never ask for my PIN or a code by phone.',
        bankHint: 'Only add numbers you would be happy for a stranger to read. Never add card numbers or PINs.',
        notesLabel: 'One line of notes',
        notesPh: 'e.g. I wear a hearing aid in my left ear',
        notesHint: 'Keep it short — one line fits best.',
        rememberLabel: 'Remember on this device',
        rememberHint: 'Saves this form in your browser only. Nothing is sent anywhere. Leave it off on a shared device.',
        clearLabel: 'Clear all my data',
        clearConfirm: 'Delete the saved card and settings from this browser? This cannot be undone.',
        clearDone: 'All saved data has been deleted.',
        privacyTitle: 'Privacy check',
        privacyOk: 'Nothing here looks risky to show in public.',
        privacyIntro: 'These entries could be used to identify or impersonate you. Consider removing them.',
        privacyAddress: 'Looks like a home address. Safer: a landmark, or leave it out.',
        privacyDob: 'Looks like a full date of birth. Safer: just your year of birth, or leave it out.',
        privacyId: 'Looks like an ID or document number. Never show this on a lock screen.',
        privacyCard: 'Looks like a card number. Never show this on a lock screen.',
        privacyFix: 'Edit',
        validatePhone: 'Only digits, spaces, +, - and brackets are expected in a phone number.',
        fitMeasure: 'Measuring…',
        fitOk: 'Everything fits.',
        fitShrunk: 'Text was reduced slightly so it all fits.',
        fitDropped: 'The card is full. Left out: {list}. Trim a field or save a second card.',
        fitOverflow: 'This is still too much for one card. Shorten the longest fields.',
        previewTitle: 'Live preview',
        previewLock: 'Lock screen',
        previewWallet: 'Wallet',
        previewPrint: 'Print sheet',
        previewFront: 'Front',
        previewBack: 'Back',
        previewFlip: 'Flip the wallet card',
        previewOpen: 'Preview',
        previewClose: 'Close preview',
        previewGuide: 'Show safe zones',
        previewGuideTop: 'Clock and notifications',
        previewGuideBottom: 'Flashlight and camera',
        previewEmpty: 'Start typing to see your card.',
        themeLabel: 'Card theme',
        themeDaylight: 'Sunrise',
        themeMidnight: 'Midnight',
        themeCalm: 'Sage',
        themeMedical: 'Clinic',
        qrLabel: 'Add a QR code',
        qrHint: 'Encodes your contact details as plain text, not a website link. Generated on your device.',
        qrTooLong: 'Too much text for the QR code. Shorten your contacts or notes.',
        exportTitle: 'Save and use it',
        exportSave: 'Save as image',
        exportCopy: 'Copy image',
        exportPrint: 'Print sheet',
        exportPdfNote: 'For a PDF, choose “Save as PDF” in your browser’s print dialog. No extra software is used.',
        exportHold: 'Press and hold the image (or right-click) and choose “Save image”. This always works, even when automatic downloads are blocked.',
        exportDownload: 'Download PNG',
        exportShare: 'Share…',
        exportPreparing: 'Preparing your card…',
        exportSavedTitle: 'Your card is ready',
        exportSavedBody: 'Save it to your photos, then set it as your lock screen. The guide has step-by-step instructions.',
        exportPrintTip: 'Tip: Sunrise and Clinic use the least ink. Print at 100% scale, without “fit to page”.',
        exportCopyFail: 'Copying is not available in this browser. Use Save as image instead.',
        exportFail: 'The image could not be created. Try another browser, or use Print and “Save as PDF”.',
        exportNoShare: 'Sharing is not supported here — the PNG was downloaded instead.',
        layoutLabel: 'Card layout'
      },

      card: {
        callFirst: 'Call first',
        alsoCall: 'Also call',
        blood: 'Blood type',
        allergies: 'Allergies',
        meds: 'Medications',
        conditions: 'Conditions',
        donor: 'Organ donor',
        doctor: 'Doctor / hospital',
        bank: 'Bank hotlines',
        pinRule: 'My bank will never ask for my PIN or a code by phone.',
        notes: 'Notes',
        speaks: 'Speaks {lang}',
        scan: 'Scan for contact details',
        notRecord: 'Emergency contact card · Not a medical record',
        donorYes: 'Organ donor',
        donorNo: 'Not an organ donor',
        noName: 'Your name',
        front: 'Front',
        back: 'Back',
        printTitle: 'Emergency contact cards',
        printHint: 'Cut along the dashed lines. Keep each front and back together, then put them back to back.',
        printPair: 'Pair {n} of 4',
        printScale: 'Print at 100% scale · A4 · Each card is 85.6 × 54 mm'
      },

      guide: {
        title: 'How to use your card',
        lead: 'Two places work best: the lock screen and a wallet card. Here is the whole process, including how to get back to your normal wallpaper later.',
        lockT: 'Set it as your lock screen',
        lockLead: 'This is the version most people see first. Keep it on your phone’s lock screen and the card is visible without unlocking.',
        lock1: 'On this site, choose Lock screen, then Save as image.',
        lock2: 'Save the PNG to your photos. The top 30% stays clear for the clock, and the bottom 12% for the flashlight and camera buttons.',
        lock3: 'iPhone: Settings → Wallpaper → Add New Wallpaper → Photos → choose the card. Turn off depth effect and “Perspective zoom” so the text stays sharp.',
        lock4: 'Android: Photos → the card → More → Set as wallpaper → Lock screen. Choose “no motion” if offered.',
        lock5: 'Check it once with the screen locked: can you read the name and the first phone number without squinting?',
        lockTip: 'To go back, set your original photo as the wallpaper again. Your normal wallpaper is not deleted by this card.',
        walletT: 'Print a wallet card',
        walletLead: 'Paper does not run out of battery. A folded card also helps if your phone is damaged or locked away from you.',
        wallet1: 'Choose Wallet, check the front and back, then Print sheet.',
        wallet2: 'In the print dialog choose A4, 100% scale, and turn off headers and footers.',
        wallet3: 'Cut along the dashed lines. Put the front and back of a pair back to back, then trim the corners.',
        wallet4: 'A5 or Letter also works — the sheet scales, but check the cut lines before cutting.',
        walletTip: 'Print two copies: one for your wallet, one for a family member or your bag.',
        printT: 'Print the family sheet',
        printLead: 'The print sheet lays out four front-and-back pairs on one A4 page, so you can give copies to family members.',
        print1: 'Fill in the card once, then choose Print sheet.',
        print2: 'Print at 100%. Each pair is credit-card sized (85.6 × 54 mm).',
        print3: 'Cut out each pair, fold or glue front to back, and write the person’s name on the back if you like.',
        print4: 'Laminate or use a clear sleeve for a card that survives a wallet.',
        printTip: 'For a PDF, use “Save as PDF” in the print dialog. It is the same page, with no extra software.',
        builtinT: 'Use your phone’s built-in features too',
        builtinB: 'iPhone has Medical ID (Health app → Medical ID) and Android has Emergency information (Settings → Safety & emergency). They can be shown from the lock screen and can include emergency calls. This card is a simple backup — use both if you can.',
        faqT: 'Common questions',
        q1: 'Is my information uploaded anywhere?',
        a1: 'No. Everything is drawn in your browser. There is no server, no account and no analytics. The only copy is the one you save yourself.',
        q2: 'What if I lose the printed card?',
        a2: 'Nothing is stored on the paper except what you chose to print. Make a new one in three minutes, or keep a photo of the card in your bag.',
        q3: 'Will the text be readable on a small phone?',
        a3: 'The lock-screen layout leaves the top 30% for the clock and the bottom 12% for the camera and flashlight. Text is at least 28 px at that size. Check it once on your own phone before relying on it.',
        q4: 'Can I make cards for my family?',
        a4: 'Yes — the print sheet lays out four pairs. For different people, fill in the form again and print a second sheet, or save separate PNGs.'
      },

      privacy: {
        title: 'Privacy, in plain language',
        lead: 'This tool is built to keep your information on your own device. Here is exactly what happens, without legal language.',
        storedT: 'What is stored, and where',
        storedB: 'The card is drawn by your browser. If you tick “Remember on this device”, the form is saved in this browser’s local storage — a small private storage area on your device. If you do not tick it, the form lives in memory only and disappears when you close the tab.',
        storedLi1: 'Your form fields, stored only if you ask us to remember them.',
        storedLi2: 'Your theme, sound and language choice, so the site feels the same next time.',
        storedLi3: 'A saved PNG, only where you save it yourself (photos or downloads).',
        notT: 'What never happens',
        notB: 'There is no backend to send anything to.',
        notLi1: 'No accounts, no sign-in, no email.',
        notLi2: 'No analytics, tracking pixels or advertising.',
        notLi3: 'No network request carries your card details. The only network request is for optional fonts, which load from Google Fonts without your card data.',
        notLi4: 'No logs of what you typed.',
        rememberT: 'Remember on this device',
        rememberB: 'This is off by default. Turn it on only on a device you trust. On a shared or work device, leave it off and the form is forgotten when the tab closes. You can delete everything with one button.',
        visibleT: 'A lock screen is visible to anyone holding your phone',
        visibleB: 'That is the point — but it also means a stranger can read it. Only include what you are comfortable showing. Do not add a home address, a full date of birth, ID numbers, card numbers or passwords. Use a landmark or a partial detail instead.',
        accuracyT: 'A convenience, not a medical record',
        accuracyB: 'This card is a convenience, not a medical record. Keep your official records up to date with your doctor, and use your phone’s built-in Medical ID or emergency information as well.',
        offlineT: 'Works offline',
        offlineB: 'Once the page has loaded, everything works without a connection. Fonts fall back to fonts already on your device. You can also save the page to your device and open it later.',
        clearT: 'Delete everything',
        clearB: 'This removes the saved form, theme, sound and language settings from this browser. It cannot be undone, and it does not affect any image you already saved.',
        clearBtn: 'Clear all my data'
      },

      about: {
        title: 'About this card',
        lead: 'A small, free tool for a moment that matters. Here is why it exists, how it is built, and what it deliberately does not do.',
        whyT: 'Why this exists',
        whyB1: 'Most of us carry the information a helper needs, but it sits behind a passcode. In an emergency, the people nearby may not be able to unlock your phone, and you may not be able to tell them anything.',
        whyB2: 'This site is a simple answer to that gap: a name, one or two phone numbers, and the few medical facts that matter, somewhere they can actually be seen. Not a full medical history — just enough to start the right conversation.',
        doesT: 'What it does',
        doesB: 'The form takes about three minutes, and every field is optional. From what you enter, the site draws a finished image in your browser.',
        doesLi1: 'A lock-screen wallpaper, with the top and bottom left clear for the clock, flashlight and camera.',
        doesLi2: 'A wallet card the size of a credit card, with a front and a back.',
        doesLi3: 'An A4 sheet with four front-and-back pairs, for family members or a bag.',
        doesB2: 'You can save a PNG, copy the image, or print the sheet. A card can also include a QR code that carries your contact details as plain text — not a link to a website.',
        neverT: 'What it never does',
        neverB: 'Nothing you type is sent anywhere. There is no backend, no account system and no analytics.',
        neverLi1: 'No sign-up, no email, no password.',
        neverLi2: 'No uploads, no cloud copy, no syncing between devices.',
        neverLi3: 'No advertising, no tracking pixels, no profiling.',
        neverLi4: 'No request for a bank PIN, card number or password — and the card reminds helpers that a bank will never ask for a PIN.',
        neverLi5: 'No pretence that this replaces official records or emergency services.',
        neverB2: 'The only outside request is for the optional fonts. If they do not load, the site falls back to fonts already on your device and everything still works.',
        madeT: 'How it is made',
        madeB: 'The site is plain HTML, CSS and JavaScript: no framework, no build step, no package manager and no server. The card is drawn with the Canvas API, including the QR code, so it can run from a folder on a computer with no connection at all.',
        madeB2: 'Layouts are drawn at print resolution — 1170 × 2532 for a typical lock screen and 2480 × 3508 for A4 — so the text stays sharp on a phone and on paper. The typefaces are Fraunces and Inter; the icons and card artwork are drawn in the page itself.',
        accessT: 'Made to be read under stress',
        accessB: 'The card favours large type, strong contrast and short lines. Text on the lock-screen layout is at least 28 px at full size, and content that will not fit is shortened or dropped with a warning rather than spilling off the card.',
        accessB2: 'The site works with a keyboard, shows a visible focus ring, labels every control, and has light and dark themes. Buttons use a 44 px touch target. There is a right-to-left layout for Urdu. Motion is kept short, and switches off when your device asks for reduced motion.',
        notT: 'What it is not',
        notB: 'This card is a convenience, not a medical record. It is not a medical device, and it does not call anyone for you. In an emergency, call your local emergency number first, then use the card to help the people around you.',
        notB2: 'Keep your official records up to date with your doctor, and set up your phone’s built-in Medical ID or emergency information as well. Use both if you can.',
        helpT: 'Corrections and translations',
        helpB: 'There is no newsletter, no mailing list and no account. The site does not ask who you are, and nothing you type is used to contact you.',
        helpB2: 'All interface text lives in one file, js/strings.js, so a correction or a new language can be made in one place. The drawing code is in js/card.js. Everything is readable and can be edited or translated.',
        helpB3: 'If a phrase is wrong, unclear, or missing in your language, it can be fixed without changing the layout.'
      },

      footer: {
        tagline: 'A calm, private emergency card you make yourself.',
        links: 'Pages',
        legal: 'This card is a convenience, not a medical record. Keep your official records up to date.',
        offline: 'Works offline · No account · No tracking',
        clear: 'Clear all my data',
        langLabel: 'Interface language'
      },

      toast: {
        saved: 'Card image ready',
        copied: 'Image copied to the clipboard',
        copyFail: 'Copying is not available — use Save as image',
        cleared: 'All saved data deleted',
        rememberOff: 'Remembering is off — this form will be forgotten when you close the tab',
        photoFail: 'That image could not be read',
        photoBig: 'Please choose an image smaller than 8 MB',
        printing: 'Choose “Save as PDF” in the print dialog for a PDF'
      }
    },

    /* ---------------------------------------------------------------
     * Urdu is included as a working right-to-left example. It is not a
     * complete translation: any missing key falls back to English, and
     * the layout mirrors automatically. Add Arabic the same way.
     * --------------------------------------------------------------- */
    ur: {
      a11y: { skip: 'مواد پر جائیں', menu: 'مینو', theme: 'روشن اور تاریک تھیم', sound: 'آواز آن یا آف', lang: 'زبان', preview: 'کارڈ کا پیش منظر', canvas: 'آپ کے ہنگامی کارڈ کا پیش منظر' },
      nav: { home: 'ہوم', create: 'کارڈ بنائیں', guide: 'استعمال کا طریقہ', privacy: 'رازداری', about: 'تعارف' },
      brand: { tagline: 'ہنگامی رابطہ کارڈ' },
      common: { optional: 'اختیاری', remove: 'ہٹائیں', close: 'بند کریں', back: 'واپس', next: 'آگے', yes: 'ہاں', no: 'نہیں', copy: 'کاپی', copied: 'کاپی ہو گیا', download: 'ڈاؤن لوڈ', print: 'پرنٹ', saved: 'محفوظ', language: 'زبان', step: 'مرحلہ {n} از 5' },
      home: {
        eyebrow: 'نجی · آف لائن · بغیر اکاؤنٹ',
        h1a: 'ایک ہنگامی کارڈ جو کام کرتا ہے',
        h1b: 'جب آپ کا فون لاک ہو۔',
        lead: 'وہ چند باتیں لکھیں جو کسی اجنبی یا طبی مدد کرنے والے کو معلوم ہونی چاہئیں — فون کی لاک اسکرین پر یا بٹوے میں۔ صرف تین منٹ لگیں گے۔',
        cta: 'میرا کارڈ بنائیں',
        ctaSecondary: 'طریقہ دیکھیں',
        trustTitle: 'کارڈ کیوں مدد کرتا ہے',
        trust1t: 'لاک کھولنے کی ضرورت نہیں',
        trust1b: 'مدد کرنے والا دیکھ سکتا ہے کس کو کال کرنی ہے اور کیا جاننا ضروری ہے۔',
        trust2t: 'کچھ بھی آپ کے آلے سے باہر نہیں جاتا',
        trust2b: 'کارڈ آپ کے براؤزر میں بنتا ہے۔ نہ اکاؤنٹ، نہ اپلوڈ، نہ ٹریکنگ — آف لائن بھی چلتا ہے۔',
        trust3t: 'آپ طے کرتے ہیں کیا دکھے',
        trust3b: 'ہر خانہ اختیاری ہے۔ رازداری کی جانچ خطرناک معلومات کی نشاندہی کرتی ہے۔',
        howTitle: 'طریقہ',
        howLead: 'تین قدم، پھر فون رکھ دیں۔',
        how1t: 'جو ضروری ہے لکھیں',
        how1b: 'نام، ایک یا دو رابطے، خون کی قسم اور الرجی۔ جو نہ دکھانا چاہیں وہ چھوڑ دیں۔',
        how2t: 'شکل چنیں',
        how2b: 'چار واضح تھیمز، لاک اسکرین یا بٹوے کے لیے۔ پرنٹ معیار پر بنتے ہیں۔',
        how3t: 'محفوظ کریں اور لگائیں',
        how3b: 'تصویر محفوظ کریں اور لاک اسکرین بنائیں، یا پرنٹ کر کے بٹوے میں رکھیں۔',
        warnTitle: 'لاک اسکرین ہر اس شخص کو نظر آتی ہے جس کے ہاتھ میں فون ہو',
        warnBody: 'صرف وہی لکھیں جو آپ اجنبی کو دکھانے پر راضی ہوں۔ گھر کا پتہ، مکمل تاریخِ پیدائش، شناختی یا کارڈ نمبر ہرگز نہ لکھیں۔',
        builtinTitle: 'یہ آپ کے فون کے ساتھ کام کرتا ہے',
        builtinBody: 'زیادہ تر فونز میں بلٹ اِن میڈیکل آئی ڈی ہوتی ہے۔ یہ کارڈ ایک سادہ بیک اپ ہے — دونوں استعمال کریں۔',
        finalTitle: 'تین منٹ میں تیار۔',
        finalBody: 'آپ کی معلومات براؤزر میں رہتی ہیں۔ آپ کبھی بھی بدل یا مٹا سکتے ہیں۔',
        finalCta: 'کارڈ شروع کریں'
      },
      form: {
        title: 'اپنا کارڈ بنائیں',
        lead: 'جو بتانا چاہیں وہ لکھیں۔ ہر خانہ اختیاری ہے اور پیش منظر فوراً بدلتا ہے۔',
        progress: 'کارڈ کی تکمیل',
        progressHint: 'صرف بھرے ہوئے خانوں کی گنتی ہوتی ہے۔',
        step1: 'میرے بارے میں', step1d: 'یہ کارڈ کس کا ہے۔',
        step2: 'ہنگامی رابطے', step2d: 'کس کو پہلے کال کرنی ہے۔',
        step3: 'طبی معلومات', step3d: 'صرف وہ جو مدد کرنے والے کو چاہیے۔',
        step4: 'رقم اور اکاؤنٹس', step4d: 'وہ ہاٹ لائن نمبر جو دکھانا ہیں۔',
        step5: 'نوٹ', step5d: 'ایک مختصر سطر۔',
        nameLabel: 'نام', namePh: 'مثلاً عائشہ خان', nameHint: 'پہلا نام اور آخری حرف کافی ہے۔',
        relLabel: 'رشتہ', phoneLabel: 'فون',
        avatarLabel: 'تصویر', avatarEmoji: 'ایموجی', avatarPhoto: 'تصویر', avatarRemove: 'کوئی تصویر نہیں', avatarHint: 'تصویر آپ کے براؤزر میں چھوٹی ہوتی ہے، کہیں اپلوڈ نہیں ہوتی۔',
        spokenLabel: 'پسندیدہ زبان', spokenPh: 'مثلاً اردو، English', spokenHint: 'مدد کرنے والے کو مناسب شخص ڈھونڈنے میں مدد دیتا ہے۔',
        contactN: 'رابطہ {n}', contactNamePh: 'مثلاً بلال خان', contactRelPh: 'رشتہ (مثلاً شوہر)', contactPhonePh: 'فون (مثلاً 0300 1234567)',
        contactFirst: 'پہلے کال کریں', contactFirstHint: 'یہ رابطہ بڑا اور فون آئیکن کے ساتھ دکھتا ہے۔',
        bloodLabel: 'خون کی قسم', bloodPh: 'اگر معلوم ہو تو چنیں',
        allergiesLabel: 'الرجی', allergiesPh: 'مثلاً پنسلین، مونگ پھلی',
        medsLabel: 'ادویات', medsPh: 'مثلاً انسولین، رات کو 10 یونٹ',
        conditionsLabel: 'بیماریاں', conditionsPh: 'مثلاً ذیابیطس، دمہ',
        donorLabel: 'اعضا عطیہ', donorPh: 'نہ بتانا پسند ہے', doctorLabel: 'ڈاکٹر یا اسپتال', doctorPh: 'مثلاً سٹی اسپتال، ڈاکٹر علی',
        bankLabel: 'بینک اور کارڈ ہاٹ لائن', bankEntry: 'ہاٹ لائن {n}', bankNamePh: 'بینک یا کارڈ کا نام', bankPhonePh: 'ہاٹ لائن نمبر',
        bankPin: 'میرا بینک فون پر کبھی پن یا کوڈ نہیں مانگتا۔', bankHint: 'صرف وہ نمبر لکھیں جو اجنبی کو دکھانے میں حرج نہ ہو۔ کارڈ نمبر یا پن ہرگز نہ لکھیں۔',
        notesLabel: 'ایک سطر کا نوٹ', notesPh: 'مثلاً بائیں کان میں سماعت کی مشین ہے', notesHint: 'مختصر رکھیں — ایک سطر بہترین ہے۔',
        rememberLabel: 'اس آلے پر یاد رکھیں', rememberHint: 'فارم صرف آپ کے براؤزر میں محفوظ ہوتا ہے۔ مشترکہ آلے پر بند رکھیں۔',
        clearLabel: 'میرا سارا ڈیٹا مٹائیں', clearConfirm: 'اس براؤزر سے محفوظ کارڈ اور ترتیبات مٹا دیں؟ یہ واپس نہیں ہو سکتا۔', clearDone: 'تمام محفوظ ڈیٹا مٹ گیا۔',
        privacyTitle: 'رازداری کی جانچ', privacyOk: 'یہاں کچھ بھی عوامی طور پر دکھانے کے لیے خطرناک نہیں لگتا۔',
        privacyIntro: 'یہ معلومات آپ کی شناخت کے لیے استعمال ہو سکتی ہیں۔ ہٹانے کا سوچیں۔',
        privacyAddress: 'گھر کا پتہ لگتا ہے۔ بہتر: کوئی نشانی لکھیں یا چھوڑ دیں۔',
        privacyDob: 'مکمل تاریخِ پیدائش لگتی ہے۔ بہتر: صرف سال، یا چھوڑ دیں۔',
        privacyId: 'شناختی دستاویز کا نمبر لگتا ہے۔ لاک اسکرین پر ہرگز نہ دکھائیں۔',
        privacyCard: 'کارڈ نمبر لگتا ہے۔ لاک اسکرین پر ہرگز نہ دکھائیں۔',
        privacyFix: 'ترمیم',
        fitOk: 'سب کچھ آ رہا ہے۔', fitShrunk: 'متن تھوڑا چھوٹا کیا گیا تاکہ سب آ جائے۔',
        fitDropped: 'کارڈ بھر گیا۔ چھوڑا گیا: {list}۔ کچھ کم کریں یا دوسرا کارڈ بنائیں۔',
        fitOverflow: 'ایک کارڈ کے لیے پھر بھی بہت زیادہ ہے۔ لمبے خانے مختصر کریں۔',
        previewTitle: 'پیش منظر', previewLock: 'لاک اسکرین', previewWallet: 'بٹوہ', previewPrint: 'پرنٹ شیٹ', previewFront: 'سامنے', previewBack: 'پیچھے', previewFlip: 'کارڈ پلٹیں', previewOpen: 'پیش منظر', previewClose: 'بند کریں', previewGuide: 'محفوظ حصے دکھائیں', previewGuideTop: 'گھڑی اور اطلاعات', previewGuideBottom: 'ٹارچ اور کیمرہ', previewEmpty: 'لکھنا شروع کریں تو کارڈ بنے گا۔',
        themeLabel: 'کارڈ کی شکل', themeDaylight: 'صبح', themeMidnight: 'آدھی رات', themeCalm: 'سکون', themeMedical: 'کلینک',
        qrLabel: 'کیو آر کوڈ شامل کریں', qrHint: 'آپ کے رابطے سادہ متن کے طور پر، ویب لنک نہیں۔ آپ کے آلے پر بنتا ہے۔', qrTooLong: 'کیو آر کوڈ کے لیے متن زیادہ ہے۔ مختصر کریں۔',
        exportTitle: 'محفوظ کریں اور استعمال کریں', exportSave: 'تصویر محفوظ کریں', exportCopy: 'تصویر کاپی کریں', exportPrint: 'پرنٹ شیٹ',
        exportPdfNote: 'پی ڈی ایف کے لیے پرنٹ ڈائلاگ میں “Save as PDF” چنیں۔ کوئی اضافی سافٹ ویئر نہیں۔',
        exportHold: 'تصویر کو دبا کر رکھیں (یا رائٹ کلک) اور “Save image” چنیں۔ یہ ہمیشہ کام کرتا ہے۔',
        exportDownload: 'PNG ڈاؤن لوڈ', exportShare: 'شیئر…', exportPreparing: 'کارڈ تیار ہو رہا ہے…',
        exportSavedTitle: 'آپ کا کارڈ تیار ہے', exportSavedBody: 'تصویر میں محفوظ کریں، پھر لاک اسکرین بنائیں۔',
        exportPrintTip: 'مشورہ: 100% پرنٹ کریں، “fit to page” بند رکھیں۔',
        exportCopyFail: 'اس براؤزر میں کاپی دستیاب نہیں۔ تصویر محفوظ کریں۔',
        exportFail: 'تصویر نہیں بن سکی۔ دوسرا براؤزر آزمائیں یا پرنٹ سے PDF بنائیں۔',
        layoutLabel: 'کارڈ کی ترتیب'
      },
      card: {
        callFirst: 'پہلے کال کریں', alsoCall: 'یہ بھی کال کریں', blood: 'خون کی قسم', allergies: 'الرجی', meds: 'ادویات', conditions: 'بیماریاں', donor: 'اعضا عطیہ', doctor: 'ڈاکٹر / اسپتال', bank: 'بینک ہاٹ لائن', pinRule: 'میرا بینک فون پر کبھی پن یا کوڈ نہیں مانگتا۔', notes: 'نوٹ', speaks: 'زبان: {lang}', scan: 'رابطوں کے لیے اسکین کریں', notRecord: 'ہنگامی رابطہ کارڈ · طبی ریکارڈ نہیں', donorYes: 'اعضا عطیہ کرنے والا', donorNo: 'اعضا عطیہ نہیں', noName: 'آپ کا نام',
        printTitle: 'ہنگامی رابطہ کارڈز', printHint: 'ڈیش لائنوں پر کاٹیں۔ ہر جوڑے کا سامنے اور پیچھے ساتھ رکھیں۔', printPair: 'جوڑا {n} از 4', printScale: '100% پر پرنٹ کریں · A4'
      },
      guide: {
        title: 'کارڈ کیسے استعمال کریں', lead: 'دو جگہیں بہترین ہیں: لاک اسکرین اور بٹوے کا کارڈ۔',
        lockT: 'لاک اسکرین بنائیں', lockLead: 'یہی ورژن سب سے پہلے نظر آتا ہے۔',
        walletT: 'بٹوے کا کارڈ پرنٹ کریں', walletLead: 'کاغذ کی بیٹری ختم نہیں ہوتی۔',
        printT: 'خاندان کی شیٹ پرنٹ کریں', printLead: 'ایک A4 صفحے پر چار جوڑے ہوتے ہیں۔',
        builtinT: 'فون کی بلٹ اِن سہولت بھی استعمال کریں', builtinB: 'آئی فون میں Medical ID اور اینڈرائیڈ میں Emergency information ہوتی ہے۔ یہ کارڈ ایک بیک اپ ہے — دونوں استعمال کریں۔',
        faqT: 'عام سوالات'
      },
      privacy: {
        title: 'رازداری، آسان زبان میں', lead: 'یہ ٹول آپ کی معلومات آپ کے آلے پر رکھتا ہے۔',
        storedT: 'کیا محفوظ ہوتا ہے', storedB: 'اگر آپ “اس آلے پر یاد رکھیں” چنیں تو فارم اسی براؤزر میں محفوظ ہوتا ہے۔ ورنہ صرف ٹیب کھلی رہنے تک۔',
        notT: 'کیا کبھی نہیں ہوتا', notB: 'کوئی سرور نہیں جس پر کچھ بھیجا جائے۔',
        visibleT: 'لاک اسکرین سب کو نظر آتی ہے', visibleB: 'صرف وہی لکھیں جو آپ اجنبی کو دکھا سکیں۔',
        accuracyT: 'سہولت، طبی ریکارڈ نہیں', accuracyB: 'یہ کارڈ سہولت کے لیے ہے، طبی ریکارڈ نہیں۔ اپنا سرکاری ریکارڈ اپ ڈیٹ رکھیں۔',
        offlineT: 'آف لائن چلتا ہے', offlineB: 'صفحہ کھلنے کے بعد انٹرنیٹ کی ضرورت نہیں۔',
        clearT: 'سب کچھ مٹائیں', clearB: 'اس براؤزر سے محفوظ فارم اور ترتیبات مٹ جاتی ہیں۔', clearBtn: 'میرا سارا ڈیٹا مٹائیں'
      },
      about: {
        title: 'اس کارڈ کے بارے میں',
        lead: 'ایک چھوٹا، مفت آلہ اُس لمحے کے لیے جو اہم ہو۔ یہاں ہے کہ یہ کیوں موجود ہے، کیسے بنایا گیا ہے، اور جان بوجھ کر کیا نہیں کرتا۔',
        whyT: 'یہ کیوں موجود ہے',
        whyB1: 'ہم میں سے زیادہ تر وہ معلومات ساتھ رکھتے ہیں جو مدد کرنے والے کو چاہیے، مگر وہ پاس کوڈ کے پیچھے ہوتی ہیں۔ ہنگامی صورت میں آس پاس کے لوگ آپ کا فون نہیں کھول سکتے، اور آپ خود کچھ بتا نہیں سکتے۔',
        whyB2: 'یہ سائٹ اسی خلا کا سادہ جواب ہے: ایک نام، ایک یا دو فون نمبر، اور چند ضروری طبی باتیں — ایسی جگہ جہاں وہ واقعی نظر آ سکیں۔ مکمل طبی تاریخ نہیں، صرف اتنا کہ درست مدد شروع ہو سکے۔',
        doesT: 'یہ کیا کرتا ہے',
        doesB: 'فارم میں تقریباً تین منٹ لگتے ہیں، اور ہر خانہ اختیاری ہے۔ آپ کی لکھی باتوں سے سائٹ آپ کے براؤزر میں ایک مکمل تصویر بناتی ہے۔',
        doesLi1: 'لاک اسکرین کے لیے وال پیپر، جس کا اوپر اور نیچے حصہ گھڑی، ٹارچ اور کیمرے کے لیے خالی رہتا ہے۔',
        doesLi2: 'بٹوے کا کارڈ، کریڈٹ کارڈ کے سائز کا، سامنے اور پیچھے والا۔',
        doesLi3: 'A4 شیٹ جس پر چار سامنے اور پیچھے کے جوڑے ہوں — خاندان یا بیگ کے لیے۔',
        doesB2: 'آپ PNG محفوظ کر سکتے ہیں، تصویر کاپی کر سکتے ہیں یا شیٹ پرنٹ کر سکتے ہیں۔ کارڈ میں ایک کیو آر کوڈ بھی ہو سکتا ہے جو آپ کے رابطے سادہ متن کے طور پر رکھتا ہے — کسی ویب سائٹ کا لنک نہیں۔',
        neverT: 'یہ کبھی کیا نہیں کرتا',
        neverB: 'آپ کا لکھا ہوا کہیں نہیں بھیجا جاتا۔ نہ کوئی سرور، نہ اکاؤنٹ، نہ تجزیہ۔',
        neverLi1: 'نہ سائن اپ، نہ ای میل، نہ پاس ورڈ۔',
        neverLi2: 'نہ اپلوڈ، نہ کلاؤڈ کاپی، نہ آلات کے درمیان ہم آہنگی۔',
        neverLi3: 'نہ اشتہارات، نہ ٹریکنگ پکسلز، نہ پروفائلنگ۔',
        neverLi4: 'بینک پن، کارڈ نمبر یا پاس ورڈ کبھی نہیں مانگا جاتا — اور کارڈ مدد کرنے والے کو یاد دلاتا ہے کہ بینک کبھی پن نہیں پوچھتا۔',
        neverLi5: 'یہ دکھاوا نہیں کہ یہ سرکاری ریکارڈ یا ہنگامی خدمات کی جگہ لے سکتا ہے۔',
        neverB2: 'صرف باہر کی درخواست اختیاری فونٹس کے لیے ہوتی ہے۔ اگر وہ نہ آئیں تو سائٹ آپ کے آلے کے فونٹس استعمال کرتی ہے اور سب کچھ چلتا رہتا ہے۔',
        madeT: 'یہ کیسے بنایا گیا ہے',
        madeB: 'یہ سائٹ سادہ HTML، CSS اور JavaScript ہے: نہ فریم ورک، نہ بلڈ مرحلہ، نہ پیکج مینیجر، نہ سرور۔ کارڈ Canvas API سے بنتا ہے، کیو آر کوڈ سمیت، اس لیے یہ بغیر انٹرنیٹ کے بھی کمپیوٹر کے فولڈر سے چل سکتی ہے۔',
        madeB2: 'ترتیبیں پرنٹ معیار پر بنتی ہیں — عام لاک اسکرین کے لیے 1170 × 2532 اور A4 کے لیے 2480 × 3508 — تاکہ متن فون اور کاغذ پر صاف رہے۔ فونٹس Fraunces اور Inter ہیں؛ آئیکن اور کارڈ کی نقش و نگار اسی صفحے میں بنتی ہے۔',
        accessT: 'دباؤ کے لمحے میں پڑھنے کے لیے',
        accessB: 'کارڈ میں بڑا متن، واضح تضاد اور مختصر سطریں رکھی گئی ہیں۔ لاک اسکرین پر متن مکمل سائز میں کم از کم 28 پکسل ہے، اور جو مواد نہ سما سکے اسے تنبیہ کے ساتھ چھوٹا یا خارج کیا جاتا ہے، کارڈ سے باہر نہیں نکالا جاتا۔',
        accessB2: 'سائٹ کی بورڈ سے چلتی ہے، فوکس واضح دکھاتی ہے، ہر کنٹرول کا لیبل ہے، اور روشن و تاریک تھیم موجود ہیں۔ بٹن کم از کم 44 پکسل کے ہیں۔ اردو کے لیے دائیں سے بائیں ترتیب ہے۔ حرکت مختصر رکھی گئی ہے اور کم حرکت کی درخواست پر بند ہو جاتی ہے۔',
        notT: 'یہ کیا نہیں ہے',
        notB: 'یہ کارڈ سہولت کے لیے ہے، طبی ریکارڈ نہیں۔ یہ طبی آلہ نہیں ہے اور آپ کی طرف سے کسی کو کال نہیں کرتا۔ ہنگامی صورت میں پہلے اپنے علاقے کا ہنگامی نمبر ملائیں، پھر کارڈ سے آس پاس کے لوگوں کی مدد لیں۔',
        notB2: 'اپنا سرکاری ریکارڈ ڈاکٹر کے پاس اپ ڈیٹ رکھیں، اور فون میں بلٹ اِن Medical ID یا ہنگامی معلومات بھی ترتیب دیں۔ ممکن ہو تو دونوں استعمال کریں۔',
        helpT: 'اصلاحات اور تراجم',
        helpB: 'نہ کوئی نیوز لیٹر، نہ میلنگ لسٹ، نہ اکاؤنٹ۔ سائٹ آپ سے یہ نہیں پوچھتی کہ آپ کون ہیں، اور آپ کا لکھا ہوا آپ سے رابطے کے لیے استعمال نہیں ہوتا۔',
        helpB2: 'تمام انٹرفیس متن ایک فائل js/strings.js میں ہے، اس لیے اصلاح یا نئی زبان ایک ہی جگہ سے ہو سکتی ہے۔ نقش بنانے کا کوڈ js/card.js میں ہے۔ سب کچھ پڑھا، بدلا اور ترجمہ کیا جا سکتا ہے۔',
        helpB3: 'اگر کوئی جملہ غلط، مبہم یا آپ کی زبان میں موجود نہ ہو تو اسے ترتیب بدلے بغیر درست کیا جا سکتا ہے۔'
      },
      footer: { tagline: 'ایک پرسکون، نجی ہنگامی کارڈ جو آپ خود بناتے ہیں۔', links: 'صفحات', legal: 'یہ کارڈ سہولت کے لیے ہے، طبی ریکارڈ نہیں۔', offline: 'آف لائن · بغیر اکاؤنٹ · بغیر ٹریکنگ', clear: 'میرا سارا ڈیٹا مٹائیں', langLabel: 'انٹرفیس کی زبان' },
      toast: { copied: 'تصویر کاپی ہو گئی', saved: 'کارڈ تیار ہے', cleared: 'تمام ڈیٹا مٹ گیا', rememberOff: 'یاد رکھنا بند ہے — ٹیب بند ہونے پر فارم بھول جائے گا' }
    }
  };

  var LANGS = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ur', label: 'اردو', dir: 'rtl' }
  ];

  var current = 'en';

  function lookup(dict, path) {
    var parts = path.split('.');
    var node = dict;
    for (var i = 0; i < parts.length; i++) {
      if (!node || typeof node !== 'object') return null;
      node = node[parts[i]];
    }
    return typeof node === 'string' ? node : null;
  }

  function format(str, vars) {
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, function (m, key) {
      return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : m;
    });
  }

  var I18N = {
    langs: LANGS,
    get: function () { return current; },
    dir: function () {
      var meta = LANGS.filter(function (l) { return l.code === current; })[0];
      return meta ? meta.dir : 'ltr';
    },
    set: function (code) {
      current = STRINGS[code] ? code : 'en';
      return current;
    },
    t: function (path, vars) {
      var out = lookup(STRINGS[current] || STRINGS.en, path);
      if (out == null) out = lookup(STRINGS.en, path);
      if (out == null) out = path;
      return format(out, vars);
    },
    has: function (path) {
      return lookup(STRINGS[current] || {}, path) != null;
    }
  };

  global.ICE_STRINGS = STRINGS;
  global.ICE_LANGS = LANGS;
  global.ICE_I18N = I18N;
  global.t = I18N.t.bind(I18N);
})(window);
