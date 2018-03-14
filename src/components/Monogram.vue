<script>
  export default {
    data () {
      return {
        sandleOptions: {
          monogram: "",
          fontSize: "",
          monogram_1: "a",
          monogram_2: "s",
          monogram_3: "d",
          monogramColor: "#000",
          sandleColor: "/media/black-sandle.jpg"
        },
        test: ""
      }
    },

    mounted () {
      var self = this;
      console.log(this.$refs.productImage);

      if (window.innerWidth < 1000) {
        console.log('smaller');
        this.sandleOptions.fontSize = this.$refs.monogram.offsetWidth*1.15;
      } else {
        this.sandleOptions.fontSize = this.$refs.monogram.offsetWidth*2.1;
      }

      window.addEventListener("resize", function(){
        if (window.innerWidth < 1000) {
          console.log('smaller');
          self.sandleOptions.fontSize = self.$refs.monogram.offsetWidth*1.15;
        } else {
          console.log(self.$refs.monogram.offsetWidth*2.1);

          self.sandleOptions.fontSize = self.$refs.monogram.offsetWidth*1.23;
        }

      });

      if (this.getCookie("sandleOptions")) {
        this.sandleOptions = JSON.parse(this.getCookie("sandleOptions"));
      }

    },
    watch: {
      sandleOptions: {
         handler(val){
           document.cookie = "sandleOptions=" + JSON.stringify(this.sandleOptions);
         },
         deep: true
      }
    },
    methods: {
      getCookie: function(name){
        console.log('boom');
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        }
        else
        {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
            end = dc.length;
            }
        }
        // because unescape has been deprecated, replaced with decodeURI
        //return unescape(dc.substring(begin + prefix.length, end));
        return decodeURI(dc.substring(begin + prefix.length, end));
      }
    }

  }
</script>

<template>
<div class="main-wrapper">
  <div class="product-wrapper">
    <div class="row">
      <div class="medium-7 columns">
        <div id="productImage" class="product-image" ref="productImage">
          <div class="monogram-text-overlay" ref="monogram">
            <div class="monogram-letter" :style="{fontSize: sandleOptions.fontSize + 'px' }" ><span>{{sandleOptions.monogram_1}}</span></div>
            <div class="monogram-letter" :style="{fontSize: sandleOptions.fontSize + 'px' }"><span>{{sandleOptions.monogram_3}}</span></div>
            <div class="monogram-letter" :style="{fontSize: sandleOptions.fontSize + 'px' }"><span>{{sandleOptions.monogram_2}}</span></div>
          </div>
          <div class="monogram-text" ref="monogram">
            <div class="monogram-letter" :style="{ color: sandleOptions.monogramColor, fontSize: sandleOptions.fontSize + 'px' }" ><span>{{sandleOptions.monogram_1}}</span></div>
            <div class="monogram-letter" :style="{ color: sandleOptions.monogramColor, fontSize: sandleOptions.fontSize + 'px' }"><span>{{sandleOptions.monogram_3}}</span></div>
            <div class="monogram-letter" :style="{ color: sandleOptions.monogramColor, fontSize: sandleOptions.fontSize + 'px' }"><span>{{sandleOptions.monogram_2}}</span></div>
          </div>
          <img :src="sandleOptions.sandleColor" alt="" />
        </div>
      </div>
      <div class="medium-5 columns">
        <div class="product-title">
          <h2>
            Woman's Sandles Black
          </h2>
        </div>
        <div class="product-price">

        </div>
        <div class="product-options">

          <h5 class="opt-title">
            Sandles Color:
          </h5>
          <div class="sandle-color-wrapper">

            <label class="sandle-color-option" for="blackSandle" ><span class="black"></span></label>
            <input type="radio" id="blackSandle" v-model="sandleOptions.sandleColor" value="/media/black-sandle.jpg">

            <label class="sandle-color-option" for="creamSandle" ><span class="cream"></span></label>
            <input type="radio" id="creamSandle" v-model="sandleOptions.sandleColor" value="/media/cream-sandle.jpg">

            <label class="sandle-color-option" for="roseSandle" ><span class="rose"></span></label>
            <input type="radio" id="roseSandle" v-model="sandleOptions.sandleColor" value="/media/rose-sandle.jpg">

          </div>

          <h5 class="opt-title">
            Embroider Color:
          </h5>
          <div class="monogram-color-wrapper">
            <!-- <select class="monogram-color" name="" v-model="sandleOptions.monogram_color">
              <option value="#000" selected>Black</option>
              <option value="#fff">White</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="#e8ddbf">Cream</option>
              <option value="#ebbeba">Rose</option>
            </select> -->

            <label class="monogram-color-option" for="blackMonogram" ><span class="black"></span></label>
            <input type="radio" id="blackMonogram" v-model="sandleOptions.monogramColor" value="#000">

            <label class="monogram-color-option" for="whiteMonogram" ><span class="white"></span></label>
            <input type="radio" id="whiteMonogram" v-model="sandleOptions.monogramColor" value="#fff">

            <label class="monogram-color-option" for="creamMonogram" ><span class="cream"></span></label>
            <input type="radio" id="creamMonogram" v-model="sandleOptions.monogramColor" value="#e8ddbf">

            <label class="monogram-color-option" for="roseMonogram" ><span class="rose"></span></label>
            <input type="radio" id="roseMonogram" v-model="sandleOptions.monogramColor" value="#ebbeba">
          </div>

          <h5 class="opt-title">
            Monogram Initials:
          </h5>
          <div class="monogram-input">
            <input type="text" name="" v-model="sandleOptions.monogram_1" maxlength="1">
            <input type="text" name="" v-model="sandleOptions.monogram_2" maxlength="1">
            <input type="text" name="" v-model="sandleOptions.monogram_3" maxlength="1">
          </div>
        </div>
      </div>
      <div class="medium-12 columns">
        <div class="product-details">

        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="sass" >
