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
  // step one is to use the helper functions to validate the data
  validateData(course, assignmentGroup);
  validateObjFields(course, assignmentGroup, submissions);
  // our result is going to be an array of objects so we can initialize an empty array to hold the result
  const result = [];
  //we need a learnerObject to update and push to the result array. This object will need to be cleared(reset)
  let learnerObject = {};

  // filter out assignments that aren't yet due
  const assignments = filterAssignments(assignmentGroup.assignments);
  const assignmentIds = getAssignmentIds(assignments);

  // call the learnerIds helper function to get an array of the learner's ids
  const learnersIds = learnerIds(submissions);

  for (let i = 0; i < learnersIds.length; i++) {
    learnerObject.id = learnersIds[i];
    learnerObject.avg = parseFloat(
      avgScore(assignments, submissions, learnerObject.id).toFixed(4)
    );
    for (const submission of submissions) {
      if (
        submission.learner_id === learnerObject.id &&
        assignmentIds.includes(submission.assignment_id)
      ) {
        learnerObject[`${submission.assignment_id}`] = parseFloat(
          scoreAssignment(assignments, submission).toFixed(4)
        );
      }
    }
    result.push(learnerObject);
    learnerObject = {};
  }

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
    } else if ( // assignmentGroup object next, first validate that id, course_id, and group_weight are numbers, and name is a string
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

  // a helper function to get the learner ids from learner submissions
  function learnerIds(submissions) {
    const learner_ids = [];

    for (const learnerSubmission of submissions) {
      if (learner_ids.includes(learnerSubmission.learner_id)) {
        continue;
    }
    learner_ids.push(learnerSubmission.learner_id);
    }

    learner_ids.sort((a, b) => a - b);
    return learner_ids;
  }

  // a helper function to filter out assignments that aren't due yet
  function filterAssignments(assignments) {
    const currentDate = new Date();
    return assignments.filter((assignment) => {
      return currentDate > Date.parse(assignment.due_at);
    });
  }

  // a helper function to get the assignment ids from the array of assignments
  function getAssignmentIds(assignments) {
    const assignmentIds = [];
    assignments.forEach((assignment) => assignmentIds.push(assignment.id));
    return assignmentIds;
  }

  // a helper function to get the assignment score
  function scoreAssignment(assignments, submission) {
    let score = 0;
    const assignment = assignments.find(
      (assignment) => assignment.id === submission.assignment_id
    );
    if (assignment) {
      if (
        Date.parse(assignment.due_at) <
        Date.parse(submission.submission.submitted_at)
      ) {
        const pointDeduction = assignment.points_possible * 0.1;
        const points = submission.submission.score - pointDeduction;
        score = points / assignment.points_possible;
      } else {
        score = submission.submission.score / assignment.points_possible;
      }
    }
    return score;
  }

  function avgScore(assignments, submissions, learnerId) {
    const totalPointsPossible = assignments.reduce(
      (acc, assignment) => acc + assignment.points_possible,
      0
    );
    let totalPoints = 0;
    for (const submission of submissions) {
      const assignment = assignments.find(
        (assignment) => assignment.id === submission.assignment_id
      );
      if (learnerId === submission.learner_id && assignment) {
        totalPoints +=
          scoreAssignment(assignments, submission) * assignment.points_possible;
      }
    }
    return totalPoints / totalPointsPossible;
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
