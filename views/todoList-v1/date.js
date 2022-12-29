module.exports.getDate = getDate;

function getDate() {
var dateObj = new Date();

var options ={
 weekday: "long",
 day: "numeric",
 month: "long"
 // year: "long"
};

var date = dateObj.toLocaleDateString("en-US", options);

return date;
} 

module.exports.getDay = getDay;

function getDay() {
 var dateObj = new Date();

 var options = {
  weekday: "long"
 };

 var day = dateObj.toLocaleDateString("en-us", options);

 return day;
}
