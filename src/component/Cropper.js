import React from "react";
import Rnd from "react-rnd";
import CancelIcon from "@material-ui/icons/Cancel";
import { PhotoCamera } from "@material-ui/icons";
import { Button, Tooltip } from "@material-ui/core";
const remote = window.require("electron").remote; // Renderer process modules
const { screen } = remote;
const screenSize = screen.getPrimaryDisplay().size;

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 2px #3a38d2",
  margin: "5px",
};

const btnStyle = {
  background: "grey",
  borderRadius: "30px",
  width: "50px",
};

class Cropper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: "500px",
      height: "500px",
      x: screenSize.width / 2 - 250,
      y: screenSize.height / 2 - 250,
    };
  }

  render() {
    return (
      <Rnd
        style={style}
        size={{ width: this.state.width, height: this.state.height }}
        position={{ x: this.state.x, y: this.state.y }}
        onDragStop={(e, d) => {
          this.setState({ x: d.x, y: d.y });
        }}
        onResize={(e, direction, ref, delta, position) => {
          this.setState({
            width: ref.style.width,
            height: ref.style.height,
            x: position.x,
            y: position.y,
          });
        }}
        bounds={"parent"}
      >
        <div className="rnd-controls">
          <Tooltip title="capture">
            <Button style={btnStyle} onClick={this.props.snip.bind(this, this.state)}>
              <PhotoCamera />
            </Button>
          </Tooltip>
          <Tooltip title="Cancel">
            <Button style={btnStyle} onClick={this.props.destroySnipView.bind(this)}>
              <CancelIcon fontSize="medium" />
            </Button>
          </Tooltip>
        </div>
      </Rnd>
    );
  }
}

export default Cropper;
