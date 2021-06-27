function getYoutube(){

  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange(2,1, sheet.getLastRow() - 1);
  var vids = range.getValues();
  //Logger.log(vids);

  var links = vids.map(function(res){ return res[0];}).join(",");
  //Logger.log(links);

  var stats_vids = YouTube.Videos.list("snippet, statistics",{id: links});
  //Logger.log(stats_vids.items);

  var details = stats_vids.items.map(function(s){return [s.snippet.title];});
  sheet.getRange(2,2, details.length,details[0].length).setValues(details);
  //Logger.log(details);

  Logger.log("Title has been added");

  var final_stats = stats_vids.items.map(function(res){ return [res.statistics.viewCount,res.statistics.likeCount,res.statistics.dislikeCount]});
  //Logger.log(final_stats);

  sheet.getRange(2,3, final_stats.length,final_stats[0].length).setValues(final_stats);
  Logger.log("Stats have been added");

}
