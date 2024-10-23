import React from "react";
import styled from "styled-components";

const ButtonAdd = () => {
  return (
    <StyledWrapper>
      <div className="wrapper">
        <input className="hidden-trigger" id="toogle" type="checkbox" />
        <label className="circle" htmlFor="toogle">
          <svg
            viewBox="0 0 32 32"
            version="1.1"
            space="preserve"
            height="32"
            width="32"
            xlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            className="svg"
          >
            <image
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAbElEQVR4Ae3XwQnFQAiE4eVVsGAP1mkPFjwvQvYSWCQYCYGZv4Dv5MGB5ghcIiDQI+kCftCzNsAR8y5gYu2rwCBAgMBTgEC3rek2yQEtAZoDjso8AyaKexmIDJUZD40AAQIE0gwx449GgMC9/t0b7GTsa7J+AAAAAElFTkSuQmCC"
              height="32"
              width="32"
            />
          </svg>
        </label>

        <div className="subs">
          <button className="sub-circle">
            <input
              className="hidden-sub-trigger"
              id="sub1"
              type="radio"
              name="sub-circle"
              value="1"
            />
            <label htmlFor="sub1" />
          </button>
          <button className="sub-circle">
            <input
              className="hidden-sub-trigger"
              id="sub2"
              type="radio"
              name="sub-circle"
              value="1"
            />
            <label htmlFor="sub2" />
          </button>
          <button className="sub-circle">
            <input
              className="hidden-sub-trigger"
              id="sub3"
              type="radio"
              name="sub-circle"
              value="1"
            />
            <label htmlFor="sub3" />
          </button>
          <button className="sub-circle">
            <input
              className="hidden-sub-trigger"
              id="sub4"
              type="radio"
              name="sub-circle"
              value="1"
            />
            <label htmlFor="sub4" />
          </button>
          <button className="sub-circle">
            <input
              className="hidden-sub-trigger"
              id="sub5"
              type="radio"
              name="sub-circle"
              value="1"
            />
            <label htmlFor="sub5" />
          </button>
          <button className="sub-circle">
            <input
              className="hidden-sub-trigger"
              id="sub6"
              type="radio"
              name="sub-circle"
              value="1"
            />
            <label htmlFor="sub6" />
          </button>
          <button className="sub-circle">
            <input
              className="hidden-sub-trigger"
              id="sub7"
              type="radio"
              name="sub-circle"
              value="1"
            />
            <label htmlFor="sub7" />
          </button>
          <button className="sub-circle">
            <input
              className="hidden-sub-trigger"
              id="sub8"
              type="radio"
              name="sub-circle"
              value="1"
            />
            <label htmlFor="sub8" />
          </button>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  footer .demo {
    position: absolute;
    bottom: 10px;
    margin: 0 auto;
  }

  footer .demo a {
    text-align: center;
    color: #000;
    text-decoration: none;
    font-weight: 100;
    border-bottom: 1px solid #000;
  }

  .wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
  }

  .circle {
    display: block;
    position: relative;
    padding: 0;
    z-index: 98;
    margin: 0 auto;
    -webkit-box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.3);
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    height: 46px;
    width: 46px;
    background-color: #3f51b5;
    transition: 0.2s;
    text-align: center;
  }

  .circle:active {
    transform: scale(0.9);
    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.3);
  }

  .circle:hover {
    cursor: pointer;
    background-color: #606fc7;
    transform: rotate(90deg);
    transition: 0.2s ease-in-out;
    box-shadow: 0 8px 15px 0 rgba(0, 0, 0, 0.3);
  }

  .circle .svg {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -15px;
    margin-top: -15px;
    width: 30px;
    height: 30px;
    transition: 0.5s;
    transform: rotate(180deg);
  }

  .sub-circle {
    z-index: 0;
    position: absolute;
    height: 40px;
    width: 40px;
    overflow: hidden;
    border-radius: 50%;
    transition: 0.3s;
    transform: scale(0.5);
    opacity: 0;
    padding: 0;
    margin: 0;
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.3);
    border: none;
  }

  .sub-circle label {
    background-color: #f50057;
    display: block;
    color: white;
    width: 100%;
    height: 100%;
    line-height: 40px;
    transition: 0.5s;
  }

  .sub-circle label:hover {
    cursor: pointer;
    background-color: #606fc7;
  }

  .subs {
    left: -20px;
    top: -50px;
    width: 40px;
    height: 40px;
    text-align: center;
    z-index: 0;
    margin: 0 auto;
    position: relative;
  }

  .hidden-sub-trigger {
    display: none;
  }

  .hidden-sub-trigger:checked ~ label {
    background-color: #606fc7;
  }

  .hidden-trigger {
    display: none;
  }

  .hidden-trigger:checked ~ .circle {
    transform: scale(0.9);
    cursor: pointer;
    background-color: #606fc7;
    box-shadow: 0 8px 15px 0 rgba(0, 0, 0, 0.1);
  }

  .hidden-trigger:checked ~ .circle .svg {
    transform: rotate(45deg);
  }

  .hidden-trigger:checked ~ .subs button:nth-of-type(1) {
    transform: translate(0px, -100px) scale(1);
    opacity: 1;
    transition: 0.1s;
  }

  .hidden-trigger:checked ~ .subs button:nth-of-type(2) {
    transform: translate(75px, -75px) scale(1);
    opacity: 1;
    transition: 0.2s;
  }

  .hidden-trigger:checked ~ .subs button:nth-of-type(3) {
    transform: translate(100px, 0px) scale(1);
    opacity: 1;
    transition: 0.3s;
  }

  .hidden-trigger:checked ~ .subs button:nth-of-type(4) {
    transform: translate(75px, 75px) scale(1);
    opacity: 1;
    transition: 0.4s;
  }

  .hidden-trigger:checked ~ .subs button:nth-of-type(5) {
    transform: translate(0px, 100px) scale(1);
    opacity: 1;
    transition: 0.5s;
  }

  .hidden-trigger:checked ~ .subs button:nth-of-type(6) {
    transform: translate(-75px, 75px) scale(1);
    opacity: 1;
    transition: 0.6s;
  }

  .hidden-trigger:checked ~ .subs button:nth-of-type(7) {
    transform: translate(-100px, 0px) scale(1);
    opacity: 1;
    transition: 0.7s;
  }

  .hidden-trigger:checked ~ .subs button:nth-of-type(8) {
    transform: translate(-75px, -75px) scale(1);
    opacity: 1;
    transition: 0.8s;
  }
`;

export default ButtonAdd;
