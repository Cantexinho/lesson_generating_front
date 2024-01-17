export const fetchLessonByName = async (title) => {
  const response = await fetch(
    `http://127.0.0.1:8000/lesson?name=${encodeURIComponent(title)}`
  );
  return response.json();
};

export const fetchAllLessons = async () => {
  const response = await fetch(`http://127.0.0.1:8000/all_lessons`);
  return response.json();
};

export const fetchLessonParts = async (id) => {
  const response = await fetch(
    `http://127.0.0.1:8000/lesson/${encodeURIComponent(id)}/parts`
  );
  return response.json();
};

export const generateLessonText = async (title, selectedNumber) => {
  const response = await fetch(`http://127.0.0.1:8001/lesson/text/generate`, {
    method: "POST",
    body: JSON.stringify({
      lesson_name: title,
      part_number: selectedNumber,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return response.json();
};

export const createLesson = async (name) => {
  const response = await fetch(`http://127.0.0.1:8000/lesson/name`, {
    method: "POST",
    body: JSON.stringify({
      name: name,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return response.json();
};

export const splitLessonText = async (content) => {
  const response = await fetch(`http://127.0.0.1:8001/lesson/text/split`, {
    method: "POST",
    body: JSON.stringify({
      lesson_text: content,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return response.json();
};

export const postSplitLesson = async (splitLessonsData) => {
  const response = await fetch(`http://127.0.0.1:8000/lesson/parts/`, {
    method: "POST",
    body: JSON.stringify(splitLessonsData),
    headers: { "Content-Type": "application/json" },
  });

  return response.json();
};

export const postLessonText = async (content) => {
  const response = await fetch(`http://127.0.0.1:8000/lesson/text/`, {
    method: "POST",
    body: JSON.stringify({ content: content }),
    headers: { "Content-Type": "application/json" },
  });

  return response.json();
};

export const regeneratePart = async (title, part) => {
  const response = await fetch(`http://127.0.0.1:8001/lesson/part/regenerate`, {
    method: "POST",
    body: JSON.stringify({
      lesson_name: title,
      part_name: part.name,
      part_content: part.lesson_part_content,
    }),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const fetchLessonPart = async (partID) => {
  const response = await fetch(
    `http://127.0.0.1:8000/lesson/${encodeURIComponent(partID)}/part`
  );
  return response.json();
};

export const updateLessonPart = async (newPart) => {
  const response = await fetch(`http://127.0.0.1:8000/lesson/part/`, {
    method: "PUT",
    body: JSON.stringify({
      id: newPart.id,
      number: newPart.number,
      name: newPart.name,
      lesson_part_content: newPart.lesson_part_content,
      lesson_id: newPart.lesson_id,
    }),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const extendPart = async (title, part) => {
  const response = await fetch(`http://127.0.0.1:8001/lesson/part/extend`, {
    method: "POST",
    body: JSON.stringify({
      lesson_name: title,
      part_name: part.name,
      part_content: part.lesson_part_content,
    }),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const deletePart = async (partId) => {
  const response = await fetch(`http://127.0.0.1:8000/lesson/part/`, {
    method: "DELETE",
    body: JSON.stringify({
      part_id: partId,
    }),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const deleteLesson = async (lessonId) => {
  const response = await fetch(`http://127.0.0.1:8000/lesson/`, {
    method: "DELETE",
    body: JSON.stringify({
      lesson_id: lessonId,
    }),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};
