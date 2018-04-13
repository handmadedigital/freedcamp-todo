<script>
  import TasksService from '../services/tasks-service'

  export default {
    data () {
      return {
        tasks: [],
        users: [],
        activeTasks: [],
        employee: "",
        activeTab: "All"

      }
    },

    mounted () {

      let employee = "";

      if (this.$route.params.employee) {
        employee = this.$route.params.employee.replace(/-/g, ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})
        this.employee = employee
      } else {
        employee = "Carlos Guevara";
        this.employee = employee
      }


      TasksService.getUsers(this).then(resp => {
        console.log('users',resp)
        this.users = resp
      }, (err) => {
        console.log(err)
      });

    },

    methods: {
      activateTab (value) {
        console.log(value)
        this.activeTab = value

        if (value == "All") {
          this.activeTasks = this.tasks
          return
        }

        this.activeTasks = this.tasks.filter(task => task.status == value)
      }
    },

    watch: {
      users () {
        console.log('boom')
        this.users.map((user, i) => {
          TasksService.getUserTasks(this, user.user_id).then(resp => {
            console.log('taks user update', resp)
            this.users[i].tasks = resp
          }, (err) => {
            console.log(err)
          })
        })
      }
    }
  }
</script>

<template>
  <div>
    <div class="row">
      <div class="tasks-wrapper">

        <div class="tasks-title-wrapper">
          <h2 class="tasks-title">Top Three</h2>

          <!-- <ul class="tasks-tabs-wrapper">
            <li :class="{isActive: activeTab == 'All'}" v-on:click="activateTab('All')">All</li>
            <li :class="{isActive: activeTab == 'In Progress'}" v-on:click="activateTab('In Progress')">In Progress</li>
            <li :class="{isActive: activeTab == 'No Progress'}" v-on:click="activateTab('No Progress')">No Progress</li>
            <li :class="{isActive: activeTab == 'Completed'}" v-on:click="activateTab('Completed')">Completed</li>
          </ul> -->

        </div>

        <div v-for="user in users" class="task-item-wrapper">
          <div class="task-content">
            <div class="task-header">
              <h6 class="user-points" v-if="user.tasks"><span>Total Task Points:</span> {{user.tasks.totalTaskPoints}} </h6>
              <h5 class="task-name">{{user.full_name}}</h5>
            </div>
          </div>
          <!-- <div class="task-actions-wrapper">
            <div class="last-comment-wrapper" :class="{ hasComment: task.lastComment }">
              <i class="fa fa-comment-o" aria-hidden="true"></i>
              <div class="last-comment" v-html="$options.filters.anchorme(task.lastComment)">
              </div>
            </div>
          </div> -->
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="sass">
  /* Imports */
  @import "../stylesheets/variables.scss";

  .tasks-wrapper {
    width: 100%;
    padding-bottom: 40px;

    .tasks-title-wrapper {
      border-bottom: solid 1px $border-gray;
      margin-bottom: 20px;

      &:after {
        content: "";
        clear: both;
        display: table;
      }

      .tasks-title {
        padding: 40px 0 0;
        float: left;
      }

      .tasks-tabs-wrapper {
        list-style: none;
        margin: 0;
        float: right;
        padding-top: 60px;

        li {
          display: inline;
          margin-left: 30px;
          padding-bottom: 23px;
          cursor: pointer;

          &.isActive {
            border-bottom: 2px solid $blue;
          }
        }
      }
    }

    .task-item-wrapper {
      background-color: $white;
      box-shadow: $dp1-shadow;
      margin-bottom: 20px;

      .task-content {
        padding: 20px;

        .task-header {
          color: $black;
          display: block;
          position: relative;
          padding-left: 15px;

          &:before {
            content: "";
            position: absolute;
            background-color: $blue-gray;
            width: 4px;
            left: 0;
            top: 0;
            bottom: 0;
            border-radius: 8px;
          }

          &.status-completed {
            &:before {
              background-color: $green;
            }
          }

          &.status-in-progress {
            &:before {
              background-color: $blue;
            }
          }

          .task-project {
            color: $blue-gray;

            .task-due-date {
              float: right;
            }
          }

          .task-name {
            margin-bottom: 0;
            font-weight: 600;
          }
        }

        .task-desc {
          margin-bottom: 0;
          padding: 15px 15px 0;
          max-width: 900px;

          a {
            color: $blue;
          }
        }
      }

      .task-actions-wrapper {
        padding: 10px 20px;
        border-top: solid 1px $border-gray;
        position: relative;

         &:after {
          content: "";
          clear: both;
          display: table;
        }

        .last-comment-wrapper {
          float: right;


          &.hasComment {
            .fa {
              opacity: 1;
            }

            &:hover {
              .last-comment {
                opacity: 1;
                z-index: 999999;
              }
            }
          }

          .fa {
            color: $blue-gray;
            opacity: 0.3;
          }

          .last-comment {
            background: $white;
            box-shadow: $dp8-shadow;
            bottom: 45px;
            max-width: 400px;
            min-width: 240px;
            opacity: 0;
            position: absolute;
            padding: 10px;
            right: 10px;
            transition: all 300ms ease;
            width: 100%;
            word-wrap: break-word;
            z-index: -999;
          }
        }
      }
    }
  }


</style>
