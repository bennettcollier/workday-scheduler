// Today
var today = moment()
var todayStr = today.format("dddd, MMMM Do, YYYY ");

// Add date to header
$("#currentDay").text(todayStr);

// Initialize task list
var tasks = JSON.parse(localStorage.getItem('WorkdaySchedulerTasks')) || [];

// Array of moment objects from 6 AM to 12 AM
var startTime = moment().hour(6).minute(0);
var endTime = moment().hour(22).minute(0);

var hrs = [];

while(startTime <= endTime){
    hrs.push(startTime);
    startTime = startTime.clone().add(1, 'hour');
}

// ------- Build the scedule ----------

function buildScheduleItem(index){
    
    // Rows
    var rowItem = $("<div>");
    rowItem.attr("class", "row no-padding");
    rowItem.attr("data-index", index);  
    
    // Time column
    var timeCol = $("<dir>");
    timeCol.attr("class", "col-1 hour no-padding");
    timeCol.text(hrs[index].format("h A"));
    $.data(timeCol,"timeStamp",hrs[index]);
    
    // Background
    var taskCol = $("<dir>");
    taskCol.attr("class","col no-padding text-bg");
    
    // Text area
    var textArea = $("<textarea>");
    textArea.attr("class", "textArea");
    taskCol.append(textArea);

    // Save button
    var actionCol = $("<dir>");
    actionCol.attr("class","col-1 saveBtn no-padding");
    
    var saveIcon = $("<i>");
    saveIcon.addClass("fas fa-save");
    actionCol.append(saveIcon);

    rowItem = rowItem.append(timeCol);
    rowItem = rowItem.append(taskCol);
    rowItem = rowItem.append(actionCol);

    return rowItem;
};


function buildSchedule(hrs){
    $("#schedule").empty();

    for(var i = 0; i < hrs.length; i++){
        
        row = buildScheduleItem(i);   
        $("#schedule").append(row);
    }
};
// ------- End Build the scedule ----------


// Add task text
var renderTasks = function(tasks){
    for(task of tasks){
        var timestamp = task.timestamp;
        var text = task.text;

        for(i = 0; i<hrs.length; i++){

            if(hrs[i].hours() === moment(timestamp).hours()){
                var rowEl = $(".row[data-index ='" + i +"']");
                rowEl.find("textarea").text(text);
            }
        }

        
    }
}

// Save tasks
var saveTasks = function(index){
    
    $("#schedule").children().each(function(){
        var ii = $(this).attr("data-index");
        
        
        if(ii === index){ 

            var text = $(this).find(".col .textArea").val(); 
        
            var taskObj = {
                "text": text,
                "timestamp": hrs[index]
            };
            
            existsflag = false;
            for(i = 0; i < tasks.length; i++){
                
                if(moment(tasks[i].timestamp).hours() === hrs[index].hours()){
                    tasks[i] = taskObj;
                    console.log("Task already exists!")
                    existsflag = true;
                }
            }

            if(!existsflag){
                tasks.push(taskObj);
                console.log("Task created!");
            }

            localStorage.setItem('WorkdaySchedulerTasks', JSON.stringify(tasks));
        };
   });
   
}

// Check time
function checkClock(){
    now = moment();
    
    $("#schedule").children().each(function(){
        var i = $(this).attr("data-index");
        timeItem = hrs[i];
        
        // Reset
        var textAreaBg = $(this).find(".text-bg");
        textAreaBg.removeClass("past present future");
        
        if(now.hour() === timeItem.hour()){
             textAreaBg.addClass("present");
        } else if(now > timeItem){
            textAreaBg.addClass("past");
        } else if(now < timeItem){
            textAreaBg.addClass("future");
        };         
    });
};


$(".container").on("click"," .saveBtn", function(event){
    rowItem = $(this).closest(".row").attr("data-index")
    saveTasks(rowItem);
});

buildSchedule(hrs);
renderTasks(tasks);

setInterval(checkClock(),60000)