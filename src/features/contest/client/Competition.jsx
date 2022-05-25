import Button from 'components/Button';
import React from 'react';
import { CodeType, useCompiler } from 'hooks/useCompiler';
import ProblemSolve from '../../../components/ProblemSolve';
import PageLoading from 'components/PageLoading';
import { useMutation } from '@apollo/client';
import { INSERT_CONTEST_RESULT } from 'graphql/Mutation';
import moment from 'moment';

const Competition = ({ contestData, component: Component, ...rest }) => {
  const [saveResultContest] = useMutation(INSERT_CONTEST_RESULT);

  const [sourceCode, setSourceCode] = React.useState([]);
  const [currentExercise, setCurrentExercise] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { runCode } = useCompiler();

  const exercisesData = contestData?.exercises;

  const handleCalTotalPoint = (resultList, casesExercise) => {
    return resultList.map((item, index) => (item.data.status.id === 3 ? casesExercise[index].point : 0));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const date = moment(rest.date).format('hh:mm:ss');
    const totalSeconds = moment.duration(date).asSeconds();
    const completionTime = contestData?.time - totalSeconds;

    let results = [];

    if (sourceCode.length === 0) {
      return alert('Bạn chưa code bài nào cả sao nộp ?');
    }

    try {
      await Promise.all(
        exercisesData.map(async (exercise, index) => {
          const exercisesResult = await runCode(exercise, sourceCode[index], CodeType.Contest);

          await saveResultContest({
            variables: {
              contestId: contestData.id,
              exerciseId: exercise.id,
              point: handleCalTotalPoint(exercisesResult, exercise.metadata),
              completionTime,
            },
            onCompleted: () => {},
            onError: (error) => {
              console.log(error.message);
            },
          });

          results.push(...exercisesResult);
        }),
      );

      setLoading(false);

      setSourceCode([]);
      setCurrentExercise(0);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="competition">
      <div className="competition_header">
        <div className="competition_header-left">
          {exercisesData.map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentExercise(index)}
              backgroundColor={currentExercise === index ? 'green' : null}
            >
              {index + 1}
            </Button>
          ))}
        </div>
        <div className="competition_header-right">
          <Component {...rest} />
          <Button onClick={handleSubmit}>Nộp bài</Button>
        </div>
      </div>
      <div>
        <ProblemSolve
          isContest={true}
          exerciseContest={exercisesData[currentExercise]}
          currentExercise={currentExercise}
          sourceCodeOfContest={sourceCode}
          setSourceCodeOfContest={setSourceCode}
        />
      </div>
      {loading && <PageLoading />}
    </div>
  );
};

export default Competition;
