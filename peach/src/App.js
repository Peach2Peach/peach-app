import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions
} from 'react-native'

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  }
})

const App = () => <SafeAreaView>
  <Text style={styles.sectionTitle}>
    Peach of Cake 🍑
  </Text>
</SafeAreaView>

export default App
