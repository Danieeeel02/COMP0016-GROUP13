import React from 'react';
import { Loader, Message } from 'rsuite';
import ReactWordcloud from 'react-wordcloud';
import { Visualisations } from '../../lib/constants';
import PropTypes from 'prop-types';

import styles from './WordCloud.module.css';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const options = {
  colors: [],
  enableTooltip: true,
  deterministic: true,
  fontFamily: 'impact',
  fontSizes: [30, 100],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 0,
  rotationAngles: [0, 0],
  scale: 'log',
  spiral: 'rectangular',
  transitionDuration: 100,
};

function WordCloud(props) {
  if (props.words === null) {
    return (
      <Loader className={styles.loading} size="lg" content="Loading data..." />
    );
  }

  if (props.words.length) {
    // We are hardcoding questionId = 8 as the 'enablers' word-based question.
    // Opposite for questionId = 9 (user enters barriers).
    let questionId = 8;
    options.colors = ['#008000', '#00FA9A', '#2ca02c'];
    if (props.visualisationType === Visualisations.WORD_CLOUD_BARRIERS) {
      questionId = 9;
      options.colors = ['#d62728', '#FF0000', '#B22222'];
    }

    const words = {};
    props.words.forEach(word => {
      if (word.question_id === questionId) {
        if (words[word.word]) {
          words[word.word].value++;
        } else {
          words[word.word] = { text: word.word, value: 1 };
        }
      }
    });

    return (
      <div style={{ height: 400, width: 800, margin: 'auto' }}>
        <ReactWordcloud
          id="wordGraphic"
          words={Object.values(words)}
          options={options}
        />
      </div>
    );
  }

  return (
    <Message
      className={styles.message}
      type="info"
      title="No results found"
      description={
        <p>Please try setting a broader date range and/or filter.</p>
      }
    />
  );
}

WordCloud.propTypes = {
  /** An array of objects with properties word and question_id representing the words and their corresponding questions */
  words: PropTypes.array.isRequired,
  /** `word-cloud-enablers` or `word-cloud-barriers` to represent which words to show */
  visualisationType: PropTypes.value,
};

export default WordCloud;
