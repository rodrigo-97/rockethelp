import { Heading, Icon, useTheme, VStack } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'
import { useState } from 'react'
import Logo from '../assets/logo_primary.svg'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function SignIn() {
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSignin() {
    console.log({ email, password })
  }

  return (
    <VStack flex={1} alignItems='center' bg="gray.600" px={8} pt={10} safeArea>

      <Logo />
      <Heading color="gray.100" fontSize={'xl'} mt={10} mb={6}>
        Acesse sua Conta
      </Heading>

      <Input
        mb={2}
        placeholder="E-mail"
        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
        onChangeText={setEmail}
      />
      <Input
        mb={4}
        placeholder="Senha"
        secureTextEntry
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        onChangeText={setPassword}
      />
      <Button title='Entrar' w="full" onPress={handleSignin} />
    </VStack>
  )
}