import Papaparse from 'papaparse'
import CryptoJs from 'crypto-js'
export default {
  getTasks(ctx, employee) {
    var tasksCsv = ctx.$http.get('https://freedcamp.com/api/v1/csv/f2b5df0f66930859f9b150d1467ae6dd');

    return tasksCsv.then(resp => {
      const config = {
      	delimiter: "",	// auto-detect
      	newline: "",	// auto-detect
      	quoteChar: '"',
      	header: true,
      	dynamicTyping: false,
      	preview: 0,
      	encoding: "",
      	worker: false,
      	comments: false,
      	step: undefined,
      	complete: undefined,
      	error: undefined,
      	download: false,
      	skipEmptyLines: false,
      	chunk: undefined,
      	fastMode: undefined,
      	beforeFirstChunk: undefined,
      	withCredentials: undefined
      }

      const tasksJson = Papaparse.parse(resp.body,config);
      const myTasks = tasksJson.data.filter(task => task[ 'Assigned To' ] == employee);

      var cleanJson = [];

      myTasks.forEach(task => {

        var taskObject = {
          name: task.Name ? task.Name : "",
          priority: task.Priority ? task.Priority : "",
          description: task.Description ? task.Description  : "",
          project: task.Project ? task.Project  : "",
          status: task.Status ? task.Status : "",
          url: task.Url ? task.Url : "",
          dueDate: task[ 'Due Date' ] ? task[ 'Due Date' ] : "",
          createdBy: task[ 'Created By' ] ? task[ 'Created By' ] : "",
          lastComment: task[ 'Last Comment' ] ? task[ 'Last Comment' ] : "",
          lastCommentBy: task[ 'Last Comment By' ] ? task[ 'Last Comment By' ] : "",
          lastCommentDate: task[ 'Last Comment Date' ] ? task[ 'Last Comment Date' ] : ""
        }

        cleanJson.push(taskObject)

      });

      const completedTask = cleanJson.filter(task => task.status == "Completed");
      const inProgressTask = cleanJson.filter(task => task.status == "In Progress");
      const noProgressTask = cleanJson.filter(task => task.status == "No Progress");
      const statusSortedTasks = inProgressTask.concat(noProgressTask).concat(completedTask);

      return statusSortedTasks;

    }, (err) => {
      console.log(err)
    });
  },
  getUserTasks(ctx, userId) {
    var api_key = "5535613cbba09538d537860b6725ca943be10dc7"
    var api_secret = "c50a098c7180957085a75b099a46e1f5cdff609a"
    var seconds = new Date().getTime() / 1000;
    const encrypted = CryptoJs.HmacSHA1(api_key + seconds, api_secret)
    const hashString = CryptoJs.enc.Base64.stringify(encrypted)
    var tasksCsv = ctx.$http.get(`https://freedcamp.com/api/v1/tasks/?f_cf=1&assigned_to_id[]=${userId}&api_key=${api_key}&timestamp=${seconds}&hash=${encrypted}`);

    return tasksCsv.then(resp => {
      const tasks = resp.data.data.tasks
      console.log(resp.data)

      const topThreeTasks = tasks.filter(task => {
        if (task.custom_fields.length > 0) {
          const topThree = task.custom_fields.filter(field => field.cf_id == 1189)
          return topThree[0].value > 0 && task.status_title != 'Completed'
        }
      })

      const allTaskPoints = tasks.map(task => {
        if (task.custom_fields.length > 0 && task.status_title != 'Completed') {
          const taskPoints = task.custom_fields.filter(field => field.cf_id == 1218)
          return taskPoints[0].value
        }

        return 0
      })

      let totalPoints = 0;
      allTaskPoints.map(points => {
        totalPoints = totalPoints + parseInt(points)
      })

      console.log(totalPoints);

      return {
        totalTaskPoints: totalPoints,
        topThree: topThreeTasks,
        tasks: tasks
      }
    }, (err) => {
      console.log(err)
    })
  },
  getUsers(ctx) {
    var api_key = "5535613cbba09538d537860b6725ca943be10dc7"
    var api_secret = "c50a098c7180957085a75b099a46e1f5cdff609a"
    var seconds = new Date().getTime() / 1000;
    const encrypted = CryptoJs.HmacSHA1(api_key + seconds, api_secret)
    const hashString = CryptoJs.enc.Base64.stringify(encrypted)
    //?api_key=api_key&timestamp=current_ts&hash=your_hash

    var tasksCsv = ctx.$http.get(`https://freedcamp.com/api/v1/sessions/current/?api_key=${api_key}&timestamp=${seconds}&hash=${encrypted}`);
    console.log('crypto', hashString);

    return tasksCsv.then(resp => {
      return resp.data.data.users
    }, (err) => {
      console.log(err)
    })
  }
}
