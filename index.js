// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, assignmentGroup, submissions) {
  // here, we would process this data to achieve the desired result.
  // our result is going to be an array of objects so we can initialize an empty array to hold the result
  const result = [];

  return result;

  // data validation helper functions. The purpose of these functions is to throw errors if the data is invalid so they no return value
  // data validation needed:
  // assignmentGroup course_id should match course id
  // assignmentGroup points_possible should be greater than 0
  // validate that the ids and points values are numbers not strings
  // check if all required fields are present and of the correctType
  function validateData(course, assignmentGroup) {
    if (course.id !== assignmentGroup.course_id) {
      throw new Error(
        `Course id (${course.id}) does not match with assignment group course id (${assignmentGroup.course_id})`
      );
    }

    assignmentGroup.assignments.forEach((assignment) => {
      if (assignment.points_possible <= 0) {
        throw new Error(
          `Points possible for assignment ${assignment.id}, ${assignment.name} is less than or equal to 0. Please use a positive, non-zero number`
        );
      }
    });
  }

  function validateObjFields(course, assignmentGroup, submissions) {
    // if a required field is missing it's typeof will be undefined and will not match the type check so an error will also be thrown if the field is missing
    // course object first, validate that the id is a number and the name is a string
    if (typeof course.id !== "number" || typeof course.name !== "string") {
      throw new Error(
        "Course object not valid. Ensure the id is a number and the name is a string."
      );
    }

    // assignmentGroup object next, first validate that id, course_id, and group_weight are numbers, and name is a string
    if (
      typeof assignmentGroup.id !== "number" ||
      typeof assignmentGroup.course_id !== "number" ||
      typeof assignmentGroup.group_weight !== "number" ||
      typeof assignmentGroup.name !== "string"
    ) {
      throw new Error(
        "Assignment group not valid. Ensure that the id, course_id, and group_weight are numbers and the name is a string. "
      );
    }
    // next, still in the assignmentGroup object, loop over the assignments array and ensure each object in the array has: id and points_possible as numbers, and name and due_at as strings
    assignmentGroup.assignments.forEach((assignment) => {
      if (
        typeof assignment.id !== "number" ||
        typeof assignment.points_possible !== "number" ||
        typeof assignment.name !== "string" ||
        typeof assignment.due_at !== "string"
      ) {
        throw new Error(
          "Assignment array in assignment group not valid. Ensure the id and points_possible are numbers and the name and due_at are strings"
        );
      }
    });

    //lastly, evaluate the objects within the submissions array. Loop over each object and ensure that the learner_id, assignment_id, and submission.score are all numbers and the submission.submitted_at is a string
    submissions.forEach((submission) => {
      if (
        typeof submission.learner_id !== "number" ||
        typeof submission.assignment_id !== "number" ||
        typeof submission.submission.score !== "number" ||
        typeof submission.submission.submitted_at !== "string"
      ) {
        throw new Error(
          "Submission in submissions array not valid. Ensure that the learner_id, assignment_id, and submission.score are all numbers and the submission.submitted_at is a string"
        );
      }
    });
  }
}

try {
  const result = getLearnerData(
    CourseInfo,
    AssignmentGroup,
    LearnerSubmissions
  );
  console.log(result);
  
} catch (e) {
  console.log(e);
}

// Expected Output
//   const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0 // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833 // late: (140 - 15) / 150
//     }
//   ];
