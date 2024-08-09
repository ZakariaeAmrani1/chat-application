document
  .querySelector(".chat-sidebar-profile-toggle")
  .addEventListener("click", function (e) {
    e.preventDefault();
    this.parentElement.classList.toggle("active");
  });

document.addEventListener("click", function (e) {
  if (!e.target.matches(".chat-sidebar-profile, .chat-sidebar-profile *")) {
    document.querySelector(".chat-sidebar-profile").classList.remove("active");
  }
});
const ws1 = new WebSocket("ws://127.0.0.1:8888/ws");
const ws3 = new WebSocket("ws://127.0.0.1:8888/friendremover");
const ws4 = new WebSocket("ws://127.0.0.1:8888/groupremover");
const ws5 = new WebSocket("ws://127.0.0.1:8888/addfriend");
const ws6 = new WebSocket("ws://127.0.0.1:8888/addgroup");
var userid;
var userprofileimage;
var friendid;
var friendidlist;
var groupid;
var groupidlist;
var inputlist;
var thisinput;
var textinputlist;
var textinput;
var chatlist;
var chat;
var statslist;
var stats;
var friendremoverlist;
var groupremoverlist;
var friendsaddlist;
var groupsaddlist;
var grouptextinputlist;
var friends;
var friendsli;
var groups;
var groupsli;
var userslist = [];
var groupslist = [];
var profileimageinput;
var profileimagelabel;
var groupimageinput;
var groupimagelabel;
var editgroupimageinput;
var editgroupimagelabel;
var addgroupmemberlist;
var addgroupmembers = [];
var addgroupmemberlisticons;
var editaddgroupmembers = [];
var editgroupmembers = [];
var editremovegroupmembers = [];
var friendsaddlistli = [];
var friendslist = [];
var groupslist = [];
var groupsaddlistli = [];
var chatmessagelist = [];
var chatmessagelistli = [];
var chatmessagelistdiv = [];
var groupchatmessagelist = [];
var groupchatmessagelistli = [];
var groupchatmessagelistdiv = [];
var friendmessagediv = [];
var deletemessagebutton = [];
var index = 0;
var index1;
var index2;
var index3;
var index4;
var messageid;
var groupmessageid;
var friendsearchbox;
var friendsitems;
var frienditem;
var friendnameitem;
var groupsearchbox;
var groupsitems;
var groupitem;
var groupnameitem;
var addfriendsearchbox;
var addfriendsitems;
var addfrienditem;
var addfriendnameitem;
var addgroupsearchbox;
var addgroupsitems;
var addgroupitem;
var addgroupnameitem;
var match;
var x = 0;
userid = Number(document.getElementById("userid").textContent);
userprofileimage = document.getElementById("userprofileimage").textContent;

