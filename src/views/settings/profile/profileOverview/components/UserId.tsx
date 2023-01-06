import React from 'react'
import { Text } from '../../../../../components'
import tw from '../../../../../styles/tailwind'

export const UserId = ({ id }: { id: string }) => <Text style={tw`tooltip`}>Peach{id.slice(0, 8)}</Text>
