import * as crudService from "features/lessons/services/lessonCrudService";

export const handleAction = async (
  parts,
  partId,
  title,
  actionFunction,
  setLoading,
  setParts
) => {
  setLoading((prevLoading) => ({ ...prevLoading, [partId]: true }));

  const part = parts.find((part) => part.id === partId);
  const regeneratedPartText = await actionFunction(title, part);
  const lessonPart = await crudService.fetchLessonPart(part.id);
  lessonPart.lesson_part_content = regeneratedPartText;
  const newPart = await crudService.updateLessonPart(lessonPart);
  setParts(parts.map((part) => (part.id === partId ? newPart : part)));

  setLoading((prevLoading) => ({ ...prevLoading, [partId]: false }));
};

export const handleDeletePart = async (
  parts,
  partId,
  title,
  setLoading,
  setParts
) => {
  setLoading((prevLoading) => ({ ...prevLoading, [partId]: true }));

  const part = parts.find((part) => part.id === partId);
  await crudService.deletePart(part.id);
  let lessonData = await crudService.fetchLessonByName(title);
  let data = await crudService.fetchLessonParts(lessonData.id);
  const sortedParts = data.sort((a, b) => a.number - b.number);
  setParts(sortedParts);

  setLoading((prevLoading) => ({ ...prevLoading, [partId]: false }));
};
