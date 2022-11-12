import React, { ReactElement, useEffect, useState } from 'react'
import { Dimensions, LayoutChangeEvent, View } from 'react-native'
import Canvas from 'react-native-canvas'
import tw from '../../styles/tailwind'
import { isAndroid } from '../../utils/system'

const trickShift = { x: 1000, y: 1000 }
let cachedScale = 0

export type ShadowType = {
  inset?: boolean
  color: string
  opacity?: number
  blur: number
  offsetX?: number
  offsetY?: number
}

type ShadowProps = ComponentProps & {
  shadow: ShadowType
}
export const Shadow = ({ shadow, children, style }: ShadowProps): ReactElement => {
  const [scale] = useState(() => cachedScale || Dimensions.get('window').scale)
  const [dimensions, setDimensions] = useState({
    width: style?.width ? parseInt(style.width, 10) : 0,
    height: style?.height ? parseInt(style.height, 10) : 0,
  })

  if (!cachedScale) cachedScale = scale

  const [redraw, setRedraw] = useState(true)
  const [canvasDrawn, setCanvasDrawn] = useState(false)
  const showCanvas = (isAndroid() || shadow.inset) && (shadow.blur || shadow.offsetX || shadow.offsetY)
  const nativeShadow
    = !showCanvas && !canvasDrawn
      ? isAndroid()
        ? { elevation: shadow.blur }
        : {
          shadowColor: shadow.color,
          shadowOffset: {
            width: shadow.offsetX || 0,
            height: shadow.offsetY || 0,
          },
          shadowOpacity: shadow.opacity,
          shadowRadius: shadow.blur,
        }
      : {}

  const canvasStyle = {
    width: Math.round(dimensions.width + (shadow.blur || 0) * 2),
    height: Math.round(dimensions.height + (shadow.blur || 0) * 2),
    marginLeft: -(shadow.blur || 0) + (shadow.offsetX || 0),
    marginTop: -(shadow.blur || 0) + (shadow.offsetY || 0),
  }

  useEffect(() => {
    setRedraw(true)
  }, [shadow])

  const onLayout = (event: LayoutChangeEvent) => {
    setDimensions(event.nativeEvent.layout)
    setRedraw(true)
  }

  const drawShadow = (canvas: Canvas) => {
    if (!redraw || !canvas) return

    canvas.width = canvasStyle.width
    canvas.height = canvasStyle.height
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = shadow.opacity || 1
    ctx.shadowBlur = shadow.blur * scale
    ctx.shadowColor = shadow.color || 'black'
    ctx.strokeStyle = ctx.shadowColor
    ctx.fillStyle = ctx.shadowColor
    if (shadow.inset) ctx.lineWidth = Math.max(shadow.offsetX || 0, shadow.offsetY || 0)

    if (shadow.inset) {
      ctx.shadowOffsetX = trickShift.x * scale
      ctx.shadowOffsetY = (trickShift.y - ctx.lineWidth / 2) * scale
      ctx.strokeRect(shadow.blur - trickShift.x, shadow.blur - trickShift.y, dimensions.width, dimensions.height)
    } else {
      ctx.shadowOffsetX = trickShift.x * scale
      ctx.shadowOffsetY = trickShift.y * scale
      if (style?.borderTopLeftRadius > 999) {
        ctx.beginPath()
        ctx.arc(
          shadow.blur - trickShift.x + dimensions.width / 2,
          shadow.blur - trickShift.y + dimensions.height / 2,
          dimensions.width / 2,
          0,
          2 * Math.PI,
          false,
        )
        ctx.fill()
      } else {
        ctx.fillRect(shadow.blur - trickShift.x, shadow.blur - trickShift.y, dimensions.width, dimensions.height)
      }
    }
    setRedraw(false)
    setCanvasDrawn(true)
  }

  return (
    <View onLayout={onLayout} style={[style, nativeShadow]}>
      {showCanvas ? <Canvas ref={drawShadow} style={[tw`absolute`, canvasStyle]} /> : null}
      {children}
    </View>
  )
}
