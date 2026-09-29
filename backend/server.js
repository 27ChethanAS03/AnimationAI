require("dotenv").config();

const DEMO_MODE = process.env.DEMO_MODE !== "false";
const OpenAI = require("openai");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

console.log(
    process.env.OPENAI_API_KEY
        ? "OpenAI API key loaded successfully!"
        : "OpenAI API key is missing!"
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Animation AI backend is running!"
    });
});

app.post("/api/test", (req, res) => {
    const { prompt } = req.body;

    res.json({
        success: true,
        message: "Your prompt reached the Animation AI backend!",
        prompt: prompt
    });
});

app.post("/api/generate-story", async (req, res) => {

const { prompt, outputLanguage, duration, animationStyle, selectedType } = req.body;   
const idea = (prompt || "").trim();

   if (DEMO_MODE) {

    const words = idea
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);

    const shortIdea =
        idea.length > 120
            ? idea.substring(0, 120) + "..."
            : idea;

    const titleWords = words.slice(0, 5);

    const generatedTitle =
        titleWords.length > 0
            ? titleWords
                .map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ")
            : "Untitled Animation";

    const protagonistMatch =
        idea.match(/(?:named|called)\s+([A-Za-z]+)/i);

    const protagonist =
        protagonistMatch
            ? protagonistMatch[1]
            : "Alex";

    const genre =
        /space|robot|ai|future|technology|cyber|machine/i.test(idea)
            ? "Sci-Fi Animation"
            : /magic|dragon|kingdom|wizard|fantasy/i.test(idea)
            ? "Fantasy Animation"
            : /love|friend|family|emotional|heart/i.test(idea)
            ? "Emotional Animation"
            : "Cinematic Animation";

    res.json({

        success: true,
        demo: true,
        outputLanguage: outputLanguage || "auto",

        title: generatedTitle,

        genre: genre,

        world: {
            setting:
                `A cinematic world created from the user's idea: ${shortIdea}`,
            time: "Present day / near future",
            atmosphere:
                "Cinematic, immersive, detailed and atmospheric."
        },

        characters: [
            {
                name: protagonist,
                age: 19,
                role: "Main Protagonist",
                appearance:
                    "Young protagonist with expressive eyes, detailed hair, cinematic clothing and consistent appearance.",
                personality:
                    "Curious, determined, emotional and brave."
            },
            {
                name: "Maya",
                age: 19,
                role: "Supporting Character",
                appearance:
                    "Young character with expressive features and a distinctive cinematic outfit.",
                personality:
                    "Intelligent, loyal, supportive and observant."
            }
        ],

        story:

 outputLanguage === "kannada"
        ? `ಈ ಅನಿಮೇಟೆಡ್ ಕಥೆಯ ಮೂಲ ಕಲ್ಪನೆ: "${idea || "ಒಂದು ಮೂಲ ಅನಿಮೇಟೆಡ್ ಕಥೆಯನ್ನು ರಚಿಸಿ."}".
${protagonist} ಅನಿರೀಕ್ಷಿತ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸುತ್ತಾನೆ. ಕಥೆಯ ಘಟನೆಗಳು ನಿಜವಾಗುತ್ತಿದ್ದಂತೆ, ${protagonist} ಅನೇಕ ಸವಾಲುಗಳನ್ನು ಎದುರಿಸುತ್ತಾನೆ, ತನ್ನ ಸುತ್ತಲಿನ ಜಗತ್ತಿನ ಬಗ್ಗೆ ಹೊಸ ವಿಷಯಗಳನ್ನು ತಿಳಿದುಕೊಳ್ಳುತ್ತಾನೆ ಮತ್ತು ಕಥೆಯ ಭವಿಷ್ಯವನ್ನು ಬದಲಾಯಿಸುವ ಮಹತ್ವದ ನಿರ್ಧಾರವನ್ನು ತೆಗೆದುಕೊಳ್ಳಬೇಕಾಗುತ್ತದೆ.`
        : outputLanguage === "hindi"
        ? `इस एनिमेटेड कहानी का मूल विचार है: "${idea || "एक मौलिक एनिमेटेड कहानी बनाएं।"}".
${protagonist} एक अप्रत्याशित यात्रा शुरू करता है। जैसे-जैसे कहानी की घटनाएँ वास्तविक होती जाती हैं, ${protagonist} कई चुनौतियों का सामना करता है, दुनिया को बेहतर समझता है और एक ऐसा महत्वपूर्ण निर्णय लेता है जो कहानी की दिशा बदल देता है।`
        : outputLanguage === "telugu"
        ? `ఈ యానిమేటెడ్ కథ యొక్క ప్రధాన ఆలోచన: "${idea || "ఒక అసలైన యానిమేటెడ్ కథను రూపొందించండి."}".
${protagonist} ఒక అనూహ్యమైన ప్రయాణాన్ని ప్రారంభిస్తాడు. కథలోని సంఘటనలు నిజమవుతున్నప్పుడు, ${protagonist} అనేక సవాళ్లను ఎదుర్కొని, ప్రపంచం గురించి లోతైన అవగాహన పొందుతూ, కథ దిశను మార్చే ముఖ్యమైన నిర్ణయం తీసుకోవాల్సి వస్తుంది.`
        : outputLanguage === "tamil"
        ? `இந்த அனிமேஷன் கதையின் அடிப்படை யோசனை: "${idea || "ஒரு அசல் அனிமேஷன் கதையை உருவாக்கவும்."}".
${protagonist} எதிர்பாராத ஒரு பயணத்தைத் தொடங்குகிறார். கதையின் நிகழ்வுகள் உண்மையாக மாறும்போது, ${protagonist} பல சவால்களை எதிர்கொண்டு, உலகத்தைப் பற்றிய ஆழமான புரிதலைப் பெற்று, கதையின் திசையை மாற்றும் முக்கியமான முடிவை எடுக்க வேண்டிய நிலைக்கு வருகிறார்.`
        : outputLanguage === "malayalam"
        ? `ഈ ആനിമേറ്റഡ് കഥയുടെ അടിസ്ഥാന ആശയം: "${idea || "ഒരു യഥാർത്ഥ ആനിമേറ്റഡ് കഥ സൃഷ്ടിക്കുക."}".
${protagonist} അപ്രതീക്ഷിതമായ ഒരു യാത്ര ആരംഭിക്കുന്നു. കഥയിലെ സംഭവങ്ങൾ യാഥാർത്ഥ്യമാകുമ്പോൾ, ${protagonist} നിരവധി വെല്ലുവിളികളെ നേരിടുകയും ലോകത്തെക്കുറിച്ച് കൂടുതൽ മനസ്സിലാക്കുകയും കഥയുടെ ദിശ മാറ്റുന്ന ഒരു പ്രധാന തീരുമാനം എടുക്കുകയും ചെയ്യുന്നു.`
        : outputLanguage === "marathi"
        ? `या अॅनिमेटेड कथेची मूळ कल्पना: "${idea || "एक मूळ अॅनिमेटेड कथा तयार करा."}".
${protagonist} एका अनपेक्षित प्रवासाला सुरुवात करतो. कथेतील घटना प्रत्यक्षात घडू लागल्यावर, ${protagonist} अनेक आव्हानांना सामोरे जातो, जगाची सखोल समज विकसित करतो आणि कथेची दिशा बदलणारा महत्त्वाचा निर्णय घेतो.`
        : outputLanguage === "bengali"
        ? `এই অ্যানিমেটেড গল্পের মূল ধারণা: "${idea || "একটি মৌলিক অ্যানিমেটেড গল্প তৈরি করুন।"}".
${protagonist} একটি অপ্রত্যাশিত যাত্রা শুরু করে। গল্পের ঘটনাগুলো বাস্তবে পরিণত হওয়ার সঙ্গে সঙ্গে, ${protagonist} নানা চ্যালেঞ্জের মুখোমুখি হয়, পৃথিবী সম্পর্কে গভীর উপলব্ধি অর্জন করে এবং গল্পের গতিপথ পরিবর্তনকারী একটি গুরুত্বপূর্ণ সিদ্ধান্ত নিতে বাধ্য হয়।`
        : outputLanguage === "urdu"
        ? `اس اینیمیٹڈ کہانی کا بنیادی خیال: "${idea || "ایک اصل اینیمیٹڈ کہانی بنائیں۔"}".
${protagonist} ایک غیر متوقع سفر شروع کرتا ہے۔ جیسے جیسے کہانی کے واقعات حقیقت بننے لگتے ہیں، ${protagonist} مختلف چیلنجز کا سامنا کرتا ہے، دنیا کو بہتر طور پر سمجھتا ہے اور ایک اہم فیصلہ کرتا ہے جو کہانی کا رخ بدل دیتا ہے۔`
        : `This animated story is based on the idea: "${idea || "Create an original animated story."}".
${protagonist} begins an unexpected journey when the central events of the idea become real. Along the way, ${protagonist} discovers hidden challenges, develops a deeper understanding of the world, and must make an important decision that changes the direction of the story.`,

        scenes:

outputLanguage === "kannada"
    ? [
        `ಆರಂಭ: ${protagonist} ಕಥೆಯ ಜಗತ್ತಿಗೆ ಪರಿಚಯವಾಗುತ್ತಾನೆ ಮತ್ತು ಕಥೆಯ ಮೊದಲ ಪ್ರಮುಖ ಘಟನೆಯನ್ನು ಎದುರಿಸುತ್ತಾನೆ.`,
        `ಅಭಿವೃದ್ಧಿ: ${protagonist} ಪರಿಸ್ಥಿತಿಯನ್ನು ತನಿಖೆ ಮಾಡುತ್ತಾನೆ ಮತ್ತು ಇನ್ನಷ್ಟು ರಹಸ್ಯಗಳನ್ನು ಕಂಡುಕೊಳ್ಳುತ್ತಾನೆ.`,
        `ಸಂಘರ್ಷ: ಒಂದು ದೊಡ್ಡ ಅಡಚಣೆ ಎದುರಾಗುತ್ತದೆ ಮತ್ತು ${protagonist} ಹಾಗೂ ಇತರ ಪಾತ್ರಗಳು ಕಠಿಣ ಸವಾಲನ್ನು ಎದುರಿಸುತ್ತಾರೆ.`,
        `ಕ್ಲೈಮ್ಯಾಕ್ಸ್: ${protagonist} ಕಥೆಯ ಅತ್ಯಂತ ಅಪಾಯಕಾರಿ ಅಥವಾ ಭಾವನಾತ್ಮಕ ಕ್ಷಣವನ್ನು ಎದುರಿಸುತ್ತಾನೆ.`,
        `ಅಂತ್ಯ: ${protagonist} ತೆಗೆದುಕೊಂಡ ನಿರ್ಧಾರದ ಪರಿಣಾಮಗಳು ಬಹಿರಂಗವಾಗುತ್ತವೆ ಮತ್ತು ಕಥೆಗೆ ಹೊಸ ದಿಕ್ಕು ಸಿಗುತ್ತದೆ.`
      ]
    : outputLanguage === "hindi"
    ? [
        `शुरुआत: ${protagonist} को कहानी की दुनिया से परिचित कराया जाता है और वह पहली महत्वपूर्ण घटना का सामना करता है।`,
        `विकास: ${protagonist} स्थिति की जांच करता है और नए रहस्यों की खोज करता है।`,
        `संघर्ष: एक बड़ी बाधा सामने आती है और ${protagonist} तथा अन्य पात्र कठिन चुनौती का सामना करते हैं।`,
        `चरमोत्कर्ष: ${protagonist} कहानी के सबसे खतरनाक या भावनात्मक क्षण का सामना करता है।`,
        `अंत: ${protagonist} के निर्णय के परिणाम सामने आते हैं और कहानी एक नई दिशा लेती है।`
      ]
    : outputLanguage === "telugu"
    ? [
        `ప్రారంభం: ${protagonist} కథా ప్రపంచానికి పరిచయం అవుతాడు మరియు మొదటి ముఖ్యమైన సంఘటనను ఎదుర్కొంటాడు.`,
        `అభివృద్ధి: ${protagonist} పరిస్థితిని పరిశీలించి కొత్త రహస్యాలను కనుగొంటాడు.`,
        `సంఘర్షణ: ఒక పెద్ద అడ్డంకి ఎదురవుతుంది మరియు ${protagonist} ఇతర పాత్రలతో కలిసి కఠినమైన సవాలును ఎదుర్కొంటాడు.`,
        `క్లైమాక్స్: ${protagonist} కథలోని అత్యంత ప్రమాదకరమైన లేదా భావోద్వేగ క్షణాన్ని ఎదుర్కొంటాడు.`,
        `ముగింపు: ${protagonist} తీసుకున్న నిర్ణయం యొక్క పరిణామాలు బయటపడతాయి మరియు కథ కొత్త దిశలో సాగుతుంది.`
      ]
    : outputLanguage === "tamil"
    ? [
        `தொடக்கம்: ${protagonist} கதையின் உலகிற்கு அறிமுகமாகி முதல் முக்கியமான நிகழ்வை எதிர்கொள்கிறார்.`,
        `வளர்ச்சி: ${protagonist} நிலைமையை ஆராய்ந்து புதிய ரகசியங்களை கண்டுபிடிக்கிறார்.`,
        `மோதல்: ஒரு பெரிய தடைகள் தோன்றி ${protagonist} மற்றும் மற்ற கதாபாத்திரங்கள் கடினமான சவாலை எதிர்கொள்கின்றனர்.`,
        `உச்சக்கட்டம்: ${protagonist} கதையின் மிகவும் ஆபத்தான அல்லது உணர்ச்சிகரமான தருணத்தை எதிர்கொள்கிறார்.`,
        `முடிவு: ${protagonist} எடுத்த முடிவின் விளைவுகள் வெளிப்பட்டு கதை புதிய திசையை எடுக்கிறது.`
      ]
    : outputLanguage === "malayalam"
    ? [
        `തുടക്കം: ${protagonist} കഥയുടെ ലോകത്തിലേക്ക് പരിചയപ്പെടുകയും ആദ്യത്തെ പ്രധാന സംഭവത്തെ നേരിടുകയും ചെയ്യുന്നു.`,
        `വികസനം: ${protagonist} സാഹചര്യം അന്വേഷിക്കുകയും പുതിയ രഹസ്യങ്ങൾ കണ്ടെത്തുകയും ചെയ്യുന്നു.`,
        `സംഘർഷം: ഒരു വലിയ തടസ്സം പ്രത്യക്ഷപ്പെടുകയും ${protagonist}യും മറ്റ് കഥാപാത്രങ്ങളും കടുത്ത വെല്ലുവിളി നേരിടുകയും ചെയ്യുന്നു.`,
        `ക്ലൈമാക്സ്: ${protagonist} കഥയിലെ ഏറ്റവും അപകടകരമായ അല്ലെങ്കിൽ വികാരനിർഭരമായ നിമിഷത്തെ നേരിടുന്നു.`,
        `അവസാനം: ${protagonist} എടുത്ത തീരുമാനത്തിന്റെ ഫലങ്ങൾ പുറത്തുവരുകയും കഥ പുതിയ ദിശയിലേക്ക് നീങ്ങുകയും ചെയ്യുന്നു.`
      ]
    : [
        `Opening: ${protagonist} is introduced to the world of the story and encounters the first major event.`,
        `Development: ${protagonist} investigates the situation and discovers new secrets.`,
        `Conflict: A major obstacle appears and ${protagonist} and the other characters face a difficult challenge.`,
        `Climax: ${protagonist} faces the most dangerous or emotional moment of the story.`,
        `Ending: The consequences of ${protagonist}'s decision unfold and the story takes a new direction.`
      ],

    });

    return;
}

    try {

        const response = await client.responses.create({
            model: "gpt-5.6-luna",

            input: `
Create a professional cinematic animated story from this idea:

${idea}

IMPORTANT LANGUAGE REQUIREMENT:
Generate the complete output in this language:

${outputLanguage || "English"}

The selected language must be used for:
- Title
- Story
- Scene descriptions
- Character actions
- Dialogue
- Camera directions
- Music descriptions
- Sound effects
- Visual atmosphere

Do NOT translate the user's idea into English first.
Understand the meaning of the user's idea in its original language and then create the final story in the selected output language.

Create:

1. A strong cinematic title
2. A detailed professional story
3. Exactly 5 cinematic scenes

For every scene include:

- Scene description
- Character actions
- Dialogue
- Camera movement
- Music
- Sound effects
- Visual atmosphere

Keep characters, locations, events, personality and story continuity consistent across all scenes.

Make the result suitable for a professional animated movie or series.

Return ONLY the final story content.
`
        });

        res.json({
            success: true,
            demo: false,
            result: response.output_text
        });

    } catch (error) {

        console.error("OpenAI story generation error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post("/api/generate-character-image", async (req, res) => {

    const { character } = req.body;

    if (DEMO_MODE) {

        res.json({
            success: true,
            demo: true,
            message: "Character image generation is ready for the real image API.",
            character: character
        });

        return;
    }

    try {

        const response = await client.images.generate({
            model: "gpt-image-2",
            prompt: `
Create a professional cinematic anime character reference sheet.

Character:
${character}

Show:
- Front view
- Side view
- Full body view
- Clear facial features
- Consistent hairstyle
- Consistent clothing
- Consistent body proportions
- Clear colors and details

Use high-quality futuristic anime artwork,
cinematic lighting, clean details,
and a neutral background.

This character will be used as the visual reference
for future animated scenes and videos.
Maintain exact visual consistency.
`
        });

        console.log("Generated image data:", response.data[0]);

        res.json({
            success: true,
            demo: false,
            image: response.data[0]
        });

    } catch (error) {

        console.error("Character image generation error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.post("/api/generate-scene", async (req, res) => {
    const { scene, style, characterDescription } = req.body;

    try {
        const response = await client.responses.create({
            model: "gpt-5.6-luna",
            input: `
Create a professional cinematic animation scene based on:

Scene:
${scene}

Animation Style:
${style || "Cinematic animation"}

Character Description:
${characterDescription || "Not provided"}

Return:
1. Scene description
2. Camera movement
3. Character actions
4. Dialogue
5. Background music
6. Sound effects
7. Visual atmosphere

Make it detailed and suitable for generating an animated video.
`
        });

        res.json({
            success: true,
            scene: response.output_text
        });

    } catch (error) {
        console.error("Scene generation error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// VIDEO GENERATION ENDPOINT
app.post("/api/generate-video", async (req, res) => {

    const { shot, character, style, duration } = req.body;

    if (DEMO_MODE) {

        res.json({
            success: true,
            demo: true,
            message: "Video generation pipeline is ready.",
            videoPrompt: `
Create a cinematic animated video shot.

SHOT:
${shot || "Cinematic establishing shot"}

CHARACTER:
${character || "Character reference not provided"}

STYLE:
${style || "Cinematic futuristic anime"}

DURATION:
${duration || "6 seconds"}

Maintain exact character appearance and visual consistency.
Use cinematic camera movement, realistic character motion,
professional lighting, detailed environment, natural animation,
and high-quality anime movie visuals.
`
        });

        return;
    }

    try {

        // Real video generation will be connected here
        // after API credits are available.

        res.json({
            success: true,
            demo: false,
            message: "Real video generation is ready to be connected."
        });

    } catch (error) {

        console.error("Video generation error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Animation AI backend running on http://localhost:${PORT}`);
});