import React from "react";

export default function ButtonAdd() {
  return (
    <div className="wrapperAddBtn">
      <input className="hidden-trigger-add-btn" id="toogle" type="checkbox" />
      <label className="circle-add-btn" htmlFor="toogle">
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

      <div className="subs-btn-add">
        <button className="sub-circle-add-btn">
          <input
            className="hidden-sub-trigger"
            id="sub1"
            type="radio"
            name="sub-circle-add-btn"
            value="1"
          />
          <label htmlFor="sub1" />
        </button>
        <button className="sub-circle-add-btn">
          <input
            className="hidden-sub-trigger"
            id="sub2"
            type="radio"
            name="sub-circle-add-btn"
            value="1"
          />
          <label htmlFor="sub2" />
        </button>
        <button className="sub-circle-add-btn">
          <input
            className="hidden-sub-trigger"
            id="sub3"
            type="radio"
            name="sub-circle-add-btn"
            value="1"
          />
          <label htmlFor="sub3" />
        </button>
        <button className="sub-circle-add-btn">
          <input
            className="hidden-sub-trigger"
            id="sub4"
            type="radio"
            name="sub-circle-add-btn"
            value="1"
          />
          <label htmlFor="sub4" />
        </button>
        <button className="sub-circle-add-btn">
          <input
            className="hidden-sub-trigger"
            id="sub5"
            type="radio"
            name="sub-circle-add-btn"
            value="1"
          />
          <label htmlFor="sub5" />
        </button>
        <button className="sub-circle-add-btn">
          <input
            className="hidden-sub-trigger"
            id="sub6"
            type="radio"
            name="sub-circle-add-btn"
            value="1"
          />
          <label htmlFor="sub6" />
        </button>
        <button className="sub-circle-add-btn">
          <input
            className="hidden-sub-trigger"
            id="sub7"
            type="radio"
            name="sub-circle-add-btn"
            value="1"
          />
          <label htmlFor="sub7" />
        </button>
        <button className="sub-circle-add-btn">
          <input
            className="hidden-sub-trigger"
            id="sub8"
            type="radio"
            name="sub-circle-add-btn"
            value="1"
          />
          <label htmlFor="sub8" />
        </button>
      </div>
    </div>
  );
};

