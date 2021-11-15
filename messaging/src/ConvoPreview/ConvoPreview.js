import React from "react";
import { Link } from "react-router-dom";
import "./ConvoPreview.css";
import { Avatar } from "@material-ui/core";

function ConvoPreview({ name, id }) {
  return (
    <Link to={`/convos/${id}`}>
      <div className="convos">
        <Avatar />
        <div className="convos__info">
          <h2>{name}</h2>
          <p>last message</p>
        </div>
      </div>
    </Link>
  );
}

export default ConvoPreview;
