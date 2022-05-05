import React, { ReactElement, useState } from 'react'
import { Dimensions, LayoutChangeEvent, View } from 'react-native'
import Canvas from 'react-native-canvas'
import tw from '../../styles/tailwind'

const trickShift = { x: 1000, y: 1000 }

export type ShadowType = {
  inset?: boolean,
  color: string,
  opacity?: number,
  blur: number,
  offsetX?: number,
  offsetY?: number,
}

type ShadowProps = ComponentProps & {
  shadow: ShadowType
}
export const Shadow = ({ shadow, children, style }: ShadowProps): ReactElement => {
  const [scale] = useState(Dimensions.get('window').scale)
  const [dimensions, setDimensions] = useState({
    width: style?.width ? parseInt(style.width, 10) : 0,
    height: style?.height ? parseInt(style.height, 10) : 0,
  })

  const [redraw, setRedraw] = useState(true)

  const canvasStyle = {
    width: Math.round(dimensions.width + (shadow.blur || 0) * 2),
    height: Math.round(dimensions.height + (shadow.blur || 0) * 2),
    marginLeft: -(shadow.blur || 0) + (shadow.offsetX || 0),
    marginTop: -(shadow.blur || 0) + (shadow.offsetY || 0),
  }

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
    ctx.globalAlpha = shadow.opacity || 1
    ctx.shadowBlur = shadow.blur * scale
    ctx.shadowColor = shadow.color || 'black'
    ctx.strokeStyle = ctx.shadowColor
    ctx.fillStyle = ctx.shadowColor
    if (shadow.inset) ctx.lineWidth = Math.max(shadow.offsetX || 0, shadow.offsetY || 0)

    if (shadow.inset) {
      ctx.shadowOffsetX = (trickShift.x) * scale
      ctx.shadowOffsetY = (trickShift.y - ctx.lineWidth / 2) * scale
      ctx.strokeRect(
        shadow.blur - trickShift.x,
        shadow.blur - trickShift.y,
        dimensions.width, dimensions.height
      )
    } else {
      ctx.shadowOffsetX = trickShift.x * scale
      ctx.shadowOffsetY = trickShift.y * scale
      ctx.fillRect(
        shadow.blur - trickShift.x,
        shadow.blur - trickShift.y,
        dimensions.width, dimensions.height
      )
    }
    setRedraw(false)
  }

  return <View onLayout={onLayout} style={style}>
    {shadow.blur || shadow.offsetX || shadow.offsetY
      ? <Canvas ref={drawShadow} style={[tw`absolute`, canvasStyle]}/>
      : null
    }
    {children}
  </View>
}