const input = document.querySelector(".myInput");
const myBtn = document.querySelector(".myBtn");
const chatappend = document.querySelector(".chatappend");
const btncss = document.querySelector(".btncss");
const modal = document.querySelector(".modal");
const closebtn = document.querySelector(".closebtn");
const addbtn = document.querySelector(".addbtn");
const inputgroup = document.querySelector(".inputgr");
const sideBarlist = document.querySelector(".sideBarlist");
const heading = document.querySelector(".heading");
const member = document.querySelector(".member");
const closememb = document.querySelector(".closememb");
const inputmemb = document.querySelector(".inputmemb");
const addmemb = document.querySelector(".addmemb");

btncss.addEventListener("click", () => {
  member.style.display = "none";
  modal.style.display = "block";
});

closememb.addEventListener("click", () => {
  member.style.display = "none";
  modal.style.display = "none";
  chatappend.style.display = "block";
});

closebtn.addEventListener("click", () => {
  modal.style.display = "none";
  member.style.display = "none";
  chatappend.style.display = "block";
});

addmemb.addEventListener("click", async () => {
  const obj = {
    member: inputmemb.value,
    groupId: globalGroupNumber,
  };
  const token = localStorage.getItem("token");
  await axios.post("http://localhost:3000/add/groupmember", obj, {
    headers: { authorization: token },
  });
  inputmemb.value = "";
  member.style.display = "none";
  chatappend.style.display = "block";
});

var globalGroupNumber;

addbtn.addEventListener("click", async () => {
  if (inputgroup.value !== "") {
    const token = localStorage.getItem("token");
    const isGcreated = await axios.post(
      "http://localhost:3000/add/creategroup",
      { groupname: inputgroup.value },
      {
        headers: { authorization: token },
      }
    );

    if (isGcreated.data.msg === "group is created") {
      const btn = document.createElement("button");
      btn.className = "list-group-item";
      btn.style.color = "palevioletred";
      btn.style.fontWeight = "bold";
      btn.style.fontSize = "large";
      const text = document.createTextNode(`${inputgroup.value}`);
      const span = document.createElement("span");
      span.append(isGcreated.data.groupId);
      span.style.display = "none";
      btn.appendChild(text);
      btn.appendChild(span);

      inputgroup.value = "";

      btn.addEventListener("click", async () => {
        globalGroupNumber = btn.childNodes[1].childNodes[0].data;
        chatappend.innerHTML = "";
        const resObj = await axios.get(
          `http://localhost:3000/chat/message/${globalGroupNumber}`,
          {
            headers: { authorization: token },
          }
        );
        const { data } = resObj;
        if (data.length !== 0) {
          lastmsgId = data[0].id;
        } else {
          lastmsgId = null;
        }
        resObj.data.reverse().forEach((el) => {
          msgMaker(el.msg, el.time);
        });

        if (localStorage.getItem("messages") === null) {
          const token = localStorage.getItem("token");
          localStorage.setItem("messages", JSON.stringify(resObj.data));
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

        heading.innerHTML = "";
        const div1 = document.createElement("div");
        div1.className = "col-sm-8 col-xs-7 heading-name grname";
        const a = document.createElement("a");
        a.className = "heading-name-meta";
        const text1 = document.createTextNode(`${btn.childNodes[0].data}`);
        a.appendChild(text1);
        div1.appendChild(a);

        const div2 = document.createElement("div");
        div2.className = "col-sm-3 col-xs-1 heading-dot pull-right";
        const button = document.createElement("button");
        button.className = "btn btn-primary";
        const text2 = document.createTextNode(`Add members`);
        button.appendChild(text2);

        button.addEventListener("click", () => {
          chatappend.style.display = "none";
          member.style.display = "block";
        });

        div2.appendChild(button);
        heading.appendChild(div1);
        heading.appendChild(div2);
      });
      sideBarlist.insertAdjacentElement("beforeend", btn);

      modal.style.display = "none";
    }
  }
});

let lastmsgId;

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const allGroups = await axios.get("http://localhost:3000/add/getGroup", {
    headers: { authorization: token },
  });
  if (allGroups.data.msg === "groups fetched") {
    allGroups.data.groups.forEach((el) => {
      const btn = document.createElement("button");
      btn.className = "list-group-item";
      btn.style.color = "palevioletred";
      btn.style.fontWeight = "bold";
      btn.style.fontSize = "large";
      const text = document.createTextNode(`${el.name}`);
      const span = document.createElement("span");
      span.append(el.id);
      span.style.display = "none";
      btn.appendChild(text);
      btn.appendChild(span);

      inputgroup.value = "";

      btn.addEventListener("click", async () => {
        globalGroupNumber = btn.childNodes[1].childNodes[0].data;
        chatappend.innerHTML = "";
        const resObj = await axios.get(
          `http://localhost:3000/chat/message/${globalGroupNumber}`,
          {
            headers: { authorization: token },
          }
        );
        const { data } = resObj;
        if (data.length !== 0) {
          lastmsgId = data[0].id;
        } else {
          lastmsgId = null;
        }
        resObj.data.reverse().forEach((el) => {
          msgMaker(el.msg, el.time);
        });

        heading.innerHTML = "";
        const div1 = document.createElement("div");
        div1.className = "col-sm-8 col-xs-7 heading-name grname";
        const a = document.createElement("a");
        a.className = "heading-name-meta";
        const text1 = document.createTextNode(`${btn.childNodes[0].data}`);
        a.appendChild(text1);
        div1.appendChild(a);

        const div2 = document.createElement("div");
        div2.className = "col-sm-3 col-xs-1 heading-dot pull-right";
        const button = document.createElement("button");
        button.className = "btn btn-primary";
        const text2 = document.createTextNode(`Add members`);
        button.appendChild(text2);

        button.addEventListener("click", () => {
          chatappend.style.display = "none";
          member.style.display = "block";
        });

        div2.appendChild(button);
        heading.appendChild(div1);
        heading.appendChild(div2);
      });
      sideBarlist.insertAdjacentElement("beforeend", btn);
    });

    modal.style.display = "none";
  }
});

input.addEventListener("keypress", async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (input.value !== "") {
      await messageBuilder(input.value, globalGroupNumber);
    }
    input.value = "";
  }
});

myBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (input.value !== "") {
    await messageBuilder(input.value, globalGroupNumber);
  }
  input.value = "";
});

async function messageBuilder(msg, groupId) {
  try {
    const token = localStorage.getItem("token");
    const dateTime = await timeGenerator();
    const msgPost = { msg, time: dateTime, groupId };
    const res = await axios.post(
      "http://localhost:3000/chat/message",
      msgPost,
      {
        headers: { authorization: token },
      }
    );
    lastmsgId = res.data.id;
    if (chatappend.children.length > 10) {
      chatappend.firstElementChild.remove();
    }
    msgMaker(msg, dateTime);
  } catch (err) {
    console.log(err);
  }
}

async function msgMaker(msg, dateTime) {
  const msgLi = ` <div class="row message-body">
                    <div class="col-sm-12 message-main-receiver">
                      <div class="receiver">
                        <div class="message-text">${msg}</div>
                        <span class="message-time pull-right">${dateTime}</span>
                      </div>
                    </div>
                  </div>`;
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
    `http://localhost:3000/chat/fatchMessage?lastmsgId=${lastmsgId}&groupId=${globalGroupNumber}`,
    {
      headers: { authorization: token },
    }
  );
  if (resObj.data.res === "fetched succesfully") {
    const { data } = resObj;
    msgMaker(data.msg, data.time);
    lastmsgId++;
  }
}, 1000);
