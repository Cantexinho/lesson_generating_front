// try {
//   let lessonData = await crudService.fetchLessonByName(title);
//   let data;
//   if (lessonData != null) {
//     data = await crudService.fetchLessonParts(lessonData.id);
//   } else {
//     const generatorData = await crudService.generateLessonText(
//       title,
//       selectedNumber
//     );
//     await crudService.postLessonText(generatorData.content);
//     await crudService.createLesson(generatorData.lesson_name);
//     const createdLessonData = await crudService.fetchLessonByName(
//       generatorData.lesson_name
//     );
//     console.log(createdLessonData);
//     const generatorSplitData = await crudService.splitLessonText(
//       generatorData.content
//     );
//     const splitLessonsData = generatorSplitData.map((lesson) => {
//       return {
//         ...lesson,
//         lesson_id: createdLessonData.id,
//       };
//     });
//     console.log(splitLessonsData);
//     await crudService.postSplitLesson(splitLessonsData);
//     data = await crudService.fetchLessonParts(createdLessonData.id);
//   }
//   const sortedParts = data.sort((a, b) => a.number - b.number);
//   setParts(sortedParts);
// } catch (err) {
//   console.error(err);
// } finally {
//   setSubmitLoading(false);
// }
// console.log(parts);
// };
