const input = document.getElementById("myInput");
const myBtn = document.getElementById("myBtn");
const chatappend = document.querySelector(".chatappend");
const chatList = document.querySelector(".chat-list");

let lastmsgId;

window.addEventListener("DOMContentLoaded", async () => {
  if (localStorage.getItem("messages") === null) {
    const token = localStorage.getItem("token");
    const resObj = await axios.get("http://localhost:3000/chat/message", {
      headers: { authorization: token },
    });
    localStorage.setItem("messages", JSON.stringify(resObj.data));
    lastmsgId = resObj.data[0].id;
    const { data } = resObj;
    data.reverse().forEach((el) => {
      msgMaker(el.msg, el.time);
    });
  } else {
    let messages = localStorage.getItem("messages");
    messages = JSON.parse(messages);
    lastmsgId = messages[0].id;
    messages.reverse().forEach((el) => {
      msgMaker(el.msg, el.time);
    });
  }
});

input.addEventListener("keypress", async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (input.value !== "") {
      await messageBuilder(input.value);
    }
    input.value = "";
  }
});

myBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (input.value !== "") {
    await messageBuilder(input.value);
  }
  input.value = "";
});

async function messageBuilder(msg) {
  try {
    const token = localStorage.getItem("token");
    const dateTime = await timeGenerator();
    const msgPost = { msg, time: dateTime };
    const res = await axios.post(
      "http://localhost:3000/chat/message",
      msgPost,
      {
        headers: { authorization: token },
      }
    );
    msgMaker(msg, dateTime);
    let messages = localStorage.getItem("messages");
    let msgParse = JSON.parse(messages);
    msgParse.unshift({ id: res.data.id, msg: msg, time: dateTime });
    msgParse.length = 10;
    localStorage.setItem("messages", JSON.stringify(msgParse));
    lastmsgId = res.data.id;
  } catch (err) {
    console.log(err);
  }
}

async function msgMaker(msg, dateTime) {
  const msgLi = ` <li class="clearfix">
                      <div class="message-data">
                        <span class="message-data-time">${dateTime}</span>
                      </div>
                      <div class="message my-message">
                        ${msg}
                      </div>
                    </li>`;
  chatappend.innerHTML += msgLi;
}

async function timeGenerator() {
  let current = new Date();
  let msgDate = `${current.getFullYear()}/${
    current.getMonth() + 1
  }/${current.getDate()}`;
  let msgTime = `${current.getHours()}:${current.getMinutes()}`;
  let dateTime = msgDate + " " + msgTime;
  return dateTime;
}

setInterval(async () => {
  const token = localStorage.getItem("token");
  const resObj = await axios.get(
    `http://localhost:3000/chat/fatchMessage/${lastmsgId}`,
    {
      headers: { authorization: token },
    }
  );
  if (resObj.data.res === "fetched succesfully") {
    let messages = localStorage.getItem("messages");
    let msgParse = JSON.parse(messages);
    msgParse.unshift({
      id: resObj.data.id,
      msg: resObj.data.msg,
      time: resObj.data.time,
    });
    msgParse.length = 10;
    localStorage.setItem("messages", JSON.stringify(msgParse));

    const { data } = resObj;
    msgMaker(data.msg, data.time);
    lastmsgId++;
  }
}, 1000);
