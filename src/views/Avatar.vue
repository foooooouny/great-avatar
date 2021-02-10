<template>
  <div class="avatar-box">
    <div class="avatar-content">
      <h3 class="generate-title">“乐视”的新衣</h3>
      <label for="avatar-input">
        <div class="avatar-pic">
          <svg class="user-svg-icon">
            <use xlink:href="#icon-user"/>
          </svg>
          <canvas id="pic-canvas" class="pic-canvas" width="400" height="400"/>
        </div>
        <input id="avatar-input" class="avatar-input" type="file" accept="jpeg,png,jpg" @change="chooseImage"/>
      </label>
      <ul class="theme-box" :style="`--var-cloumns: ${Object.keys(subStyleOptions).length};`">
        <li
          v-for="(key, index) of Object.keys(subStyleOptions)"
          :key="index"
          class="theme-item"
          :style="themeStyle(key)"
          @click.stop="chooseTheme(key)">
        </li>
      </ul>
      <p class="thin-line"></p>
      <ul class="font-type-box" :style="`--font-type-sizes: ${subFontTypes.length};`">
        <li
          v-for="(item, index) of subFontTypes"
          :key="index"
          class="font-type-item"
          :class="item"
          :style="fontTypeStyle"
          @click.stop="chooseSubFontType(item)">
          <div class="left">Style</div>
          <div class="right">small</div>
          <div class="sub">S</div>
        </li>
      </ul>
      <div class="input-box">
        <input v-if="curSubFontType === 'sub' || curSubFontType === 'circle'" v-model="inputs.single" class="input-cnt" placeholder="Style" maxlength="1" @blur="inputBlur"/>
        <label v-else>
          <input v-model="inputs.left" class="input-cnt" placeholder="Style" @blur="inputBlur"/>
          <label v-show="curSubFontType === 'multiple'">
            - 
            <input v-model="inputs.right" class="input-cnt" placeholder="small" @blur="inputBlur"/>
          </label>
        </label>
      </div>
    </div>
    <div class="finish-img">
      <img :src="imgBase64"/>
      <p class="save-tip">长按图片保存</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, computed, onMounted } from 'vue'
import Mask from '../components/prototypes/Mark'
import Font from '../components/prototypes/Font'

interface SubStyleOption {
  fontColor: string;
  fontSize?: number;
  smallFont?: number;
  largeFont?: number;
  largestFont?: number;
  darkGradientColor: string;
  lightGradientColor: string;
}

interface DrawPicInfo {
  img: HTMLImageElement | null;
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
}

