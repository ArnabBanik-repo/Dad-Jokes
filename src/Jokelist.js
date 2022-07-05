import React, { Component } from "react";
import axios from "axios";
import "./Jokelist.css";
import Joke from "./Joke";
class Jokelist extends Component {
  static defaultProps = {
    num_jokes: 10,
  };
  constructor(props) {
    super(props);
    this.presentJokes = new Set(this.state.jokes.map((joke) => joke.text));
  }
  state = {
    jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
    isLoading: false,
  };

  handleVote = (id, delta) => {
    this.setState(
      (st) => ({
        jokes: st.jokes.map((j) =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        ),
      }),
      () => {
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes));
      }
    );
  };

  handleClick = () => {
    this.getJokes();
    console.log("done");
  };

  componentDidMount() {
    this.state.jokes.length === 0 ? this.getJokes() : null;
  }

  async getJokes() {
    this.setState({ isLoading: true });
    let jokes = JSON.parse(window.localStorage.getItem("jokes") || "[]");
    for (let i = 0; i < this.props.num_jokes; i++) {
      const res = await axios("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });
      if (this.presentJokes.has(res.data.joke)) {
        i--;
        continue;
      }
      jokes.push({ id: res.data.id, text: res.data.joke, votes: 0 });
    }
    this.setState({ jokes: jokes, isLoading: false });
    window.localStorage.setItem("jokes", JSON.stringify(jokes));
  }

  render() {
    const jokes = this.state.jokes.sort((a, b) => {
      return b.votes - a.votes;
    });
    return this.state.isLoading ? (
      <div className="Jokelist-spinner">
        <i className="far fa-8x fa-laugh fa-spin"></i>
        <h1 className="Jokelist-title">Loading...</h1>
      </div>
    ) : (
      <div className="Jokelist">
        <div className="Jokelist-sidebar">
          <h1 className="Jokelist-title">
            <span>Dad</span> Jokes
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt="Emoji"
            className="Jokelist-image"
          />
          <button className="Jokelist-getmore" onClick={this.handleClick}>
            Get more
          </button>
        </div>

        <div className="Jokelist-jokes">
          {jokes.map((joke) => (
            <Joke
              id={joke.id}
              votes={joke.votes}
              text={joke.text}
              key={joke.id}
              handleVote={this.handleVote}
            />
          ))}
        </div>
      </div>
    );
  }
}
export default Jokelist;
