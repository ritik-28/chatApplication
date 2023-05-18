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
const removemember = document.querySelector(".removemember");
const inremovememb = document.querySelector(".inremovememb");
const thismemb = document.querySelector(".thismemb");
const closeremove = document.querySelector(".closeremove");
const adminmember = document.querySelector(".adminmember");
const inadminmemb = document.querySelector(".inadminmemb");
const thisadmin = document.querySelector(".thisadmin");
const closeadmin = document.querySelector(".closeadmin");

btncss.addEventListener("click", () => {
  member.style.display = "none";
  modal.style.display = "block";
});

closememb.addEventListener("click", () => {
  member.style.display = "none";
  modal.style.display = "none";
  adminmember.style.display = "none";
  chatappend.style.display = "block";
});

closeremove.addEventListener("click", () => {
  removemember.style.display = "none";
  modal.style.display = "none";
  adminmember.style.display = "none";
  chatappend.style.display = "block";
});

thismemb.addEventListener("click", async () => {
  const obj = {
    member: inremovememb.value,
    groupId: globalGroupNumber,
  };
  const token = localStorage.getItem("token");
  await axios.post("http://34.238.254.129:3000/add/removemember", obj, {
    headers: { authorization: token },
  });
  inremovememb.value = "";
  removemember.style.display = "none";
  chatappend.style.display = "block";
});

thisadmin.addEventListener("click", async () => {
  const obj = {
    member: inadminmemb.value,
    groupId: globalGroupNumber,
  };
  const token = localStorage.getItem("token");
  await axios.post("http://34.238.254.129:3000/add/makeadmin", obj, {
    headers: { authorization: token },
  });
  inadminmemb.value = "";
  adminmember.style.display = "none";
  chatappend.style.display = "block";
});

closeadmin.addEventListener("click", () => {
  adminmember.style.display = "none";
  modal.style.display = "none";
  member.style.display = "none";
  chatappend.style.display = "block";
});

closebtn.addEventListener("click", () => {
  adminmember.style.display = "none";
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
  await axios.post("http://34.238.254.129:3000/add/groupmember", obj, {
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
      "http://34.238.254.129:3000/add/creategroup",
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
          `http://34.238.254.129:3000/chat/message/${globalGroupNumber}`,
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
          msgMaker(el.msg, el.time, el.self, el.name);
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
        div2.className = "col-sm-1 col-xs-1 heading-dot pull-right";
        const button = document.createElement("button");
        button.className = "btn btn-primary";
        const text2 = document.createTextNode(`Add`);
        button.appendChild(text2);

        const div3 = document.createElement("div");
        div3.className = "col-sm-2 col-xs-1 heading-dot pull-right";
        const button2 = document.createElement("button");
        button2.className = "btn btn-primary";
        const text3 = document.createTextNode(`Remove`);
        button2.appendChild(text3);

        const del = document.createElement("a");
        del.className = "link-danger";
        del.style.fontSize = "17px";
        del.style.cursor = "pointer";
        const text5 = document.createTextNode(`Ⓧ`);
        del.appendChild(text5);
        del.addEventListener("click", async () => {
          if (confirm("Do you really want to delete this group?") === true) {
            await axios.get(
              `http://34.238.254.129:3000/add/deleteGroup/${globalGroupNumber}`,
              {
                headers: { authorization: token },
              }
            );
          }
        });

        const an = document.createElement("a");
        an.className = "link-danger";
        an.style.fontSize = "17px";
        an.style.cursor = "pointer";
        const text4 = document.createTextNode(`Ⓐ`);
        an.appendChild(text4);

        button.addEventListener("click", () => {
          member.style.display = "block";
        });

        button2.addEventListener("click", () => {
          removemember.style.display = "block";
        });

        an.addEventListener("click", () => {
          adminmember.style.display = "block";
        });

        div2.appendChild(button);
        div3.appendChild(button2);
        heading.appendChild(div1);
        heading.appendChild(div3);
        heading.appendChild(div2);
        heading.appendChild(an);
        heading.appendChild(del);

        isAdmin(heading);
      });
      sideBarlist.insertAdjacentElement("beforeend", btn);

      modal.style.display = "none";
    }
  }
});

