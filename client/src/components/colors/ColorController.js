import React from "react";
import { render } from "react-dom";
import io from "socket.io-client";
import _ from "lodash";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import { colorFields } from "./colorFields";
import { GET_COLOR, CHANGE_COLOR, UPDATE_COLOR } from "../../Events";
import Icon from "material-ui/Icon";
import grey from "material-ui/colors/grey";
import lightBlue from "material-ui/colors/lightBlue";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

const endPoint = process.env.NODE_ENV === "development" ? "http://192.168.1.97:5000" : "/";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  iconHover: {
    margin: theme.spacing.unit * 2,
    color: grey[300],
    "&:hover": {
      color: lightBlue[300]
    }
  }
});

class ColorController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: "white",
      socket: null,
      open: false
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
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  renderFields() {
    const { classes } = this.props;
    return _.map(colorFields, ({ color, shade }) => {
      return (
        <Button
          id={color}
          key={color}
          variant="raised"
          color={"primary"}
          className={classes.button}
          onClick={() => this.setColor(shade)}
          style={{ backgroundColor: shade }}
        />
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
          <Button
            variant="fab"
            color="primary"
            aria-label="add"
            className={classes.button}
            onClick={this.handleClickOpen}
          >
            <Icon>info_outline</Icon>
          </Button>
          <p
            style={{
              textAlign: "center",
              color: "#BDBDBD",
              fontFamily: "Roboto",
              marginTop: "10%"
            }}
          />
        </div>
        <Dialog
          open={this.state.open}
          transition={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title" style={{ textAlign: "center" }}>
            {"About this website"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" style={{ textAlign: "center" }}>
              This is a real time website that uses web sockets.<br />Try pulling up this website on
              another tab or on your phone and see what happens when you change the color.
              <br />
              <br />
              Made by Alec Chen
              <br />
              <br />
              <a href="https://github.com/KinkMustard/colorchanger" target="_blank">
                Github
              </a>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

ColorController.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ColorController);