function getfriend(clickedDiv) {
  friendidlist = document.querySelectorAll(".friendid");
  index = Array.from(friendidlist).indexOf(clickedDiv);
  friendid = friendidlist[index].value;
  textinput = textinputlist[index];
  chat = chatlist[index];
  stats = statslist[index];
}
function getgroup(clickedDiv) {
  groupidlist = document.querySelectorAll(".groupid");
  index = Array.from(groupidlist).indexOf(clickedDiv);
  groupid = groupidlist[index].value;
  grouptextinput = grouptextinputlist[index];
}
function getfriend1(clickedDiv) {
  friendidlist = document.querySelectorAll(".friend-remove-button");
  index = Array.from(friendidlist).indexOf(clickedDiv);
  friendid = friendidlist[index].value;
}
function getfriend2(clickedDiv) {
  friendidlist = document.querySelectorAll(".add-friend-button");
  index = Array.from(friendidlist).indexOf(clickedDiv);
  friendid = friendidlist[index].value;
}
function getfriend3(clickedDiv) {
  addgroupmemberlist = document.querySelectorAll(".add-friend-group-button");
  addgroupmemberlisticons = document.querySelectorAll(
    ".add-friend-group-button-i"
  );
  index = Array.from(addgroupmemberlist).indexOf(clickedDiv);
  friendid = addgroupmemberlist[index].value;
  if (addgroupmemberlist[index].classList.contains("friend-remove-button")) {
    index1 = addgroupmembers.indexOf(friendid);
    addgroupmembers.splice(index1, 1);
    document.getElementById("groupmembers").value = addgroupmembers;
    addgroupmemberlist[index].classList.remove("friend-remove-button");
    addgroupmemberlisticons[index].classList.add("ri-add-line");
    addgroupmemberlisticons[index].classList.remove("ri-delete-bin-line");
  } else {
    addgroupmembers.push(friendid);
    document.getElementById("groupmembers").value = addgroupmembers;
    addgroupmemberlist[index].classList.add("friend-remove-button");
    addgroupmemberlisticons[index].classList.remove("ri-add-line");
    addgroupmemberlisticons[index].classList.add("ri-delete-bin-line");
  }
}
function getfriend4(clickedDiv) {
  addgroupmemberlist = document.querySelectorAll(".edit-friend-group-button");
  addgroupmemberlisticons = document.querySelectorAll(
    ".edit-friend-group-button-i"
  );
  index = Array.from(addgroupmemberlist).indexOf(clickedDiv);
  friendid = addgroupmemberlist[index].value;
  if (
    addgroupmemberlist[index].classList.contains("group-remove-user-button")
  ) {
    for (let i = 0; i < editgroupmembers.length; i++) {
      if (editgroupmembers[i] === friendid) {
        editremovegroupmembers.push(friendid);
        x = 1;
        break;
      }
    }
    if (x == 0) {
      index1 = editaddgroupmembers.indexOf(friendid);
      editaddgroupmembers.splice(index1, 1);
    }
    document.querySelectorAll(".editaddgroupmembers")[index2].value =
      editaddgroupmembers;
    document.querySelectorAll(".editremovegroupmembers")[index2].value =
      editremovegroupmembers;
    addgroupmemberlist[index].classList.remove("group-remove-user-button");
    addgroupmemberlisticons[index].classList.add("ri-add-line");
    addgroupmemberlisticons[index].classList.remove("ri-delete-bin-line");
    x = 0;
  } else {
    for (let i = 0; i < editgroupmembers.length; i++) {
      if (editgroupmembers[i] === friendid) {
        index1 = editremovegroupmembers.indexOf(friendid);
        editremovegroupmembers.splice(index1, 1);
        x = 1;
        break;
      }
    }
    if (x == 0) {
      editaddgroupmembers.push(friendid);
    }
    document.querySelectorAll(".editaddgroupmembers")[index2].value =
      editaddgroupmembers;
    document.querySelectorAll(".editremovegroupmembers")[index2].value =
      editremovegroupmembers;
    addgroupmemberlist[index].classList.add("group-remove-user-button");
    addgroupmemberlisticons[index].classList.remove("ri-add-line");
    addgroupmemberlisticons[index].classList.add("ri-delete-bin-line");
    x = 0;
  }
}
function getgroup1(clickedDiv) {
  groupidlist = document.querySelectorAll(".group-remove-button");
  index = Array.from(groupidlist).indexOf(clickedDiv);
  groupid = groupidlist[index].value;
}
function getgroup2(clickedDiv) {
  groupidlist = document.querySelectorAll(".add-group-button");
  index = Array.from(groupidlist).indexOf(clickedDiv);
  groupid = groupidlist[index].value;
}
function getmessageid(clickedDiv) {
  chatmessagelist = document.querySelectorAll(".delete-message");
  chatmessagelistli = document.querySelectorAll(".delete-message-li");
  chatmessagelistdiv = document.querySelectorAll(".user-message");
  index3 = Array.from(chatmessagelist).indexOf(clickedDiv);
  messageid = chatmessagelistli[index3].value;
}
function getgroupmessageid(clickedDiv) {
  groupchatmessagelist = document.querySelectorAll(".group-delete-message");
  groupchatmessagelistli = document.querySelectorAll(
    ".group-delete-message-li"
  );
  index3 = Array.from(groupchatmessagelist).indexOf(clickedDiv);
  groupmessageid = groupchatmessagelistli[index3].value;
}
function showdelete(clickedDiv) {
  deletemessagebutton = document.querySelectorAll(".delete-button");
  index4 = Array.from(deletemessagebutton).indexOf(clickedDiv);
  document
    .querySelectorAll(".conversation-item-dropdown")
    [index4].classList.toggle("active");
}
function swipe1() {
  document.getElementById("chatbutton").classList.add("active");
  document.getElementById("groupsbutton").classList.remove("active");
  document.getElementById("contactsbutton").classList.remove("active");
  document.getElementById("chatsection").classList.remove("swipe");
  document.getElementById("groupssection").classList.add("swipe");
  document.getElementById("contactssection").classList.add("swipe");
}
function swipe2() {
  document.getElementById("chatbutton").classList.remove("active");
  document.getElementById("groupsbutton").classList.add("active");
  document.getElementById("contactsbutton").classList.remove("active");
  document.getElementById("chatsection").classList.add("swipe");
  document.getElementById("groupssection").classList.remove("swipe");
  document.getElementById("contactssection").classList.add("swipe");
}
function swipe3() {
  document.getElementById("chatbutton").classList.remove("active");
  document.getElementById("groupsbutton").classList.remove("active");
  document.getElementById("contactsbutton").classList.add("active");
  document.getElementById("chatsection").classList.add("swipe");
  document.getElementById("groupssection").classList.add("swipe");
  document.getElementById("contactssection").classList.remove("swipe");
}