export default defineComponent({
  name: 'draw-avatar',
  setup() {
    onMounted(() => {
      initCanvas()
    })

    const subFontTypes: string[] = ['multiple', 'hole', 'sub', 'circle']
    const currentSubStyle = ref('style1')
    const curSubFontType = ref<'multiple' | 'hole' | 'sub' | 'circle'>('multiple')
    let imgBase64 = ref('')
    
    const subStyleOptions: Record<string, SubStyleOption> = {
      style1: {
        largestFont: 20,
        largeFont: 20,
        fontSize: 11,
        smallFont: 7,
        darkGradientColor: 'rgb(231, 139, 31)',
        lightGradientColor: 'rgb(233, 198, 165)',
        fontColor: '#fff'
      },
      style2: {
        largestFont: 20,
        largeFont: 20,
        fontSize: 11,
        smallFont: 7,
        darkGradientColor: '#fff',
        lightGradientColor: '#fff',
        fontColor: '#555'
      },
      style3: {
        largestFont: 20,
        largeFont: 20,
        fontSize: 11,
        smallFont: 7,
        darkGradientColor: '#7367F0',
        lightGradientColor: '#CE9FFC',
        fontColor: '#fff'
      },
      style4: {
        largestFont: 20,
        largeFont: 20,
        fontSize: 11,
        smallFont: 7,
        darkGradientColor: '#28C76F',
        lightGradientColor: '#81FBB8',
        fontColor: '#fff'
      },
      style5: {
        largestFont: 20,
        largeFont: 20,
        fontSize: 11,
        smallFont: 7,
        darkGradientColor: '#0E5CAD',
        lightGradientColor: '#79F1A4',
        fontColor: '#fff'
      },
      style6: {
        largestFont: 20,
        largeFont: 20,
        fontSize: 11,
        smallFont: 7,
        darkGradientColor: '#B3315F',
        lightGradientColor: '#FFAA85',
        fontColor: '#fff'
      },
      style7: {
        largestFont: 20,
        largeFont: 20,
        fontSize: 11,
        smallFont: 7,
        darkGradientColor: '#F6416C',
        lightGradientColor: '#FFF6B7',
        fontColor: '#fff'
      },
      style8: {
        largestFont: 20,
        largeFont: 20,
        fontSize: 11,
        smallFont: 7,
        darkGradientColor: '#F072B6',
        lightGradientColor: '#FFF886',
        fontColor: '#fff'
      }
    }
    const canvas: any = ref(null)
    const ctx: any = ref(null)
    let picInfo: DrawPicInfo = reactive({
      img: null,
      sx: 0,
      sy: 0,
      sWidth: 0,
      sHeight: 0
    })
    const inputs = reactive({
      left: 'Style',
      right: 'small',
      single: 'S'
    })
    const state = reactive({
      originPic: ''
    })

    const fontTypeStyle = computed(() => {
      const { fontColor, darkGradientColor, lightGradientColor } = subStyleOptions[currentSubStyle.value]
      return `
        --bg-light-color: ${lightGradientColor};
        --bg-dark-color: ${darkGradientColor};
        color: ${fontColor};
      `
    })

    /**
     * 下载图片至本地
     */
    const downloadImage = () => {
      const src = (<HTMLCanvasElement> document.querySelector('#pic-canvas')).toDataURL()
      const a = document.createElement('a')
      a.href = src
      a.download = 'test.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    /**
     * 选择图片
     */
    const chooseImage = (e: HTMLInputEvent) => {
      const files: FileList = e.target.files as FileList
      if (!files.length) return
      console.log('- choose file', files)
      const reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.addEventListener('load', (e: any) => {
        state.originPic = e.target.result
        generatePic()
      })
    }

    /**
     * 初始化 canvas 容器
     */
    const initCanvas = () => {
      const _canvas: HTMLCanvasElement = <HTMLCanvasElement> document.querySelector('#pic-canvas')
      const _ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D> _canvas.getContext('2d')
      _ctx.fillStyle = 'transparent'
      _ctx.fillRect(0, 0, _canvas.width, _canvas.height)

      canvas.value = _canvas
      ctx.value = _ctx
    }

    /**
     * 绘制头像
     */
    const generatePic = () => {

      const img = new Image()
      img.src = state.originPic
      // img.className = 'pic-img'
      img.style.objectFit = 'cover'
      img.onload = () => {
        let sx = 0
        let sy = 0
        let size = 600
        // let size = img.width > img.height ? img.height : img.width
        // size = size >= 400 ? 400 : size
        canvas.value.width = size
        canvas.value.height = size

        let sWidth = 0 
        let sHeight = 0 

        if (img.width > img.height) {
          // 计算图片绘制宽高
          sHeight = size
          sWidth = sHeight / img.height * img.width
          
          // 计算图片偏移
          sx = (size - sWidth) / 2
          sy = (sHeight - size) / 2

        } else {
          // 计算图片绘制宽高
          sWidth = size
          sHeight = sWidth / img.width * img.height
          
          // 计算图片偏移
          sy = (size - sHeight) / 2
          sx = (sWidth - size) / 2
        }

        picInfo = {
          img,
          sx,
          sy,
          sWidth,
          sHeight
        }
        generateSubMain()
      }
    }

    /**
     * 生成挂件背景
     */
    const generateSubStyle = (key: string, subCanvas: HTMLCanvasElement, subCtx: CanvasRenderingContext2D) => {
      const oWidth = subCanvas.width
      const oHeight = subCanvas.height
      const maskHeight = oHeight / 10 * 3
      const scale = oWidth / 100

      let type: any = 'arc'
      if (curSubFontType.value === 'sub') {
        type = 'square'
      } else if (curSubFontType.value === 'circle') {
        type = 'circle'
      }
      const configs: Record<string, { width: number, height: number, dx: number, dy: number, radius: number, gap: number }> = {
        arc: {
          width: oWidth,
          height: maskHeight,
          dx: 0, // oWidth - oWidth
          dy: oHeight - maskHeight,
          radius: scale * 5,
          gap: scale * 3
        },
        square: {
          width: maskHeight,
          height: maskHeight,
          dx: oWidth - maskHeight,
          dy: oHeight - maskHeight,
          radius: oWidth / 100 * 5,
          gap: scale * 3
        },
        circle: {
          width: maskHeight,
          height: maskHeight,
          dx: oWidth - maskHeight,
          dy: oHeight - maskHeight,
          radius: maskHeight,
          gap: scale * 3
        }
      }

      const { dx, dy } = configs[type]

      const mask = new Mask({ type, ...subStyleOptions[key] }, configs[type])
      return new Promise(resolve => {
        mask.draw((canvas: HTMLCanvasElement) => {
          const img = new Image()
          img.src = canvas.toDataURL()
          img.onload = () => {
            subCtx.drawImage(img, 0, 0, oWidth, oHeight, dx, dy, oWidth, oHeight)
            resolve(img)
          }
        })
      })
    }

    /**
     * 生成挂件文字
     */
    const generateSubFont = (fontType: string = curSubFontType.value, otype: string = currentSubStyle.value, subCanvas: HTMLCanvasElement, subCtx: CanvasRenderingContext2D) => {
      const { largestFont: largestSize, largeFont: largeSize, fontSize: mediumSize, smallFont: smallSize, fontColor: color } = subStyleOptions[otype]
      const info = {
        type: fontType,
        largestSize,
        largeSize,
        mediumSize,
        smallSize,
        color,
        text: inputs.left,
        subtitle: inputs.right,
        marking: inputs.single
      }

      const oWidth = subCanvas.width
      const oHeight = subCanvas.height
      const maskHeight = oHeight / 10 * 3
      const scale = oWidth / 100

      let type = 'arc'
      if (curSubFontType.value === 'sub') {
        type = 'square'
      } else if (curSubFontType.value === 'circle') {
        type = 'circle'
      }

      const configs: Record<string, { width: number, height: number, dx: number, dy: number, scale: number }> = {
        arc: {
          width: oWidth,
          height: maskHeight,
          dx: 0, // oWidth - oWidth
          dy: oHeight - maskHeight,
          scale
        },
        square: {
          width: maskHeight - scale * 3,
          height: maskHeight - scale * 3,
          dx: oWidth - maskHeight + scale * 3,
          dy: oHeight - maskHeight + scale * 3,
          scale
        },
        circle: {
          width: maskHeight - scale * 3,
          height: maskHeight - scale * 3,
          dx: oWidth - maskHeight + scale * 3,
          dy: oHeight - maskHeight + scale * 3,
          scale
        }
      }

      const { dx, dy } = configs[type]

      const mask = new Font(info, configs[type])
      return new Promise(resolve => {
        mask.draw((canvas: HTMLCanvasElement) => {
          const img = new Image()
          img.src = canvas.toDataURL()
          img.onload = () => {
            subCtx.drawImage(img, 0, 0, oWidth, oHeight, dx, dy, oWidth, oHeight)
            resolve(img)
          }
        })
      })
    }

    /**
     * 
     */
    const drawPic = () => {
      const { img, sx, sy, sWidth, sHeight } = picInfo
      if (!img) return
      ctx.value.save()
      ctx.value.drawImage(img, sx, sy, sWidth, sHeight)
      ctx.value.restore()
    }

    /**
     * 生成挂件
     */
    const generateSubMain = async () => {
      const cWidth = canvas.value.width
      const cHeight = canvas.value.height
      ctx.value.clearRect(0, 0, cWidth, cHeight)
      drawPic()

      const subCanvas: HTMLCanvasElement = <HTMLCanvasElement> document.createElement('canvas')
      const subCtx: CanvasRenderingContext2D = <CanvasRenderingContext2D> subCanvas.getContext('2d')
      subCanvas.width = cWidth
      subCanvas.height = cHeight

      subCtx.fillStyle = 'transparent'
      subCtx.fillRect(0, 0, subCanvas.width, subCanvas.height)

      await generateSubStyle(currentSubStyle.value, subCanvas, subCtx)
      await generateSubFont(curSubFontType.value, currentSubStyle.value, subCanvas, subCtx)

      const img = new Image()
      img.src = subCanvas.toDataURL()
      img.onload = () => {
        ctx.value.drawImage(img, 0, 0, subCanvas.width, subCanvas.height)

        imgBase64.value = canvas.value.toDataURL()
      }
    }

    const inputBlur = () => {
      generateSubMain()
    }

    /**
     * 切换背景主题
     */
    const chooseTheme = (type: string) => {
      console.log('- chooseTheme', type)
      currentSubStyle.value = type
      generateSubMain()
    }

    const chooseSubFontType = (type: 'multiple' | 'hole' | 'sub') => {
      curSubFontType.value = type
      // generateSubFont(type)
      generateSubMain()
    }

    /**
     * 主题item动态样式
     */
    const themeStyle = (type: string = currentSubStyle.value) => {
      const item: SubStyleOption = subStyleOptions[type]

      return `background-image: linear-gradient(to bottom, ${item.lightGradientColor}, ${item.darkGradientColor});`
    }
    return {
      imgBase64,
      state,
      inputs,
      curSubFontType,
      subFontTypes,
      subStyleOptions,

      fontTypeStyle,

      chooseImage,
      initCanvas,
      downloadImage,
      inputBlur,
      chooseTheme,
      chooseSubFontType,
      themeStyle
    }
  },
})
</script>

<style lang="scss">
  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .avatar-box {
    padding-top: 30px;
    display: grid;
    grid-template-rows: auto 300px;
    height: 100vh;
    overflow: auto;
    box-sizing: border-box;
    background-color: #f4f4f4;
    
    .generate-title {
      margin: 0;
      padding: 0;
      font-size: 24px;
      color: #555;
    }
    .thin-line {
      margin: 24px auto;
      width: 200px;
      height: 1px;
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(221, 221, 221, .75) 50%, rgba(0, 0, 0, 0) 100%);
    }
    
    .avatar-pic {
      position: relative;
      margin: 60px auto 0;
      width: 100px;
      height: 100px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px dashed #ccc;
    }
    .user-svg-icon {
      padding: 30px;
      width: 100%;
      height: 100%;
      fill: #ccc;
      box-sizing: border-box;
    }
    .pic-img {
      width: 100%;
      height: 100px;
      object-fit: cover;
      border-radius: 10px;
    }
    .pic-canvas {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .avatar-input {
      width: 0;
      height: 0;
      overflow: hidden;
      display: none;
    }
    .btn-change {
      margin-top: 24px;
      font-size: 12px;
      color: #fff;
      background-color: #6dc781;
    }
    .input-box {
      margin-top: 24px;
    }
    .input-cnt {
      text-indent: 4px;
      width: 120px;
      height: 24px;
      border: 1px solid #ccc;
      border-radius: 10px;
      &::placeholder {
        color: #ccc;
      }
    }
    .theme-box {
      margin-top: 24px;
      display: grid;
      grid-template-columns: repeat(var(--var-cloumns), 40px);
      align-items: center;
      justify-content: center;
    }
    .theme-item {
      width: 24px;
      height: 24px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .35);
    }
    .font-type-box {
      display: grid;
      grid-template-columns: repeat(var(--font-type-sizes), auto);
      align-items: center;
      justify-content: center;
    }
    .font-type-item {
      width: 80px;
      height: 30px;
      // border: 1px solid #ccc;
      user-select: none;
      box-shadow: 0 0px 2px 0 rgba(0, 0, 0, .35);
      background-image: linear-gradient(to bottom, var(--bg-light-color), var(--bg-dark-color));
      .sub {
        display: none;
      }
      &.hole {
        margin-left: 20px;
        display: grid;
        align-items: center;
        justify-content: center;
        .left {
          font: bolder italic 16px/16px sans-serif;
        }
        .right {
          display: none;
        }
      }
      &.multiple {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: center;
        box-sizing: border-box;
        .left {
          font: bolder italic 14px/14px sans-serif;
        }
        .right {
          font: 400 italic 10px/10px sans-serif;
          transform: translateY(2px);
        }
      }
      &.sub {
        margin-left: 20px;
        width: 30px;
        display: grid;
        align-items: center;
        justify-content: flex-end;
        grid-template-columns: auto 4px 26px;
        background-image: none;
        box-sizing: border-box;
        box-shadow: none;
        // border: 1px dashed #ccc;
        overflow: hidden;
        // background-color: #f4f4f4;
        .left, .right {
          visibility: hidden;
        }
        .sub {
          display: grid;
          align-items: center;
          font: bolder italic 14px/14px sans-serif;
          height: 26px;
          background-color: var(--bg-dark-color);
          border-radius: 5px;
          box-sizing: border-box;
          box-shadow: 0 0px 3px 0 rgba(0, 0, 0, .35);
        }
      }
      &.circle {
        margin-left: 10px;
        width: 30px;
        display: grid;
        align-items: center;
        justify-content: flex-end;
        grid-template-columns: auto 4px 26px;
        background-image: none;
        box-sizing: border-box;
        box-shadow: none;
        // border: 1px dashed #ccc;
        overflow: hidden;
        .left, .right {
          visibility: hidden;
        }
        .sub {
          display: grid;
          align-items: center;
          font: bolder italic 14px/14px sans-serif;
          height: 26px;
          background-color: var(--bg-dark-color);
          border-radius: 100%;
          box-sizing: border-box;
          box-shadow: 0 0px 3px 0 rgba(0, 0, 0, .35);
        }
      }
    }
    .finish-img {
      margin: 0 auto;
      width: 200px;
      height: 200px;
      >img {
        width: 100%;
        height: 100%;
        -webkit-touch-callout: auto;
        -webkit-user-select: auto;
        -khtml-user-select: auto;
        -moz-user-select: auto;
        -ms-user-select: auto;
        user-select: auto;
      }
      .save-tip {
        font-size: 14px;
        color: #ccc;
      }
    }
  }
  .a-btn {
    border: none;
  }
</style>