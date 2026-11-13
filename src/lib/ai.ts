import { findKnowledge } from "./subjects";

// Real AI: if OPENAI_API_KEY is configured, call OpenAI. Otherwise use the
// curated CAPS tutor engine (honest offline mode — never pretends to be a live LLM).

async function callOpenAI(messages: {role:string;content:string}[]): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", messages, temperature: 0.7 }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch { return null; }
}

export function aiMode(): string {
  return process.env.OPENAI_API_KEY ? "Live AI (OpenAI)" : "CAPS Tutor Engine (offline mode — add OPENAI_API_KEY for live AI)";
}

export async function generateExplanation(opts: {
  question: string; subject: string; level: string; length: string; grade: number; curriculum: string;
}): Promise<{ text: string; mode: string }> {
  const { question, subject, level, length, grade, curriculum } = opts;
  const system = `You are StudyMate, a friendly South African CAPS tutor for Grade ${grade}. Explain in simple, encouraging language. Never make the student feel embarrassed. Use step-by-step explanations, examples, and key points. Level: ${level}. Length: ${length}. Subject: ${subject}. Curriculum: ${curriculum}.`;
  const live = await callOpenAI([{role:"system",content:system},{role:"user",content:question}]);
  if (live) return { text: live, mode: "Live AI (OpenAI)" };

  const kb = findKnowledge(question);
  const lvlNote = level === "beginner" ? "Beginner level — very simple words, lots of everyday analogies." : level === "advanced" ? "Advanced level — include terminology, deeper reasoning and exam-style depth." : "Intermediate level — clear and structured, with terminology explained.";
  const lenNote = length === "short" ? "Keep this SHORT: just the core idea in 3–4 lines." : length === "detailed" ? "Give a DETAILED answer with extra examples and common mistakes." : "";

  if (kb) {
    const steps = length === "short" ? kb.steps.slice(0,3) : kb.steps;
    const text = `## ${kb.title} — ${subject} (Grade ${grade}, ${curriculum})\n\n${lvlNote} ${lenNote}\n\n**In simple words:** ${kb.simple}\n\n**Step-by-step:**\n${steps.join("\n")}\n\n**Example:** ${kb.example}\n\n**Key points to remember:**\n${kb.keyPoints.map(k=>`• ${k}`).join("\n")}\n\n💡 **Exam tip:** ${kb.examTip}\n\n---\n*No question is too basic — asking is how learning happens. Want a shorter version, a quiz on this, or flashcards? Just ask!*`;
    return { text, mode: aiMode() };
  }

  // Generic structured tutor response for topics outside the built-in base.
  // This is a transparent study framework, not a fabricated factual answer.
  const topic = question.replace(/\?$/,"").trim();
  const text = `## Let's break down: "${topic}"\n\n**${subject} • Grade ${grade} • ${curriculum} • ${level} level**\n\n${lvlNote} ${lenNote}\n\nI don't have this exact topic in my built-in CAPS knowledge base yet, so here is a reliable study framework to master it — and you can paste your class notes into **Smart Notes** and I'll generate summaries, flashcards and quizzes directly from YOUR material:\n\n**Step-by-step approach:**\n1. **Define it** — write the topic in one sentence in your own words.\n2. **Find the core idea** — what is the single most important concept?\n3. **List the parts** — break it into 3–5 sub-points.\n4. **Work an example** — find one worked example in your textbook and redo it without looking.\n5. **Test yourself** — close the book and explain it aloud (the Feynman technique).\n6. **Check against the CAPS document** — make sure you cover the required content for your grade.\n\n**Try asking me about:** photosynthesis, algebra, trigonometry, Newton's laws, cells, genetics, apartheid history, supply & demand, accounting equation, essay writing, climate, or the marketing mix — I have full step-by-step lessons for those.\n\n**Or:** paste your notes in Smart Notes → I'll summarise them, extract key concepts, and build flashcards + a quiz from your own words. That's the fastest way to revise this topic.\n\n---\n*Remember: every expert started exactly where you are. Keep going!*`;
  return { text, mode: aiMode() };
}

export function summariseNote(content: string): { summary: string; keyConcepts: string[] } {
  const sentences = content.replace(/\s+/g," ").split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>s.length>30);
  const summary = sentences.slice(0, Math.min(5, sentences.length)).join(" ") || content.slice(0,400);
  // Extract key concepts: capitalised phrases + important terms
  const terms = new Set<string>();
  const stop = new Set(["The","This","That","These","Those","When","Then","With","From","Which","What","How","There","Their","They","And","But","For","Are","Was","Were","Has","Have","Will","Can","Its","It","In","On","Of","To","A","An"]);
  for (const s of sentences) {
    for (const w of s.match(/[A-Z][a-z]{3,}/g) || []) if (!stop.has(w)) terms.add(w);
    for (const w of s.match(/\b(important|key|definition|means|refers|called|known as)\b/gi) || []) terms.add(w);
  }
  const keyConcepts = Array.from(terms).slice(0,8);
  if (keyConcepts.length === 0) keyConcepts.push("Review the summary above and highlight definitions, dates, formulas and examples.");
  return { summary, keyConcepts };
}

