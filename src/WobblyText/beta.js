import React, { Component, PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import update from 'react-addons-update';

function randomDegree(max = 20) {
  return Math.floor(Math.random() * max * 2) - max;
}

function wordsToLetters(words) {
  return words
    .split('')
    .map(letter => ({
      char: letter,
      rotation: randomDegree(),
      isSpinning: false,
      isResetting: false,
    }));
}

class WobblyText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      letters: wordsToLetters(props.children),
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.setState({
        letters: wordsToLetters(nextProps.children),
      });
    }
  }


  noop = () => {}

  doTwitch = (letterIndex) => {
    const { letters } = this.state;

    const newLetters = update(letters, { 
      [letterIndex]: {
        $merge: {
          isResetting: false,
          rotation: randomDegree(),
        },
      },
    });

    this.setState({ letters: newLetters });
  }

  doSpin = (letterIndex) => {
    const { letters } = this.state;

    const newLetters = update(letters, { 
      [letterIndex]: {
        $merge: {
          isSpinning: true,
          isResetting: false,
          rotation: letters[letterIndex].rotation + 360,
        },
      },
    });
    
    this.setState({ letters: newLetters });
  }

  doSpinReset = (letterIndex) => {
    const { letters } = this.state;
    
    const newLetters = update(letters, { 
      [letterIndex]: {
        $merge: {
          isSpinning: false,
          isResetting: true,
          rotation: letters[letterIndex].rotation - 360,
        },
      },
    });

    this.setState({ letters: newLetters }, () => setTimeout(() => this.doTwitch(letterIndex), 0)); 
  }


  handleRest = (letterIndex) => {    
    const { letters } = this.state;
    const letter = letters[letterIndex];

    if (letter.isSpinning) {
      return this.doSpinReset(letterIndex);      
    }
    return this.doTwitch(letterIndex);
  }

  handleLetterHover = (letterIndex) => {
    this.doSpin(letterIndex);
  }

  render() {
    const { letters } = this.state;

    return (
      <div className="text">
        {letters.map((letter, i) => 
          <span key={i}>
            <Motion 
              defaultStyle={{ rotation: 0 }}
              style={{ rotation: letter.isResetting ? letter.rotation : spring(letter.rotation, presets.wobbly) }}
              onRest={() => setTimeout(() => this.handleRest(i), 0)}
            >{(inter) => 
              <span 
                className="letter"
                style={{ transform: `rotate(${inter.rotation}deg)` }}
                onMouseEnter={!letter.isSpinning ? () => this.handleLetterHover(i) : null}
              >{letter.char}</span>
            }</Motion>
          </span>
        )}        
      </div>
    );
  }
}

WobblyText.propTypes = {
  children: PropTypes.string.isRequired,
}

WobblyText.defaultProps = {
  children: 'Happy Friday!',
}

export default WobblyText;
