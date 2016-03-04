// scripts of dispatcher web site
function document_ready_event_handler() {
    $(".toggle").live("click", function() {
        var btn = $(this);
        if (btn.text().toString() == "▼")
            btn.text("▲");
        else
            btn.text("▼");
        btn.parent().parent().next().toggle("fast");
    });

    $(".data").live("mouseenter", function() {
        $(this).children().css("background-color", "#e1e1e1");
    });

    $(".data").live("mouseleave", function() {
        $(this).children().css("background-color", "#ffffff");
    });

    $(".data2").live("mouseenter", function ()
    {
        $(this).children().css("background-color", "#e1e1e1");
    });

    $(".data2").live("mouseleave", function ()
    {
        $(this).children().css("background-color", "#f1f1f1");
    });

    $(".canDisable").live("click", function () {
        var buttons = $(this).parent().children(".actionButton");
        buttons.attr("disabled", "disabled");
        buttons.css("color", "#a8a8a8");
    });

    $("#toggle_job_comments").live("click", function()
    {
        var link = $(this);
        if (link.text() == '▼')
        {
            link.text('▲');
        }
        else
        {
            link.text('▼');
        }
        $("#job_comments").toggle("normal");
    });
};

// overwrite the Date object's format method to output customized date time string.
Date.prototype.format = function (format)
{
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1,  //month
        "d+": this.getDate(),     //day
        "h+": this.getHours(),    //hour
        "m+": this.getMinutes(),  //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format))
    {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o)
    {
        if (new RegExp("(" + k + ")").test(format))
        {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

// this function can be used in any view to get the base url, support both path type: 
// 1. http://localhost:port
// 2. http://localhost/sitename
function GetBaseUrl()
{
    var l = window.location;
    var baseUrl = l.protocol + '//' + l.host;
    if (l.host.indexOf(':') == -1)
    {
        baseUrl += l.pathname.substring(0, l.pathname.indexOf('/', 2));
    }
    return baseUrl;
}

function GetProjectById(projectsList, id) {
    for (i = 0; i < projectsList.length; i++) {
        var p = projectsList[i];
        if (p.id() == id) {
            return p;
        }
    }

    return null;
};

function GetCaseById(casesList, id) {
    for (i = 0; i < casesList.length; i++) {
        var c = casesList[i];
        if (c.id() == id) {
            return c;
        }
    }

    return null;
};

function GetSuiteById(suitesList, id) {
    for (i = 0; i < suitesList.length; i++) {
        var s = suitesList[i];
        if (s.id() == id) {
            return s;
        }
    }

    return null;
};

function GetJobById(jobsList, id) {
    for (i = 0; i < jobsList.length; i++) {
        var j = jobsList[i];
        if (j.id() == id) {
            return j;
        }
    }

    return null;
};

function GetProgressById(progressesList, id) {
    for (i = 0; i < progressesList.length; i++) {
        var p = progressesList[i];
        if (p.id() == id) {
            return p;
        }
    }

    return null;
};


function FormatTime(timeStr)
{
    // for unknown reason, if the date object's millisecond value ends with zero, 
    // e.g. 870, after obtaining the date object by web service, the object will 
    // be counted as a string, and the zero at the end will be lost, this will 
    // cause the 'new Date(obj)' to throw an error of 'invalid date'. to walk 
    // around this issue, i add zero back to the date time string when necessary.
    while (timeStr.length < 23)
    {
        timeStr += "0";
    }
    var d = new Date(timeStr);

    // 8100 is the DateTime.MaxValue year in C#
    if (d.getYear() == 1 || d.getYear() == 8100 || isNaN(d.getYear()))
    {
        // the date is a min value or max value.
        return '';
    }
    else
    {
        //d.format('YYYY-MM-dd hh:mm:ss');
        return d.format('yyyy-MM-dd hh:mm:ss');
    }
}

function JobProgressViewModel(data) {
    var self = this;

    self.id = ko.observable(data.ID);
    self.startTime = ko.observable(FormatTime(data.StartTime));
    self.description = ko.observable(data.Description);
    self.runningTime = ko.observable(data.FormattedRunningTime);

    self.update = function (updateData) {
        self.id(updateData.ID);
        self.startTime(FormatTime(updateData.StartTime));
        self.description(updateData.Description);
        self.runningTime(updateData.FormattedRunningTime);
    };
};

function JobCommentViewModel(data)
{
    var self = this;

    self.id = ko.observable(data.CommentId);
    self.jobId = ko.observable(data.TestJobId);
    self.author = ko.observable(data.Author);

    // in order to correctly display whitespace (include line break) in the web page.
    self.handleWhiteSpace = function (content)
    {
        return content.replace(/  /g, ' &nbsp;').replace(/\\n/g, '<br/>');
    }
    self.content = ko.observable(self.handleWhiteSpace(data.Content));
    self.time = ko.observable(FormatTime(data.EditTime));

    self.update = function (updateData)
    {
        self.author(updateData.Author);
        self.content(self.handleWhiteSpace(data.Content));
        self.time(FormatTime(data.EditTime));
    }
}

function add_case_comment_query_handler()
{
    $(".tc_comment_amt").live("click", function ()
    {
        var caseRow = $(this).parent().parent();
        var commentRow = caseRow.next().next();

        if (commentRow.css("display") == "none")
        {
            var cmtArea = commentRow.children().first();
            cmtArea.empty();
            var caseId = caseRow.children().first().text();
            var apiPath = GetBaseUrl() + "/api/commentService/?testCaseId=" + caseId;
            $.getJSON(apiPath, function (commentsData)
            {
                cmtArea.append('<table id="t_comment"></table>');
                $.each(commentsData, function (index, commentData)
                {
                    var c = new JobCommentViewModel(commentData);
                    cmtArea.children().first().append(
                          '<tr>'
                        + '<td class="content">'
                        + '<div>' + c.content() + '</div>'
                        + '</td>'
                        + '<td class="info">'
                        + '<div class="name">Job ID</div><div class="value">' + c.jobId() + '</div>'
                        + '<div class="name">Author</div><div class="value">' + c.author() + '</div>'
                        + '<div class="name">Last Edit</div><div class="value">' + c.time() + '</div>'
                        + '</td>'
                        + '</tr>');
                });

            });

            commentRow.show("normal");
        }
        else
        {
            commentRow.hide("normal");
        }
    });
}

function JobViewModel(data) {
    var self = this;

    self.id = ko.observable(data.ID);
    self.linkId = ko.observable(data.LinkID);
    self.createTime = ko.observable(FormatTime(data.CreateTime));
    self.state = ko.observable(data.Status);
    self.machineIp = ko.observable(data.TestMachineIP);
    self.machineName = ko.observable(data.TestMachineName);
    self.startTime = ko.observable(FormatTime(data.StartTime));
    self.endTime = ko.observable(FormatTime(data.EndTime));
    self.runningTime = ko.observable(data.FormattedRunningTime);
    self.resultPath = ko.observable(data.ResultPackagePath);
    self.result = ko.observable(data.JobResult);
    self.action = ko.observable(data.JobAction);
    self.progresses = ko.observableArray();
    self.comments = ko.observableArray();
    self.isRunning = ko.observable(data.IsRunning);

    self.updateProgresses = function (progressesData)
    {
        $.each(progressesData, function (index, progressData)
        {
            var p = GetProgressById(self.progresses(), progressData.ID);
            if (p)
            {
                p.update(progressData);
            }
            else
            {
                self.progresses.push(new JobProgressViewModel(progressData));
            }
        });
    };

    self.getCommentById = function (commentId)
    {
        for (i = 0; i < self.comments().length; i++)
        {
            var e = self.comments()[i];
            if (e.id() == commentId)
            {
                return e;
            }
        }
        return null;
    }

    self.updateComments = function ()
    {
        var query = GetBaseUrl() + '/api/commentservice/?testjobid=' + self.id();
        $.getJSON(query, function (commentsData)
        {
            $.each(commentsData, function (index, commentData)
            {
                var c = self.getCommentById(commentData.CommentId);
                if (c)
                {
                    c.update(commentData);
                }
                else
                {
                    self.comments.push(new JobCommentViewModel(commentData));
                }
            });
        });
    }

    self.updateProgresses(data.StatusHistory);
    self.updateComments();

    self.update = function (data)
    {
        self.id(data.ID);
        self.linkId(data.LinkID);
        self.createTime(FormatTime(data.CreateTime));
        self.state(data.Status);
        self.machineIp(data.TestMachineIP);
        self.machineName(data.TestMachineName);
        self.startTime(FormatTime(data.StartTime));
        self.endTime(FormatTime(data.EndTime));
        self.runningTime(data.FormattedRunningTime);
        self.resultPath(data.ResultPackagePath);
        self.result(data.JobResult);
        self.action(data.JobAction);
        self.isRunning(data.IsRunning);

        self.updateProgresses(data.StatusHistory);
        self.updateComments();
    }
};

    function CaseViewModel(data) {
        var self = this;

        self.id = ko.observable(data.ID);
        self.linkId = ko.observable(data.LinkID);
        self.name = ko.observable(data.Name);
        self.description = ko.observable(data.Description);
        self.createTime = ko.observable(FormatTime(data.CreateTime));
        self.engineType = ko.observable(data.CaseEngineType);
        self.priority = ko.observable(data.Priority);
        self.critical = ko.observable(data.IsCritical);
        self.isRunning = ko.observable(data.IsRunning);
        self.environment = ko.observable(data.Environment);
        self.dependencies = ko.observable(data.Dependencies);
        self.tags = ko.observable(data.Tags);
        self.job = ko.observable();
        if (data.TestJob) {
            self.job(new JobViewModel(data.TestJob));
        }
        self.result = ko.computed(function ()
        {
            if (self.job())
            {
                return self.job().result();
            }
            else
            {
                return '';
            }
        });
        self.jobComment = ko.observable(data.AllTestJobCommentsCount);

        self.update = function(updateData) {
            self.id(updateData.ID);
            self.linkId(updateData.LinkID);
            self.name(updateData.Name);
            self.description(updateData.Description);
            self.createTime(FormatTime(updateData.CreateTime));
            self.engineType(updateData.CaseEngineType);
            self.priority(updateData.Priority);
            self.isRunning(updateData.IsRunning);
            self.critical(updateData.IsCritical);
            self.environment(updateData.Environment);
            self.dependencies(updateData.Dependencies);
            self.tags(updateData.Tags);
            if (updateData.TestJob) {
                if (self.job()) {
                    self.job().update(updateData.TestJob);
                }
                else {
                    self.job(new JobViewModel(updateData.TestJob));
                }
            }
            self.jobComment(updateData.AllTestJobCommentsCount);
        }
    };

    function SuiteViewModel(data) {
        var self = this;

        self.id = ko.observable(data.ID);
        self.name = ko.observable(data.Name);
        self.environment = ko.observable(data.TestEnvironment);
        self.dependencies = ko.observable(data.Dependencies);
        self.tags = ko.observable(data.Tags);
        self.priority = ko.observable(data.Priority);
        self.isRunning = ko.observable(data.IsRunning);
        self.caseExec = ko.observable(data.TestCaseExecution);
        self.cases = ko.observableArray();
        self.passedCases = ko.observable();
        self.failedCases = ko.observable();
        self.executedCases = ko.observable();

        self.updateCases = function (casesData)
        {
            var p = 0, f = 0;
            $.each(casesData, function(index, caseData) {
                var c = GetCaseById(self.cases(), caseData.ID);
                if (c) {
                    c.update(caseData);
                }
                else
                {
                    c = new CaseViewModel(caseData);
                    self.cases.push(c);
                }
                
                if (c.result() != null)
                {
                    if (c.result().indexOf("Pass") >= 0)
                    {
                        p++;
                    }
                    else if (c.result().indexOf("Fail") >= 0)
                    {
                        f++;
                    }
                }
            });
            self.passedCases(p);
            self.failedCases(f);
            self.executedCases(p + f);
        }

        self.updateCases(data.TestCases);

        self.update = function(updateData) {
            self.id(updateData.ID);
            self.name(updateData.Name);
            self.environment(updateData.TestEnvironment);
            self.dependencies(updateData.Dependencies);
            self.tags(updateData.Tags);
            self.priority(updateData.Priority);
            self.isRunning(updateData.IsRunning);
            self.caseExec(updateData.TestCaseExecution);
            self.updateCases(updateData.TestCases);
        };
    };

    function ProjectStatisticsViewModel(data) {
        var self = this;

        self.mustDo = ko.observable(data.MustDo);
        self.mustDoExecuted = ko.observable(data.MustDoExecuted);
        self.mustDoExecuteRate = ko.observable(data.MustDoExecuteRate);
        self.mustDoPassed = ko.observable(data.MustDoPassed);
        self.mustDoPassRate = ko.observable(data.MustDoPassRate);

        self.important = ko.observable(data.Important);
        self.importantExecuted = ko.observable(data.ImportantExecuted);
        self.importantExecuteRate = ko.observable(data.ImportantExecuteRate);
        self.importantPassed = ko.observable(data.ImportantPassed);
        self.importantPassRate = ko.observable(data.ImportantPassRate);

        self.niceToHave = ko.observable(data.NiceToHave);
        self.niceToHaveExecuted = ko.observable(data.NiceToHaveExecuted);
        self.niceToHaveExecuteRate = ko.observable(data.NiceToHaveExecuteRate);
        self.niceToHavePassed = ko.observable(data.NiceToHavePassed);
        self.niceToHavePassRate = ko.observable(data.NiceToHavePassRate);

        self.total = ko.observable(data.Total);
        self.totalExecuted = ko.observable(data.TotalExecuted);
        self.totalExecuteRate = ko.observable(data.TotalExecuteRate);
        self.totalPassed = ko.observable(data.TotalPassed);
        self.totalPassRate = ko.observable(data.TotalPassRate);

        self.update = function (data) {
            self.mustDo(data.MustDo);
            self.mustDoExecuted(data.MustDoExecuted);
            self.mustDoExecuteRate(data.MustDoExecuteRate);
            self.mustDoPassed(data.MustDoPassed);
            self.mustDoPassRate(data.MustDoPassRate);

            self.important(data.Important);
            self.importantExecuted(data.ImportantExecuted);
            self.importantExecuteRate(data.ImportantExecuteRate);
            self.importantPassed(data.ImportantPassed);
            self.importantPassRate(data.ImportantPassRate);

            self.niceToHave(data.NiceToHave);
            self.niceToHaveExecuted(data.NiceToHaveExecuted);
            self.niceToHaveExecuteRate(data.NiceToHaveExecuteRate);
            self.niceToHavePassed(data.NiceToHavePassed);
            self.niceToHavePassRate(data.NiceToHavePassRate);

            self.total(data.Total);
            self.totalExecuted(data.TotalExecuted);
            self.totalExecuteRate(data.TotalExecuteRate);
            self.totalPassed(data.TotalPassed);
            self.totalPassRate(data.TotalPassRate);
        };
    }

    function ProjectViewModel(data) {
        var self = this;

        self.id = ko.observable(data.ID);
        self.name = ko.observable(data.Name);
        self.description = ko.observable(data.Description);
        self.user = ko.observable(data.UserName);
        self.submitTime = ko.observable(FormatTime(data.CreateTime));
        self.state = ko.observable(data.State);
        self.emails = ko.observable(data.Emails);
        self.suites = ko.observableArray();
        self.statistics = ko.observable();
        if (data.Statistics) {
            self.statistics(new ProjectStatisticsViewModel(data.Statistics));
        }

        self.updateSuites = function(suitesData) {
            $.each(suitesData, function(index, suiteData) {
                var s = GetSuiteById(self.suites(), suiteData.ID);
                if (s) {
                    s.update(suiteData);
                }
                else {
                    self.suites.push(new SuiteViewModel(suiteData));
                }
            });
        };

        self.updateSuites(data.TestSuites);

        self.update = function(updateData) {
            self.id(updateData.ID);
            self.name(updateData.Name);
            self.description(updateData.Description);
            self.user(updateData.UserName);
            self.submitTime(FormatTime(updateData.CreateTime));
            self.state(updateData.State);
            self.emails(updateData.Emails);
            self.updateSuites(updateData.TestSuites);
            if (updateData.Statistics) {
                if (self.statistics()) {
                    self.statistics().update(updateData.Statistics);
                }
                else {
                    self.statistics(new ProjectStatisticsViewModel(updateData.Statistics));
                }
            }
        }
    };
