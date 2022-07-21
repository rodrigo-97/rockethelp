import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { NavigationContainer } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { If } from '../components/If'
import { Loading } from '../components/Loading'
import { AppRoutes, AuthRoutes } from './app.routes'

export function Routes() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User>()

  useEffect(() => {
    const controller = new AbortController()
    auth().onAuthStateChanged(response => {
      setUser(response)
      setIsLoading(false)
    })

    return controller.abort()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <NavigationContainer>
      <If
        condition={!!user}
        thenComponent={<AppRoutes />}
        elseComponent={<AuthRoutes />}
      />
    </NavigationContainer>
  )
}