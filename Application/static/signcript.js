
profileimageinput = document.getElementById("profileImage");
profileimagelabel = document.getElementById("profileImagelabel");

profileimageinput.onchange = function(){
    profileimagelabel.src = URL.createObjectURL(profileimageinput.files[0]);
}