import React from "react";
import "./LoginScreen.css";
import axios from "../axios.js";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase.js";
import { useStateValue } from "../stateProvider.js";
import { actionTypes } from "../reducer";

function LoginScreen() {
  const [{}, dispatch] = useStateValue();

  const signIn = async () => {
    auth
      .signInWithPopup(provider)
      .then(async result => {
        console.log(result);
        console.log(result.additionalUserInfo.isNewUser);
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user
        });

        if (result.additionalUserInfo.isNewUser) {
          axios.post("/peoples/new", {
            name: result.user.displayName,
            userEmail: result.user.email,
            convo: []
          });
        }
      })
      .catch(error => {
        alert(error.message);
        return;
      });
  };

  return (
    <div class="login">
      <div class="login__box">
        <div class="login__text">
          <h1>LOGIN</h1>
        </div>

        <div class="login__button">
          <Button onClick={signIn}>Sign in</Button>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
