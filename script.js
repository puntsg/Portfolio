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
            getStudies();
            getSkills();
            getJobExperience();
            getProjects("jobProjects", "JobProjects");
            getProjects("gameProjects", "GameProjects");
            getProjects("PersonalProjects", "personalProjects");
        })
        .catch(error => console.error('Error fetching XML:', error));
}

// Devuelve el texto de la primera etiqueta "tag" dentro de "node", o "" si no existe
function getText(node, tag) {
    var element = node.getElementsByTagName(tag)[0];
    return element ? element.textContent.trim() : "";
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
        studyElement.innerHTML = "<h3>" + title + "</h3><p>" + institution + "</p><p><strong>Dates:</strong> " + dates + "</p>";
        if (description) studyElement.innerHTML += "<p><strong>Description:</strong> " + description + "</p>";
        if (image) studyElement.innerHTML += "<img src='Assets/InstitutionsLogos/" + image + "' alt='" + institution + "'>";
        studiesList.appendChild(studyElement);
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
        if (level) skillElement.innerHTML += "<p><strong>Level:</strong> " + level + "</p>";
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
        jobElement.innerHTML = "<h3>" + title + "</h3><p>" + company + "</p><p><strong>Dates:</strong> " + dates + "</p>";
        if (description) jobElement.innerHTML += "<p><strong>Description:</strong> " + description + "</p>";
        if (image) jobElement.innerHTML += "<img src='Assets/CompaniesLogos/" + image + "' alt='" + company + "'>";
        jobsList.appendChild(jobElement);
    }
}

// Pinta los proyectos de la sección "xmlTag" del XML dentro del div "containerId" del HTML
function getProjects(xmlTag, containerId) {
    var section = xmlDoc.getElementsByTagName(xmlTag)[0];
    var projectsList = document.getElementById(containerId);
    if (!section || !projectsList) return;

    var projects = section.getElementsByTagName("Project");
    for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        var title = getText(project, "Title");
        var dates = getText(project, "Dates");
        var description = getText(project, "Description");
        var link = getText(project, "Link");
        var image = getText(project, "Image");
        var tasks = project.getElementsByTagName("Task");
        var mediaSource = project.getElementsByTagName("Source")[0];

        // Se monta todo el HTML en una variable y se asigna una sola vez,
        // si no el navegador cierra el <ul> antes de añadir los <li>
        var html = "<h3>" + title + "</h3>";
        if (dates) html += "<p><strong>Dates:</strong> " + dates + "</p>";
        if (description) html += "<p><strong>Description:</strong> " + description + "</p>";
        if (tasks.length > 0) {
            html += "<p><strong>Tasks:</strong></p><ul>";
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

getData();
