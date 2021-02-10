import { SubStyleOptions, RectRadius } from '../../types/canvas'
export default class Mark {
  private options: SubStyleOptions;
  private config: any;
  constructor(options: SubStyleOptions, config: any) {
    this.options = options
    this.config = config
  }

  draw(callback: Function) {
    const { width, height, radius, gap } = this.config
    const { type = 'arc', lightGradientColor, darkGradientColor } = this.options
    const canvas = <HTMLCanvasElement> document.createElement('canvas')
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    const funcs: Record<string, Function> = {
      arc: () => {
        const grd = ctx.createLinearGradient(width / 2, 0, width / 2, height)
        grd.addColorStop(0, lightGradientColor)
        grd.addColorStop(1, darkGradientColor)
        ctx.fillStyle = grd

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.quadraticCurveTo(width / 2, height / 3 * 2, width, 0)
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()
        ctx.fill()
      },
      square: () => {
        this.roundRect(ctx, 0, 0, width, height, { tl: radius, tr: 0, bl: 0, br: 0 }, '#fff')
        this.roundRect(ctx, gap, gap, width - gap, height - gap, { tl: radius, tr: radius, bl: radius, br: 0 }, darkGradientColor)
      },
      circle: () => {
        ctx.beginPath()
        ctx.fillStyle = '#fff'
        ctx.fillRect(width / 2 + gap / 2, height / 2 + gap / 2, width, height)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = '#fff'
        ctx.arc(width / 2 + gap / 2, height / 2 + gap / 2, width / 2, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = darkGradientColor
        ctx.arc(width / 2 + gap / 2, height / 2 + gap / 2, width / 2 - gap, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
      }
    }
    funcs[type]?.()
    callback(canvas)
  }

  roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: RectRadius | number, fill: string) {
    if (!ctx) return

    if (typeof radius === 'number') {
      radius = {
        tl: radius,
        tr: radius,
        bl: radius,
        br: radius
      }
    }

    ctx.beginPath()
    ctx.moveTo(x + radius.tl, y)
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
  }
}