export function generateQuizFromText(opts: { text: string; subject: string; topic: string; difficulty: string; count: number }): any[] {
  const { text, subject, topic, difficulty, count } = opts;
  const sentences = text.replace(/\s+/g," ").split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>s.length>40);
  const questions: any[] = [];
  const distractorsPool = ["None of the above","All of the above","It has no effect","It is not applicable"];
  for (let i=0; i<Math.min(count, sentences.length); i++) {
    const s = sentences[i];
    // Cloze: blank out a long word
    const words = s.split(" ");
    const longIdx = words.findIndex(w=>w.replace(/[^a-zA-Z]/g,"").length>=6);
    if (longIdx === -1) continue;
    const answer = words[longIdx].replace(/[^a-zA-Z]/g,"");
    const blanked = words.map((w,idx)=> idx===longIdx ? "_____" : w).join(" ");
    const others = sentences.filter((_,j)=>j!==i).slice(0,3).map(x=> (x.split(" ").find(w=>w.replace(/[^a-zA-Z]/g,"").length>=6)||"concept").replace(/[^a-zA-Z]/g,""));
    const options = Array.from(new Set([answer, ...others, ...distractorsPool])).slice(0,4);
    // shuffle deterministically
    options.sort((a,b)=> (a.charCodeAt(0)+i) - (b.charCodeAt(0)+i));
    questions.push({
      q: `Fill in the blank (${subject}${topic?` — ${topic}`:""}): "${blanked}"`,
      options,
      answer,
      explanation: `The original sentence was: "${s}" — the missing word is "${answer}".`,
      type: "mcq",
    });
  }
  // If text too short, add comprehension questions
  if (questions.length < 2 && sentences.length>0) {
    questions.push({
      q: `According to your notes, which statement best summarises the main idea?`,
      options: [sentences[0].slice(0,80)+"…", "The notes contain no important information", "The opposite of the first sentence", "None of the above"],
      answer: sentences[0].slice(0,80)+"…",
      explanation: "This is the opening sentence of your notes, which usually states the main idea.",
      type: "mcq",
    });
  }
  const diffLabel = difficulty;
  return questions.map(q=>({...q, difficulty: diffLabel}));
}

export function generateQuizFromTopic(opts: { subject: string; topic: string; difficulty: string; count: number }): any[] {
  const kb = findKnowledge(opts.topic + " " + opts.subject);
  if (kb) {
    const qs: any[] = [];
    kb.keyPoints.forEach((kp,i)=>{
      if (qs.length>=opts.count) return;
      qs.push({
        q: `Which of these is a key point about ${kb.title}?`,
        options: [kp, "It has no effect on the topic", "It only applies in Grade 8", "It is the opposite of the correct idea"],
        answer: kp,
        explanation: `From the lesson on ${kb.title}: ${kp}.`,
        type: "mcq", difficulty: opts.difficulty,
      });
    });
    qs.push({
      q: `What is the best example of ${kb.title} in practice?`,
      options: [kb.example.slice(0,90)+"…", "There is no real-life example", "It never happens in South Africa", "It only happens in exams"],
      answer: kb.example.slice(0,90)+"…",
      explanation: kb.example,
      type: "mcq", difficulty: opts.difficulty,
    });
    return qs.slice(0, opts.count);
  }
  // Generic topic quiz using subject topics
  return [{
    q: `You are revising "${opts.topic}" for ${opts.subject}. What is the best first step?`,
    options: ["Write a one-sentence definition in your own words, then list its key parts", "Memorise the whole textbook page", "Skip it and hope it is not in the exam", "Only read the headings"],
    answer: "Write a one-sentence definition in your own words, then list its key parts",
    explanation: "Active recall (explaining in your own words) is the most effective revision technique.",
    type: "mcq", difficulty: opts.difficulty,
  },
  {
    q: `For "${opts.topic}", which revision method is most effective?`,
    options: ["Testing yourself with flashcards and past questions", "Re-reading notes passively", "Highlighting everything in one colour", "Studying only the night before"],
    answer: "Testing yourself with flashcards and past questions",
    explanation: "Retrieval practice (testing yourself) strengthens memory far more than re-reading.",
    type: "mcq", difficulty: opts.difficulty,
  }];
}

export function generateFlashcardsFromText(text: string, subject: string): {front:string;back:string}[] {
  const sentences = text.replace(/\s+/g," ").split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>s.length>35);
  const cards: {front:string;back:string}[] = [];
  for (const s of sentences.slice(0,10)) {
    const words = s.split(" ");
    const longIdx = words.findIndex(w=>w.replace(/[^a-zA-Z]/g,"").length>=6);
    if (longIdx===-1) continue;
    const answer = words[longIdx].replace(/[^a-zA-Z]/g,"");
    const front = words.map((w,idx)=> idx===longIdx ? "_____" : w).join(" ");
    cards.push({ front: `Complete: ${front}`, back: answer });
  }
  if (cards.length===0 && sentences.length>0) cards.push({front: "Summarise the main idea of your note in one sentence.", back: sentences[0]});
  return cards;
}
