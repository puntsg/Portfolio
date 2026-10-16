var xmlDoc;

function getData() {
    fetch('data.xml')
        .then(response => response.text())
        .then(data => {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(data, "text/xml");
            if (xmlDoc.querySelector("parsererror")) {
                console.error(xmlDoc.querySelector("parsererror").textContent);
                return;
            }
            getAboutMe();
            getStudies();
            getSkills();
            getLanguages();
            getJobExperience();
            getProjects("jobProjects", "JobProjects");
            getProjects("gameProjects", "GameProjects");
            getProjects("PersonalProjects", "personalProjects");
        })
        .catch(error => console.error('Error fetching XML:', error));
}
function getAboutMe(){
    var aboutMe = xmlDoc.getElementsByTagName("About")[0];
    var aboutMeText = aboutMe ? aboutMe.textContent.trim() : "";
    var aboutMeContainer = document.getElementById("AboutMeText");
    if (aboutMeContainer) {
        aboutMeContainer.textContent = aboutMeText;
    }
}
function getText(node, tag) {
    var element = node.getElementsByTagName(tag)[0];
    return element ? element.textContent.trim() : "";
}

// Como getText, pero conserva etiquetas internas (p. ej. <a> en una descripción)
function getHTML(node, tag) {
    var element = node.getElementsByTagName(tag)[0];
    return element ? element.innerHTML.trim() : "";
}

function getStudies() {
    var studies = xmlDoc.getElementsByTagName("Study");
    var studiesList = document.getElementById("Studies");
    for (var i = 0; i < studies.length; i++) {
        var study = studies[i];
        var title = getText(study, "Title");
        var institution = getText(study, "institution");
        var dates = getText(study, "Dates");
        var description = getText(study, "Description");
        var image = getText(study, "Image");

        var studyElement = document.createElement("div");
        studyElement.innerHTML = "<h3>" + title + "</h3><p>" + institution + "</p><p><strong>Fechas:</strong> " + dates + "</p>";
        if (description) studyElement.innerHTML += "<p><strong>Descripción:</strong> " + description + "</p>";
        if (image) studyElement.innerHTML += "<img src='Assets/InstitutionsLogos/" + image + "' alt='" + institution + "'>";
        studiesList.appendChild(studyElement);
    }
}

function getLanguages() {
    var languages = xmlDoc.getElementsByTagName("Language");
    var languagesList = document.getElementById("Languages");
    if (!languagesList) return;
    for (var i = 0; i < languages.length; i++) {
        var language = languages[i];
        var name = getText(language, "Name");
        var level = getText(language, "Level");

        var languageElement = document.createElement("div");
        languageElement.innerHTML = "<h3>" + name + "</h3>";
        if (level) languageElement.innerHTML += "<p><strong>Nivel:</strong> " + level + "</p>";
        languagesList.appendChild(languageElement);
    }
}

function getSkills() {
    var skills = xmlDoc.getElementsByTagName("Skill");
    var skillsList = document.getElementById("Skills");
    for (var i = 0; i < skills.length; i++) {
        var skill = skills[i];
        var name = getText(skill, "Name");
        var level = getText(skill, "Level");

        var skillElement = document.createElement("div");
        skillElement.innerHTML = "<h3>" + name + "</h3>";
        if (level) skillElement.innerHTML += "<p><strong>Nivel:</strong> " + level + "</p>";
        skillsList.appendChild(skillElement);
    }
}

function getJobExperience() {
    var jobs = xmlDoc.getElementsByTagName("Job");
    var jobsList = document.getElementById("JobExperience");
    for (var i = 0; i < jobs.length; i++) {
        var job = jobs[i];
        var title = getText(job, "Title");
        var company = getText(job, "Company");
        var dates = getText(job, "Dates");
        var description = getText(job, "Description");
        var image = getText(job, "Image");

        var jobElement = document.createElement("div");
        jobElement.innerHTML = "<h3>" + title + "</h3><p>" + company + "</p><p><strong>Fechas:</strong> " + dates + "</p>";
        if (description) jobElement.innerHTML += "<p><strong>Descripción:</strong> " + description + "</p>";
        if (image) jobElement.innerHTML += "<img src='Assets/CompaniesLogos/" + image + "' alt='" + company + "'>";
        jobsList.appendChild(jobElement);
    }
}
function getProjects(xmlTag, containerId) {
    var section = xmlDoc.getElementsByTagName(xmlTag)[0];
    var projectsList = document.getElementById(containerId);
    if (!section || !projectsList) return;

    var projects = section.getElementsByTagName("Project");
    for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        var title = getText(project, "Title");
        var dates = getText(project, "Dates");
        var description = getHTML(project, "Description");
        var link = getText(project, "Link");
        var image = getText(project, "Image");
        var tasks = project.getElementsByTagName("Task");
        var mediaSource = project.getElementsByTagName("Source")[0];

        var html = "<h3>" + title + "</h3>";
        if (dates) html += "<p><strong>Fechas:</strong> " + dates + "</p>";
        if (description) html += "<p><strong>Descripción:</strong> " + description + "</p>";
        if (tasks.length > 0) {
            html += "<p><strong>Tareas:</strong></p><ul>";
            for (var j = 0; j < tasks.length; j++) {
                html += "<li>" + tasks[j].textContent.trim() + "</li>";
            }
            html += "</ul>";
        }
        if (link) html += "<a href=\"" + link + "\" target=\"_blank\" rel=\"noopener\">Ver en itch.io</a>";
        // Si hay <Source> (widget de itch.io) se usa eso; si no, la imagen
        if (mediaSource) html += "<div class=\"embed\">" + mediaSource.innerHTML + "</div>";
        else if (image) html += "<div><img src=\"Assets/Projects/" + image + "\" alt=\"" + title + "\"></div>";

        var projectElement = document.createElement("div");
        projectElement.innerHTML = html;
        projectsList.appendChild(projectElement);
    }
}

// Fondo de estrellas: genera n puntos aleatorios como box-shadow (equivale a la función de Sass)
function multipleBoxShadow(n) {
    var width = Math.max(window.innerWidth, 2000);
    var shadows = [];
    for (var i = 0; i < n; i++) {
        shadows.push(Math.floor(Math.random() * width) + "px " + Math.floor(Math.random() * 2000) + "px #FFF");
    }
    return shadows.join(", ");
}

function createStars() {
    var layers = { stars: 700, stars2: 200, stars3: 100 };
    for (var id in layers) {
        var element = document.getElementById(id);
        if (element) element.style.setProperty("--shadows", multipleBoxShadow(layers[id]));
    }
}

createStars();
getData();
