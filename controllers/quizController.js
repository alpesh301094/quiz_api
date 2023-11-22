const Quiz = require('../models/quiz');
const QuizResult = require('../models/quizResult'); 
const ObjectId = require('mongoose').Types.ObjectId;

exports.list = async (req, res) => {
    // const list = await Quiz.find({},{question:1, 'options._id': 1, 'options.option': 1});
    const list = await Quiz.find({},{question:1}).select({'options._id': 1, 'options.option': 1});
    res.status(200).json({data: list})
}

exports.create = async (req, res) => {
    const reqBody = req.body;
    // console.log(reqBody);
    try {
        const quiz = await Quiz({
            question: reqBody.question,
            options: reqBody.options,
        })
        quiz.save();
        res.status(200).json({message: "Success"});
    } catch (error) {
        res.status(400).json({message: "Error"});
    }
}

exports.delete = async (req, res) => {
    const reqBody = req.body;
    const id = req.params.id;
    try {
        const quiz = await Quiz.deleteOne({id: id});
        res.status(200).json({message: "Success"});
    } catch (error) {
        res.status(400).json({message: "Error"});
    }
}

exports.startQuiz = async (req, res) => {
    const allQuestion = await Quiz.aggregate([
        {
          $sample: { size: Number(process.env.TOTAL_QUESTION) } // You want to get random docs
        },
        {
          $project: {
            question: 1,
            'options.option': 1, // Include field1 in the results
            'options._id': 1 // Include field2 in the results
          }
        }
      ], (err, result) => {
        if (err) {
          console.error(err);
          res.status(400).json({message: 'Error'})
        }else{
            // res.status(200).json({data: result})
        }
      });
      res.status(200).json({data: allQuestion})
}

exports.submitQuiz = async (req, res) => {
  
  if(req.body.length == Number(process.env.TOTAL_QUESTION)){
    const questions = req.body;
    /* const questionIds = questions.map((question) => question.question_id);
    const selectedQuestion = await Quiz.find({ _id: { $in: questionIds } }); */
    let resultCount = 0;
    const questionIds = questions.map(async (question) => {
      const selectedQuestion = await Quiz.find({ _id: question.question_id });
      // console.log(selectedQuestion);
      selectedQuestion.map(async (questionObj) => {
        // console.log(questionObj.options);
        questionObj.options.map((optObj) => {
          if((String)(new ObjectId(optObj._id)) ==  question.option_id && optObj.isCorrect == true){
            resultCount = resultCount + 1;
          }
        })
      });
    });
    setTimeout(async () => {

      const resultInMark = resultCount / req.body.length * 100+ ' %'
      const resultData = await QuizResult({
        userId: req.user.id,
        result: resultInMark
      });
      resultData.save();

      res.status(200).json({
        message: "Your result", 
        currect_answer: resultCount, 
        mark: resultInMark
      })
      
    }, 2000);

  }else{
    res.status(400).json({message: "Please filled all questions"})
  }
}