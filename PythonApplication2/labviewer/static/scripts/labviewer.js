function getApiControlPath() {
    return "http://10.148.252.129/AutodeskAFWebApp/api/projectservice";
}

function deleteProject(projectid) {
    alert(projectid);
}

var projectvm = avalon.define({
    $id: "",
    name: "",
    description: "",
    user: "",
    submitTime: "",
    state: "",
    emails: "",
    suites: {},
    statistics: ""
})