import { SubFontInfo } from '../../types/canvas'
import { checkVersionByUA } from '../../assets/utils'
const isAndroid = checkVersionByUA(navigator.userAgent).android
export default class Font {
  private info: SubFontInfo;
  private config: any;
  constructor(info: SubFontInfo, config: any) {
    this.info = info
    this.config = config
  }

  draw(callback: Function) {
    const { width, height, scale } = this.config
    const { type } = this.info
    const canvas = <HTMLCanvasElement> document.createElement('canvas')
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    const funcs: Record<string, Function> = {
      multiple: (info: SubFontInfo) => {
        const { mediumSize, smallSize, color, text, subtitle } = info
        ctx.save()
        ctx.moveTo(0, 0)
        ctx.fillStyle = color
        ctx.font = `bold italic ${scale * <number> mediumSize}px/${scale * <number>  mediumSize}px sans-serif`
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, canvas.width * 0.05, canvas.height / 3 * 2, canvas.width * 0.9)
        ctx.restore()

        ctx.save()
        ctx.moveTo(0, 0)
        ctx.fillStyle = color
        ctx.font = `400 italic ${scale * <number>  smallSize}px/${scale * <number>  smallSize}px sans-serif`
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        ctx.fillText(subtitle, canvas.width * 0.95, canvas.height / 10 * 7, canvas.width * 0.95)
        ctx.restore()
      },
      hole: (info: SubFontInfo) => {
        const { largeSize, color, text } = info
        ctx.save()
        ctx.moveTo(0, 0)
        ctx.fillStyle = color
        ctx.font = `bolder italic ${scale * <number>  largeSize}px/${scale * <number>  largeSize}px Microsoft YaHei,Helvetica Neue,Hiragino Sans GB,sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, canvas.width / 2, canvas.height / 3 * 2, canvas.width * 0.9)
        ctx.restore()
      },
      sub: (info: SubFontInfo) => {
        const { largestSize, color, marking } = info
        ctx.save()
        ctx.moveTo(0, 0)
        ctx.fillStyle = color
        ctx.font = `bolder normal ${scale * <number>  largestSize}px/${scale * <number>  largestSize}px Microsoft YaHei,Helvetica Neue,Hiragino Sans GB,sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(marking, canvas.width / 2, canvas.height / 2 + scale * Number(isAndroid), canvas.width)
        ctx.restore()
      },
      circle: (info: SubFontInfo) => {
        const { largestSize, color, marking } = info
        ctx.save()
        ctx.moveTo(0, 0)
        ctx.fillStyle = color
        ctx.font = `bolder normal ${scale * <number>  largestSize}px/${scale * <number>  largestSize}px Microsoft YaHei,Helvetica Neue,Hiragino Sans GB,sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(marking, canvas.width / 2, canvas.height / 2 + scale * Number(isAndroid), canvas.width)
        ctx.restore()
      }
    }
    funcs[type]?.(this.info)

    callback(canvas)
  }
}