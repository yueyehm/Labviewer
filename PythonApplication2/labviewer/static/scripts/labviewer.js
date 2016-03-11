function getApiControlPath() {
    return "http://10.148.252.129/AutodeskAFWebApp/api/projectservice";
}

function getprojectURL() {
    return "http://localhost:8080/project/"
}

function deleteProject(projectid) {
    alert(projectid);
}

// scripts of dispatcher web site
function document_ready_event_handler() {
    $(".toggle").live("click", function () {
        var btn = $(this);
        if (btn.text().toString() == "▼")
            btn.text("▲");
        else
            btn.text("▼");
        btn.parent().parent().next().toggle("fast");
    });

    $(".data").live("mouseenter", function () {
        $(this).children().css("background-color", "#e1e1e1");
    });

    $(".data").live("mouseleave", function () {
        $(this).children().css("background-color", "#ffffff");
    });

    $(".data2").live("mouseenter", function () {
        $(this).children().css("background-color", "#e1e1e1");
    });

    $(".data2").live("mouseleave", function () {
        $(this).children().css("background-color", "#f1f1f1");
    });

    $(".canDisable").live("click", function () {
        var buttons = $(this).parent().children(".actionButton");
        buttons.attr("disabled", "disabled");
        buttons.css("color", "#a8a8a8");
    });

    $("#toggle_job_comments").live("click", function () {
        var link = $(this);
        if (link.text() == '▼') {
            link.text('▲');
        }
        else {
            link.text('▼');
        }
        $("#job_comments").toggle("normal");
    });
};

//Sort function
var by = function (name) {
    return function (o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        }
        else {
            throw ("error");
        }
    }
}

function formattime(timeStr) {
    // for unknown reason, if the date object's millisecond value ends with zero, 
    // e.g. 870, after obtaining the date object by web service, the object will 
    // be counted as a string, and the zero at the end will be lost, this will 
    // cause the 'new Date(obj)' to throw an error of 'invalid date'. to walk 
    // around this issue, i add zero back to the date time string when necessary.
    while (timeStr.length < 23) {
        timeStr += "0";
    }
    var d = new Date(timeStr);

    // 8100 is the DateTime.MaxValue year in C#
    if (d.getYear() == 1 || d.getYear() == 8100 || isNaN(d.getYear())) {
        // the date is a min value or max value.
        return '';
    }
    else {
        //d.format('YYYY-MM-dd hh:mm:ss');
        return d.format('yyyy-MM-dd hh:mm:ss');
    }
}