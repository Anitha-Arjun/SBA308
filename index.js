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

// Return assignment object from id
function getAssignmentInfo(ag, assignment_id) {
  let assignmentObj = ag.assignments.find((o) => o.id === assignment_id);
  return assignmentObj;
}

//If submission date is over due date then reduce score by 10%
function isAssigmentOverdue(submissionDate, dueDate, mark) {
  if (submissionDate > dueDate) {
    mark = mark * 0.9;
  }
  return mark;
}

// Calculate average for final result using total score taken/ total max score and remove those 2 temp variables from array and add avg variable to result
function calculateAverage(resultArray) {
  let i = 0;
  while (i < resultArray.length) {
    let average = resultArray[i].scoreTaken / resultArray[i].maxScore;
    delete resultArray[i].scoreTaken;
    delete resultArray[i].maxScore;
    resultArray[i].avg = average;
    i++;
  }
  return resultArray;
}

function getLearnerData(course, ag, submissions) {
  let resultArr = [];
  let obj = {};
  for (let i = 0; i < LearnerSubmissions.length; i++) {
    try {
      if (resultArr.length === 0) {
        obj["id"] = LearnerSubmissions[i].learner_id;
        //Get Assignment Object from Learners submission id
        let assignment = getAssignmentInfo(
          ag,
          LearnerSubmissions[i].assignment_id
        );
        //Check if Assignment is not found or invalid
        if (!assignment) {
          console.warn(
            `Skipping submission at index ${i}: No assignment info found.`
          );
          continue; // Skip this iteration if assignment info is missing
        }
        //Calcuate score based on due date (deduct 10% for overdue)
        let scoreTaken = isAssigmentOverdue(
          LearnerSubmissions[i].submitted_at,
          assignment.due_at,
          LearnerSubmissions[i].submission.score
        );
        //Calcuate percentage for assignment
        let scorePercentage = scoreTaken / assignment.points_possible;
        //Push the score % to object
        obj[LearnerSubmissions[i].assignment_id] = scorePercentage;
        //Check if the previous score is stored, then store current score taken and max score
        if (obj["scoreTaken"] === undefined) {
          obj["scoreTaken"] = scoreTaken;
          obj["maxScore"] = assignment.points_possible;
        }
        //Add score taken and max score to the previous assignment scores
        else {
          obj["scoreTaken"] = obj["scoreTaken"] + scoreTaken;
          obj["maxScore"] = obj["maxScore"] + assignment.points_possible;
        }
        resultArr.push(obj);
      } else {
        //Check if the learners id processed already
        let arrExists = resultArr.find(
          (o) => o.id === LearnerSubmissions[i].learner_id
        );
        //Get Assignment Object from Learners submission id
        let assignment = getAssignmentInfo(
          ag,
          LearnerSubmissions[i].assignment_id
        );
        if (!assignment) {
          console.warn(
            `Skipping submission at index ${i}: No assignment info found.`
          );
          continue; // Skip this iteration if assignment info is missing
        }
        //Calcuate score based on due date (deduct 10% for overdue)
        let scoreTaken = isAssigmentOverdue(
          LearnerSubmissions[i].submitted_at,
          assignment.due_at,
          LearnerSubmissions[i].submission.score
        );
        //Calcuate percentage for assignment
        let scorePercentage = scoreTaken / assignment.points_possible;
        //Check if the learners id is not processed, then add all required objects
        if (arrExists === undefined) {
          arrExists = {};
          arrExists["id"] = LearnerSubmissions[i].learner_id;
          arrExists[LearnerSubmissions[i].assignment_id] = scorePercentage;
          arrExists["scoreTaken"] = scoreTaken;
          arrExists["maxScore"] = assignment.points_possible;
        } //If id exists then add all required values
        else {
          arrExists[LearnerSubmissions[i].assignment_id] = scorePercentage;
          resultArr = resultArr.filter(
            (s) => s.id !== LearnerSubmissions[i].learner_id
          );
          arrExists["scoreTaken"] = arrExists["scoreTaken"] + scoreTaken;
          arrExists["maxScore"] =
            arrExists["maxScore"] + assignment.points_possible;
        }

        resultArr.push(arrExists);
      }
    } catch (error) {
      console.error(
        `Error processing submission at index ${i}: ${error.message}`
      );
    }
  }

  return calculateAverage(resultArr);
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);