inputlist = document.querySelectorAll(".sendButton");
groupinputlist = document.querySelectorAll(".groupsendButton");
textinputlist = document.querySelectorAll(".sendmessage");
grouptextinputlist = document.querySelectorAll(".groupsendmessage");
textinput = inputlist[index];
grouptextinput = grouptextinputlist[index];
chatlist = document.querySelectorAll(".chat");
chat = chatlist[index];
statslist = document.querySelectorAll(".conversation-user-status");
stats = statslist[index];
friendremoverlist = document.querySelectorAll(".friend-remove-button");
groupremoverlist = document.querySelectorAll(".group-remove-button");
friends = document.getElementById("userslist");
friendsli = friends.getElementsByTagName("li");
groups = document.getElementById("groupslist");
groupsli = groups.getElementsByTagName("li");
friendsaddlist = document.querySelectorAll(".add-friend-button");
friendsaddlistli = document.querySelectorAll(".add-friend-list");
groupsaddlist = document.querySelectorAll(".add-group-button");
groupsaddlistli = document.querySelectorAll(".add-group-list");
profileimageinput = document.getElementById("profileimage");
profileimagelabel = document.getElementById("profileimagelabel");
groupimageinput = document.getElementById("groupimage");
groupimagelabel = document.getElementById("groupimagelabel");
editgroupimagelabel = document.querySelectorAll(".groupimagelabel");
addgroupmemberlist = document.querySelectorAll(".add-friend-group-button");
friendslist = document.getElementById("add-friend-list-ul");
groupslist = document.getElementById("add-group-list-ul");
chatmessagelist = document.querySelectorAll(".delete-message");
chatmessagelistli = document.querySelectorAll(".delete-message-li");
chatmessagelistdiv = document.querySelectorAll(".user-message");
deletemessagebutton = document.querySelectorAll(".delete-button");
friendmessagediv = document.querySelectorAll(".friend-message");
groupchatmessagelist = document.querySelectorAll(".group-delete-message");
groupchatmessagelistli = document.querySelectorAll(".group-delete-message-li");
friendsearchbox = document
  .getElementById("friendsearchbox")
  .value.toUpperCase();
friendsitems = document.getElementById("friendsitems");
frienditem = document.querySelectorAll(".frienditem");
friendnameitem = friendsitems.getElementsByTagName("p");
groupsearchbox = document.getElementById("groupsearchbox").value.toUpperCase();
groupsitems = document.getElementById("groupsitems");
groupitem = document.querySelectorAll(".groupitem");
groupnameitem = groupsitems.getElementsByTagName("p");
addfriendsearchbox = document
  .getElementById("addfriendsearchbox")
  .value.toUpperCase();
addfriendsitems = document.getElementById("add-friend-list-ul");
addfrienditem = document.querySelectorAll(".addfrienditem");
addfriendnameitem = addfriendsitems.getElementsByTagName("p");
addgroupsearchbox = document
  .getElementById("addgroupsearchbox")
  .value.toUpperCase();
addgroupsitems = document.getElementById("add-group-list-ul");
addgroupitem = document.querySelectorAll(".addgroupitem");
addgroupnameitem = addgroupsitems.getElementsByTagName("p");

