const input = document.getElementById("myInput");
const myBtn = document.getElementById("myBtn");
const chatappend = document.querySelector(".chatappend");

input.addEventListener("keypress", async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (input.value !== "") {
      await messageBuilder(input.value);
    }
  }
});

myBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (input.value !== "") {
    await messageBuilder(input.value);
  }
});

async function messageBuilder(msg) {
  try {
    const token = localStorage.getItem("token");
    const dateTime = await timeGenerator();
    const msgPost = { msg, time: dateTime };
    await axios.post("http://localhost:3000/chat/message", msgPost, {
      headers: { authorization: token },
    });
    msgMaker(msg, dateTime);
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
