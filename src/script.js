// const container = document.createElement("div");
// // containerId is passed in on script embed
// container.id = containerID;
// container.classList.add('bb-container');
// document.body.appendChild(container);

const teamList = [];

// sheetId and apiKey must be passed in as variables in <script></script> tag.

// helper function to build elements.
const elBuilder = (el, values, parent, id) => {
    const newEl = document.createElement(el);

    values.length > 0 ? 
        newEl.innerText = values : null;
    id !== "" ? 
        newEl.id = id : newEl.remove();

    typeof(parent) === "string" ? 
        document.getElementById(parent).appendChild(newEl)
        :
        parent.appendChild(newEl);
};

// retrieve team names from sheet.
async function getTeams(sheetId, apiKey) {
    const teamNames = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
    const response = await fetch(teamNames, {mode:`cors`});
    const sheetResp = await response.json();

    sheetResp.sheets.forEach(team => {
        teamList.push(team.properties.title);
    })

    teamList.forEach(team => {
        checkSheet(sheetId, team);
    })
}

// THIS IS WHERE THE SHEETID and apiKey IS PASSED IN.
getTeams(sheetId, apiKey);

async function checkSheet(sheetId, team) {

    const sheetData = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${team}?key=${apiKey}`;
    const resp = await fetch(sheetData, {mode:`cors`});
    const respJSON = await resp.json();
    const values = respJSON.values;

    // creates unique ids for teams based on container name passed in at embed stage.
    team = `${container.id}-${team}`;

    // el, values, parent, id
    const buildTable = (team) => {
        //builds table title and headings
        elBuilder("table", "", container, team);
        // creates thead
        elBuilder("thead", "", team, `${team}-tHead`);
        // creates first table row
        elBuilder("tr", "", `${team}-tHead`, `${team}-row1`);
        //creates th
        elBuilder("th", "",`${team}-row1`, "", "");
        // creates blank table heading
        elBuilder("th", values[0][2],`${team}-row1`, `${team}-heading`);

        // add order that sorts chronologically.
        const teamEl = document.getElementById(team);
        teamEl.style.order = team.slice(-1);

        // starts on row 2
        let i = 2;
        while (i <= values.length) {
            elBuilder("tr", "", `${team}-tHead`, `${team}-row${i}`);
            let j=0

            while (j < 2) { 
                let p = i - 1;
                elBuilder("td", values[p][j], `${team}-row${i}`,"");
                j++;
            };
            i++;
        };

        // add class to tds
        document.querySelectorAll('TR').forEach((tr) => {
            tr.children[0].classList.add("player-number");
            tr.children[1].classList.add("player-name");
        })
};

buildTable(team);

return team;

};
