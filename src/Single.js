import React, { useEffect, useState } from 'react';

// note: max is not included
function generateNumber({ min = 0, max, step = 1 }) {
  let delta = max - min;
  let range = delta / step;

  return Math.floor(Math.random() * range) * step + min;
}

function isEqual(a, b, precision = Number.EPSILON) {
  if (a === b) {
    return true;
  }

  if (Math.abs(a - b) < precision) {
    return true;
  }

  return false;
}

function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { 'content-type': 'application/json' };
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(endpoint, config).then(async response => {
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
}

function Message({ children, type = 'info' }) {
  let wrapperClass =
    'border-t-2 text-2xl my-20 px-4 py-10 shadow-md flex items-center justify-center leading-tight ';

  if (type === 'error') {
    wrapperClass += 'bg-red-100 border-red-600 text-red-700';
  }

  if (type === 'info') {
    wrapperClass += 'bg-yellow-100 border-purple-500 text-purple-700';
  }

  if (type === 'success') {
    wrapperClass += 'bg-green-100 border-green-600 text-green-700';
  }

  return (
    <div className={wrapperClass}>
      <svg
        className="fill-current h-6 w-6 mr-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
      </svg>
      {children}
    </div>
  );
}

function QuestionCard({ answer, error, from, id, number, onChange, step, to }) {
  let inputClass =
    'w-full py-2 px-3 border rounded leading-tight focus:shadow-outline ' +
    (error ? 'border-red-500 text-red-700 ' : 'border-gray-400 text-gray-800');

  let wrapperClass =
    'w-full px-4 py-8 rounded shadow-lg text-center text-gray-700 ' +
    (error ? 'bg-red-100' : 'bg-white');

  return (
    <div className={wrapperClass}>
      <label className="block text-xl mb-8" htmlFor={id}>
        {`Convert ${number.toLocaleString()}${from} to ${to}`}
      </label>
      <input
        aria-describedby={`error-${id}`}
        aria-invalid={error.toString()}
        className={inputClass}
        type="number"
        id={id}
        onChange={onChange}
        step={step}
        value={answer}
      />

      <div
        aria-live="polite"
        aria-relevant="additions removals"
        className="text-red-700 text-sm mt-2"
        id={`error-${id}`}
      >
        {error && <span>Incorrect answer</span>}
      </div>
    </div>
  );
}

function Single(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const [questions, setQuestions] = useState(null);
  const path = props.path.replace(/^\//, '');

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    client('/questions.json')
      .then(data => {
        if (!data[path]) {
          // TODO: should be redirect to 404?
          setIsError(`Incorrect path: "${path}"`);
          setIsLoading(false);
          return;
        }

        let questionsWithSolutions = {};

        Object.keys(data[path]).forEach(key => {
          let item = data[path][key];
          let { divideBy, max, min, multiplyBy, step } = item;
          let number = generateNumber({
            max,
            min,
            step,
          });
          let solution = multiplyBy ? number * multiplyBy : number / divideBy;

          questionsWithSolutions = {
            ...questionsWithSolutions,
            [key]: {
              ...item,
              answer: null,
              error: false,
              number,
              solution,
            },
          };
        });

        setQuestions(questionsWithSolutions);
        setIsLoading(false);
      })
      .catch(err => {
        setIsError(err.message);
        setIsLoading(false);
      });
  }, [path]);

  function handleSubmit(e) {
    e.preventDefault();

    let questionsWithErrors = {};

    Object.keys(questions).forEach(key => {
      let item = questions[key];
      let { answer, solution } = item;
      let isAnswerCorrect = isEqual(answer, solution, 0.0000001);

      questionsWithErrors = {
        ...questionsWithErrors,
        [key]: {
          ...item,
          error: !isAnswerCorrect,
        },
      };
    });

    setQuestions(questionsWithErrors);
  }

  function handleChange(e) {
    let { id, value } = e.target;
    let answer = parseFloat(value);

    setQuestions({
      ...questions,
      [id]: {
        ...questions[id],
        answer,
      },
    });
  }

  return (
    <main className="bg-gray-100 min-h-full py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="capitalize text-gray-700 text-4xl text-center mb-8 leading-10">
          Converting {path}
        </h1>
        {isLoading && (
          <Message>
            <p>Loading...</p>
          </Message>
        )}
        {isError && (
          <Message type="error">
            <p>
              <strong>Error:</strong> {isError}
            </p>
          </Message>
        )}
        {questions && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:col-gap-16">
              {questions &&
                Object.keys(questions).map(key => {
                  let { answer, error, from, number, solution, to } = questions[
                    key
                  ];

                  return (
                    <QuestionCard
                      key={key}
                      error={error}
                      from={from}
                      id={key}
                      number={number}
                      onChange={handleChange}
                      solution={solution}
                      // TODO: should be stored or calculated
                      step="0.0001"
                      to={to}
                      value={answer}
                    />
                  );
                })}
            </div>

            <div className="flex items-center justify-center">
              <button
                className="bg-purple-700 hover:bg-purple-600 text-white text-xl py-2 px-16 my-8 rounded focus:outline-none focus:shadow-outline transition-colors ease-in-out duration-200"
                type="submit"
              >
                Check
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default Single;
