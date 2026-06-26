```javascript
// =========================
// CalendarBee Pro
// script.js
// =========================

// ---------- STATE ----------

let currentDate = new Date();

const months = [
    "January","February","March","April",
    "May","June","July","August",
    "September","October","November","December"
];

// Demo event systemic 
let calendarEvents =
    JSON.parse(
        localStorage.getItem("calendarbee_events")
    ) || [];

// ---------- INIT ----------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initNavigation();

        initCalendar();

        initProfile();

        initFab();

        initSettings();

        loadProfile();

    }
);

// ---------- NAVIGATION ----------

function initNavigation(){

    const navItems =
        document.querySelectorAll(".nav-item");

    const screens =
        document.querySelectorAll(".screen");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            navItems.forEach(btn =>
                btn.classList.remove("active")
            );

            screens.forEach(screen =>
                screen.classList.remove("active")
            );

            item.classList.add("active");

            const screenId =
                item.dataset.screen;

            document
                .getElementById(screenId)
                .classList.add("active");

        });

    });

}

// ---------- CALENDAR ----------

function initCalendar(){

    buildCalendar();

    document
        .getElementById("prevMonth")
        .addEventListener(
            "click",
            previousMonth
        );

    document
        .getElementById("nextMonth")
        .addEventListener(
            "click",
            nextMonth
        );

}

function previousMonth(){

    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    buildCalendar();

}

function nextMonth(){

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    buildCalendar();

}

function buildCalendar(){

    const grid =
        document.getElementById(
            "calendarGrid"
        );

    const label =
        document.getElementById(
            "monthLabel"
        );

    grid.innerHTML = "";

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    label.textContent =
        months[month] + " " + year;

    let firstDay =
        new Date(
            year,
            month,
            1
        );

    let startingDay =
        (firstDay.getDay() + 6) % 7;

    let daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    for(
        let i = 0;
        i < startingDay;
        i++
    ){

        const empty =
            document.createElement("div");

        empty.className =
            "calendar-day";

        grid.appendChild(empty);

    }

    for(
        let day = 1;
        day <= daysInMonth;
        day++
    ){

        const cell =
            document.createElement("div");

        cell.className =
            "calendar-day";

        const today =
            new Date();

        if(
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ){
            cell.classList.add(
                "today"
            );
        }

        const number =
            document.createElement("div");

        number.className =
            "day-number";

        number.textContent = day;

        cell.appendChild(number);

        // Event indicators

        const indicators =
            document.createElement("div");

        indicators.className =
            "event-indicators";

        const dateString =
            `${year}-${month+1}-${day}`;

        const events =
            calendarEvents.filter(
                e =>
                e.date === dateString
            );

        events.forEach(event => {

            const dot =
                document.createElement("div");

            dot.classList.add(
                "indicator"
            );

            dot.classList.add(
                event.color
            );

            indicators.appendChild(dot);

        });

        cell.appendChild(indicators);

        cell.addEventListener(
            "click",
            () => {
                showDayEvents(
                    dateString
                );
            }
        );

        grid.appendChild(cell);

    }

}

// ---------- DAY EVENTS ----------

function showDayEvents(date){

    const container =
        document.getElementById(
            "selectedDayEvents"
        );

    const events =
        calendarEvents.filter(
            event =>
            event.date === date
        );

    if(events.length === 0){

        container.innerHTML =
            "No events.";

        return;

    }

    container.innerHTML = "";

    events.forEach(event => {

        const div =
            document.createElement("div");

        div.innerHTML =
            `<strong>${event.title}</strong><br>${event.type}`;

        container.appendChild(div);

    });

}

// ---------- PROFILE ----------

function initProfile(){

    const saveBtn =
        document.getElementById(
            "saveProfileBtn"
        );

    saveBtn.addEventListener(
        "click",
        saveProfile
    );

}

function saveProfile(){

    const name =
        document.getElementById(
            "nameInput"
        ).value.trim();

    localStorage.setItem(
        "calendarbee_name",
        name
    );

    loadProfile();

}

function loadProfile(){

    const name =
        localStorage.getItem(
            "calendarbee_name"
        ) || "CalendarBee User";

    document.getElementById(
        "profileName"
    ).textContent = name;

    document.getElementById(
        "welcomeName"
    ).textContent =
        "Welcome Back, " + name;

    document.getElementById(
        "nameInput"
    ).value = name;

    document.getElementById(
        "profileAvatar"
    ).textContent =
        name.charAt(0)
        .toUpperCase();

}

// ---------- FAB ----------

function initFab(){

    const fab =
        document.getElementById(
            "fab"
        );

    const menu =
        document.getElementById(
            "addMenu"
        );

    fab.addEventListener(
        "click",
        () => {
            menu.classList.remove(
                "hidden"
            );
        }
    );

    menu.addEventListener(
        "click",
        e => {

            if(
                e.target === menu
            ){
                menu.classList.add(
                    "hidden"
                );
            }

        }
    );

    document
        .querySelectorAll(
            ".create-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    createQuickEvent(
                        button.textContent
                    );

                    menu.classList.add(
                        "hidden"
                    );

                }
            );

        });

}

// ---------- QUICK EVENT ----------

function createQuickEvent(type){

    const title =
        prompt(
            "Title:"
        );

    if(!title) return;

    const date =
        prompt(
            "Date (YYYY-M-D):"
        );

    if(!date) return;

    let color = "blue";

    switch(type){

        case "Birthday":
            color = "pink";
            break;

        case "Reminder":
            color = "green";
            break;

        case "Task":
            color = "orange";
            break;

        case "Holiday":
            color = "purple";
            break;

    }

    calendarEvents.push({

        title,
        date,
        type,
        color

    });

    localStorage.setItem(
        "calendarbee_events",
        JSON.stringify(
            calendarEvents
        )
    );

    buildCalendar();

}

// ---------- SETTINGS ----------

function initSettings(){

    document
        .querySelectorAll(
            ".toggle"
        )
        .forEach(toggle => {

            toggle.addEventListener(
                "click",
                () => {

                    toggle.classList.toggle(
                        "active"
                    );

                }
            );

        });

}

// ---------- DASHBOARD ----------

function updateDashboard(){

    const eventPreview =
        document.getElementById(
            "taskPreview"
        );

    eventPreview.textContent =
        calendarEvents.length +
        " item(s) stored";

}

updateDashboard();
```