function friendsearchitem() {
  var i;
  friendsearchbox = document
    .getElementById("friendsearchbox")
    .value.toUpperCase();
  friendsitems = document.getElementById("friendsitems");
  frienditem = document.querySelectorAll(".frienditem");
  friendnameitem = friendsitems.getElementsByTagName("p");
  for (i = 0; i < friendnameitem.length; i++) {
    match = frienditem[i].getElementsByTagName("p")[0];
    if (match) {
      let searchvalue = match.textContent || match.innerHTML;
      if (searchvalue.toUpperCase().indexOf(friendsearchbox) > -1) {
        frienditem[i].style.display = "";
      } else {
        frienditem[i].style.display = "none";
      }
    }
  }
}

function groupsearchitem() {
  var i;
  groupsearchbox = document
    .getElementById("groupsearchbox")
    .value.toUpperCase();
  groupsitems = document.getElementById("groupsitems");
  groupitem = document.querySelectorAll(".groupitem");
  groupnameitem = groupsitems.getElementsByTagName("p");
  for (i = 0; i < groupnameitem.length; i++) {
    match = groupitem[i].getElementsByTagName("p")[0];
    if (match) {
      let searchvalue = match.textContent || match.innerHTML;
      if (searchvalue.toUpperCase().indexOf(groupsearchbox) > -1) {
        groupitem[i].style.display = "";
      } else {
        groupitem[i].style.display = "none";
      }
    }
  }
}

function friendsearchitem1() {
  var i;
  addfriendsearchbox = document
    .getElementById("addfriendsearchbox")
    .value.toUpperCase();
  addfriendsitems = document.getElementById("add-friend-list-ul");
  addfrienditem = document.querySelectorAll(".addfrienditem");
  addfriendnameitem = addfriendsitems.getElementsByTagName("p");
  for (i = 0; i < addfriendnameitem.length; i++) {
    match = addfrienditem[i].getElementsByTagName("p")[0];
    if (match) {
      let searchvalue = match.textContent || match.innerHTML;
      if (searchvalue.toUpperCase().indexOf(addfriendsearchbox) > -1) {
        addfrienditem[i].style.display = "";
      } else {
        addfrienditem[i].style.display = "none";
      }
    }
  }
}

function groupsearchitem1() {
  var i;
  addgroupsearchbox = document
    .getElementById("addgroupsearchbox")
    .value.toUpperCase();
  addgroupsitems = document.getElementById("add-group-list-ul");
  addgroupitem = document.querySelectorAll(".addgroupitem");
  addgroupnameitem = addgroupsitems.getElementsByTagName("p");
  for (i = 0; i < addgroupnameitem.length; i++) {
    match = addgroupitem[i].getElementsByTagName("p")[0];
    if (match) {
      let searchvalue = match.textContent || match.innerHTML;
      if (searchvalue.toUpperCase().indexOf(addgroupsearchbox) > -1) {
        addgroupitem[i].style.display = "";
      } else {
        addgroupitem[i].style.display = "none";
      }
    }
  }
}

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  loader.classList.add("loader--hidden");

  loader.addEventListener("transitionend", () => {
    document.body.removeChild(loader);
  });
});
profileimageinput.onchange = function () {
  profileimagelabel.src = URL.createObjectURL(profileimageinput.files[0]);
};

groupimageinput.onchange = function () {
  groupimagelabel.src = URL.createObjectURL(groupimageinput.files[0]);
};
document.addEventListener("click", function (e) {
  if (
    !e.target.matches(
      ".conversation-item-dropdown, .conversation-item-dropdown *"
    )
  ) {
    document
      .querySelectorAll(".conversation-item-dropdown")
      .forEach(function (i) {
        i.classList.remove("active");
      });
  }
});

document.querySelectorAll(".conversation-form-input").forEach(function (item) {
  item.addEventListener("input", function () {
    this.rows = this.value.split("\n").length;
  });
});

document.querySelectorAll("[data-conversation]").forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelectorAll(".conversation").forEach(function (i) {
      i.classList.remove("active");
    });
    document.querySelector(this.dataset.conversation).classList.add("active");
  });
});
document.querySelectorAll("[data-conversation]").forEach(function (item) {
  item.addEventListener("click", function () {
    document.querySelectorAll(".scrollableDiv").forEach(function (element) {
      element.scrollTop = element.scrollHeight;
    });
  });
});

