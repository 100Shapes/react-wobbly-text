import React, { Component, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';

function randomDegree(max = 20) {
  return Math.floor(Math.random() * max * 2) - max;
}

function wordsToLetters(words) {
  return words
    .split('')
    .map(letter => ({
      char: letter,
      rotation: randomDegree(),
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
    this._timer = setInterval(this.handleTick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.setState({
        letters: wordsToLetters(nextProps.children),
      });
    }
  }

  handleTick = () => {
    const { letters } = this.state;
    this.setState({ letters: letters.map(letter => ({ ...letter, rotation: randomDegree() })) });
  } 

  render() {
    const { letters } = this.state;

    return (
      <div className="text">
        {letters.map((letter, i) => 
          <span key={i}>
            <Motion style={{rotation: spring(letter.rotation)}}>{(inter) => 
              <span 
                className="letter"
                style={{ transform: `rotate(${inter.rotation}deg)` }}
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