.main-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.product-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  box-shadow: 0px 0px 107px -4px rgba(0, 0, 0, 0.2);
  background: #fff;

  .product-image {
    position: relative;

    img {
      width: 100%;
    }

    .monogram-text-overlay {

      z-index: 999999;

      .monogram-letter {
        opacity: 0.6;

        span {
          opacity: 1 !important;
          background: url("/media/stich-pattern.jpg") no-repeat;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
           background-blend-mode: multiply;
           background-size: 340%;
           text-shadow: 0 0 0 rgba(150, 150, 150, 0) !important;
        }
      }
    }

    .monogram-text, .monogram-text-overlay {
      font-family: 'monogram', sans-serif;
      width: 16%;
      position: absolute;
      line-height: 1;
      left: 44%;
      top: 10%;

      .monogram-letter {
        display: inline-block;
        margin: 0;
        padding: 0;
        width: 29%;
        overflow: hidden;
        font-size: 2em;
        color: #fff;
        text-transform: lowercase;

        &:nth-child(1) {
          span {

          }
        }

        &:nth-child(2) {
          span {
            margin-left: -108%;
          }
        }

        &:nth-child(3) {
          span {
            margin-left: -214%;
          }
        }

        span {
              text-shadow: -1px 1px 2px rgba(0,0,0,0.6);
              opacity: 0.6;
        }
      }
    }
  }

  .product-options {
    .opt-title {
      margin-top: 15px;
    }

    .sandle-color-wrapper, .monogram-color-wrapper {
      width: 100%;
      margin-bottom: 30px;

      &:after {
        content:"";
        display: table;
        clear: both;
      }

      .sandle-color-option, .monogram-color-option {
        width: 30px;
        height: 30px;
        border: solid 1px #d8d8d8;
        overflow: hidden;
        float: left;
        margin-right: 10px;

        span {
          display: block;
          width: 0;
          height: 0;
          border-right: 30px solid transparent;

          &.black {
            border-top: 30px solid #000;
          }

          &.cream {
            border-top: 30px solid #e8ddbf;
          }

          &.rose {
            border-top: 30px solid #ebbeba;
          }

          &.white {
            border-top: 30px solid #fff;
          }
        }
      }

      input[type="radio"]{
          display: none;
      }
    }

    .monogram-input {
      margin: 0 -10px;

      input {
        width: calc(33.33% - 20px);
        margin: 0 10px;
        float: left;
        text-transform: lowercase;
      }
    }
  }
}
</style>
