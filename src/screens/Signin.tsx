import { Box, Heading, Icon, Modal, useTheme, VStack } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'
import { useState } from 'react'
import { Alert } from 'react-native'
import Logo from '../assets/logo_primary.svg'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import auth from '@react-native-firebase/auth'

export function SignIn() {
  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [createAccountEmail, setCreateAccountEmail] = useState('')
  const [createAccountPassword, setCreateAccountPassword] = useState('')

  const toggleModal = () => setIsModalOpen(p => !p)

  function handleSignin() {
    if (!email || !password) {
      return Alert.alert("Entrar", "Credenciais inválidas")
    }

    setIsLoading(true)
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        if (err.code === "auth/invalid-email") {
          return Alert.alert("Entrar", 'E-mail inválido')
        }

        if (err.code === "auth/user-not-found") {
          return Alert.alert("Entrar", 'E-mail ou senha inválida')
        }

        if (err.code === "auth/wrong-password") {
          return Alert.alert("Entrar", 'E-mail ou senha inválida')
        }

        setIsLoading(false)

        return Alert.alert("Entrar", "Erro ao entrar no App")
      })
  }

  function handleCreateAccount() {
    if (!createAccountEmail || !createAccountPassword) {
      return Alert.alert("Criar Conta", "Credenciais inválidas")
    }

    setIsCreatingAccount(true)
    toggleModal()
    auth()
      .createUserWithEmailAndPassword(createAccountEmail, createAccountPassword)
      .catch((err) => {
        console.log(err)
        Alert.alert("Criar Conta", "Erro ao criar uma nova conta")
        setIsCreatingAccount(false)
      })
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
      <Button
        mb={2}
        title='Entrar'
        w="full"
        onPress={handleSignin}
        isLoading={isLoading}
        isLoadingText="Entrando"
      />
      <Button
        title='Criar Conta'
        w="full"
        onPress={toggleModal}
        isLoading={isCreatingAccount}
        isLoadingText='Criando Conta'
        bg="primary.700"
        _pressed={{
          bg: 'primary.500'
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        size='xl'
        bg='gray.700'
        closeOnOverlayClick={false}
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Body bg='gray.600' _text={{ color: 'white' }}>
            <Heading color='white'>Criar nova conta</Heading>

            <Box my={3}>
              <Input
                mb={2}
                placeholder='Digite seu e-mail'
                onChangeText={setCreateAccountEmail}
              />
              <Input
                placeholder='Digite sua senha'
                onChangeText={setCreateAccountPassword}
                secureTextEntry
              />
            </Box>

            <Button
              title='Enviar'
              onPress={handleCreateAccount}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </VStack>
  )
}