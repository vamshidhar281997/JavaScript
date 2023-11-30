"use strict";

const searchForm = document.querySelector("#search-form");
const source = document.querySelector("#source");
const textInput = document.querySelector("#text-field");
const limitInput = document.querySelector("#limit-field");
const result = document.querySelector(".result");
const loading = document.querySelector(".loading");

const RP_SEARCH_URL =
  "https://rp-search.onrender.com/api/v1/rose_petals_search/";
const RP_API_KEY = "DEFAULT_API_KEY";

let fetchedData = {};

const expandMessages = function (event) {
  event.preventDefault();
  const parent = event.target.closest(".output");
  const childMessageEl = parent.querySelector(".messages");

  childMessageEl.classList.toggle("hidden");
  console.log(this);
  this.classList.toggle("icon-rot-90");
};

const fetchRPData = async function (searchString, limit) {
  try {
    loading.classList.remove("hidden");
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const response = await fetch(
      `${RP_SEARCH_URL}?q=${searchString}&top_n=${limit}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": `${RP_API_KEY}`,
        },
      }
    );
    fetchedData = await response.json();
    console.log(fetchedData);

    displayData();
    loading.classList.add("hidden");
  } catch (error) {
    console.log(error);
  }
};

const displayData = function () {
  for (const key in fetchedData) {
    if (fetchedData.hasOwnProperty(key)) {
      let messageDiv = "";
      for (const message of fetchedData[key]["contexts"]) {
        messageDiv += `
        <div class="message">
          ${message}
        </div>
        `;
      }
      const parentDiv = `
        <div class="output" id="output">
          <div class="parent">
            <div class="source" id="source">
              ${key}
            </div>
            <div class="parent-center">
              <span>
                English Link:
                <a href="${fetchedData[key]["sources"]["english_link"]}" class="english-link" id="english-link" target="_blank">
                  ${fetchedData[key]["sources"]["english_link"]}
                </a>
              </span>
              <span>
                Telugu Link:
                <a href="${fetchedData[key]["sources"]["telugu_link"]}" class="telugu-link" id="telugu-link" target="_blank">
                ${fetchedData[key]["sources"]["telugu_link"]}
                </a>
              </span>
            </div>
            <i class="icon fa-regular fa-circle-xmark"></i>
          </div>
          <div class="messages hidden" id="messages">
            ${messageDiv}
          </div>
        </div>
      `;
      result.insertAdjacentHTML("afterbegin", parentDiv);

      const btnExpand = document.querySelectorAll(".icon");
      btnExpand.forEach((btn) => {
        btn.addEventListener("click", expandMessages);
      });
    }
  }
};

const submitForm = function (event) {
  event.preventDefault();

  if (textInput.value) {
    fetchRPData(textInput.value, limitInput.value);
  }
};

searchForm.addEventListener("submit", submitForm);