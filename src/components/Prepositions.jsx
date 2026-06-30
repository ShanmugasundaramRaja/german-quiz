import React, { useMemo, useState } from "react";

const germanPrepositionsData = {
  meta: {
    title: "German Prepositions up to B2",
    scope: "A1 to B2",
    purpose:
      "Structured reference for German prepositions by case, function, patterns, contractions, contrasts, tense interactions, and common mistakes.",
  },

  quickClassification: [
    {
      type: "Accusative prepositions",
      rule: "Always accusative",
      mainQuestion: "Through what? For whom? Against what?",
      examples: ["durch", "für", "gegen", "ohne", "um"],
    },
    {
      type: "Dative prepositions",
      rule: "Always dative",
      mainQuestion: "From where? With whom? At where? Since when?",
      examples: [
        "aus",
        "bei",
        "mit",
        "nach",
        "seit",
        "von",
        "zu",
        "gegenüber",
        "außer",
      ],
    },
    {
      type: "Genitive prepositions",
      rule: "Usually genitive, especially in formal written German",
      mainQuestion: "Because of what? Despite what? During what?",
      examples: [
        "wegen",
        "trotz",
        "während",
        "statt",
        "anstatt",
        "innerhalb",
        "außerhalb",
      ],
    },
    {
      type: "Two-way prepositions",
      rule: "Accusative for direction/change, dative for location/state",
      mainQuestion: "Wohin? vs Wo?",
      examples: [
        "an",
        "auf",
        "hinter",
        "in",
        "neben",
        "über",
        "unter",
        "vor",
        "zwischen",
      ],
    },
  ],

  goldenRules: [
    "Learn every preposition together with its case, not as an isolated translation.",
    "Do not translate directly from English, because one English preposition often maps to several German choices depending on context.",
    "With two-way prepositions, use accusative for direction or change of location and dative for static location or resulting position.",
    "Prepositions do not determine the tense of the clause, but many temporal prepositions interact strongly with present, past, and future meaning.",
  ],

  masterTable: [
    {
      preposition: "durch",
      meanings: ["through", "by means of"],
      case: "Accusative",
      level: "A2",
      coreUse: ["Movement through space", "Means"],
      example: "Wir gehen durch den Park.",
    },
    {
      preposition: "für",
      meanings: ["for"],
      case: "Accusative",
      level: "A1-A2",
      coreUse: ["Recipient", "Purpose", "Value"],
      example: "Das Geschenk ist für dich.",
    },
    {
      preposition: "gegen",
      meanings: ["against", "around/about (time in some uses)"],
      case: "Accusative",
      level: "A2-B1",
      coreUse: ["Opposition", "Contact", "Approximation"],
      example: "Er läuft gegen die Wand.",
    },
    {
      preposition: "ohne",
      meanings: ["without"],
      case: "Accusative",
      level: "A2",
      coreUse: ["Absence", "Lack"],
      example: "Ich trinke Kaffee ohne Zucker.",
    },
    {
      preposition: "um",
      meanings: ["around", "at", "for"],
      case: "Accusative",
      level: "A2",
      coreUse: ["Clock time", "Around something", "Approximate quantity"],
      example: "Wir treffen uns um acht Uhr.",
    },
    {
      preposition: "bis",
      meanings: ["until", "up to"],
      case: "Usually accusative-free / structure-sensitive",
      level: "A2-B1",
      coreUse: ["Endpoint in time/place"],
      example: "Bis morgen. / bis Berlin",
    },
    {
      preposition: "entlang",
      meanings: ["along"],
      case: "Accusative or postposition pattern",
      level: "B1-B2",
      coreUse: ["Along a path"],
      example: "Sie gehen die Straße entlang.",
    },
    {
      preposition: "aus",
      meanings: ["out of", "from", "made of"],
      case: "Dative",
      level: "A2",
      coreUse: ["Origin", "Source", "Material"],
      example: "Sie kommt aus der Schweiz.",
    },
    {
      preposition: "bei",
      meanings: ["at", "near", "with"],
      case: "Dative",
      level: "A2",
      coreUse: ["Place near", "With persons/firms", "Event settings"],
      example: "Ich wohne bei meiner Tante.",
    },
    {
      preposition: "mit",
      meanings: ["with", "by"],
      case: "Dative",
      level: "A1-A2",
      coreUse: ["Company", "Instrument", "Means"],
      example: "Ich fahre mit dem Bus.",
    },
    {
      preposition: "nach",
      meanings: ["to", "after", "according to"],
      case: "Dative",
      level: "A2-B1",
      coreUse: ["To cities/countries", "After time", "According to"],
      example: "Ich fahre nach Berlin.",
    },
    {
      preposition: "seit",
      meanings: ["since", "for"],
      case: "Dative",
      level: "A2-B1",
      coreUse: ["Starting point continuing until now"],
      example: "Ich wohne seit einem Jahr hier.",
    },
    {
      preposition: "von",
      meanings: ["from", "of", "by"],
      case: "Dative",
      level: "A2",
      coreUse: [
        "Origin",
        "Possession substitute",
        "Passive agent in some uses",
      ],
      example: "Das ist ein Geschenk von meinem Bruder.",
    },
    {
      preposition: "zu",
      meanings: ["to", "at"],
      case: "Dative",
      level: "A2",
      coreUse: ["To people", "Institutions", "Events"],
      example: "Ich gehe zum Arzt.",
    },
    {
      preposition: "gegenüber",
      meanings: ["opposite", "toward"],
      case: "Dative",
      level: "B1",
      coreUse: ["Spatial/oppositional relation"],
      example: "Das Café liegt der Bank gegenüber.",
    },
    {
      preposition: "außer",
      meanings: ["except for", "besides"],
      case: "Dative",
      level: "B1",
      coreUse: ["Exception", "Addition"],
      example: "Außer meiner Schwester kommt niemand.",
    },
    {
      preposition: "entgegen",
      meanings: ["contrary to", "towards"],
      case: "Dative",
      level: "B2",
      coreUse: ["Against expectation", "Movement toward"],
      example: "Entgegen dem Plan fahren wir heute nicht.",
    },
    {
      preposition: "laut",
      meanings: ["according to"],
      case: "Dative/Genitive variation",
      level: "B2",
      coreUse: ["Source", "Reference"],
      example: "Laut einem Bericht ...",
    },
    {
      preposition: "gemäß",
      meanings: ["according to", "in accordance with"],
      case: "Dative",
      level: "B2",
      coreUse: ["Formal reference"],
      example: "Gemäß dem Vertrag ...",
    },
    {
      preposition: "zufolge",
      meanings: ["according to"],
      case: "Dative, usually after noun",
      level: "B2",
      coreUse: ["Source", "Reference"],
      example: "Einem Bericht zufolge ...",
    },
    {
      preposition: "wegen",
      meanings: ["because of"],
      case: "Genitive, often dative in speech",
      level: "B1-B2",
      coreUse: ["Cause"],
      example: "Wegen des Regens bleiben wir zu Hause.",
    },
    {
      preposition: "trotz",
      meanings: ["despite"],
      case: "Genitive, often dative in speech",
      level: "B1-B2",
      coreUse: ["Concession"],
      example: "Trotz des Regens gehen wir spazieren.",
    },
    {
      preposition: "während",
      meanings: ["during"],
      case: "Genitive as preposition",
      level: "B1-B2",
      coreUse: ["Time span"],
      example: "Während des Films war es still.",
    },
    {
      preposition: "statt",
      alt: ["anstatt"],
      meanings: ["instead of"],
      case: "Genitive, often dative in speech",
      level: "B1-B2",
      coreUse: ["Replacement", "Substitution"],
      example: "Statt eines Autos kauft er ein Fahrrad.",
    },
    {
      preposition: "innerhalb",
      meanings: ["within"],
      case: "Genitive",
      level: "B2",
      coreUse: ["Inside a limit", "Often abstract or spatial"],
      example: "innerhalb des Gebäudes",
    },
    {
      preposition: "außerhalb",
      meanings: ["outside of"],
      case: "Genitive",
      level: "B2",
      coreUse: ["Outside a limit"],
      example: "außerhalb der Stadt",
    },
    {
      preposition: "oberhalb",
      meanings: ["above"],
      case: "Genitive",
      level: "B2",
      coreUse: ["Above a reference point"],
      example: "oberhalb des Dorfes",
    },
    {
      preposition: "unterhalb",
      meanings: ["below"],
      case: "Genitive",
      level: "B2",
      coreUse: ["Below a reference point"],
      example: "unterhalb der Brücke",
    },
    {
      preposition: "diesseits",
      meanings: ["on this side of"],
      case: "Genitive",
      level: "B2",
      coreUse: ["Formal/literary location"],
      example: "diesseits des Flusses",
    },
    {
      preposition: "jenseits",
      meanings: ["on the other side of"],
      case: "Genitive",
      level: "B2",
      coreUse: ["Formal/literary location"],
      example: "jenseits der Grenze",
    },
    {
      preposition: "beiderseits",
      meanings: ["on both sides of"],
      case: "Genitive",
      level: "B2",
      coreUse: ["Formal/literary location"],
      example: "beiderseits der Straße",
    },
    {
      preposition: "an",
      meanings: ["at", "on", "to"],
      case: "Two-way",
      level: "A2-B1",
      coreUse: [
        "Edge/contact points",
        "Vertical surfaces",
        "Official places",
        "Dates",
      ],
      example: "am Fenster / ans Fenster",
    },
    {
      preposition: "auf",
      meanings: ["on", "onto"],
      case: "Two-way",
      level: "A2-B1",
      coreUse: [
        "Horizontal surfaces",
        "Events",
        "Institutions in some fixed phrases",
      ],
      example: "auf dem Tisch / auf den Tisch",
    },
    {
      preposition: "hinter",
      meanings: ["behind"],
      case: "Two-way",
      level: "A2-B1",
      coreUse: ["Position behind"],
      example: "hinter dem Haus / hinter das Haus",
    },
    {
      preposition: "in",
      meanings: ["in", "into"],
      case: "Two-way",
      level: "A1-A2",
      coreUse: ["Inside spaces", "Countries with article", "Abstract fields"],
      example: "im Haus / ins Haus",
    },
    {
      preposition: "neben",
      meanings: ["next to"],
      case: "Two-way",
      level: "A2",
      coreUse: ["Side-by-side location/direction"],
      example: "neben dem Auto / neben das Auto",
    },
    {
      preposition: "über",
      meanings: ["over", "above", "about"],
      case: "Two-way / other idiomatic uses",
      level: "A2-B1",
      coreUse: ["Above", "Across", "Topic"],
      example: "über dem Tisch / über den Tisch",
    },
    {
      preposition: "unter",
      meanings: ["under"],
      case: "Two-way",
      level: "A2",
      coreUse: ["Under/below"],
      example: "unter dem Tisch / unter den Tisch",
    },
    {
      preposition: "vor",
      meanings: ["in front of", "before"],
      case: "Two-way / temporal",
      level: "A2-B1",
      coreUse: ["Front position", "Before time"],
      example: "vor dem Haus / vor das Haus; vor dem Essen",
    },
    {
      preposition: "zwischen",
      meanings: ["between"],
      case: "Two-way",
      level: "A2-B1",
      coreUse: ["Between two/more points"],
      example: "zwischen den Häusern / zwischen die Häuser",
    },
    {
      preposition: "über ... hinaus",
      meanings: ["beyond"],
      case: "Prepositional phrase",
      level: "B2",
      coreUse: ["Extension beyond limit"],
      example: "über das Ziel hinaus",
    },
    {
      preposition: "in Bezug auf",
      meanings: ["with regard to"],
      case: "Accusative phrase",
      level: "B2",
      coreUse: ["Reference", "Topic"],
      example: "In Bezug auf das Projekt ...",
    },
    {
      preposition: "hinsichtlich",
      alt: ["bezüglich"],
      meanings: ["regarding"],
      case: "Genitive",
      level: "B2",
      coreUse: ["Formal reference"],
      example: "hinsichtlich des Vertrags",
    },
    {
      preposition: "ab",
      meanings: ["from", "as of"],
      case: "Mostly dative-free or with dative phrase use",
      level: "B1-B2",
      coreUse: ["Start point in time/place"],
      example: "ab morgen",
    },
    {
      preposition: "von ... aus",
      meanings: ["from ..."],
      case: "Dative phrase",
      level: "B1",
      coreUse: ["Starting point"],
      example: "von Berlin aus",
    },
    {
      preposition: "bis zu",
      meanings: ["up to"],
      case: "Dative",
      level: "B1",
      coreUse: ["Endpoint with article/noun phrase"],
      example: "bis zur Kreuzung",
    },
    {
      preposition: "um ... herum",
      meanings: ["around"],
      case: "Accusative phrase",
      level: "B1-B2",
      coreUse: ["Circular movement/location"],
      example: "um den Tisch herum",
    },
  ],

  byCase: {
    accusative: {
      rule: "These always require accusative after them, regardless of motion or tense.",
      prepositions: ["durch", "für", "gegen", "ohne", "um"],
      specialMembers: [
        "bis in special endpoint uses; often structure-dependent",
        "entlang in common accusative usage, often after the noun phrase",
      ],
      examples: [
        "Wir gehen durch den Tunnel.",
        "Das Paket ist für meinen Bruder.",
        "Ohne den Schlüssel komme ich nicht rein.",
        "Um acht Uhr beginnt der Kurs.",
      ],
      pointsToWatch: [
        "Bis often appears without an article in time/place expressions: bis morgen, bis Berlin.",
        "With an article or expanded phrase, you often get bis zu + dative: bis zur Kreuzung.",
        "Entlang often comes after the noun phrase in standard usage: die Straße entlang.",
      ],
    },
    dative: {
      rule: "These always require dative.",
      prepositions: [
        "aus",
        "bei",
        "mit",
        "nach",
        "seit",
        "von",
        "zu",
        "gegenüber",
        "außer",
        "entgegen",
        "laut",
        "gemäß",
        "zufolge",
      ],
      examples: [
        "Ich komme aus der Schweiz.",
        "Wir fahren mit dem Bus nach Berlin.",
        "Seit dem letzten Jahr wohnt er hier.",
        "Das Kino ist dem Rathaus gegenüber.",
      ],
      pointsToWatch: [
        "Nach is used for cities, countries without article, compass directions, and 'after'.",
        "Zu is used with people, professions, institutions, many shops, and events: zu meiner Freundin, zum Arzt, zur Arbeit.",
        "Bei often means 'at someone’s place', 'near', or 'with a company': bei Siemens, bei meiner Tante.",
      ],
    },
    genitive: {
      rule: "These are especially important from B1 into B2 because formal writing expects them more consistently, even though spoken German often replaces genitive with dative for some of them.",
      prepositions: [
        "wegen",
        "trotz",
        "während",
        "statt",
        "anstatt",
        "innerhalb",
        "außerhalb",
        "oberhalb",
        "unterhalb",
        "diesseits",
        "jenseits",
        "beiderseits",
        "hinsichtlich",
        "bezüglich",
      ],
      examples: [
        "Wegen des Regens bleiben wir zu Hause.",
        "Trotz des Problems funktioniert das System.",
        "Während des Urlaubs habe ich wenig gearbeitet.",
        "Innerhalb des Gebäudes ist Rauchen verboten.",
      ],
      pointsToWatch: [
        "Spoken German often uses dative after wegen, trotz, and statt, but formal grammar still prefers genitive, especially in writing and exams.",
        "Innerhalb, außerhalb, oberhalb, unterhalb are much more strongly tied to genitive in standard usage.",
      ],
    },
    twoWay: {
      rule: "Two-way prepositions take accusative when the phrase expresses direction, destination, or change of location, and dative when the phrase expresses existing location or position.",
      prepositions: [
        "an",
        "auf",
        "hinter",
        "in",
        "neben",
        "über",
        "unter",
        "vor",
        "zwischen",
      ],
      coreDistinction: {
        wo: "location = dative",
        wohin: "direction/goal = accusative",
      },
      table: [
        { preposition: "an", dative: "am Fenster", accusative: "ans Fenster" },
        {
          preposition: "auf",
          dative: "auf dem Tisch",
          accusative: "auf den Tisch",
        },
        {
          preposition: "hinter",
          dative: "hinter dem Haus",
          accusative: "hinter das Haus",
        },
        { preposition: "in", dative: "im Zimmer", accusative: "ins Zimmer" },
        {
          preposition: "neben",
          dative: "neben dem Auto",
          accusative: "neben das Auto",
        },
        {
          preposition: "über",
          dative: "über dem Bett",
          accusative: "über das Bett",
        },
        {
          preposition: "unter",
          dative: "unter dem Tisch",
          accusative: "unter den Tisch",
        },
        {
          preposition: "vor",
          dative: "vor dem Haus",
          accusative: "vor das Haus",
        },
        {
          preposition: "zwischen",
          dative: "zwischen den Stühlen",
          accusative: "zwischen die Stühle",
        },
      ],
      examples: [
        "Das Buch liegt auf dem Tisch.",
        "Ich lege das Buch auf den Tisch.",
        "Wir sind in der Schule.",
        "Wir gehen in die Schule.",
      ],
      deeperNote:
        "It is not simply movement = accusative. Some movement still takes dative if the movement happens within a location rather than toward a new destination, for example: Ich laufe im Park.",
    },
  },

  stateVsPlacementPairs: [
    {
      stateVerb: "liegen",
      placementVerb: "legen",
      example:
        "Das Buch liegt auf dem Tisch. / Ich lege das Buch auf den Tisch.",
    },
    {
      stateVerb: "sitzen",
      placementVerb: "setzen",
      example:
        "Das Kind sitzt auf dem Stuhl. / Ich setze das Kind auf den Stuhl.",
    },
    {
      stateVerb: "stehen",
      placementVerb: "stellen",
      example:
        "Die Vase steht auf dem Tisch. / Ich stelle die Vase auf den Tisch.",
    },
    {
      stateVerb: "hängen",
      placementVerb: "hängen",
      example: "Das Bild hängt an der Wand. / Ich hänge das Bild an die Wand.",
    },
  ],

  byFunction: {
    overview:
      "Besides case, prepositions should also be learned by what they express: place, time, cause, manner, purpose, reference, and fixed complement structures.",
    place: {
      questions: ["Wo? = location", "Wohin? = destination", "Woher? = origin"],
      commonPrepositions: [
        "in",
        "an",
        "auf",
        "unter",
        "über",
        "vor",
        "hinter",
        "neben",
        "zwischen",
        "aus",
        "von",
        "zu",
        "nach",
        "bei",
        "gegenüber",
        "durch",
        "über",
        "entlang",
        "bis",
        "bis zu",
        "ab",
        "von ... aus",
      ],
      examples: [
        "Ich bin im Büro.",
        "Ich gehe ins Büro.",
        "Ich komme aus dem Büro.",
        "Ich fahre nach München.",
        "Ich gehe zum Bahnhof.",
        "Das Hotel liegt gegenüber dem Bahnhof.",
      ],
    },
    time: {
      note: "Temporal prepositions are extremely important because German often prefers a prepositional phrase where English might use a different structure.",
      table: [
        { preposition: "um", meaning: "at", typicalUse: "Clock time" },
        {
          preposition: "am",
          meaning: "on",
          typicalUse: "Days, dates, parts of day with modifiers",
        },
        {
          preposition: "im",
          meaning: "in",
          typicalUse: "Months, seasons, years, general periods",
        },
        {
          preposition: "nach",
          meaning: "after",
          typicalUse: "After an event/time phrase",
        },
        {
          preposition: "vor",
          meaning: "before; ago",
          typicalUse: "Before an event; time ago",
        },
        {
          preposition: "seit",
          meaning: "since, for",
          typicalUse: "Start in past continuing to present",
        },
        {
          preposition: "ab",
          meaning: "as of, from",
          typicalUse: "Starting from future/present point",
        },
        { preposition: "bis", meaning: "until", typicalUse: "Endpoint" },
        {
          preposition: "während",
          meaning: "during",
          typicalUse: "Formal time span",
        },
        {
          preposition: "gegen",
          meaning: "around",
          typicalUse: "Approximate time",
        },
      ],
      examples: [
        "Wir treffen uns um 18 Uhr.",
        "Am Montag arbeite ich zu Hause.",
        "Im Sommer reise ich viel.",
        "Seit zwei Jahren lerne ich Deutsch.",
        "Vor zwei Jahren wohnte ich noch in Köln.",
        "Bis nächste Woche ist das Projekt fertig.",
        "Gegen acht Uhr komme ich an.",
      ],
    },
    causeConcessionPurpose: {
      note: "These become more important at B1-B2 because they are frequent in formal writing.",
      items: [
        { preposition: "wegen", meaning: "because of" },
        { preposition: "aufgrund", meaning: "due to" },
        { preposition: "infolge", meaning: "as a result of" },
        { preposition: "dank", meaning: "thanks to" },
        { preposition: "trotz", meaning: "despite" },
        { preposition: "für", meaning: "for, for the purpose of" },
        { preposition: "zwecks", meaning: "for the purpose of, formal B2" },
      ],
      examples: [
        "Wegen des Staus kam er zu spät.",
        "Dank deiner Hilfe war alles einfacher.",
        "Trotz der Kritik blieb sie ruhig.",
        "Für längere Öffnungszeiten werden neue Mitarbeiter gesucht.",
      ],
    },
    mannerMeansMaterial: {
      note: "These answer how, with what, by what means, made of what.",
      items: [
        { preposition: "mit", meaning: "with, by means of" },
        { preposition: "ohne", meaning: "without" },
        { preposition: "aus", meaning: "made of" },
        { preposition: "per", meaning: "by means of, more modern/loan usage" },
        { preposition: "mittels", meaning: "by means of, formal B2" },
      ],
      examples: [
        "Ich schreibe mit einem Stift.",
        "Er kommt ohne seinen Laptop nicht weit.",
        "Der Tisch ist aus Holz.",
      ],
    },
    referenceAndSource: {
      note: "These matter strongly in B2 writing and argumentation.",
      items: [
        "laut",
        "gemäß",
        "zufolge",
        "bezüglich",
        "hinsichtlich",
        "in Bezug auf",
      ],
      examples: [
        "Laut dem Bericht steigen die Preise.",
        "Dem Vertrag zufolge endet das Mietverhältnis im August.",
        "Hinsichtlich der Qualität gibt es keine Beschwerden.",
      ],
    },
  },

  tenseAndPrepositions: {
    overview:
      "Prepositions do not move the verb the way connectors do, but temporal prepositions interact with tense meaning in important ways.",
    keyDistinctions:
      "The most important B2 distinctions are seit vs vor vs nach vs in vs ab and the difference between duration up to now and finished past periods.",
    highValueInteractions: [
      {
        preposition: "seit",
        timeMeaning: "since/for up to now",
        typicalTenseEffect: "Usually present for ongoing state/action",
      },
      {
        preposition: "vor",
        timeMeaning: "ago/before",
        typicalTenseEffect: "Usually refers to past point or earlier relation",
      },
      {
        preposition: "nach",
        timeMeaning: "after",
        typicalTenseEffect: "Sequence after an event; tense depends on clause",
      },
      {
        preposition: "ab",
        timeMeaning: "from/as of",
        typicalTenseEffect:
          "Starting from now/future; often present/future reading",
      },
      {
        preposition: "in",
        timeMeaning: "in (future time)",
        typicalTenseEffect: "Often future reference from now",
      },
      {
        preposition: "während",
        timeMeaning: "during",
        typicalTenseEffect: "Time span concurrent with another event",
      },
    ],
    examples: [
      {
        sentence: "Ich wohne seit zwei Jahren in Mannheim.",
        note: "Present tense is normal because the situation still continues.",
      },
      {
        sentence: "Vor zwei Jahren bin ich nach Mannheim gezogen.",
        note: "Here the period is finished, so past tense is natural.",
      },
      {
        sentence: "Ab nächster Woche arbeite ich im Büro.",
        note: "This points forward from a start date.",
      },
      {
        sentence: "In zwei Wochen fahre ich nach Berlin.",
        note: "This refers to a future point.",
      },
    ],
    importantNote:
      "English 'for' does not always equal German 'für'. With ongoing time up to now, German usually uses seit, not für: Ich lerne seit drei Monaten Deutsch.",
  },

  contractions: {
    note: "German frequently contracts certain prepositions with definite articles, and these forms are essential for natural speech and writing.",
    table: [
      {
        fullForm: "an dem",
        contracted: "am",
        example: "am Montag, am Fenster",
      },
      { fullForm: "bei dem", contracted: "beim", example: "beim Arzt" },
      { fullForm: "in dem", contracted: "im", example: "im Haus, im Sommer" },
      { fullForm: "in das", contracted: "ins", example: "ins Haus" },
      { fullForm: "von dem", contracted: "vom", example: "vom Bahnhof" },
      { fullForm: "zu dem", contracted: "zum", example: "zum Arzt" },
      { fullForm: "zu der", contracted: "zur", example: "zur Schule" },
    ],
    extraCommonContractions: [
      { fullForm: "an das", contracted: "ans" },
      { fullForm: "auf das", contracted: "aufs" },
      { fullForm: "durch das", contracted: "durchs" },
      { fullForm: "für das", contracted: "fürs" },
      { fullForm: "über das", contracted: "übers" },
      { fullForm: "um das", contracted: "ums" },
      { fullForm: "unter das", contracted: "unters" },
      { fullForm: "vor das", contracted: "vors" },
      { fullForm: "vor dem", contracted: "vorm" },
    ],
    pointsToWatch: [
      "Some contractions are standard and expected: im, am, zum, zur, vom, ins.",
      "Use the full form when emphasis or contrast matters, but in ordinary usage the contractions are the default.",
    ],
  },

  lexicalPatterns: {
    overview:
      "At B1-B2, prepositions stop being just free words and increasingly become part of lexical patterns. Many verbs, adjectives, and nouns require a fixed preposition, and the preposition often has little literal meaning by itself.",
    verbPlusPreposition: [
      { pattern: "warten auf + accusative", meaning: "wait for" },
      { pattern: "denken an + accusative", meaning: "think of" },
      {
        pattern: "sich interessieren für + accusative",
        meaning: "be interested in",
      },
      { pattern: "teilnehmen an + dative", meaning: "participate in" },
      { pattern: "sprechen über + accusative", meaning: "speak about" },
      { pattern: "sprechen mit + dative", meaning: "speak with" },
      { pattern: "gehören zu + dative", meaning: "belong to" },
    ],
    verbExamples: [
      "Ich warte auf den Bus.",
      "Sie interessiert sich für deutsche Literatur.",
      "Er nimmt an dem Kurs teil.",
    ],
    adjectivePlusPreposition: [
      { pattern: "stolz auf + accusative", meaning: "proud of" },
      { pattern: "interessiert an + dative", meaning: "interested in" },
      { pattern: "bekannt für + accusative", meaning: "known for" },
      { pattern: "fertig mit + dative", meaning: "finished with" },
    ],
    adjectiveExamples: [
      "Er ist stolz auf seine Arbeit.",
      "Ich bin mit dem Projekt fertig.",
    ],
    nounPlusPreposition: [
      { pattern: "Interesse an + dative", meaning: "interest in" },
      { pattern: "Angst vor + dative", meaning: "fear of" },
      { pattern: "Grund für + accusative", meaning: "reason for" },
      { pattern: "Antwort auf + accusative", meaning: "answer to" },
      { pattern: "Einfluss auf + accusative", meaning: "influence on" },
    ],
    memorizationNote:
      "These combinations often must be memorized individually, because the choice is not reliably predictable from English.",
  },

  keyContrasts: [
    {
      pair: "nach vs zu",
      difference:
        "nach for cities/countries without article and 'after'; zu for people, institutions, shops, events",
      examples: ["nach Berlin", "zur Arbeit", "zum Arzt"],
    },
    {
      pair: "in vs nach",
      difference:
        "in for enclosed spaces and countries with article; nach for cities and most countries without article",
      examples: ["in die Schweiz", "nach Deutschland"],
    },
    {
      pair: "aus vs von",
      difference:
        "aus = from inside/origin/material; von = from a person, from a surface/point, of/by",
      examples: ["aus dem Haus", "vom Tisch", "von meiner Mutter"],
    },
    {
      pair: "bei vs zu",
      difference: "bei = at/with/near; zu = movement to",
      examples: ["Ich bin beim Arzt.", "Ich gehe zum Arzt."],
    },
    {
      pair: "seit vs für",
      difference:
        "seit for ongoing duration to now; für for intended duration or purpose, not ongoing past-to-present",
      examples: ["Ich wohne seit zwei Jahren hier."],
    },
    {
      pair: "vor vs bevor",
      difference:
        "vor is a preposition with noun phrase; bevor is a connector with clause",
      examples: ["vor dem Essen", "bevor ich esse"],
    },
    {
      pair: "während vs währenddessen",
      difference:
        "während is a preposition or connector; währenddessen is an adverb",
      examples: ["während des Films", "Währenddessen schlief er"],
    },
    {
      pair: "trotz vs obwohl",
      difference:
        "trotz is a preposition with noun phrase; obwohl is a connector with clause",
      examples: ["trotz des Regens", "obwohl es regnet"],
    },
    {
      pair: "wegen vs weil",
      difference: "wegen takes noun phrase; weil takes clause",
      examples: ["wegen des Staus", "weil es Stau gibt"],
    },
  ],

  commonMistakes: [
    "Learning the preposition but not its case.",
    "Using English logic directly, especially with nach, zu, in, aus, and von.",
    "Treating all movement as accusative in two-way prepositions, even when the sentence describes movement within a location rather than toward a destination, as in: Ich laufe im Park.",
    "Using für for ongoing duration where German needs seit, as in: für zwei Jahren instead of seit zwei Jahren.",
    "Using dative after an accusative preposition or vice versa because the noun phrase sounds right.",
    "Forgetting contractions like im, am, zum, zur, vom, ins.",
    "Confusing prepositions with connectors, for example wegen vs weil, trotz vs obwohl, vor vs bevor, während vs währenddessen.",
    "Using genitive-preposition colloquial dative forms in formal writing where the exam or register expects genitive, especially with wegen, trotz, während, statt.",
    "Forgetting that some prepositions have postposition behavior or fixed placement, especially entlang and zufolge.",
  ],

  ultraShortMemoryFormula: {
    accusativePrepositions: ["durch", "für", "gegen", "ohne", "um"],
    dativePrepositions: [
      "aus",
      "bei",
      "mit",
      "nach",
      "seit",
      "von",
      "zu",
      "gegenüber",
    ],
    twoWayRule: "Accusative for Wohin?, dative for Wo?",
    genitiveReminder:
      "Genitive prepositions matter more in formal B2 writing than in casual speech.",
  },
};

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section style={styles.section}>
      <button
        onClick={() => setOpen(!open)}
        style={styles.sectionButton}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}
        >
          ›
        </span>
      </button>
      {open && <div style={styles.sectionBody}>{children}</div>}
    </section>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <div style={styles.card}>
      {title && <h3 style={styles.cardTitle}>{title}</h3>}
      {subtitle && <p style={styles.cardSubtitle}>{subtitle}</p>}
      {children}
    </div>
  );
}

