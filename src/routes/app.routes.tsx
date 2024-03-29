import { Details } from '../screens/Details'
import { Home } from '../screens/Home'
import { Register } from '../screens/Register'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SignIn } from '../screens/Signin'
import { CreateAccount } from '../screens/CreateAccount'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="details" component={Details} />
      <Screen name="register" component={Register} />
    </Navigator>
  )
}

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="login" component={SignIn} />
      <Screen name="createAccount" component={CreateAccount} />
    </Navigator>
  )
}