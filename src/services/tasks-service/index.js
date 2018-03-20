import Papaparse from 'papaparse'

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

  }
}