function ChipList({ items = [] }) {
  return (
    <div style={styles.chipWrap}>
      {items.map((item, idx) => (
        <span key={`${item}-${idx}`} style={styles.chip}>
          {item}
        </span>
      ))}
    </div>
  );
}

function SimpleTable({ columns, rows }) {
  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={styles.th}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {columns.map((col) => (
                <td key={col.key} style={styles.td}>
                  {Array.isArray(row[col.key])
                    ? row[col.key].join(", ")
                    : (row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items = [] }) {
  return (
    <ul style={styles.list}>
      {items.map((item, idx) => (
        <li key={idx} style={styles.listItem}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function GermanPrepositionsExplorer() {
  const [query, setQuery] = useState("");

  const filteredMasterTable = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return germanPrepositionsData.masterTable;

    return germanPrepositionsData.masterTable.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(q),
    );
  }, [query]);

  const stats = useMemo(() => {
    return {
      totalPrepositions: germanPrepositionsData.masterTable.length,
      accusative: germanPrepositionsData.masterTable.filter((x) =>
        String(x.case).toLowerCase().includes("accusative"),
      ).length,
      dative: germanPrepositionsData.masterTable.filter((x) =>
        String(x.case).toLowerCase().includes("dative"),
      ).length,
      genitive: germanPrepositionsData.masterTable.filter((x) =>
        String(x.case).toLowerCase().includes("genitive"),
      ).length,
      twoWay: germanPrepositionsData.masterTable.filter((x) =>
        String(x.case).toLowerCase().includes("two-way"),
      ).length,
    };
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.hero}>
          <div>
            <div style={styles.eyebrow}>
              {germanPrepositionsData.meta.scope}
            </div>
            <h1 style={styles.title}>{germanPrepositionsData.meta.title}</h1>
            <p style={styles.lead}>{germanPrepositionsData.meta.purpose}</p>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <strong>{stats.totalPrepositions}</strong>
              <span>Total entries</span>
            </div>
            <div style={styles.statCard}>
              <strong>{stats.accusative}</strong>
              <span>Accusative-linked</span>
            </div>
            <div style={styles.statCard}>
              <strong>{stats.dative}</strong>
              <span>Dative-linked</span>
            </div>
            <div style={styles.statCard}>
              <strong>{stats.genitive}</strong>
              <span>Genitive-linked</span>
            </div>
            <div style={styles.statCard}>
              <strong>{stats.twoWay}</strong>
              <span>Two-way-linked</span>
            </div>
          </div>
        </header>

        <div style={styles.searchBar}>
          <input
            type="search"
            placeholder="Search prepositions, meanings, cases, examples, contrasts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.input}
            aria-label="Search German prepositions content"
          />
        </div>

        <Section title="Quick classification">
          <div style={styles.grid}>
            {germanPrepositionsData.quickClassification.map((item) => (
              <Card key={item.type} title={item.type} subtitle={item.rule}>
                <p style={styles.copy}>
                  <strong>Main question:</strong> {item.mainQuestion}
                </p>
                <ChipList items={item.examples} />
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Golden rules">
          <BulletList items={germanPrepositionsData.goldenRules} />
        </Section>

        <Section title={`Master table (${filteredMasterTable.length})`}>
          <SimpleTable
            columns={[
              { key: "preposition", label: "Preposition" },
              { key: "meanings", label: "Meaning(s)" },
              { key: "case", label: "Case" },
              { key: "level", label: "Level" },
              { key: "coreUse", label: "Core use" },
              { key: "example", label: "Example" },
            ]}
            rows={filteredMasterTable}
          />
        </Section>

        <Section title="By case">
          <div style={styles.stack}>
            <Card
              title="Accusative prepositions"
              subtitle={germanPrepositionsData.byCase.accusative.rule}
            >
              <p style={styles.label}>Prepositions</p>
              <ChipList
                items={germanPrepositionsData.byCase.accusative.prepositions}
              />
              <p style={styles.label}>Special members</p>
              <BulletList
                items={germanPrepositionsData.byCase.accusative.specialMembers}
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={germanPrepositionsData.byCase.accusative.examples}
              />
              <p style={styles.label}>Points to watch</p>
              <BulletList
                items={germanPrepositionsData.byCase.accusative.pointsToWatch}
              />
            </Card>

            <Card
              title="Dative prepositions"
              subtitle={germanPrepositionsData.byCase.dative.rule}
            >
              <p style={styles.label}>Prepositions</p>
              <ChipList
                items={germanPrepositionsData.byCase.dative.prepositions}
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={germanPrepositionsData.byCase.dative.examples}
              />
              <p style={styles.label}>Points to watch</p>
              <BulletList
                items={germanPrepositionsData.byCase.dative.pointsToWatch}
              />
            </Card>

            <Card
              title="Genitive prepositions"
              subtitle={germanPrepositionsData.byCase.genitive.rule}
            >
              <p style={styles.label}>Prepositions</p>
              <ChipList
                items={germanPrepositionsData.byCase.genitive.prepositions}
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={germanPrepositionsData.byCase.genitive.examples}
              />
              <p style={styles.label}>Points to watch</p>
              <BulletList
                items={germanPrepositionsData.byCase.genitive.pointsToWatch}
              />
            </Card>

            <Card
              title="Two-way prepositions"
              subtitle={germanPrepositionsData.byCase.twoWay.rule}
            >
              <p style={styles.copy}>
                <strong>Core distinction:</strong> Wo? ={" "}
                {germanPrepositionsData.byCase.twoWay.coreDistinction.wo},
                Wohin? ={" "}
                {germanPrepositionsData.byCase.twoWay.coreDistinction.wohin}
              </p>
              <p style={styles.label}>Prepositions</p>
              <ChipList
                items={germanPrepositionsData.byCase.twoWay.prepositions}
              />
              <SimpleTable
                columns={[
                  { key: "preposition", label: "Preposition" },
                  { key: "dative", label: "Dative = location" },
                  { key: "accusative", label: "Accusative = direction/change" },
                ]}
                rows={germanPrepositionsData.byCase.twoWay.table}
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={germanPrepositionsData.byCase.twoWay.examples}
              />
              <p style={styles.copy}>
                <strong>Deeper note:</strong>{" "}
                {germanPrepositionsData.byCase.twoWay.deeperNote}
              </p>
            </Card>
          </div>
        </Section>

        <Section title="State vs placement pairs">
          <SimpleTable
            columns={[
              { key: "stateVerb", label: "State verb" },
              { key: "placementVerb", label: "Placement/change verb" },
              { key: "example", label: "Example" },
            ]}
            rows={germanPrepositionsData.stateVsPlacementPairs}
          />
        </Section>

        <Section title="By function">
          <div style={styles.stack}>
            <Card title="Overview">
              <p style={styles.copy}>
                {germanPrepositionsData.byFunction.overview}
              </p>
            </Card>

            <Card title="Place">
              <p style={styles.label}>Questions</p>
              <ChipList
                items={germanPrepositionsData.byFunction.place.questions}
              />
              <p style={styles.label}>Common prepositions</p>
              <ChipList
                items={
                  germanPrepositionsData.byFunction.place.commonPrepositions
                }
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={germanPrepositionsData.byFunction.place.examples}
              />
            </Card>

            <Card
              title="Time"
              subtitle={germanPrepositionsData.byFunction.time.note}
            >
              <SimpleTable
                columns={[
                  { key: "preposition", label: "Preposition" },
                  { key: "meaning", label: "Meaning" },
                  { key: "typicalUse", label: "Typical use" },
                ]}
                rows={germanPrepositionsData.byFunction.time.table}
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={germanPrepositionsData.byFunction.time.examples}
              />
            </Card>

            <Card
              title="Cause, concession, purpose"
              subtitle={
                germanPrepositionsData.byFunction.causeConcessionPurpose.note
              }
            >
              <SimpleTable
                columns={[
                  { key: "preposition", label: "Preposition" },
                  { key: "meaning", label: "Meaning" },
                ]}
                rows={
                  germanPrepositionsData.byFunction.causeConcessionPurpose.items
                }
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={
                  germanPrepositionsData.byFunction.causeConcessionPurpose
                    .examples
                }
              />
            </Card>

            <Card
              title="Manner, means, material"
              subtitle={
                germanPrepositionsData.byFunction.mannerMeansMaterial.note
              }
            >
              <SimpleTable
                columns={[
                  { key: "preposition", label: "Preposition" },
                  { key: "meaning", label: "Meaning" },
                ]}
                rows={
                  germanPrepositionsData.byFunction.mannerMeansMaterial.items
                }
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={
                  germanPrepositionsData.byFunction.mannerMeansMaterial.examples
                }
              />
            </Card>

            <Card
              title="Reference and source"
              subtitle={
                germanPrepositionsData.byFunction.referenceAndSource.note
              }
            >
              <p style={styles.label}>Items</p>
              <ChipList
                items={
                  germanPrepositionsData.byFunction.referenceAndSource.items
                }
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={
                  germanPrepositionsData.byFunction.referenceAndSource.examples
                }
              />
            </Card>
          </div>
        </Section>

        <Section title="Tense interactions">
          <Card
            title="Overview"
            subtitle={germanPrepositionsData.tenseAndPrepositions.overview}
          >
            <p style={styles.copy}>
              {germanPrepositionsData.tenseAndPrepositions.keyDistinctions}
            </p>
            <SimpleTable
              columns={[
                { key: "preposition", label: "Preposition" },
                { key: "timeMeaning", label: "Time meaning" },
                { key: "typicalTenseEffect", label: "Typical tense effect" },
              ]}
              rows={
                germanPrepositionsData.tenseAndPrepositions
                  .highValueInteractions
              }
            />
            <p style={styles.label}>Examples</p>
            <div style={styles.stackSm}>
              {germanPrepositionsData.tenseAndPrepositions.examples.map(
                (item, idx) => (
                  <div key={idx} style={styles.noteBox}>
                    <div style={styles.exampleSentence}>{item.sentence}</div>
                    <div style={styles.exampleNote}>{item.note}</div>
                  </div>
                ),
              )}
            </div>
            <p style={styles.copy}>
              <strong>Important note:</strong>{" "}
              {germanPrepositionsData.tenseAndPrepositions.importantNote}
            </p>
          </Card>
        </Section>

        <Section title="Contractions">
          <Card subtitle={germanPrepositionsData.contractions.note}>
            <SimpleTable
              columns={[
                { key: "fullForm", label: "Full form" },
                { key: "contracted", label: "Contracted" },
                { key: "example", label: "Example" },
              ]}
              rows={germanPrepositionsData.contractions.table}
            />
            <p style={styles.label}>Extra common contractions</p>
            <SimpleTable
              columns={[
                { key: "fullForm", label: "Full form" },
                { key: "contracted", label: "Contracted" },
              ]}
              rows={germanPrepositionsData.contractions.extraCommonContractions}
            />
            <p style={styles.label}>Points to watch</p>
            <BulletList
              items={germanPrepositionsData.contractions.pointsToWatch}
            />
          </Card>
        </Section>

        <Section title="Lexical patterns">
          <Card title="Overview">
            <p style={styles.copy}>
              {germanPrepositionsData.lexicalPatterns.overview}
            </p>
          </Card>

          <div style={styles.grid}>
            <Card title="Verb + preposition">
              <SimpleTable
                columns={[
                  { key: "pattern", label: "Pattern" },
                  { key: "meaning", label: "Meaning" },
                ]}
                rows={
                  germanPrepositionsData.lexicalPatterns.verbPlusPreposition
                }
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={germanPrepositionsData.lexicalPatterns.verbExamples}
              />
            </Card>

            <Card title="Adjective + preposition">
              <SimpleTable
                columns={[
                  { key: "pattern", label: "Pattern" },
                  { key: "meaning", label: "Meaning" },
                ]}
                rows={
                  germanPrepositionsData.lexicalPatterns
                    .adjectivePlusPreposition
                }
              />
              <p style={styles.label}>Examples</p>
              <BulletList
                items={germanPrepositionsData.lexicalPatterns.adjectiveExamples}
              />
            </Card>

            <Card title="Noun + preposition">
              <SimpleTable
                columns={[
                  { key: "pattern", label: "Pattern" },
                  { key: "meaning", label: "Meaning" },
                ]}
                rows={
                  germanPrepositionsData.lexicalPatterns.nounPlusPreposition
                }
              />
              <p style={styles.copy}>
                <strong>Note:</strong>{" "}
                {germanPrepositionsData.lexicalPatterns.memorizationNote}
              </p>
            </Card>
          </div>
        </Section>

        <Section title="Key contrasts">
          <SimpleTable
            columns={[
              { key: "pair", label: "Pair/group" },
              { key: "difference", label: "Difference" },
              { key: "examples", label: "Examples" },
            ]}
            rows={germanPrepositionsData.keyContrasts}
          />
        </Section>

        <Section title="Common mistakes">
          <BulletList items={germanPrepositionsData.commonMistakes} />
        </Section>

        <Section title="Ultra-short memory formula">
          <div style={styles.grid}>
            <Card title="Accusative prepositions">
              <ChipList
                items={
                  germanPrepositionsData.ultraShortMemoryFormula
                    .accusativePrepositions
                }
              />
            </Card>
            <Card title="Dative prepositions">
              <ChipList
                items={
                  germanPrepositionsData.ultraShortMemoryFormula
                    .dativePrepositions
                }
              />
            </Card>
            <Card title="Two-way rule">
              <p style={styles.copy}>
                {germanPrepositionsData.ultraShortMemoryFormula.twoWayRule}
              </p>
            </Card>
            <Card title="Genitive reminder">
              <p style={styles.copy}>
                {
                  germanPrepositionsData.ultraShortMemoryFormula
                    .genitiveReminder
                }
              </p>
            </Card>
          </div>
        </Section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100dvh",
    background: "var(--color-bg)",
    color: "var(--color-text)",
    fontFamily: "var(--font-body)",
    padding: "var(--space-8) var(--space-4) var(--space-12)",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: "var(--space-5)",
    alignItems: "start",
    marginBottom: "var(--space-6)",
  },
  eyebrow: {
    display: "inline-block",
    padding: "var(--space-1) var(--space-3)",
    borderRadius: "var(--radius-full)",
    background: "var(--color-primary-highlight)",
    color: "var(--color-primary)",
    fontSize: "var(--text-xs)",
    marginBottom: "var(--space-3)",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  title: {
    margin: "0 0 var(--space-3)",
    fontSize: "var(--text-xl)",
    lineHeight: 1.05,
    fontFamily: "var(--font-display)",
    color: "var(--color-text)",
  },
  lead: {
    margin: 0,
    color: "var(--color-text-muted)",
    fontSize: "var(--text-sm)",
    maxWidth: "70ch",
    lineHeight: 1.7,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "var(--space-3)",
  },

  // ── stat cards: each gets its own accent color ──
  statCard: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderLeft: "3px solid var(--color-primary)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  statCardGold: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderLeft: "3px solid var(--color-gold)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  statCardSuccess: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderLeft: "3px solid var(--color-success)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },
  statCardError: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderLeft: "3px solid var(--color-error)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  },

  searchBar: {
    marginBottom: "var(--space-5)",
  },
  input: {
    width: "100%",
    padding: "var(--space-3) var(--space-4)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-text)",
    fontSize: "var(--text-sm)",
    outline: "none",
    fontFamily: "var(--font-body)",
    transition:
      "border-color var(--transition-interactive), box-shadow var(--transition-interactive)",
  },

  // ── sections: left accent border by variant ──
  section: {
    marginBottom: "var(--space-4)",
    border: "1px solid var(--color-border)",
    borderLeft: "3px solid var(--color-primary)",
    borderRadius: "var(--radius-xl)",
    background: "var(--color-surface)",
    overflow: "hidden",
  },
  sectionGold: {
    marginBottom: "var(--space-4)",
    border: "1px solid var(--color-border)",
    borderLeft: "3px solid var(--color-gold)",
    borderRadius: "var(--radius-xl)",
    background: "var(--color-surface)",
    overflow: "hidden",
  },
  sectionSuccess: {
    marginBottom: "var(--space-4)",
    border: "1px solid var(--color-border)",
    borderLeft: "3px solid var(--color-success)",
    borderRadius: "var(--radius-xl)",
    background: "var(--color-surface)",
    overflow: "hidden",
  },
  sectionError: {
    marginBottom: "var(--space-4)",
    border: "1px solid var(--color-border)",
    borderLeft: "3px solid var(--color-error)",
    borderRadius: "var(--radius-xl)",
    background: "var(--color-surface)",
    overflow: "hidden",
  },

  sectionButton: {
    width: "100%",
    border: 0,
    background: "var(--color-surface-2)",
    color: "var(--color-text)",
    padding: "var(--space-4) var(--space-5)",
    textAlign: "left",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "var(--text-lg)",
    fontWeight: 700,
    fontFamily: "var(--font-display)",
  },
  sectionBody: {
    padding: "var(--space-5)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "var(--space-4)",
  },
  stack: {
    display: "grid",
    gap: "var(--space-4)",
  },
  stackSm: {
    display: "grid",
    gap: "var(--space-3)",
  },
  card: {
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-divider)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
  },

  // ── colored card variants ──
  cardPrimary: {
    background: "var(--color-primary-highlight)",
    border: "1px solid var(--color-primary)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
  },
  cardGold: {
    background: "var(--color-gold-highlight)",
    border: "1px solid var(--color-gold)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
  },
  cardSuccess: {
    background: "var(--color-success-highlight)",
    border: "1px solid var(--color-success)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
  },
  cardError: {
    background: "rgba(201, 96, 96, 0.1)",
    border: "1px solid var(--color-error)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-4)",
  },

  cardTitle: {
    margin: "0 0 var(--space-2)",
    fontSize: "var(--text-base)",
    fontFamily: "var(--font-display)",
    color: "var(--color-text)",
  },
  cardSubtitle: {
    margin: "0 0 var(--space-4)",
    color: "var(--color-text-muted)",
    fontSize: "var(--text-sm)",
  },
  copy: {
    margin: "0 0 var(--space-3)",
    color: "var(--color-text-muted)",
    lineHeight: 1.7,
    fontSize: "var(--text-sm)",
  },
  label: {
    margin: "var(--space-3) 0 var(--space-2)",
    fontSize: "var(--text-xs)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-text-muted)",
    fontWeight: 600,
  },

  // ── colored label variants ──
  labelPrimary: {
    margin: "var(--space-3) 0 var(--space-2)",
    fontSize: "var(--text-xs)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-primary)",
    fontWeight: 700,
  },
  labelGold: {
    margin: "var(--space-3) 0 var(--space-2)",
    fontSize: "var(--text-xs)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-gold)",
    fontWeight: 700,
  },
  labelSuccess: {
    margin: "var(--space-3) 0 var(--space-2)",
    fontSize: "var(--text-xs)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-success)",
    fontWeight: 700,
  },
  labelError: {
    margin: "var(--space-3) 0 var(--space-2)",
    fontSize: "var(--text-xs)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-error)",
    fontWeight: 700,
  },

  chipWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--space-2)",
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "var(--space-1) var(--space-3)",
    borderRadius: "var(--radius-full)",
    background: "var(--color-surface-offset)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text-muted)",
    fontSize: "var(--text-xs)",
    fontWeight: 500,
  },

  // ── colored chip variants ──
  chipPrimary: {
    display: "inline-flex",
    alignItems: "center",
    padding: "var(--space-1) var(--space-3)",
    borderRadius: "var(--radius-full)",
    background: "var(--color-primary-highlight)",
    border: "1px solid var(--color-primary)",
    color: "var(--color-primary)",
    fontSize: "var(--text-xs)",
    fontWeight: 600,
  },
  chipGold: {
    display: "inline-flex",
    alignItems: "center",
    padding: "var(--space-1) var(--space-3)",
    borderRadius: "var(--radius-full)",
    background: "var(--color-gold-highlight)",
    border: "1px solid var(--color-gold)",
    color: "var(--color-gold)",
    fontSize: "var(--text-xs)",
    fontWeight: 600,
  },
  chipSuccess: {
    display: "inline-flex",
    alignItems: "center",
    padding: "var(--space-1) var(--space-3)",
    borderRadius: "var(--radius-full)",
    background: "var(--color-success-highlight)",
    border: "1px solid var(--color-success)",
    color: "var(--color-success)",
    fontSize: "var(--text-xs)",
    fontWeight: 600,
  },
  chipError: {
    display: "inline-flex",
    alignItems: "center",
    padding: "var(--space-1) var(--space-3)",
    borderRadius: "var(--radius-full)",
    background: "rgba(201, 96, 96, 0.1)",
    border: "1px solid var(--color-error)",
    color: "var(--color-error)",
    fontSize: "var(--text-xs)",
    fontWeight: 600,
  },

  list: {
    margin: 0,
    paddingLeft: "var(--space-5)",
    display: "grid",
    gap: "var(--space-2)",
  },
  listItem: {
    color: "var(--color-text-muted)",
    lineHeight: 1.65,
    fontSize: "var(--text-sm)",
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--color-border)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "760px",
    background: "var(--color-surface)",
  },
  th: {
    textAlign: "left",
    padding: "var(--space-3) var(--space-5)",
    background: "var(--color-surface-offset)",
    color: "var(--color-text-muted)",
    borderBottom: "1px solid var(--color-divider)",
    fontSize: "var(--text-xs)",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  td: {
    padding: "var(--space-3) var(--space-5)",
    borderBottom: "1px solid var(--color-divider)",
    verticalAlign: "top",
    color: "var(--color-text)",
    fontSize: "var(--text-sm)",
    lineHeight: 1.55,
  },
  tdMuted: {
    padding: "var(--space-3) var(--space-5)",
    borderBottom: "1px solid var(--color-divider)",
    verticalAlign: "top",
    color: "var(--color-text-muted)",
    fontSize: "var(--text-sm)",
    lineHeight: 1.55,
    fontStyle: "italic",
  },

  // ── note boxes ──
  noteBox: {
    background: "var(--color-primary-highlight)",
    border: "1px solid var(--color-primary)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-3) var(--space-4)",
  },
  noteBoxGold: {
    background: "var(--color-gold-highlight)",
    border: "1px solid var(--color-gold)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-3) var(--space-4)",
  },
  noteBoxSuccess: {
    background: "var(--color-success-highlight)",
    border: "1px solid var(--color-success)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-3) var(--space-4)",
  },
  noteBoxError: {
    background: "rgba(201, 96, 96, 0.1)",
    border: "1px solid var(--color-error)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--space-3) var(--space-4)",
  },

  exampleSentence: {
    color: "var(--color-text)",
    marginBottom: "var(--space-2)",
    fontWeight: 600,
    fontSize: "var(--text-sm)",
  },
  exampleNote: {
    color: "var(--color-text-muted)",
    fontSize: "var(--text-xs)",
    lineHeight: 1.65,
  },

  // ── badge variants ──
  badgePrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "var(--radius-lg)",
    background: "var(--color-primary-highlight)",
    color: "var(--color-primary)",
    fontSize: "var(--text-xs)",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    flexShrink: 0,
  },
  badgeGold: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "var(--radius-lg)",
    background: "var(--color-gold-highlight)",
    color: "var(--color-gold)",
    fontSize: "var(--text-xs)",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    flexShrink: 0,
  },
  badgeSuccess: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "var(--radius-lg)",
    background: "var(--color-success-highlight)",
    color: "var(--color-success)",
    fontSize: "var(--text-xs)",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    flexShrink: 0,
  },
  badgeError: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "var(--radius-lg)",
    background: "rgba(201, 96, 96, 0.1)",
    color: "var(--color-error)",
    fontSize: "var(--text-xs)",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    flexShrink: 0,
  },
};