let lastmsgId;

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const allGroups = await axios.get("http://34.238.254.129:3000/add/getGroup", {
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
          `http://34.238.254.129:3000/chat/message/${globalGroupNumber}`,
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
          msgMaker(el.msg, el.time, el.self, el.name);
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
        div2.className = "col-sm-1 col-xs-1 heading-dot pull-right";
        const button = document.createElement("button");
        button.className = "btn btn-primary";
        const text2 = document.createTextNode(`Add`);
        button.appendChild(text2);

        const div3 = document.createElement("div");
        div3.className = "col-sm-2 col-xs-1 heading-dot pull-right";
        const button2 = document.createElement("button");
        button2.className = "btn btn-primary";
        const text3 = document.createTextNode(`Remove`);
        button2.appendChild(text3);

        const del = document.createElement("a");
        del.className = "link-danger delbtn";
        del.style.fontSize = "17px";
        del.style.cursor = "pointer";
        const text5 = document.createTextNode(`Ⓧ`);
        del.appendChild(text5);
        del.addEventListener("click", async () => {
          if (confirm("Do you really want to delete this group?") === true) {
            await axios.get(
              `http://34.238.254.129:3000/add/deleteGroup/${globalGroupNumber}`,
              {
                headers: { authorization: token },
              }
            );
          }
        });

        const an = document.createElement("a");
        an.className = "link-danger";
        an.style.fontSize = "17px";
        an.style.cursor = "pointer";
        const text4 = document.createTextNode(`Ⓐ`);
        an.appendChild(text4);

        button.addEventListener("click", () => {
          member.style.display = "block";
        });

        button2.addEventListener("click", () => {
          removemember.style.display = "block";
        });

        an.addEventListener("click", () => {
          adminmember.style.display = "block";
        });

        div2.appendChild(button);
        div3.appendChild(button2);
        heading.appendChild(div1);
        heading.appendChild(div3);
        heading.appendChild(div2);
        heading.appendChild(an);
        heading.appendChild(del);

        isAdmin(heading);
      });
      sideBarlist.insertAdjacentElement("beforeend", btn);
    });

    modal.style.display = "none";
  }
});

async function isAdmin(heading) {
  const token = localStorage.getItem("token");
  const adminOrNot = await axios.get(
    `http://34.238.254.129:3000/add/admin/${globalGroupNumber}`,
    {
      headers: { authorization: token },
    }
  );

  if (adminOrNot.data.msg == "user is not admin") {
    heading.childNodes[1].style.display = "none";
    heading.childNodes[2].style.display = "none";
    heading.childNodes[3].style.display = "none";
    heading.childNodes[4].style.display = "none";
  } else {
    heading.childNodes[1].style.display = "block";
    heading.childNodes[2].style.display = "block";
    heading.childNodes[3].style.display = "block";
    heading.childNodes[4].style.display = "block";
  }
}

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
      "http://34.238.254.129:3000/chat/message",
      msgPost,
      {
        headers: { authorization: token },
      }
    );
    lastmsgId = res.data.id;
    if (chatappend.children.length > 10) {
      chatappend.firstElementChild.remove();
    }
    msgMaker(msg, dateTime, true, res.data.name);
  } catch (err) {
    console.log(err);
  }
}

async function msgMaker(msg, dateTime, self, name) {
  if (self) {
    const msgLi = `<div class="row message-body">
    <div class="col-sm-12 message-main-sender">
    <h5 style="margin-bottom:0px;color:magenta">~you</h5>
      <div class="sender">
        <div class="message-text" style="margin-top:0px">${msg}</div>
        <span class="message-time pull-right">${dateTime}</span>
      </div>
    </div>
  </div>`;
    chatappend.innerHTML += msgLi;
  } else {
    const msgLi = ` <div class="row message-body">
                    <div class="col-sm-12 message-main-receiver">
                    <h5 style="margin-bottom:0px;color:orangeRed">~${name}</h5>
                      <div class="receiver">
                        <div class="message-text" style="margin-top:0px">${msg}</div>
                        <span class="message-time pull-right">${dateTime}</span>
                      </div>
                    </div>
                  </div>`;
    chatappend.innerHTML += msgLi;
  }
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
    `http://34.238.254.129:3000/chat/fatchMessage?lastmsgId=${lastmsgId}&groupId=${globalGroupNumber}`,
    {
      headers: { authorization: token },
    }
  );

  if (resObj.data.res === "fetched succesfully") {
    const { data } = resObj;
    msgMaker(data.msg, data.time, false, data.name);
    lastmsgId++;
  }
}, 1000);
