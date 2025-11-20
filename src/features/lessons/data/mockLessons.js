const baseLesson = (id, name, sections) => ({
  id,
  name,
  parts: sections.map((section, index) => ({
    id: `${id}-part-${index + 1}`,
    lesson_id: id,
    number: index + 1,
    name: section.name,
    lesson_part_content: section.content,
  })),
});

export const MOCK_LESSONS = [
  baseLesson("lesson-photosynthesis", "Photosynthesis Basics", [
    {
      name: "What Is Photosynthesis?",
      content:
        "Photosynthesis is the process by which plants convert light energy into chemical energy stored in glucose. It requires light, water, and carbon dioxide.",
    },
    {
      name: "Chloroplast Structure",
      content:
        "Chloroplasts contain thylakoid membranes where light-dependent reactions occur, and the stroma where the Calvin cycle produces sugars.",
    },
    {
      name: "Key Takeaways",
      content:
        "Light-dependent reactions create ATP and NADPH, while the Calvin cycle uses them to fix carbon dioxide into glucose.",
    },
  ]),
  baseLesson("lesson-ww2-intro", "Intro to World War II", [
    {
      name: "Global Context",
      content:
        "Following World War I, economic turmoil and the rise of authoritarian regimes created the conditions that led to World War II.",
    },
    {
      name: "Major Turning Points",
      content:
        "Key events include the Battle of Britain, Operation Barbarossa, the attack on Pearl Harbor, and D-Day, each shifting the balance of power.",
    },
    {
      name: "Lessons Learned",
      content:
        "The war reshaped international diplomacy, led to the United Nations, and highlighted the necessity of collective security and human rights.",
    },
  ]),
  baseLesson("lesson-algebra-fundamentals", "Fundamentals of Algebra", [
    {
      name: "Variables & Expressions",
      content:
        "A variable represents an unknown value. Expressions combine variables and numbers using operations such as addition, subtraction, multiplication, and division.",
    },
    {
      name: "Solving Linear Equations",
      content:
        "To solve 3x + 7 = 22, subtract 7 from both sides and divide by 3 to isolate x. Always perform the same operation on both sides.",
    },
    {
      name: "Quick Exercises",
      content:
        "Practice problems: 1) 2x - 5 = 9  2) 4a + 3 = 19  3) 6 - y = 14. Solve each by isolating the variable.",
    },
  ]),
];

const randomId = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;

export const createMockLesson = (title, partCount = 3) => {
  const normalizedTitle = title?.trim() || "Untitled Lesson";
  const lessonId = randomId("mock-lesson");
  const totalParts = Math.max(1, Number(partCount) || 1);

  const parts = Array.from({ length: totalParts }, (_, index) => ({
    id: `${lessonId}-part-${index + 1}`,
    lesson_id: lessonId,
    number: index + 1,
    name: `${normalizedTitle} - Part ${index + 1}`,
    lesson_part_content: `Placeholder content for ${normalizedTitle}, section ${
      index + 1
    }.`,
  }));

  return {
    id: lessonId,
    name: normalizedTitle,
    parts,
  };
};
