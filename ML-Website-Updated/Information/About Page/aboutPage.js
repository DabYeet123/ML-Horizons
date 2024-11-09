const container = document.getElementById("container");

function displayInfo(){
    const p = document.createElement("p");
    p.innerHTML = userData["firstName"];
    container.append(p);
}

displayInfo();