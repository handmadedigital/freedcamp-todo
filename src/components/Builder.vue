<script>
  export default {
    data () {
      return {
        mouse: {
          isDragging: false,
          isMoving: false,
          down: false,
          up: true,
          x: "",
          y: "",
        },
        activeCharm: {
          id: "",
          onBracelet: false,
          x: "",
          y: "",
          xPrev: "",
          yPrev: ""
        },
        charmOptions: [
          {
            id:"1",
            name: "charm 1",
            img: "/media/charm-item-1.png",
            transform: "",
            isVisable: true
          },
          {
            id:"2",
            name: "charm 2",
            img: "/media/charm-item-2.png",
            transform: "",
            isVisable: true
          },
          {
            id:"3",
            name: "charm 3",
            img: "/media/charm-item-3.png",
            transform: "",
            isVisable: true
          },
          {
            id:"4",
            name: "charm 4",
            img: "/media/charm-item-4.png",
            transform: "",
            isVisable: true
          }
        ],
        selectedChamrs: [

        ]
      }
    },

    mounted () {
      var self = this;
      var element = this.$refs.draggableCharmArea;
      element.addEventListener("mousedown", function(){
          self.mouse.down = true;
          self.mouse.up = false;
      }, false);
      element.addEventListener("mousemove", function (event){
          var activeCharmItem = document.getElementById(self.activeCharm.id);

          self.mouse.x = ( (event.clientX - element.offsetLeft) - (activeCharmItem.offsetWidth/2) )/( element.offsetWidth/100 );
          self.mouse.y = ( (event.clientY - element.offsetTop) - (activeCharmItem.offsetHeight/4) )/( element.offsetHeight/100 );

          setTimeout( function() {
            self.mouse.xPrev = ( (event.clientX - element.offsetLeft) - (activeCharmItem.offsetWidth/2) )/( element.offsetWidth/100 );
            self.mouse.yPrev = ( (event.clientY - element.offsetTop) - (activeCharmItem.offsetHeight/4) )/(element.offsetHeight/100);
          },300);

          self.mouse.isMoving = true;
          if (self.mouse.down) {
            self.mouse.isDragging = true;
            console.log('dragging');
          } else {
            self.mouse.isDragging = false;
          }

          if ( !(self.mouse.x < 0) ) {




            if (self.mouse.y > 20 && self.mouse.y < 82 && self.mouse.x > 14 && self.mouse.x < 80 && self.mouse.isDragging) {
              console.log('id draggin inside on charm');
              self.activeCharm.onBracelet = true;
              activeCharmItem.classList.add("on-bracelet");

              if (self.mouse.y > self.mouse.yPrev && self.mouse.x < 50) {
                activeCharmItem.style.transform = "rotate("+ ( 122 - ( (self.mouse.y - 24)*2 ) ) +"deg)";
              }

              if (self.mouse.y < self.mouse.yPrev && self.mouse.x < 50) {
                activeCharmItem.style.transform = "rotate("+ ( 122 - ( (self.mouse.y - 24)*2 ) ) +"deg)";
              }

              if (self.mouse.y > self.mouse.yPrev && self.mouse.x > 50) {
                activeCharmItem.style.transform = "rotate("+ ( -122 + ((self.mouse.y - 24)*2) )  +"deg)";
              }

              if (self.mouse.y < self.mouse.yPrev && self.mouse.x > 50) {
                activeCharmItem.style.transform = "rotate("+ ( -122 + ((self.mouse.y - 24)*2) ) +"deg)";
              }


            } else {
              activeCharmItem.style.left = self.mouse.x+"%";
              activeCharmItem.style.top = self.mouse.y+"%";
              activeCharmItem.style.transformOrigin = "50% 20%";
              activeCharmItem.classList.remove("on-bracelet");
            }

          } else {
            // var activeId = activeCharmItem.id;
            // var lastChar = activeId.substr(activeId.length - 1);
            // console.log(self.selectedChamrs);
            // self.removeElement(lastChar);
            self.mouse.up = true;
            self.mouse.down = false;
            self.mouse.isDragging = false;
            self.activeCharm.id = "";
          }

          setTimeout(function() {
            self.mouse.isMoving = false;
          }, 100);

      }, false);
      element.addEventListener("mouseup", function(){
        self.mouse.up = true;
        self.mouse.down = false;
        self.mouse.isDragging = false;
        self.activeCharm.id = "";
      }, false);
    },
    methods: {
      addCharm: function(event) {
        console.log(event);
        var charmId = event.target.id;
        var lastChar = charmId.substr(charmId.length - 1);
        var self = this;
        var selectedLength = this.selectedChamrs.length;
        console.log(selectedLength);
        if (this.selectedChamrs.length > 0) {
          setTimeout( function() {
            var newCharm = document.getElementById('charmItem'+selectedLength);
            console.log(newCharm);
            newCharm.style.transform = "rotate("+ (122 - (22*selectedLength) ) +"deg)";
          }, 100);
        }

      },
      activateCharm: function(charm) {
        console.log(charm);

          this.activeCharm.id = charm.target.id;

      },
      computedId: function(item, idName) {
        return idName+item;
      },
      getRotateAngle: function(element) {
        var el = element;
        var st = window.getComputedStyle(el, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
                 st.getPropertyValue("-moz-transform") ||
                 st.getPropertyValue("-ms-transform") ||
                 st.getPropertyValue("-o-transform") ||
                 st.getPropertyValue("transform") ||
                 "FAIL";

          // With rotate(30deg)...
          // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
          // console.log('Matrix: ' + tr);

          // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

          var values = tr.split('(')[1].split(')')[0].split(',');
          var a = values[0];
          var b = values[1];
          var c = values[2];
          var d = values[3];

          var scale = Math.sqrt(a*a + b*b);

          // console.log('Scale: ' + scale);

          // arc sin, convert from radians to degrees, round
          var sin = b/scale;
          // next line works for 30deg but not 130deg (returns 50);
          // var angle = Math.round(Math.asin(sin) * (180/Math.PI));
          var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

          return angle;
      }
    }

  }
</script>

<template>
  <div class="charm-builder-wrapper">
    <div class="charm-builder">
      <div class="row">
        <div class="small-12 large-4 columns">
          <h5 class="title">Click on charm to add to builder.</h5>
          <span class="charm-options" v-for="(option, index) in charmOptions">
            <input  type="checkbox" :id="computedId(index, 'checkCharm')" v-model="selectedChamrs" :value="option" @click="addCharm($event)">
            <label :for="computedId(index, 'checkCharm')"><img :src="option.img" alt=""></label>
          </span>
        </div>
        <div class="small-12 large-8 columns">
          <div class="charm-drag-area-wrapper" id="charmBuilder" ref="draggableCharmArea">
            <img v-for="(item, index) in selectedChamrs"  class="charm-item on-bracelet" :id="computedId(index, 'charmItem')" :src="item.img" alt="" draggable="false"  @mousedown="activateCharm($event)">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
  @mixin aspect-ratio($width, $height) {
    position: relative;
    &:before {
      display: block;
      content: "";
      width: 100%;
      padding-top: ($height / $width) * 100%;
    }
    > .content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  .charm-builder-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #fff;

    .charm-builder {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 40px;
      box-shadow: 0px 0px 80px -4px rgba(0, 0, 0, 0.2);

      .title {
        color: #748c93;
      }
    }
  }

  .charm-options {

    label {
      @include aspect-ratio(1,1);
      position: relative;
      width: 85px;
      margin-right: 5px;
      margin-bottom: 10px;
      text-align: center;
      float: left;

      img {
        position: absolute;
        height: 100%;
        top: 0;
        left: 15px;
      }

    }

    input[type="checkbox"]{
        display: none;

        &:checked {
          & + label {
            opacity: 0.4;
          }
        }
    }
  }

  .charm-drag-area-wrapper {
    width: 100%;
    border: solid 2px #ececec;
    background: url("/media/builder-bracelet.jpg") no-repeat;
    background-position: center;
    background-size: 60%;
    position: relative;
    @include aspect-ratio(6,4);

    .charm-item {
      position: absolute;
      transform-origin: 50% 20% 0px;
      width: 10%;
      transition: all 100ms;
      opacity: 0.6;

      &.on-bracelet {
        transform-origin: 50% -120%  !important;
        transform: rotate(122deg);
        left: 45% !important;
        top: 78.9% !important;
        opacity: 1;
      }
    }
  }
</style>