document.querySelectorAll(".conversation-back").forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    this.closest(".conversation").classList.remove("active");
    document.querySelector(".conversation-default").classList.add("active");
  });
});

function profileaddshow() {
  document.querySelector(".editprofile").classList.add("show");
}
function profileremoveshow() {
  document.querySelector(".editprofile").classList.remove("show");
}
function friendaddshow() {
  document.querySelector(".add-friend-pannel").classList.add("show");
}
function friendremoveshow() {
  document.querySelector(".add-friend-pannel").classList.remove("show");
}
function groupaddshow() {
  document.querySelector(".add-group-pannel").classList.add("show");
}
function groupremoveshow() {
  document.querySelector(".add-group-pannel").classList.remove("show");
}
function groupcreateaddshow() {
  document.querySelector(".create-group-pannel").classList.add("show");
}
function groupcreateremoveshow() {
  document.querySelector(".create-group-pannel").classList.remove("show");
}
function groupeditaddshow(clickedDiv) {
  groupcreatelistbutton = document.querySelectorAll(
    ".edit-group-pannel-button"
  );
  groupcreatelist = document.querySelectorAll(".edit-group-pannel");
  index2 = Array.from(groupcreatelistbutton).indexOf(clickedDiv);
  groupcreatelist[index2].classList.toggle("show");
  editgroupmembers = document
    .querySelectorAll(".editgroupmembers")
    [index2].value.split(",");
  editgroupimageinput = document.getElementById("editgroupimage" + index2);
  console.log("editgroupimage" + index2);
  editgroupimageinput.onchange = function () {
    editgroupimagelabel[index2].src = URL.createObjectURL(
      editgroupimageinput.files[0]
    );
  };
}
function groupeditremoveshow() {
  groupcreatelist = document.querySelectorAll(".edit-group-pannel");
  groupcreatelist[index2].classList.remove("show");
}

function friendinfoaddshow(clickedDiv) {
  friendinfolistbutton = document.querySelectorAll(".friend-info-button");
  friendinfolist = document.querySelectorAll(".friend-info-card");
  index3 = Array.from(friendinfolistbutton).indexOf(clickedDiv);
  friendinfolist[index3].classList.toggle("show");
}
function friendinforemoveshow() {
  friendinfolist = document.querySelectorAll(".friend-info-card");
  friendinfolist[index3].classList.remove("show");
}

ws1.onmessage = function (event) {
  const messagerecive = event.data;
  var text = messagerecive.split(",");
  var id = text[0];
  var onoff = text[1];
  var stats = document.getElementById(id);
  id = Number(id);
  onoff = Number(onoff);
  if (onoff == 1) {
    stats.classList.add("online");
    stats.textContent = `online`;
  } else if (onoff == 0) {
    stats.classList.remove("online");
    stats.textContent = `offline`;
  }
};

