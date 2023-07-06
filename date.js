
module.exports.tod = function(){

var today = new Date();

var options = {
  weekday: "long",
  day: "numeric",
  month: "long",
  // hour: "numeric",
  // minute: "numeric",
  // second: "numeric"
};

var time = today.toLocaleDateString("en-US", options);

return (time);
};



// function(err){
//   if(err){
//     console.log(err);
//   } else{
//     console.log("Succesfully running");
//   }
// })
