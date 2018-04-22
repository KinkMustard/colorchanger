import React from "react";
import { render } from "react-dom";
import io from "socket.io-client";
import _ from "lodash";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import colorFields from "./colorFields";
import { GET_COLOR, CHANGE_COLOR, UPDATE_COLOR } from "../../Events";

const endPoint = process.env.NODE_ENV === "development" ? "http://192.168.1.97:5000" : "/";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

class ColorController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: "white",
      socket: null
    };
  }
  componentWillMount() {
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(endPoint);
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on(GET_COLOR, color => {
      this.setState({ color });
      console.log("got color", color);
    });
    socket.on(UPDATE_COLOR, async color => {
      console.log(color);
      await this.setState({ color });
      console.log("updated color", color);
    });
    this.setState({ socket });
  };
  setColor = color => {
    const { socket } = this.state;
    socket.emit(CHANGE_COLOR, color);
    console.log("set color", color);
  };
  renderFields() {
    const { classes } = this.props;
    return _.map(colorFields, ({ color }) => {
      return (
        <Button
          id={color}
          key={color}
          variant="raised"
          color={"primary"}
          className={classes.button}
          onClick={() => this.setColor(color)}
          style={{ backgroundColor: color }}
        >
          {color}
        </Button>
      );
    });
  }
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div
          style={{
            backgroundColor: this.state.color,
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexFlow: "column"
          }}
        >
          {this.renderFields()}
          <p>{this.state.nice}</p>
        </div>
      </React.Fragment>
    );
  }
}

ColorController.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ColorController);