for (var i = 0; i < friendremoverlist.length; i++) {
  friendremoverlist[i].addEventListener("click", sendMessage1);
}
function sendMessage1() {
  var result = confirm("Are you sure you want to remove this friend?");
  if (result) {
    const message = [];
    message.push(userid);
    message.push(friendid);
    ws3.send(message);
    friends = document.getElementById("userslist");
    friendsli = friends.getElementsByTagName("li");
    friends.removeChild(friendsli[index]);
    alert("Friend Removed");
    friends = document.getElementById("userslist");
    friendremoverlist = document.querySelectorAll(".friend-remove-button");
    for (var i = 0; i < friendremoverlist.length; i++) {
      friendremoverlist[i].addEventListener("click", sendMessage1);
    }
  } else {
    alert("Action canceled.");
  }
}
ws3.onmessage = function (event) {
  const messagerecive = event.data;
  const text = messagerecive.split(",");
  friendslist.innerHTML +=
    `<li class="user-list add-friend-list">
                <a href="#" id="user">
                    <img class="content-message-image" src="/` +
    text[3] +
    `" alt="">
                    <span class="content-message-info">
                        <span class="content-message-name">` +
    text[0] +
    `</span>
                        <span class="content-message-text">` +
    text[2] +
    `</span>
                    </span>
                    <span class="content-message-more">
                        <button value="` +
    text[1] +
    `" type="button" onclick="getfriend2(this)" class="conversation-form-button conversation-form-submit add-friend-button"><i class="ri-add-line"></i></button>
                    </span>
                </a>
            </li>`;
  friendsaddlistli = document.querySelectorAll(".add-friend-list");
  friendsaddlist = document.querySelectorAll(".add-friend-button");
  for (var i = 0; i < friendsaddlist.length; i++) {
    friendsaddlist[i].addEventListener("click", sendMessage3);
  }
};
for (var i = 0; i < groupremoverlist.length; i++) {
  groupremoverlist[i].addEventListener("click", sendMessage2);
}
function sendMessage2() {
  var result = confirm("Are you sure you want to leave this group?");
  if (result) {
    const message = [];
    message.push(userid);
    message.push(groupid);
    ws4.send(message);
    groupsli = groups.getElementsByTagName("li");
    groups.removeChild(groupsli[index]);
    alert("Group Removed");
    groups = document.getElementById("groupslist");
    groupremoverlist = document.querySelectorAll(".group-remove-button");
    for (var i = 0; i < groupremoverlist.length; i++) {
      groupremoverlist[i].addEventListener("click", sendMessage2);
    }
  } else {
    alert("Action canceled.");
  }
}
ws4.onmessage = function (event) {
  const messagerecive = event.data;
  const text = messagerecive.split(",");
  groupslist.innerHTML +=
    `<li class="group-list add-group-list">
    <a  href="#" id="user" data-conversation="{{index}}">
        <img class="content-message-image" src="/` +
    text[2] +
    `" alt="">
        <span class="content-message-info">
            <span class="content-message-name">` +
    text[1] +
    `</span>
            <span class="content-message-text">` +
    text[3] +
    `</span>
        </span>
        <span class="content-message-more">
            <button  value="` +
    text[0] +
    `" type="button" onclick="getgroup2(this)" class="conversation-form-button conversation-form-submit add-group-button"><i class="ri-add-line"></i></button>
            <span class="content-message-time"></span>
        </span>
    </a>
</li>`;
  groupsaddlistli = document.querySelectorAll(".add-group-list");
  groupsaddlist = document.querySelectorAll(".add-group-button");
  for (var i = 0; i < groupsaddlist.length; i++) {
    groupsaddlist[i].addEventListener("click", sendMessage4);
  }
};

for (var i = 0; i < friendsaddlist.length; i++) {
  friendsaddlist[i].addEventListener("click", sendMessage3);
}
function sendMessage3() {
  const message = [];
  message.push(userid);
  message.push(friendid);
  ws5.send(message);
  alert("Friend added");
}
ws5.onmessage = function (event) {
  const messagerecive = event.data;
  const text = messagerecive.split(",");
  document.getElementById("userslist").innerHTML +=
    `<li class="friend-list">
    <a href="#" id="user">
        <img class="content-message-image" src="/` +
    text[3] +
    `" alt="">
        <span class="content-message-info">
            <span class="content-message-name">` +
    text[0] +
    `</span>
            <span class="content-message-text">` +
    text[2] +
    `</span>
        </span>
        <span class="content-message-more">
            <button value="` +
    text[1] +
    `" type="button" onclick="getfriend1(this)" class="conversation-form-button conversation-form-submit friend-remove-button"><i class="ri-delete-bin-line"></i></button>    
        </span>
    </a>
</li>`;
  friendslist.removeChild(friendsaddlistli[index]);
  friendsaddlistli = document.querySelectorAll(".add-friend-list");
  friends = document.getElementById("userslist");
  friendslist = document.getElementById("add-friend-list-ul");
  friendremoverlist = document.querySelectorAll(".friend-remove-button");
  for (var i = 0; i < friendremoverlist.length; i++) {
    friendremoverlist[i].addEventListener("click", sendMessage1);
  }
};

