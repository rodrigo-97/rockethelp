import { yupResolver } from '@hookform/resolvers/yup'
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { FormControl, Heading, Icon, Stack, useTheme, useToast, VStack, WarningOutlineIcon } from 'native-base'
import { Envelope, Key } from 'phosphor-react-native'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import * as Yup from 'yup'
import Logo from '../assets/logo_primary.svg'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function SignIn() {
  const { colors } = useTheme()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  const schema = Yup
    .object()
    .shape({
      email: Yup
        .string()
        .required("E-mail obrigatório")
        .typeError("O e-mail precisa ser uma String")
        .email("E-mail inválido"),
      password: Yup
        .string()
        .typeError("A senha precisa ser uma String")
        .required("Senha obrigatória")
        .min(8, "A senha precisa ter no mínimo 8 caracteres")
    })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<{ email: string, password: string }>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(schema)
  })

  function handleSignin({ email, password }) {
    setIsLoading(true)
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        if (err.code === "auth/invalid-email") {
          return toast.show({
            description: 'E-mail inválido',
            backgroundColor: 'red.700',
            placement: 'top',
          })
        }

        if (err.code === "auth/user-not-found") {
          return toast.show({
            description: 'E-mail ou senha inválid',
            backgroundColor: 'red.700',
            placement: 'top',
          })
        }

        if (err.code === "auth/wrong-password") {
          return toast.show({
            description: 'E-mail ou senha inválida',
            backgroundColor: 'red.700',
            placement: 'top',
          })
        }

        setIsLoading(false)

        return toast.show({
          description: 'Erro ao entrar no App',
          backgroundColor: 'red.700',
          placement: 'top',
        })
      })
  }

  function handleCreateAccount() {
    navigation.navigate('createAccount')
  }

  return (
    <VStack flex={1} alignItems='center' bg="gray.600" px={8} pt={10} safeArea>
      <Logo />
      <Heading color="gray.100" fontSize={'xl'} mt={10} mb={6}>
        Acesse sua Conta
      </Heading>

      <Controller
        control={control}
        name='email'
        render={({ field: { onChange } }) => {
          return (
            <FormControl isInvalid={!!errors.email?.message} mb={4}>
              <Input
                onChangeText={onChange}
                placeholder="E-mail"
                hasError={!!errors.email}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
              />

              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors.email?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          )
        }}
      />

      <Controller
        control={control}
        name='password'
        render={({ field: { onChange } }) => {
          return (
            <FormControl isInvalid={!!errors.password?.message} mb={8}>
              <Stack>
                <Input
                  placeholder="Senha"
                  hasError={!!errors.password}
                  secureTextEntry
                  InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                  onChangeText={onChange}
                />
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                  {errors.password?.message}
                </FormControl.ErrorMessage>
              </Stack>
            </FormControl>
          )
        }}
      />

      <Button
        mb={2}
        title='Entrar'
        w="full"
        onPress={handleSubmit(handleSignin)}
        isLoading={isLoading}
        isLoadingText="Entrando"
      />

      <Button
        mb={2}
        bg='primary.700'
        title='Criar Conta'
        w="full"
        onPress={handleCreateAccount}
        _pressed={{
          bg: 'primary.500'
        }}
      />
    </VStack>
  )
}