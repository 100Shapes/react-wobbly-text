import React, { Component, PropTypes } from 'react';
import { Motion, spring, presets } from 'react-motion';
import update from 'react-addons-update';

function isEven(n) {
  n = Number(n);
  return n === 0 || !!(n && !(n%2));
}

// function isOdd(n) {
//   return isEven(Number(n) + 1);
// }

function randomDegree(min = 0, max = 20) {
  return Math.random() * (max - min) + min;
}

function wordsToLetters(words) {
  let polarity = 0;

  return words
    .split('')
    .map(letter => ({
      char: letter,
      rotation: randomDegree(),
      polarity: isEven(polarity++),
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

  componentWillMount() {
    this._timer = setInterval(this.handleTick, 500);
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
    const letter = letters[letterIndex];

    if (letter.isSpinning) return;

    const newLetters = update(letters, { 
      [letterIndex]: {
        $merge: {
          isResetting: false,
          rotation: randomDegree(),
          polarity: !letter.polarity
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

  handleTick = () => {
    const { letters } = this.state;
    letters.forEach((_, i) => this.doTwitch(i));
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
              style={{ 
                rotation: function() {
                  const rotation = letter.polarity ? letter.rotation : - letter.rotation;
                  return letter.isResetting ? rotation : spring(rotation, presets.wobbly);
                }()
              }}
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