for (var i = 0; i < groupsaddlist.length; i++) {
  groupsaddlist[i].addEventListener("click", sendMessage4);
}
function sendMessage4() {
  const message = [];
  message.push(userid);
  message.push(groupid);
  ws6.send(message);
  alert("You're joined new group");
}
ws6.onmessage = function (event) {
  const messagerecive = event.data;
  const text = messagerecive.split(",");
  document.getElementById("groupslist").innerHTML +=
    `<li class="group-list">
    <a  href="#" id="user">
        <img class="content-message-image" src="/` +
    text[2] +
    `" alt="">
        <span class="content-message-info">
            <span class="content-message-name">` +
    text[1] +
    `</span>
            <span class="content-message-text">` +
    text[3] +
    `</span>
        </span>
        <span class="content-message-more">
            <button  value="` +
    text[0] +
    `" type="button" onclick="getgroup1(this)" class="conversation-form-button conversation-form-submit group-remove-button"><i class="ri-logout-box-r-line"></i></button>
            <span class="content-message-time"></span>
        </span>
    </a>
</li>`;
  groupslist.removeChild(groupsaddlistli[index]);
  groupsaddlistli = document.querySelectorAll(".add-group-list");
  groupslist = document.getElementById("add-group-list-ul");
  groups = document.getElementById("groupslist");
  groupremoverlist = document.querySelectorAll(".group-remove-button");
  for (var i = 0; i < groupremoverlist.length; i++) {
    groupremoverlist[i].addEventListener("click", sendMessage2);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const ws = new WebSocket("ws://127.0.0.1:8888/chat");
  const ws2 = new WebSocket("ws://127.0.0.1:8888/groupchat");
  const ws7 = new WebSocket("ws://127.0.0.1:8888/deletemessage");
  const ws8 = new WebSocket("ws://127.0.0.1:8888/groupdeletemessage");

  ws.onmessage = function (event) {
    const messagerecive = event.data;
    const text = messagerecive.split(",");
    chat = document.getElementById("to" + text[2]);
    if (text[1] == userid) {
      chat = document.getElementById("to" + text[2]);
      chat1 = document.getElementById("fto" + text[2]);
      chat1.innerHTML +=
        `<li class="conversation-item me">
            <div class="conversation-item-side">
                <img class="conversation-item-image" src="` +
        userprofileimage +
        `" alt="">
            </div>
            <div class="conversation-item-content">
                <div class="conversation-item-wrapper">
                    <div class="conversation-item-box">
                        <div class="conversation-item-text">
                            <p class="user-message" id = "` +
        text[6] +
        `">` +
        text[0] +
        `</p>
                            <div class="conversation-item-time">` +
        text[3] +
        `</div>
                        </div>
                        <div class="conversation-item-dropdown">
                            <button type="button" class="conversation-item-dropdown-toggle delete-button" onclick="showdelete(this)"><i class="ri-more-2-line"></i></button>
                            <ul class="conversation-item-dropdown-list">
                                <li class="delete-message-li" value ="` +
        text[6] +
        `"><a href="#"  onclick="getmessageid(this)" class="delete-message"><i class="ri-delete-bin-line"></i> Delete</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </li>`;
    } else if (text[2] == userid) {
      chat = document.getElementById("to" + text[1]);
      chat1 = document.getElementById("fto" + text[1]);
      chat1.innerHTML +=
        `<li class="conversation-item">
            <div class="conversation-item-side">
                <img class="conversation-item-image" src="/` +
        text[4] +
        `" alt="">
            </div>
            <div class="conversation-item-content">
                <div class="conversation-item-wrapper">
                    <div class="conversation-item-box">
                        <div class="conversation-item-text">
                            <p id = "` +
        text[6] +
        `">` +
        text[0] +
        `</p>
                            <div class="conversation-item-time">` +
        text[3] +
        `</div>
                        </div>
                    </div>
                </div>
            </div>
        </li>`;
    }
    chatmessagelist = document.querySelectorAll(".delete-message");
    for (var i = 0; i < chatmessagelist.length; i++) {
      chatmessagelist[i].addEventListener("click", sendMessage7);
    }
    chat.scrollTop = chat.scrollHeight;
  };
  for (var i = 0; i < inputlist.length; i++) {
    inputlist[i].addEventListener("click", sendMessage);
  }
  for (var i = 0; i < groupinputlist.length; i++) {
    groupinputlist[i].addEventListener("click", sendMessage1);
  }
  function sendMessage() {
    const messagevalue = textinput.value;
    if (messagevalue != "") {
      const message = [];
      message.push(messagevalue);
      message.push(userid);
      message.push(friendid);
      ws.send(message);
      textinput.value = "";
    }
  }
  for (var i = 0; i < textinputlist.length; i++) {
    textinputlist[i].addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  }
  for (var i = 0; i < grouptextinputlist.length; i++) {
    grouptextinputlist[i].addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        sendMessage1();
      }
    });
  }

  ws2.onmessage = function (event) {
    const messagerecive = event.data;
    const text = messagerecive.split(",");
    chat = document.getElementById("too" + text[2]);
    chat1 = document.getElementById("gtoo" + text[2]);
    if (text[1] == userid) {
      chat1.innerHTML +=
        `<li class="conversation-item me">
            <div class="conversation-item-side">
                <img class="conversation-item-image" src="` +
        userprofileimage +
        `" alt="">
            </div>
            <div class="conversation-item-content">
                <div class="conversation-item-wrapper">
                    <div class="conversation-item-box">
                        <div class="conversation-item-text">
                            <p id="g` +
        text[5] +
        `">` +
        text[0] +
        `</p>
                            <div class="conversation-item-time">` +
        text[4] +
        `</div>
                        </div>
                        <div class="conversation-item-dropdown">
                            <button type="button" class="conversation-item-dropdown-toggle delete-button" onclick="showdelete(this)"><i class="ri-more-2-line"></i></button>
                            <ul class="conversation-item-dropdown-list">
                                <li class="group-delete-message-li" value ="` +
        text[5] +
        `"><a href="#" class="group-delete-message" onclick="getgroupmessageid(this)"><i class="ri-delete-bin-line"></i> Delete</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </li>`;
    } else if (text[1] != userid) {
      chat1.innerHTML +=
        `<li class="conversation-item">
            <div class="conversation-item-side">
                <img class="conversation-item-image" src="` +
        text[3] +
        `" alt="">
            </div>
            <div class="conversation-item-content">
                <div class="conversation-item-wrapper">
                    <div class="conversation-item-box">
                        <div class="conversation-item-text">
                            <p id="g` +
        text[5] +
        `" >` +
        text[0] +
        `</p>
                            <div class="conversation-item-time">` +
        text[4] +
        `</div>
                        </div>
                    </div>
                </div>
            </div>
        </li>`;
    }
    groupchatmessagelist = document.querySelectorAll(".group-delete-message");
    for (var i = 0; i < groupchatmessagelist.length; i++) {
      groupchatmessagelist[i].addEventListener("click", sendMessage8);
    }
    chat.scrollTop = chat.scrollHeight;
  };

  function sendMessage1() {
    const messagevalue = grouptextinput.value;
    if (messagevalue != "") {
      const message = [];
      message.push(messagevalue);
      message.push(userid);
      message.push(groupid);
      message.push(userprofileimage);
      ws2.send(message);
      grouptextinput.value = "";
    }
  }
  for (var i = 0; i < chatmessagelist.length; i++) {
    chatmessagelist[i].addEventListener("click", sendMessage7);
  }
  function sendMessage7() {
    var result = confirm("Are you sure you want to delete this message ?");
    if (result) {
      message = [];
      message.push(messageid);
      message.push(userid);
      ws7.send(message);
      alert("Message deleted !");
    } else {
      alert("Action canceled.");
    }
  }
  ws7.onmessage = function (event) {
    var message1 = event.data;
    message1 = message1.split(",");
    document.getElementById("" + message1[0] + "").textContent =
      "This message was deleted.";
  };
  for (var i = 0; i < groupchatmessagelist.length; i++) {
    groupchatmessagelist[i].addEventListener("click", sendMessage8);
  }
  function sendMessage8() {
    var result = confirm("Are you sure you want to delete this message ?");
    if (result) {
      message = [];
      message.push(groupmessageid);
      message.push(userid);
      ws8.send(message);
      alert("Message deleted !");
    } else {
      alert("Action canceled.");
    }
  }
  ws8.onmessage = function (event) {
    var message1 = event.data;
    message1 = message1.split(",");
    document.getElementById("g" + message1[0] + "").textContent =
      "This message was deleted.";
  };
});
